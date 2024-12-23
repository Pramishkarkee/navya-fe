import { Box, TextField, Typography, useTheme } from "@mui/material";
import RoundedButton from "components/Button/Button";
import TypographyLabel, {
  TypographyLabelEdit,
} from "components/InputLabel/TypographyLabel";
import { useState, useEffect } from "react";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useGetFeesAndChargesParameter,
  usePatchFeesAndChargesParameter,
} from "services/Fees and Charges/FeesAndChargesServices";
import axios from "axios";

const schema = yup
  .object()
  .shape({
    depository_fee: yup
      .number()
      .typeError("Depository Fee must be a number")
      .required("Depository Fee is required")
      .positive("Depository Fee must be a positive number")
      .label("Depository Fee"),
    fund_supervisor_fee: yup
      .number()
      .typeError("Fund Supervisor Fee must be a number")
      .required("Fund Supervisor Fee is required")
      .positive("Fund Supervisor Fee must be a positive number")
      .label("Fund Supervisor Fee"),
    fund_management_fee: yup
      .number()
      .typeError("Fund Management Fee must be a number")
      .required("Fund Management Fee is required")
      .positive("Fund Management Fee must be a positive number")
      .label("Fund Management Fee"),
    annual_listing_fee: yup
      .number()
      .typeError("Annual Listing Fee must be a number")
      .required("Annual Listing Fee is required")
      .positive("Annual Listing Fee must be a positive number")
      .label("Annual Listing Fee")
      .min(0, "Annual Listing Fee must be a positive number")
      .nullable(),
    annual_software_fee: yup
      .number()
      .typeError("Annual Software Fee must be a number")
      .required("Annual Software Fee is required")
      .positive("Annual Software Fee must be a positive number")
      .label("Annual Software Fee")
      .min(0, "Annual Software Fee must be a positive number")
      .nullable(),
    schema_audit_expenses: yup
      .number()
      .typeError("Schema Audit Expenses must be a number")
      .required("Schema Audit Expenses is required")
      .positive("Schema Audit Expenses must be a positive number")
      .label("Schema Audit Expenses")
      .min(0, "Schema Audit Expenses must be a positive number")
      .nullable(),
    tds_rate: yup
      .number()
      .typeError("TDS Rate must be a number")
      .required("TDS Rate is required")
      .positive("TDS Rate must be a positive number")
      .label("TDS Rate"),
    // holding_period_less_365: yup
    //   .number()
    //   .typeError("Holding Period Less 365 must be a number")
    //   .nullable()
    //   .positive("Holding Period Less 365 must be a positive number")
    //   .label("Holding Period Less 365"),
    // holding_period_more_365: yup
    //   .number()
    //   .typeError("Holding Period More 365 must be a number")
    //   .nullable()
    //   .positive("Holding Period More 365 must be a positive number")
    //   .label("Holding Period More 365"),
    // resident_institution: yup.string().nullable(),
    // resident_natural_person: yup.string().nullable(),
    // others: yup.string().nullable(),
    // capital_gain_tax_for_mutual_funds: yup
    //   .number()
    //   .typeError("Capital Gain Tax for Mutual Funds must be a number")
    //   .nullable()
    //   .positive("Capital Gain Tax for Mutual Funds must be a positive number")
    //   .label("Capital Gain Tax for Mutual Funds"),
    // dividend_income_tax: yup
    //   .number()
    //   .typeError("Dividend Income Tax must be a number")
    //   .nullable()
    //   .positive("Dividend Income Tax must be a positive number")
    //   .label("Dividend Income Tax"),
    // interest_income_tax: yup
    //   .number()
    //   .typeError("Interest Income Tax must be a number")
    //   .nullable()
    //   .positive("Interest Income Tax must be a positive number")
    //   .label("Interest Income Tax"),
    // dividend_payment_tax_individuals: yup
    //   .number()
    //   .typeError("Dividend Payment Tax for Individuals must be a number")
    //   .nullable()
    //   .positive(
    //     "Dividend Payment Tax for Individuals must be a positive number"
    //   )
    //   .label("Dividend Payment Tax for Individuals"),
    // dividend_payment_tax_institutions: yup
    //   .number()
    //   .typeError("Dividend Payment Tax for Institutions must be a number")
    //   .nullable()
    //   .positive(
    //     "Dividend Payment Tax for Institutions must be a positive number"
    //   )
    //   .label("Dividend Payment Tax for Institutions"),
  })
  .required();

