import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { colorTokens } from "../../theme";
import { Visibility } from "@mui/icons-material";
import BankDetailsModal from "components/Modal/ViewModal";
import AllotsUnitModal from "components/Modal/AllotsUnitModel";
// import {AllotsUnitModal} from "components/Modal/AllotsUnitModel";

export interface AuctiontTableHeaders {
  id: number;
  application_form_number: any;
  form_fee: string;
  stock: number;
  applied_units: number;
  per_share_value: number;
  share_application_type: string;
  apply_date: string;
  bank: number;
  deposit_account: number;
  cheque_number: string;
  status: string;
  alloted_units: number;
  alloted_date: any;
  created_date: string;
  updated_date: string;
  deposit_amount: number;
  bank_name: string;
  stock_name: string;
  application_form_fee: number;
  bank_account_number: string;
  remarks: {
    remarks: string;
  };
}

export const AuctionTableList: ColumnDef<AuctiontTableHeaders>[] = [
  {
    header: "ID",
    accessorKey: "id",
    cell: (data) => {
      return (
        <Typography
          sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
        >
          {data.row.original.id}
        </Typography>
      );
    },
  },
  {
    header: "Stock Name",
    accessorKey: "stock_name",
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
          {data.row.original.stock_name}
        </Typography>
      );
    },
  },
  {
    header: "Appplied Date",
    accessorKey: "apply_date",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
          {data.row.original.apply_date}
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
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            textAlign: "left",
            width: "max-content",
          }}
        >
          {data.row.original.bank_name}
        </Typography>
      );
    },
  },

  {
    header: "Value Per Unit",
    accessorKey: "per_share_value",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            textAlign: "right",
            width: "80px",
          }}
        >
          {Number(data.row.original.per_share_value).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      );
    },
  },

  {
    header: "Applied Units",
    accessorKey: "applied_units",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            textAlign: "right",
            width: "75px",
          }}
        >
          {Number(data.row.original.applied_units).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
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
          {Number(data.row.original.deposit_amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      );
    },
  },

  {
    header: "Status",
    accessorKey: "status",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            textAlign: "left",
            textTransform: "capitalize",
          }}
        >
          {data.row.original.status}
        </Typography>
      );
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: (data) => {
      const [open, setOpen] = useState<boolean>(false);
      const [openAllot, setOpenAllot] = useState<boolean>(false);

      const handleView = () => {
        setOpen(true);
      };

      const handleAllot = () => {
        setOpenAllot(true);
      };
      const status = data.row.original.status;
      const formatNumber = (number: number | undefined) => {
        return number
          ? Number(number).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : "NA";
      };

      const modalData: Record<string, any> = {
        "Auction Application Form Number":
          data.row.original.application_form_number?.toString() || "N/A",
        "Application Form Fee": formatNumber(
          data.row.original.application_form_fee
        ),
        "Stock Name": data.row.original.stock_name?.toString() || "N/A",
        "Applied Units": formatNumber(data.row.original.applied_units),
        "Price Per Unit": formatNumber(data.row.original.per_share_value),
        "Deposit Amount": formatNumber(data.row.original.deposit_amount),
        "Alloted Units": formatNumber(data.row.original.alloted_units),
        "Bank Name": data.row.original.bank_name?.toString() || "N/A",

        "Bank Account":
          data.row.original.bank_account_number?.toString() || "N/A",
        "Cheque  Number": data.row.original.cheque_number?.toString() || "N/A",
        "Applied Date": data.row.original.apply_date?.toString() || "N/A",
        "Alloted Date": data.row.original.alloted_date?.toString() || "N/A",
        Remarks: data.row.original.remarks?.remarks?.toString() || "N/A",
      };

      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            justifyContent: "center",
          }}
        >
          {status === "pending" ? (
            <Box>
              <AllotsUnitModal
                open={openAllot}
                setOpen={setOpenAllot}
                data={modalData}
                auctionId={data.row.original.id}
              />

              <Box
                onClick={handleAllot}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.6,
                  color: colorTokens.mainColor[1100],
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
              >
                <Visibility sx={{ fontSize: "14px", fontWeight: 500 }} />
                <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                  Allot Units
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box>
              <BankDetailsModal
                open={open}
                setOpen={setOpen}
                data={modalData}
              />
              <Box
                onClick={handleView}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",

                  gap: 0.6,
                  color: colorTokens.mainColor[1100],
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
              >
                <Visibility sx={{ fontSize: "14px", fontWeight: 500 }} />
                <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                  View Details
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      );
    },
  },
];
