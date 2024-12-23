import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import RoundedButton from "components/Button/Button";
import TypographyLabel, {
  TypographyLabelEdit,
} from "components/InputLabel/TypographyLabel";
import RadioYesNo from "components/RadioButtons/RadioYesNo";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import {
  usePatchGeneralParameter,
  useGetGeneralParameterList,
} from "services/GeneralParameters/GeneralParametersService";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import DateField from "components/DateFilter/DateField";
// import DateField from "components/DateField/DateField";
import dayjs from "dayjs";
// import DateRangePicker from "components/DateFilter/AntDesignFilter";
// import DateFormatter from "utils/DateFormatter";

const DateFormatterUnit = {
  format: (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  },
};

const validationSchema = yup
  .object()
  .shape({
    startDate: yup.object().required(),
    endDate: yup.object().required(),

    par_value: yup.string().required("Mutual Fund Face Value is required"),
    radio_yes_no: yup.string().required("Selection is required"),
    pick_redemption_method: yup
      .string()
      .required("Redemption Method is required"),

    up_to_6_months: yup.string().required("Up to 6 Months is required"),
    six_to_12_months: yup.string().required("6 to 12 Months is required"),
    twelve_to_18_months: yup.string().required("12 to 18 Months is required"),
    eighteen_to_24_months: yup.string().required("18 to 24 Months is required"),
    above_24_months: yup.string().required("Above 24 Months is required"),

    entry_load_value: yup.string().required("Entry Load is required"),
    dp_charge: yup.string().required("Depository Participants is required"),
    dp_charge_listed_securities: yup
      .string()
      .required("Depository Participants is required"),

    resident_institution: yup
      .string()
      .required("For Resident Institution is required"),
    others: yup.string().required("For Others is required"),
    holding_period_less_365: yup
      .string()
      .required("For holding period < 365 Days is required"),
    holding_period_more_365: yup
      .string()
      .required("For holding period > 365 Days is required"),
    capital_gain_tax_for_mutual_funds: yup
      .string()
      .required("Capital Gain Tax for Mutual Funds is required "),
    dividend_income_tax: yup
      .string()
      .required("Interest and Dividend Income Tax is required"),
    interest_income_tax: yup
      .string()
      .required("Interest Income Tax is required"),
    // dividend_expenses_tax: yup
    //   .string()
    //   .required("Dividend Expenses Tax is required"),
    dividend_payment_tax_individuals: yup
      .string()
      .required("Dividend Payment Tax for Individuals is required"),
    dividend_payment_tax_institutions: yup
      .string()
      .required("Dividend Payment Tax for Institutions is required "),
  })
  .required();

