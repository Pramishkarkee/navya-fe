import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PaginationState } from "@tanstack/react-table";
import { Empty } from "antd";
import { Box, useTheme, Typography } from "@mui/material";

import debounce from "utils/Debounce";
import DateFormatter from "utils/DateFormatter";
import SearchText from "components/Button/Search";
import ErrorBar from "components/Snackbar/ErrorBar";
import RoundedButton from "components/Button/Button";
import DateField from "components/DateFilter/DateField";
import ReceiptTable from "components/Table/TanstackTable";
import {
  SettlementListTableEntryHeader,
  StockTransactionSettlementList,
} from "constants/Stock Transaction/SettlementListTable";
import { useGetStockTransactionSettlementListDate } from "services/Stock Transaction/StockTransactionService";

const schema = yup
  .object({
    startDate: yup.object().required(),
    endDate: yup.object().required(),
    id: yup.string(),
  })
  .required();

const StockSettlementList = () => {
  const theme = useTheme();
  const { control, handleSubmit, register, setValue } = useForm({
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
    },
    resolver: yupResolver(schema),
  });
  const [id, setId] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [displayData, setDisplayData] = useState<
    StockTransactionSettlementList[]
  >([]);
  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: settlementListDataByDate,
    isSuccess: settlementListByDateSuccess,
  } = useGetStockTransactionSettlementListDate(
    searchData?.from_date,
    searchData?.to_date,
    pagination.pageIndex + 1,
    id
  );

  const totalPageCount = Math.ceil(
    settlementListDataByDate?.responseData?.count / 10
  );

  const handleLoad = (data) => {
    setId(data.id || "");
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
    if (settlementListDataByDate?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (settlementListDataByDate?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [settlementListDataByDate]);

  useEffect(() => {
    if (settlementListByDateSuccess && loadClicked) {
      setDisplayData(settlementListDataByDate?.responseData?.results ?? []);

      if (
        !settlementListDataByDate?.responseData.results ||
        settlementListDataByDate?.responseData.results.length === 0
      ) {
        setErrorMsgs("There is no Unit List Available for the given Date.");
        setSnackbarErrorOpen(true);
      }
    }
  }, [
    settlementListByDateSuccess,
    loadClicked,
    settlementListDataByDate,
    searchData,
  ]);

  useEffect(() => {
    if (id) {
      setDisplayData(
        settlementListDataByDate
          ? settlementListDataByDate?.responseData?.results
          : []
      );
    } else {
      setDisplayData(settlementListDataByDate?.responseData?.results || []);
    }
  }, [
    id,
    settlementListDataByDate?.responseData?.results,
    settlementListDataByDate,
  ]);

  const handleReset = () => {
    setId("");
    setDisplayData(settlementListDataByDate?.responseData?.results || []);
  };
  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
      setValue("id", value);
    }, 500),
    [setValue]
  );

  useEffect(() => {
    if (id || searchData) {
      pagination.pageIndex = 0;
    }
  }, [id, searchData]);

  return (
    <React.Fragment>
      <ErrorBar
        snackbarOpen={snackbarErrorOpen}
        setSnackbarOpen={setSnackbarErrorOpen}
        message={errorMsgs}
      />
      <Box
        component="form"
        onSubmit={handleSubmit(handleLoad)}
        sx={{ display: "flex", alignItems: "center" }}
      >
        <Box sx={{ width: "50px" }}>
          <Typography
            sx={{
              mt: 1,
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
            {" "}
            List of Past Settlements{" "}
          </Typography>
        </Box>
        <Box sx={{ width: "100%", display: "flex", gap: 3, ml: -6.5 }}>
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
              maxDateValue={dayjs()}
            />
          </Box>
          <RoundedButton title1="Load" onClick1={handleSubmit(handleLoad)} />
        </Box>
      </Box>
      {displayData?.length > 0 ? (
        <Box
          sx={{
            maxWidth: "1500px",
            width: { xl: "130%", lg: "125%", md: "110%" },
          }}
        >
          <ReceiptTable
            columns={SettlementListTableEntryHeader}
            data={settlementListDataByDate?.responseData?.results ?? []}
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
    </React.Fragment>
  );
};

export default StockSettlementList;
