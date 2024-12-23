import { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import { Empty } from "antd";
import { useForm } from "react-hook-form";
import { Box, Typography, useTheme } from "@mui/material";
import { PaginationState } from "@tanstack/react-table";

import debounce from "utils/Debounce";
import DateFormatter from "utils/DateFormatter";
import SearchText from "components/Button/Search";
import RoundedButton from "components/Button/Button";
import DateField from "components/DateFilter/DateField";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ReceiptTable from "components/Table/TanstackTable";
import {
  FDTableList,
  FixedDepositTableEntryHeader,
} from "constants/FixedDepositTable/FixedDepositTableHeaders";
import { useGetFixedDepositData } from "services/Fixed Deposit/FixedDepositService";

const FixedDepositList = () => {
  const { control, handleSubmit, setValue, register } = useForm({
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
      id: "",
    },
  });
  const theme = useTheme();
  const [id, setId] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [displayData, setDisplayData] = useState<FDTableList[]>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });

  const { data: FixedDepositData } = useGetFixedDepositData(
    pagination.pageIndex + 1,
    searchData.from_date,
    searchData.to_date,
    id
  );

  const totalPageCount = Math.ceil(FixedDepositData?.responseData.count / 10);

  useEffect(() => {
    if (FixedDepositData?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (FixedDepositData?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [FixedDepositData]);

  useEffect(() => {
    if (id) {
      setDisplayData(
        FixedDepositData ? FixedDepositData?.responseData?.results : []
      );
      setDisplayData(FixedDepositData?.responseData?.results ?? []);
    } else {
      setDisplayData(FixedDepositData?.responseData?.results ?? []);
    }
  }, [id, FixedDepositData]);

  const handleLoad = (data) => {
    if (data.startDate && data.endDate) {
      const fromDate = new Date(data.startDate);
      const toDate = new Date(data.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatter.format(toDate.toISOString());

      setSearchData({
        from_date: formattedFromDate,
        to_date: formattedToDate,
      });
    }
  };
  const handleReset = () => {
    setSearchData({
      from_date: "",
      to_date: "",
    });
    setId("");
    setDisplayData(FixedDepositData?.responseData?.results || []);
  };
  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
      setValue("id", value);
    }, 500),
    [setValue]
  );
  return (
    <Box component="form" onSubmit={handleSubmit(handleLoad)}>
      <Box sx={{ my: 2 }}>
        <HeaderDesc title="Deposit Details" />
      </Box>

      <Box sx={{ width: "100%", display: "flex", gap: 3, my: 2 }}>
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

      {FixedDepositData?.responseData?.results?.length === 0 ? (
        <Box
          sx={{
            mt: 3,
            maxWidth: "1500px",
            width: { xl: "130%", lg: "125%", md: "110%" },
          }}
        >
          <ReceiptTable
            columns={FixedDepositTableEntryHeader}
            data={displayData}
          />
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
        </Box>
      ) : (
        <Box
          sx={{
            mt: 3,
            maxWidth: "1500px",
            width: { xl: "130%", lg: "125%", md: "110%" },
          }}
        >
          <ReceiptTable
            columns={FixedDepositTableEntryHeader}
            data={FixedDepositData?.responseData.results ?? []}
            pagination={pagination}
            setPagination={setPagination}
            next={next}
            prev={prev}
            pageCount={totalPageCount}
          />
        </Box>
      )}
    </Box>
  );
};

export default FixedDepositList;
