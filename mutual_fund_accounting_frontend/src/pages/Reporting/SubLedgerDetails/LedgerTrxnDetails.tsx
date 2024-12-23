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
import { LedgerTransactionHeaders } from "constants/Reporting/LedgerTransactionHeader";
import {
  useGetLedgerList,
  useGetLedgerTransactionDetails,
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

  const { data: ledgerTransactionDetails } = useGetLedgerTransactionDetails(
    selectedLedger ? selectedLedger : ledgerCode,
    pagination.pageIndex + 1,
    pageSize,
    searchData.from_date,
    searchData.to_date
  );

  const { data: subLedgerList } = useGetLedgerList();

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
        ledger_head: item.ledger_head,
        ledger_code: item.ledger_code,
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

  const selectedLedgerHeadList = subLedgerList?.responseData?.find((item) =>
    selectedLedger
      ? item.ledger_code === selectedLedger
      : item.ledger_code === ledgerCode
  );

  const selectedLedgerHead = selectedLedgerHeadList
    ? selectedLedgerHeadList.ledger_head
    : null;

  return (
    <React.Fragment>
      <Box
        sx={{
          width: { sm: "100%", md: "110%" },
          mt: 2,
        }}
      >
        <HeaderDesc title="List of Ledger Head Transaction" />

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
              getOptionLabel={(option) => option.ledger_head}
              onChange={(event, newValue) =>
                setSelectedLedger(newValue?.ledger_code)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Ledger Head"
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

          {/* <FormControl sx={{ width: "max-content" }}>
            <Select
              labelId="securitytype-select-label"
              id="securitytype-select"
              // value={subscriptionType}
              label="Select Security Type"
              size="small"
              type="autocomplete"
              // onChange={(e) => setSubscriptionType(e.target.value)}
              // startAdornment={<TuneIcon />}
              variant="outlined"
              sx={{
                mt: 1,
                borderRadius: "24px",
                backgroundColor: theme.palette.primary.light,
                height: "50px",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiOutlinedInput-input": {
                  ml: "6px",
                },
              }}
            >
              {subLedgerList &&
                subLedgerList?.responseData?.map((item, index) => (
                  <MenuItem key={index} value={item.ledger_code} sx={{}}>
                    {item.ledger_head}
                  </MenuItem>
                ))}
            </Select>
          </FormControl> */}

          {/* <FormControl sx={{ width: "200px" }}>
            <Select
              labelId="sortby-select-label"
              id="sortby-select"
              // value={sortBy}
              label="Select Sort Type"
              size="small"
              // onChange={(e) => setSortBy(e.target.value)}
              // startAdornment={<TuneIcon />}
              variant="outlined"
              sx={{
                mt: 1,
                borderRadius: "24px",
                backgroundColor: theme.palette.primary.light,
                height: "50px",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiOutlinedInput-input": {
                  ml: "6px",
                },
              }}
            >
              <MenuItem value="date_registered">Date Registered</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="full_name">Full Name</MenuItem>
              <MenuItem value="phone_number">Phone Number</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ width: "175px" }}>
            <Select
              labelId="sortorder-select-label"
              id="sortorder-select"
              // /value={sortOrder}
              label="Select Sort Order"
              size="small"
              // onChange={(e) => setSortOrder(e.target.value)}
              // startAdornment={<TuneIcon />}
              variant="outlined"
              sx={{
                mt: 1,
                // borderBlockColor: "white",
                borderRadius: "24px",
                backgroundColor: theme.palette.primary.light,
                height: "50px",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiOutlinedInput-input": {
                  ml: "6px",
                },
              }}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl> */}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: { xs: "80%", sm: "100%", md: "100%", lg: "145%" },
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

        <Box sx={{ width: { xs: "80%", sm: "90%", md: "100%", lg: "145%" } }}>
          <ReactTable
            columns={LedgerTransactionHeaders}
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
