import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
  useTheme,
  Select,
  Button,
  Autocomplete,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import ErrorBar from "components/Snackbar/ErrorBar";
import SuccessBar from "components/Snackbar/SuccessBar";
import TypographyLabel from "components/InputLabel/TypographyLabel";

import {
  usePatchBondAndDebentureData,
  useGetBondListData,
  useGetAmortizationMethodData,
} from "services/BondAndDebenture/BondAndDebenture";
import { useGetAllStockBrokerData } from "services/StockBroker/StockBrokerServices";
import { useGlobalStore } from "store/GlobalStore";

const validationSchema = yup.object().shape({
  security: yup.string().required("Security is required"),
  type: yup.string().required("Type is required"),
  bond_name: yup.string().required("Bond Name is required"),
  symbol: yup.string().optional(),
  broker_name: yup.string().optional(),
  bond_status: yup.string().required("Bond Status is required"),
  face_value: yup
    .number()
    .required("Face Value is required")
    .positive("Must be a positive number")
    .nullable(),
  purchase_date: yup.string().required("Entry Date is required").nullable(),
  maturity_date: yup.object().required("Maturity Date is required").nullable(),
  bond_issue_date: yup.object().optional().nullable(),
  coupon_frequency: yup
    .string()
    .required("Coupon Frequency is required")
    .nullable(),
  coupon_rate: yup.string().required("Coupon Rate is required"),
  purchase_units: yup.string().required("Purchase Unit is required"),
  purchase_price: yup.string().required("Purchase Price is required"),
  auto_booking_for_coupon: yup.boolean(),
  auto_booking_for_amortization: yup.boolean(),
  amortization_method: yup.string().optional().nullable(),
});

