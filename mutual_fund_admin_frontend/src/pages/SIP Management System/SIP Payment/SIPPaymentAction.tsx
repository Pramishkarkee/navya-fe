import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
//   useTheme,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { useSipEntryMutation } from "services/SIP Payment/SipPaymentEntry";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import * as yup from "yup";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { colorTokens } from "../../../theme";
import { set } from "date-fns";

interface EditModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any;
  onSave: (updatedData: any) => void;
}

type EditFields = {
  amount: string;
};

const SIPPaymentAction: React.FC<EditModalProps> = ({
  open,
  setOpen,
  data,
  onSave,
}) => {
//   const theme = useTheme();
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);

  const [errorMsgs, setErrorMsgs] = useState("");
 

  const { mutate: patchOnlineSIP } = useSipEntryMutation();

  const schema = yup
    .object({
      amount: yup.string().required('Amount is required'),
    })
    .required();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<any>(schema),
  });

  const handleSave = (formValues: EditFields) => {
   const payload = {
    amount: Number(formValues.amount),
    sip_identifier: data.sip_identifier,
    boid_no: data.boid_no,
    };

    patchOnlineSIP(payload, {
      onSuccess: () => {
       
        setSnackbarSuccessOpen(true);
        onSave(payload);
        setOpen(false);
      },
      onError: (error) => {
        console.log("Error", error);
        setSnackbarErrorOpen(true);
        if(axios.isAxiosError(error) && error.response){
          setErrorMsgs(
            error.response.data.details 
          ? error.response.data.details[0]
          : error.response.data.amount
          ? error.response.data.amount[0]
          : "Error on Submittion"
          )
        }
        // setOpen(false);
      },
    });
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  useEffect(() => {
    if (open) {
      setValue("amount", data.amount);
    }
  }, [open, data, setValue]);

  return (
    <Box>
       <SuccessBar
        snackbarOpen={snackbarSuccessOpen}
        setSnackbarOpen={setSnackbarSuccessOpen}
        message="Submitted Successfully!"
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
                  <HeaderDesc title="Enter Detail" />
                  <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
                </Box>

                <Box
                  component="form"
                  sx={{ mt: 2 }}
                  onSubmit={handleSubmit(handleSave)}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Controller
                      name="amount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          margin="normal"
                          label="Amount"
                          error={!!errors.amount}
                          helperText={errors.amount?.message.toString()}
                        />
                      )}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "1px",
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
                        backgroundColor: colorTokens.mainColor[900],
                        "&:hover": {
                          bgcolor: colorTokens.mainColor[600],
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
export default SIPPaymentAction;