import { Typography } from "@mui/material";

type StockBrokerHeaders = {
  schemeCode: number;
  accHeadPayable: number;
  ledgerHeadPayable: number;
  accHeadReceivable: number;
  ledgerHeadReceivable: number;
  actions: any;
};

export const StockBrokerSetupTableHeader = [
  {
    header: "Scheme Code",
    accessorKey: "schemeCode",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>{data}</Typography>;
    },
  },
  {
    header: "Acc Head Payable",
    accessorKey: "accHeadPayable",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>{data}</Typography>;
    },
  },
  {
    header: "Ledger Head Payable",
    accessorKey: "ledgerHeadPayable",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>{data}</Typography>;
    },
  },
  {
    header: "Acc Head Receivable",
    accessorKey: "accHeadReceivable",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>{data}</Typography>;
    },
  },
  {
    header: "Ledger Head Receivable",
    accessorKey: "ledgerHeadReceivable",
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
