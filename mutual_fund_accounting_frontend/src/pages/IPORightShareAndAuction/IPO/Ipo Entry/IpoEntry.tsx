import React, { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
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
import { useGlobalStore } from "store/GlobalStore";
import ErrorBar from "components/Snackbar/ErrorBar";
import { axiosInstance } from "config/axiosInstance";
import RoundedButton from "components/Button/Button";
import SuccessBar from "components/Snackbar/SuccessBar";
import { usePostIpoCreate } from "services/ipo/ipoServices";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { useGetBankBalanceList } from "services/BankAccount/BankAccountServices";

export interface IPOEntryData {
  bank: number;
  apply_date: Dayjs | string;
  stock_name: string;
  schema_name: string;
  bank_name_id?: number;
  applied_units: number;
  cheque_number: string;
  deposit_amount: number;
  per_share_value: number;
  deposit_account: number;
  share_application_type: string;
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
    stock_name: yup.string().required("Stock Name is required"),

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

const IpoEntry = () => {
  const theme = useTheme();
  const todayDate = dayjs();

  const {
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IPOEntryData>({
    resolver: yupResolver<any>(schema),
    defaultValues: {
      stock_name: "",
      per_share_value: 100,
      share_application_type: "ipo",
      apply_date: dayjs().format("YYYY-MM-DD"),
      bank: null,
      deposit_account: null,
      cheque_number: "",
    },
  });

  const allotmentDate = useGlobalStore((state) => state.allotmentDate);

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
      account_number: string;
      account_id: number;
    }[]
  >([]);

  const {
    mutate: ipoCreation,
    isSuccess: ipoCreationSuccess,
    isError: ipoCreationError,
    isPending: ipoCreationPending,
  } = usePostIpoCreate();

  const { data: bankListData } = useGetBankBalanceList();

  const appliedUnits = watch("applied_units");
  const perShareValue = watch("per_share_value");
  const bankName = watch("bank");

  useEffect(() => {
    const calculatedDepositAmount = (appliedUnits || 0) * (perShareValue || 0);
    setValue("deposit_amount", calculatedDepositAmount);
  }, [appliedUnits, perShareValue, setValue]);

  useEffect(() => {
    const options = bankListData?.responseData.map((bank) => ({
      value: bank.id,
      label: bank.bank_name,
    }));
    setBankOptions(options);
  }, [bankListData]);

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
    const currentAccount = bankListData?.responseData?.find(
      (bank) => bank.id === bankName
    );
    setBankInitials(currentAccount?.bank_initials ?? "");

    const currentAccountOption =
      currentAccount?.bank_accounts?.filter((account) => account.CURRENT) || [];

    setAccountOptions(currentAccountOption ?? ["No Option Available"]);
  }, [bankName, bankListData]);

  const onSubmit = (data) => {
    setErrorMsgs(null);

    const tempData = {
      applied_units: Number(data.applied_units),
      per_share_value: Number(data.per_share_value),
      apply_date: data.apply_date,
      bank: data.bank,
      deposit_account: data.deposit_account,
      cheque_number: data.cheque_number,
      deposit_amount: Number(data.deposit_amount),
      schema_name: data.schema_name,
      stock: Number(data.stock_name),
      share_application_type: data.share_application_type,
    };

    ipoCreation(tempData, {
      onSuccess: () => {
        setErrorMsgs(null);
        setSuccessMsgs("Ipo Entry has been submitted successfully.");
        setSnackbarSuccessOpen(true);
        reset();
      },
      onError: (error: any) => {
        axios.isAxiosError(error) && error.response
          ? (() => {
              const data = error.response.data.responseData?.data;
              data
                ? (() => {
                    data.stock && data.stock.length > 0
                      ? setErrorMsgs(`Stock Name: ${data.stock[0]}`)
                      : data.applied_units && data.applied_units.length > 0
                      ? setErrorMsgs(`Applied Units: ${data.applied_units[0]}`)
                      : data.apply_date && data.apply_date.length > 0
                      ? setErrorMsgs(`Apply Date: ${data.apply_date[0]}`)
                      : data.bank && data.bank.length > 0
                      ? setErrorMsgs(`Bank: ${data.bank[0]}`)
                      : error.response.data.responseData?.data?.details
                      ? setErrorMsgs(
                          error.response.data.responseData?.data?.details[0]
                        )
                      : setErrorMsgs("Unknown error occurred.");
                  })()
                : setErrorMsgs("Unknown error occurred.");
            })()
          : setErrorMsgs("Network error occurred.");
        setSnackbarErrorOpen(true);
      },
    });
  };

  useEffect(() => {
    if (ipoCreationSuccess) {
      setSnackbarSuccessOpen(true);
      reset();
    }
    if (ipoCreationError) {
      setSnackbarErrorOpen(true);
    }
  }, [ipoCreationSuccess, ipoCreationError]);

  return (
    <React.Fragment>
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
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box>
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
          {/* 
<Controller
                        name="transaction_method"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                size="small"
                                options={transactionOptions}
                                {...field}
                                onChange={(event, value) => field.onChange(value)}
                                renderInput={(params) => <TextField {...params} error={!!errors.transaction_method} helperText={errors.transaction_method?.message} />}
                            />
                        )}
                    /> */}
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
          <Box>
            <TypographyLabel title={"Stock Name"} />
            <Controller
              name="stock_name"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  sx={{ width: "512px" }}
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
                      error={!!errors.stock_name}
                      helperText={errors.stock_name?.message}
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
          <Box sx={{ margin: 0, padding: 0 }}>
            <TypographyLabel title={"Share Application Type"} />
            <Controller
              name="share_application_type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  defaultValue="IPO"
                  size="small"
                  sx={{ width: "250px" }}
                  error={!!errors.share_application_type}
                >
                  <MenuItem value="ipo">IPO</MenuItem>
                  <MenuItem value="right">Right</MenuItem>
                  <MenuItem value="fpo">FPO</MenuItem>
                </Select>
              )}
            />{" "}
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
                    maxDate={todayDate}
                    minDate={dayjs(allotmentDate)}
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
            loading={ipoCreationPending}
          />
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default IpoEntry;
