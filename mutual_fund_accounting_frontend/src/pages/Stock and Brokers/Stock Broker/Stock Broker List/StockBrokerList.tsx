import { Box, Typography, useTheme } from "@mui/material";
import ReceiptTable from "components/Table/TanstackTable";
import { StockBrokerTableListEntryHeader1 } from "constants/Stocks Broker/StockBrokerListTable";
// import SearchIcon from '@mui/icons-material/Search';
// import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
// import SearchText from "components/Button/Search";
// import DownloadButton from "components/Button/DownloadExcel";
import {
  // useGetSearchStockBrokerData,
  useGetStockBrokerData,
} from "services/StockBroker/StockBrokerServices";

import { PaginationState } from "@tanstack/react-table";
import { useEffect, useState, useCallback } from "react";
import { Empty } from "antd";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
// import RoundedButton from "components/Button/Button";
import SearchText from "components/Button/Search";
// import CloudRoundedIcon from '@mui/icons-material/CloudRounded';
import debounce from "utils/Debounce";

export default function StockBrokerList() {
  const {
    control,
    handleSubmit,
    // reset,
    setValue,
    register,
    // formState: { errors, isSubmitSuccessful },
  } = useForm({
    // defaultValues: {
    //     stock_transaction_id: 17,
    //     startDate: dayjs(),
    //     endDate: dayjs(),
    //     // settlement_list: [{ cheque_no: "NIC005697SSs89", bank_account: "NIC Asia", cheque_date: "", cheque_amount: "10000" }],
    // },
  });
  const [id, setId] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const [pageSize, setPageSize] = useState<number>(10);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();

  const theme = useTheme();

  const { data: StockBrokerList } = useGetStockBrokerData(
    pagination.pageIndex + 1,
    pageSize,
    id
  );

  // const { data: stockSearchlist } = useGetSearchStockBrokerData(id);

  const totalPageCount = Math.ceil(
    StockBrokerList?.responseData?.count / pageSize
  );

  useEffect(() => {
    if (StockBrokerList?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (StockBrokerList?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [StockBrokerList]);

  useEffect(() => {
    if (id) {
      setDisplayData(
        StockBrokerList ? StockBrokerList?.responseData?.results : []
      );
    } else {
      setDisplayData(StockBrokerList?.responseData?.results ?? []);
    }
  }, [id, StockBrokerList]);

  useEffect(() => {
    setPagination((prevState) => ({
      ...prevState,
      pageIndex: 0,
    }));
  }, [id]);

  const handleSearch = (data) => {
    setId(data.id || "");
  };
  const handleReset = () => {
    setId("");
    setDisplayData(StockBrokerList?.responseData?.results || []);
  };
  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
      setValue("id", value);
    }, 500),
    [setValue]
  );

  // const handleSearch = () => {
  //     console.log("search button");
  // };
  // const handleDownloadExcel = () => {
  //     console.log("Implement logic to download Excel file");
  // };
  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 1 }}
    >
      <Box sx={{ width: "50px" }}>
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
          Stock Broker List
        </Typography>
      </Box>

      {/* <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <SearchText
                    title="Search"
                    onClick={handleSearch}
                />
                <DownloadButton sx={{ justifyContent: "flex-end" }} onClick={handleDownloadExcel} />
            </Box> */}

      <Box
        component="form"
        onSubmit={handleSubmit(handleSearch)}
        sx={{ width: "100%", display: "flex", gap: 2, marginTop: 1, mb: 1 }}
      >
        <SearchText
          title="Search"
          {...register("id")}
          onChange={(e) => debouncedSetId(e.target.value)}
          onClick={handleSubmit(handleSearch)}
        />
        {/* <Box sx={{ mt: -2 }}>
                    <DateField
                        control={control}
                        dateLabel1="Date (From)"
                        dateLabel2="Date (To)"
                    />
                </Box> */}
        {/* <RoundedButton title1="Load"
          onClick1={handleSubmit(handleSearch)}
        /> */}
        {/* <Box sx={{ marginLeft: "-50px" }}>
                    <DropdownWithIcon
                        options={options}
                        value={selectedValue}
                        onChange={handleChange}
                    />
                </Box> */}
      </Box>

      {displayData?.length > 0 ? (
        <Box
          sx={{
            maxWidth: "1500px",
            width: { xl: "100%", lg: "125%", md: "105%" },
          }}
        >
          <ReceiptTable
            columns={StockBrokerTableListEntryHeader1}
            data={displayData}
            pagination={pagination}
            setPagination={setPagination}
            next={next}
            prev={prev}
            pageCount={totalPageCount}
            setPageSize={setPageSize}
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
  );
}
