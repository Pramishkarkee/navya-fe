import { Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";

type VendorDetails = {
  txn: string;
  vendor: string;
  volume: string;
  success_rate: string;
};

export const VendorDetailsHeader: ColumnDef<VendorDetails>[] = [
  {
    header: "S.No",
    cell: ({ row }) => {
      return <Typography>{row.index + 1}</Typography>;
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
    header: "Volume of Transaction",
    accessorKey: "volume",
    cell: ({ row }) => {
      return <Typography>{row.original.volume}</Typography>;
    },
  },
  {
    header: "Transaction",
    accessorKey: "txn",
    cell: ({ row }) => {
      return <Typography>{row.original.txn}</Typography>;
    },
  },

  {
    header: "Success Rate (%)",
    accessorKey: "success_rate",
    cell: ({ row }) => {
      return <Typography>{row.original.success_rate}</Typography>;
    },
  },
];
