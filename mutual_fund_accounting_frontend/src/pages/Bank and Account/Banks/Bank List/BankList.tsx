import { Box, Typography, useTheme } from "@mui/material";
import SearchText from "components/Button/Search";
import ReceiptTable from "components/Table/TanstackTable";
import { BankListTableEntryHeader } from "constants/BankTableData/BankTable";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import {
  useGetBankListDate,
  // useGetgetBankListID,
  useGetgetBankListQuery,
} from "services/Bank and Branches/BankAndBranchesServices";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { PaginationState } from "@tanstack/react-table";
import DateField from "components/DateField/DateField";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import DateFormatter from "utils/DateFormatter";
import RoundedButton from "components/Button/Button";
import { Empty } from "antd";
import debounce from "utils/Debounce";

const DateFormatterUnit = {
  format: (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  },
};
const schema = yup
  .object({
    startDate: yup.object().required(),
    endDate: yup.object().required(),
    id: yup.number(),
  })
  .required();
export default function BankList() {
  const { control, handleSubmit, register, reset, setValue } = useForm({
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
    },
    resolver: yupResolver(schema),
  });

  const theme = useTheme();
  const [id, setId] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const [loadClicked, setLoadClicked] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [searchData, setSearchData] = useState({
    from_date: "",
    to_date: "",
  });

  const {
    data: bankListData,
    isSuccess: bankListDataSuccess,
    refetch: refetchBankList,
  } = useGetgetBankListQuery((pagination.pageIndex || 0) + 1);
  // const { data: bankListDataById, isSuccess: bankListDataByIdSuccess } =
  //   useGetgetBankListID(id);

  const { data: bankListDataByDate, isSuccess: bankListByDateSuccess } =
    useGetBankListDate(
      searchData?.from_date,
      searchData?.to_date,
      pagination.pageIndex + 1,
      id
    );

  const totalPageCount = Math.ceil(
    bankListDataByDate?.responseData?.count / 10
  );

  const handleLoad = (data) => {
    setId(data.id || "");
    if (data?.startDate && data?.endDate) {
      const fromDate = new Date(data?.startDate);
      const toDate = new Date(data?.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatterUnit.format(toDate.toISOString());

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
    if (bankListData?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (bankListData?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [bankListData, bankListDataSuccess]);

  useEffect(() => {
    if (id) {
      setDisplayData(
        bankListDataByDate ? bankListDataByDate?.responseData?.results : []
      );
    } else {
      setDisplayData(bankListDataByDate?.responseData?.results || []);
    }
  }, [bankListDataByDate, id]);

  useEffect(() => {
    refetchBankList();
    if (bankListByDateSuccess && loadClicked) {
      setDisplayData(bankListDataByDate?.responseData?.results ?? []);

      if (
        !bankListDataByDate?.responseData?.results ||
        bankListDataByDate?.responseData?.results.length === 0
      ) {
        setErrorMsgs("There is no Unit List Available for the given Date.");
        setSnackbarErrorOpen(true);
      }
    }
  }, [
    bankListByDateSuccess,
    loadClicked,
    bankListDataByDate,
    searchData,
    refetchBankList,
  ]);

  // const handleSearch = (data) => {
  //   setId(data.id || "");
  // };

  const handleReset = () => {
    setId("");
    setSearchData({
      from_date: "",
      to_date: "",
    });
    setDisplayData(bankListData?.responseData || []);
    reset();
  };

  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
      setValue("id", value);
    }, 500),
    [setValue]
  );

  return (
    <Box>
      <Box
        component="form"
        // onSubmit={handleSubmit(handleLoad)}
        sx={{ display: "flex", alignItems: "center" }}
      >
        <Box sx={{ width: "50px" }}>
          <Typography
            sx={{
              mb: 14,
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "19px",
              color: "#212121",
              textAlign: "center",
              width: "max-content",
              borderBottom: `1px solid ${theme.palette.secondary.main}`,
            }}
          >
            List of Banks
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit(handleLoad)}
          sx={{
            width: "100%",
            display: "flex",
            gap: 3,
            marginTop: -1,
            ml: -7,
            mb: -5,
          }}
        >
          <SearchText
            title="Search Bank ID"
            {...register("id")}
            onChange={(e) => debouncedSetId(e.target.value)}
            onClick={handleSubmit(handleLoad)}
          />
          {/* <Box sx={{ mt: -2 }}>
            <DateField
              control={control}
              dateLabel1="Date (From)"
              dateLabel2="Date (To)"
            />
          </Box> */}
          {/* <RoundedButton title1="Load"
            onClick1={handleSubmit(handleLoad)}
          /> */}
        </Box>
      </Box>
      <Box>
        {displayData?.length > 0 ? (
          <Box
            sx={{
              maxWidth: "1500px",
              width: { md: "110%", lg: "120%", xl: "130%" },
            }}
          >
            <ReceiptTable
              columns={BankListTableEntryHeader}
              data={displayData}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
              pageCount={totalPageCount}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              ml: { md: 5, lg: 20 },
              mt: 5,
            }}
          >
            <Empty
              imageStyle={{ height: 150, width: 150 }}
              description="No Data Available"
            />
            <Typography
              onClick={handleReset}
              sx={{
                color: theme.palette.primary[1100],
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reset Filters
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
