import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  TextField,
  Autocomplete,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { colorTokens } from "../../../theme";
import ErrorBar from "components/Snackbar/ErrorBar";
import RoundedButton from "components/Button/Button";
import SuccessBar from "components/Snackbar/SuccessBar";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { IntervalOptions } from "constants/Bank Data/BankData";

import {
  usePatchFixedDepositData,
  useGetBankBalanceList,
  useGetFixedDepositBankList,
} from "../../../services/Fixed Deposit/FixedDepositService";
import { useGlobalStore } from "store/GlobalStore";

const validationSchema = Yup.object().shape({
  bankName: Yup.string().required("Bank Name is required"),
  fdAccountNumber: Yup.string().required(
    "Fixed Deposit Account Number is required"
  ),
  icAccount: Yup.string().required("Interest Collection Account is required"),
  deposit_method: Yup.string().required("Deposit Method is required"),
  deposit_from: Yup.string().optional(),
  transferCharge: Yup.number()
    .optional()
    .required("Transfer Charge is required"),
  // .positive("Transfer Charge must be a positive number"),
  depositAmount: Yup.number()
    .required("Deposit Amount is required")
    // .positive("Deposit Amount must be a positive number"),
    .min(0, "Deposit Amount must be a non-negative number"),
  depositDate: Yup.date().required("Deposit Date is required").nullable(),
  maturityDate: Yup.date().required("Maturity Date is required").nullable(),
  interval: Yup.string().required("Interval is required"),
  interestRate: Yup.number().required("Interest Rate is required"),
  // .positive("Interest Rate must be a positive number"),
  // taxOnInterest: Yup.number()
  //   .required("Tax on Interest is required"),
  // .positive("Tax on Interest must be a positive number"),
  cancelCharge: Yup.number().required("Cancellation Charge is required"),
  // .positive("Cancellation Charge must be a positive number"),
});

