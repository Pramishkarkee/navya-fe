import { Typography } from "@mui/material";

type BankInvestmentParameterHeaders = {
  schemeCode: number;
  bankCode: number;
  bankName: string;
  sectorId: number;
  externalLimit: number;
  internalLimit: number;
  schemeLimit: number;
  actions: any;
};

export const BankInvestmentParameterTableHeader = [
  {
    header: "Scheme Code",
    accessorKey: "schemeCode",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>{data}</Typography>;
    },
  },
  {
    header: "Bank Code",
    accessorKey: "bankCode",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>{data}</Typography>;
    },
  },
  {
    header: "Bank Name",
    accessorKey: "bankName",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>{data}</Typography>;
    },
  },
  {
    header: "Sector ID",
    accessorKey: "sectorId",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>{data}</Typography>;
    },
  },
  {
    header: "External Limit",
    accessorKey: "externalLimit",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>{data}</Typography>;
    },
  },
  {
    header: "Internal Limit",
    accessorKey: "internalLimit",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>{data}</Typography>;
    },
  },
  {
    header: "Scheme Limit",
    accessorKey: "schemeLimit",
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
