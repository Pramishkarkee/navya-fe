import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Typography,
  useTheme,
  Autocomplete,
} from "@mui/material";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RoundedButton from "components/Button/Button";
import {
  usePostDividendCreate,
  usePostEligibleShares,
} from "services/Dividend/DividendService";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import axios from "axios";
import { useGetStockSymbolList } from "services/Stock Transaction/StockTransactionService";

export interface DividendData {
  scheme_name: string;
  stock_name: number;
  eligible_share_units: number;
  book_closure_date: string;
  bonus_percentage: number;
  cash_percentage: number;
}

const DividendEntry = () => {
  const theme = useTheme();
  const [stockSymbols, setStockSymbols] = useState<any[]>([]);

  const [snackbarSuccessOpen, setSnackbarSuccessOpen] =
    useState<boolean>(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);
  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [successMsgs, setSuccessMsgs] = useState<string>("");

  const { data: stockSymbol } = useGetStockSymbolList();

  const {
    mutate: dividendCreation,
    isSuccess: dividendCreationSuccess,
    isError: dividendCreationError,
    isPending: PendingDividendCreation,
  } = usePostDividendCreate();

  const { mutate: eligibleShareFetch } = usePostEligibleShares();

  const schema = yup
    .object({
      scheme_name: yup.string().required().label("Scheme Name"),
      stock_name: yup.number().required().label("Stock Name"),
      eligible_share_units: yup
        .number()
        .required()
        .positive("Must be a positive number")
        .label("Share Units"),
      book_closure_date: yup.string().required("Date is required").nullable(),
    })
    .required();

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<DividendData>({
    defaultValues: {
      scheme_name: "Navya Large Cap Fund",
      stock_name: stockSymbols[0],
      eligible_share_units: 0,
      book_closure_date: "",
      bonus_percentage: 0,
      cash_percentage: 0,
    },

    resolver: yupResolver<any>(schema),
  });

  const stockCode = watch("stock_name");
  const bookClosureDate = watch("book_closure_date");

  useEffect(() => {
    if (stockCode && bookClosureDate) {
      const payloadData = {
        stock_code: stockCode,
        booking_date: bookClosureDate,
      };

      eligibleShareFetch(payloadData, {
        onSuccess: (data) => {
          setValue("eligible_share_units", data.responseData.eligible_unit);
        },
      });
    }
  }, [stockCode, bookClosureDate]);

  const onSubmit = (data: DividendData) => {
    const payload = {
      scheme_name: data.scheme_name,
      stock_name: data.stock_name,
      eligible_share_units: data.eligible_share_units,
      book_closure_date: data.book_closure_date,
      bonus_percentage: data.bonus_percentage,
      cash_percentage: data.cash_percentage,
    };

    dividendCreation(payload, {
      onSuccess: () => {
        setSuccessMsgs("Dividend  Entry has been submitted successfully.");
        setSnackbarSuccessOpen(true);
        reset();
      },
      onError: (error) => {
        setErrorMsgs(
          axios.isAxiosError(error) && error.response
            ? error.response.data.stock_name &&
              error.response.data.stock_name.length > 0
              ? `Stock Name: ${error.response.data.stock_name[0]}`
              : error.response.data.book_closure_date &&
                error.response.data.book_closure_date.length > 0
              ? `Book Closure Date: ${error.response.data.book_closure_date[0]}`
              : error.response.data.eligible_share_units &&
                error.response.data.eligible_share_units.length > 0
              ? `Eligible Share (Units): ${error.response.data.eligible_share_units[0]}`
              : error.response.data.bonus_percentage &&
                error.response.data.bonus_percentage.length > 0
              ? `Bonus (%): ${error.response.data.bonus_percentage[0]}`
              : error.response.data.cash_percentage &&
                error.response.data.cash_percentage.length > 0
              ? `Cash (%): ${error.response.data.cash_percentage[0]}`
              : error.response.data.details
              ? error.response.data.details[0]
              : "Unknown error occurred."
            : "Network error occurred."
        );
        setSnackbarErrorOpen(true);
      },
    });
  };

  useEffect(() => {
    if (dividendCreationSuccess) {
      setSnackbarSuccessOpen(true);
    }
    if (dividendCreationError) {
      setSnackbarErrorOpen(true);
    }
  }, [dividendCreationSuccess, dividendCreationError]);

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ width: "100%" }}>
          <TypographyLabel title={"Scheme Name"} />
          <Controller
            name="scheme_name"
            control={control}
            defaultValue="Navya Large Cap Fund"
            render={({ field }) => (
              <Select
                sx={{ width: "290px" }}
                {...field}
                size="small"
                error={!!errors.scheme_name}
              >
                <MenuItem value="Navya Large Cap Fund">
                  Navya Large Cap Fund
                </MenuItem>
              </Select>
            )}
          />
        </Box>
        <Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
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
                }}
              >
                {" "}
                Dividend Details{" "}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Box sx={{ margin: 0, padding: 0 }}>
                <TypographyLabel title={"Stock Name"} />

                <Controller
                  name="stock_name"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      sx={{ width: "290px" }}
                      size="small"
                      value={
                        stockSymbol?.responseData?.find(
                          (stock) => stock.id === field.value
                        ) || null
                      }
                      options={stockSymbol?.responseData || []}
                      getOptionLabel={(option) =>
                        `${option.symbol} (${option.stock_name})`
                      }
                      onChange={(event, value) => {
                        field.onChange(value ? value.id : "");
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
                          {option.symbol} ({option.stock_name})
                        </li>
                      )}
                    />
                  )}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ margin: 0, padding: 0 }}>
                  <TypographyLabel title={"Book Closure Date"} />
                  <Controller
                    name="book_closure_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        sx={{
                          width: "290px",
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
                  {errors.book_closure_date && (
                    <Typography color="error" sx={{ fontSize: "12px" }}>
                      {errors.book_closure_date.message}
                    </Typography>
                  )}
                </Box>
              </LocalizationProvider>
              <Box sx={{ margin: 0, padding: 0 }}>
                <TypographyLabel title={"Eligible Share (Units)"} />
                <Controller
                  name="eligible_share_units"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      sx={{ width: "290px" }}
                      {...field}
                      fullWidth
                      size="small"
                      placeholder="Please Enter Eligible Units"
                      error={!!errors.eligible_share_units}
                      helperText={errors.eligible_share_units?.message}
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Box sx={{ margin: 0, padding: 0 }}>
                <TypographyLabel title={"Bonus (%)"} />
                <Controller
                  name="bonus_percentage"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      sx={{ width: "290px" }}
                      {...field}
                      fullWidth
                      size="small"
                      placeholder="i.e 5"
                      error={!!errors.bonus_percentage}
                      helperText={errors.bonus_percentage?.message}
                    />
                  )}
                />
              </Box>
              <Box sx={{ margin: 0, padding: 0 }}>
                <TypographyLabel title={"Cash (%)"} />
                <Controller
                  name="cash_percentage"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      sx={{ width: "290px" }}
                      {...field}
                      fullWidth
                      size="small"
                      placeholder="i.e 10"
                      error={!!errors.cash_percentage}
                      helperText={errors.cash_percentage?.message}
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box mt={2}>
          <RoundedButton
            title1="Add Dividend"
            onClick1={handleSubmit(onSubmit)}
            loading={PendingDividendCreation}
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
    </>
  );
};

export default DividendEntry;
