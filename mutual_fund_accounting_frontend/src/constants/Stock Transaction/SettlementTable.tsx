import { ColumnDef } from "@tanstack/react-table";
import { IndeterminateCheckbox } from "components/Table/PostingTable";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Box, Modal, TextField, Typography, useTheme } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useDeleteStockTransactionDetails } from "services/Stock Transaction/StockTransactionService";
import EditBankAccountModal from "constants/Bank Account/EditBankAccountModal";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import ConfirmationModal from "components/ConfirmationModal/ConfirmationModal";

interface StockEditDetailsModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    isSuccess: boolean;
    message: null | string;
    responseData: {
      id: number;
      stock_code: string;
      txn_type: string;
      broker_code: number;
      txn_id: string;
      units: number;

      rate: string;
      base_price: string;
      commission_rate: string;
      capital_gain_tax: string;
      effective_rate: string;
      total_amount: string;
      dp_charge: number;

      created_at: string;
      updated_at: string;
    }[];
  };
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  borderRadius: "8px",
  p: 4,
};
export interface SettlementTableHeaders {
  id: number;
  txn_id: string;
  commission_rate: number;
  effective_rate: number;
  capital_gain_tax: number;
  total_amount: number;
  base_price: number;
  stock_code: string;
  units: string;
  rate: string;
  broker_code: number;
  txn_type: string;
  is_settlement: boolean;
  is_closed: boolean;
  has_dp: boolean;
  overridden_capital_gain_tax: number | string | null;
  overridden_broker_charge: number | string | null;
  overridden_sebon_charge: number | string | null;
  overridden_dp_charge: number | string | null;
  created_at: string;
  updated_at: string;
  broker_commission_pct: number;
  sebon_charge_pct: number;
  cgt_charge_pct: number;
  dp_charge: number;
  sebon_charge: number;
}

