import { Box, Typography, useTheme } from "@mui/material";
import SearchText from "components/Button/Search";
import ReceiptTable from "components/Table/TanstackTable";
import { TransferStockTableEntryHeader } from "constants/TransferStock/TransferStockTableHeader";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
// import {
//   useGetBankListDate,
//   useGetgetBankListQuery,
// } from "services/Bank and Branches/BankAndBranchesServices";

import { useGetAllUnlistedStockData } from "services/TransferStock/TransferStockServices";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { PaginationState } from "@tanstack/react-table";
// import DateField from "components/DateField/DateField";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import DateFormatter from "utils/DateFormatter";
import RoundedButton from "components/Button/Button";
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
export default function TransferStock() {
  const { handleSubmit, register, reset, setValue } = useForm({
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

  //   const { data: bankListData, isSuccess: bankListDataSuccess, refetch: refetchBankList } =
  //     useGetgetBankListQuery((pagination.pageIndex || 0) + 1);

  //   const { data: bankListDataByDate, isSuccess: bankListByDateSuccess } = useGetBankListDate(searchData?.from_date,
  //     searchData?.to_date, pagination.pageIndex + 1, id);

  const { data: unlistedStockData, isSuccess: unlistedDataSuccess } =
    useGetAllUnlistedStockData(id);

  //   const totalPageCount = Math.ceil(unlistedStockData?.responseData?.count / 10);
  const totalPageCount = Math.ceil(1);

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
    if (unlistedStockData?.responseData?.next === null) {
      setNext(false); // swap until pagination is added
    } else {
      setNext(true);
    }
    if (unlistedStockData?.responseData?.previous === null) {
      setPrev(false); // swap until pagination is added
    } else {
      setPrev(true);
    }
  }, [unlistedStockData]);

  useEffect(() => {
    if (id) {
      setDisplayData(unlistedStockData ? unlistedStockData?.responseData : []);
    } else {
      setDisplayData(unlistedStockData?.responseData || []);
    }
  }, [unlistedStockData, id]);

  useEffect(() => {
    if (unlistedDataSuccess && loadClicked) {
      setDisplayData(unlistedStockData?.responseData ?? []);
      if (
        !unlistedStockData?.responseData ||
        unlistedStockData?.responseData?.length === 0
      ) {
        setErrorMsgs("There is no Unit List Available for the given Date.");
        setSnackbarErrorOpen(true);
      }
    }
  }, [loadClicked, unlistedStockData, searchData, unlistedDataSuccess]);

  // const handleSearch = (data) => {
  //   setId(data.id || "");
  // };

  const handleReset = () => {
    setId("");
    setDisplayData(unlistedStockData?.responseData || []);
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
              mt: 3,
              mb: 12,
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "19px",
              color: "#212121",
              textAlign: "center",
              width: "max-content",
              borderBottom: `1px solid ${theme.palette.secondary.main}`,
            }}
          >
            Unlisted Stocks
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
            title="Search Stock"
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
          <RoundedButton title1="Load" onClick1={handleSubmit(handleLoad)} />
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
              columns={TransferStockTableEntryHeader}
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
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "19px",
              color: "#212121",
              textAlign: "center",
              marginTop: "30px",
              marginLeft: "0px",
            }}
          >
            <CloudRoundedIcon sx={{ color: "#E0E0E0", fontSize: "12rem" }} />
            <Typography>No logs available for the current filters</Typography>
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
