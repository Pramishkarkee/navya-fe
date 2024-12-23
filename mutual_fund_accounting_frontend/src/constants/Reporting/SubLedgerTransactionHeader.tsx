import { Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";

type SubLedgerTable = {
  sn: number;
  description: string;
  amount: number;
  transaction_date: string;
  entry_type: string;
  balance: number;
  total_debit_amount: number;
  total_credit_amount: number;
};

export const SubLedgerTransactionHeaders: ColumnDef<SubLedgerTable>[] = [
  {
    header: "SN",
    accessorKey: "sn",
    cell: (data) => {
      // const rowIndex = data.row.index;
      // const totalRows = data.table.getRowModel().rows.length;

      // if (rowIndex === totalRows - 1 || rowIndex === 0) {
        // return null;
      // }
      return (
        <Typography
          sx={{ fontSize: "14px", fontWeight: 400, textAlign: "center" }}
        >
          {data.row.original.sn} 
        </Typography>
      );
    },
  },
  
  {
    header: "Date",
    accessorKey: "transaction_date",
    cell: (data) => {
      return (
        <Typography
          textAlign="start"
          sx={{ fontSize: "14px", fontWeight: 400, minWidth: "65px" }}
        >
          {data.row.original.transaction_date.split("T")[0] || ""}
        </Typography>
      );
    },
  },
  {
    header: "Particulars",
    accessorKey: "description",
    cell: (data) => {
      return (
        <Typography
          sx={{ 
            fontSize: "14px",
            textTransform:'capitalize',
            fontWeight: data.row.original.description === 'opening balance' 
                     || data.row.original.description === 'closing balance' 
                     || data.row.original.description === 'Total amount' ? 600 : 400, 
            textAlign: "start",
          }}
        >
          {data.row.original.description === "Total amount" ? "Total" : data.row.original.description || "N/A"}
        </Typography>
      );
    },

  },
  {
    header: "Debit (NPR)",
    accessorKey: "amount",
    cell: (data) => {
      return (
        <Typography
          sx={{
            textAlign: "right",
            // width: { sm: "40%", md: "50%", lg: "55%" },
            fontSize: "14px",
            fontWeight: data.row.original.description === 'opening balance' 
                     || data.row.original.description === 'closing balance' 
                     || data.row.original.description === 'Total amount'
                     ? 600 : 400,
          }}
        >
          {data.row.original.entry_type === "Debit"
            ? data.row.original.amount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) ?? "-"  
            : data.row.original.entry_type === null ? 
              data.row.original?.total_debit_amount?.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) ?? "-"
             : " "}
        </Typography>
      );
    },
  },
  {
    header: "Credit (NPR)",
    accessorKey: "amount",
    cell: (data) => {
    //   function formatWithoutRounding(amount) {
    //     const truncatedAmount = Math.floor(amount * 100) / 100;
    //     return truncatedAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    // }
      return (
        <Typography sx={{ 
          fontSize: "14px",
          textAlign: "right", 
          fontWeight: data.row.original.description === 'opening balance' 
                   || data.row.original.description === 'closing balance'
                   || data.row.original.description === 'Total amount'
                   ? 600 : 400
          }}>
          {data.row.original.entry_type === "Credit"
            // ? formatWithoutRounding(data.row.original.amount) ?? "-"
            ? data.row.original.amount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) ?? "-"
            : data.row.original.entry_type === null ?
              data.row.original?.total_credit_amount?.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) ?? "-"
            :" "}
        </Typography>
      );
    },
  },
  {
    header: "Balance (NPR)",
    accessorKey: "amount",
    cell: (data) => {
      return (
        <Typography
          sx={{
            textAlign: "right",
            width:  "100px",
            fontSize: "14px",
            fontWeight: data.row.original.description === 'opening balance'
                    ||  data.row.original.description === 'closing balance'
                    ||  data.row.original.description === 'Total amount' 
                    ? 600 : 400,
          }}
        >  
        {data.row.original.balance.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) ?? "-"}  
        </Typography>
      );
    },
  },
];
