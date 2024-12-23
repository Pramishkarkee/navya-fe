import React from "react";
import { Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";

export interface DebentureSalesTableListHeaders {
  bond_and_debenture: string;
  bond_name: string;
  txn_price: string;
  txn_units: string;
  holding_days: string;
  total_amt: string;
  remaining_units: string;
  base_amt: string;
  broker_charge: string;
  sebon_charge: string;
  dp_charge: string;
  cgt_pct: string;
  cgt_amt: string;
}

export const DebentureSalesTableList: ColumnDef<DebentureSalesTableListHeaders>[] =
  [
    {
      header: "ID",
      accessorKey: "debenture_id",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.bond_and_debenture}
          </Typography>
        );
      },
    },
    {
      header: "Bond Name",
      accessorKey: "bond_name",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.bond_name || "N/A"}
          </Typography>
        );
      },
    },
    // {
    //   header: "Holding Days",
    //   accessorKey: "holding_days",
    //   cell: (data) => {
    //     return (
    //       <Typography sx={{ fontSize: "0.85rem", textAlign: "left" }}>
    //         {data.row.original.holding_days}
    //       </Typography>
    //     );
    //   },
    // },
    {
      header: "Sales Units",
      accessorKey: "txn_units",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              textAlign: "right",
              // width: { md: "75%", lg: "50%", xl: "40%" },
              width: { md: "30px", lg: "62px" },
              // width: "62px",
            }}
          >
            {Number(data.row.original.txn_units || "N/A").toLocaleString()}
          </Typography>
        );
      },
    },

    {
      header: "Sales Price",
      accessorKey: "txn_price",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              textAlign: "right",
              // width: { md: "75%", lg: "50%", xl: "40%" },
              width: { md: "28px", lg: "62px" },
              // width: "62px",
            }}
          >
            {Number(data.row.original.txn_price || "N/A").toLocaleString()}
          </Typography>
        );
      },
    },

    {
      header: "Amount",
      accessorKey: "base_amt",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              textAlign: "right",
              // width: { md: "75%", lg: "50%", xl: "40%" },
              width: "28px",
            }}
          >
            {Number(data.row.original.base_amt || "N/A").toLocaleString()}
          </Typography>
        );
      },
    },
    {
      header: "Broker Charge",
      accessorKey: "broker_charge",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              textAlign: "right",
              width: { md: "38px", lg: "78px" },
              // width: "78px",
            }}
          >
            {Number(data.row.original.broker_charge || "N/A").toLocaleString()}
          </Typography>
        );
      },
    },
    {
      header: "Sebon Charge",
      accessorKey: "sebon_charge",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              textAlign: "right",
              // width: { md: "75%", lg: "50%", xl: "40%" },
              width: "78px",
            }}
          >
            {Number(data.row.original.sebon_charge || "N/A").toLocaleString()}
          </Typography>
        );
      },
    },
    {
      header: "DP Charge",
      accessorKey: "dp_charge",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              textAlign: "right",
              // width: { md: "75%", lg: "50%", xl: "40%" },
              width: "60px",
            }}
          >
            {Number(data.row.original.dp_charge || "N/A").toLocaleString()}
          </Typography>
        );
      },
    },
    {
      header: "CGT %",
      accessorKey: "cgt_pct",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              textAlign: "right",
              // width: { md: "75%", lg: "50%", xl: "40%" },
              width: "35px",
            }}
          >
            {(data.row.original.cgt_pct ?? "-").toLocaleString()}
          </Typography>
        );
      },
    },
    {
      header: "CGT Amount",
      accessorKey: "cgt_amt",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              textAlign: "right",
              // width: { md: "75%", lg: "50%", xl: "40%" },
              width: "70px",
            }}
          >
            {(data.row.original.cgt_amt ?? "-").toLocaleString()}
          </Typography>
        );
      },
    },

    {
      header: "Sales Amount",
      accessorKey: "total_amt",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              textAlign: "right",
              width: { md: "100%", lg: "70%", xl: "80%" },
            }}
          >
            {Number(data.row.original.total_amt).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        );
      },
    },
    // {
    //   header: "Remaning Units",
    //   accessorKey: "remaining_units",
    //   cell: (data) => {
    //     return <Typography sx={{ fontSize: "0.85rem", textAlign: "right", width: "75%" }}>{Number(data.row.original.remaining_units).toLocaleString()}</Typography>;
    //   },
    // },
  ];
