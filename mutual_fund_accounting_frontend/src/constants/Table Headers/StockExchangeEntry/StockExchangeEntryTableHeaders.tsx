import { Typography } from "@mui/material";

type StockExchangeEntryHeaders = {
  commType: number;
  rangeFrom: Date;
  rangeTo: Date;
  value: number;
  valueType: string;
  actions: any;
};

export const StockExchangeEntryTableHeader = [
  {
    header: "Comm type",
    accessorKey: "commtype",
    cell: (data) => {
      return <Typography>{data}</Typography>;
    },
  },
  {
    header: "Range From",
    accessorKey: "rangeFrom",
    cell: (data) => {
      return <Typography>{data}</Typography>;
    },
  },
  {
    header: "Range To",
    accessorKey: "rangeTo",
    cell: (data) => {
      return <Typography>{data}</Typography>;
    },
  },
  {
    header: "Value",
    accessorKey: "value",
    cell: (data) => {
      return <Typography>{data}</Typography>;
    },
  },
  {
    header: "Value Type",
    accessorKey: "valueType",
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
