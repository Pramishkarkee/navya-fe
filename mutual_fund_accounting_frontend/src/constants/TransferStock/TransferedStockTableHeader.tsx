/* eslint-disable react-hooks/rules-of-hooks */
import { Typography, Box, Button, Modal, useTheme } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { colorTokens } from "../../theme";
import { useState } from "react";
import SuccessBar from "components/Snackbar/SuccessBar";
import {
  useTransferUnlistedStockData,
  useGetAllUnlistedStockData,
} from "services/TransferStock/TransferStockServices";
import ErrorBar from "components/Snackbar/ErrorBar";
import ViewModal from "components/Modal/ViewModal";
import { Visibility } from "@mui/icons-material";

export interface BankTableList {
  id: any;
  symbol: string;
  sector: string;
  units: number;
  purchase_price: number;
  share_type: string;
  obj_id: number;
  is_listed: boolean;
  bonus_date: string;
  transfer_date: string;
  transfered_by: string;
}

export const TransferedStockTableEntryHeader: ColumnDef<BankTableList>[] = [
  {
    header: "Symbol",
    accessorKey: "symbol",
    cell: (data) => {
      return (
        <Typography
          sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
        >
          {data?.row?.original?.symbol || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Sector",
    accessorKey: "sector",
    cell: (data) => {
      return (
        <Typography
          sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
        >
          {data?.row?.original?.sector || "N/A"}
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
          sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
        >
          {data?.row?.original?.units || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Purchase Price",
    accessorKey: "purchase_price",
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
          {data?.row?.original?.purchase_price.toLocaleString() || "N/A"}
        </Typography>
      );
    },
  },

  {
    header: "Total Amount",
    accessorKey: "total_amount",
    cell: (data) => {
      const total_amount =
        data?.row?.original?.purchase_price * data?.row?.original?.units;
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400px",
            textAlign: "right",
            width: "75px",
          }}
        >
          {total_amount.toLocaleString() || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Share Type",
    accessorKey: "share_type",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "400px",
            textAlign: "left",
            textTransform: "uppercase",
          }}
        >
          {data?.row?.original?.share_type || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "is_listed",
    cell: (data) => {
      return (
        <Typography
          sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
        >
          {data?.row?.original?.is_listed ? "Listed" : "Unlisted"}
        </Typography>
      );
    },
  },
  {
    header: "Issue Date",
    accessorKey: "bonus_date",
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
          {data?.row?.original?.bonus_date?.split("T")[0] || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Transfered Date",
    accessorKey: "transfer_date",
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
          {data?.row?.original?.transfer_date?.split("T")[0] || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Transfered By",
    accessorKey: "transfered_by",
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
          {data?.row?.original?.transfered_by?.split("T")[0] || "N/A"}
        </Typography>
      );
    },
  },
  // {
  //   header: "NRB Category",
  //   accessorKey: "nrb_symbol",
  //   cell: (data) => {
  //     return <Typography>{data?.row?.original?.nrb_symbol}</Typography>;
  //   },
  // },

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
        ID: String(data.row.original.id),
        Symbol: data.row.original.symbol || "N/A",
        Sector: data.row.original.sector || "N/A",
        Units: String(data.row.original.units || "N/A"),
        "Purchase Price": String(data.row.original.purchase_price || "N/A"),
        "Share Type": data.row.original.share_type || "N/A",
        Status: data.row.original.is_listed ? "Listed" : "Unlisted",
        "Issue Date": data.row.original.bonus_date?.split("T")[0] || "N/A",
        "Transfered Date":
          data.row.original.transfer_date?.split("T")[0] || "N/A",
        "Transfered By":
          data.row.original.transfered_by?.split("T")[0] || "N/A",
      };

      return (
        <>
          <Box>
            <ViewModal open={open} setOpen={setOpen} data={modalData} />
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              {/* <SuccessBar
                snackbarOpen={successBarOpen}
                setSnackbarOpen={setSuccessBarOpen}
                message="Downloaded Successfully"
              /> */}
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
