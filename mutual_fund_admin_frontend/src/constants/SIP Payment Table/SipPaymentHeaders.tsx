import { Box, Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { IndeterminateCheckbox } from "components/Table/PostingTable";
// import { Visibility } from "@mui/icons-material";
// import { colorTokens } from "../../theme";
// import ViewModal from "components/Modal/ViewModal";
// import { useState } from "react";

type SipInstallmentHeaders = {
  regNo: number;
  interval: number;
  actionDate: string;
  payment_status: string;
  applied_unit: number;
  payment_date: string;
  // sipAmt: string;
};

export const SipInstallmentPaymentHeaders: ColumnDef<SipInstallmentHeaders>[] =
  [
    {
      id: "select",
      header: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
    },
    {
      header: "S.No",
      accessorKey: "SN",
      cell: (data) => {
        return (
          <Box>
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.index + 1}</Typography>
          </Box>
        );
      },
    },
    {
      header: "SIP Registration No.",
      size: 1,
      accessorKey: "regNo",
      cell: (data) => {
        return (
          <Box>
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.regNo}</Typography>
          </Box>
        );
      },
    },
    {
      header: "Installment No.",
      size: 1,
      accessorKey: "interval",
      cell: (data) => {
        return (
          <Box>
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}> {data.row.original.interval}</Typography>
          </Box>
        );
      },
    },
    {
      header: "Applied Units",
      // size: 1,
      accessorKey: "applied_unit",
      cell: (data) => {
        return (
          <Box>
            <Typography textAlign="right" width="40%" sx={{ fontSize: "14px", fontWeight: 400 }}>
              {data.row.original.applied_unit}
            </Typography>
          </Box>
        );
      },
    },
    {
      header: "Payment Date",
      accessorKey: "payment_data",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data?.row?.original?.payment_date.split('T')[0]}</Typography>;
      },
    },
    {
      header: "Status",
      accessorKey: "payment_status",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.payment_status}</Typography>;
      },
    },
  ];
