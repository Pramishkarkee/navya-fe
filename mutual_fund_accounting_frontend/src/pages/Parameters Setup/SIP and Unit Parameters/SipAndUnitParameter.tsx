import { Box, Checkbox, FormControl, FormControlLabel, TextField, Typography, useTheme } from "@mui/material";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import ErrorBar from "components/Snackbar/ErrorBar";
import SuccessBar from "components/Snackbar/SuccessBar";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";




export interface Data {
    grace_period_days: number;
    lock_in_period_days: number;
    enable_penalty_for_sip_payments: boolean;
    enable_lock_in_period_for_sip_units: boolean;
}

export default function SipAndUnitParameters() {
    const theme = useTheme();
    const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
    const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
    const [errorMsgs, setErrorMsgs] = useState("");
    const [successMsgs, setSuccessMsgs] = useState("");

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<Data>({
        // resolver: yupResolver<any>(schema),
        defaultValues: {
            enable_penalty_for_sip_payments: true,
            enable_lock_in_period_for_sip_units: true
        },
    });


    const onSubmit = (data: Data) => {
        console.log("onSubmit function is been called.");
    }


    return (
        <Box>
            <Typography
                sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "19px",
                    color: "#212121",
                    textAlign: "center",
                    width: "max-content",
                    borderBottom: `1px solid ${theme.palette.secondary.main}`,
                    mt: 2,
                    mb: 2
                }}
            >
                SIP Penalty and Grace Period
            </Typography>

            <FormControl>
                <Controller
                    name="enable_penalty_for_sip_payments"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Checkbox {...field} checked={field.value} />}
                            label="Enable Penalty for SIP Payments?"
                            labelPlacement="end"
                        />
                    )}
                />
            </FormControl>

            <Typography
                sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "19px",
                    color: "#212121",
                    textAlign: "center",
                    width: "max-content",
                    borderBottom: `1px solid ${theme.palette.secondary.main}`,
                    mt: 2,
                    mb: 2
                }}
            >
                Grace Period Penalties
            </Typography>
            <Box>
                <TypographyLabel title="Grace Period (Days)" />
                <Controller
                    name="grace_period_days"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            sx={{ width: "25%" }}
                            size="small"
                            placeholder="Please Enter Grace Period"
                            error={!!errors.grace_period_days}
                            helperText={errors.grace_period_days?.message}
                        />
                    )}
                />
            </Box>
            <Typography
                sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "19px",
                    color: "#212121",
                    textAlign: "center",
                    width: "max-content",
                    borderBottom: `1px solid ${theme.palette.secondary.main}`,
                    mt: 2,
                    mb: 2
                }}
            >
                Lock-In Periods
            </Typography>

            <FormControl>
                <Controller
                    name="enable_lock_in_period_for_sip_units"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Checkbox {...field} checked={field.value} />}
                            label="Enable Penalty for SIP Payments?"
                            labelPlacement="end"
                        />
                    )}
                />
            </FormControl>
            <Box sx={{ mb: 2 }}>
                <TypographyLabel title="Lock-In Period for SIP Units (Days)" />
                <Controller
                    name="lock_in_period_days"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            sx={{ width: "25%" }}
                            size="small"
                            placeholder="Please Enter Lock-In Period"
                            error={!!errors.lock_in_period_days}
                            helperText={errors.lock_in_period_days?.message}
                        />
                    )}
                />
            </Box>
            <RoundedButton
                title1="Set Parameters"
                onClick1={handleSubmit(onSubmit)}
            />

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
    )
}