export default function GeneralParameters() {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
    },
  });

  console.log(errors, "errors");

  const [successbarOpen, setSuccessbarOpen] = useState(false);
  const [errorbarOpen, setErrorbarOpen] = useState(false);
  // const [fiscalYear, setFiscalYear] = useState({
  //   start_date: dayjs(),
  //   end_date: dayjs(),
  // });

  const { data: initialData } = useGetGeneralParameterList();

  const { mutate: updateParameters } = usePatchGeneralParameter();

  // useEffect(() => {
  // if (initialData) {
  //   // setValue("radio_yes_no", initialData.radio_yes_no);
  //   setValue(
  //     "par_value",
  //     // initialData.responseData.per_values[0].value
  //     initialData?.responseData?.par_values[0]?.value ?? ""
  //   );
  //   setValue(
  //     "radio_yes_no",
  //     initialData?.responseData?.redemption_method[0]?.enable_redem ?? ""
  //   );
  //   setValue(
  //     "pick_redemption_method",
  //     initialData?.responseData?.redemption_method[0]?.redem_method ?? ""
  //   );
  //     setValue(
  //       "up_to_6_months",
  //       initialData?.responseData?.exit_load[4]?.exit_load_percentage ?? ""
  //     );
  //     setValue(
  //       "six_to_12_months",
  //       initialData?.responseData?.exit_load[3]?.exit_load_percentage ?? ""
  //     );
  //     setValue(
  //       "twelve_to_18_months",
  //       initialData?.responseData?.exit_load[1]?.exit_load_percentage ?? ""
  //     );
  //     setValue(
  //       "eighteen_to_24_months",
  //       initialData?.responseData?.exit_load[0]?.exit_load_percentage ?? ""
  //     );
  //     setValue(
  //       "above_24_months",
  //       initialData?.responseData?.exit_load[2]?.exit_load_percentage ?? ""
  //     );

  //     setValue(
  //       "holding_period_less_365",
  //       initialData?.responseData?.capital_gain_tax[3]?.cgt_percentage ?? ""
  //     );
  //     setValue(
  //       "resident_institution",
  //       initialData?.responseData?.capital_gain_tax[2]?.cgt_percentage ?? ""
  //     );
  //     setValue(
  //       "others",
  //       initialData?.responseData?.capital_gain_tax[1]?.cgt_percentage ?? ""
  //     );
  //     setValue(
  //       "holding_period_more_365",
  //       initialData?.responseData?.capital_gain_tax[0]?.cgt_percentage ?? ""
  //     );

  //     setValue(
  //       "interest_dividend_tax",
  //       initialData?.responseData?.other_taxes[1]?.tax_percentage ?? ""
  //     );
  //     setValue(
  //       "dividend_expenses_tax",
  //       initialData?.responseData?.other_taxes[0]?.tax_percentage ?? ""
  //     );
  //   }
  // }, [initialData, setValue]);

  useEffect(() => {
    if (initialData) {
      const responseData = initialData.responseData;

      // // Set par value
      // const parValue = responseData.par_values?.[0]?.value ?? "";
      // setValue("par_value", parValue);

      // // Set redemption method
      // const redemptionMethod = responseData.redemption_method?.find(
      //   method => method.redem_method === "fifo"
      // );
      // setValue("radio_yes_no", redemptionMethod?.enable_redem ?? "");
      // setValue("pick_redemption_method", redemptionMethod?.redem_method ?? "");
      // setValue("radio_yes_no", initialData.radio_yes_no);

      // set fiscal year
      setValue(
        "startDate",
        dayjs(
          initialData?.responseData?.fiscal_year[0]?.start_date ?? dayjs()
        )
      );
      setValue(
        "endDate",
        dayjs(
          initialData?.responseData?.fiscal_year[0]?.end_date ?? dayjs()
        )
      );

      // set par value
      setValue(
        "par_value",
        // initialData.responseData.per_values[0].value
        initialData?.responseData?.par_values[0]?.value ?? ""
      );
      setValue(
        "radio_yes_no",
        initialData?.responseData?.redemption_method[0]?.enable_redeem ?? ""
      );
      setValue(
        "pick_redemption_method",
        initialData?.responseData?.redemption_method[0]?.redeem_method ?? ""
      );

      // Set exit loads
      const exitLoadMap = {
        up_to_6_months: "up_to_6_months",
        "6_to_12_months": "six_to_12_months",
        "12_to_18_months": "twelve_to_18_months",
        "18_to_24_months": "eighteen_to_24_months",
        above_24_months: "above_24_months",
      };
      responseData.exit_load.forEach((exitLoad) => {
        const fieldName = exitLoadMap[exitLoad.months_range];
        if (fieldName) {
          setValue(fieldName, exitLoad.exit_load_percentage ?? "");
        }
      });

      // set Entry Load
      const entryLoadMap = {
        month_range: "entry_load_value",
      };
      responseData.entry_load.forEach((entryLoad) => {
        const fieldName = entryLoadMap[entryLoad.month_range];
        if (fieldName) {
          setValue(fieldName, entryLoad.entry_load_percentage ?? "");
        }
      });

      // Set depository participants charges
      const DP_ChargeMap = {
        dp_charge: "dp_charge",
        dp_charge_listed_securities: "dp_charge_listed_securities",
      };
      responseData.dp_charge.forEach((dpCharge) => {
        const fieldName = DP_ChargeMap[dpCharge.name];
        if (fieldName) {
          setValue(fieldName, dpCharge.dp_charge.toString());
        }
      });

      // Set capital gain taxes
      const capitalGainTaxMap = {
        "Set Capital Gain Tax for Individuals for holding period < 365 Days":
          "holding_period_less_365",
        "Set Capital Gain Tax for Individuals for holding period > 365 Days":
          "holding_period_more_365",
        "Set Capital Gain Tax for Others": "others",
        "Set Capital Gain Tax": "resident_institution",
      };
      responseData.capital_gain_tax.forEach((tax) => {
        const fieldName = capitalGainTaxMap[tax.capital_gain_name];
        if (fieldName) {
          setValue(fieldName, tax.cgt_percentage ?? "");
        }
      });

      // Set other taxes
      const otherTaxesMap = {
        capital_gain_tax_for_mutual_funds: "capital_gain_tax_for_mutual_funds",
        dividend_income_tax: "dividend_income_tax",
        interest_income_tax: "interest_income_tax",
        // "dividend_expenses_tax": "dividend_expenses_tax"
        dividend_payment_tax_individuals: "dividend_payment_tax_individuals",
        dividend_payment_tax_institutions: "dividend_payment_tax_institutions",
      };
      responseData.other_taxes.forEach((tax) => {
        const fieldName = otherTaxesMap[tax.tax_name];
        if (fieldName) {
          setValue(fieldName, tax.tax_percentage ?? "");
        }
      });
    }
  }, [initialData, setValue]);

  // console.log(fiscalYear, "fiscalYear");
  // console.log(data.start_date, "start_date");

  const handleAdd = (data) => {
    // if (data?.startDate && data?.endDate) {
    //   const fromDate = new Date(data?.startDate);
    //   const toDate = new Date(data?.endDate);

    //   const formattedFromDate = DateFormatter.format(fromDate.toISOString());
    //   const formattedToDate = DateFormatterUnit.format(toDate.toISOString());

    //   if (formattedFromDate && formattedToDate) {
    //     setFiscalYear({
    //       start_date: dayjs(formattedFromDate),
    //       end_date: dayjs(formattedToDate),
    //     });
    //   }
    // }

    // const startData = DateFormatterUnit.format(data.startDate);
    // const endData = DateFormatterUnit.format(data.endDate);

    const payload = {
      fiscal_year: {
        // start_date: (fiscalYear.start_date),
        // end_date: (fiscalYear.end_date),
        start_date: DateFormatterUnit.format(data.startDate),
        end_date: DateFormatterUnit.format(data.endDate),
      },
      redemption_method: [
        {
          enable_redem: data.radio_yes_no,
          redeem_method: data.pick_redemption_method,
        },
      ],

      entry_load: [
        {
          month_range: data.entry_load_value,
        },
      ],

      dp_charge: [
        {
          dp_charge: data.dp_charge,
          dp_charge_listed_securities: data.dp_charge_listed_securities,
        },
      ],

      exit_load: [
        {
          up_to_6_months: data.up_to_6_months,
          "6_to_12_months": data.six_to_12_months,
          "12_to_18_months": data.twelve_to_18_months,
          "18_to_24_months": data.eighteen_to_24_months,
          above_24_months: data.above_24_months,
        },
      ],
      other_taxes: [
        {
          capital_gain_tax_for_mutual_funds:
            data.capital_gain_tax_for_mutual_funds,
          interest_income_tax: data.interest_income_tax,
          dividend_income_tax: data.dividend_income_tax,
          // dividend_expenses_tax: data.dividend_expenses_tax,
          dividend_payment_tax_individuals:
            data.dividend_payment_tax_individuals,
          dividend_payment_tax_institutions:
            data.dividend_payment_tax_institutions,
        },
      ],
      capital_gain_tax: [
        {
          capital_gain_name:
            "Set Capital Gain Tax for Individuals for holding period < 365 Days",
          cgt_type: "individual",
          cgt_percentage: data.holding_period_less_365,
        },
        {
          capital_gain_name: "Set Capital Gain Tax",
          cgt_type: "institution",
          cgt_percentage: data.resident_institution,
        },
        {
          capital_gain_name: "Set Capital Gain Tax for Others",
          cgt_type: "Others",
          cgt_percentage: data.others,
        },
        {
          capital_gain_name:
            "Set Capital Gain Tax for Individuals for holding period > 365 Days",
          cgt_type: "individual",
          cgt_percentage: data.holding_period_more_365,
        },
      ],
      par_values: [
        {
          value: data.par_value,
        },
      ],
    };

    updateParameters(payload, {
      onSuccess: () => {
        setSuccessbarOpen(true);
      },
      onError: (error) => {
        console.log(error);
        setErrorbarOpen(true);
      },
    });
  };

  return (
    <>
      <SuccessBar
        setSnackbarOpen={setSuccessbarOpen}
        snackbarOpen={successbarOpen}
        message="Parameters Updated Successfully"
      />

      <ErrorBar
        setSnackbarOpen={setErrorbarOpen}
        snackbarOpen={errorbarOpen}
        message="Error Updating Parameters"
      />

      <Box component="form" onSubmit={handleSubmit(handleAdd)}>
        <Box sx={{ width: "50px", marginBottom: "5px" }}>
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
            Fiscal Year
          </Typography>
        </Box>

        <Box sx={{ width: "50%" }}>
          <DateField
            control={control}
            dateLabel1="Start Date"
            dateLabel2="End Date"
            isMinDate={false}
            // minDateValue={dayjs()}
            // maxDateValue={dayjs()}
          />
        </Box>

        <Box sx={{ width: "50px", mt: 2 }}>
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
            Mutual Fund Parameters
          </Typography>
        </Box>
        <Box sx={{ width: "50%", mt: "5px", mb: 2 }}>
          <TypographyLabel title={"Mutual Fund Face Value (Rs)"} />
          <Controller
            name="par_value"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder="10"
                error={!!errors.par_value}
                helperText={errors.par_value?.message}
              />
            )}
          />
        </Box>
        <Box sx={{ width: "50px", marginBottom: "5px" }}>
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
            Redemption Method{" "}
          </Typography>
        </Box>
        <Box>
          {/* { !initialData?.responseData?.redemption_method[0].enable_redem === true? (
                <RadioYesNo value={"No"} />
            ) : (
                <RadioYesNo value={"Yes"} />
            )} */}
          <Box>
            <Controller
              name="radio_yes_no"
              defaultValue=""
              control={control}
              render={({ field }) => <RadioYesNo {...field} />}
            />
            {errors.radio_yes_no && (
              <Typography
                color="error"
                sx={{
                  fontSize: "12px",
                }}
              >
                {errors.radio_yes_no.message}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ width: "50%" }}>
          <TypographyLabel title={"Pick Redemption Method"} />
          <Controller
            name="pick_redemption_method"
            defaultValue="wacc"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                size="small"
                fullWidth
                error={!!errors.pick_redemption_method}
              >
                <MenuItem value="wacc">WACC</MenuItem>
                <MenuItem value="fifo">FIFO</MenuItem>
                <MenuItem value="lifo">LIFO</MenuItem>
              </Select>
            )}
          />
          {errors.pick_redemption_method && (
            <Typography
              color="error"
              sx={{
                fontSize: "12px",
              }}
            >
              {errors.pick_redemption_method.message}
            </Typography>
          )}
        </Box>

        <Box sx={{ width: "50px", marginTop: "10px" }}>
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
            Entry Load (In %)
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ width: "50%", marginTop: "10px" }}>
            {/* <TypographyLabel title={"...."} /> */}
            <Controller
              name="entry_load_value"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="0"
                  error={!!errors.entry_load_value}
                  helperText={errors.entry_load_value?.message}
                />
              )}
            />
          </Box>
        </Box>

        <Box sx={{ width: "50px", marginTop: "15px" }}>
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
            Exit Load (In %)
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ width: "50%", marginTop: "10px" }}>
            <TypographyLabel title={"Up to 6 Months"} />
            <Controller
              name="up_to_6_months"
              defaultValue={
                initialData?.responseData.exit_load.exit_load_percentage
              }
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="1.5"
                  error={!!errors.up_to_6_months}
                  helperText={errors.up_to_6_months?.message}
                />
              )}
            />
          </Box>
          <Box sx={{ width: "50%", marginTop: "10px" }}>
            <TypographyLabel title={"6 to 12 Months"} />
            <Controller
              name="six_to_12_months"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="1.25"
                  error={!!errors.six_to_12_months}
                  helperText={errors.six_to_12_months?.message}
                />
              )}
            />
          </Box>
          <Box sx={{ width: "50%", marginTop: "10px" }}>
            <TypographyLabel title={"12 to 18 Months"} />
            <Controller
              name="twelve_to_18_months"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="1"
                  error={!!errors.twelve_to_18_months}
                  helperText={errors.twelve_to_18_months?.message}
                />
              )}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ width: "50%", marginTop: "15px" }}>
            <TypographyLabel title={"18 to 24 Months"} />
            <Controller
              name="eighteen_to_24_months"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="0.75"
                  error={!!errors.eighteen_to_24_months}
                  helperText={errors.eighteen_to_24_months?.message}
                />
              )}
            />
          </Box>
          <Box sx={{ width: "50%", marginTop: "15px" }}>
            <TypographyLabel title={"Above 24 Months"} />
            <Controller
              name="above_24_months"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="0"
                  error={!!errors.above_24_months}
                  helperText={errors.above_24_months?.message}
                />
              )}
            />
          </Box>
        </Box>

        <Box sx={{ width: "50px", marginTop: "15px" }}>
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
            Depository Participants
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ width: "50%", marginTop: "10px" }}>
            <TypographyLabel title={"DP Fee For SIP / Unit Purchase ( NPR )"} />
            <Controller
              name="dp_charge"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="5"
                  error={!!errors.dp_charge}
                  helperText={errors.dp_charge?.message}
                />
              )}
            />
          </Box>
          <Box sx={{ width: "50%", marginTop: "10px" }}>
            <TypographyLabel title={"DP Fee For Listed Securities ( NPR )"} />
            <Controller
              name="dp_charge_listed_securities"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="25"
                  error={!!errors.dp_charge_listed_securities}
                  helperText={errors.dp_charge_listed_securities?.message}
                />
              )}
            />
          </Box>
        </Box>

        <Box sx={{ width: "50px", marginTop: "15px" }}>
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
        <Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ width: "50%", marginTop: "10px" }}>
              <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
                For Resident Natural Person
              </Typography>
            </Box>
            <Box sx={{ width: "50%", marginTop: "10px" }}>
              <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
                For Resident Institution
              </Typography>
            </Box>
            <Box sx={{ width: "50%", marginTop: "10px" }}>
              <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
                For Others (Non-Resident)
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ width: "50%", marginTop: "15px" }}>
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
            <Box sx={{ width: "50%", marginTop: "30px" }}>
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
                    sx={{ marginTop: "9px" }}
                  />
                )}
              />
            </Box>
            <Box sx={{ width: "50%", marginTop: "30px" }}>
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
                    sx={{ marginTop: "9px" }}
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
        </Box>
        <Box sx={{ width: "50px", marginTop: "15px" }}>
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
        <Box sx={{ display: "grid", gap: 2 }}>
          <Box sx={{ width: "50%", marginTop: "5px" }}>
            <TypographyLabel title={"Capital Gain Tax for Mutual Funds"} />
            <Controller
              name="capital_gain_tax_for_mutual_funds"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="0"
                  error={!!errors.capital_gain_tax_for_mutual_funds}
                  helperText={errors.capital_gain_tax_for_mutual_funds?.message}
                />
              )}
            />
          </Box>
          <Box sx={{ width: "50%", marginTop: "15px" }}>
            <TypographyLabel title={"Dividend Income Tax for Mutual Funds"} />
            <Controller
              name="dividend_income_tax"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="0"
                  error={!!errors.dividend_income_tax}
                  helperText={errors.dividend_income_tax?.message}
                />
              )}
            />
          </Box>
          <Box sx={{ width: "50%", marginTop: "15px" }}>
            <TypographyLabel title={"Interest Income Tax for Mutual Funds"} />
            <Controller
              name="interest_income_tax"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="0"
                  error={!!errors.interest_income_tax}
                  helperText={errors.interest_income_tax?.message}
                />
              )}
            />
          </Box>
          {/* <Box sx={{ width: "50%", marginTop: "15px" }}>
            <TypographyLabel title={"Dividend Expenses Tax"} />
            <Controller
              name="dividend_expenses_tax"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="5"
                  error={!!errors.dividend_expenses_tax}
                  helperText={errors.dividend_expenses_tax?.message}
                />
              )}
            />
          </Box> */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ width: "50%", marginTop: "15px" }}>
              <TypographyLabel title={"Dividend Payment Tax for Individuals"} />
              <Controller
                name="dividend_payment_tax_individuals"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="5"
                    error={!!errors.dividend_payment_tax_individuals}
                    helperText={
                      errors.dividend_payment_tax_individuals?.message
                    }
                  />
                )}
              />
            </Box>
            <Box sx={{ width: "50%", marginTop: "15px" }}>
              <TypographyLabel
                title={"Dividend Payment Tax for Institutions"}
              />
              <Controller
                name="dividend_payment_tax_institutions"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="15"
                    error={!!errors.dividend_payment_tax_institutions}
                    helperText={
                      errors.dividend_payment_tax_institutions?.message
                    }
                  />
                )}
              />
            </Box>
          </Box>
        </Box>
        <Box>
          <RoundedButton title1="Set Parameters" />
        </Box>
      </Box>
    </>
  );
}

