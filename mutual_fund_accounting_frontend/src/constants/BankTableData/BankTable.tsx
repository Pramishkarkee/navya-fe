import { Typography, Box } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Visibility } from "@mui/icons-material";
import { colorTokens } from "../../theme";
import { useState } from "react";
import SuccessBar from "components/Snackbar/SuccessBar";
import BankDetailsModal from "components/Modal/BankDetailsModal";
import EditModal from "components/Modal/EditModel";

export interface BankTableList {
  id: number;
  bank_name: string;
  bank_code: string;
  bank_address: string;
  swift_code: string;
  cpi_code: string;
  bank_type: string;
  nrb_symbol: string;
  is_main_branch: boolean;
  created_at: string;
  updated_at: string;
  branches: {
    id: number;
    branch_name: string;
    branch_code: string;
    branch_address: string;
    branch_type: string;
    cpi_code: string;
    tel_no: string;
    created_at: string;
    updated_at: string;
  }[];
}

export interface Branch {
  cpi_code: any;
  tel_no: any;
  id: number;
  branch_name: string;
  branch_code: string;
  branch_address: string;
  branch_type: string;
  created_at: string;
  updated_at: string;
}

export const BankListTableEntryHeader: ColumnDef<BankTableList>[] = [
  {
    header: "Bank ID",
    accessorKey: "id",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}>{data?.row?.original?.id || 'N/A'} </Typography>;
    },
  },
  {
    header: "Bank Code",
    accessorKey: "bank_code",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}>{data?.row?.original?.bank_code || 'N/A'}</Typography>;
    },
  },
  {
    header: "Bank Name",
    accessorKey: "bank_name",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}>{data?.row?.original?.bank_name || 'N/A'}</Typography>;
    },
  },
  {
    header: "Bank Address",
    accessorKey: "bank_address",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}>{data?.row?.original?.bank_address || 'N/A'}</Typography>;
    },
  },

  {
    header: "SWIFT Code",
    accessorKey: "swift_code",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}>{data?.row?.original?.swift_code || 'N/A'}</Typography>;
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
      const [editOpen, setEditOpen] = useState(false);
      const handleView = () => {
        setOpen(true);
      };
      const handleEdit = () => {
        setEditOpen(true);
      };

      const handleSave = (updatedData: BankTableList) => {
        // console.log("Updated Data:", updatedData);
        setSuccessBarOpen(true);
      };

      return (
        <>
          <Box>
            <BankDetailsModal
              open={open}
              setOpen={setOpen}
              data={{
                isSuccess: true,
                message: null,
                responseData: [data.row.original],
              }}
            />
            <EditModal
              open={editOpen}
              setOpen={setEditOpen}
              data={data.row.original}
              onSave={handleSave}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: 1.5,
              }}
            >
              <SuccessBar
                snackbarOpen={successBarOpen}
                setSnackbarOpen={setSuccessBarOpen}
                message="Bank details updated successfully!"
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
                <Visibility sx={{ fontSize: "0.85rem" }} />
                <Typography sx={{ fontSize: "0.85rem", fontWeight: '600' }}>View</Typography>
              </Box>
              <Box
                onClick={handleEdit}
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
                <Edit sx={{ fontSize: "0.85rem" }} />
                <Typography sx={{ fontSize: "0.85rem", fontWeight: '600' }}>Edit</Typography>
              </Box>
            </Box>
          </Box>
        </>
      );
    },
  },
];
