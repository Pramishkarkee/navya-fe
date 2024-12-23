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

export interface BankTableList {
  id: number;
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

export const TransferStockTableEntryHeader: ColumnDef<BankTableList>[] = [
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
      const theme = useTheme();
      const [successBarOpen, setSuccessBarOpen] = useState(false);
      const [errorBarOpen, setErrorBarOpen] = useState(false);
      const [errorMessage, setErrorMessage] = useState("");
      const [confirmOpen, setConfirmOpen] = useState(false);
      const [id, setId] = useState("");

      const { refetch } = useGetAllUnlistedStockData(id);
      const { mutate: transferUnlistedStockData } =
        useTransferUnlistedStockData();

      const handleTransfer = () => {
        setConfirmOpen(true);
      };

      const handleConfirmClose = () => {
        setConfirmOpen(false);
      };

      const handleConfirmDelete = () => {
        const payload = {
          id: data?.row?.original?.id,
          obj_id: data?.row?.original?.obj_id,
          share_type: data?.row?.original?.share_type,
        };

        transferUnlistedStockData(payload, {
          onSuccess: () => {
            setSuccessBarOpen(true);
            setConfirmOpen(false);
            refetch();
          },
          onError: (error: any) => {
            setErrorBarOpen(true);
            if (error.response) {
              setErrorMessage(
                error.response.data.details
                  ? error.response.data.details
                  : "An error occurred. Please try again later."
              );
            } else {
              setErrorMessage("An error occurred. Please try again later.");
            }
          },
        });
      };

      return (
        <>
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: 1.5,
                width: "max-content",
              }}
            >
              <SuccessBar
                snackbarOpen={successBarOpen}
                setSnackbarOpen={setSuccessBarOpen}
                message="Stock Transferred successfully!"
              />
              <ErrorBar
                snackbarOpen={errorBarOpen}
                setSnackbarOpen={setErrorBarOpen}
                message={errorMessage}
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
                    Are you sure you want to transfer
                    <strong> {data.row.original.symbol}</strong>
                    <Typography>to Listed Shares?</Typography>
                  </Typography>
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "space-around",
                    }}
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
                onClick={handleTransfer}
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
                <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                  Transfer To Listed
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      );
    },
  },
];
