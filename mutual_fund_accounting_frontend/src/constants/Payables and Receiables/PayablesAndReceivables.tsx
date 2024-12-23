import { Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";

type PayableAndReceivables = {
  sn: number;
  date: string;
  type: string;
  description: string;
  amount: number;
  day: string;
};

export const PayablesAndReceivablesTableHeader: ColumnDef<PayableAndReceivables>[] =
  [
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
      header: "Date",
      accessorKey: "date",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {data.row.original.date || "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "Day",
      accessorKey: "day",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {data.row.original.day || "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "Type",
      accessorKey: "type",
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
            {data.row.original.type || "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "Description",
      accessorKey: "description",
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
            {data.row.original.description || "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (data) => {
        return (
          <Typography
            textAlign="center"
            sx={{ fontSize: "14px", fontWeight: "400" }}
          >
            {data.row.original.amount || "-"}
          </Typography>
        );
      },
    },
  ];
