import React, { useState } from "react";
import { Modal, Box, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import CloseIcon from "@mui/icons-material/Close";
import { usePatchBankAccount } from "services/BankAccount/BankAccountServices";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import RoundedButton from "components/Button/Button";

interface EditModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any;
  onSave: (updatedData: any) => void;
}

const EditBankAccountModal: React.FC<EditModalProps> = ({
  open,
  setOpen,
  data,
  onSave,
}) => {
  // const theme = useTheme();

  const [successabarOpen, setSuccessbarOpen] = useState<boolean>();
  const [errorsbarOpen, setErrorbarOpen] = useState<boolean>(); 

  const { mutate: patchBankAccount } = usePatchBankAccount(data.id);

  const schema = yup
    .object({
      interest_rate: yup
      .string()
      .matches(/^[0-9]*$/, "Interest Rate must be a number!")
      .required("Interest Rate is required!"),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
    // watch,
    // reset
    setValue,
  } = useForm({
    resolver: yupResolver<any>(schema),
    defaultValues: {
      interest_rate: data.interest_rate,
    },
  });


  const handleSave = (data) => {
    const payload = {
      interest_rate: data.interest_rate,
    };

    patchBankAccount(payload, {
      onSuccess: () => {
        setOpen(false);
        setSuccessbarOpen(true);
        // reset(data);
      },
      onError: () => {
        setErrorbarOpen(true);
      },
    });
    onSave(payload);
    // setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setValue("interest_rate", data.interest_rate);
    // reset();
  };

  return (
    <>
      <SuccessBar
        snackbarOpen={successabarOpen}
        message={"Bank Account Successfully Updated!"}
        setSnackbarOpen={setSuccessbarOpen}
      />
      <ErrorBar
        snackbarOpen={errorsbarOpen}
        message={"Error in Updating Bank Account!"}
        setSnackbarOpen={setErrorbarOpen}
      />

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // width: 600,
            bgcolor: "background.paper",
            border: "none",
            borderRadius: 5,
            width: "50%",
            // boxShadow: 24,
            p: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <HeaderDesc title="Edit Bank Account" />
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
          </Box>

          <Box
            component="form"
            sx={{ mt: 0 }}
            onSubmit={handleSubmit(handleSave)}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(1 , 1fr)",
                gap: 3,
                width: "100%",
                mb: 2,
              }}
            >
              <Box sx={{ width: "100%", mt: 1 }}>
                <TypographyLabel title={"Interest Rate (%)"} />
                <Controller
                  name="interest_rate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={{ margin: 0, width: "100%" }}
                      size="small"
                      placeholder="Enter Interest Rate"
                      error={!!errors.interest_rate}
                      helperText={errors.interest_rate?.message.toString()}
                    />
                  )}
                />
              </Box>

            </Box>
            <Box sx={{ mt: 1 }}>
              <RoundedButton title1="Update Account" />
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default EditBankAccountModal;
