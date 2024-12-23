import React, { useState, useEffect } from "react";
import * as yup from "yup";
import dayjs from "dayjs";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Box,
  TextField,
  Typography,
  useTheme,
  Select,
  MenuItem,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import ErrorBar from "components/Snackbar/ErrorBar";
import { axiosInstance } from "config/axiosInstance";
import RoundedButton from "components/Button/Button";
import SuccessBar from "components/Snackbar/SuccessBar";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { usePostAuctionCreate } from "services/Auction/AuctionServices";
import { useGetBankBalanceList } from "services/BankAccount/BankAccountServices";

export interface AuctionData {
  application_form_number: number;
  stock: number;
  applied_units: number;
  per_share_value: number;
  share_application_type: string;
  apply_date: string;
  bank: number;
  form_fee: number;
  deposit_account: number;
  cheque_number: string;
  deposit_amount: number;
  bank_name_id?: number;
  schema_name: string;
}
const customMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 200,
    },
  },
};

const schema = yup
  .object({
    stock: yup.number().required("Stock Name is required"),
    applied_units: yup
      .number()
      .required("Applied Units is required")
      .positive("Applied Units must be a positive number")
      .integer("Applied Units must be an integer")
      .typeError("Applied Units must be a number")
      .min(0, "Applied Units must be a positive number"),

    per_share_value: yup
      .number()
      .required("Per Share Value is required")
      .positive("Per Share Value must be a positive number")
      .typeError("Per Share Value must be a number")
      .min(0, "Per Share Value must be a positive number"),

    deposit_amount: yup
      .number()
      .required("Deposit Amount is required")
      .positive("Deposit Amount must be a positive number")
      .integer("Deposit Amount must be an integer")
      .typeError("Deposit Amount must be a number")
      .min(0, "Deposit Amount must be a positive number"),

    apply_date: yup.string().required("Apply Date is required").nullable(),
    bank: yup.string().required("Bank Name is required"),
    deposit_account: yup.string().required("Bank Account is required"),
    cheque_number: yup.string().required("Cheque Number is required"),
  })
  .required();

