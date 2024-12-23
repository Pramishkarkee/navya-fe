import { Box, Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";

type StockInformation = {
  sn: number;
  stock: string;
  sector: string;
  txn_type: string;
  stock_type: string;
  unlock_date: string;
  total_units: number;
  free_balance: number;
  locked_balance: number;
  remaining_days_unlock: number;
};

export const StockInformationTableHeader: ColumnDef<StockInformation>[] = [
  {
    header: "SN",
    accessorKey: "sn",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
          {data.row.index + 1}
        </Typography>
      );
    },
  },
  {
    header: "Stock",
    accessorKey: "stock",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
          {data.row.original.stock || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Stock Type",
    accessorKey: "stock_type",
    cell: (data) => {
      return (
        <Typography
          sx={{
            textAlign: "left",
            textTransform: "capitalize",
            width: { sm: "40%", md: "30%", lg: "35%" },
            fontSize: "14px",
            fontWeight: "600px",
          }}
        >
          {data.row.original.stock_type || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Transaction Type",
    accessorKey: "txn_type",
    cell: (data) => {
      return (
        <Typography
          textAlign="left"
          sx={{
            textTransform: "uppercase",
            fontSize: "14px",
            fontWeight: "400",
          }}
        >
          {data.row.original.txn_type || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Sector",
    accessorKey: "sector",
    cell: (data) => {
      return (
        <Typography
          textAlign="left"
          sx={{ fontSize: "14px", fontWeight: "400" }}
        >
          {data.row.original.sector || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Total Units",
    accessorKey: "total_units",
    cell: (data) => {
      return (
        <Typography
          textAlign="right"
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            width: { md: "50%", lg: "80%", xl: "60%" },
            maxWidth: "60px",
          }}
        >
          {data.row.original.total_units ?? "-"}
        </Typography>
      );
    },
  },
  {
    header: "Locked Balance",
    accessorKey: "locked_balance",
    cell: (data) => {
      return (
        <Typography
          textAlign="right"
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            width: { md: "50%", lg: "90%", xl: "60%" },
            maxWidth: "90px",
          }}
        >
          {data.row.original.locked_balance ?? "-"}
        </Typography>
      );
    },
  },
  {
    header: "Free Balance",
    accessorKey: "free_balance",
    cell: (data) => {
      return (
        <Typography
          textAlign="right"
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            width: { md: "60%", lg: "80%", xl: "60%" },
            maxWidth: "70px",
          }}
        >
          {data.row.original.free_balance ?? "-"}
        </Typography>
      );
    },
  },
  {
    header: "Unlock Date",
    accessorKey: "unlock_date",
    cell: (data) => {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Typography
            textAlign="center"
            sx={{
              fontSize: "14px",
              fontWeight: "400",
              width: "max-content",
            }}
          >
            {data.row.original?.unlock_date?.split("T")[0] || "-"}
          </Typography>
        </Box>
      );
    },
  },
  {
    header: "Remaining Days Unlock",
    accessorKey: "remaining_days_unlock",
    cell: (data) => {
      return (
        <Typography
          textAlign="center"
          sx={{ fontSize: "14px", fontWeight: "400" }}
        >
          {data.row.original.remaining_days_unlock ?? "-"}
        </Typography>
      );
    },
  },
];
