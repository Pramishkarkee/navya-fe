/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { colorTokens } from "../../theme";
import { Box, Typography } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { ColumnDef } from "@tanstack/react-table";
import BankDetailsModal from "components/Modal/ViewModal";
import AllotsUnitModalIpo from "components/Modal/IpoAllotsUnitModel";
export interface Remarks {
  remarks: string;
}

export interface CreatedBy {
  id: number;
  username: string;
  full_name: string;
}

export interface UpdatedBy {
  id: number;
  username: string;
  full_name: string;
}

export interface IPOData {
  id: number;
  application_form_number: number;
  stock: number;
  applied_units: number;
  per_share_value: string;
  share_application_type: string;
  apply_date: string;
  bank: number;
  deposit_account: number;
  cheque_number: string;
  status: string;
  remarks: Remarks;
  alloted_units: number;
  alloted_date: any;
  can_be_sold: boolean;
  created_date: string;
  updated_date: string;
  created_by: CreatedBy;
  updated_by: UpdatedBy;
  deposit_amount: number;
  bank_name: string;
  stock_name: string;
  bank_account_number: string;
}

export const IpoTableList: ColumnDef<IPOData>[] = [
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
    header: "Application Type",
    accessorKey: "share_application_type",
    cell: (data) => {
      const displayValue =
        data.row.original.share_application_type === "ipo"
          ? "IPO"
          : data.row.original.share_application_type === "right"
          ? "Right"
          : data.row.original.share_application_type === "fpo"
          ? "FPO"
          : "N/A";
      return (
        <Typography sx={{ fontSize: "0.85rem", textAlign: "left" }}>
          {displayValue || "N/A"}
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
          {data.row.original.stock_name || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Appplied Date",
    accessorKey: "apply_date",
    cell: (data) => {
      return (
        <Typography
          sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
        >
          {data.row.original.apply_date || "N/A"}
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
          {data.row.original.bank_name || "N/A"}
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
          {data.row.original.applied_units}
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
          {parseFloat(data.row.original.per_share_value).toLocaleString(
            undefined,
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          )}
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
          {Number(data.row.original.deposit_amount || "N/A").toLocaleString(
            undefined,
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          )}
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
            width: "max-content",
            textTransform: "capitalize",
          }}
        >
          {data.row.original.status}
        </Typography>
      );
    },
  },
  {
    accessorKey: "created_by",
    header: "Created By",
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
          {data.row.original.updated_by.full_name || "-"}
        </Typography>
      );
    },
  },
  {
    accessorKey: "updated_by",
    header: "Approved By",
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
          {data.row.original.updated_by.full_name || "-"}
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
        return (
          number &&
          Number(
            number.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          )
        );
      };

      const modalData: Record<string, any> = {
        "Application No.": data.row.original.id?.toString() || "N/A",
        "Stock Name": data.row.original.stock_name?.toString() || "N/A",
        "Applied Units": formatNumber(data.row.original.applied_units),
        "Share Application Type":
          data.row.original.share_application_type === "ipo"
            ? "IPO"
            : data.row.original.share_application_type === "right"
            ? "Right"
            : data.row.original.share_application_type === "fpo"
            ? "FPO"
            : data.row.original.share_application_type?.toString() || "NA",
        "Price Per Unit": data.row.original.per_share_value,
        "Deposit Amount": formatNumber(data.row.original.deposit_amount),
        "Alloted Units": formatNumber(data.row.original.alloted_units),
        "Applied Date": data.row.original.apply_date?.toString() || "N/A",
        "Bank Name": data.row.original.bank_name?.toString() || "N/A",
        "Bank Account":
          data.row.original.bank_account_number?.toString() || "N/A",
        "Cheque  Number": data.row.original.cheque_number?.toString() || "N/A",
        "Alloted Date": data.row.original.alloted_date?.toString() || "N/A",
        Remarks: data.row.original.remarks?.remarks?.toString() || "N/A",
      };

      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {status === "pending" ? (
            <Box>
              <AllotsUnitModalIpo
                open={openAllot}
                setOpen={setOpenAllot}
                data={modalData}
                ipoId={data.row.original.id}
              />

              <Box
                onClick={handleAllot}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 0.3,
                  color: colorTokens.mainColor[1100],
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
              >
                <Visibility sx={{ fontSize: "14px", fontWeight: 600 }} />

                <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
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
                  gap: 0.3,
                  color: colorTokens.mainColor[1100],
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
              >
                <Visibility sx={{ fontSize: "14px", fontWeight: 600 }} />

                <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
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
