import { Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";

type LTPUpdate = {
  sn: number;
  symbol: string;
  value: number;
  business_date: string
  transaction_type: string;
  quantity: number;
  rate: number;
  amount: number;
};

export const BatchUpdateTableHeader: ColumnDef<LTPUpdate>[] = [

  {
    header: "Symbol",
    accessorKey: "symbol",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>{data.row.original.symbol || 'N/A'}</Typography>;
    },
  },
  {
    header: "Transaction Type",
    accessorKey: "transaction_type",
    cell: (data) => {
      return (
        <Typography
          sx={{
            textAlign: "right",
            fontSize: "14px",
            fontWeight: "400px",
            width: { sm: "40%", md: "30%", lg: "35%" },
          }}
        >
          {data.row.original.transaction_type || 'N/A'}
        </Typography>
      );
    },
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
    cell: (data) => {
      return (
        <Typography textAlign="center" sx={{ fontSize: "14px", fontWeight: "400px" }}>{data.row.original.quantity || 'N/A'}</Typography>
      );
    },
  },
  {
    header: "Rate",
    accessorKey: "rate",
    cell: (data) => {
      return (
        <Typography textAlign="center" sx={{ fontSize: "14px", fontWeight: "400px" }}>{data.row.original.rate || 'N/A'}</Typography>
      );
    },
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: (data) => {
      return (
        <Typography textAlign="center" sx={{ fontSize: "14px", fontWeight: "400px" }}>{data.row.original.amount || 'N/A'}</Typography>
      );
    },
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: () => {
      return (
        <Typography textAlign="center"></Typography>
      );
    },
  },

];
