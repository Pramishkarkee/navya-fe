import { Typography, Box, useTheme } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import ViewModal from "components/Modal/ViewModal";
import { colorTokens } from "../../theme";

export interface InterestCollectionTableHeaders {
  id: number;
  interest_name: string;
  deposit_amount: string;
  interest_rate: string;
  interest_paid_amount: string;
  interest_type: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  fix_deposit: number;
  debentures: string | number;
  bank_id: string;
  interval: string;
  maturity_date: string;
  accrued_interest: number;
}

export const InterestCollectionTableList: ColumnDef<InterestCollectionTableHeaders>[] =
  [
    {
      header: "ID",
      accessorKey: "id",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
          >
            {data.row.original.id}
          </Typography>
        );
      },
    },

    {
      header: "Name",
      accessorKey: "interest_name",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
          >
            {data.row.original.interest_name}
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
              fontWeight: "400px",
              textAlign: "right",
              width: "60%",
            }}
          >
            {Number(data.row.original.deposit_amount).toLocaleString()}
          </Typography>
        );
      },
    },

    {
      header: "Interest Rate",
      accessorKey: "interest_rate",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400px",
              textAlign: "left",
              width: "80%",
            }}
          >
            {data.row.original.interest_rate}
          </Typography>
        );
      },
    },

    {
      header: "Interest Accrued",
      accessorKey: "interest_paid_amount",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400px",
              textAlign: "right",
              width: "60%",
            }}
          >
            {Number(data.row.original.interest_paid_amount).toLocaleString()}
          </Typography>
        );
      },
    },
    {
      header: "Interest Frequency",
      accessorKey: "interval",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
          >
            {data.row.original.interval === "monthly"
              ? "Monthly"
              : data.row.original.interval === "quarterly"
              ? "Quarterly"
              : data.row.original.interval === "semi-annually"
              ? "Semi-Annually"
              : data.row.original.interval === "annually"
              ? "Annually"
              : "N/A"}
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
            sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
          >
            {data.row.original.maturity_date}
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
          Name: data.row.original.interest_name || "N/A",
          "Deposit Amount": data.row.original.deposit_amount
            ? Number(data.row.original.deposit_amount).toLocaleString()
            : "N/A",
          "Interest Rate": data.row.original.interest_rate?.toString() || "N/A",
          "Interest Accrued": data.row.original.interest_paid_amount
            ? Number(data.row.original.interest_paid_amount).toLocaleString()
            : "N/A",
          "Interest Frequency":
            data.row.original.interval === "monthly"
              ? "Monthly"
              : data.row.original.interval === "quarterly"
              ? "Quarterly"
              : data.row.original.interval === "semi-annually"
              ? "Semi-Annually"
              : data.row.original.interval === "annually"
              ? "Annually"
              : "N/A",
          "Maturity Date": data.row.original.maturity_date || "N/A",
          "Interest Type":
            data.row.original.interest_type?.toString() === "fix_deposit"
              ? "Fix Deposit"
              : "N/A",
          "Accrued Interest":
            data.row.original.accrued_interest?.toString() || "N/A",
          Debenture: data.row.original.debentures?.toString() || "-",
          "Fix Deposit": data.row.original.fix_deposit?.toString() || "N/A",
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