// import { Box, MenuItem, Select, TextField, Typography, useTheme } from "@mui/material";
// import RoundedButton from "components/Button/Button";
// import TypographyLabel, { TypographyLabelEdit } from "components/InputLabel/TypographyLabel";
// import RadioYesNo from "components/RadioButtons/RadioYesNo";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useForm, Controller, SubmitHandler } from "react-hook-form";
// import {
//     usePatchGeneralParameters,
//     useGetGeneralParameters
//   } from "services/GeneralParameters/GeneralParametersService";

// interface IFormInputs {
//     pick_redemption_method: string;
//     up_to_6_months: string;
//     six_to_12_months: string;
//     twelve_to_18_months: string;
//     eighteen_to_24_months: string;
//     above_24_months: string;
//     resident_natural_person: string;
//     resident_institution: string;
//     others: string;
//     holding_period_less_365: string;
//     holding_period_more_365: string;
//     interest_dividend_tax: string;
//     dividend_expenses_tax: string;
// }

// const validationSchema = yup.object().shape({
//     pick_redemption_method: yup.string().required('Pick Redemption Method is required'),
//     up_to_6_months: yup.string().required('Up to 6 Months is required'),
//     six_to_12_months: yup.string().required('6 to 12 Months is required'),
//     twelve_to_18_months: yup.string().required('12 to 18 Months is required'),
//     eighteen_to_24_months: yup.string().required('18 to 24 Months is required'),
//     above_24_months: yup.string().required('Above 24 Months is required'),
//     resident_natural_person: yup.string().required('For Resident Natural Person is required'),
//     resident_institution: yup.string().required('For Resident Institution is required'),
//     others: yup.string().required('For Others is required'),
//     holding_period_less_365: yup.string().required('For holding period < 365 Days is required'),
//     holding_period_more_365: yup.string().required('For holding period > 365 Days is required'),
//     interest_dividend_tax: yup.string().required('Interest and Dividend Income Tax is required'),
//     dividend_expenses_tax: yup.string().required('Dividend Expenses Tax is required'),
// }).required();

