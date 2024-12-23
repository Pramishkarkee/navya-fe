/* eslint-disable react-hooks/rules-of-hooks */
import { Typography, Box } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import ViewModal from "components/Modal/ViewModal";
import { Visibility } from "@mui/icons-material";
import { colorTokens } from "../../theme";
import { useState } from "react";
import Auth from "utils/Auth";
import SuccessBar from "components/Snackbar/SuccessBar";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

export interface StockTransactionSettlementList {
  id: number;
  stock_transaction: string;
  txn_type: string;
  txn_amount: string;
  payment_id: string;
  is_approved: boolean;
  is_rejected: boolean;
  is_settled: boolean;
  created_at: string;
  updated_at: string;
  bank_account: string;
  effective_rate: number;
  capital_gain_tax: number;
  broker_charge: number;
  txn_id: string;
  units: number;
}

export const SettlementListTableEntryHeader: ColumnDef<StockTransactionSettlementList>[] =
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
      header: "Transaction Type",
      accessorKey: "txn_type",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400px",
              textAlign: "left",
              textTransform: "capitalize",
            }}
          >
            {data.row.original.txn_type || "N/A"}
          </Typography>
        );
      },
    },

    {
      header: "Stock Transaction",
      accessorKey: "stock_transaction",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
          >
            {data.row.original.stock_transaction || "N/A"}
          </Typography>
        );
      },
    },
    // {
    //   header: "Cheque Date",
    //   accessorKey: "cheque_date",
    //   cell: (data) => {
    //     return (
    //       <Typography sx={{ fontSize: "0.85rem", textAlign: "left", width: "max-content" }}>
    //         {data.row.original.cheque_date || 'N/A'}
    //       </Typography>
    //     );
    //   },
    // },

    // {
    //   header: "Cheque Number",
    //   accessorKey: "cheque_no",
    //   cell: (data) => {
    //     return (
    //       <Typography
    //         sx={{
    //           fontSize: "0.85rem",
    //           width: "100px",
    //         }}
    //       >
    //         {data.row.original.cheque_no || 'N/A'}
    //       </Typography>
    //     );
    //   },
    // },
    {
      header: "Payment Id",
      accessorKey: "payment_id",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400px",
              width: "100px",
            }}
          >
            {data.row.original.payment_id || "N/A"}
          </Typography>
        );
      },
    },

    {
      header: "Units",
      accessorKey: "units",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400px",
              display: "flex",
              justifyContent: "flex-end",
              width: "30px",
            }}
          >
            {Number(data.row.original.units).toLocaleString() || "N/A"}
          </Typography>
        );
      },
    },

    {
      header: "WACC Rate",
      accessorKey: "effective_rate",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400px",
              display: "flex",
              justifyContent: "flex-end",
              width: "65px",
              mr: 2,
            }}
          >
            {/* {Number(data.row.original.effective_rate).toLocaleString()} */}
            {data.row.original.effective_rate
              ? data.row.original.effective_rate.toLocaleString()
              : 0}
          </Typography>
        );
      },
    },

    {
      header: "Amount",
      accessorKey: "txn_amount",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400px",
              display: "flex",
              justifyContent: "flex-end",
              width: "45px",
            }}
          >
            {Number(data.row.original.txn_amount).toLocaleString() || "N/A"}
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

        const handleReceipt = () => {
          const anchor = document.createElement("a");
          document.body.appendChild(anchor);
          const file = `${BASE_URL}/sip-up/api/v1/sip/generate-report-file/${data.row.original.id}/`;

          const headers = new Headers();
          headers.append("Authorization", `Bearer ${Auth.getAccessToken()}`);

          fetch(file, { headers })
            .then((response) => {
              return response.blob();
            })
            .then((blobby) => {
              const objectUrl = window.URL.createObjectURL(blobby);

              anchor.target = "_blank";
              anchor.href = objectUrl;
              anchor.download = `Unit Receipt ${data?.row?.original?.id}.pdf`;
              anchor.click();

              window.URL.revokeObjectURL(objectUrl);
            })
            .then(() => setSuccessBarOpen(true));
        };

        const modalData: Record<string, string> = {
          ID: data.row.original.id?.toString() || "N/A",
          "Stock Transaction": data.row.original.stock_transaction,
          "Transaction Type":
            data.row.original.txn_type === "purchase"
              ? "Purchase"
              : data.row.original.txn_type === "sell"
              ? "Sell"
              : data.row.original.txn_type || "N/A",

          "Bank Account": data.row.original.bank_account || "N/A",
          "Transaction Amount":
            parseFloat(data.row.original.txn_amount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || "N/A",
          "WACC Rate":
            data.row.original.effective_rate.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || "N/A",
          "Created At": data.row.original.created_at?.split("T")[0] || "N/A",
          "Settled At": data.row.original.updated_at?.split("T")[0] || "N/A",
          "Is Settled": data.row.original.is_settled ? "Yes" : "No",
        };

        return (
          <>
            <Box>
              <ViewModal open={open} setOpen={setOpen} data={modalData} />
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <SuccessBar
                  snackbarOpen={successBarOpen}
                  setSnackbarOpen={setSuccessBarOpen}
                  message="Downloaded Successfully"
                />
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
                <Box
                  onClick={handleReceipt}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 0.5,
                    alignItems: "center",
                    color: colorTokens.mainColor[1100],
                    "&:hover": {
                      textDecoration: "underline",
                      cursor: "pointer",
                    },
                  }}
                >
                  <AssignmentOutlinedIcon
                    sx={{ fontSize: "14px", fontWeight: 400 }}
                  />
                  <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                    Document
                  </Typography>
                </Box>
              </Box>
            </Box>
          </>
        );
      },
    },
  ];
