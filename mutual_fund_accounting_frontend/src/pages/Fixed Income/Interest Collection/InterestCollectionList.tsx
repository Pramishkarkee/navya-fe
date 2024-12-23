import { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  MenuItem,
  Typography,
  useTheme,
  Select,
  Button,
} from "@mui/material";

import TypographyLabel from "components/InputLabel/TypographyLabel";
import ReceiptTable from "components/Table/TanstackTable";
import { useGetInterestCollectionData } from "services/InterestCollection/InterestCollection";
import { PaginationState } from "@tanstack/react-table";
import { Empty } from "antd";
import DateFormatter from "utils/DateFormatter";
import SearchText from "components/Button/Search";
import DateField from "components/DateFilter/DateField";
import dayjs from "dayjs";
import RoundedButton from "components/Button/Button";
import debounce from "utils/Debounce";
import {
  InterestCollectionTableHeaders,
  InterestCollectionTableList,
} from "constants/Interest Collection/InterestCollectionTableHeaderList";

const validationSchema = yup.object().shape({
  schema_name: yup.string().required("Scheme Name is required"),
  interest_type: yup.string().required("Interest Type is required"),
  branch_name: yup.string().required("Branch Name is required").optional(),
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be positive")
    .optional(),
  received_amount: yup
    .number()
    .required("Received Amount is required")
    .positive("Received Amount must be positive")
    .optional(),
  startDate: yup.object().required(),
  endDate: yup.object().required(),
  id: yup.number(),
});

const InterestCollectionList = () => {
  const theme = useTheme();
  const [id, setId] = useState<string>("");
  const [displayData, setDisplayData] = useState<
    InterestCollectionTableHeaders[]
  >([]);
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);
  const [errorMsgs, setErrorMsgs] = useState<string>("");

  const [interestType, setInterestType] = useState<string>("fix_deposit");

  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();

  const { data: InterestCollectionData, refetch } =
    useGetInterestCollectionData(
      searchData?.from_date,
      searchData?.to_date,
      interestType,
      pagination.pageIndex + 1,
      id
    );

  const totalPageCount = Math.ceil(
    InterestCollectionData?.responseData.count / 10
  );

  const handleChangeInterest = (e: { target: { value: any } }) => {
    const newSchemafield = e.target.value as string;
    setInterestType(newSchemafield);
  };

  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
    },
  });

  const handleAddEntry = (data) => {};

  const handleLoad = (data) => {
    if (data?.startDate && data?.endDate) {
      const fromDate = new Date(data?.startDate);
      const toDate = new Date(data?.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatter.format(toDate.toISOString());

      if (formattedFromDate && formattedToDate) {
        setSearchData({
          from_date: formattedFromDate,
          to_date: formattedToDate,
        });
      }
      setLoadClicked(true);
    } else {
      setErrorMsgs("Both start and end dates must be selected.");
      setSnackbarErrorOpen(true);
    }
  };

  useEffect(() => {
    if (id) {
      setDisplayData(
        InterestCollectionData
          ? InterestCollectionData?.responseData?.results
          : []
      );
      setDisplayData(InterestCollectionData?.responseData?.results ?? []);
    } else {
      setDisplayData(InterestCollectionData ?? []);
      setDisplayData(InterestCollectionData?.responseData?.results ?? []);
    }
  }, [id, InterestCollectionData]);

  useEffect(() => {
    if (InterestCollectionData?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (InterestCollectionData?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [InterestCollectionData]);

  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
      setValue("id", value);
    }, 500),
    [setValue]
  );

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(handleAddEntry)}
        sx={{ width: "50px", mt: 2 }}
      >
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "19px",
            color: "#212121",
            textAlign: "center",
            width: "max-content",
            borderBottom: `1px solid ${theme.palette.secondary.main}`,
          }}
        >
          Interest Details
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit(handleLoad)}>
        <Box sx={{ width: "80%", my: 2, mb: 4 }}>
          <TypographyLabel title={"Interest Type"} />
          <Controller
            name="interest_type"
            control={control}
            defaultValue="fix_deposit"
            render={({ field }) => (
              <Select
                {...field}
                size="small"
                sx={{ width: "245px" }}
                onChange={handleChangeInterest}
                value={interestType}
              >
                <MenuItem value="fix_deposit">Fixed Deposit</MenuItem>
                <MenuItem value="debenture">Bond and Debenture</MenuItem>
              </Select>
            )}
          />
          <Typography variant="caption" color="error">
            {errors.interest_type?.message}
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(handleLoad)}
          sx={{ width: "100%", display: "flex", gap: 3, my: 2 }}
        >
          <SearchText
            title="Search"
            {...register("id")}
            onChange={(e) => debouncedSetId(e.target.value)}
            onClick={handleSubmit(handleLoad)}
          />
          <Box sx={{ mt: -2.5 }}>
            <DateField
              control={control}
              dateLabel1="Date (From)"
              dateLabel2="Date (To)"
            />
          </Box>
          {/* <Box sx={{ mt: 2.25 }}> */}
          <RoundedButton title1="Load" onClick1={handleSubmit(handleLoad)} />
          {/* </Box> */}
        </Box>

        {/* <Box sx={{ width: '50px', mt: 3 }}>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '19px',
              color: '#212121',
              textAlign: 'center',
              width: 'max-content',
              borderBottom: `1px solid ${theme.palette.secondary.main}`,
            }}
          >
            Pending Interests
          </Typography>
        </Box>

        <Box sx={{ width: '100%', display: 'flex', gap: 2, marginTop: 3, mb: 3 }}>
          <SearchText title="Search for Pending Interests" onClick={handleSearch} />
          <DateField dateLabel1="" />
        </Box> */}

        {InterestCollectionData?.responseData?.results?.length === 0 ? (
          <Box
            sx={{
              maxWidth: "1500px",
              width: { md: "110%", lg: "120%", xl: "125%" },
            }}
          >
            <ReceiptTable
              columns={InterestCollectionTableList}
              data={displayData}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                ml: { md: 5, lg: 20 },
                mt: 5,
              }}
            >
              <Empty
                imageStyle={{ height: 150, width: 150 }}
                description="No Data Available"
              />
              <Button
                sx={{
                  color: theme.palette.primary[1100],
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => refetch()}
              >
                Refresh
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              maxWidth: "1500px",
              width: { md: "110%", lg: "120%", xl: "125%" },
            }}
          >
            <ReceiptTable
              columns={InterestCollectionTableList}
              data={InterestCollectionData?.responseData.results ?? []}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
              pageCount={totalPageCount}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default InterestCollectionList;
