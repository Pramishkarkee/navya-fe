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
import ErrorBar from "components/Snackbar/ErrorBar";
import RoundedButton from "components/Button/Button";
import { IPOData, IpoTableList } from "constants/Ipo/IpoTable";
import DateField from "components/DateFilter/DateField";
import ReceiptTable from "components/Table/TanstackTable";
import DropdownWithIcon from "components/Button/DropDown";
import {
  useGetIPOListDate,
  useGetPendingIPOFPORightList,
} from "services/ipo/ipoServices";

const schema = yup
  .object({
    startDate: yup.object().required(),
    endDate: yup.object().required(),
    id: yup.number(),
  })
  .required();

const IpoList = () => {
  const theme = useTheme();
  const { control, handleSubmit, register, setValue, reset } = useForm({
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
    },
    resolver: yupResolver(schema),
  });
  const [id, setId] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [displayData, setDisplayData] = useState<IPOData[]>([]);
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
    { value: "pending", label: "Applied IPOs" },
    { value: "allotted", label: "Allotted IPOs" },
    { value: "0 Units Allotted", label: "0 Units Allotted IPOs" },
    { value: "all", label: "All " },
  ];

  const { data: ipoData, refetch: ipoDataRefetch } =
    useGetPendingIPOFPORightList(
      searchData.from_date,
      searchData.to_date,
      id,
      pagination.pageIndex + 1
    );

  const { data: ipoDataByDate, isSuccess: ipoDataByDateSuccess } =
    useGetIPOListDate(searchData?.from_date, searchData?.to_date, id);

  const totalPages = Math.ceil(ipoData?.count / 10);

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
      const filteredData = filterDataByStatus(
        ipoDataByDate ? ipoDataByDate?.results || [] : []
      );
      setDisplayData(filteredData);
    } else {
      const filteredData = filterDataByStatus(ipoData?.results || []);
      setDisplayData(filteredData);
    }
  }, [ipoData, ipoDataByDate, id, selectedValue, filterDataByStatus]);

  useEffect(() => {
    ipoDataRefetch();
    if (ipoDataByDateSuccess && loadClicked) {
      setDisplayData(ipoDataByDate?.results ?? []);

      if (!ipoDataByDate?.results || ipoDataByDate?.results.length === 0) {
        setErrorMsgs("There is no Data Available for the given Date.");
        setSnackbarErrorOpen(true);
      }
    }
  }, [
    ipoDataByDateSuccess,
    loadClicked,
    ipoDataByDate,
    searchData,
    ipoDataRefetch,
  ]);

  useEffect(() => {
    if (ipoData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (ipoData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [ipoData]);

  const handleSearchId = (data) => {
    setId(data.id || "");
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleReset = () => {
    setId("");
    setSearchData({
      from_date: "",
      to_date: "",
    });
    setDisplayData(ipoData?.results || []);
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
      <Box
        component="form"
        onSubmit={handleSubmit(handleSearchId)}
        sx={{ width: "100%", display: "flex", gap: 2, marginTop: 3, mb: 3 }}
      >
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
              columns={IpoTableList}
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

export default IpoList;