export const SettlementTableColumns: ColumnDef<SettlementTableHeaders>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row, table }) => (
      <div className="px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: () => {
              const currentRowSelected = row.getIsSelected();
              table.toggleAllRowsSelected(false);
              row.toggleSelected(!currentRowSelected);
            },
          }}
        />
      </div>
    ),
  },
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <IndeterminateCheckbox
  //       {...{
  //         checked: table.getIsAllPageRowsSelected(),
  //         indeterminate: table.getIsSomePageRowsSelected(),
  //         onChange: table.getToggleAllPageRowsSelectedHandler(),
  //       }}
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <div className="px-1">
  //       <IndeterminateCheckbox
  //         {...{
  //           checked: row.getIsSelected(),
  //           disabled: !row.getCanSelect(),
  //           indeterminate: row.getIsSomeSelected(),
  //           onChange: row.getToggleSelectedHandler(),
  //         }}
  //       />
  //     </div>
  //   ),
  // },
  {
    header: "TXN ID",
    accessorKey: "txn_id",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
          {data.row.original.txn_id}
        </Typography>
      );
    },
    footer: () => {
      return (
        <Box
          sx={{
            fontWeight: 600,
            fontSize: "0.85rem",
            display: "flex",
            justifyContent: "flex-end",
            width: "117px",
          }}
        >
          Total(Selected Items)
        </Box>
      );
    },
  },
  {
    header: "Transaction Type",
    accessorKey: "txn_type",
    cell: (data) => {
      const displayValue =
        data.row.original.txn_type === "purchase"
          ? "Purchase"
          : data.row.original.txn_type === "sell"
          ? "Sell"
          : data.row.original.txn_type;

      return (
        <Typography
          sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
        >
          {displayValue}
        </Typography>
      );
    },
  },

  {
    header: "Broker Code",
    accessorKey: "broker_code",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            display: "flex",
            justifyContent: "flex-start",
            width: "70px",
          }}
        >
          {data.row.original.broker_code ? data.row.original.broker_code : ""}
        </Typography>
      );
    },
  },
  {
    header: "Symbol",
    accessorKey: "stock_code",
    cell: (data) => {
      return (
        <Typography
          sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
        >
          {data.row.original.stock_code}
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
            fontWeight: 400,
            textAlign: "right",
            width: "30px",
            mr: 2,
          }}
        >
          {Number(data.row.original.units).toLocaleString()}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return sum + parseFloat(row.original.units);
        }, 0);

      return (
        <Typography
          sx={{
            fontWeight: 600,
            display: "flex",
            fontSize: "0.85rem",
            justifyContent: "flex-end",
            width: "28px",
          }}
        >
          {total.toLocaleString()}
        </Typography>
      );
    },
  },
  {
    header: "Rate",
    accessorKey: "rate",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            display: "flex",
            justifyContent: "center",
            mx: 2,
            // width: "58px",
            // mx:3,
            // ml: 2,
          }}
        >
          {parseFloat(data.row.original.rate).toFixed(2).toLocaleString()}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return sum + parseFloat(row.original.rate);
        }, 0)
        .toFixed(2);

      return (
        <Typography
          sx={{
            fontWeight: 600,
            display: "flex",
            fontSize: "0.85rem",
            justifyContent: "flex-end",
            // mr: 2,
            width: "55px",
          }}
        >
          {total.toLocaleString()}
        </Typography>
      );
    },
  },
  {
    header: "Base Price",
    accessorKey: "base_price",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            display: "flex",
            justifyContent: "flex-end",
            width: "60px",
          }}
        >
          {data?.row?.original?.base_price?.toLocaleString()}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return sum + parseFloat(row.original.base_price.toString());
        }, 0)
        .toFixed(2);

      return (
        <Typography
          sx={{
            fontWeight: 600,
            display: "flex",
            fontSize: "0.85rem",
            justifyContent: "flex-end",
            // mr: 1,
            width: "58px",
          }}
        >
          {Number(total).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      );
    },
  },
  {
    header: "Broker Charge",
    accessorKey: "commission_rate",
    cell: (data) => {
      // const basePrice = Number(data.row.original.base_price);
      // const commissionRate = Number(data.row.original.commission_rate);

      // const brokerCharge = (basePrice * commissionRate) / 100;

      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            display: "flex",
            justifyContent: "flex-end",
            width: "80px",
          }}
        >
          {data.row.original.commission_rate
            ? data.row.original.commission_rate.toLocaleString()
            : 0}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return sum + parseFloat(row.original.commission_rate.toString());
        }, 0)
        .toFixed(2);

      return (
        <Typography
          sx={{
            fontWeight: 600,
            display: "flex",
            fontSize: "0.85rem",
            justifyContent: "flex-end",
            // mr: 1,
            width: "78px",
          }}
        >
          {total.toLocaleString()}
        </Typography>
      );
    },
  },
  {
    header: "SEBON Charge",
    accessorKey: "sebon_charge",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            display: "flex",
            justifyContent: "flex-end",
            width: "83px",
          }}
        >
          {Number(
            data?.row?.original?.sebon_charge?.toFixed(2)
          ).toLocaleString()}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return sum + parseFloat(row.original.sebon_charge.toString());
        }, 0)
        .toFixed(2);

      return (
        <Typography
          sx={{
            fontWeight: 600,
            display: "flex",
            fontSize: "0.85rem",
            justifyContent: "flex-end",
            // mr: 4,
            width: "81px",
          }}
        >
          {total.toLocaleString()}
        </Typography>
      );
    },
  },

  {
    header: "DP Charge",
    accessorKey: "dp_charge",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            display: "flex",
            justifyContent: "flex-end",
            width: "60px",
          }}
        >
          {data?.row?.original?.dp_charge?.toLocaleString()}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return sum + parseFloat(row.original.dp_charge.toString());
        }, 0)
        .toFixed(2);

      return (
        <Typography
          sx={{
            fontWeight: 600,
            display: "flex",
            fontSize: "0.85rem",
            justifyContent: "flex-end",
            // mr: 3,
            width: "58px",
          }}
        >
          {total.toLocaleString()}
        </Typography>
      );
    },
  },
  {
    header: "CGT",
    accessorKey: "capital_gain_tax",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            display: "flex",
            justifyContent: "flex-end",
            width: "25px",
          }}
        >
          {data.row.original.capital_gain_tax.toLocaleString()}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return sum + parseFloat(row.original.capital_gain_tax.toString());
        }, 0)
        .toFixed(2);

      return (
        <Typography
          sx={{
            fontWeight: 600,
            display: "flex",
            fontSize: "0.85rem",
            justifyContent: "flex-end",
            // mr: 2,
            width: "23px",
          }}
        >
          {total.toLocaleString()}
        </Typography>
      );
    },
  },
  {
    header: "Total Amount",
    accessorKey: "total_amount",
    cell: (data) => {
      return (
        <Typography
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            fontSize: "14px",
            fontWeight: 400,
            width: "75px",
          }}
        >
          {data?.row?.original?.total_amount?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return sum + parseFloat(row.original.total_amount.toString());
        }, 0)
        .toFixed(2);

      return (
        <Typography
          sx={{
            fontWeight: 600,
            display: "flex",
            fontSize: "0.85rem",
            justifyContent: "flex-end",
            width: "73px",
          }}
        >
          {Number(total).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
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
            fontWeight: 400,
            display: "flex",
            justifyContent: "flex-end",
            width: "65px",
          }}
        >
          {data.row.original.effective_rate
            ? Number(data.row.original.effective_rate).toFixed(2)
            : "0.00"}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return sum + parseFloat(row.original.effective_rate.toString());
        }, 0)
        .toFixed(2);

      return (
        <Typography
          sx={{
            fontWeight: 600,
            display: "flex",
            fontSize: "0.85rem",
            justifyContent: "flex-end",
            // mr: 3,
            width: "63px",
          }}
        >
          {total.toLocaleString()}
        </Typography>
      );
    },
  },
  // {
  //   header: "Action",
  //   accessorKey: "",
  //   cell: (data) => {
  //     return (
  //       <Typography
  //         sx={{
  //           fontSize: "14px",
  //           fontWeight: 400,
  //           display: "flex",
  //           justifyContent: "flex-end",
  //           width: "65px",
  //         }}
  //       >
  //         <ActionCell data={data} />
  //       </Typography>
  //     );
  //   },
  // },
];

