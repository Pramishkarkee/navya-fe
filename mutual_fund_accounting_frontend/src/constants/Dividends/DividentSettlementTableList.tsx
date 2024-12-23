import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { colorTokens } from "../../theme";
import ViewModal from "components/Modal/ViewModal";

type DividendsSettlementTableHeaders = {
  id: number;
  stock_name: number;
  bank_name: string;
  bank_account: string;
  settlement_date: string;
  txn_type: string;
  amount: string;
  payment_id: string;
  created_at: string;
  updated_at: string;
  remarks: string;
  stock_symbol: string;
};

export const DividentSettlementTableList: ColumnDef<DividendsSettlementTableHeaders>[] =
  [
    {
      header: "ID",
      accessorKey: "id",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {data.row.original.id}
          </Typography>
        );
      },
    },
    {
      header: "Stock Symbol",
      accessorKey: "stock_symbol",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {data.row.original.stock_symbol}
          </Typography>
        );
      },
    },
    {
      header: "Bank Name",
      accessorKey: "bank_name",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {data.row.original.bank_name}
          </Typography>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
          >
            {Number(data.row.original.amount)
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Typography>
        );
      },
    },
    {
      header: "Cheque/Payment ID",
      accessorKey: "payment_id",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400px",
              display: "flex",
              justifyContent: "flex-start",
              width: "100px",
            }}
          >
            {" "}
            {data.row.original.payment_id}
          </Typography>
        );
      },
    },
    {
      header: "Payment Method",
      accessorKey: "txn_type",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {data.row.original.txn_type === "fund_transfer"
              ? "Fund Transfer"
              : "Cheque"}
          </Typography>
        );
      },
    },

    {
      header: "Actions",
      accessorKey: "actions",
      cell: (data) => {
        const [open, setOpen] = useState(false);
        const handleToggleView = () => {
          setOpen(!open);
        };

        const modalData: Record<string, any> = {
          ID: data.row.original.id || "",
          "Stock Name": data.row.original.stock_name || "N/A",
          "Bank Name": data.row.original.bank_name.toString() || "N/A",
          "Bank Account": data.row.original.bank_account || "N/A",
          "Stock Symbol": data.row.original.stock_symbol || "N/A",
          Amount:
            parseFloat(data.row.original.amount)
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "N/A",
          "Cheque/Payment ID": data.row.original.payment_id || "N/A",
          "Narration/Remarks": data.row.original.remarks || "N/A",
          "Created Date": data.row.original.created_at?.split("T")[0] || "N/A",
          "Settlement Date": data.row.original.settlement_date || "N/A",
        };

        return (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1.5,
                justifyContent: "center",
              }}
            >
              <ViewModal open={open} setOpen={setOpen} data={modalData} />

              <Box
                onClick={handleToggleView}
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
                {open ? (
                  <VisibilityOff sx={{ fontSize: "14px", fontWeight: 600 }} />
                ) : (
                  <Visibility sx={{ fontSize: "14px", fontWeight: 600 }} />
                )}
                <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                  {open ? "Hide Details" : "View Details"}
                </Typography>
              </Box>
            </Box>
          </>
        );
      },
    },
  ];
