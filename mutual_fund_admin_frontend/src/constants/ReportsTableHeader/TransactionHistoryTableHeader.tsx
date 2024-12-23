import { Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";

type TransactionHistory = {
  date_time: string;
  txn_id: string;
  vendor: string;
  name: string;
  boid: string;
  amount: number;
  phone: string;
};

export const TransactionHistoryHeader: ColumnDef<TransactionHistory>[] = [
  {
    header: "S.No",
    cell: ({ row }) => {
      return <Typography>{row.index + 1}</Typography>;
    },
  },
  {
    header: "Date & Time",
    accessorKey: "date_time",
    cell: ({ row }) => {
      return <Typography>{row.original.date_time}</Typography>;
    },
  },
  {
    header: "Transaction ID",
    accessorKey: "txn_id",
    cell: ({ row }) => {
      return <Typography>{row.original.txn_id}</Typography>;
    },
  },
  {
    header: "Vendor",
    accessorKey: "vendor",
    cell: ({ row }) => {
      return <Typography>{row.original.vendor}</Typography>;
    },
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => {
      return <Typography>{row.original.name}</Typography>;
    },
  },
  {
    header: "BOID",
    accessorKey: "boid",
    cell: ({ row }) => {
      return <Typography>{row.original.boid}</Typography>;
    },
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => {
      return <Typography>{row.original.amount}</Typography>;
    },
  },
  {
    header: "Contact Number",
    accessorKey: "phone",
    cell: ({ row }) => {
      return <Typography>{row.original.phone}</Typography>;
    },
  },
];