const ActionCell = ({ data }) => {
  const theme = useTheme();
  const [editOpen, setEditOpen] = useState(false);
  const [successBarOpen, setSuccessBarOpen] = useState(false);
  const [errorBarOpen, setErrorBarOpen] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [successMsgs, setSuccessMsgs] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);

  const { mutate: deleteBankAccount } = useDeleteStockTransactionDetails(
    data.row.original.id
  );

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  // const handleConfirmDelete = () => {
  //   const deleteId = data.row.original.id;
  //   deleteBankAccount(deleteId, {
  //     onSuccess: () => {
  //       setConfirmOpen(false);
  //       setSuccessBarOpen(true);
  //     },
  //     onError: (error) => {
  //       setErrorBarOpen(true);
  //       console.error("Failed to delete:", error);
  //     },
  //   });
  // };

  // const handleEdit = () => {
  //   handleSave(data.row.original);
  //   setEditOpen(true);
  // };

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
        message={`Successfully Deleted Stock Transaction ${data.row.original.txn_id}`}
      />
      <ErrorBar
        snackbarOpen={errorBarOpen}
        setSnackbarOpen={setErrorBarOpen}
        message="Failed to Delete!"
      />

      {/* <Modal open={confirmOpen} onClose={handleConfirmClose}>
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
            <span style={{ fontWeight: 500 }}>{data.row.original.txn_id}</span>
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
                backgroundColor: theme.palette.error.main,
                "&:hover": {
                  bgcolor: theme.palette.error.main,
                },
              }}
              variant="contained"
              onClick={() => handleConfirmDelete()}
            >
              Reject
            </Button>
          </Box>
        </Box>
      </Modal> */}
      <ConfirmationModal
        open={confirmOpen}
        setOpen={handleConfirmClose}
        title="Confirmation"
        bTitle1="Cancel"
        bTitle2="Reject"
        message={
          <>
            <Typography sx={{ textAlign: "center" }}>
              {`Are you sure you want to Reject ${data.row.original.txn_id} ?`}
            </Typography>
            <Typography sx={{ textAlign: "center" }}>
              This will reverse the transaction.{" "}
            </Typography>
          </>
        }
        // {`Are you sure you want to Reject ${data.row.original.txn_id} ?`}
        onClick={() =>
          deleteBankAccount(data.row.original.txn_id, {
            onSuccess: () => {
              setSuccessBarOpen(true);
              setConfirmOpen(false);

              setSuccessMsgs(
                `Successfully Deleted Stock Transaction ${data.row.original.txn_id}`
              );
            },
            onError: (error) => {
              setErrorMsgs(error.message);
            },
          })
        }
      />

      <Box>
        {/* <EditBankAccountModal
          open={editOpen}
          setOpen={setEditOpen}
          data={data.row.original}
          onSave={handleSave}
        /> */}
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
          {/* <Box
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
                    </Box> */}

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
              Reject
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export const EditDetails: React.FC<StockEditDetailsModalProps> = ({
  open,
  setOpen,
  data,
}) => {
  // function EditDetails() {
  const theme = useTheme();
  const [openEdit, setOpenEdit] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleEditDetails = (data) => {
    setOpenEdit(true);
    setModalData(data);
  };

  const handleClose = () => {
    setOpenEdit(false);
  };

  const handleEditSave = () => {
    setOpenEdit(false);
  };
  // const data = [
  //     {
  //         id: 1,
  //         txnId: "TXN001",
  //         ledgerHeadPayable: "Supplier A",
  //         ledgerHeadReceivable: "Customer X",
  //         transactionDate: "2024-05-01",
  //         transactionAmount: "XXXXXXXXX",
  //     },

  // ];

  return (
    <>
      <Dialog open={openEdit} onClose={handleClose}>
        <DialogTitle>Edit Stock Details</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "5px",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              <Typography>{`Rate `}</Typography>
              <TextField> </TextField>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              <Typography>{`Base Price `}</Typography>
              <TextField> </TextField>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "5px",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              <Typography>{`Commission Rate `}</Typography>
              <TextField> </TextField>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              <Typography>{`Capital Gain Tax `}</Typography>
              <TextField> </TextField>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "5px",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              <Typography>{`WACC Rate `}</Typography>
              <TextField> </TextField>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              <Typography>{`Total Amount `}</Typography>
              <TextField> </TextField>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{ color: theme.palette.primary[1100] }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSave}
            sx={{ color: theme.palette.primary[1100] }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        sx={{
          marginLeft: "450px",
          color: theme.palette.primary[1100],
          "&:hover": {
            backgroundColor: "transparent",
            hover: "none",
          },
        }}
        onClick={() => handleEditDetails(data)}
      >
        Edit Details
      </Button>
    </>
  );
};
