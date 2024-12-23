import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  useTheme,
  Select,
  MenuItem,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import CloseIcon from "@mui/icons-material/Close";
import { usePatchBondDetails } from "services/BondAndDebenture/BondAndDebenture";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import * as yup from "yup";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

interface EditModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any;
  onSave: (updatedData: any) => void;
}

type EditFields = {
  symbol: string;
  bond_name: string;
  security_type: string;
  face_value: string;
  issue_size: string;
  bond_status: string;
  mf_scheme_size_percentage: string;
};

const securityTypeOptions = [
  { label: "Corporate Debentures", id: 1, value: "debenture" },
  { label: "Government Bonds", id: 2, value: "bond" },
];

const BondStatusOptions = [
  { label: "Listed", id: 1, value: "listed" },
  { label: "Unlisted", id: 2, value: "unlisted" },
];

const EditBondModal: React.FC<EditModalProps> = ({
  open,
  setOpen,
  data,
  onSave,
}) => {
  const theme = useTheme();
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [successMsgs, setSuccessMsgs] = useState("");

  const { mutate: patchBondDetails } = usePatchBondDetails(data?.id);

  const schema = yup
    .object({
      symbol: yup.string().required("Symbol is required").optional(),
      bond_name: yup.string().required("bond name is required").optional(),
      security_type: yup
        .string()
        .required("Security Type is required")
        .optional(),
      face_value: yup.string().required("Face value is required").optional(),
      issue_size: yup.string().required("Issue Size is required").optional(),
      bond_stataus: yup.string().required("Bond Status is required").optional(),

      issue_size_percentage: yup.string().required().label("Issue Size ( % )"),
      coupon_rate: yup.string().required().label("Coupon Rate"),

      mf_scheme_size_percentage: yup
        .string()
        .required()
        .label("MF Scheme Size ( % )"),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      symbol: data.symbol || "",
      bond_name: data.bond_name || "",
      security_type: data.security || "",
      face_value: Number(data.face_value).toFixed(2) ?? "",
      issue_size: data.issue_units ?? "",
      bond_status: data.bond_status || "",

      issue_size_percentage: data.issue_size_percentage ?? "",
      coupon_rate: data.coupon_rate ?? "",
      mf_scheme_size_percentage: data.txn_scheme_limit ?? "",
    },
    resolver: yupResolver<any>(schema),
  });

  const handleSave = (formValues: EditFields) => {
    const formattedValues = {
      ...formValues,
      face_value: parseFloat(formValues.face_value).toFixed(2),
      issue_units: formValues.issue_size,
      security: formValues.security_type,
      txn_scheme_limit: formValues.mf_scheme_size_percentage,
    };

    patchBondDetails(formattedValues, {
      onSuccess: () => {
        setSuccessMsgs("Bond Data updated successfully.");
        setSnackbarSuccessOpen(true);
        onSave(formattedValues);
        setOpen(false);
      },
      onError: (error) => {
        setSnackbarErrorOpen(true);

        if (axios.isAxiosError(error) && error.response) {
          setErrorMsgs(
            error.response.data.datails
              ? error.response.data.details
              : error.response.data.issue_units
              ? `Issue Size : ${error.response.data.issue_units[0]}`
              : "Error updating Bond Setup!"
          );
        } else {
          setErrorMsgs("Error updating Bond Setup!");
        }
      },
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getErrorMessage = (error: any): string | undefined => {
    if (typeof error === "string") return error;
    if (error && typeof error.message === "string") return error.message;
    return undefined;
  };

  return (
    <Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            border: "2px solid #fff",
            borderRadius: 8,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <HeaderDesc title="Edit Bond Entry Details" />
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
          </Box>

          <Box
            component="form"
            sx={{ mt: 2 }}
            onSubmit={handleSubmit(handleSave)}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Controller
                name="symbol"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    margin="normal"
                    label="Symbol"
                    error={!!errors.symbol}
                    helperText={getErrorMessage(errors.symbol)}
                  />
                )}
              />
              <Controller
                name="bond_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    margin="normal"
                    label="Bond Name"
                    error={!!errors.bond_name}
                    helperText={getErrorMessage(errors.bond_name)}
                  />
                )}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, marginBottom: "7px" }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ width: "100%" }}>
                  <TypographyLabel title="Security Type" />
                  <Controller
                    name="security_type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        sx={{ width: "260px" }}
                        size="small"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        {securityTypeOptions.map((option) => (
                          <MenuItem key={option.id} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ width: "100%" }}>
                  <TypographyLabel title="Face Value" />
                  <Controller
                    name="face_value"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        sx={{ width: "260px" }}
                        size="small"
                        placeholder="Please Enter Face value"
                        error={!!errors.face_value}
                        // helperText={getErrorMessage(errors.face_value)}
                      />
                    )}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, marginBottom: "7px" }}>
              <Controller
                name="issue_size"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    margin="normal"
                    label="Issue Size"
                    error={!!errors.issue_size}
                    helperText={getErrorMessage(errors.issue_size)}
                  />
                )}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ width: "100%" }}>
                  <TypographyLabel title="Bond Status" />
                  <Controller
                    name="bond_status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        sx={{ width: "260px" }}
                        size="small"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        {BondStatusOptions.map((option) => (
                          <MenuItem key={option.id} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              {/* <TypographyLabel title="Issue Size ( % )" /> */}

              <Controller
                name="coupon_rate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Coupon Rate"
                    fullWidth
                    size="small"
                    placeholder="i.e 5"
                    error={!!errors.coupon_rate}
                    helperText={getErrorMessage(errors.coupon_rate?.message)}
                  />
                )}
              />

              <Controller
                name="mf_scheme_size_percentage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="MF Scheme Size ( % )"
                    fullWidth
                    size="small"
                    placeholder="i.e 5"
                    error={!!errors.mf_scheme_size_percentage}
                    helperText={getErrorMessage(
                      errors.mf_scheme_size_percentage?.message
                    )}
                  />
                )}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Controller
                name="issue_size_percentage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Issue Size ( % )"
                    fullWidth
                    size="small"
                    placeholder="i.e 10"
                    error={!!errors.issue_size_percentage}
                    helperText={getErrorMessage(
                      errors.issue_size_percentage?.message
                    )}
                  />
                )}
              />
              {/* <TypographyLabel title="MF Scheme Size ( % )" /> */}
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
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
                type="submit"
              >
                Save
              </Button>
            </Box>
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
    </Box>
  );
};
export default EditBondModal;
