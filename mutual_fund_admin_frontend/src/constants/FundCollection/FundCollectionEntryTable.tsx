import { Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";

type EntryHeaders = {
  sip: number;
  name: string;
  boid: number;
  sipAmt: number;
  receivedAmt: number;
  balanceAmt: number;
  actionDate: Date;
};

export const FundCollectionEntryTableHeader: ColumnDef<EntryHeaders>[] = [
  {
    header: "SIP Reg.No",
    accessorKey: "regNo",
    cell: () => {
      return (
        <Typography>Hello</Typography>
      )
    },
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: () => {
      return (
        <Typography>Hello</Typography>
      )
    },
  },
  {
    header: "BOID",
    accessorKey: "boid",
    cell: () => {
      return (
        <Typography>Hello</Typography>
      )
    },
  },
  {
    header: "SIP Amount",
    accessorKey: "sipAmt",
    cell: () => {
      return (
        <Typography>Hello</Typography>
      )
    },
  },
  {
    header: "Received Amount",
    accessorKey: "receivedAmt",
    cell: () => {
      return (
        <Typography>Hello</Typography>
      )
    },
  },
  {
    header: "Balance Amount",
    accessorKey: "balanceAmt",
    cell: () => {
      return (
        <Typography>Hello</Typography>
      )
    },
  },
  {
    header: "Action Date",
    accessorKey: "actionDate",
    cell: () => {
      return (
        <Typography>Hello</Typography>
      )
    },
  },
  {
    header: "Due Day",
    accessorKey: "due",
    cell: () => {
      return (
        <Typography>Hello</Typography>
      )
    },
  },
];
