import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PaginationState } from "@tanstack/react-table";
import { Empty } from "antd";
import { Box, Typography, useTheme } from "@mui/material";

import debounce from "utils/Debounce";
import DateFormatter from "utils/DateFormatter";
import SearchText from "components/Button/Search";
import RoundedButton from "components/Button/Button";
import DateField from "components/DateFilter/DateField";
import ReceiptTable from "components/Table/TanstackTable";
import ExportButton from "components/Button/ExportButton";
import { useGetDayCloseData } from "services/DayClose/DayCloseServices";
import {
  DayCloseData,
  DayCloseListEntryHeader,
} from "constants/DayCloseTable/DayCloseEntryTableHeaders";

export default function DayCloseList() {
  const theme = useTheme();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const { control, handleSubmit, reset, setValue, register } = useForm({});

  const [id, setId] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [displayData, setDisplayData] = useState<DayCloseData[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });

  const { data: DayCloseListData, isSuccess: DayCloseListDataSuccess } =
    useGetDayCloseData(
      searchData.from_date,
      searchData.to_date,
      pagination.pageIndex + 1,
      id
    );

  const totalPageCount = Math.ceil(DayCloseListData?.meta?.count / 10);

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
    }
  };

  useEffect(() => {
    const responseData = DayCloseListData?.meta;
    setNext(responseData?.next === null);
    setPrev(responseData?.previous === null);
  }, [DayCloseListData]);

  useEffect(() => {
    if (DayCloseListDataSuccess || loadClicked) {
      const results = DayCloseListData?.responseData ?? [];
      setDisplayData(results);
    }
  }, [DayCloseListDataSuccess, loadClicked, DayCloseListData]);

  const handleReset = () => {
    setSearchData({
      from_date: "",
      to_date: "",
    });
    setId("");
    reset();
    setDisplayData(DayCloseListData);
  };

  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
      setValue("id", value);
    }, 500),
    [setValue]
  );

  useEffect(() => {
    setPagination({ ...pagination, pageIndex: 0 });
  }, [searchData, id]);

  return (
    <React.Fragment>
      <Box
        sx={{
          maxWidth: "1500px",
          width: { md: "110%", lg: "120%", xl: "125%" },
        }}
      >
        <Box sx={{ width: "50px", mb: 2 }}>
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
            Day Close Summary
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            width: { sm: "100%", md: "100%", lg: "130%" },
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit(handleLoad)}
            sx={{
              width: "100%",
              display: "flex",
              gap: 3,
              marginTop: 1,
              ml: -1,
            }}
          >
            <SearchText
              title="Search"
              {...register("id")}
              onChange={(e) => debouncedSetId(e.target.value)}
              onClick={handleSubmit(handleLoad)}
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

          <Box sx={{}}>
            <ExportButton
              filename="DayCloseSummary.csv"
              search={id}
              startDate={searchData.from_date}
              endDate={searchData.to_date}
              baseURL={`${BASE_URL}/api/v1/accounting/day-close/export/?export=True`}
            />
          </Box>
        </Box>
        <Box sx={{ mt: 3 }}>
          {displayData?.length > 0 ? (
            <ReceiptTable
              columns={DayCloseListEntryHeader}
              data={displayData}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
              pageCount={totalPageCount}
            />
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
    </React.Fragment>
  );
}
