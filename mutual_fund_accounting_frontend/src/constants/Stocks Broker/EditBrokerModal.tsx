import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Button, useTheme } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { useUpdateStockBrokerData } from "services/StockBroker/StockBrokerServices";
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
  transaction_limit: string;
  total_transaction_limit: string;
};

const EditStockBrokerModal: React.FC<EditModalProps> = ({
  open,
  setOpen,
  data,
  onSave,
}) => {
  const theme = useTheme();
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);

  const [errorMsgs, setErrorMsgs] = useState("");

  const { mutate: patchStockBrokerDetails } = useUpdateStockBrokerData(
    data?.id
  );

  const schema = yup
    .object({
      transaction_limit: yup
        .string()
        .required("Per Transaction Limit is required"),
      total_transaction_limit: yup
        .string()
        .required("Total Transaction Limit is required"),
    })
    .required();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      symbol: data.symbol,
    },
    resolver: yupResolver<any>(schema),
  });

  const handleSave = (formValues: EditFields) => {
    const payload = {
      transaction_limit: formValues.transaction_limit,
      total_transaction_limit: formValues.total_transaction_limit,
    };

    patchStockBrokerDetails(payload, {
      onSuccess: () => {
        setSnackbarSuccessOpen(true);
        onSave(payload);
        setOpen(false);
      },
      onError: (error) => {
        setSnackbarErrorOpen(true);
        if (axios.isAxiosError(error) && error.response) {
          setErrorMsgs(
            error.response.data.details
              ? error.response.data.details[0]
              : error.response.data.transaction_limit
              ? error.response.data.transaction_limit[0]
              : error.response.data.total_transaction_limit
              ? error.response.data.total_transaction_limit[0]
              : "Error on updating Stock Broker Entry"
          );
        }
      },
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setValue("transaction_limit", data.transaction_limit);
    setValue("total_transaction_limit", data.total_transaction_limit);
  }, [data, setValue]);

  const getErrorMessage = (error: any): string | undefined => {
    if (typeof error === "string") return error;
    if (error && typeof error.message === "string") return error.message;
    return undefined;
  };

  return (
    <Box>
      <SuccessBar
        snackbarOpen={snackbarSuccessOpen}
        setSnackbarOpen={setSnackbarSuccessOpen}
        message="Stock Broker Entry Updated Successfully!"
      />
      <ErrorBar
        snackbarOpen={snackbarErrorOpen}
        setSnackbarOpen={setSnackbarErrorOpen}
        message={errorMsgs}
      />
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
            <HeaderDesc title="Edit Stock Broker Entry Details" />
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
          </Box>

          <Box
            component="form"
            sx={{ mt: 2 }}
            onSubmit={handleSubmit(handleSave)}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Controller
                name="transaction_limit"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    margin="normal"
                    label="Per Transaction Limit"
                    error={!!errors.transaction_limit}
                    helperText={getErrorMessage(errors.transaction_limit)}
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Controller
                name="total_transaction_limit"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    margin="normal"
                    label="Total Transaction Limit"
                    error={!!errors.total_transaction_limit}
                    helperText={getErrorMessage(errors.total_transaction_limit)}
                  />
                )}
              />
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
    </Box>
  );
};
export default EditStockBrokerModal;
