import React, { useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  Button,
  TextField,
  Typography,
  Select,
  Autocomplete,
  MenuItem,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import SchemeName from "components/Scheme Field/SchemeName";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import RoundedButton from "components/Button/Button";
import {
  DateField,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useGetAccHeadQuery } from "services/AccHeadServices";
import { useLedgerHeadMutation } from "services/LedgerHeadServices";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
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
  account_head: string;
  account_type: number;
  account_type_label: string;
  created_at: Date;
  deleted_at: Date | null;
  id: number;
  updated_at: Date | null;
}
type LedgerHeadInput = {
  ledger_head: string;
  ledger_description: string;
  account_head: number;
  ledger_opening_date: string;
};

type formInput = {
  account_head: number;
  ledger_description: string;
  ledger_head: string;
};

export default function LedgerHead() {
  const theme = useTheme();
  const allotmentDate = useGlobalStore((state) => state.allotmentDate);

  const [openingDate, setOpeningDate] = useState(dayjs(Date.now()));
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [successMsgs, setSuccessMsgs] = useState("");
  const [accHeadOptions, setAccHeadOptions] = useState([]);

  // let accHeadOptions: AccHeadObj[] = []

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      account_head: null,
      ledger_head: "",
      ledger_description: "",
    },
  });

  //react queries & Mutation
  const {
    data: AccHeadData,
    error,
    isFetching: accHeadFetching,
  } = useGetAccHeadQuery();
  const {
    data: ledgerHeadData,
    mutate: ledgerHeadMutate,
    isSuccess: ledgerHeadDataSuccess,
    isError: ledgerHeadError,
  } = useLedgerHeadMutation();

  useEffect(() => {
    if (AccHeadData) {
      AccHeadData.map((item: AccountHead) => {
        const accHeadObj: AccHeadObj = {
          label: item.account_head,
          id: item.id,
        };

        setAccHeadOptions((prev) => [...prev, accHeadObj]);
      });
    }
  }, [accHeadFetching, AccHeadData]);

  // useEffect(() => {
  //   if (ledgerHeadData) {
  //     setSnackbarSuccessOpen(true);
  //     reset();
  //   }
  // }, [ledgerHeadData, ledgerHeadDataSuccess]);

  // useEffect(() => {
  //   if (ledgerHeadError) {
  //     setSnackbarErrorOpen(true);
  //   }
  // }, [ledgerHeadError]);

  const handleAdd: SubmitHandler<formInput> = async (data) => {
    // const formData =  {
    //     ledger_head: data.ledgerHead,
    //     ledger_description: data.ledgerHeadDesc,
    //     account_head: data.selectedAccHead,

    // }
    const postDate = {
      ledger_opening_date: openingDate.format("YYYY-MM-DD"),
    };
    const fullData: LedgerHeadInput = { ...data, ...postDate };

    ledgerHeadMutate(fullData, {
      onSuccess: () => {
        setSnackbarSuccessOpen(true);
        setSuccessMsgs("Ledger Head added successfully!");
        reset();
      },
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.data.ledger_head) {
            setErrorMsgs(`Ledger Head: ${error.response.data.ledger_head[0]}`);
          } else if (error.response.data.account_head) {
            setErrorMsgs(
              `Account Head: ${error.response.data.account_head[0]}`
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
        snackbarOpen={snackbarSuccessOpen}
        setSnackbarOpen={setSnackbarSuccessOpen}
        // message="Ledger Head Added Successfully"
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
        <TypographyLabel title="Account Head" />
        <Controller
          name="account_head"
          control={control}
          render={({ field }) => (
            <Autocomplete
              sx={{
                width: "40%",
              }}
              size="small"
              options={accHeadOptions}
              onChange={(event, value) => field.onChange(value?.id)}
              renderInput={(params) => (
                <TextField {...params} placeholder="Enter Account Head Name" />
              )}
            />
          )}
        />
      </Box>

      <Box sx={{ width: "100%" }}>
        <TypographyLabel title="Ledger Head" />
        <Controller
          name="ledger_head"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              placeholder="Enter Ledger Head"
              sx={{
                width: "40%",
              }}
            />
          )}
        />
      </Box>

      <Box sx={{ width: "100%" }}>
        <TypographyLabel title="Ledger Head Description" />
        <Controller
          name="ledger_description"
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
      {/* 
            <Box sx={{ width: '100%' }}>
                <TypographyLabel title="Current Balance" />
                <TextField
                    size='small'
                    sx={{ width: '30%' }}
                />
            </Box> */}
      <RoundedButton
        title1="Add Ledger Head"
        // onClick1={handleAdd}
        title2="Reset"
        onClick2={handleReset}
      />
    </Box>
  );
}