// export default function GeneralParameters() {
//     const theme = useTheme();

//     const {
//         control,
//         handleSubmit,
//         formState: { errors, isSubmitSuccessful },
//     } = useForm({
//         resolver: yupResolver(validationSchema),
//         defaultValues: {
//             pick_redemption_method: "FIFO",
//             up_to_6_months: "",
//             six_to_12_months: "",
//             twelve_to_18_months: "",
//             eighteen_to_24_months: "",
//             above_24_months: "",
//             resident_natural_person: "",
//             resident_institution: "",
//             others: "",
//             holding_period_less_365: "",
//             holding_period_more_365: "",
//             interest_dividend_tax: "",
//             dividend_expenses_tax: "",
//         },
//     });

//   const { data: FixedDepositData } = useGetGeneralParameters();

//   const { mutate: SectorDataAdded } = usePatchGeneralParameters();

//     const handleAdd: SubmitHandler<IFormInputs> = (data) => {
//         console.log("Form data", data);
//     };

//     return (
//         <Box component="form" onSubmit={handleSubmit(handleAdd)}>
//             <Box sx={{ width: "50px", marginBottom: "15px" }}>
//                 <Typography
//                     sx={{
//                         fontSize: "16px",
//                         fontWeight: 600,
//                         lineHeight: "19px",
//                         color: "#212121",
//                         textAlign: "center",
//                         width: "max-content",
//                         borderBottom: `1px solid ${theme.palette.secondary.main}`,
//                     }}
//                 >
//                     {" "}
//                     Redemption Method{" "}
//                 </Typography>
//             </Box>
//             <Box>
//                 <RadioYesNo value={"Yes"} />
//             </Box>
//             <Box sx={{ width: "50%" }}>
//                 <TypographyLabel title={"Pick Redemption Method"} />
//                 <Controller
//                     name="pick_redemption_method"
//                     defaultValue="FIFO"
//                     control={control}
//                     render={({ field }) => (
//                         <Select {...field} size="small" fullWidth error={!!errors.pick_redemption_method}>
//                             <MenuItem value="FIFO">FIFO</MenuItem>
//                             <MenuItem value="LIFO">LIFO</MenuItem>
//                         </Select>
//                     )}
//                 />
//                 {errors.pick_redemption_method && (
//                     <Typography color="error">{errors.pick_redemption_method.message}</Typography>
//                 )}
//             </Box>
//             <Box sx={{ width: "50px", marginTop: "15px" }}>
//                 <Typography
//                     sx={{
//                         fontSize: "16px",
//                         fontWeight: 600,
//                         lineHeight: "19px",
//                         color: "#212121",
//                         textAlign: "center",
//                         width: "max-content",
//                         borderBottom: `1px solid ${theme.palette.secondary.main}`,
//                     }}
//                 >
//                  Exit Load
//                 </Typography>
//             </Box>

