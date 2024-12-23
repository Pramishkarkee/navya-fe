import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { PaginationState } from "@tanstack/react-table";
import {
  Autocomplete,
  Box,
  FormControl,
  TextField,
  useTheme,
  Typography,
} from "@mui/material";
import DateFormatter from "utils/DateFormatter";
import RoundedButton from "components/Button/Button";
import DateField from "components/DateFilter/DateField";
import { ReactTable } from "components/Table/ReactTable";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import { SubLedgerTransactionHeaders } from "constants/Reporting/SubLedgerTransactionHeader";
import {
  useGetSubLedgerList,
  useGetSubLedgerTransactionDetails,
} from "services/Reporting/SubLedgerDetails/SubLedgerDetailsServices";

const DateFormatterAmendment = {
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

export default function SubLedgerTransactionDetails() {
  const theme = useTheme();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      startDate: dayjs().subtract(1, "week"),
      endDate: dayjs(),
    },
  });

  const location = useLocation();
  const ledgerCode = location.pathname.split("/")[2];

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [subLedger, setSubLedger] = useState([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedLedger, setSelectedLedger] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });

  const { data: ledgerTransactionDetails } = useGetSubLedgerTransactionDetails(
    selectedLedger ? selectedLedger : ledgerCode,
    pagination.pageIndex + 1,
    pageSize,
    searchData.from_date,
    searchData.to_date
  );

  const { data: subLedgerList } = useGetSubLedgerList();

  const totalPageCount = Math.ceil(
    (ledgerTransactionDetails?.meta?.count ?? 0) / pageSize
  );

  const handleLoad = (data) => {
    if (data.startDate && data.endDate) {
      const fromDate = new Date(data.startDate);
      const toDate = new Date(data.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatterAmendment.format(
        toDate.toISOString()
      );

      setSearchData({
        from_date: formattedFromDate,
        to_date: formattedToDate,
      });

      setPagination({ pageIndex: 0, pageSize: 10 });
    }
  };

  useEffect(() => {
    const ledgerList =
      subLedgerList &&
      subLedgerList?.responseData?.map((item: any) => ({
        sub_ledger_head: item.sub_ledger_head,
        sub_ledger_code: item.sub_ledger_code,
      }));

    setSubLedger(ledgerList);
  }, [subLedgerList]);

  useEffect(() => {
    setPagination({ ...pagination, pageIndex: 0 });
  }, [pageSize, selectedLedger]);

  useEffect(() => {
    searchData.to_date = "";
    searchData.from_date = "";
  }, [selectedLedger]);

  useEffect(() => {
    if (ledgerTransactionDetails?.meta?.next === null) {
      setNext(false);
    } else {
      setNext(true);
    }
    if (ledgerTransactionDetails?.meta?.previous === null) {
      setPrev(false);
    } else {
      setPrev(true);
    }
  }, [ledgerTransactionDetails]);

  const selectedLedgerHead = subLedgerList?.responseData?.find((item) =>
    selectedLedger
      ? item.sub_ledger_code === selectedLedger
      : item.sub_ledger_code === ledgerCode
  ).sub_ledger_head;

  return (
    <React.Fragment>
      <Box
        sx={{
          width: { sm: "100%", md: "110%" },
          mt: 2,
        }}
      >
        <HeaderDesc title="List of Sub-Ledger Head Transaction" />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
          }}
        >
          <FormControl
            sx={{
              width: "420px",
              mt: 2.5,
            }}
          >
            <Autocomplete
              options={subLedger ?? []}
              getOptionLabel={(option) => option.sub_ledger_head}
              onChange={(event, newValue) =>
                setSelectedLedger(newValue?.sub_ledger_code)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Sub-Ledger Head"
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </FormControl>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
            onSubmit={handleSubmit(handleLoad)}
            component="form"
          >
            <DateField
              control={control}
              dateLabel1="Date (From)"
              dateLabel2="Date (To)"
              maxDateValue={dayjs()}
            />
            <Box sx={{ mt: 1.5 }}>
              <RoundedButton title1="Load" />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: {
              xs: "80%",
              sm: "100%",
              md: "100%",
              lg: "145%",
              xl: "150%",
            },
            gap: 1,
          }}
        >
          <Typography
            sx={{
              mt: 4,
              fontSize: "16px",
              fontWeight: 500,
              color: theme.palette.secondary.main,
            }}
          >
            {selectedLedgerHead}
          </Typography>
          <Box>
            <Typography
              sx={{
                mt: 4,
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Closing Balance
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                color: theme.palette.primary.main,
              }}
            >
              {`NPR ${
                ledgerTransactionDetails?.responseData[0]?.closing_balance.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                ) ?? "0.00"
              }`}
            </Typography>
          </Box>
        </Box>

        <Box
          // padding={2}
          sx={{
            width: { xs: "80%", sm: "90%", md: "100%", lg: "145%", xl: "150%" },
          }}
        >
          <ReactTable
            columns={SubLedgerTransactionHeaders}
            data={ledgerTransactionDetails?.responseData[0]?.txn_data ?? []}
            next={next}
            prev={prev}
            pagination={pagination}
            setPagination={setPagination}
            pageCount={totalPageCount}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        </Box>
      </Box>
    </React.Fragment>
  );
}