export interface UserFormInput {
  depository_fee: string;
  fund_supervisor_fee: string;
  fund_management_fee: string;
  annual_listing_fee: string;
  annual_software_fee: string;
  schema_audit_expenses: string;
  tds_rate: string;
  // holding_period_less_365: string;
  // holding_period_more_365: string;
  // resident_institution: string;
  // resident_natural_person: string;
  // others: string;
  // capital_gain_tax_for_mutual_funds: string;
  // dividend_income_tax: string;
  // interest_income_tax: string;
  // dividend_payment_tax_individuals: string;
  // dividend_payment_tax_institutions: string;
}

export default function FeesAndCharges() {
  const theme = useTheme();

  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [successMsgs, setSuccessMsgs] = useState("");

  const { mutate: patchFeesAndChargesParameter } =
    usePatchFeesAndChargesParameter();

  const { data: FeesAndChargesData, isSuccess } =
    useGetFeesAndChargesParameter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormInput>({
    resolver: yupResolver<any>(schema),
    // defaultValues: {
    //   depository_fee: FeesAndChargesData?.responseData?.depository_fee_rate,
    //   fund_supervisor_fee:
    //     FeesAndChargesData?.responseData?.fund_supervisor_fee_rate,
    //   fund_management_fee:
    //     FeesAndChargesData?.responseData?.fund_management_fee_rate,
    //   sebon_commission: FeesAndChargesData?.responseData?.sebon_commission_rate,
    //   annual_cdsc_fee: FeesAndChargesData?.responseData?.annual_cdsc_fee_rate,
    //   sebon_charge: FeesAndChargesData?.responseData?.sebon_charge_rate,
    //   tds_payable: FeesAndChargesData?.responseData?.tds_payable_rate,
    // },
  });
  console.log(errors, "form errors")

  useEffect(() => {
    if (isSuccess && FeesAndChargesData?.responseData) {
      reset({
        depository_fee: FeesAndChargesData.responseData.depository_fee_rate,
        fund_supervisor_fee:
          FeesAndChargesData.responseData.fund_supervisor_fee_rate,
        fund_management_fee:
          FeesAndChargesData.responseData.fund_management_fee_rate,
        annual_listing_fee:
          FeesAndChargesData.responseData.annual_listing_fee_rate,
        annual_software_fee:
          FeesAndChargesData.responseData.annual_software_fee_rate,
        schema_audit_expenses:
          FeesAndChargesData.responseData.schema_audit_expenses_rate,
        tds_rate: FeesAndChargesData.responseData.tds_rate,
        // holding_period_less_365:
        //   FeesAndChargesData.responseData.holding_period_less_365,
        // holding_period_more_365:
        //   FeesAndChargesData.responseData.holding_period_more_365,
        // resident_institution:
        //   FeesAndChargesData.responseData.resident_institution,
        // resident_natural_person:
        //   FeesAndChargesData.responseData.resident_natural_person,
        // others: FeesAndChargesData.responseData.others,
        // capital_gain_tax_for_mutual_funds:
        //   FeesAndChargesData.responseData.capital_gain_tax_for_mutual_funds,
        // dividend_income_tax:
        //   FeesAndChargesData.responseData.dividend_income_tax,
        // interest_income_tax:
        //   FeesAndChargesData.responseData.interest_income_tax,
        // dividend_payment_tax_individuals:
        //   FeesAndChargesData.responseData.dividend_payment_tax_individuals,
        // dividend_payment_tax_institutions:
        //   FeesAndChargesData.responseData.dividend_payment_tax_institutions,
      });
    }
  }, [isSuccess, FeesAndChargesData, reset]);

  const handleFessAndChargeSetup = async (data: UserFormInput) => {
    const payload = {
      depository_fee_rate: Number(data.depository_fee),
      fund_supervisor_fee_rate: Number(data.fund_supervisor_fee),
      fund_management_fee_rate: Number(data.fund_management_fee),
      annual_listing_fee_rate: Number(data.annual_listing_fee),
      annual_software_fee_rate: Number(data.annual_software_fee),
      schema_audit_expenses_rate: Number(data.schema_audit_expenses),
      tds_rate: Number(data.tds_rate),
      // other_taxes: [
      //   {
      //     capital_gain_tax_for_mutual_funds:
      //       data.capital_gain_tax_for_mutual_funds,
      //     interest_income_tax: data.interest_income_tax,
      //     dividend_income_tax: data.dividend_income_tax,
      //     // dividend_expenses_tax: data.dividend_expenses_tax,
      //     dividend_payment_tax_individuals:
      //       data.dividend_payment_tax_individuals,
      //     dividend_payment_tax_institutions:
      //       data.dividend_payment_tax_institutions,
      //   },
      // ],
      // capital_gain_tax: [
      //   {
      //     capital_gain_name:
      //       "Set Capital Gain Tax for Individuals for holding period < 365 Days",
      //     cgt_type: "individual",
      //     cgt_percentage: data.holding_period_less_365,
      //   },
      //   {
      //     capital_gain_name: "Set Capital Gain Tax",
      //     cgt_type: "institution",
      //     cgt_percentage: data.resident_institution,
      //   },
      //   {
      //     capital_gain_name: "Set Capital Gain Tax for Others",
      //     cgt_type: "Others",
      //     cgt_percentage: data.others,
      //   },
      //   {
      //     capital_gain_name:
      //       "Set Capital Gain Tax for Individuals for holding period > 365 Days",
      //     cgt_type: "individual",
      //     cgt_percentage: data.holding_period_more_365,
      //   },
      // ],
    };

    patchFeesAndChargesParameter(payload, {
      onSuccess: () => {
        setSnackbarSuccessOpen(true);
        setSuccessMsgs("Fees and charges updated successfully");
      },
      onError: (error) => {
        setSnackbarErrorOpen(true);
        if (axios.isAxiosError(error) && error.response) {
          setErrorMsgs(
            error.response.data.annual_listing_fee_rate
              ? `Annual Listing Fee % (CDSC): ${error.response.data.annual_listing_fee_rate}`
              : error.response.data.depository_fee_rate
              ? `Depository Fee: ${error.response.data.depository_fee_rate}`
              : error.response.data.fund_management_fee_rate
              ? `Fund Management Fee: ${error.response.data.fund_management_fee_rate}`
              : error.response.data.fund_supervisor_fee_rate
              ? `Fund Supervisor Fee: ${error.response.data.fund_supervisor_fee_rate}`
              : error.response.data.annual_software_fee_rate
              ? `Annual Software Fee % (CDSC): ${error.response.data.annual_software_fee_rate}`
              : error.response.data.schema_audit_expenses_rate
              ? `Scheme Audit Expenses (%): ${error.response.data.schema_audit_expenses_rate}`
              : error.response.data.tds_rate
              ? `TDS  Rate: ${error.response.data.tds_rate}`
              : // : error.response.data.others
                // ? `Others: ${error.response.data.others}`
                // : error.response.data.holding_period_less_365
                // ? `Holding Period Less than 365 Days: ${error.response.data.holding_period_less_365}`
                // : error.response.data.holding_period_more_365
                // ? `Holding Period More than 365 Days: ${error.response.data.holding_period_more_365}`
                // : error.response.data.resident_institution
                // ? `Resident Institution: ${error.response.data.resident_institution}`
                // : error.response.data.resident_natural_person
                // ? `Resident Natural Person: ${error.response.data.resident_natural_person}`
                // : error.response.data.capital_gain_tax_for_mutual_funds
                // ? `Capital Gain Tax for Mutual Funds: ${error.response.data.capital_gain_tax_for_mutual_funds}`
                // : error.response.data.dividend_income_tax
                // ? `Dividend Income Tax: ${error.response.data.dividend_income_tax}`
                // : error.response.data.interest_income_tax
                // ? `Interest Income Tax: ${error.response.data.interest_income_tax}`
                // : error.response.data.dividend_payment_tax_individuals
                // ? `Dividend Payment Tax for Individuals: ${error.response.data.dividend_payment_tax_individuals}`
                // : error.response.data.dividend_payment_tax_institutions
                // ? `Dividend Payment Tax for Institutions: ${error.response.data.dividend_payment_tax_institutions}`
                "Error in submitting data!"
          );
        } else {
          setErrorMsgs("Error while updating fees and charges");
        }
      },
    });
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: { xs: "100%", sm: "80%", md: "100%", lg: "70%" },
      }}
      // onSubmit={handleSubmit(handleFessAndChargeSetup)}
    >
      <Box sx={{ width: "50px" }}>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "19px",
            color: "#212121",
            textAlign: "center",
            width: "max-content",
            borderBottom: `1px solid ${theme.palette.secondary.main}`,
            mt: 1.5,
          }}
        >
          Management Fees
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <Box>
            <TypographyLabel title={"Depository Fee (In %)"} />
            <Controller
              name="depository_fee"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: "300px" }}
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="0.2"
                  error={Boolean(errors.depository_fee)}
                  helperText={
                    errors.depository_fee && errors.depository_fee.message
                  }
                />
              )}
            />
          </Box>
          <Box>
            <TypographyLabel title={"Fund Supervisor Fee (In %)"} />
            <Controller
              name="fund_supervisor_fee"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: "300px" }}
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="0.2"
                  error={Boolean(errors.fund_supervisor_fee)}
                  helperText={
                    errors.fund_supervisor_fee &&
                    errors.fund_supervisor_fee.message
                  }
                />
              )}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <Box>
            <TypographyLabel title={"Fund Management Fee (In %)"} />
            <Controller
              name="fund_management_fee"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: "300px" }}
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="1.5"
                  error={Boolean(errors.fund_management_fee)}
                  helperText={
                    errors.fund_management_fee &&
                    errors.fund_management_fee.message
                  }
                />
              )}
            />
          </Box>
          <Box>
            <TypographyLabel title={"TDS Rate ( %)"} />
            <Controller
              name="tds_rate"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: "300px" }}
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="1.5"
                  error={Boolean(errors.tds_rate)}
                  helperText={errors.tds_rate && errors.tds_rate.message}
                />
              )}
            />
          </Box>
        </Box>

        {/* <Box sx={{ width: "50px" }}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "19px",
              color: "#212121",
              textAlign: "center",
              width: "max-content",
              borderBottom: `1px solid ${theme.palette.secondary.main}`,
              mt: 1.5,
            }}
          >
            Annual Operating Fees
          </Typography>
        </Box> */}
        {/* <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <Box>
            <TypographyLabel title={"Annual Listing Fee (CDSC)"} />
            <Controller
              name="annual_listing_fee"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: "300px" }}
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="30"
                  error={Boolean(errors.annual_listing_fee)}
                  helperText={
                    errors.annual_listing_fee &&
                    errors.annual_listing_fee.message
                  }
                />
              )}
            />
          </Box>
          <Box>
            <TypographyLabel title={"Annual Software Fee (CDSC)"} />
            <Controller
              name="annual_software_fee"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: "300px" }}
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="25"
                  error={Boolean(errors.annual_software_fee)}
                  helperText={
                    errors.annual_software_fee &&
                    errors.annual_software_fee.message
                  }
                />
              )}
            />
          </Box>
        </Box> */}

        {/* <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <Box>
            <TypographyLabel title={"Scheme Audit Expenses "} />
            <Controller
              name="schema_audit_expenses"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: "300px" }}
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="20"
                  error={Boolean(errors.schema_audit_expenses)}
                  helperText={
                    errors.schema_audit_expenses &&
                    errors.schema_audit_expenses.message
                  }
                />
              )}
            />
          </Box>
        </Box> */}

        {/* <Box>
          <Box sx={{ width: "50px", marginTop: "15px", mb: 1 }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "19px",
                color: "#212121",
                textAlign: "center",
                width: "max-content",
                borderBottom: `1px solid ${theme.palette.secondary.main}`,
              }}
            >
              {" "}
              Capital Gain Tax (In %)
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
                  For Resident Natural Person
                </Typography>
              </Box>
              <TypographyLabelEdit
                titles={[
                  "Set Capital Gain Tax for Individuals",
                  "for holding period < 365 Days",
                ]}
              />
              <Controller
                name="holding_period_less_365"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="7.5"
                    error={!!errors.holding_period_less_365}
                    helperText={errors.holding_period_less_365?.message}
                  />
                )}
              />
            </Box>
            <Box>
              <Box sx={{ mb: 3.8 }}>
                <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
                  For Resident Institution
                </Typography>
              </Box>
              <TypographyLabelEdit titles={["Set Capital Gain Tax"]} />
              <Controller
                name="resident_institution"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="10"
                    error={!!errors.resident_institution}
                    helperText={errors.resident_institution?.message}
                    sx={{ marginTop: "9px", width: "200px" }}
                  />
                )}
              />
            </Box>
            <Box>
              <Box sx={{ mb: 3.8 }}>
                <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
                  For Others (Non-Resident)
                </Typography>
              </Box>
              <TypographyLabelEdit titles={["Set Capital Gain Tax"]} />
              <Controller
                name="others"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="15"
                    error={!!errors.others}
                    helperText={errors.others?.message}
                    sx={{ marginTop: "9px", width: "200px" }}
                  />
                )}
              />
            </Box>
          </Box>
          <Box sx={{ width: "50%", marginTop: "15px" }}>
            <TypographyLabelEdit
              titles={[
                "Set Capital Gain Tax for Individuals",
                "for holding period > 365 Days",
              ]}
            />
            <Controller
              name="holding_period_more_365"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="5"
                  error={!!errors.holding_period_more_365}
                  helperText={errors.holding_period_more_365?.message}
                />
              )}
            />
          </Box>

          <Box sx={{ width: "50px", marginTop: "15px", mb: 1 }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "19px",
                color: "#212121",
                textAlign: "center",
                width: "max-content",
                borderBottom: `1px solid ${theme.palette.secondary.main}`,
              }}
            >
              {" "}
              Other Taxes (In %)
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Box>
              <TypographyLabelEdit
                titles={["Capital Gain Tax", "for Mutual Funds (%)"]}
              />
              <Controller
                name="capital_gain_tax_for_mutual_funds"
                control={control}
                render={({ field }) => (
                  <TextField
                    sx={{ width: "200px" }}
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="1.5"
                    error={Boolean(errors.capital_gain_tax_for_mutual_funds)}
                    helperText={
                      errors.capital_gain_tax_for_mutual_funds &&
                      errors.capital_gain_tax_for_mutual_funds.message
                    }
                  />
                )}
              />
            </Box>
            <Box>
              <TypographyLabelEdit
                titles={["Dividend Income Tax", "for Mutual Funds (%)"]}
              />
              <Controller
                name="dividend_income_tax"
                control={control}
                render={({ field }) => (
                  <TextField
                    sx={{ width: "200px" }}
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="1.5"
                    error={Boolean(errors.dividend_income_tax)}
                    helperText={
                      errors.dividend_income_tax &&
                      errors.dividend_income_tax.message
                    }
                  />
                )}
              />
            </Box>
            <Box>
              <TypographyLabelEdit
                titles={["Interest Income Tax", "for Mutual Funds (%)"]}
              />{" "}
              <Controller
                name="interest_income_tax"
                control={control}
                render={({ field }) => (
                  <TextField
                    sx={{ width: "200px" }}
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="1.5"
                    error={Boolean(errors.interest_income_tax)}
                    helperText={
                      errors.interest_income_tax &&
                      errors.interest_income_tax.message
                    }
                  />
                )}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box>
              <TypographyLabelEdit
                titles={["Dividend Payment Tax", "for Individuals (%)"]}
              />
              <Controller
                name="dividend_payment_tax_individuals"
                control={control}
                render={({ field }) => (
                  <TextField
                    sx={{ width: "200px" }}
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="5"
                    error={Boolean(errors.dividend_payment_tax_individuals)}
                    helperText={
                      errors.dividend_payment_tax_individuals &&
                      errors.dividend_payment_tax_individuals.message
                    }
                  />
                )}
              />
            </Box>
            <Box>
              <TypographyLabelEdit
                titles={["Dividend Payment Tax", "for Institutions (%)"]}
              />
              <Controller
                name="dividend_payment_tax_institutions"
                control={control}
                render={({ field }) => (
                  <TextField
                    sx={{ width: "200px" }}
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="5"
                    error={Boolean(errors.dividend_payment_tax_institutions)}
                    helperText={
                      errors.dividend_payment_tax_institutions &&
                      errors.dividend_payment_tax_institutions.message
                    }
                  />
                )}
              />
            </Box>
          </Box>
        </Box> */}
      </Box>
      <RoundedButton
        title1="Set Charges"
        onClick1={handleSubmit(handleFessAndChargeSetup)}
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
  );
}
