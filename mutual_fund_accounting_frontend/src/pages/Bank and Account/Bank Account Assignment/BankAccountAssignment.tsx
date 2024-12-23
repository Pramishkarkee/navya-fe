import { Box, MenuItem, Select, Typography, useTheme } from "@mui/material";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import ErrorBar from "components/Snackbar/ErrorBar";
import SuccessBar from "components/Snackbar/SuccessBar";
import { Controller, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useGetBankListData } from "services/BankAccount/BankAccountServices";
import {
  usePatchBankAccAssignment,
  useGetBankAccAssignmentList,
} from "services/BankAccountAssignment/BankAccountAssignmentService";

export interface Data {
  seed_capital_account: string;
  allotted_capital_account: string;
  sip_registration_account: string;
  sip_payment_account: string;
  sip_unit_redemption_account: string;
  unit_purchase_account: string;
  unit_redemption_account: string;
  dividend_collection_account: string;
}

export default function BankAccountAssignment() {
  const theme = useTheme();
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [successMsgs, setSuccessMsgs] = useState("");
  const [shareTypeOptions, setShareTypeOptions] = useState([]);

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Data>({
    defaultValues: {},
  });

  const { mutate: patchBankAccAssignment } = usePatchBankAccAssignment();

  const { data: bankAccAssignmentListData } = useGetBankAccAssignmentList();

  const { data: BankList } = useGetBankListData();
  // const BankList = data as BankListResponse;

  useEffect(() => {
    const currentAccountsData =
      BankList?.responseData?.flatMap((bank) =>
        (bank?.bank_accounts?.CURRENT || []).map((account) => ({
          id: account.account_id,
          label: `(${bank.bank_initials}) ${account.account_number}`,
          value: account.account_id,
        }))
      ) || [];

    setShareTypeOptions(currentAccountsData);
  }, [BankList]);

  // Rendering the options in the dropdown

  const onSubmit = (data: Data) => {
    patchBankAccAssignment(data, {
      onSuccess: (success) => {
        setSuccessMsgs("Bank Account Assignment Updated Successfully");
        setSnackbarSuccessOpen(true);
      },
      onError: (error: any) => {
        setErrorMsgs(error.message);
        setSnackbarErrorOpen(true);
      },
    });
  };

  useEffect(() => {
    const currentAccountsData =
      BankList?.responseData?.flatMap((bank) =>
        (bank?.bank_accounts?.CURRENT || []).map((account) => ({
          id: account.account_id,
          label: `(${bank.bank_initials}) ${account.account_number}`,
          value: account.account_id,
        }))
      ) || [];

    setValue(
      "seed_capital_account",
      currentAccountsData.find(
        (item) => item.id === bankAccAssignmentListData?.seed_capital_account
      )?.id
    );
    setValue(
      "allotted_capital_account",
      currentAccountsData.find(
        (item) =>
          item.id === bankAccAssignmentListData?.allotted_capital_account
      )?.id
    );
    setValue(
      "sip_registration_account",
      currentAccountsData.find(
        (item) =>
          item.id === bankAccAssignmentListData?.sip_registration_account
      )?.id
    );
    setValue(
      "sip_payment_account",
      currentAccountsData.find(
        (item) => item.id === bankAccAssignmentListData?.sip_payment_account
      )?.id
    );
    setValue(
      "sip_unit_redemption_account",
      currentAccountsData.find(
        (item) =>
          item.id === bankAccAssignmentListData?.sip_unit_redemption_account
      )?.id
    );
    setValue(
      "unit_purchase_account",
      currentAccountsData.find(
        (item) => item.id === bankAccAssignmentListData?.unit_purchase_account
      )?.id
    );
    setValue(
      "unit_redemption_account",
      currentAccountsData.find(
        (item) => item.id === bankAccAssignmentListData?.unit_redemption_account
      )?.id
    );
    setValue(
      "dividend_collection_account",
      currentAccountsData.find(
        (item) =>
          item.id === bankAccAssignmentListData?.dividend_collection_account
      )?.id
    );
  }, [BankList, bankAccAssignmentListData, setValue]);

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          textAlign: "center",
          color: "#212121",
          width: "max-content",
          borderBottom: `1px solid ${theme.palette.secondary.main}`,
          mt: 2,
          mb: 1,
        }}
      >
        Initial Transactions
      </Typography>
      <Box>
        <TypographyLabel title="Account for Seed Capital" />
        <Controller
          name="seed_capital_account"
          control={control}
          render={({ field }) => (
            <Select
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: "250px",
                  },
                },
              }}
              sx={{ width: "50%" }}
              size="small"
              {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {shareTypeOptions.map((option) => (
                <MenuItem key={option.id} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <TypographyLabel title="Account for Allotted Capital" />
        <Controller
          name="allotted_capital_account"
          control={control}
          render={({ field }) => (
            <Select
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: "250px",
                  },
                },
              }}
              sx={{ width: "50%" }}
              size="small"
              {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {shareTypeOptions.map((option) => (
                <MenuItem key={option.id} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
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
          mt: 3,
          mb: 1,
        }}
      >
        SIP Transactions
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TypographyLabel title="Account for SIP Registrations" />
        <Controller
          name="sip_registration_account"
          control={control}
          render={({ field }) => (
            <Select
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: "250px",
                  },
                },
              }}
              sx={{ width: "50%" }}
              size="small"
              {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {shareTypeOptions.map((option) => (
                <MenuItem key={option.id} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TypographyLabel title="Account for SIP Installment Payments" />
        <Controller
          name="sip_payment_account"
          control={control}
          render={({ field }) => (
            <Select
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: "250px",
                  },
                },
              }}
              sx={{ width: "50%" }}
              size="small"
              {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {shareTypeOptions.map((option) => (
                <MenuItem key={option.id} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TypographyLabel title="Account for SIP Unit Redemptions" />
        <Controller
          name="sip_unit_redemption_account"
          control={control}
          render={({ field }) => (
            <Select
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: "250px",
                  },
                },
              }}
              sx={{ width: "50%" }}
              size="small"
              {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {shareTypeOptions.map((option) => (
                <MenuItem key={option.id} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
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
          mt: 3,
          mb: 1,
        }}
      >
        Unit Transactions
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TypographyLabel title="Account for Unit Purchases" />
        <Controller
          name="unit_purchase_account"
          control={control}
          render={({ field }) => (
            <Select
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: "250px",
                  },
                },
              }}
              sx={{ width: "50%" }}
              size="small"
              {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {shareTypeOptions.map((option) => (
                <MenuItem key={option.id} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TypographyLabel title="Account for Unit Redemptions" />
        <Controller
          name="unit_redemption_account"
          control={control}
          render={({ field }) => (
            <Select
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: "250px",
                  },
                },
              }}
              sx={{ width: "50%" }}
              size="small"
              {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {shareTypeOptions.map((option) => (
                <MenuItem key={option.id} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
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
          mb: 2,
        }}
      >
        Dividend Transactions
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TypographyLabel title="Account for Dividend Payment" />
        <Controller
          name="dividend_collection_account"
          control={control}
          render={({ field }) => (
            <Select
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: "250px",
                  },
                },
              }}
              sx={{ width: "50%" }}
              size="small"
              {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {shareTypeOptions.map((option) => (
                <MenuItem key={option.id} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </Box>

      <RoundedButton
        title1="Assign Accounts"
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
  );
}
