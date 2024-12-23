import { Box, Button, Modal, Typography, useTheme } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import ErrorBar from "components/Snackbar/ErrorBar";
import SuccessBar from "components/Snackbar/SuccessBar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { colorTokens } from "../../theme";
import { useState } from "react";
import { useDeleteStockBrokerData } from "services/StockBroker/StockBrokerServices";
import EditBrokerModal from "./EditBrokerModal";

type StockBrokerEntry1 = {
  broker_code: number;
  broker_name: string;
  broker_address: string;
  transaction_limit: string;
  total_transaction_limit: string;
};

export const StockBrokerTableListEntryHeader1: ColumnDef<StockBrokerEntry1>[] =
  [
    {
      header: "Broker Name",
      accessorKey: "broker_name",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
          >
            {data.row.original.broker_name || "N/A"}
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
            sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
          >
            {Number(data.row.original.broker_code).toFixed(0) || "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "Address",
      accessorKey: "broker_address",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
          >
            {data.row.original.broker_address || "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "Per Transaction Limit",
      accessorKey: "transaction_limit",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              textAlign: "right",
              width: "98px",
              mr: 2,
            }}
          >
            {Number(data.row.original.transaction_limit).toLocaleString(
              undefined,
              { maximumFractionDigits: 2, minimumFractionDigits: 2 }
            ) || "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "Total Transaction Limit",
      accessorKey: "total_transaction_limit",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              textAlign: "right",
              width: "98px",
              mr: 2,
            }}
          >
            {Number(data.row.original.total_transaction_limit).toLocaleString(
              undefined,
              { maximumFractionDigits: 2, minimumFractionDigits: 2 }
            ) || "-"}
          </Typography>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (data) => {
        const [editOpen, setEditOpen] = useState(false);

        const handleEdit = () => {
          setEditOpen(true);
        };

        const handleSave = () => {
          setEditOpen(false);
        };

        return (
          <>
            <EditBrokerModal
              open={editOpen}
              setOpen={setEditOpen}
              data={data.row.original}
              onSave={handleSave}
            />

            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
              <Box
                onClick={handleEdit}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 0.6,
                  // color: colorTokens.mainColor[1100],
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                <EditIcon sx={{ fontSize: "14px", fontWeight: 400 }} />
                <Typography
                  fontSize="14px"
                  fontWeight={600}
                  sx={{ userSelect: "none" }}
                >
                  Edit
                </Typography>
              </Box>
              <ActionCell data={data} />
            </Box>
          </>
        );
      },
    },
  ];

const ActionCell = ({ data }) => {
  const theme = useTheme();
  const [successBarOpen, setSuccessBarOpen] = useState(false);
  const [errorBarOpen, setErrorBarOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const { mutate: deleteStockBrokerSetup } = useDeleteStockBrokerData(
    data?.row?.original?.id
  );

  // const handleDelete = () => {
  //   const deleteId = data.row.original.id;
  //   // deleteMarketCap(deleteId, {
  //   //   onSuccess: () => {
  //   //     setSuccessBarOpen(true);
  //   //   },
  //   //   onError: (error) => {
  //   //     setErrorBarOpen(true);
  //   //     console.error("Failed to delete:", error);
  //   //   },
  //   // });
  // };
  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    const stock_broker_setup = data?.row?.original?.stock_broker_setup;
    deleteStockBrokerSetup(stock_broker_setup, {
      onSuccess: () => {
        setConfirmOpen(false);
        setSuccessBarOpen(true);
      },
      onError: (error) => {
        setErrorBarOpen(true);
        console.error("Failed to delete:", error);
      },
    });
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 0.1 }}>
        <SuccessBar
          snackbarOpen={successBarOpen}
          setSnackbarOpen={setSuccessBarOpen}
          message="Deleted Successfully"
        />
        <ErrorBar
          snackbarOpen={errorBarOpen}
          setSnackbarOpen={setErrorBarOpen}
          message="Failed to delete"
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
              Are you sure you want to Delete
              <Typography sx={{ fontWeight: 500 }}>
                {data.row.original.broker_name}?
              </Typography>
            </Typography>
            <Box
              sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}
            >
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

        <Box
          onClick={handleDelete}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 0.2,
            "&:hover": {
              // textDecoration: "underline",
              cursor: "pointer",
            },
          }}
        >
          <DeleteIcon
            color="error"
            sx={{ fontSize: "14px", fontWeight: 600 }}
          />
          <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
            Delete
          </Typography>
        </Box>
      </Box>
    </>
  );
};
