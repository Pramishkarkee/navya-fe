import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Autocomplete,
  Box,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import {
  useGetBankDetailData,
  usePatchInterestCollectionData,
} from "services/InterestCollection/InterestCollection";
import ErrorBar from "components/Snackbar/ErrorBar";
import SuccessBar from "components/Snackbar/SuccessBar";
import axios from "axios";

const validationSchema = yup.object().shape({
  bank_name: yup.string().required("Bank Name is required"),
  bank_account: yup.string().required("Bank Account is required"),
  amount: yup
    .number()
    .positive("Amount must be positive")
    .min(0, "Amount must be greater than 0"),
  received_amount: yup
    .number()
    .required("Actual Interest Received is required")
    .positive("Actual Interest Received must be positive")
    .min(0, "Actual Interest Received must be greater than 0")
    .typeError("Actual Interest Received must be a number"),
});

const Adjustment = ({ bank_id, amount, id, onTransactionSuccess }) => {
  const [successbarOpen, setSuccessbarOpen] = useState<boolean>(false);
  const [errorbarOpen, setErrorbarOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [BankOptions, setBankOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const [AllBanks, setAllBanks] = useState([]);

  const [CurrentAccounts, setCurrentAccounts] = useState<
    { account_id: number; account_number: string }[]
  >([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { data: bankDetail } = useGetBankDetailData();

  const { mutate: IntrestAdjustment, isSuccess: AdjustmentSuccess } =
    usePatchInterestCollectionData();

  const handleAddEntry = (data) => {
    const payload = {
      bank_id: Number(data.bank_name),
      bank_account_id: Number(data.bank_account),
      amount: String(amount),
      adjusted_amount: String(data.received_amount),
      interest_id: id,
    };
    IntrestAdjustment(payload, {
      onSuccess: () => {
        setSuccessbarOpen(true);
        onTransactionSuccess();
      },
      onError: (error) => {
        setErrorbarOpen(true);

        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage(
            error.response.data.details
              ? error.response.data.details
              : error.response.data.adjusted_amount
              ? error.response.data.adjusted_amount
              : "Error in Adjustment"
          );
        }
      },
    });
  };

  useEffect(() => {
    const options = bankDetail?.responseData?.map((bank) => ({
      value: bank.id,
      label: bank.bank_name,
    }));
    setBankOptions(options);
    setAllBanks(bankDetail?.responseData);
  }, [bankDetail]);

  useEffect(() => {
    if (bankDetail) {
      setValue(
        "bank_name",
        bankDetail?.responseData?.find((bank) => bank.id === bank_id)?.id
      );
      const selectedBank = bankDetail?.responseData?.find(
        (bank) => bank.id === bank_id
      );
      if (selectedBank) {
        const currentAccounts = selectedBank.bank_accounts?.CURRENT || [];
        setCurrentAccounts(currentAccounts);
      }
      if (amount) {
        setValue("amount", amount);
      }
    }
  }, [amount, bankDetail, bank_id, setValue]);

  const handleBankChange = (selectedBankId) => {
    const selectedBank = AllBanks.find((bank) => bank.id === selectedBankId);
    if (selectedBank) {
      const currentAccounts = selectedBank.bank_accounts?.CURRENT || [];
      setCurrentAccounts(currentAccounts);
    }
  };

  return (
    <>
      <SuccessBar
        snackbarOpen={successbarOpen}
        setSnackbarOpen={setSuccessbarOpen}
        message="Adjustment Successful"
      />

      <ErrorBar
        snackbarOpen={errorbarOpen}
        setSnackbarOpen={setErrorbarOpen}
        // message="Error in Adjustment"
        message={errorMessage}
      />

      {AdjustmentSuccess ? (
        <SuccessBar
          snackbarOpen={successbarOpen}
          setSnackbarOpen={setSuccessbarOpen}
          message="Adjustment Successful"
        />
      ) : (
        <Box component="form" onSubmit={handleSubmit(handleAddEntry)}>
          <Box>
            <Box sx={{ width: "40%", mt: 2 }}>
              <TypographyLabel title={"Bank Name"} />
              <Controller
                name="bank_name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  // <Autocomplete
                  //   {...field}
                  //   size="small"
                  //   options={bankDetailData ? bankDetailData?.responseData?.map((data) => data.bank_name)  : []}
                  //   renderInput={(params) => (
                  //     <TextField placeholder="Bank Name" {...params} />
                  //   )}
                  //   onChange={(_, data) => field.onChange(data)}
                  // />
                  <Select
                    sx={{ width: "100%" }}
                    {...field}
                    size="small"
                    onChange={(event) => {
                      field.onChange(event.target.value);
                      handleBankChange(event.target.value);
                    }}
                    error={!!errors.bank_name}
                  >
                    {BankOptions?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <Typography variant="caption" color="error">
                {errors.bank_name?.message}
              </Typography>
            </Box>
            <Box sx={{ width: "40%", mt: 2 }}>
              <TypographyLabel title={"Bank Account"} />
              {/* <Controller
                name="bank_account"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    size="small"
                    options={
                      bankDetailData?.branches
                        ? bankDetailData.branches.map(
                            (branch) => branch.branch_name
                          )
                        : []
                    }
                    renderInput={(params) => (
                      <TextField placeholder="Bank Account" {...params} />
                    )}
                    onChange={(_, data) => field.onChange(data)}
                  />
                )}
              />
              <Typography variant="caption" color="error">
                {errors.bank_account?.message}
              </Typography> */}
              <Controller
                name="bank_account"
                control={control}
                defaultValue=""
                render={({ field: { onChange } }) => (
                  <Autocomplete
                    size="small"
                    options={CurrentAccounts.map((account) => ({
                      id: account.account_id,
                      label: `${account.account_number} (${
                        AllBanks.find(
                          (bank) => bank.id === Number(watch("bank_name"))
                        )?.bank_initials
                      })`,
                      account_id: account.account_id,
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
                {errors.bank_account?.message}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 2 }}>
            <Box>
              <TypographyLabel title={"Total Interest Accrued"} />
              <Controller
                name="amount"
                control={control}
                defaultValue={amount}
                disabled
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ margin: 0, padding: 0, width: "250px" }}
                    size="small"
                    margin="normal"
                    placeholder="4000"
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                  />
                )}
              />
            </Box>
            <Box>
              <TypographyLabel title={"Actual Interest Received"} />
              <Controller
                name="received_amount"
                control={control}
                //   defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ margin: 0, padding: 0, width: "250px" }}
                    size="small"
                    margin="normal"
                    placeholder=""
                    error={!!errors.received_amount}
                    helperText={errors.received_amount?.message}
                  />
                )}
              />
            </Box>
          </Box>
          <Box mt={2}>
            <RoundedButton
              title1="Add Entry"
              onClick1={handleSubmit(handleAddEntry)}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default Adjustment;
