/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { Box, Button, Modal, Typography, useTheme } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import {
  useDeleteBankAccount,
  useGetBankListData,
} from "services/BankAccount/BankAccountServices";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import { colorTokens } from "../../theme";
import { Delete, Edit } from "@mui/icons-material";
import EditBankAccountModal from "./EditBankAccountModal";

export interface BankAccountTableHeaders {
  bank_name: string;
  bank: number;
  account_number: string;
  account_type: number;
  account_balance: number;
  created_at: string;
}

export const BankAccountTableList: ColumnDef<BankAccountTableHeaders>[] = [
  {
    header: "Bank Name",
    accessorKey: "bank_name",
    cell: (data) => {
      const { data: bankListData } = useGetBankListData();

      const bankName = bankListData?.responseData?.find(
        (bank) => bank?.id === data?.row?.original?.bank
      )?.bank_name;

      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
          {data.row.original.bank_name ? data.row.original.bank_name : bankName}
        </Typography>
      );
    },
  },
  {
    header: "Account Number",
    accessorKey: "account_number",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
          {data.row.original.account_number}
        </Typography>
      );
    },
  },
  {
    header: "Account Type",
    accessorKey: "account_type",
    cell: (data) => {
      const AccountType =
        data.row.original.account_type === 1
          ? "FD"
          : data.row.original.account_type === 2
          ? "CALL"
          : "CURRENT";
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
          {AccountType}
        </Typography>
      );
    },
  },
  //   {
  //     header: "Accont Balance",
  //     accessorKey: "account_balance",
  //     cell: (data) => {
  //       return (
  //         <Typography sx={{}}>
  //           {Number(data.row.original.account_balance).toLocaleString()}
  //         </Typography>
  //       );
  //     },
  //   },
  {
    header: "Created At",
    accessorKey: "created_at",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
          {data.row.original.created_at.split("T")[0]}
        </Typography>
      );
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: (data) => {
      return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <ActionCell data={data} />
        </Box>
      );
    },
  },
];

// eslint-disable-next-line react-refresh/only-export-components
const ActionCell = ({ data }) => {
  const theme = useTheme();
  const [editOpen, setEditOpen] = useState(false);
  const [successBarOpen, setSuccessBarOpen] = useState(false);
  const [errorBarOpen, setErrorBarOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const { mutate: deleteBankAccount } = useDeleteBankAccount(
    data.row.original.id
  );

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    const deleteId = data.row.original.id;
    deleteBankAccount(deleteId, {
      onSuccess: () => {
        setConfirmOpen(false);
        setSuccessBarOpen(true);
      },
      onError: (error) => {
        setErrorBarOpen(true);
      },
    });
  };

  const handleEdit = () => {
    handleSave(data.row.original);
    setEditOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  // const handleSave = (updatedData: MutualFundEntry) => {
  const handleSave = (updatedData) => {};

  return (
    <>
      <SuccessBar
        snackbarOpen={successBarOpen}
        setSnackbarOpen={setSuccessBarOpen}
        message="Deleted Successfully!"
      />
      <ErrorBar
        snackbarOpen={errorBarOpen}
        setSnackbarOpen={setErrorBarOpen}
        message="Failed to Delete!"
      />

      <Modal open={confirmOpen} onClose={handleConfirmClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "30%",
            bgcolor: "background.paper",
            borderRadius: "8px",
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" component="h2">
            Confirmation
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to Delete this Account (
            <span style={{ fontWeight: 500 }}>
              {data.row.original.account_number}
            </span>
            )?
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}>
            <Button
              sx={{
                color: theme.palette.secondary.main,
                "&:hover": {
                  bgcolor: theme.palette.primary.mediumColor,
                },
              }}
              variant="outlined"
              onClick={handleConfirmClose}
            >
              Cancel
            </Button>
            <Button
              sx={{
                backgroundColor: theme.palette.secondary.main,
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                },
              }}
              variant="contained"
              onClick={() => handleConfirmDelete()}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box>
        <EditBankAccountModal
          open={editOpen}
          setOpen={setEditOpen}
          data={data.row.original}
          onSave={handleSave}
        />
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
          {/* {data.row.original.account_type === 2 ? (

                    <Box
                        onClick={handleEdit}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 0.6,
                            color: colorTokens.mainColor[900],
                            "&:hover": {
                                cursor: "pointer",
                              
                            },
                        }}
                    >
                        <Edit sx={{ fontSize: "16px" }} />
                        <Typography fontSize="13px" fontWeight={600} sx={{ userSelect: "none" }}>
                            Edit
                        </Typography>
                    </Box>
            ): null} */}

          <Box
            onClick={handleDelete}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 0.6,
              // color: colorTokens.mainColor[900],
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            <Delete color="error" sx={{ fontSize: "0.85rem" }} />
            <Typography
              fontSize="0.85rem"
              fontWeight={600}
              sx={{ userSelect: "none" }}
            >
              Delete
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};
