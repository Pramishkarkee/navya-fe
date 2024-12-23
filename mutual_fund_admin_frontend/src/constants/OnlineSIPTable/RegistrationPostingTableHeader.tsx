import { Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";

type RegistrationPostingHeaders = {
  sn: number;
  boid: number;
  name: string;
  appliedUnits: number;
  appliedDate: Date;
  amount: number;
  transactionID: number;
  actions: any;
};

export const OnlineSIPPaymentPostingTableHeader: ColumnDef<RegistrationPostingHeaders>[] =
  [
    {
      header: "S.No.",
      accessorKey: "sn",
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
      header: "Name",
      accessorKey: "name",
      cell: () => {
        return (
          <Typography>Hello</Typography>
        )
      },
    },
    {
      header: "Applied Units",
      accessorKey: "appliedUnits",
      cell: () => {
        return (
          <Typography>Hello</Typography>
        )
      },
    },
    {
      header: "Applied Date",
      accessorKey: "appliedDate",
      cell: () => {
        return (
          <Typography>Hello</Typography>
        )
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: () => {
        return (
          <Typography>Hello</Typography>
        )
      },
    },
    {
      header: "Transaction ID",
      accessorKey: "transactionID",
      cell: () => {
        return (
          <Typography>Hello</Typography>
        )
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: () => {
        return (
          <Typography>Hello</Typography>
        )
      },
    },
  ];
