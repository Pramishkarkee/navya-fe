import { Box, Typography } from "@mui/material";
import { PaginationState } from "@tanstack/react-table";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ReceiptTable from "components/Table/TanstackTable";
import { MarketCapTableColumns } from "constants/MarketCap/MarketCapTableHeader";
import { useEffect, useState } from "react";
import {
  useGetMarketCapList,
  // usePatchFixedDepositData,
} from "services/MarketCap/MarketCapService";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import { Empty } from "antd";

const MarketCapList = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();

  const { data: MarketCapData } = useGetMarketCapList(pagination.pageIndex + 1);

  const totalPageCount = Math.ceil(MarketCapData?.count / 10);

  useEffect(() => {
    if (MarketCapData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (MarketCapData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [MarketCapData]);

  return (
    <Box component="form" sx={{}}>
      <Box sx={{ my: 4 }}>
        <HeaderDesc title="Market Cap List" />
      </Box>

      {MarketCapData?.results?.length === 0 ? (
        <Box
          sx={{
            width: { xl: "110%", lg: "105%", md: "90%" },

          }}
        >
          <ReceiptTable
            columns={MarketCapTableColumns}
            data={[]}
          // pagination={pagination}
          // setPagination={setPagination}
          // next={next}
          // prev={prev}
          // pageCount={totalPageCount}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', ml: { md: 5, lg: 20 }, mt: 5 }}>
            {/* <CloudRoundedIcon sx={{ color: "#E0E0E0", fontSize: "12rem" }} /> */}
            <Empty imageStyle={{ height: 150, width: 150 }} description="No Data Available" />
            {/* <Typography>No Data Available</Typography> */}
          </Box>

        </Box>
      ) : (
        <Box sx={{ width: { xl: "110%", lg: "105%", md: "90%" } }}>
          <ReceiptTable
            columns={MarketCapTableColumns}
            data={MarketCapData?.results ?? []}
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

export default MarketCapList;
