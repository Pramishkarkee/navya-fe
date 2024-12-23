import {
  Box,
  TextField,
  useTheme,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Select,
  MenuItem,
  // FormHelperText,
} from "@mui/material";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePostCreateStock } from "services/Stock Mapping/StockMappingService";
import { useState, useEffect } from "react";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import { useGetAllSectorData } from "services/SectorData/SectorDataServices";
import axios from "axios";

export interface Data {
  symbol: string;
  stock_name: string;
  sector: string;
  stock_description: string;
  price_per_share: number;
  face_value: number;
  stock_paid_up_capital: number;
  is_stock_listed: boolean;
  security_type: string;
  txn_scheme_limit: string;
  txn_paid_up_limit: string;
}

const shareTypeOptions = [
  { label: "Equity Shares", id: 1, value: "equity_shares" },
  // { label: "Corporate Debentures", id: 2, value: "corporate_debentures" },
  // { label: "Government Bonds", id: 3, value: "government_bonds" },
  { label: "Mutual Funds", id: 2, value: "mutual_funds" },
  { label: "Preference Shares", id: 3, value: "preference_shares" },
];

export default function StockEntry() {
  const theme = useTheme();
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [successMsgs, setSuccessMsgs] = useState("");
  const [sectorOptions, setSectorOptions] = useState([]);

  // const [sectorData, setSectorData] = useState([]);

  const { data: stockData } = useGetAllSectorData();

  // useEffect(() => {
  // if (stockData?.isSuccess) {
  //   setSectorOptions(
  //     stockData.responseData.map((sector: any) => ({
  //       sector_id: sector.id,
  //       sector_name: sector.name,
  //       sector_code: sector.code,
  //     }))
  //   );
  // }
  // }, [stockData]);

  const {
    mutate: CreateStock,
    isSuccess: CreateStockSuccess,
    isError: CreateStockError,
    // data: createStockData,
  } = usePostCreateStock();

  const schema = yup
    .object({
      symbol: yup.string().required().label("Symbol"),
      stock_name: yup.string().required().label("Stock Name"),
      sector_name: yup.string().label("Sector Name"),
      sector: yup.string().required().label("Sector"),
      // stock_description: yup.string().required().label("Stock Description"),
      security_type: yup.string(),
      price_per_share: yup
        .number()
        .required()
        .label("Price Per Share")
        .typeError("Price Per Share must be a number"),
      face_value: yup
        .number()
        .required()
        .label("Face value")
        .typeError("Face value must be a number"),
      stock_paid_up_capital: yup
        .string()
        .required()
        .label("Stock Paid Up Capital"),
      is_stock_listed: yup.boolean().required().label("Is Stock Listed"),
      txn_scheme_limit: yup
        .string()
        .required()
        .label("Transaction Scheme Type Limit"),
      txn_paid_up_limit: yup
        .string()
        .required()
        .label("Transaction Paid Up Capital Limit"),
    })
    .required();

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Data>({
    resolver: yupResolver<any>(schema),
    defaultValues: {
      symbol: "",
      stock_name: "",
      // sector: "",
      stock_description: "",
      face_value: 100,
      price_per_share: 0,
      stock_paid_up_capital: 0,
      is_stock_listed: true,
      security_type: "equity_shares",
      txn_scheme_limit: "",
      txn_paid_up_limit: "",
    },
  });
  const faceValue = watch("face_value");
  const perShareValue = watch("price_per_share");
  const SecurityType = watch("security_type");

  useEffect(() => {
    const calculatedStockPaidUpCapital =
      (faceValue || 0) * (perShareValue || 0);
    setValue("stock_paid_up_capital", calculatedStockPaidUpCapital);
  }, [faceValue, perShareValue, setValue]);

  const onSubmit = (data: Data) => {
    const tempData: Data = {
      symbol: data.symbol,
      security_type: data.security_type ?? "",
      sector: data.sector,
      stock_description: data.stock_description,
      face_value: data.face_value,
      price_per_share: data.price_per_share,
      stock_paid_up_capital: data.stock_paid_up_capital,
      is_stock_listed: data.is_stock_listed,
      stock_name: data.stock_name,
      txn_scheme_limit: data.txn_scheme_limit,
      txn_paid_up_limit: data.txn_paid_up_limit,
    };

    CreateStock(tempData, {
      onSuccess: () => {
        setErrorMsgs(null);
        setSuccessMsgs("Stock Entry has been submitted successfully.");
        setSnackbarSuccessOpen(true);
        reset();
      },
      onError: (error) => {
        setSuccessMsgs("");
        setErrorMsgs(
          axios.isAxiosError(error) && error.response
            ? error.response.data.symbol &&
              error.response.data.symbol.length > 0
              ? `Symbol: ${error.response.data.symbol[0]}`
              : error.response.data.security_type &&
                error.response.data.security_type.length > 0
              ? `Security Type: ${error.response.data.security_type[0]}`
              : error.response.data.face_value &&
                error.response.data.face_value.length > 0
              ? `Face Value: ${error.response.data.face_value[0]}`
              : error.response.data.price_per_share &&
                error.response.data.price_per_share.length > 0
              ? `Number of Share: ${error.response.data.price_per_share[0]}`
              : error.response.data.stock_description &&
                error.response.data.stock_description.length > 0
              ? `Stock Description: ${error.response.data.stock_description[0]}`
              : error.response.data.stock_name &&
                error.response.data.stock_name.length > 0
              ? `Stock Name: ${error.response.data.stock_name[0]}`
              : "Unknown error occurred."
            : "Network error occurred."
        );
        setSnackbarErrorOpen(true);
      },
    });
  };

  useEffect(() => {
    if (CreateStockSuccess) {
      setSnackbarSuccessOpen(true);
    }
    if (CreateStockError) {
      setSnackbarErrorOpen(true);
    }
  }, [CreateStockSuccess, CreateStockError]);

  const [originalSectorOptions, setOriginalSectorOptions] = useState([]);

  useEffect(() => {
    if (stockData?.isSuccess) {
      const options = stockData.responseData.map((sector: any) => ({
        sector_id: sector.id,
        sector_name: sector.name,
        sector_code: sector.code,
      }));

      setOriginalSectorOptions(options);
      setSectorOptions(options);
    }
  }, [stockData]);

  useEffect(() => {
    if (
      SecurityType === "equity_shares" ||
      SecurityType === "preference_shares"
    ) {
      const filteredEquityShare = originalSectorOptions.filter(
        (option) => option.sector_name !== "Mutual Fund"
      );

      setSectorOptions(filteredEquityShare);
    } else if (SecurityType === "mutual_funds") {
      const filterMutualFunds = originalSectorOptions.filter(
        (option) => option.sector_name === "Mutual Fund"
      );

      setSectorOptions(filterMutualFunds);
    } else {
      setSectorOptions(originalSectorOptions);
    }
  }, [SecurityType, originalSectorOptions]);

  return (
    <Box>
      <Box
        sx={{
          paddingTop: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: { xs: "50%", md: "60%", lg: "80%", xl: "80%" },
        }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
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
          Stock Definition
        </Typography>

        <Box sx={{
          display:"grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          width: "150%",
        }}>

        <Box>
          <TypographyLabel title="Stock Symbol" />
          <Controller
            name="symbol"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder="Please Enter Symbol"
                error={!!errors.symbol}
                helperText={errors.symbol?.message}
              />
            )}
          />
        </Box>

        <Box>
          <TypographyLabel title="Stock Name" />
          <Controller
            name="stock_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder="Please Enter Stock Name"
                error={!!errors.stock_name}
                helperText={errors.stock_name?.message}
              />
            )}
          />
        </Box>

        <Box sx={{ }}>
          <TypographyLabel title="Security Type" />
          <Controller
            name="security_type"
            control={control}
            render={({ field }) => (
              <Select
                sx={{ width: "100%" }}
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

        <Box>
          <TypographyLabel title="Sector" />
          <Controller
            name="sector"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                size="small"
                options={sectorOptions}
                getOptionLabel={(option) => option.sector_name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!errors.sector}
                    helperText={errors.sector?.message}
                  />
                )}
                onChange={(_, data) =>
                  field.onChange(data ? data.sector_id : "")
                }
              />
            )}
          />
        </Box>

        <Box>
          <TypographyLabel title="Face Value" />
          <Controller
            name="face_value"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder="Please Enter Face value"
                error={!!errors.face_value}
                helperText={errors.face_value?.message}
              />
            )}
          />
        </Box>

        <Box>
          <TypographyLabel title="Number of Share" />
          <Controller
            name="price_per_share"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder="Please Enter Price Per Share"
                error={!!errors.price_per_share}
                helperText={errors.price_per_share?.message}
              />
            )}
          />
        </Box>

        <Box>
          <TypographyLabel title="Paid Up Capital" />
          <Controller
            name="stock_paid_up_capital"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder="Please Enter Stock Paid Up Capital"
                error={!!errors.stock_paid_up_capital}
                helperText={errors.stock_paid_up_capital?.message}
              />
            )}
          />
        </Box>

        <Box sx={{}}>
          <TypographyLabel title="Stock Transaction Limit ( Scheme Size %)" />
          <Controller
            name="txn_scheme_limit"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder="1.23"
                error={!!errors.txn_scheme_limit}
                helperText={errors.txn_scheme_limit?.message}
              />
            )}
          />
        </Box>

        <Box sx={{}}>
          <TypographyLabel title="Stock Transaction Limit (Paid Up Capital %)" />
          <Controller
            name="txn_paid_up_limit"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder="2.54"
                error={!!errors.txn_paid_up_limit}
                helperText={errors.txn_paid_up_limit?.message}
              />
            )}
          />
        </Box>

        <Box>
          <TypographyLabel title="Stock Description" />
          <Controller
            name="stock_description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                fullWidth
                multiline
                minRows={1}
                placeholder="Please Enter Stock Description"
                error={!!errors.stock_description}
                helperText={errors.stock_description?.message}
              />
            )}
          />
        </Box>

        <Box sx={{ mt: 1 }}>
          <Typography
            sx={{
              mb: 1,
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "19px",
              color: "#212121",
              textAlign: "center",
              width: "max-content",
              borderBottom: `1px solid ${theme.palette.secondary.main}`,
            }}
          >
            Stock Details
          </Typography>
          <FormControl>
            <Controller
              name="is_stock_listed"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Is this stock listed?"
                  labelPlacement="end"
                />
              )}
            />
          </FormControl>
        </Box>

        </Box>

        <Box>
          <RoundedButton title1="Add Stock" onClick1={handleSubmit(onSubmit)} />
        </Box>
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
  );
}
