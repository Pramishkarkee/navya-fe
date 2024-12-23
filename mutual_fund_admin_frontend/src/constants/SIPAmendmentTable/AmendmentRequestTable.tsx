import { Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";

type AmendmentRequestHeader = {
  sn: number;
  holderNo: number;
  name: string;
  boid: number;
  holderType: string;
  schemeName: string;
  distributionCenter: string;
  action: any;
};

export const AmendmentRequestEntryTableHeader: ColumnDef<AmendmentRequestHeader>[] =
  [
    {
      header: "S.No.",
      accessorKey: "sn",
      cell: () => {
        <Typography>Hello</Typography>;
      },
    },
    {
      header: "Holder Number",
      accessorKey: "holderNumber",
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
      header: "BOID",
      accessorKey: "boid",
      cell: () => {
        <Typography>Hello</Typography>;
      },
    },
    {
      header: "Holder Type",
      accessorKey: "holderType",
      cell: () => {
        <Typography>Hello</Typography>;
      },
    },
    {
      header: "Scheme Name",
      accessorKey: "schemeName",
      cell: () => {
        <Typography>Hello</Typography>;
      },
    },
    {
      header: "Distriution Center",
      accessorKey: "distriutionCenter",
      cell: () => {
        <Typography>Hello</Typography>;
      },
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: () => {
        <Typography>Hello</Typography>;
      },
    },
  ];
