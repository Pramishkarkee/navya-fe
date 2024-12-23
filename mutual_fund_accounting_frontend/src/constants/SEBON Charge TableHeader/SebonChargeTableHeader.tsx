/* eslint-disable react-hooks/rules-of-hooks */
import {
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import ErrorBar from "components/Snackbar/ErrorBar";
import SuccessBar from "components/Snackbar/SuccessBar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { colorTokens } from "../../theme";
import { useState } from "react";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import RoundedButton from "components/Button/Button";
import {
  useDeleteSEBONCharge,
  usePatchSEBONCharge,
} from "services/SEBONCharge/SEBONChargeServices";
import { theme } from "antd";

type SebonChargeEntry = {
  id: number;
  share_type: string;
  per_charge: number;
  created_at: string;
  updated_at: string;
};

export const SebonChargeTableColumns: ColumnDef<SebonChargeEntry>[] = [
  {
    header: "Security Type",
    accessorKey: "share_type",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
          {data.row.original.share_type === "mutual_funds"
            ? "Mutual Funds"
            : data.row.original.share_type === "corporate_debentures"
            ? "Corporate Debentures"
            : data.row.original.share_type === "equity_shares"
            ? "Equity Shares"
            : data.row.original.share_type === "government_bonds"
            ? "Government Bonds"
            : data.row.original.share_type === "preference_shares"
            ? "Preference Shares"
            : data.row.original.share_type || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "SEBON Charge (%)",
    accessorKey: "per_charge",
    cell: (data) => {
      return (
        <Typography fontSize={"14px"} textAlign={"right"} width={"83px"}>
          {data.row.original.per_charge.toLocaleString() || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Created Date",
    accessorKey: "created_at",
    cell: (data) => {
      return (
        <Typography
          sx={{
            width: "max-content",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          {data.row.original.created_at?.split("T")[0] || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Updated Date",
    accessorKey: "updated_at",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px" }}>
          {data.row.original.updated_at?.split("T")[0] || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: (data) => {
      const theme = useTheme();
      const [editOpen, setEditOpen] = useState(false);
      const [editSebon, setEditSebon] = useState(false);
      const [sebonCharge, setSebonCharge] = useState(
        data?.row?.original?.per_charge ?? ""
      );

      const [successBarOpen, setSuccessBarOpen] = useState(false);
      const [errorBarOpen, setErrorBarOpen] = useState(false);

      const { mutate: SEBONChargeMutation } = usePatchSEBONCharge(
        data?.row?.original?.id
      );

      const handleEdit = () => {
        setEditOpen(true);
      };

      const ModalData = {
        "Security Types": data.row.original.share_type || "N/A",
        "SEBON Charge": data.row.original.per_charge || "N/A",
      };

      const handleSebonUpdate = () => {
        SEBONChargeMutation(
          { per_charge: Number(sebonCharge) },
          {
            onSuccess: () => {
              setEditOpen(false);
              setSuccessBarOpen(true);
            },
            onError: (error) => {},
          }
        );
      };

      return (
        <>
          <SuccessBar
            snackbarOpen={successBarOpen}
            setSnackbarOpen={setSuccessBarOpen}
            message={"SEBON Charge updated successfully!!"}
          />
          <ErrorBar
            snackbarOpen={errorBarOpen}
            setSnackbarOpen={setErrorBarOpen}
            message="Failed to Update SEBON Charge"
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 0.5,
              mr: 4,
            }}
          >
            <Box
              onClick={handleEdit}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                ml: 4,
                gap: 0.3,
                // color: theme.palette.secondary.main,
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              <EditIcon
                sx={{
                  fontSize: "16px",
                  color: theme.palette.grey[600],
                  "&:hover": {
                    color: theme.palette.grey[900],
                  },
                }}
              />
              <Typography
                fontSize="14px"
                fontWeight={600}
                sx={{ userSelect: "none" }}
              >
                Edit
              </Typography>
            </Box>
            <ActionCell data={data} />

            {open && (
              <Modal
                open={editOpen}
                onClose={() => {
                  setEditOpen(false);
                  setEditSebon(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box
                  sx={{
                    position: "absolute" as "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "60%",
                    bgcolor: "background.paper",
                    borderRadius: "8px",
                    p: 4,
                  }}
                >
                  <HeaderDesc title="Update Sector Detail" />
                  <Grid
                    container
                    sx={{ mt: 2.5, columnGap: { xs: 4, lg: 6 }, rowGap: 1.5 }}
                  >
                    {Object.entries(ModalData).map(([key, value]) => (
                      <Grid item xs={5.5} key={key}>
                        {key === "SEBON Charge" ? (
                          <Typography
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span style={{ fontWeight: "bold" }}>{key} </span>
                            {!editSebon ? (
                              <Box sx={{ display: "flex" }}>
                                <Typography
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    color: theme.palette.secondary[700],
                                  }}
                                >
                                  {" "}
                                  {value}
                                </Typography>
                                <Button
                                  onClick={() => setEditSebon(true)}
                                  sx={{
                                    padding: "6px 0",
                                    minWidth: "0",
                                    color: theme.palette.secondary[700],
                                  }}
                                >
                                  <EditIcon sx={{ fontSize: "14px" }} />
                                </Button>
                              </Box>
                            ) : (
                              <TextField
                                size="small"
                                value={sebonCharge}
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => setSebonCharge(event.target.value)}
                              />
                            )}
                          </Typography>
                        ) : (
                          <Typography
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span style={{ fontWeight: "bold" }}>{key} </span>
                            <span
                              style={{ color: theme.palette.secondary[700] }}
                            >
                              {" "}
                              {value}{" "}
                            </span>
                          </Typography>
                        )}
                      </Grid>
                    ))}
                  </Grid>
                  <Box mt={1}>
                    <RoundedButton
                      title1="Update SEBON"
                      onClick1={handleSebonUpdate}
                    />
                  </Box>
                </Box>
              </Modal>
            )}
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
  const [successMsgs, setSuccessMsgs] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);

  const { mutate: deleteSebonCharge } = useDeleteSEBONCharge(
    data?.row?.original?.id
  );

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    const share_type = data?.row?.original?.share_type;
    deleteSebonCharge(share_type, {
      onSuccess: () => {
        setConfirmOpen(false);
        setSuccessBarOpen(true);
        setSuccessMsgs(
          `${data?.row?.original.share_type} Deleted successfully`
        );
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
      <SuccessBar
        snackbarOpen={successBarOpen}
        setSnackbarOpen={setSuccessBarOpen}
        message={successMsgs}
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
              {data.row.original.share_type === "mutual_funds"
                ? "Mutual Funds"
                : data.row.original.share_type === "corporate_debentures"
                ? "Corporate Debentures"
                : data.row.original.share_type === "equity_shares"
                ? "Equity Shares"
                : data.row.original.share_type === "government_bonds"
                ? "Government Bonds"
                : data.row.original.share_type === "preference_shares"
                ? "Preference Shares"
                : data.row.original.share_type}
              ?
            </Typography>
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

      <Box
        onClick={handleDelete}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 0.3,
          "&:hover": {
            // textDecoration: "underline",
            cursor: "pointer",
          },
        }}
      >
        <DeleteIcon color="error" sx={{ fontSize: "14px" }} />
        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
          Delete
        </Typography>
      </Box>
    </>
  );
};
