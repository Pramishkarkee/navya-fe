import { Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";

type MutualFundSetup = {
    boid_no: string;
    full_name: string;
    allotted_unit: number;
    contact1: string;
    amount: number;
  };

export const SchemeFileUloadTableHeader: ColumnDef<MutualFundSetup>[] = [
    {
      header: "BOID",
      accessorKey: "boid_no",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
          >
            {data.row.original.boid_no}
          </Typography>
        );
      },
    },
    {
      header: "Name",
      accessorKey: "full_name",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
          >
            {data.row.original.full_name}
          </Typography>
        );
      },
    },
    {
      header: "Units Held",
      accessorKey: "allotted_unit",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
          >
            {data.row.original.allotted_unit}
          </Typography>
        );
      },
    },
    {
      header: "Phone Number",
      accessorKey: "contact1",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
          >
            {data.row.original.contact1}
          </Typography>
        );
      },
    },
    {
      header: "Total Amount",
      accessorKey: "amount",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "center" }}
          >
            {data.row.original.amount}
          </Typography>
        );
      },
    },
  ];
  