import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  useTheme,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import { BankTableList } from "constants/BankTableData/BankTable";
import {
  useDeleteBranch,
  useGetgetBankListQuery,
  usePatchBankDetails,
} from "services/Bank and Branches/BankAndBranchesServices";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import { Controller, useForm } from "react-hook-form";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";

interface EditModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any;
  onSave: (updatedData: BankTableList) => void;
}

type BranchEditFields = {
  branchCode: boolean;
  branchAddress: boolean;
  cpiCode: boolean;
  telNo: boolean;
};

type EditFields = {
  bankName: boolean;
  bankCode: boolean;
  bankAddress: boolean;
  bankType: boolean;
  swiftCode: boolean;
  cipsCode: boolean;
  // nrbSymbol: boolean;
  is_main_branch: boolean;
  branches: BranchEditFields[];
};

const EditModal: React.FC<EditModalProps> = ({
  open,
  setOpen,
  data,
  onSave,
}) => {
  const theme = useTheme();
  const [editFields, setEditFields] = useState<EditFields>({
    bankName: false,
    bankCode: false,
    bankAddress: false,
    bankType: false,
    swiftCode: false,
    cipsCode: false,
    is_main_branch: false,
    branches:
      data?.branches?.map(() => ({
        id: false,
        branchName: false,
        branchCode: false,
        branchAddress: false,
        branchType: false,
        cpiCode: false,
        telNo: false,
      })) || [],
  });
  const [editIsMainBranch, setEditIsMainBranch] = useState(false);

  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [successMsgs, setSuccessMsgs] = useState("");

  const [formData, setFormData] = useState(data);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [branchDelete, setBranchDelete] = useState<any>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>("");

  const { data: bankListData, refetch: bankListDataRefetch } =
    useGetgetBankListQuery(1);
  const {
    mutate: patchBankDetails,
    isSuccess: patchBankDetailsSuccess,
    isError: patchBankDetailsError,
  } = usePatchBankDetails(data?.id);

  formData.branches = formData.branches.filter(
    (branch) => branch !== undefined
  );
  const branchToDelete = formData.branches[formData.branches];

  const { mutate: deleteBranch } = useDeleteBranch();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: data,
  });

  useEffect(() => {
    if (bankListData?.responseData) {
      Object.keys(editFields).forEach((key) => {
        if ((editFields as any)[key]) {
          setValue(key as any, (bankListData.responseData as any)[key]);
        }
      });
    }
  }, [editFields, bankListData?.responseData, setValue]);

  useEffect(() => {
    if (patchBankDetailsSuccess) {
      bankListDataRefetch();
      setSuccessMsgs("Bank details updated successfully");
      setSnackbarSuccessOpen(true);
    } else if (patchBankDetailsError) {
      setErrorMsgs("Error submitting update Request.");
      setSnackbarErrorOpen(true);
    }
  }, [patchBankDetailsSuccess, patchBankDetailsError, bankListDataRefetch]);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleIsMainBranchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      is_main_branch: checked,
    }));
  };

  const toggleEditIsMainBranch = () => {
    setEditIsMainBranch((prev) => !prev);
  };
  const handleSave = async () => {
    try {
      await patchBankDetails(formData, {
        onSuccess: () => {
          onSave(formData);
          setSnackbarSuccessOpen(true);
          setSuccessMsgs("Bank details updated successfully");
          setOpen(false);
        },
        onError: () => {
          setErrorMsgs("Error submitting update Request.");
          setSnackbarErrorOpen(true);
        },
      });
    } catch (error) {
      setErrorMsgs("Error submitting update Request.");
      setSnackbarErrorOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBranchInputChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevState) => {
        const updatedBranches = [...prevState?.branches];
        updatedBranches[index] = { ...updatedBranches[index], [name]: value };
        return { ...prevState, branches: updatedBranches };
      });
    };

  const handleBranchClick =
    (index: number, field: keyof BranchEditFields) => () => {
      const updatedEditFields = [...editFields?.branches];
      updatedEditFields[index][field] = true;
      setEditFields((prevState) => ({
        ...prevState,
        branches: updatedEditFields,
      }));
    };

  const handleDeleteBranch = (branch: any, index: number) => {
    const branchCode = branch?.branch_code || "Unnamed ";
    setBranchDelete({ branch, index });
    setConfirmationOpen(true);
    setConfirmationMessage(branchCode);
  };

  const handleConfirmDelete = () => {
    if (branchDelete) {
      const { branch, index } = branchDelete;

      if (branch.id) {
        deleteBranch(branch.id, {
          onSuccess: () => {
            const updatedBranches = formData.branches.filter(
              (_, i) => i !== index
            );
            setFormData((prevState) => ({
              ...prevState,
              branches: updatedBranches,
            }));
            setSnackbarSuccessOpen(true);
            setSuccessMsgs("Branch deleted successfully");
            setConfirmationOpen(false);
          },
          onError: () => {
            setErrorMsgs("Error deleting branch.");
            setSnackbarErrorOpen(true);
          },
        });
      } else {
        const updatedBranches = formData.branches.filter((_, i) => i !== index);
        setFormData((prevState) => ({
          ...prevState,
          branches: updatedBranches,
        }));
        setConfirmationOpen(false);
        setSnackbarSuccessOpen(true);
        setSuccessMsgs("Branch removed successfully");
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddBranch = () => {
    setFormData((prevState) => ({
      ...prevState,
      branches: [
        ...prevState.branches,
        {
          branchCode: "",
          branchAddress: "",
          cpiCode: "",
          telNo: "",
        },
      ],
    }));

    setEditFields((prevState) => ({
      ...prevState,
      branches: [
        ...prevState.branches,
        {
          branchCode: true,
          branchAddress: true,
          cpiCode: true,
          telNo: true,
        },
      ],
    }));
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 750,
            maxHeight: "90vh",
            bgcolor: "background.paper",
            border: "2px solid #fff",
            borderRadius: 8,
            boxShadow: 24,
            overflowY: "auto",
            p: 4,
          }}
        >
          <Box sx={{ display: "flex" }}>
            <HeaderDesc title="Edit Bank Details" />
            <CloseIcon
              sx={{ cursor: "pointer", marginLeft: "525px" }}
              onClick={handleClose}
            />
          </Box>
          <Box
            component="form"
            sx={{ mt: 0 }}
            onSubmit={handleSubmit(handleSave)}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                sx={{ width: "60%" }}
                size="small"
                margin="normal"
                label="Bank Code"
                name="bank_code"
                value={formData?.bank_code || ""}
                onChange={handleInputChange}
                onClick={() =>
                  setEditFields((prevState) => ({
                    ...prevState,
                    bankCode: true,
                  }))
                }
                InputProps={{
                  readOnly: !editFields?.bankCode,
                }}
              />
              <TextField
                sx={{ width: "60%" }}
                size="small"
                margin="normal"
                label="Bank Name"
                name="bank_name"
                value={formData?.bank_name || ""}
                onChange={handleInputChange}
                onClick={() =>
                  setEditFields((prevState) => ({
                    ...prevState,
                    bankName: true,
                  }))
                }
                InputProps={{
                  readOnly: !editFields?.bankName,
                }}
              />
              <TextField
                sx={{ width: "60%" }}
                size="small"
                margin="normal"
                label="Bank Address"
                name="bank_address"
                value={formData?.bank_address || ""}
                onChange={handleInputChange}
                onClick={() =>
                  setEditFields((prevState) => ({
                    ...prevState,
                    bankAddress: true,
                  }))
                }
                InputProps={{
                  readOnly: !editFields?.bankAddress,
                }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, marginBottom: "7px" }}>
              <TextField
                sx={{ width: "50%", mt: 3.1 }}
                size="small"
                margin="normal"
                label="SWIFT Code"
                name="swift_code"
                value={formData?.swift_code || ""}
                onChange={handleInputChange}
                onClick={() =>
                  setEditFields((prevState) => ({
                    ...prevState,
                    swiftCode: true,
                  }))
                }
                InputProps={{
                  readOnly: !editFields?.swiftCode,
                }}
              />
              <Box>
                <TypographyLabel title="Bank Type" />
                <Box sx={{ width: "358px", mt: 0.9 }}>
                  <Controller
                    name="bank_type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        size="small"
                        fullWidth
                        value={formData?.bank_type || ""}
                        onChange={(e) => {
                          handleSelectChange(e);
                          field.onChange(e);
                        }}
                        onClick={() =>
                          setEditFields((prevState) => ({
                            ...prevState,
                            bankType: true,
                          }))
                        }
                        readOnly={!editFields?.bankType}
                      >
                        <MenuItem value="commercial_bank">
                          Commercial Bank
                        </MenuItem>
                        <MenuItem value="development_banks">
                          Development Bank
                        </MenuItem>
                        <MenuItem value="finance">Finance</MenuItem>
                        <MenuItem value="microfinance">Microfinance</MenuItem>
                        <MenuItem value="infrastructure">
                          Infrastructure
                        </MenuItem>
                      </Select>
                    )}
                  />
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData?.is_main_branch || false}
                      onChange={handleIsMainBranchChange}
                      onClick={toggleEditIsMainBranch}
                      // disabled={!editFields.is_main_branch}
                    />
                  }
                  label="Is this main branch?"
                  labelPlacement="end"
                />
              </FormControl>
            </Box>
            <Box sx={{ marginTop: "15px" }}>
              <HeaderDesc title="Edit Branch Details" />
              <Grid container spacing={2} sx={{ marginTop: "0px" }}>
                {formData?.branches?.map((branch, index) => (
                  <Grid item xs={12} sm={6} md={6} key={branch?.id}>
                    <Box
                      sx={{
                        padding: 2,
                        border: "1px solid grey",
                        borderRadius: "4px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          px: 2,
                          py: 1,
                          position: "relative",
                        }}
                      >
                        <Typography
                          sx={{
                            color: theme.palette.primary.fullDarkColor,
                            fontWeight: 600,
                            flexGrow: 1,
                          }}
                        >
                          Branch {index + 1}
                        </Typography>
                        <Grid item xs={12} md={2} sx={{ mt: -1 }}>
                          <IconButton
                            onClick={() => handleDeleteBranch(branch, index)}
                            color={branch.id ? "error" : "default"}
                            sx={{ position: "absolute", right: 8 }}
                          >
                            {branch.id ? <DeleteIcon /> : <CloseIcon />}
                          </IconButton>
                        </Grid>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", gap: 1, flexDirection: "row" }}
                        >
                          <TextField
                            size="small"
                            margin="normal"
                            label="Branch ID"
                            name="branch_code"
                            value={branch.branch_code || ""}
                            onChange={handleBranchInputChange(index)}
                            onClick={handleBranchClick(index, "branchCode")}
                            InputProps={{
                              readOnly:
                                !editFields?.branches[index]?.branchCode,
                            }}
                          />
                          <TextField
                            size="small"
                            margin="normal"
                            label="Branch Address"
                            name="branch_address"
                            value={branch.branch_address || ""}
                            onChange={handleBranchInputChange(index)}
                            onClick={handleBranchClick(index, "branchAddress")}
                            InputProps={{
                              readOnly:
                                !editFields?.branches[index]?.branchAddress,
                            }}
                          />
                        </Box>

                        <Box
                          sx={{ display: "flex", gap: 2, flexDirection: "row" }}
                        >
                          <TextField
                            size="small"
                            margin="normal"
                            label="CIPS Code"
                            name="cpi_code"
                            value={branch.cpi_code || ""}
                            onChange={handleBranchInputChange(index)}
                            onClick={handleBranchClick(index, "cpiCode")}
                            InputProps={{
                              readOnly: !editFields?.branches[index]?.cpiCode,
                            }}
                          />
                          <TextField
                            size="small"
                            margin="normal"
                            label="Tel No"
                            name="tel_no"
                            value={branch.tel_no || ""}
                            onChange={handleBranchInputChange(index)}
                            onClick={handleBranchClick(index, "telNo")}
                            InputProps={{
                              readOnly: !editFields?.branches[index]?.telNo,
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  width: "fit-content",
                  borderRadius: "100px",
                  padding: "6px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: "20px",
                  backgroundColor: theme.palette.secondary.main,
                  "&:hover": {
                    bgcolor: theme.palette.primary.main,
                  },
                }}
                onClick={handleAddBranch}
                type="button"
              >
                Add Branch
              </Button>
              <Button
                variant="contained"
                sx={{
                  width: "fit-content",
                  borderRadius: "100px",
                  padding: "6px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: "20px",
                  backgroundColor: theme.palette.secondary.main,
                  "&:hover": {
                    bgcolor: theme.palette.primary.main,
                  },
                }}
                type="submit"
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Modal open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
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
            Are you sure you want to Delete <br />
            <span style={{ fontWeight: 500 }}>
              {confirmationMessage} Branch
            </span>{" "}
            ?
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setConfirmationOpen(false)}
              sx={{
                color: theme.palette.secondary.main,
                "&:hover": {
                  bgcolor: theme.palette.primary.mediumColor,
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                },
              }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
      <SuccessBar
        snackbarOpen={snackbarSuccessOpen}
        setSnackbarOpen={setSnackbarSuccessOpen}
        message={successMsgs}
      />
      <ErrorBar
        snackbarOpen={snackbarErrorOpen}
        setSnackbarOpen={setSnackbarErrorOpen}
        message={errorMsgs}
      />
    </>
  );
};

export default EditModal;

// const handleDeleteBranch = (
//   branch: Branch,
//   index: number
// ) => {
//   const branchToDelete = formData.branches[index];
//   const isBranchEmpty = (branch: Branch) => {
//     return (
//       !branch.branch_name &&
//       !branch.branch_code &&
//       !branch.branch_address &&
//       !branch.cpi_code &&
//       !branch.tel_no
//     );
//   };

//   if (isBranchEmpty(branchToDelete)) {
//     const updatedBranches = formData.branches.filter((_, i) => i !== index);
//     setFormData((prevState) => ({
//       ...prevState,
//       branches: updatedBranches,
//     }));

//     if (updatedBranches.length === 0) {
//       handleClose();
//     }
//   } else if (branchToDelete.id) {
//     deleteBranch(branch.id,
//       {

//         onSuccess: () => {
//           const updatedBranches = formData.branches.filter((_, i) => i !== index);
//           setFormData((prevState) => ({
//             ...prevState,
//             branches: updatedBranches,
//           }));

//           setSuccessMsgs("Branch deleted successfully");
//           setSnackbarSuccessOpen(true);

//           if (updatedBranches.length === 0) {
//             handleClose();
//           }
//         },
//         onError: () => {
//           setErrorMsgs("Error deleting branch.");
//           setSnackbarErrorOpen(true);
//         },
//       }
//     );
//   } else {
//     const updatedBranches = formData.branches.filter((_, i) => i !== index);
//     setFormData((prevState) => ({
//       ...prevState,
//       branches: updatedBranches,
//     }));

//     if (updatedBranches.length === 0) {
//       handleClose();
//     }
//   }
// };

{
  /* <TextField
              sx={{ width: "60%" }}
              size="small"
              margin="normal"
              label="NRB Symbol"
              name="nrb_symbol"
              value={formData?.nrb_symbol}
              onChange={handleInputChange}
              onClick={() =>
                setEditFields((prevState) => ({
                  ...prevState,
                  nrbSymbol: true,
                }))
              }
              InputProps={{
                readOnly: !editFields?.nrbSymbol,
              }}
            /> */
}

{
  /* <TextField
                                                    size="small"
                                                    margin="normal"
                                                    label="Branch Name"
                                                    name="branch_name"
                                                    value={branch?.branch_name}
                                                    onChange={handleBranchInputChange(index)}
                                                    onClick={handleBranchClick(index, 'branchName')}
                                                    InputProps={{
                                                        readOnly: !editFields?.branches[index]?.branchName,
                                                    }}
                                                /> */
}

{
  /* <Box sx={{ display: "flex", gap: 2, flexDirection: "row" }}>

                                                <TextField
                                                    size="small"
                                                    margin="normal"
                                                    label="Branch Type"
                                                    name="branch_type"
                                                    value={branch.branch_type}
                                                    onChange={handleBranchInputChange(index)}
                                                    onClick={handleBranchClick(index, 'branchType')}
                                                    InputProps={{
                                                        readOnly: !editFields?.branches[index]?.branchType,
                                                    }}
                                                />
                                            </Box> */
}
