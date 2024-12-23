/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import ErrorBar from "components/Snackbar/ErrorBar";
import SuccessBar from "components/Snackbar/SuccessBar";
import { Box, Typography, useTheme } from "@mui/material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

export interface DayCloseData {
  id: number;
  day_close_by: string;
  day_close_approved_by: string;
  asset_total: number;
  liability_total: number;
  income_total: number;
  expenses_total: number;
  equity_total: number;
  units_total: number;
  remarks: string | null;
  closing_day: string;
  is_include_admin: boolean;
  fees_report_filename: string;
  created_at: string;
  updated_at: string;
  date_time: string;
  net_asset_value: number;
  nav_value: number;
  prev_nav: number;
  nav_change_percentage: number;
}

export const DayCloseListEntryHeader: ColumnDef<DayCloseData>[] = [
  {
    header: "Day Close For",
    accessorKey: "closing_day",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400px",
            textAlign: "left",
            width: "max-content",
          }}
        >
          {data?.row?.original?.closing_day.split("T")[0]}
        </Typography>
      );
    },
  },
  {
    header: "Day Close Date",
    accessorKey: "created_at",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400px",
            textAlign: "left",
            width: "max-content",
          }}
        >
          {data?.row?.original?.created_at.split("T")[0]}
        </Typography>
      );
    },
  },
  {
    header: "TimeStamp",
    accessorKey: "created_at",
    cell: (data) => {
      const transactionDate = new Date(data?.row?.original?.created_at);
      const nepaliTime = transactionDate.toLocaleTimeString("en-US");
      return (
        <Typography
          sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
        >
          {nepaliTime}
        </Typography>
      );
    },
  },
  {
    header: "Subscribed Units",
    accessorKey: "units_total",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400px",
            textAlign: "right",
            width: "95px",
          }}
        >
          {data?.row?.original?.units_total.toLocaleString()}
        </Typography>
      );
    },
  },
  {
    header: "Total Assets",
    accessorKey: "asset_total",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400px",
            textAlign: "right",
            width: "85px",
          }}
        >
          {data?.row?.original?.asset_total.toLocaleString()}
        </Typography>
      );
    },
  },
  {
    header: "Total Liabilities",
    accessorKey: "liability_total",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400px",
            textAlign: "right",
            width: "90px",
          }}
        >
          {data?.row?.original?.liability_total.toLocaleString()}
        </Typography>
      );
    },
  },
  {
    header: "Net Assets Value",
    accessorKey: "net_asset_value",
    cell: (data) => {
      return (
        <Typography
          sx={{
            textAlign: "right",
            fontSize: "14px",
            fontWeight: "400px",
            width: "100px",
          }}
        >
          {data?.row?.original?.net_asset_value.toLocaleString()}
        </Typography>
      );
    },
  },
  {
    header: "NAV",
    accessorKey: "nav_value",
    cell: (data) => {
      return (
        <Typography
          align="right"
          sx={{
            fontSize: "14px",
            fontWeight: "400px",
            width: { sm: "80%", md: "60%", lg: "40%" },
          }}
        >
          {Number(data?.row?.original?.nav_value).toLocaleString()}
        </Typography>
      );
    },
  },

  {
    header: "% Change",
    accessorKey: "nav_change_percentage",
    cell: (data) => {
      return (
        <Typography
          align="right"
          sx={{
            fontSize: "14px",
            fontWeight: "400px",
            width: "55px",
          }}
        >
          {Number(data?.row?.original?.nav_change_percentage)
            .toFixed(2)
            .toLocaleString()}
        </Typography>
      );
    },
  },
  {
    header: "Day Close By",
    accessorKey: "day_close_by",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400px",
            textTransform: "capitalize",
          }}
        >
          {data?.row?.original?.day_close_by}
        </Typography>
      );
    },
  },

  {
    header: "Approved By",
    accessorKey: "day_close_approved_by",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400px",
            textAlign: "center",
            textTransform: "capitalize",
          }}
        >
          {data?.row?.original?.day_close_approved_by}
        </Typography>
      );
    },
  },
  {
    header: () => (
      <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
        Actions
      </Typography>
    ),
    accessorKey: "actions",
    cell: (data) => {
      const theme = useTheme();
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const [errorMsgs, setErrorMsgs] = useState<string>("");
      const [errorsbarOpen, setErrorbarOpen] = useState<boolean>(false);
      const [successBarOpen, setSuccessBarOpen] = useState<boolean>(false);

      const handleFeesReport = async () => {
        try {
          const anchor = document.createElement("a");
          const file = `${BASE_URL}/accounting/api/v1/accounting/fees-excel-download/${data.row.original.fees_report_filename}/`;
          const headers = new Headers();
          headers.append(
            "Authorization",
            `Bearer ${localStorage.getItem("access_token")}`
          );
          const response = await fetch(file, { headers });
          if (!response.ok) {
            throw new Error("Failed to fetch the file");
          }
          const blob = await response.blob();
          const objectUrl = window.URL.createObjectURL(blob);
          anchor.href = objectUrl;
          const closingDate = data?.row?.original?.closing_day.split("T")[0];
          anchor.download = `Fees Report ${closingDate}.xlsx`;
          anchor.click();
          window.URL.revokeObjectURL(objectUrl);
          setSuccessBarOpen(true);
        } catch (error) {
          setErrorbarOpen(true);
          setErrorMsgs("Error downloading the file");
        }
      };

      return (
        <>
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1.5,
                justifyContent: "center",
              }}
            >
              <SuccessBar
                snackbarOpen={successBarOpen}
                setSnackbarOpen={setSuccessBarOpen}
                message="Report Downloaded Successfully"
              />
              <ErrorBar
                snackbarOpen={errorsbarOpen}
                message={errorMsgs}
                setSnackbarOpen={setErrorbarOpen}
              />

              <Box
                onClick={handleFeesReport}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 0.5,
                  alignItems: "center",
                  color: theme.palette.primary.pureColor,
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
              >
                <ArticleOutlinedIcon
                  sx={{ fontSize: "14px", fontWeight: 400 }}
                />
                <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
                  Fees Report
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      );
    },
  },
];