//             <Box sx={{ display: "flex", gap: 2 }}>
//                 <Box sx={{ width: "50%", marginTop: "15px" }}>
//                     <TypographyLabel title={"Up to 6 Months"} />
//                     <Controller
//                         name="up_to_6_months"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 size="small"
//                                 placeholder="1.5%"
//                                 error={!!errors.up_to_6_months}
//                                 helperText={errors.up_to_6_months?.message}
//                             />
//                         )}
//                     />
//                 </Box>
//                 <Box sx={{ width: "50%", marginTop: "15px" }}>
//                     <TypographyLabel title={"6 to 12 Months"} />
//                     <Controller
//                         name="six_to_12_months"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 size="small"
//                                 placeholder="1.25%"
//                                 error={!!errors.six_to_12_months}
//                                 helperText={errors.six_to_12_months?.message}
//                             />
//                         )}
//                     />
//                 </Box>
//                 <Box sx={{ width: "50%", marginTop: "15px" }}>
//                     <TypographyLabel title={"12 to 18 Months"} />
//                     <Controller
//                         name="twelve_to_18_months"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 size="small"
//                                 placeholder="1%"
//                                 error={!!errors.twelve_to_18_months}
//                                 helperText={errors.twelve_to_18_months?.message}
//                             />
//                         )}
//                     />
//                 </Box>
//             </Box>