const BondDebenturePurchaseEntry = () => {
  const theme = useTheme();
  const allotmentDate = useGlobalStore((state) => state.allotmentDate);

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      security: "debenture",
      type: "trading_securities",
      bond_status: "listed",
      purchase_date: null,
      maturity_date: null,
      bond_issue_date: null,
      coupon_frequency: "2",
      face_value: 1000,
      coupon_rate: "",
      purchase_units: "",
      purchase_price: "",
      auto_booking_for_coupon: false,
      auto_booking_for_amortization: false,
      amortization_method: "",
    },
  });

  const purchaseUnits = watch("purchase_units");
  console.log(purchaseUnits);
  const checkAmortization = watch("auto_booking_for_amortization");
  const BondStatus = watch("bond_status");

  const [bondOptions, setBondOptions] = useState([]);
  const [bondData, setBondData] = useState<string>();
  const [brokerOptions, setBrokerOptions] = useState([]);
  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [searchData, setSearchData] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorbarOpen, setErrorbarOpen] = useState<boolean>(false);
  const [amortizationOptions, setAmortizationOptions] = useState([]);

  const disableField = bondData ? true : false;

  const { data: StockBrokerList } = useGetAllStockBrokerData();
  const { data: amortizationList } = useGetAmortizationMethodData();
  const { data: bondList, refetch } = useGetBondListData(searchData);

  useEffect(() => {
    if (bondList?.isSuccess) {
      const options = bondList?.responseData?.data?.map((bond) => ({
        id: bond.id,
        bond_name: bond.bond_name,
        bond_sybmol: bond.symbol,
        bond_status: bond.bond_status,
      }));

      setOriginalBondData(options);
      setBondOptions(options);
    }
  }, [bondList]);

  useEffect(() => {
    if (
      amortizationList?.isSuccess ||
      amortizationList?.responseData?.length > 0
    ) {
      setValue("amortization_method", amortizationList.responseData[0].value);
      setAmortizationOptions(
        amortizationList.responseData.map((item) => ({
          id: item.value,
          amortization_name: item.key,
        }))
      );
    }
  }, [amortizationList, setValue]);

  useEffect(() => {
    if (StockBrokerList?.isSuccess) {
      setBrokerOptions(
        StockBrokerList.responseData.map((broker) => ({
          broker_id: broker.id,
          broker_code: broker.broker_code,
          broker_name: broker.broker_name,
        }))
      );
    }
  }, [StockBrokerList]);

  const {
    mutate: BondDebentureDataAdded,
    error: BondDebentureError,
    isSuccess: BondDebentureSuccess,
  } = usePatchBondAndDebentureData();

  useEffect(() => {
    if (BondDebentureSuccess) {
      setSnackbarOpen(true);
      reset();
    }
  }, [BondDebentureSuccess, reset]);

  const bondStatus = watch("bond_status");

  const DebentureSubmit = (data) => {
    const temp1 = {
      type: data.type,
      security: data.security,
      bond_name: data.bond_name,
      symbol: data.symbol,
      bond_list_id: Number(
        bondOptions.find((bond) => bond.bond_sybmol === data.symbol)?.id
      ),
      broker: bondStatus === "listed" ? Number(data.broker_name) : null,
      bond_status: data.bond_status,
      face_value: Number(data.face_value),
      txn_date: dayjs(data.purchase_date).format("YYYY-MM-DD"),
      maturity_date: dayjs(data.maturity_date).format("YYYY-MM-DD"),
      issue_date:
        dayjs(data.bond_issue_date).format("YYYY-MM-DD") === "Invalid Date"
          ? ""
          : dayjs(data.bond_issue_date).format("YYYY-MM-DD"),
      coupon_frequency: Number(data.coupon_frequency),
      coupon_rate: Number(data.coupon_rate),
      txn_units: Number(data.purchase_units),
      txn_price: Number(data.purchase_price),
      auto_book_coupon: data.auto_booking_for_coupon,
      auto_book_amortization: data.auto_booking_for_amortization,
      amortization_method: data.amortization_method,
      txn_type: "purchase",
    };

    const temp2 = {
      type: data.type,
      security: data.security,
      bond_name: data.bond_name,
      symbol: data.symbol,
      bond_list_id: Number(
        bondOptions.find((bond) => bond.bond_sybmol === data.symbol)?.id
      ),
      broker: bondStatus === "listed" ? Number(data.broker_name) : null,
      bond_status: data.bond_status,
      face_value: Number(data.face_value),
      txn_date: dayjs(data.purchase_date).format("YYYY-MM-DD"),
      maturity_date: dayjs(data.maturity_date).format("YYYY-MM-DD"),
      issue_date:
        dayjs(data.bond_issue_date).format("YYYY-MM-DD") === "Invalid Date"
          ? ""
          : dayjs(data.bond_issue_date).format("YYYY-MM-DD"),
      coupon_frequency: Number(data.coupon_frequency),
      coupon_rate: Number(data.coupon_rate),
      txn_units: Number(data.purchase_units),
      txn_price: Number(data.purchase_price),
      auto_book_coupon: data.auto_booking_for_coupon,
      auto_book_amortization: data.auto_booking_for_amortization,
      txn_type: "purchase",
    };

    const tempData = checkAmortization === true ? temp1 : temp2;

    BondDebentureDataAdded(tempData, {
      onSuccess: () => {
        setSnackbarOpen(true);
        reset({});
        refetch();
      },
      onError: (error) => {
        setErrorbarOpen(true);
        refetch();

        if (axios.isAxiosError(error) && error.response) {
          setErrorMsgs(
            error.response.data.bond_status
              ? error.response.data.bond_status
              : error.response.data.details
              ? // Temporary fix for bond issue size error
                error.response.data.details[0] ===
                "The transaction limit has been exceeded based on the paid up capital."
                ? "The transaction limit has been exceeded based on the Bond Issue Size"
                : error.response.data.details[0]
              : error.response.data.non_field_errors
              ? error.response.data.non_field_errors[0]
              : error.response.data.txn_date
              ? "Enter the Purchase Date."
              : error.response.data.maturity_date
              ? "Enter the Maturity Date."
              : error.response.data.broker
              ? "Broker field may not be null."
              : error.response.data.issue_date
              ? "Bond Issue Date is required."
              : error.response.data.amortization_method
              ? "Amortization Method is required."
              : error.response.data.auto_book_coupon
              ? `Auto Booking Coupon : ${error.response.data.auto_book_coupon}`
              : error.response.data.auto_book_amortization
              ? `Auto Booking Amortization : ${error.response.data.auto_book_amortization}`
              : error.response.data.txn_price
              ? error.response.data.txn_price[0]
              : "Error in Submitting Bond and Debenture Entry."
          );
        } else {
          setErrorMsgs("Error in Submitting Bond and Debenture Entry.");
        }
      },
    });
  };
  const handleChangeBondName = (event, value) => {
    if (value) {
      const selectedBond = bondList?.responseData?.data?.find(
        (bond) => bond.bond_name === value.bond_name
      );

      if (selectedBond) {
        setBondData(selectedBond);

        setValue("symbol", selectedBond.symbol);
        setValue("bond_name", selectedBond.bond_name);
        setValue("security", selectedBond.security);
        setValue("type", selectedBond.type);
        setValue("bond_status", selectedBond.bond_status);
        setValue("face_value", selectedBond.face_value);
        setValue("coupon_frequency", selectedBond.coupon_frequency);
        setValue("coupon_rate", selectedBond.coupon_rate);
        setValue("maturity_date", dayjs(selectedBond.maturity_date));
        setValue("bond_issue_date", dayjs(selectedBond.issue_date));
        setValue("auto_booking_for_coupon", selectedBond.auto_book_coupon);
        setValue(
          "auto_booking_for_amortization",
          selectedBond.auto_book_amortization
        );
        setValue("amortization_method", amortizationList.responseData[0].value);
      }
    } else {
      setValue("coupon_frequency", "2");
      setValue("security", "debenture");
      setValue("type", "trading_securities");
      setValue("face_value", 1000);
      setValue("coupon_rate", "");
      setValue("maturity_date", null);
      setValue("bond_issue_date", null);
      setValue("auto_booking_for_coupon", false);
      setValue("auto_booking_for_amortization", false);
      setBondData(null);
    }
  };

  const [originalBondData, setOriginalBondData] = useState([]);

  useEffect(() => {
    if (BondStatus === "listed") {
      const filterListed = originalBondData.filter(
        (bond) => bond.bond_status === "listed"
      );
      setBondOptions(filterListed);
    } else if (BondStatus === "unlisted") {
      const filterUnlisted = originalBondData.filter(
        (bond) => bond.bond_status === "unlisted"
      );
      setBondOptions(filterUnlisted);
    } else {
      setBondOptions(originalBondData);
    }
  }, [BondStatus, originalBondData]);

  return (
    <>
      {snackbarOpen && (
        <SuccessBar
          snackbarOpen={snackbarOpen}
          message={"Successfully Submitted!"}
          setSnackbarOpen={setSnackbarOpen}
        />
      )}

      {BondDebentureError && (
        <ErrorBar
          snackbarOpen={errorbarOpen}
          message={errorMsgs}
          setSnackbarOpen={setErrorbarOpen}
        />
      )}
      <Box
        sx={{ width: { lg: "150%" }, maxWidth: "1500px" }}
        component="form"
        onSubmit={handleSubmit(DebentureSubmit)}
      >
        <Box sx={{ width: "50px", mt: 2 }}>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: "19px",
              color: "#212121",
              textAlign: "center",
              width: "max-content",
              borderBottom: `1px solid ${theme.palette.secondary.main}`,
            }}
          >
            Details
          </Typography>
        </Box>
        <Box component="form">
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
              <Box sx={{ width: "23%", mt: 2 }}>
                <TypographyLabel title={"Bond State"} />
                <Controller
                  name="bond_status"
                  defaultValue="listed"
                  control={control}
                  render={({ field }) => (
                    <Select
                      sx={{
                        fontSize: 14,
                        width: "100%",
                        "& .Mui-disabled": {
                          bgcolor: theme.palette.grey[100],
                          fontWeight: 500,
                        },
                      }}
                      disabled={disableField}
                      {...field}
                      size="small"
                    >
                      <MenuItem sx={{ fontSize: 14 }} value="listed">
                        Listed
                      </MenuItem>
                      <MenuItem sx={{ fontSize: 14 }} value="unlisted">
                        Unlisted
                      </MenuItem>
                    </Select>
                  )}
                />
                {errors.bond_status && (
                  <Typography color="error">
                    {errors.bond_status.message}
                  </Typography>
                )}
              </Box>

              {bondStatus === "listed" ? (
                <Box sx={{ width: "49%", mt: 2 }}>
                  <TypographyLabel title="Broker Name" />
                  <Controller
                    name="broker_name"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange } }) => (
                      <Autocomplete
                        // {...field}
                        size="small"
                        options={brokerOptions}
                        getOptionLabel={(option) =>
                          `${option.broker_name}(${option.broker_code})`
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!errors.broker_name}
                            helperText={errors.broker_name?.message}
                          />
                        )}
                        onChange={(_, data) =>
                          onChange(data ? data.broker_id : "")
                        }
                      />
                    )}
                  />
                </Box>
              ) : null}
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ width: "20%", mt: 2 }}>
              <TypographyLabel title={"Bond Symbol"} />
              <Controller
                name="symbol"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    freeSolo
                    size="small"
                    options={bondOptions}
                    getOptionLabel={(option) =>
                      `${option.bond_sybmol}` || option
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.symbol}
                        helperText={errors.symbol?.message}
                      />
                    )}
                    onInputChange={(_, inputValue) => {
                      field.onChange(inputValue);
                    }}
                    onChange={(_, data) => {
                      handleChangeBondName(_, data);

                      if (typeof data === "string" || data === null) {
                        field.onChange(data);
                      } else {
                        field.onChange(data?.bond_sybmol || "");
                      }
                    }}
                  />
                )}
              />
              {errors.type && (
                <Typography color="error">{errors.type.message}</Typography>
              )}
            </Box>
            <Box sx={{ width: "50%", mt: 2 }}>
              <TypographyLabel title="Bond Name" />

              {/* <Controller
                name="bond_name"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    freeSolo
                    size="small"
                    options={bondOptions}
                    getOptionLabel={(option) => `${option.bond_name}` || option}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.bond_name}
                        helperText={errors.bond_name?.message}
                      />
                    )}
                    onInputChange={(_, inputValue) => {
                      field.onChange(inputValue);
                    }}
                    onChange={(_, data) => {
                      {
                        handleChangeBondName(_, data);
                      }

                      if (typeof data === "string") {
                        field.onChange(data);
                      } else {
                        field.onChange(data?.id);
                      }
                    }}
                  />
                )}
              /> */}

              <Controller
                name="bond_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    sx={{
                      width: "100%",
                      "& .Mui-disabled": {
                        bgcolor: theme.palette.grey[100],
                        fontWeight: 500,
                      },
                    }}
                    disabled={disableField}
                    {...field}
                    size="small"
                  />
                )}
              />
            </Box>
            <Box sx={{ width: "35%", mt: 2 }}>
              <TypographyLabel title={"Security"} />
              <Controller
                name="security"
                defaultValue="debenture"
                control={control}
                render={({ field }) => (
                  <Select
                    sx={{
                      fontSize: 14,
                      "& .Mui-disabled": {
                        bgcolor: theme.palette.grey[100],
                        fontWeight: 500,
                      },
                      "& .MuiSvgIcon-root ": {},
                    }}
                    disabled={disableField}
                    {...field}
                    size="small"
                    fullWidth
                  >
                    <MenuItem sx={{ fontSize: 14 }} value="debenture">
                      Corporate Debentures
                    </MenuItem>
                    <MenuItem sx={{ fontSize: 14 }} value="bond">
                      Government Bonds
                    </MenuItem>
                  </Select>
                )}
              />
              {errors.type && (
                <Typography color="error">{errors.type.message}</Typography>
              )}
            </Box>

            <Box sx={{ width: "35%", mt: 2 }}>
              <TypographyLabel title={"Type"} />
              <Controller
                name="type"
                defaultValue="trading_securities"
                control={control}
                render={({ field }) => (
                  <Select
                    sx={{
                      fontSize: 14,
                      "& .Mui-disabled": {
                        bgcolor: theme.palette.grey[100],
                        fontWeight: 500,
                      },
                    }}
                    disabled={disableField}
                    {...field}
                    size="small"
                    fullWidth
                  >
                    <MenuItem sx={{ fontSize: 14 }} value="trading_securities">
                      {" "}
                      Trading Securities{" "}
                    </MenuItem>
                  </Select>
                )}
              />
              {errors.type && (
                <Typography color="error">{errors.type.message}</Typography>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              width: "100%",
            }}
          >
            <Box sx={{ mt: 2, width: "100%" }}>
              <TypographyLabel title={"Face Value"} />
              <Controller
                name="face_value"
                control={control}
                render={({ field }) => (
                  <TextField
                    disabled={disableField}
                    {...field}
                    sx={{
                      width: "100%",
                      "& .Mui-disabled": {
                        bgcolor: theme.palette.grey[100],
                        fontWeight: 500,
                      },
                    }}
                    size="small"
                    placeholder="i.e. 1000"
                    error={!!errors.face_value}
                    helperText={errors.face_value?.message}
                  />
                )}
              />
            </Box>

            <Box sx={{ mt: 2, width: "100%" }}>
              <TypographyLabel title={"Purchase Units"} />
              <Controller
                name="purchase_units"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: "100%" }}
                    size="small"
                    placeholder="i.e. 500"
                    error={!!errors.purchase_units}
                    helperText={errors.purchase_units?.message}
                  />
                )}
              />
            </Box>

            <Box sx={{ mt: 2, width: "100%" }}>
              <TypographyLabel title={"Coupon Frequency"} />
              <Controller
                name="coupon_frequency"
                defaultValue="12"
                control={control}
                render={({ field }) => (
                  <Select
                    sx={{
                      fontSize: 14,
                      width: "100%",
                      "& .Mui-disabled": {
                        bgcolor: theme.palette.grey[100],
                        fontWeight: 500,
                      },
                    }}
                    disabled={disableField}
                    {...field}
                    size="small"
                  >
                    <MenuItem sx={{ fontSize: 14 }} value="12">
                      Monthly
                    </MenuItem>
                    <MenuItem sx={{ fontSize: 14 }} value="3">
                      {" "}
                      Quarterly
                    </MenuItem>
                    <MenuItem sx={{ fontSize: 14 }} value="2">
                      Semi Annually
                    </MenuItem>
                    <MenuItem sx={{ fontSize: 14 }} value="1">
                      Annually
                    </MenuItem>
                  </Select>
                )}
              />
            </Box>

            <Box sx={{ mt: 2, width: "100%" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TypographyLabel title="Bond Allotment Date" />
                <Controller
                  name="bond_issue_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      disabled={disableField}
                      {...field}
                      sx={{
                        width: "100%",
                        "& .MuiSvgIcon-root": {
                          width: "16px",
                          height: "16px",
                        },
                        "& .Mui-disabled": {
                          bgcolor: theme.palette.grey[100],
                          fontWeight: 500,
                        },
                      }}
                      slotProps={{ textField: { size: "small" } }}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      minDate={dayjs(allotmentDate)}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              width: "100%",
            }}
          >
            <Box sx={{ mt: 2, width: "100%" }}>
              <TypographyLabel title={"Coupon Rate (In %)"} />
              <Controller
                name="coupon_rate"
                control={control}
                render={({ field }) => (
                  <TextField
                    disabled={disableField}
                    {...field}
                    sx={{
                      width: "100%",
                      "& .Mui-disabled": {
                        bgcolor: theme.palette.grey[100],
                        fontWeight: 500,
                      },
                    }}
                    size="small"
                    placeholder="i.e. 10"
                    error={!!errors.coupon_rate}
                    helperText={errors.coupon_rate?.message}
                  />
                )}
              />
            </Box>

            <Box sx={{ mt: 2, width: "100%" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TypographyLabel title={"Purchased Date"} />
                <Controller
                  name="purchase_date"
                  control={control}
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

            <Box sx={{ mt: 2, width: "100%" }}>
              <TypographyLabel title={"Purchase Price"} />
              <Controller
                name="purchase_price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: "100%" }}
                    size="small"
                    placeholder="i.e. 1000"
                    error={!!errors.purchase_price}
                    helperText={errors.purchase_price?.message}
                  />
                )}
              />
            </Box>

            <Box sx={{ mt: 2, width: "100%" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TypographyLabel title="Maturity Date" />
                <Controller
                  name="maturity_date"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Start date is required",
                    },
                  }}
                  render={({ field }) => (
                    <DatePicker
                      disabled={disableField}
                      {...field}
                      sx={{
                        width: "100%",
                        "& .MuiSvgIcon-root": {
                          width: "16px",
                          height: "16px",
                        },
                        "& .Mui-disabled": {
                          bgcolor: theme.palette.grey[100],
                          fontWeight: 500,
                        },
                      }}
                      slotProps={{ textField: { size: "small" } }}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      minDate={dayjs(allotmentDate)}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
          </Box>

          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <Box sx={{ width: "max-content" }}>
                <FormControl sx={{ height: "25px" }}>
                  <Controller
                    name="auto_booking_for_coupon"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        sx={{}}
                        control={
                          <Checkbox
                            sx={{ "& .MuiSvgIcon-root": { fontSize: 18 } }}
                            {...field}
                            checked={field.value}
                          />
                        }
                        label={
                          <Typography variant="body2">
                            Enable auto-booking for coupon payment
                          </Typography>
                        }
                        labelPlacement="end"
                      />
                    )}
                  />
                </FormControl>
              </Box>

              <Box sx={{ width: "max-content" }}>
                <FormControl sx={{ height: "30px" }}>
                  <Controller
                    name="auto_booking_for_amortization"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{ "& .MuiSvgIcon-root": { fontSize: 18 } }}
                            {...field}
                            checked={field.value}
                          />
                        }
                        label={
                          <Typography variant="body2">
                            Enable auto-booking for amortization
                          </Typography>
                        }
                        labelPlacement="end"
                      />
                    )}
                  />
                </FormControl>
              </Box>
            </Box>

            {checkAmortization === true ? (
              <Box sx={{ width: "50%", mt: 2 }}>
                <TypographyLabel title="Amortization Method" />
                <Controller
                  name="amortization_method"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      size="small"
                      options={amortizationOptions}
                      value={
                        amortizationOptions.find(
                          (option) => option.id === value
                        ) || null
                      }
                      // disabled={disableField}
                      getOptionLabel={(option) => option.amortization_name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!errors.amortization_method}
                          helperText={errors.amortization_method?.message}
                        />
                      )}
                      onChange={(_, data) => onChange(data ? data.id : "")}
                    />
                  )}
                />
              </Box>
            ) : null}

            <Box sx={{ display: "flex", color: "#9E9E9E" }}>
              <ErrorIcon sx={{ fontSize: "0.9rem", marginTop: "2px" }} />
              <Typography sx={{ fontSize: "12px" }}>
                This entry cannot be updated
              </Typography>
            </Box>
          </Box>
          <Box>
            <Button
              variant="contained"
              sx={{
                width: "fit-content",
                borderRadius: "100px",
                padding: "6px 24px",
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: "20px",
                mt: 2,
                backgroundColor: theme.palette.secondary.main,
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                },
              }}
              onClick={handleSubmit(DebentureSubmit)}
            >
              Add Debenture
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default BondDebenturePurchaseEntry;

{
  /* <Box sx={{ width: "50%", mt: 2 }}>
              <TypographyLabel title={"Bank Account"} />
              <Controller
                name="deposit_account"
                control={control}
                render={({ field }) => (
                  <Select
                    sx={{ width: "290px" }}
                    {...field}
                    size="small"
                    onChange={(event) => {
                      field.onChange(event.target.value);
                    }}
                    error={!!errors.deposit_account}
                    MenuProps={customMenuProps}
                  >
                    {accountOptions?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label ?
                          `(${bankInitials}) ${option.label}`
                          : "No Account Option"}
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
            </Box> */
}
