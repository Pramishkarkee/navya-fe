import { Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";

type PostingHeaders = {
  transactionNo: number;
  sipRegNo: number;
  name: string;
  boid: number;
  sipAmt: number;
  receivedAmt: number;
  sipInstallment: number;
};

export const FundCollectionPostingTableHeader: ColumnDef<PostingHeaders>[] = [
  {
    header: "Transaction No.",
    accessorKey: "transactionNo",
    cell: () => {
      <Typography>Hello</Typography>;
    },
  },
  {
    header: "BOID",
    accessorKey: "boid",
    cell: () => {
      <Typography>Hello</Typography>;
    },
  },
  {
    header: "SIP Reg.No",
    accessorKey: "sipRegNo",
    cell: () => {
      <Typography>Hello</Typography>;
    },
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: () => {
      <Typography>Hello</Typography>;
    },
  },
  {
    header: "SIP Amount",
    accessorKey: "sipAmt",
    cell: () => {
      <Typography>Hello</Typography>;
    },
  },
  {
    header: "Received Amount",
    accessorKey: "receivedAmt",
    cell: () => {
      <Typography>Hello</Typography>;
    },
  },
  {
    header: "SIP Installment",
    accessorKey: "sipInstallment",
    cell: () => {
      <Typography>Hello</Typography>;
    },
  },
];
