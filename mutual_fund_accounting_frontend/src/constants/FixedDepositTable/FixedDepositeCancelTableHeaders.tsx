import { Typography, Box, useTheme } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import ViewModal from "components/Modal/ViewModal";
import { colorTokens } from "../../theme";

export interface CancelFDTableList {
  id: number;
  tax_on_interest_rate: string;
  deposit_method: string;
  account_number: string;
  transfer_charges: string;
  deposit_amount: string;
  interest_interval: string;
  interest_rate: string;
  deposit_date: string;
  maturity_date: string;
  cancellation_charge: string;
  remarks: string;
  cancelled_date: string;
  created_at: string;
  updated_at: string;
  bank: string;
  bank_account: number;
  collection_account: number;
  deposit_from: number;
  reaming_days: number;
}

export const CancelledFixedDepositTableEntryHeader: ColumnDef<CancelFDTableList>[] =
  [
    {
      header: "Deposit ID",
      accessorKey: "id",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
          >
            {data?.row?.original?.id}
          </Typography>
        );
      },
    },
    {
      header: "FD Name",
      accessorKey: "account_number",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
          >
            {data?.row?.original?.account_number || "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "Bank Name",
      accessorKey: "bank_name",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
          >
            {data?.row?.original?.bank || "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "Deposit Date",
      accessorKey: "deposit_date",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              textAlign: "left",
              width: "max-content",
            }}
          >
            {data?.row?.original?.deposit_date || "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "Maturity Date",
      accessorKey: "maturity_date",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              textAlign: "left",
              width: "max-content",
            }}
          >
            {data?.row?.original?.maturity_date || "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "Days until Maturity",
      accessorKey: "reaming_days",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
          >
            {data?.row?.original?.reaming_days || "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "Interest Rate (%)",
      accessorKey: "interest_rate",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
          >
            {data?.row?.original?.interest_rate || "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "Deposit Amount",
      accessorKey: "deposit_amount",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              textAlign: "right",
              width: "90px",
            }}
          >
            {Number(data?.row?.original?.deposit_amount).toLocaleString() ||
              "N/A"}
          </Typography>
        );
      },
    },

    {
      header: "Cancellation Charge (%)",
      accessorKey: "cancellation_charge",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              textAlign: "right",
              width: { md: "45px", lg: "65px", xl: "130px" },
            }}
          >
            {data?.row?.original?.cancellation_charge
              ? Number(data?.row?.original?.cancellation_charge).toFixed(2)
              : "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "Cancelled Date",
      accessorKey: "cancelled_date",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              textAlign: "center",
              mr: 2,
              width: "max-content",
            }}
          >
            {data.row.original.cancelled_date || "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (data) => {
        const [successBarOpen, setSuccessBarOpen] = useState(false);
        const [open, setOpen] = useState(false);
        const BASE_URL = import.meta.env.VITE_BASE_URL;
        const handleView = () => {
          setOpen(true);
        };

        const modalData: Record<string, string> = {
          ID: data.row.original.id?.toString() || "N/A",
          "FD Name": data.row.original.account_number || "N/A",
          "Bank Name": data.row.original.bank || "N/A",
          "Deposit Date": data.row.original.deposit_date || "N/A",
          "Maturity Date": data.row.original.maturity_date || "N/A",
          "Days until Maturity":
            String(data.row.original.reaming_days) || "N/A",
          "Interest Rate (%)": data.row.original.interest_rate || "N/A",
          "Deposit Amount": data.row.original.deposit_amount || "N/A",
          "Cancellation Charge %":
            data.row.original.cancellation_charge || "N/A",
          "Cancelled Date": data.row.original.cancelled_date || "N/A",
          "Cancellation Reason": data.row.original.remarks || "-",
          "Collection Account":
            String(data.row.original.collection_account) || "N/A",
          "Interest Frequency":
            data.row.original.interest_interval === "monthly"
              ? "Monthly"
              : data.row.original.interest_interval === "quarterly"
              ? "Quarterly"
              : data.row.original.interest_interval === "semi-annually"
              ? "Semi-Annually"
              : data.row.original.interest_interval === "annually"
              ? "Annually"
              : "N/A",
          "Deposit Method":
            data.row.original.deposit_method === "fund_transfer"
              ? "Fund Transfer"
              : "N/A",
        };

        return (
          <>
            <Box>
              <ViewModal open={open} setOpen={setOpen} data={modalData} />
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Box
                  onClick={handleView}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 0.6,
                    color: colorTokens.mainColor[1100],
                    "&:hover": {
                      textDecoration: "underline",
                      cursor: "pointer",
                    },
                  }}
                >
                  <Visibility sx={{ fontSize: "14px", fontWeight: 400 }} />
                  <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                    View
                  </Typography>
                </Box>
              </Box>
            </Box>
          </>
        );
      },
    },
  ];
