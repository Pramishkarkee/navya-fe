import React, { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PaginationState } from "@tanstack/react-table";
import { Box, Typography, useTheme } from "@mui/material";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";

import debounce from "utils/Debounce";
import DateFormatter from "utils/DateFormatter";
import SearchText from "components/Button/Search";
import RoundedButton from "components/Button/Button";
import DateField from "components/DateFilter/DateField";
import ReceiptTable from "components/Table/TanstackTable";
import DropdownWithIcon from "components/Button/DropDown";
import { AuctionTableList } from "constants/Auction/AuctionTable";
import { useGetPendingAllotmentList } from "services/Auction/AuctionServices";
import ErrorBar from "components/Snackbar/ErrorBar";

const schema = yup
  .object({
    startDate: yup.object().required(),
    endDate: yup.object().required(),
    id: yup.number(),
  })
  .required();

const AuctionList = () => {
  const theme = useTheme();
  const { control, handleSubmit, register, reset, setValue } = useForm({
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
    },
    resolver: yupResolver(schema),
  });

  const [id, setId] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [displayData, setDisplayData] = useState([]);
  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>("all");
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });

  const options = [
    { value: "pending", label: "Applied Auctions" },
    { value: "allotted", label: "Allotted Auctions" },
    { value: "0 Units Allotted", label: "0 Units Allotted Auctions" },
    { value: "all", label: "All Auctions" },
  ];

  const {
    data: auctionData,
    refetch: auctionDataRefetch,
    isSuccess: auctionDataSuccess,
  } = useGetPendingAllotmentList(
    searchData.from_date,
    searchData.to_date,
    id,
    pagination.pageIndex + 1
  );

  // const { data: auctionDataByDate, isSuccess: auctionDataSuccess } =
  //   useGetAuctionListDate(searchData?.from_date, searchData?.to_date, id);
  const totalPages = Math.ceil(auctionData?.count / 10);

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
  const filterDataByStatus = useCallback(
    (data) => {
      switch (selectedValue) {
        case "pending":
          return data.filter((item) => item.status === "pending");
        case "allotted":
          return data.filter(
            (item) =>
              item.status.includes("Units Allotted") &&
              item.status !== "0 Units Allotted"
          );
        case "0 Units Allotted":
          return data.filter((item) => item.status === "0 Units Allotted");
        case "all":
          return data;
        default:
          return data;
      }
    },
    [selectedValue]
  );

  useEffect(() => {
    if (id) {
      const filteredData = filterDataByStatus(auctionData?.results || []);
      setDisplayData(filteredData);
    } else {
      setDisplayData(auctionData?.results || []);
    }
  }, [auctionData, id, selectedValue, filterDataByStatus]);

  useEffect(() => {
    auctionDataRefetch();
    if (auctionDataSuccess && loadClicked) {
      setDisplayData(auctionData?.results ?? []);

      if (!auctionData?.results || auctionData?.results.length === 0) {
        setErrorMsgs("There is no Unit List Available for the given Date.");
        setSnackbarErrorOpen(true);
      }
    }
  }, [auctionDataSuccess, loadClicked, searchData, auctionDataRefetch]);

  useEffect(() => {
    if (auctionData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (auctionData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [auctionData]);

  const handleSearchId = (data) => {
    setId(data.id || "");
  };

  const handleReset = () => {
    setId("");
    setSearchData({
      from_date: "",
      to_date: "",
    });
    setDisplayData(auctionData?.results || []);
    reset();
  };

  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
      setValue("id", value);
    }, 500),
    [setValue]
  );
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

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
        sx={{ width: "50px" }}
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
          {" "}
          Search Filters{" "}
        </Typography>
      </Box>
      <Box sx={{ width: "100%", display: "flex", gap: 2, marginTop: 3, mb: 3 }}>
        <SearchText
          title="Search"
          {...register("id")}
          onChange={(e) => debouncedSetId(e.target.value)}
          onClick={handleSubmit(handleSearchId)}
        />
        <Box sx={{ mt: -2 }}>
          <DateField
            control={control}
            dateLabel1="Date (From)"
            dateLabel2="Date (To)"
          />
        </Box>
        <RoundedButton title1="Load" onClick1={handleSubmit(handleLoad)} />
      </Box>
      <Box>
        <DropdownWithIcon
          options={options}
          value={selectedValue}
          onChange={handleChange}
        />
      </Box>

      <Box
        sx={{
          mt: 3,
          maxWidth: "1500px",
          width: { xl: "130%", lg: "125%", md: "110%" },
        }}
      >
        {displayData?.length > 0 ? (
          <Box sx={{ width: "100%" }}>
            <ReceiptTable
              columns={AuctionTableList}
              data={displayData}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
              pageCount={totalPages}
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
              marginLeft: "400px",
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
    </React.Fragment>
  );
};

export default AuctionList;