//             <Box sx={{ display: "flex", gap: 2 }}>
//                 <Box sx={{ width: "50%", marginTop: "15px" }}>
//                     <TypographyLabel title={"18 to 24 Months"} />
//                     <Controller
//                         name="eighteen_to_24_months"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 size="small"
//                                 placeholder="0.25%"
//                                 error={!!errors.eighteen_to_24_months}
//                                 helperText={errors.eighteen_to_24_months?.message}
//                             />
//                         )}
//                     />
//                 </Box>
//                 <Box sx={{ width: "50%", marginTop: "15px" }}>
//                     <TypographyLabel title={"Above 24 Months"} />
//                     <Controller
//                         name="above_24_months"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 size="small"
//                                 placeholder="0.75%"
//                                 error={!!errors.above_24_months}
//                                 helperText={errors.above_24_months?.message}
//                             />
//                         )}
//                     />
//                 </Box>
//             </Box>

//             <Box sx={{ width: "50px", marginTop: "15px" }}>
//                 <Typography
//                     sx={{
//                         fontSize: "16px",
//                         fontWeight: 600,
//                         lineHeight: "19px",
//                         color: "#212121",
//                         textAlign: "center",
//                         width: "max-content",
//                         borderBottom: `1px solid ${theme.palette.secondary.main}`,
//                     }}
//                 >
//                     {" "}
//                     Capital Gain Tax{" "}
//                 </Typography>
//             </Box>
//             <Box>
//                 <Box sx={{ display: "flex", gap: 2 }}>
//                     <Box sx={{ width: "50%", marginTop: "15px" }}>
//                         <TypographyLabel  title={"For Resident Natural Person"} />
//                     </Box>
//                     <Box sx={{ width: "50%", marginTop: "15px" }}>
//                         <TypographyLabel title={"For Resident Institution"} />
//                     </Box>
//                     <Box sx={{ width: "50%", marginTop: "15px" }}>
//                         <TypographyLabel title={"For Others"} />
//                     </Box>
//                 </Box>
//                 <Box sx={{ display: "flex", gap: 2 }}>
//                     <Box sx={{ width: "50%", marginTop: "15px" }}>
//                         <TypographyLabelEdit titles={["Set Capital Gain Tax for Individuals", "for holding period < 365 Days"]} />
//                         <Controller
//                             name="holding_period_less_365"
//                             control={control}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     size="small"
//                                     placeholder="7.5%"
//                                     error={!!errors.holding_period_less_365}
//                                     helperText={errors.holding_period_less_365?.message}
//                                 />
//                             )}
//                         />
//                     </Box>
//                     <Box sx={{ width: "50%", marginTop: "30px" }}>
//                         <TypographyLabel title={"Set Capital Gain Tax"} />
//                         <Controller
//                             name="resident_institution"
//                             control={control}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     size="small"
//                                     placeholder="10%"
//                                     error={!!errors.resident_institution}
//                                     helperText={errors.resident_institution?.message}
//                                     sx={{ marginTop: "9px" }}
//                                 />
//                             )}
//                         />
//                     </Box>
//                     <Box sx={{ width: "50%", marginTop: "30px" }}>
//                         <TypographyLabel title={"Set Capital Gain Tax"} />
//                         <Controller
//                             name="others"
//                             control={control}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     size="small"
//                                     placeholder="25%"
//                                     error={!!errors.others}
//                                     helperText={errors.others?.message}
//                                     sx={{ marginTop: "9px" }}
//                                 />
//                             )}
//                         />
//                     </Box>
//                 </Box>
//                 <Box sx={{ width: "50%", marginTop: "15px" }}>
//                     <TypographyLabelEdit titles={["Set Capital Gain Tax for Individuals", "for holding period > 365 Days"]} />
//                     <Controller
//                         name="holding_period_more_365"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 size="small"
//                                 placeholder="5%"
//                                 error={!!errors.holding_period_more_365}
//                                 helperText={errors.holding_period_more_365?.message}
//                             />
//                         )}
//                     />
//                 </Box>
//             </Box>
//             <Box sx={{ width: "50px", marginTop: "15px" }}>
//                 <Typography
//                     sx={{
//                         fontSize: "16px",
//                         fontWeight: 600,
//                         lineHeight: "19px",
//                         color: "#212121",
//                         textAlign: "center",
//                         width: "max-content",
//                         borderBottom: `1px solid ${theme.palette.secondary.main}`,
//                     }}
//                 >
//                     {" "}
//                     Other Taxes{" "}
//                 </Typography>
//             </Box>
//             <Box sx={{ display: "grid", gap: 2 }}>
//                 <Box sx={{ width: "50%", marginTop: "15px" }}>
//                     <TypographyLabel title={"Interest and Dividend Income Tax"} />
//                     <Controller
//                         name="interest_dividend_tax"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 size="small"
//                                 placeholder="0%"
//                                 error={!!errors.interest_dividend_tax}
//                                 helperText={errors.interest_dividend_tax?.message}
//                             />
//                         )}
//                     />
//                 </Box>
//                 <Box sx={{ width: "50%", marginTop: "15px" }}>
//                     <TypographyLabel title={"Dividend Expenses Tax"} />
//                     <Controller
//                         name="dividend_expenses_tax"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 size="small"
//                                 placeholder="5%"
//                                 error={!!errors.dividend_expenses_tax}
//                                 helperText={errors.dividend_expenses_tax?.message}
//                             />
//                         )}
//                     />
//                 </Box>
//             </Box>
//             <Box>
//                 <RoundedButton title1="Set Parameters" onClick1={handleSubmit(handleAdd)} />
//             </Box>
//         </Box>
//     );
// }

