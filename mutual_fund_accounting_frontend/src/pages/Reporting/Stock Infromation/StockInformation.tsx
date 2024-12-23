import React, { useState, useCallback, useEffect } from "react";
import { Empty } from "antd";
import { useForm } from "react-hook-form";
import { Box, Typography, useTheme } from "@mui/material";
import debounce from "utils/Debounce";
import SearchText from "components/Button/Search";
import ReceiptTable from "components/Table/TanstackTable";

// import DownloadButton from "components/Button/DownloadExcel";
import { useGetStockInfoReport } from "services/Reporting/Stock Information/StockInformationServices";
import { StockInformationTableHeader } from "constants/StockInformation/StockInformationTableHeader";
import { PaginationState } from "@tanstack/react-table";

export default function StockInformation() {
  const theme = useTheme();
  const { setValue, reset } = useForm({});
  const [id, setId] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: stockInfoData } = useGetStockInfoReport(
    id,
    pagination.pageIndex + 1,
    pageSize
  );
  const totalPageCount = Math.ceil(stockInfoData?.meta?.count / pageSize);

  const handleReset = () => {
    reset();
    setId("");
  };

  // const handleDownloadExcel = () => {
  // };

  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
    }, 500),
    [setValue]
  );

  useEffect(() => {
    if (stockInfoData?.meta?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (stockInfoData?.meta?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [stockInfoData]);

  return (
    <React.Fragment>
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
            {" "}
            Stock Entries{" "}
          </Typography>
        </Box>
        <Box
          component="form"
          sx={{ width: "100%", display: "flex", gap: 3, marginTop: 1 }}
        >
          <SearchText
            title="Search for Stock"
            onChange={(e) => debouncedSetId(e.target.value)}
          />
        </Box>
        <Box
          sx={{
            width: {
              xs: "95%",
              sm: "100%",
              md: "110%",
              lg: "120%",
              xl: "130%",
            },
          }}
        >
          {/* <Box sx={{ display: "flex", flexDirection: "row-reverse", mb: 2 }}>
            <DownloadButton
              sx={{ justifyContent: "flex-end" }}
              onClick={handleDownloadExcel}
            />
          </Box> */}

          <ReceiptTable
            columns={StockInformationTableHeader}
            data={stockInfoData?.responseData ?? []}
            pagination={pagination}
            setPagination={setPagination}
            next={next}
            prev={prev}
            pageCount={totalPageCount}
            setPageSize={setPageSize}
          />

          {!stockInfoData?.responseData?.length && (
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "19px",
                color: "#212121",
                textAlign: "center",
                marginTop: "30px",
              }}
            >
              <Empty imageStyle={{}} description="No Data Available" />

              <Typography
                onClick={handleReset}
                sx={{
                  color: theme.palette.primary[700],
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
