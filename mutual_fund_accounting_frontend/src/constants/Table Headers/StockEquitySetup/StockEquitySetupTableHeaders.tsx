import { Typography } from "@mui/material";

type StockEquityHeaders = {
  stockID: number;
  stockName: string;
  listed: boolean;
  stockExchangeName: string;
  symbol: string;
  shareValue: number;
  capital: string;
  actions: any;
};

export const StockEquitySetupTableHeaders = [
  {
    header: "Stock ID",
    accessorKey: "stockID",
    cell: (data) => {
      return <Typography>{data}</Typography>;
    },
  },
  {
    header: "Stock Name",
    accessorKey: "stockName",
    cell: (data) => {
      return <Typography>{data}</Typography>;
    },
  },
  {
    header: "Listed?",
    accessorKey: "listed",
    cell: (data) => {
      return <Typography>{data}</Typography>;
    },
  },
  {
    header: "Stock Exchange Name",
    accessorKey: "stockExchangeName",
    cell: (data) => {
      return <Typography>{data}</Typography>;
    },
  },
  {
    header: "Symbol",
    accessorKey: "symbol",
    cell: (data) => {
      return <Typography>{data}</Typography>;
    },
  },
  {
    header: "Share Value",
    accessorKey: "shareValue",
    cell: (data) => {
      return <Typography>{data}</Typography>;
    },
  },
  {
    header: "Capital",
    accessorKey: "capital",
    cell: (data) => {
      return <Typography>{data}</Typography>;
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: (data) => {
      return <Typography>{data}</Typography>;
    },
  },
];
