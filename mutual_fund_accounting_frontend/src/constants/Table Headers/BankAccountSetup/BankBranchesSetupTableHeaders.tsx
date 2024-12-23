import { Typography } from "@mui/material";

type BankBranchesHeaders = {
  branchID: number;
  address: string;
  telephoneNo: number;
  cpiCode: number;
  actions: any;
};

export const BankBranchesSetupTableHeaders = [
  {
    header: "Branch ID",
    accessorKey: "branchID",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>{data}</Typography>;
    },
  },
  {
    header: "Address",
    accessorKey: "address",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>{data}</Typography>;
    },
  },
  {
    header: "Telephone No.",
    accessorKey: "telephoneNo",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>{data}</Typography>;
    },
  },
  {
    header: "CIPS Code",
    accessorKey: "cpiCode",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>{data}</Typography>;
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>{data}</Typography>;
    },
  },
];
