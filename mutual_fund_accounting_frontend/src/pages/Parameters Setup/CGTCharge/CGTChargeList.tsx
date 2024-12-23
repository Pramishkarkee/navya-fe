import { Box, Typography } from "@mui/material";
import { PaginationState } from "@tanstack/react-table";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ReceiptTable from "components/Table/TanstackTable";
import { CGTChargeTableColumns } from "constants/CGTCharge/CGTChargeTableHeader";
import { useEffect, useState } from "react";
import {
  useGetCGTChargeList,
  // usePatchFixedDepositData,
} from "services/CGTCharge/CGTChargeServices";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import { Empty } from "antd";

const MarketCapList = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();

  const { data: CGTCharge } = useGetCGTChargeList(pagination.pageIndex + 1);

  const totalPageCount = Math.ceil(CGTCharge?.responseData?.count / 10);

  useEffect(() => {
    if (CGTCharge?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (CGTCharge?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [CGTCharge]);

  return (
    <Box component="form" sx={{}}>
      <Box sx={{ my: 2 }}>
        <HeaderDesc title="CGT Charge List" />
      </Box>

      {CGTCharge?.responseData?.results?.length === 0 ? (
        <Box sx={{}}>
          <ReceiptTable
            columns={CGTChargeTableColumns}
            data={[]}
            // pagination={pagination}
            // setPagination={setPagination}
            // next={next}
            // prev={prev}
            // pageCount={totalPageCount}
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
            {/* <CloudRoundedIcon sx={{ color: "#E0E0E0", fontSize: "12rem" }} /> */}
          <Empty imageStyle={{ height: 150, width: 150 }} description="No Data Available" />
            {/* <Typography>No Data Available</Typography> */}
          </Box>
        </Box>
      ) : (
        <ReceiptTable
          columns={CGTChargeTableColumns}
          data={CGTCharge?.responseData?.results ?? []}
          pagination={pagination}
          setPagination={setPagination}
          next={next}
          prev={prev}
          pageCount={totalPageCount}
        />
      )}
    </Box>
  );
};

export default MarketCapList;