const AuctionEntry = () => {
  const theme = useTheme();
  const {
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AuctionData>({
    resolver: yupResolver<any>(schema),
    defaultValues: {
      application_form_number: 0,
      stock: null,
      applied_units: 0,
      per_share_value: 100,
      share_application_type: "",
      apply_date: "",
      bank: null,
      form_fee: 0,
      // branch_name: 'Naxal',
      deposit_account: null,
      cheque_number: "",
      // broker_code: 45,
      // deposit_amount: 0,
    },
  });

  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [successMsgs, setSuccessMsgs] = useState<string>("");
  const [bankInitials, setBankInitials] = useState<string>("");
  const [stockSymbols, setStockSymbols] = useState<any[]>([]);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] =
    useState<boolean>(false);

  const [BankOptions, setBankOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [accountOptions, setAccountOptions] = useState<
    {
      CURRENT: any;
      account_id: number;
      account_number: string;
    }[]
  >([]);

  const {
    mutate: auctionCreation,
    isSuccess: auctionCreationSuccess,
    isError: auctionCreationError,
    isPending: auctionCreationPending,
  } = usePostAuctionCreate();

  const { data: bankListData } = useGetBankBalanceList();

  const bankName = watch("bank");
  const appliedUnits = watch("applied_units");
  const perShareValue = watch("per_share_value");

  useEffect(() => {
    const calculatedDepositAmount = (appliedUnits || 0) * (perShareValue || 0);
    setValue("deposit_amount", calculatedDepositAmount);
  }, [appliedUnits, perShareValue, setValue]);

  useEffect(() => {
    const fetchStockSymbols = async () => {
      try {
        const response = await axiosInstance.get(
          "/accounting/api/v1/parameters/stock-list/"
        );
        if (response.data.isSuccess) {
          setStockSymbols(response.data.responseData);
        }
      } catch (error) {
        console.error("Error fetching stock symbols:", error);
      }
    };

    fetchStockSymbols();
  }, []);

  useEffect(() => {
    const options = bankListData?.responseData?.map((bank) => ({
      value: bank.id,
      label: bank.bank_name,
    }));
    setBankOptions(options);
  }, [bankListData]);

  useEffect(() => {
    const currentAccount = bankListData?.responseData?.find(
      (bank) => bank?.id === bankName
    );

    setBankInitials(currentAccount?.bank_initials ?? "");

    const currentAccountOption =
      currentAccount?.bank_accounts?.filter((account) => account.CURRENT) || [];

    setAccountOptions(currentAccountOption ?? ["No Option Available"]);
  }, [bankName]);

  const onSubmit = (data: AuctionData) => {
    const payloadData = {
      apply_date: data.apply_date ?? "",
      deposit_account: data.deposit_account ?? null,
      bank: data.bank ?? null,
      cheque_number: data.cheque_number ?? "",
      form_fee: Number(data.form_fee) ?? 0,
      per_share_value: Number(data.per_share_value) ?? null,
      share_application_type: data.share_application_type ?? "",
      stock: data.stock ?? null,
      deposit_amount: Number(data.deposit_amount),
      applied_units: Number(data.applied_units),
      application_form_number: Number(data.application_form_number) ?? null,
      schema_name: data.schema_name ?? "",
    };

    setErrorMsgs(null);
    auctionCreation(payloadData, {
      onSuccess: () => {
        setErrorMsgs(null);
        setSuccessMsgs("Auction Entry has been submitted successfully.");
        setSnackbarSuccessOpen(true);
        reset();
      },
      onError: (error: any) => {
        axios.isAxiosError(error) && error.response
          ? (() => {
              const data = error.response.data;
              data.stock && data.stock.length > 0
                ? setErrorMsgs(`Stock: ${data.stock[0]}`)
                : data.apply_date && data.apply_date.length > 0
                ? setErrorMsgs(`Apply Date: ${data.apply_date[0]}`)
                : data.bank && data.bank.length > 0
                ? setErrorMsgs(`Bank: ${data.bank[0]}`)
                : !data.stock && !data.apply_date && !data.bank
                ? setErrorMsgs(
                    error.response.data.details
                      ? error.response.data.details[0]
                      : error.response.data.deposit_account
                      ? error.response.data.deposit_account[0]
                      : "Error occurred while submitting the form."
                  )
                : null;
            })()
          : setErrorMsgs("Network error occurred.");
        setSnackbarErrorOpen(true);
      },
    });
  };

  useEffect(() => {
    if (auctionCreationSuccess) {
      setSnackbarSuccessOpen(true);
      reset();
    }
    if (auctionCreationError) {
      setSnackbarErrorOpen(true);
    }
  }, [auctionCreationSuccess, auctionCreationError]);

  return (
    <React.Fragment>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ width: "520px" }}>
          <TypographyLabel title={"Scheme Name"} />
          <Controller
            name="schema_name"
            control={control}
            defaultValue="Navya Large Cap Fund"
            render={({ field }) => (
              <Select {...field} size="small" sx={{ width: "520px" }}>
                <MenuItem value="Navya Large Cap Fund">
                  NAVYA LARGE CAP FUND
                </MenuItem>
              </Select>
            )}
          />
        </Box>
        <Box sx={{ width: "50px", mt: 3 }}>
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
            Application Details{" "}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 2 }}>
          <Box sx={{ margin: 0, padding: 0 }}>
            <TypographyLabel title={"Application Form Number"} />
            <Controller
              name="application_form_number"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: "250px" }}
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="Enter Auction Form Number"
                  error={!!errors.application_form_number}
                  helperText={errors.application_form_number?.message}
                />
              )}
            />
          </Box>
          <Box>
            <TypographyLabel title={"Stock Name"} />
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  sx={{ width: "250px" }}
                  size="small"
                  value={
                    stockSymbols.find((stock) => stock.id === field.value) ||
                    null
                  }
                  options={stockSymbols}
                  getOptionLabel={(option) =>
                    `${option.stock_name} (${option.symbol})`
                  }
                  onChange={(event, value) => {
                    if (value) {
                      field.onChange(value.id);
                    } else {
                      field.onChange("");
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.stock}
                      helperText={errors.stock?.message}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      {option.stock_name} ({option.symbol})
                    </li>
                  )}
                />
              )}
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 2 }}>
          <Box sx={{ margin: 0, padding: 0 }}>
            <TypographyLabel title={"Applied Units"} />
            <Controller
              name="applied_units"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ width: "160px" }}
                  size="small"
                  placeholder="Enter Applied Units"
                  error={!!errors.applied_units}
                  helperText={errors.applied_units?.message}
                />
              )}
            />{" "}
          </Box>
          <Box sx={{ margin: 0, padding: 0 }}>
            <TypographyLabel title={"Per Share Value"} />
            <Controller
              name="per_share_value"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ width: "160px" }}
                  size="small"
                  placeholder="Enter Per Share Value"
                  error={!!errors.per_share_value}
                  helperText={errors.per_share_value?.message}
                />
              )}
            />
          </Box>

          <Box sx={{ margin: 0, padding: 0 }}>
            <TypographyLabel title={"Deposit Amount"} />
            <Controller
              name="deposit_amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ width: "160px" }}
                  InputProps={{ readOnly: true }}
                  size="small"
                  placeholder="Deposit Amount"
                  error={!!errors.deposit_amount}
                  helperText={errors.deposit_amount?.message}
                />
              )}
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 2 }}>
          <Box sx={{ marginTop: 0, padding: 0 }}>
            <TypographyLabel title={"Application Form Fee"} />
            <Controller
              name="form_fee"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ width: "250px" }}
                  size="small"
                  type="number"
                  placeholder="Enter Application Form Fee"
                  error={!!errors.form_fee}
                  helperText={errors.form_fee?.message}
                />
              )}
            />
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ margin: 0, padding: 0 }}>
              <TypographyLabel title={"Apply Date"} />
              <Controller
                name="apply_date"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    sx={{
                      width: "250px",
                      "& .MuiSvgIcon-root": {
                        width: "16px",
                        height: "16px",
                      },
                    }}
                    slotProps={{ textField: { size: "small" } }}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) =>
                      field.onChange(
                        date ? dayjs(date).format("YYYY-MM-DD") : null
                      )
                    }
                  />
                )}
              />
              {errors.apply_date && (
                <Typography color="error" sx={{ fontSize: "12px" }}>
                  {errors.apply_date.message}
                </Typography>
              )}
            </Box>
          </LocalizationProvider>
        </Box>

        <Box sx={{ width: "50px", mt: 3 }}>
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
            Deposit Details{" "}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 2 }}>
          <Box sx={{ width: "250px" }}>
            <TypographyLabel title={"Bank Name"} />
            <Controller
              name="bank"
              control={control}
              render={({ field }) => (
                <Select
                  sx={{ width: "250px" }}
                  {...field}
                  size="small"
                  onChange={(event) => {
                    field.onChange(event.target.value);
                  }}
                  error={!!errors.bank}
                  MenuProps={customMenuProps}
                >
                  {BankOptions?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.bank && (
              <Typography color="error" sx={{ fontSize: "12px" }}>
                {errors.bank.message}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 2 }}>
          <Box>
            <TypographyLabel title={"Bank Account"} />
            <Controller
              name="deposit_account"
              control={control}
              render={({ field }) => (
                <Select
                  sx={{ width: "250px" }}
                  {...field}
                  size="small"
                  onChange={(event) => {
                    field.onChange(event.target.value);
                  }}
                  error={!!errors.deposit_account}
                  MenuProps={customMenuProps}
                >
                  {accountOptions?.map((option) => (
                    <MenuItem
                      key={option.CURRENT.account_id}
                      value={option.CURRENT.account_id}
                    >
                      {`(${bankInitials}) ${option.CURRENT.account_number}`}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.deposit_account && (
              <Typography color="error" sx={{ fontSize: "12px" }}>
                {errors.deposit_account.message}
              </Typography>
            )}
          </Box>

          <Box>
            <TypographyLabel title={"Cheque Number"} />
            <Controller
              name="cheque_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ width: "250px" }}
                  size="small"
                  placeholder="Enter Cheque Number"
                  error={!!errors.cheque_number}
                  helperText={errors.cheque_number?.message}
                />
              )}
            />
          </Box>
        </Box>
        <Box mt={2}>
          <RoundedButton
            title1="Add Entry"
            onClick1={handleSubmit(onSubmit)}
            loading={auctionCreationPending}
          />
        </Box>
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
    </React.Fragment>
  );
};

export default AuctionEntry;