const DepositEntry = () => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      bankName: "",
      fdAccountNumber: "",
      icAccount: "",
      deposit_from: "",
      deposit_method: "fund_transfer",
      transferCharge: 10,
      depositAmount: 0,
      depositDate: null,
      maturityDate: null,
      interestRate: 0,
      interval: "Quarterly",
      cancelCharge: 0,
    },
  });

  const allotmentDate = useGlobalStore((state) => state.allotmentDate);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorBarOpen, setErrorBarOpen] = useState<boolean>(false);
  const [AllBanks, setAllBanks] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);

  const [BankOptions, setBankOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [CurrentAccounts, setCurrentAccounts] = useState<
    {
      account_id: number;
      account_number: string;
    }[]
  >([]);

  const { data: allBankList } = useGetFixedDepositBankList();
  const { data: bankData } = useGetBankBalanceList();

  useEffect(() => {
    const options = allBankList?.responseData?.map((bank) => ({
      value: bank?.id,
      label: bank?.bank_name,
    }));
    setBankOptions(options);
    setAllBanks(allBankList?.responseData);
  }, [allBankList]);

  const handleBankChange = (selectedBankId) => {
    const selectedBank = AllBanks?.find((bank) => bank?.id === selectedBankId);
    if (selectedBank) {
      const currentAccounts = selectedBank?.bank_accounts?.CURRENT || [];
      setCurrentAccounts(currentAccounts);
    }
  };

  const {
    mutate: FixedDepositData,
    isError: FixexDepositError,
    isPending: PendingFixedDeposit,
  } = usePatchFixedDepositData();

  const Deposit_Method = watch("deposit_method");

  const FDSubmit = (data) => {
    const tempData = {
      bank: Number(data.bankName),
      account_number: data.fdAccountNumber,
      collection_account: Number(data.icAccount),
      deposit_method: data.deposit_method,
      transfer_charges:
        Deposit_Method === "fund_transfer" ? Number(data.transferCharge) : null,
      deposit_from:
        Deposit_Method === "fund_transfer" ? Number(data.deposit_from) : null,
      deposit_amount: Number(data.depositAmount),
      deposit_date: dayjs(data.depositDate).format("YYYY-MM-DD"),
      interest_rate: Number(data.interestRate),
      maturity_date: dayjs(data.maturityDate).format("YYYY-MM-DD"),
      interest_interval: data.interval.toLowerCase().trim().replace(" ", "_"),
      cancellation_charge: Number(data.cancelCharge),
    };

    FixedDepositData(tempData, {
      onSuccess: () => {
        setSnackbarOpen(true);
        reset();
      },
      onError: (error) => {
        setErrorBarOpen(true);

        const isAxiosError =
          axios.isAxiosError(error) && error.response && error.response.data;

        setErrorMessage(
          isAxiosError
            ? (() => {
                const errorData = error.response.data;
                const getFirstError = (errorField) =>
                  Array.isArray(errorField) ? errorField[0] : errorField;
                const errorField = Object.keys(errorData).find(
                  (field) => errorData[field]
                );

                return errorField
                  ? getFirstError(errorData[errorField])
                  : "Error in submitting data. Please check your input and try again.";
              })()
            : "An unexpected error occurred. Please try again later."
        );

        if (!isAxiosError) {
          console.error(error);
        }
      },
    });
  };

  useEffect(() => {
    const currentAccountsData =
      bankData &&
      bankData?.responseData?.flatMap((bank) =>
        (bank?.bank_accounts || [])
          .filter((account) => account?.CURRENT)
          .map((account) => ({
            ...account.CURRENT,
            bank_initials: bank?.bank_initials,
          }))
      );

    const accounts = currentAccountsData?.map((item) => ({
      id: item?.account_id,
      value: `(${item?.bank_initials})${item?.account_number}`,
    }));
    setBankAccounts(accounts);
  }, [bankData]);

  return (
    <>
      {snackbarOpen && (
        <SuccessBar
          snackbarOpen={snackbarOpen}
          message={"Successfully Submitted!"}
          setSnackbarOpen={setSnackbarOpen}
        />
      )}

      {FixexDepositError && (
        <ErrorBar
          snackbarOpen={errorBarOpen}
          message={errorMessage}
          setSnackbarOpen={setErrorBarOpen}
        />
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(FDSubmit)}
        sx={{ width: { xs: "90%", lg: "100%" } }}
      >
        <HeaderDesc title="Account Details" />

        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 2 }}>
          <Box sx={{ width: "50%" }}>
            <TypographyLabel title={"Bank Name"} />
            <Controller
              name="bankName"
              control={control}
              render={({ field }) => (
                <Select
                  sx={{ width: "100%" }}
                  {...field}
                  size="small"
                  onChange={(event) => {
                    const selectedBank = event.target.value;
                    field.onChange(selectedBank);
                    setValue("icAccount", "");
                    handleBankChange(selectedBank);
                  }}
                  error={!!errors.bankName}
                >
                  {BankOptions?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.bankName && (
              <Typography color="error" sx={{ fontSize: "12px" }}>
                {errors.bankName.message}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ width: "50%", my: 2 }}>
          <TypographyLabel title="Fixed Deposit Account Number" />
          <Controller
            name="fdAccountNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder="Enter your Fixed Deposit Account Number"
                error={!!errors.fdAccountNumber}
                helperText={errors.fdAccountNumber?.message}
              />
            )}
          />
        </Box>

        <Box sx={{ width: "50%", mt: 0 }}>
          <TypographyLabel title={"Interest Collection Account"} />
          <Controller
            name="icAccount"
            control={control}
            defaultValue=""
            render={({ field: { onChange } }) => (
              <Autocomplete
                size="small"
                options={CurrentAccounts.map((account) => ({
                  id: account?.account_id,
                  label: `${
                    AllBanks.find(
                      (bank) => bank.id === Number(watch("bankName"))
                    )?.bank_initials
                  } ${account?.account_number} (Current Account)`,
                  account_id: account?.account_id,
                }))}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField placeholder="" {...params} />
                )}
                onChange={(_, data) => onChange(data?.account_id)}
              />
            )}
          />
          <Typography variant="caption" color="error">
            {errors.icAccount?.message}
          </Typography>
        </Box>

        {Number(watch("bankName")) &&
        bankData?.responseData?.find(
          (bank) => bank.id === Number(watch("bankName"))
        )?.bank_accounts &&
        Object.keys(
          bankData.responseData.find(
            (bank) => bank.id === Number(watch("bankName"))
          )?.bank_accounts || {}
        ).length === 0 ? (
          <Box sx={{ display: "flex", gap: 1, mb: 3, mt: 1 }}>
            <InfoIcon color="disabled" fontSize="small" />
            <Typography
              sx={{ color: colorTokens.grey[500], fontSize: "0.9rem" }}
            >
              This bank doesn’t have a current account.{" "}
              <strong>
                <Link
                  to="/bank-account"
                  style={{
                    textDecoration: "none",
                    color: colorTokens.mainColor[900],
                  }}
                >
                  Make One
                </Link>
              </strong>
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1, mt: 0.5, mb: 2 }}>
            <InfoOutlinedIcon color="disabled" fontSize="small" />
            <Typography
              sx={{ color: colorTokens.grey[500], fontSize: "0.9rem" }}
            >
              {`${
                Number(watch("bankName"))
                  ? AllBanks.find(
                      (bank) => bank.id === Number(watch("bankName"))
                    )?.bank_initials
                  : ""
              }`}
              - {`FD`}- {watch("fdAccountNumber")} will be the created
              sub-ledger head
            </Typography>
          </Box>
        )}

        <HeaderDesc title="Deposit Details" />
        <Box sx={{ mt: 2 }}>
          <Box sx={{ width: "50%", mt: 2 }}>
            <TypographyLabel title={"Deposit Method"} />
            <Controller
              name="deposit_method"
              control={control}
              render={({ field }) => (
                <Select {...field} size="small" fullWidth>
                  <MenuItem value="fund_transfer">Fund Transfer</MenuItem>
                  <MenuItem value="cash_deposit">Cash Deposit</MenuItem>
                </Select>
              )}
            />
            {errors.deposit_method && (
              <Typography color="error">
                {errors.deposit_method.message}
              </Typography>
            )}
          </Box>

          {Deposit_Method === "fund_transfer" ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ width: "50%", mt: 2 }}>
                <TypographyLabel title={"Deposit From"} />
                <Controller
                  name="deposit_from"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange } }) => (
                    <Autocomplete
                      size="small"
                      options={bankAccounts ?? []}
                      getOptionLabel={(option) => option.value}
                      renderInput={(params) => (
                        <TextField placeholder="" {...params} />
                      )}
                      onChange={(_, data) => onChange(data?.id)}
                    />
                  )}
                />
                <Typography variant="caption" color="error">
                  {errors.deposit_from?.message}
                </Typography>
              </Box>

              <Box sx={{ width: "25%", mt: 2 }}>
                <TypographyLabel title="Transfer Charge (NPR)" />
                <Controller
                  name="transferCharge"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      placeholder="10"
                      error={!!errors.transferCharge}
                      helperText={errors.transferCharge?.message}
                    />
                  )}
                />
              </Box>
            </Box>
          ) : null}

          <Box sx={{ display: "flex", gap: 0, mt: 2 }}>
            <Box sx={{ width: "100%" }}>
              <TypographyLabel title="Deposit Amount" />
              <Controller
                name="depositAmount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="Enter your Deposit Amount"
                    error={!!errors.depositAmount}
                    helperText={errors.depositAmount?.message}
                  />
                )}
              />
            </Box>

            <Box sx={{ width: "calc(50% - 0.5rem)", mx: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TypographyLabel title="Deposit Date" />
                <Controller
                  name="depositDate"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <DatePicker<Dayjs>
                      {...field}
                      sx={{
                        width: "100%",
                        "& .MuiSvgIcon-root": {
                          width: "16px",
                          height: "16px",
                        },
                      }}
                      slotProps={{ textField: { size: "small" } }}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                      minDate={dayjs(allotmentDate)}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
            <Box sx={{ width: "calc(50% - 0.5rem)" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TypographyLabel title="Maturity Date" />
                <Controller
                  name="maturityDate"
                  control={control}
                  defaultValue={null}
                  rules={{
                    required: {
                      value: true,
                      message: "Start date is required",
                    },
                  }}
                  render={({ field }) => (
                    <DatePicker<Dayjs>
                      {...field}
                      sx={{
                        width: "100%",
                        "& .MuiSvgIcon-root": {
                          width: "16px",
                          height: "16px",
                        },
                      }}
                      slotProps={{ textField: { size: "small" } }}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                      minDate={dayjs(allotmentDate)}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Box sx={{ flex: "calc(50% - 1rem)" }}>
              <TypographyLabel title="Interest Frequency" />
              <Controller
                name="interval"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    defaultValue="Quarterly"
                    size="small"
                    options={IntervalOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.interval}
                        helperText={errors.interval?.message}
                      />
                    )}
                    onChange={(_, data) => field.onChange(data)}
                  />
                )}
              />
            </Box>
            <Box sx={{ width: "24%" }}>
              <TypographyLabel title="Interest Rate (In %)" />
              <Controller
                name="interestRate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="10"
                    error={!!errors.interestRate}
                    helperText={errors.interestRate?.message}
                  />
                )}
              />
            </Box>

            <Box sx={{ width: "23%" }}>
              <TypographyLabel title="Cancellation Charge (In %)" />
              <Controller
                name="cancelCharge"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="5"
                    error={!!errors.cancelCharge}
                    helperText={errors.cancelCharge?.message}
                  />
                )}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <InfoIcon color="disabled" fontSize="small" />
            <Typography
              sx={{ color: colorTokens.grey[500], fontSize: "0.9rem" }}
            >
              This entry cannot be updated
            </Typography>
          </Box>

          <Box>
            <RoundedButton
              title1="Add Fixed Deposit"
              loading={PendingFixedDeposit}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DepositEntry;
