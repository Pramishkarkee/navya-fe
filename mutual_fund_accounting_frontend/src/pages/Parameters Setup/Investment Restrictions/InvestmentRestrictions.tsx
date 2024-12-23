import { Box, TextField, Typography, useTheme } from "@mui/material";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import ErrorBar from "components/Snackbar/ErrorBar";
import SuccessBar from "components/Snackbar/SuccessBar";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";


export interface Data {
    investment_in_individual_share: number;
    investment_in_corporate_debenture: number;
    investment_in_government_bonds: number;
    investment_in_fixed_deposit: number;
    investment_in_mutal_funds: number;
    investment_in_preference_share: number;
    investment_in_equity_share: number;
}


export default function InvestmentRestrictions() {
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

        },
    });


    const onSubmit = (data: Data) => {
        console.log("Form submitted Successfully.");
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
                    mb: 2,
                }}
            >
                Restrictions in Investments
            </Typography>

            <Box sx={{ mb: 2 }}>
                <TypographyLabel title="Investment in Individual Shares" />
                <Controller
                    name="investment_in_individual_share"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            sx={{ width: "26%" }}
                            size="small"
                            placeholder="10% of Paid Up Capital"
                            error={!!errors.investment_in_individual_share}
                            helperText={errors.investment_in_individual_share?.message}
                        />
                    )}
                />
            </Box>

            <Box sx={{ mb: 2 }}>
                <TypographyLabel title="Investment in Corporate Debenture" />
                <Controller
                    name="investment_in_corporate_debenture"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            sx={{ width: "26%" }}
                            size="small"
                            placeholder="10% of Nav"
                            error={!!errors.investment_in_corporate_debenture}
                            helperText={errors.investment_in_corporate_debenture?.message}
                        />
                    )}
                />
            </Box>

            <Box sx={{ mb: 2 }}>
                <TypographyLabel title="Investment in Government Bonds" />
                <Controller
                    name="investment_in_government_bonds"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            sx={{ width: "26%" }}
                            size="small"
                            placeholder="10% of Nav"
                            error={!!errors.investment_in_government_bonds}
                            helperText={errors.investment_in_government_bonds?.message}
                        />
                    )}
                />
            </Box>

            <Box sx={{ mb: 2 }}>
                <TypographyLabel title="Investment in Fixed Deposit" />
                <Controller
                    name="investment_in_fixed_deposit"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            sx={{ width: "26%" }}
                            size="small"
                            placeholder="15% of Nav"
                            error={!!errors.investment_in_fixed_deposit}
                            helperText={errors.investment_in_fixed_deposit?.message}
                        />
                    )}
                />
            </Box>

            <Box sx={{ mb: 2 }}>
                <TypographyLabel title="Investment in Mutual Funds" />
                <Controller
                    name="investment_in_mutal_funds"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            sx={{ width: "26%" }}
                            size="small"
                            placeholder="15% of NAV"
                            error={!!errors.investment_in_mutal_funds}
                            helperText={errors.investment_in_mutal_funds?.message}
                        />
                    )}
                />
            </Box>

            <Box sx={{ mb: 2 }}>
                <TypographyLabel title="Investment in Preference Shares" />
                <Controller
                    name="investment_in_preference_share"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            sx={{ width: "26%" }}
                            size="small"
                            placeholder="15% of NAV"
                            error={!!errors.investment_in_preference_share}
                            helperText={errors.investment_in_preference_share?.message}
                        />
                    )}
                />
            </Box>

            <Box sx={{ mb: 2 }}>
                <TypographyLabel title="Investment in Equity Shares" />
                <Controller
                    name="investment_in_equity_share"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            sx={{ width: "26%" }}
                            size="small"
                            placeholder="20 Min Required % of NAV"
                            error={!!errors.investment_in_equity_share}
                            helperText={errors.investment_in_equity_share?.message}
                        />
                    )}
                />
            </Box>

            <RoundedButton
                title1="Set Restrictions"
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
