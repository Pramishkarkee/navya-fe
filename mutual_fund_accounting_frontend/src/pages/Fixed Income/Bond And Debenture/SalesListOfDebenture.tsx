import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
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

import { DebentureSalesTableList } from "constants/DebentureBond/DebentureBondSalesTable";
import { useGetBondAndDebentureSalesData } from "services/BondAndDebenture/BondAndDebenture";

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

const ListOfDebentureAndBond = () => {
  const theme = useTheme();
  const { control, handleSubmit, register, setValue } = useForm({
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
      id: "",
    },
  });

  const [id, setId] = useState<string>("");
  const [displayData, setDisplayData] = useState([]);
  const [searchNext, setSearchNext] = useState<boolean>(false);
  const [searchPrev, setSearchPrev] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });

  const { data: DebentureSalesData } = useGetBondAndDebentureSalesData(
    pagination.pageIndex + 1,
    searchData.from_date,
    searchData.to_date,
    id
  );

  const totalPageCount = Math.ceil(DebentureSalesData?.meta?.count / 10);

  useEffect(() => {
    if (DebentureSalesData?.meta?.next === null) {
      setSearchNext(true);
    } else {
      setSearchNext(false);
    }
    if (DebentureSalesData?.meta?.previous === null) {
      setSearchPrev(true);
    } else {
      setSearchPrev(false);
    }
  }, [DebentureSalesData]);

  useEffect(() => {
    if (id) {
      setDisplayData(DebentureSalesData ? DebentureSalesData?.results : []);
    } else {
      setDisplayData(DebentureSalesData?.results || []);
    }
  }, [id, DebentureSalesData]);

  const handleLoad = (data) => {
    setId(data.id || "");
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
    }
  };
  const handleReset = () => {
    setSearchData({
      from_date: "",
      to_date: "",
    });
    setId("");
    setDisplayData(DebentureSalesData?.responseData?.results || []);
  };
  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
      setValue("id", value);
    }, 500),
    [setValue]
  );
  return (
    <Box onSubmit={handleSubmit(handleLoad)} component="form">
      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: 3,
          marginTop: 5,
          ml: -1,
          mb: 3,
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
            maxDateValue={dayjs()}
          />
        </Box>

        <RoundedButton title1="Load" />
      </Box>

      {DebentureSalesData?.responseData.length === 0 ? (
        <Box
          sx={{
            maxWidth: "1500px",
            width: { md: "110%", lg: "125%", xl: "130%" },
          }}
        >
          <ReceiptTable columns={DebentureSalesTableList} data={[]} />
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
            maxWidth: "1500px",
            width: { xs: "175%", md: "110%", lg: "125%", xl: "130%" },
          }}
        >
          <ReceiptTable
            columns={DebentureSalesTableList}
            data={DebentureSalesData?.responseData ?? []}
            pagination={pagination}
            setPagination={setPagination}
            next={searchNext}
            prev={searchPrev}
            pageCount={totalPageCount}
          />
        </Box>
      )}
    </Box>
  );
};

export default ListOfDebentureAndBond;
