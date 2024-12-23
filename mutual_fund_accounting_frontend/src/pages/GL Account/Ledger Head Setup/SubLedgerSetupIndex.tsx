import React, { useEffect, useState } from "react";
import { Box, TextField, Autocomplete } from "@mui/material";
import SchemeName from "components/Scheme Field/SchemeName";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import RoundedButton from "components/Button/Button";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useGetAllLedgerHeadList } from "services/SubLedgerHeadServices";
import { useSubLedgerHeadMutation } from "services/SubLedgerHeadServices";
import { useForm, Controller } from "react-hook-form";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import axios from "axios";
import { useGlobalStore } from "store/GlobalStore";

type AccHeadObj = {
  label: string;
  id: number;
};

interface AccountHead {
  account_code: string;
  ledger_head: string;
  account_head: string;
  account_type: number;
  account_type_label: string;
  created_at: Date;
  deleted_at: Date | null;
  id: number;
  updated_at: Date | null;
}

export default function LedgerHead() {
  const [openingDate, setOpeningDate] = useState(dayjs(Date.now()));
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>();
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>();
  const [errorMsgs, setErrorMsgs] = useState("");
  const [successMsgs, setSuccessMsgs] = useState("");
  const [accHeadOptions, setAccHeadOptions] = useState<AccHeadObj[]>([]);

  const allotmentDate = useGlobalStore((state) => state.allotmentDate);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ledger_head: "",
      sub_ledger_head: "",
      sub_ledger_description: "",
      opening_balance: 0,
    },
  });

  const {
    data: AccHeadData,
    // isFetching: accHeadFetching,
  } = useGetAllLedgerHeadList();

  const { mutate: ledgerHeadMutate } = useSubLedgerHeadMutation();

  useEffect(() => {
    if (AccHeadData) {
      const newAccHeadOptions = AccHeadData?.responseData?.map(
        (item: AccountHead) => ({
          label: item.ledger_head,
          id: item.id,
        })
      );
      setAccHeadOptions(newAccHeadOptions);
    }
  }, [AccHeadData]);

  const handleAdd = async (data) => {
    const payload = {
      ledger_head: data.ledger_head,
      sub_ledger_head: data.sub_ledger_head,
      sub_ledger_description: data.sub_ledger_description,
      sub_ledger_opening_date: openingDate.format("YYYY-MM-DD"),
      opening_balance: data.opening_balance,
    };

    ledgerHeadMutate(payload, {
      onSuccess: () => {
        setSnackbarOpen(true);
        setSuccessMsgs("Sub-Ledger Head Added Successfully!");
        reset();
      },
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.data.ledger_head) {
            setErrorMsgs(`Ledger Head: ${error.response.data.ledger_head[0]}`);
          } else if (error.response.data.sub_ledger_head) {
            setErrorMsgs(
              `Sub-Ledger Head: ${error.response.data.sub_ledger_head[0]}`
            );
          } else {
            setErrorMsgs("Unknown error occurred.");
          }
        } else {
          setErrorMsgs("Network error occurred.");
        }
        setSnackbarErrorOpen(true);
      },
    });
  };

  const handleReset = () => {
    reset();
    setAccHeadOptions([]);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleAdd)}
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
        width: "100%",
        flex: 1,
      }}
    >
      <SuccessBar
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        message={successMsgs}
      />

      <ErrorBar
        snackbarOpen={snackbarErrorOpen}
        setSnackbarOpen={setSnackbarErrorOpen}
        message={errorMsgs}
      />

      <Box sx={{ width: "80%" }}>
        <SchemeName />
      </Box>

      <Box sx={{ width: "100%" }}>
        <TypographyLabel title="Ledger Head" />
        <Controller
          name="ledger_head"
          control={control}
          render={({ field }) => (
            <Autocomplete
              sx={{
                width: "40%",
              }}
              size="small"
              options={accHeadOptions}
              getOptionLabel={(option) => option.label}
              onChange={(event, value) => field.onChange(value?.id)}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Ledger Head Name" />
              )}
            />
          )}
        />
      </Box>

      <Box sx={{ width: "100%" }}>
        <TypographyLabel title="Sub-Ledger Head" />
        <Controller
          name="sub_ledger_head"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              placeholder="Enter Sub-Ledger Head"
              sx={{
                width: "40%",
              }}
            />
          )}
        />
      </Box>

      <Box sx={{ width: "100%" }}>
        <TypographyLabel title="Sub-Ledger Head Description" />
        <Controller
          name="sub_ledger_description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              fullWidth
              multiline
              minRows={2}
              placeholder="Description"
              sx={{
                width: "40%",
              }}
            />
          )}
        />
      </Box>

      <Box sx={{ width: "100%" }}>
        <TypographyLabel title="Opening Date" />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            sx={{
              width: "30%",
              "& .MuiOutlinedInput-input": {
                height: "0.5rem",
              },
            }}
            maxDate={dayjs()}
            value={openingDate}
            onChange={(newVal) => setOpeningDate(newVal)}
            minDate={dayjs(allotmentDate)}
          />
        </LocalizationProvider>
      </Box>

      <Box sx={{ width: "30%" }}>
        <TypographyLabel title={"Opening Balance"} />
        <Controller
          name="opening_balance"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              placeholder="10000"
              error={!!errors.opening_balance}
              helperText={errors.opening_balance?.message}
            />
          )}
        />
      </Box>

      <RoundedButton
        title1="Add Ledger Head"
        title2="Reset"
        onClick2={handleReset}
      />
    </Box>
  );
}
