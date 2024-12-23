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
  useDeleteExitLoad,
  usePatchexitLoad,
} from "services/ExitLoadSetup/ExitLoadSetup";

type ExitLoadEntry = {
  exit_load_for: string;
  exit_load: number;
  range_from: number;
  range_to: number;

  id: number;
  share_type: string;
  per_charge: number;
  created_at: string;
  updated_at: string;
};

export const ExitLoadTableHeader: ColumnDef<ExitLoadEntry>[] = [
  {
    header: "Exit Load For",
    accessorKey: "exit_load_for",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
          {data.row.original.exit_load_for === "reisdent_natural_person"
            ? "Resident Natural Person"
            : data.row.original.exit_load_for === "resident_institution"
            ? "Resident Institution"
            : data.row.original.exit_load_for}
        </Typography>
      );
    },
  },
  {
    header: "Exit Load",
    accessorKey: "exit_load",
    cell: (data) => {
      return (
        <Box sx={{ width: "50%", fontSize: "14px", fontWeight: "400px" }}>
          <Typography>{data.row.original.exit_load || "N/A"}</Typography>
        </Box>
      );
    },
  },
  {
    header: "Range From",
    accessorKey: "range_from",
    cell: (data) => {
      return (
        <Typography
          sx={{
            width: "60%",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: "400px",
          }}
        >
          {data.row.original.range_from || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Range To",
    accessorKey: "range_to",
    cell: (data) => {
      return (
        <Box
          sx={{
            width: "60%",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: "400px",
          }}
        >
          <Typography>{data.row.original.range_to || "N/A"}</Typography>
        </Box>
      );
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: (data) => {
      const theme = useTheme();
      const [editOpen, setEditOpen] = useState(false);
      const [editExitLoad, setEditExitLoad] = useState(false);
      const [ExitLoad, setExitLoad] = useState(
        data?.row?.original?.per_charge ?? ""
      );

      const [successBarOpen, setSuccessBarOpen] = useState(false);
      const [errorBarOpen, setErrorBarOpen] = useState(false);

      const { mutate: ExitLoadMutation } = usePatchexitLoad(
        data?.row?.original?.id
      );

      const handleEdit = () => {
        setEditOpen(true);
      };

      const ModalData = {
        "Security Types": data.row.original.share_type,
        "ExitLoad Charge": data.row.original.per_charge,
      };

      const handleExitLoadUpdate = () => {
        ExitLoadMutation(
          { per_charge: Number(ExitLoad) },
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
            message={"Exit Load updated successfully!"}
          />
          <ErrorBar
            snackbarOpen={errorBarOpen}
            setSnackbarOpen={setErrorBarOpen}
            message="Failed to Update Exit Load!"
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 1.5,
              mr: 4,
            }}
          >
            <ActionCell data={data} />
            <Box
              onClick={handleEdit}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 0.6,
                color: colorTokens.mainColor[1100],
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              <EditIcon sx={{ fontSize: "16px" }} />
              <Typography
                fontSize="14px"
                fontWeight={600}
                sx={{ userSelect: "none" }}
              >
                Edit
              </Typography>
            </Box>

            {open && (
              <Modal
                open={editOpen}
                onClose={() => {
                  setEditOpen(false);
                  setEditExitLoad(false);
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
                        {key === "ExitLoad Charge" ? (
                          <Typography
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span style={{ fontWeight: "bold" }}>{key} </span>
                            {!editExitLoad ? (
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
                                  onClick={() => setEditExitLoad(true)}
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
                                value={ExitLoad}
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => setExitLoad(event.target.value)}
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
                      title1="Update ExitLoad"
                      onClick1={handleExitLoadUpdate}
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
  const [successBarOpen, setSuccessBarOpen] = useState(false);
  const [errorBarOpen, setErrorBarOpen] = useState(false);
  const [successMsgs, setSuccessMsgs] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);

  const { mutate: deleteExitLoad } = useDeleteExitLoad(data?.row?.original?.id);

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    const share_type = data?.row?.original?.share_type;
    deleteExitLoad(share_type, {
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
              {data.row.original.exit_load_for === "reisdent_natural_person"
                ? "Resident Natural Person"
                : data.row.original.exit_load_for === "resident_institution"
                ? "Resident Institution"
                : data.row.original.exit_load_for}
            </Typography>
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleConfirmDelete()}
            >
              Confirm
            </Button>
            <Button
              variant="contained"
              color="inherit"
              onClick={handleConfirmClose}
            >
              Cancel
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
          gap: 0.6,
          "&:hover": {
            textDecoration: "underline",
            cursor: "pointer",
          },
        }}
      >
        <DeleteIcon color="error" sx={{ fontSize: "14px" }} />
        <Typography sx={{ fontSize: "14px" }}>Delete</Typography>
      </Box>
    </>
  );
};
