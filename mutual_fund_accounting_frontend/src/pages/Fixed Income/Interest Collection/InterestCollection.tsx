import React, { useEffect, useState, useCallback } from "react";
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
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Adjustment from "./Adjustment";
import { Empty } from "antd";
import DateFormatter from "utils/DateFormatter";
import SearchText from "components/Button/Search";
import DateField from "components/DateFilter/DateField";
import dayjs from "dayjs";
import RoundedButton from "components/Button/Button";
import debounce from "utils/Debounce";

const validationSchema = yup.object().shape({
  schema_name: yup.string().required("Scheme Name is required"),
  interest_type: yup.string().required("Interest Type is required"),
  // bank_name: yup.string().required("Bank Name is required"),
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

export interface InterestCollectionTableHeadersEntry {
  id: number;
  interest_name: string;
  deposit_amount: string;
  interest_rate: string;
  interest_paid_amount: string;
  interest_type: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  fix_deposit: number;
  debentures: string | number;
  bank_id: string;
  interval: string;
  maturity_date: string;
  accrued_interest: number;
}

const InterestCollection = () => {
  const theme = useTheme();
  const [id, setId] = useState<string>("");
  const [displayData, setDisplayData] =
    useState<InterestCollectionTableHeadersEntry>();
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);
  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [transactionSuccess, setTransactionSuccess] = useState<boolean>(false);

  const [interestType, setInterestType] = useState<string>("fix_deposit");
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [selectInterestCollection, setSelectInterestCollection] = useState({
    bank_id: "",
    intrest_paid_amount: "",
    id: null,
    interest_name: "",
  });

  const [searchData, setSearchData] = useState<{
    from_date: string;
    to_date: string;
  }>({
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
    setShowViewModal(false);
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
    // setId(data.id || "");
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
      setShowViewModal(false);
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
      setShowViewModal(false);
      setId(value);
      setValue("id", value);
    }, 500),
    [setValue]
  );

  const InterestCollectionList: ColumnDef<InterestCollectionTableHeadersEntry>[] =
    [
      {
        header: "ID",
        accessorKey: "id",
        cell: (data) => {
          return (
            <Typography
              sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
            >
              {data.row.original.id}
            </Typography>
          );
        },
      },

      {
        header: "Name",
        accessorKey: "interest_name",
        cell: (data) => {
          return (
            <Typography
              sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
            >
              {data.row.original.interest_name}
            </Typography>
          );
        },
      },
      {
        header: "Deposit Amount",
        accessorKey: "deposit_amount",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "400px",
                textAlign: "right",
                width: "60%",
              }}
            >
              {Number(data.row.original.deposit_amount).toLocaleString()}
            </Typography>
          );
        },
      },

      {
        header: "Interest Rate",
        accessorKey: "interest_rate",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "400px",
                textAlign: "left",
                width: "80%",
              }}
            >
              {data.row.original.interest_rate}
            </Typography>
          );
        },
      },

      {
        header: "Interest Accrued",
        accessorKey: "interest_paid_amount",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "400px",
                textAlign: "right",
                width: "60%",
              }}
            >
              {Number(data.row.original.interest_paid_amount).toLocaleString()}
            </Typography>
          );
        },
      },
      {
        header: "Interest Frequency",
        accessorKey: "interval",
        cell: (data) => {
          return (
            <Typography
              sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
            >
              {data.row.original.interval === "monthly"
                ? "Monthly"
                : data.row.original.interval === "quarterly"
                ? "Quarterly"
                : data.row.original.interval === "semi-annually"
                ? "Semi-Annually"
                : data.row.original.interval === "annually"
                ? "Annually"
                : "N/A"}
            </Typography>
          );
        },
      },
      {
        header: "Maturity Date",
        accessorKey: "maturity_date",
        cell: (data) => {
          return (
            <Typography
              sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
            >
              {data.row.original.maturity_date}
            </Typography>
          );
        },
      },

      {
        header: "Actions",
        accessorKey: "actions",
        cell: (data) => {
          const handleView = () => {
            if (
              selectInterestCollection.id === data.row.original.id &&
              showViewModal
            ) {
              setShowViewModal(false);
            } else {
              setSelectInterestCollection({
                bank_id: data.row.original.bank_id,
                // intrest_paid_amount: data.row.original.accured_intrest,
                intrest_paid_amount: data.row.original.interest_paid_amount,
                id: data.row.original.id,
                interest_name: data.row.original.interest_name,
              });
              setShowViewModal(true);
            }
          };
          return (
            <>
              {/* <Box> */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1.5,
                  textAlign: "center",
                  width: "10px",
                }}
              >
                <Box
                  onClick={() => handleView()}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    // justifyContent: "center",
                    // alighItems: "center",
                    textAlign: "center",
                    gap: 0.6,
                    "&:hover": {
                      textDecoration: "underline",
                      cursor: "pointer",
                    },
                  }}
                >
                  {selectInterestCollection.id === data.row.original.id &&
                  showViewModal ? (
                    <VisibilityOff
                      sx={{ fontSize: "14px", fontWeight: "400px", mt: "3px" }}
                    />
                  ) : (
                    <Visibility
                      sx={{
                        fontSize: "14px",
                        fontWeight: "400px",
                        color: theme.palette.primary.main,
                        mt: "3px",
                      }}
                    />
                  )}
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color:
                        selectInterestCollection.id === data.row.original.id &&
                        showViewModal
                          ? "inherit"
                          : theme.palette.primary.main,
                    }}
                  >
                    {selectInterestCollection.id === data.row.original.id &&
                    showViewModal
                      ? "Close"
                      : "Collect"}
                  </Typography>
                </Box>
              </Box>
              {/* </Box> */}
            </>
          );
        },
      },
    ];
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
        <Box sx={{ width: "80%", mt: 2 }}>
          <TypographyLabel title={"Scheme Name"} />
          <Controller
            name="schema_name"
            control={control}
            defaultValue="Navya Large Cap Fund"
            render={({ field }) => (
              <Select {...field} size="small">
                <MenuItem value="Navya Large Cap Fund">
                  NAVYA LARGE CAP FUND
                </MenuItem>
              </Select>
            )}
          />
          <Typography variant="caption" color="error">
            {errors.schema_name?.message}
          </Typography>
        </Box>
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

        {InterestCollectionData?.responseData?.results?.length === 0 ? (
          <Box
            sx={{
              maxWidth: "1500px",
              width: { md: "110%", lg: "120%", xl: "125%" },
            }}
          >
            <ReceiptTable
              columns={InterestCollectionList}
              data={displayData ?? []}
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
                {" "}
                Refresh{" "}
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
              columns={InterestCollectionList}
              data={InterestCollectionData?.responseData.results ?? []}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
              pageCount={totalPageCount}
            />
          </Box>
        )}

        {!showViewModal && InterestCollectionData?.responseData?.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <HeaderDesc title="Collection Details" />
            <Typography sx={{ color: theme.palette.grey[400], mt: 1 }}>
              Select one of the entries from the table
            </Typography>
          </Box>
        )}

        {selectInterestCollection && showViewModal && (
          <>
            {!transactionSuccess && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    lineHeight: "19px",
                    color: "#212121",
                    textAlign: "center",
                    width: "max-content",
                    borderBottom: `1px solid ${theme.palette.secondary.main}`,
                  }}
                >
                  {selectInterestCollection.interest_name}
                </Typography>
              </Box>
            )}
            <Adjustment
              id={selectInterestCollection.id}
              bank_id={selectInterestCollection.bank_id}
              amount={selectInterestCollection.intrest_paid_amount}
              onTransactionSuccess={() => setTransactionSuccess(true)}
            />
          </>
        )}
      </Box>
    </>
  );
};

export default InterestCollection;
