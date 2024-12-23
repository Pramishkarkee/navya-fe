import { Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";

type LTPUpdate = {
  sn: number;
  symbol: string;
  value: number;
  business_date: string;
  // open: number;
  // high: number;
  // low: number;
  // total_trades: number;
};

export const LTPUpdateTableHeader: ColumnDef<LTPUpdate>[] = [
  {
    header: "SN",
    accessorKey: "sn",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>{data.row.index + 1}</Typography>;
    },
  },
  {
    header: "Symbol",
    accessorKey: "symbol",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>{data.row.original.symbol || 'N/A'}</Typography>;
    },
  },
  {
    header: "Close Price",
    accessorKey: "value",
    cell: (data) => {
      return (
        <Typography
          sx={{
            textAlign: "right",
            width: { sm: "40%", md: "30%", lg: "35%" }, fontSize: "14px", fontWeight: "600px"
          }}
        >
          {data.row.original.value || 'N/A'}
        </Typography>
      );
    },
  },
  {
    header: "Business Date",
    accessorKey: "business_date",
    cell: (data) => {
      return (
        <Typography textAlign="center" sx={{ fontSize: "14px", fontWeight: "400" }}>
          {data.row.original.business_date || 'N/A'}
        </Typography>
      );
    },
  },
  // {
  //   header: "High",
  //   accessorKey: "high",
  //   cell: (data) => {
  //     return (
  //       <Typography sx={{ fontSize: "0.85rem" }}>
  //         {data.row.original.high}
  //       </Typography>
  //     );
  //   },
  // },
  // {
  //   header: "Low",
  //   accessorKey: "low",
  //   cell: (data) => {
  //     return (
  //       <Typography sx={{ fontSize: "0.85rem" }}>
  //         {data.row.original.low}
  //       </Typography>
  //     );
  //   },
  // },

  // {
  //   header: "Total Trades",
  //   accessorKey: "total_trades",
  //   cell: (data) => {
  //     return (
  //       <Typography sx={{ fontSize: "0.85rem" }}>
  //         {data.row.original.total_trades}
  //       </Typography>
  //     );
  //   },
  // },
];