// import { Box, MenuItem, Select, TextField, Typography, useTheme } from "@mui/material";
// import RoundedButton from "components/Button/Button";
// import TypographyLabel, { TypographyLabelEdit } from "components/InputLabel/TypographyLabel";
// import RadioYesNo from "components/RadioButtons/RadioYesNo";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useForm, Controller, SubmitHandler } from "react-hook-form";

// interface IFormInputs {
//     pick_redemption_method: string;
// }

// export default function GeneralParameters() {
//     const theme = useTheme();

//     const schema = yup
//         .object({
//             pick_redemption_method: yup.string().required().label("pick_redemption_method"),
//         })
//         .required();
//     const {
//         control,
//         handleSubmit,
//         formState: { errors, isSubmitSuccessful },
//     } = useForm<IFormInputs>({
//         resolver: yupResolver<any>(schema),
//         defaultValues: {

//         },
//     });

//     const handleAdd: SubmitHandler<IFormInputs> = (data) => {
//         console.log("Form data", data);
//     };

//     return (
//         <Box component="form" onClick={handleSubmit(handleAdd)} >
//             <Box sx={{ width: "50px", marginBottom: "15px" }}>
//                 <Typography
//                     sx={{
//                         fontSize: "16px",
//                         fontWeight: 600,
//                         lineHeight: "19px",
//                         color: "#212121",
//                         textAlign: "center",
//                         width: "max-content",
//                         borderBottom: `1px solid ${theme.palette.secondary.main}`,
//                     }}
//                 >
//                     {" "}
//                     Redemption Method{" "}
//                 </Typography>
//             </Box>
//             <Box>
//                 <RadioYesNo value={""} />
//             </Box>
//             <Box sx={{ width: "50%" }}>
//                 <TypographyLabel title={"Pick Redemption Method"} />
//                 <Controller
//                     name="pick_redemption_method"
//                     control={control}
//                     render={({ field }) => (
//                         <Select {...field} size="small" fullWidth>
//                             <MenuItem value="Thapathali">FIFO</MenuItem>
//                             <MenuItem value="Durbarmarg">LIFO</MenuItem>
//                         </Select>
//                     )}
//                 />
//             </Box>
//             <Box sx={{ width: "50px", marginTop: "15px" }}>
//                 <Typography
//                     sx={{
//                         fontSize: "16px",
//                         fontWeight: 600,
//                         lineHeight: "19px",
//                         color: "#212121",
//                         textAlign: "center",
//                         width: "max-content",
//                         borderBottom: `1px solid ${theme.palette.secondary.main}`,
//                     }}
//                 >
//                     {" "}
//                     Exit Load{" "}
//                 </Typography>
//             </Box>
//             <Box sx={{ display: "flex", gap: 2 }}>
//                 <Box sx={{ width: "50%", marginTop: "15px" }}>
//                     <TypographyLabel title={"Up to 6 Months"} />
//                     <TextField fullWidth size="small" placeholder="1.5%" />
//                 </Box>
//                 <Box sx={{ width: "50%", marginTop: "15px" }}>
//                     <TypographyLabel title={"6 to 12 Months"} />
//                     <TextField fullWidth size="small" placeholder="1.25%" />
//                 </Box>
//                 <Box sx={{ width: "50%", marginTop: "15px" }}>
//                     <TypographyLabel title={"12 to 18 Months"} />
//                     <TextField fullWidth size="small" placeholder="1%" />
//                 </Box>
//             </Box>

//             <Box sx={{ display: "flex", gap: 2 }}>
//                 <Box sx={{ width: "50%", marginTop: "15px" }}>
//                     <TypographyLabel title={"18 to 24 Months"} />
//                     <TextField fullWidth size="small" placeholder="0.25%" />
//                 </Box>
//                 <Box sx={{ width: "50%", marginTop: "15px" }}>
//                     <TypographyLabel title={"Above 24 Months"} />
//                     <TextField fullWidth size="small" placeholder="None" />
//                 </Box>
//             </Box>

//             <Box sx={{ width: "50px", marginTop: "15px" }}>
//                 <Typography
//                     sx={{
//                         fontSize: "16px",
//                         fontWeight: 600,
//                         lineHeight: "19px",
//                         color: "#212121",
//                         textAlign: "center",
//                         width: "max-content",
//                         borderBottom: `1px solid ${theme.palette.secondary.main}`,
//                     }}
//                 >
//                     {" "}
//                     Capital Gain Tax{" "}
//                 </Typography>
//             </Box>
//             <Box>
//                 <Box sx={{ display: "flex", gap: 2 }}>
//                     <Box sx={{ width: "50%", marginTop: "15px" }}>
//                         <TypographyLabel title={"For Resident Natural Person"} />
//                     </Box>
//                     <Box sx={{ width: "50%", marginTop: "15px" }}>
//                         <TypographyLabel title={"For Resident Institution"} />
//                     </Box>
//                     <Box sx={{ width: "50%", marginTop: "15px" }}>
//                         <TypographyLabel title={"For Others"} />
//                     </Box>
//                 </Box>
//                 <Box sx={{ display: "flex", gap: 2 }}>
//                     <Box sx={{ width: "50%", marginTop: "15px", }}>
//                         <TypographyLabelEdit titles={["Set Capital Gain Tax for Individuals", "for holding period < 365 Days"]} />
//                         <TextField fullWidth size="small" placeholder="7.5%" />
//                     </Box>
//                     <Box sx={{ width: "50%", marginTop: "30px" }}>
//                         <TypographyLabel title={"Set Capital Gain Tax"} />
//                         <TextField fullWidth size="small" placeholder="10%" sx={{ marginTop: "9px" }} />
//                     </Box>
//                     <Box sx={{ width: "50%", marginTop: "30px" }}>
//                         <TypographyLabel title={"Set Capital Gain Tax"} />
//                         <TextField fullWidth size="small" placeholder="25%" sx={{ marginTop: "9px" }} />
//                     </Box>
//                 </Box>
//                 <Box sx={{ width: "50%", marginTop: "15px" }}>
//                     <TypographyLabelEdit titles={["Set Capital Gain Tax for Individuals", "for holding period > 365 Days"]} />
//                     <TextField fullWidth size="small" placeholder="5%" />
//                 </Box>
//             </Box>
//             <Box sx={{ width: "50px", marginTop: "15px" }}>
//                 <Typography
//                     sx={{
//                         fontSize: "16px",
//                         fontWeight: 600,
//                         lineHeight: "19px",
//                         color: "#212121",
//                         textAlign: "center",
//                         width: "max-content",
//                         borderBottom: `1px solid ${theme.palette.secondary.main}`,
//                     }}
//                 >
//                     {" "}
//                     Other Taxes{" "}
//                 </Typography>
//             </Box>
//             <Box sx={{ display: "grid", gap: 2 }}>
//                 <Box sx={{ width: "50%", marginTop: "15px" }}>
//                     <TypographyLabel title={"Interest and Dividend Income Tax"} />
//                     <TextField fullWidth size="small" placeholder="0%" />
//                 </Box>
//                 <Box sx={{ width: "50%", marginTop: "15px" }}>
//                     <TypographyLabel title={"Dividend Expenses Tax"} />
//                     <TextField fullWidth size="small" placeholder="5%" />
//                 </Box>
//             </Box>
//             <Box>
//                 <RoundedButton title1="Set Parameters" onClick1={handleAdd} />
//             </Box>
//         </Box>

//     );
// }
