import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  // useTheme,
  Select,
  MenuItem,
  Typography,
  useTheme,
  // Button,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import CloseIcon from "@mui/icons-material/Close";
import {
  usePatchMutualSetup,
  usePostAddAuthCapital,
} from "services/MutualFundSetup/MutualFundSetupServices";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import * as yup from "yup";
import dayjs, { Dayjs } from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import { DatePicker} from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RoundedButton from "components/Button/Button";
import axios from "axios";
import { useGlobalStore } from "store/GlobalStore";

interface EditModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any;
  onSave: (updatedData: any) => void;
}

type EditFields = {
  scheme_name: string;
  scheme_number: string;
  scheme_type: string;
  maturity_date: string;
  nav_calculation_method_open: string;
  nav_calculation_method_close: string;
  authorized_capital: string;
  scheme_size: number;
  seed_capital: string;
  allotment_date: string;
  allotted_capital: string;
  total_subscribed_units: string;
  seed_capital_addition_date: string;
  additional_seed_capital: number;
  authorized_capital_addition: number;
  authorized_capital_addition_date: string;
  revised_scheme_size: number;
};

// type usePostAddAuthCapital = {
//     authorized_capital_addition: number;
//     authorized_capital_addition_date: string;
//     revised_scheme_size: number;
//     seed_capital_addition_date: string;
//     additional_seed_capital: number;
// };

const EditSchemeModal: React.FC<EditModalProps> = ({
  open,
  setOpen,
  data,
  onSave,
}) => {
  const theme = useTheme();
  const [isDisabled, setIsDisabled] = useState(data.is_editable);

  const [successabarOpen, setSuccessbarOpen] = useState<boolean>();
  const [errorsbarOpen, setErrorbarOpen] = useState<boolean>();

  const [successabarOpenAuth, setSuccessbarOpenAuth] = useState<boolean>();
  const [errorsbarOpenAuth, setErrorbarOpenAuth] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const { mutate: dataMutualSetup } = usePatchMutualSetup(data?.id);
  const { mutate: MutateAuthCapital } = usePostAddAuthCapital();
  const schema = yup
    .object({
      scheme_name: yup.string().required("Scheme Name is required"),
      scheme_number: yup.string().required("Scheme Number is required"),
      scheme_type: yup.string().required("Scheme Type is required").optional(),
      maturity_date: yup.string().required("Maturity Date is required"),
      nav_calculation_method_open: yup
        .string()
        .required("NAV Calculation Method is required")
        .optional(),
      nav_calculation_method_close: yup
        .string()
        .required("NAV Calculation Method is required")
        .optional(),
      authorized_capital: yup
        .string()
        .required("Authorized Capital is required"),
      scheme_size: yup.number().required("Scheme Size is required"),
      seed_capital: yup.string().required("Seed Capital is required"),
      allotment_date: yup.string().required("Allotment Date is required"),
      allotted_capital: yup
        .string()
        .required("Allotted Capital is required")
        .optional(),
      total_subscribed_units: yup
        .string()
        .required("Total Subscribed Units is required"),

      seed_capital_addition_date: yup.string().optional(),
      additional_seed_capital: yup
        .number()
        .required("Additional Seed Capital is required")
        .typeError("Additional Seed Capital must be a number")
        .integer("Additional Seed Capital must be an integer")
        .min(0, "Additional Seed Capital must be a positive number")
        .optional(),
      authorized_capital_addition: yup
        .number()
        .required("Authorized Capital Addition is required")
        .typeError("Authorized Capital Addition must be a number")
        .integer("Authorized Capital Addition must be an integer")
        .min(0, "Authorized Capital Addition must be a positive number")
        .optional(),
      authorized_capital_addition_date: yup.string().optional(),
      revised_scheme_size: yup
        .number()
        .required("Revised Scheme Size is required")
        .typeError("Revised Scheme Size must be a number")
        .integer("Revised Scheme Size must be an integer")
        .min(0, "Revised Scheme Size must be a positive number")
        .optional(),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    // reset
    setValue,
  } = useForm<EditFields>({
    resolver: yupResolver<any>(schema),
    defaultValues: {
      scheme_name: data.scheme_name,
      scheme_number: data.scheme_number,
      scheme_type: data.scheme_type,
      // maturity_date: dayjs(data.maturity_date).format("YYYY-MM-DD"),
      nav_calculation_method_open: "daily",
      nav_calculation_method_close: "weekly",
      authorized_capital: data.total_authorized_capital,
      scheme_size: data.scheme_size,
      seed_capital: data.total_seed_capital,
      allotment_date: data.allotment_date,
      allotted_capital: data.alloted_capital,
      total_subscribed_units: data.total_subscribed_units,
    },
  });

  const schemeType = watch("scheme_type");

  const allotmentDate = useGlobalStore((state) => state.allotmentDate);
  console.log("my Allotment Date:", allotmentDate);

  //  useEffect(() => {
  //   // setValue("maturity_date", DateFormatter(data.maturity_date));
  //   }
  //   , [data.allotment_date, data.maturity_date, setValue])

  useEffect(() => {
    if (data) {
      try {
        const formattedAllotedDate = dayjs(data.allotment_date).format(
          "MM/DD/YYYY"
        );
        setValue("allotment_date", formattedAllotedDate);

        const formattedMaturityDate = dayjs(data.maturity_date).format(
          "MM/DD/YYYY"
        );
        setValue("maturity_date", formattedMaturityDate);
      } catch (error) {
        console.error("Error formatting date:", error);
      }
    } else {
      console.log("allotment_date is not available in data:", data);
    }
  }, [data, setValue]);

  //   useEffect(() => {
  //     reset(data);
  // }, [data, reset]);

  const handleSave = async (formData: EditFields) => {
    const payload = {
      scheme_name: formData.scheme_name,
      scheme_number: formData.scheme_number,
      scheme_type: formData.scheme_type,
      // maturity_date: dayjs(formData.maturity_date).format("YYYY-MM-DD"),
      maturity_date:
        schemeType === "open_ended"
          ? null
          : dayjs(formData.maturity_date).format("YYYY-MM-DD"),
      nav_calculation_method:
        schemeType === "open_ended"
          ? formData.nav_calculation_method_open
          : formData.nav_calculation_method_close,
      authorized_capital: formData.authorized_capital,
      scheme_size: formData.scheme_size,
      seed_capital: formData.seed_capital,
      allotment_date: dayjs(formData.allotment_date).format("YYYY-MM-DD"),
      alloted_capital: formData.allotted_capital,
      total_subscribed_units: formData.total_subscribed_units,
      // seed_capital_addition_date: dayjs(formData.seed_capital_addition_date).format("YYYY-MM-DD"),
      // additional_seed_capital: formData.total_seed_capital,
      // authorized_capital_addition: formData.authorized_capital_addition,
      // authorized_capital_addition_date: dayjs(formData.authorized_capital_addition_date).format("YYYY-MM-DD"),
      // revised_scheme_size: formData.revised_scheme_size,
    };

    try {
      await dataMutualSetup(payload, {
        onSuccess: () => {
          setOpen(false);
          setSuccessbarOpen(true);
          setIsDisabled(true);

          // reset(data);
        },
        onError: (error) => {
          setErrorbarOpen(true);
        },
      });
      onSave(payload);
      setOpen(false);
    } catch (error) {
      console.error("Failed to update scheme details", error);
    }
  };

  const handleAddCapital = async (formData: EditFields) => {
    const payload = {
      scheme_name: data.id,
      authorized_capital_addition: formData.authorized_capital_addition,
      authorized_capital_addition_date: dayjs(
        formData.authorized_capital_addition_date
      ).format("YYYY-MM-DD"),
      revised_scheme_size: formData.revised_scheme_size,
      seed_capital_addition_date: dayjs(
        formData.seed_capital_addition_date
      ).format("YYYY-MM-DD"),
      additional_seed: formData.additional_seed_capital,
    };

    try {
      await MutateAuthCapital(payload, {
        onSuccess: () => {
          setOpen(false);
          setSuccessbarOpenAuth(true);
          // reset(data);
        },
        onError: (error) => {
          setErrorbarOpenAuth(true);
          if (axios.isAxiosError(error) && error.response) {
            setErrorMessage(
              error.response.data.authorized_capital_addition
                ? "Authorized Capital Addition is required"
                : error.response.data.revised_scheme_size
                ? "Revised Scheme Size is required"
                : error.response.data.additional_seed
                ? "Additional Seed Capital is required"
                : "Error in Adding Authorized Capital!"
            );
          }
        },
      });
      onSave(payload);
      // setOpen(false);
    } catch (error) {
      console.error("Failed to update scheme details", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    // reset(data);
  };

  // const AllotmentDate = dayjs().format("YYYY-MM-DD");
  // console.log("working Allotment Date:", AllotmentDate);
  // const schemeType = watch("scheme_type");

  return (
    <>
      <SuccessBar
        snackbarOpen={successabarOpen}
        message={"Scheme Successfully Updated!"}
        setSnackbarOpen={setSuccessbarOpen}
      />
      <ErrorBar
        snackbarOpen={errorsbarOpen}
        message={"Error in Updating Scheme!"}
        setSnackbarOpen={setErrorbarOpen}
      />

      <SuccessBar
        snackbarOpen={successabarOpenAuth}
        message={"Authorized Capital Successfully Added!"}
        setSnackbarOpen={setSuccessbarOpenAuth}
      />
      <ErrorBar
        snackbarOpen={errorsbarOpenAuth}
        message={errorMessage}
        setSnackbarOpen={setErrorbarOpenAuth}
      />

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // width: 600,
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            border: "none",
            borderRadius: 5,
            // boxShadow: 24,
            p: 3.7,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* <HeaderDesc title="Edit NIC Asia Dynamic Debt Fund" /> */}
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "18px",
                color: theme.palette.primary.pureColor,
              }}
            >
              Edit Navya Large Cap Fund
            </Typography>
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
          </Box>

          <Box
            component="form"
            sx={{ mt: 0 }}
            onSubmit={handleSubmit(handleSave)}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3 , 1fr)",
                gap: 1,
              }}
            >
              <Box sx={{ width: "100%", mt: 1 }}>
                <TypographyLabel title={"Scheme Name"} />
                <Controller
                  name="scheme_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={{ margin: 0, width: "100%" }}
                      size="small"
                      placeholder="Navya Large Cap Fund"
                      error={!!errors.scheme_name}
                      helperText={errors.scheme_name?.message}
                      // disabled = {isDisabled === true ? false : true}
                      disabled={!isDisabled}
                      // {
                      //   ...MutateSuccess ? {disabled: true} : {disabled: false}
                      // }
                      // disabled = {true}
                    />
                  )}
                />
              </Box>

              <Box sx={{ width: "100%", mt: 1 }}>
                <TypographyLabel title={"Scheme Number"} />
                <Controller
                  name="scheme_number"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={{ margin: 0, width: "100%" }}
                      size="small"
                      placeholder=""
                      error={!!errors.scheme_number}
                      helperText={errors.scheme_number?.message}
                      disabled={!isDisabled}
                    />
                  )}
                />
              </Box>

              <Box sx={{ width: "100%", mt: 1 }}>
                <TypographyLabel title={"Scheme Type"} />
                <Controller
                  name="scheme_type"
                  defaultValue="open_ended"
                  control={control}
                  disabled={!isDisabled}
                  render={({ field }) => (
                    <Select {...field} size="small" fullWidth>
                      <MenuItem value="open_ended">Open-Ended</MenuItem>
                      <MenuItem value="close_ended">Close-Ended</MenuItem>
                    </Select>
                  )}
                />
                {errors.scheme_type && (
                  <Typography color="error">
                    {errors.scheme_type.message}
                  </Typography>
                )}
              </Box>

              {schemeType === "close_ended" ? (
                <Box sx={{ mt: 1, width: "100%" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TypographyLabel title="Maturity Date" />
                    <Controller
                      name="maturity_date"
                      control={control}
                      disabled={!isDisabled}
                      rules={{
                        required: {
                          value: true,
                          message: "Start date is required",
                        },
                      }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          sx={{
                            width: "100%",
                            "& .MuiSvgIcon-root": {
                              width: "16px",
                              height: "16px",
                            },
                          }}
                          slotProps={{ textField: { size: "small" } }}
                          // value={field.value}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date) => field.onChange(date)}
                          // error={!!errors.maturity_date}
                          // helperText={errors.maturity_date?.message}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  {errors.maturity_date && (
                    <Typography color="error">
                      {errors.maturity_date.message}
                    </Typography>
                  )}
                </Box>
              ) : null}

              {schemeType === "close_ended" && (
                <Box sx={{ width: "100%", mt: 1 }}>
                  <TypographyLabel title={"NAV Calculation Method"} />
                  <Controller
                    name="nav_calculation_method_close"
                    defaultValue="weekly"
                    control={control}
                    disabled={!isDisabled}
                    render={({ field }) => (
                      <Select {...field} size="small" fullWidth>
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                        <MenuItem value="quarterly">Quarterly</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.nav_calculation_method_close && (
                    <Typography color="error">
                      {errors.nav_calculation_method_close.message}
                    </Typography>
                  )}
                </Box>
              )}

              {schemeType === "open_ended" && (
                <Box sx={{ width: "100%", mt: 1 }}>
                  <TypographyLabel title={"NAV Calculation Method"} />
                  <Controller
                    name="nav_calculation_method_open"
                    defaultValue="daily"
                    control={control}
                    disabled={!isDisabled}
                    render={({ field }) => (
                      <Select {...field} size="small" fullWidth>
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                        <MenuItem value="quarterly">Quarterly</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.nav_calculation_method_open && (
                    <Typography color="error">
                      {errors.nav_calculation_method_open.message}
                    </Typography>
                  )}
                </Box>
              )}

              <Box sx={{ width: "100%", mt: 1 }}>
                <TypographyLabel title={"Authorized Capital"} />
                <Controller
                  name="authorized_capital"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      disabled={!isDisabled}
                      {...field}
                      sx={{ margin: 0, width: "100%" }}
                      size="small"
                      placeholder=""
                      error={!!errors.authorized_capital}
                      helperText={errors.authorized_capital?.message}
                    />
                  )}
                />
              </Box>

              <Box sx={{ width: "100%", mt: 1 }}>
                <TypographyLabel title={"Scheme Size"} />
                <Controller
                  name="scheme_size"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      disabled={!isDisabled}
                      sx={{ margin: 0, width: "100%" }}
                      size="small"
                      placeholder=""
                      error={!!errors.scheme_size}
                      helperText={errors.scheme_size?.message}
                    />
                  )}
                />
              </Box>

              <Box sx={{ width: "100%", mt: 1 }}>
                <TypographyLabel title={"Seed Capital"} />
                <Controller
                  name="seed_capital"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      disabled={!isDisabled}
                      sx={{ margin: 0, width: "100%" }}
                      size="small"
                      placeholder=""
                      error={!!errors.seed_capital}
                      helperText={errors.seed_capital?.message}
                    />
                  )}
                />
              </Box>

              <Box sx={{ mt: 1, width: "100%" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TypographyLabel title={"Allotment Date"} />
                  <Controller
                    name="allotment_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        disabled={!isDisabled}
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
                      />
                    )}
                  />
                </LocalizationProvider>
                {errors.allotment_date && (
                  <Typography color="error">
                    {errors.allotment_date.message}
                  </Typography>
                )}
              </Box>

              <Box sx={{ mt: 1, width: "100%" }}>
                <TypographyLabel title={"Allotted Capital"} />
                <Controller
                  name="allotted_capital"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      disabled={!isDisabled}
                      sx={{ width: "100%" }}
                      size="small"
                      placeholder=""
                      error={!!errors.allotted_capital}
                      helperText={errors.allotted_capital?.message}
                    />
                  )}
                />
              </Box>

              <Box sx={{ mt: 1, width: "100%" }}>
                <TypographyLabel title={"Total Subscribed Units"} />
                <Controller
                  name="total_subscribed_units"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={{ width: "100%" }}
                      size="small"
                      placeholder=""
                      error={!!errors.total_subscribed_units}
                      helperText={errors.total_subscribed_units?.message}
                      disabled={!isDisabled}
                    />
                  )}
                />
              </Box>
            </Box>
            {isDisabled === true ? (
              <Box sx={{ mt: 1 }}>
                <RoundedButton title1="Update Record" />
              </Box>
            ) : null}
          </Box>

          {schemeType !== "close_ended" && (
            <Box
              component="form"
              onSubmit={handleSubmit(handleAddCapital)}
              sx={{ mt: 2 }}
            >
              <HeaderDesc title="Add Authorized Capital" />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3 , 1fr)",
                  gap: 2,
                }}
              >
                <Box sx={{ mt: 1, width: "100%" }}>
                  <TypographyLabel title={"Authorized Capital Addition"} />
                  <Controller
                    name="authorized_capital_addition"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        sx={{ width: "100%" }}
                        size="small"
                        placeholder=""
                        error={!!errors.authorized_capital_addition}
                        helperText={errors.authorized_capital_addition?.message}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ mt: 1, width: "100%" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TypographyLabel
                      title={"Authorized Capital Addition Date"}
                    />
                    <Controller
                      name="authorized_capital_addition_date"
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
                          //   error={!!errors.entry_date}
                          //   helperText={errors.entry_date?.message}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  {errors.seed_capital_addition_date && (
                    <Typography color="error">
                      {errors.seed_capital_addition_date.message}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ mt: 1, width: "100%" }}>
                  <TypographyLabel title={"Revised Scheme Size"} />
                  <Controller
                    name="revised_scheme_size"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        sx={{ width: "100%" }}
                        size="small"
                        placeholder=""
                        error={!!errors.revised_scheme_size}
                        helperText={errors.revised_scheme_size?.message}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ mt: 1, width: "100%" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TypographyLabel title={"Seed Capital Addition Date"} />
                    <Controller
                      name="seed_capital_addition_date"
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
                          //   error={!!errors.entry_date}
                          //   helperText={errors.entry_date?.message}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  {errors.seed_capital_addition_date && (
                    <Typography color="error">
                      {errors.seed_capital_addition_date.message}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ mt: 1, width: "100%" }}>
                  <TypographyLabel title={"Additional Seed Capital"} />
                  <Controller
                    name="additional_seed_capital"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        sx={{ width: "100%" }}
                        size="small"
                        placeholder=""
                        error={!!errors.additional_seed_capital}
                        helperText={errors.additional_seed_capital?.message}
                      />
                    )}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  justifyContent: "flex-end",
                  marginTop: "16px",
                }}
              >
                <RoundedButton
                  title1="Add Capital"
                  title2="Cancel"
                  onClick2={handleClose}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default EditSchemeModal;

// import React, { useEffect, useState } from "react";
// import {
//   Modal,
//   Box,
//   TextField,
//   // useTheme,
//   Select,
//   MenuItem,
//   Typography,
//   Button,
//   // Button,
// } from "@mui/material";
// import { Controller, useForm } from "react-hook-form";
// import TypographyLabel from "components/InputLabel/TypographyLabel";
// import CloseIcon from "@mui/icons-material/Close";
// import {
//   usePatchMutualSetup,
//   usePostAddAuthCapital,
// } from "services/MutualFundSetup/MutualFundSetupServices";
// import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import * as yup from "yup";
// import dayjs from "dayjs";
// import { yupResolver } from "@hookform/resolvers/yup";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import ErrorBar from "components/Snackbar/ErrorBar";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// // import RoundedButton from "components/Button/Button";

// interface EditModalProps {
//   open: boolean;
//   setOpen: (open: boolean) => void;
//   data: any;
//   onSave: (updatedData: any) => void;
// }

// type EditFields = {
//   scheme_name: string;
//   scheme_number: string;
//   scheme_type: string;
//   maturity_date: string;
//   nav_calculation_method: string;
//   authorized_capital: string;
//   scheme_size: number;
//   seed_capital: string;
//   allotment_date: string;
//   allotted_capital: string;
//   total_subscribed_units: string;
//   seed_capital_addition_date: string;
//   additional_seed_capital: number;
//   authorized_capital_addition: number;
//   authorized_capital_addition_date: string;
//   revised_scheme_size: number;
// };

// // type usePostAddAuthCapital = {
// //     authorized_capital_addition: number;
// //     authorized_capital_addition_date: string;
// //     revised_scheme_size: number;
// //     seed_capital_addition_date: string;
// //     additional_seed_capital: number;
// // };

// const EditSchemeModal: React.FC<EditModalProps> = ({
//   open,
//   setOpen,
//   data,
//   onSave,
// }) => {
//   // const theme = useTheme();

//   const [successabarOpen, setSuccessbarOpen] = useState<boolean>();
//   const [errorsbarOpen, setErrorbarOpen] = useState<boolean>();

//   const [successabarOpenAuth, setSuccessbarOpenAuth] = useState<boolean>();
//   const [errorsbarOpenAuth, setErrorbarOpenAuth] = useState<boolean>();

//   const { mutate: dataMutualSetup } = usePatchMutualSetup(data?.id);
//   const { mutate: MutateAuthCapital } = usePostAddAuthCapital();
//   const schema = yup
//     .object({
//       scheme_name: yup.string().required("Scheme Name is required"),
//       scheme_number: yup.string().required("Scheme Number is required"),
//       scheme_type: yup.string().required("Scheme Type is required"),
//       maturity_date: yup.string().required("Maturity Date is required"),
//       nav_calculation_method: yup
//         .string()
//         .required("NAV Calculation Method is required"),
//       authorized_capital: yup
//         .string()
//         .required("Authorized Capital is required"),
//       scheme_size: yup.number().required("Scheme Size is required"),
//       seed_capital: yup.string().required("Seed Capital is required"),
//       allotment_date: yup.string().required("Allotment Date is required"),
//       allotted_capital: yup
//         .string()
//         .required("Allotted Capital is required")
//         .optional(),
//       total_subscribed_units: yup
//         .string()
//         .required("Total Subscribed Units is required"),

//       seed_capital_addition_date: yup.string().optional(),
//       additional_seed_capital: yup
//         .number()
//         .required("Additional Seed Capital is required")
//         .optional(),
//       authorized_capital_addition: yup
//         .number()
//         .required("Authorized Capital Addition is required")
//         .optional(),
//       authorized_capital_addition_date: yup.string().optional(),
//       revised_scheme_size: yup
//         .number()
//         .required("Revised Scheme Size is required")
//         .optional(),
//     })
//     .required();

//     const schema_add = yup
//     .object({

//       seed_capital_addition_date: yup.string().optional(),
//       additional_seed_capital: yup
//         .number()
//         .required("Additional Seed Capital is required")
//         .optional(),
//       authorized_capital_addition: yup
//         .number()
//         .required("Authorized Capital Addition is required")
//         .optional(),
//       authorized_capital_addition_date: yup.string().optional(),
//       revised_scheme_size: yup
//         .number()
//         .required("Revised Scheme Size is required")
//         .optional(),
//     })
//     .required();

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     // reset
//     setValue,
//   } = useForm<EditFields>({
//     resolver: yupResolver<any>(schema),
//     defaultValues: {
//       scheme_name: data.scheme_name,
//       scheme_number: data.scheme_number,
//       scheme_type: data.scheme_type,
//       // maturity_date: dayjs(data.maturity_date).format("YYYY-MM-DD"),
//       nav_calculation_method: data.nav_calculation_method,
//       authorized_capital: data.total_authorized_capital,
//       scheme_size: data.scheme_size,
//       seed_capital: data.total_seed_capital,
//       allotment_date: data.allotment_date,
//       allotted_capital: data.alloted_capital,
//       total_subscribed_units: data.total_subscribed_units,
//     },
//   });

//   const schemeType = watch("scheme_type");

//   const {
//     control : control_add,
//     handleSubmit : handleSubmit_add,
//     formState: { errors : errors_add },
//     // watch,
//     // reset
//     // setValue,
//   } = useForm<EditFields>({
//     resolver: yupResolver<any>(schema_add),

//   });

//   //  useEffect(() => {
//   //   // setValue("maturity_date", DateFormatter(data.maturity_date));
//   //   }
//   //   , [data.allotment_date, data.maturity_date, setValue])

//   useEffect(() => {
//     if (data) {
//       try {
//         const formattedAllotedDate = dayjs(data.allotment_date).format(
//           "MM/DD/YYYY"
//         );
//         setValue("allotment_date", formattedAllotedDate);

//         const formattedMaturityDate = dayjs(data.maturity_date).format(
//           "MM/DD/YYYY"
//         );
//         setValue("maturity_date", formattedMaturityDate);
//       } catch (error) {
//         console.error("Error formatting date:", error);
//       }
//     } else {
//     }
//   }, [data, setValue]);

//   //   useEffect(() => {
//   //     reset(data);
//   // }, [data, reset]);

//   const handleSave = async (formData: EditFields) => {

//     const payload = {
//       scheme_name: formData.scheme_name,
//       scheme_number: formData.scheme_number,
//       scheme_type: formData.scheme_type,
//       // maturity_date: dayjs(formData.maturity_date).format("YYYY-MM-DD"),
//       maturity_date:
//         schemeType === "open_ended"
//           ? null
//           : dayjs(formData.maturity_date).format("YYYY-MM-DD"),
//       nav_calculation_method: formData.nav_calculation_method,
//       authorized_capital: formData.authorized_capital,
//       scheme_size: formData.scheme_size,
//       seed_capital: formData.seed_capital,
//       allotment_date: dayjs(formData.allotment_date).format("YYYY-MM-DD"),
//       allotted_capital: formData.allotted_capital,
//       total_subscribed_units: formData.total_subscribed_units,
//       // seed_capital_addition_date: dayjs(formData.seed_capital_addition_date).format("YYYY-MM-DD"),
//       // additional_seed_capital: formData.total_seed_capital,
//       // authorized_capital_addition: formData.authorized_capital_addition,
//       // authorized_capital_addition_date: dayjs(formData.authorized_capital_addition_date).format("YYYY-MM-DD"),
//       // revised_scheme_size: formData.revised_scheme_size,
//     };

//     try {
//       await dataMutualSetup(payload, {
//         onSuccess: () => {
//           setOpen(false);
//           setSuccessbarOpen(true);
//           // reset(data);
//         },
//         onError: (error) => {
//           setErrorbarOpen(true);
//         },
//       });
//       onSave(payload);
//       setOpen(false);
//     } catch (error) {
//       console.error("Failed to update scheme details", error);
//     }
//   };

//   const handleAddCapital = async (formData: EditFields) => {
//     const payload = {
//       scheme_name: data.id,
//       authorized_capital_addition: formData.authorized_capital_addition,
//       authorized_capital_addition_date: dayjs(
//         formData.authorized_capital_addition_date
//       ).format("YYYY-MM-DD"),
//       revised_scheme_size: formData.revised_scheme_size,
//       seed_capital_addition_date: dayjs(
//         formData.seed_capital_addition_date
//       ).format("YYYY-MM-DD"),
//       additional_seed: formData.additional_seed_capital,
//     };

//     try {
//       await MutateAuthCapital(payload, {
//         onSuccess: () => {
//           setOpen(false);
//           setSuccessbarOpenAuth(true);
//           // reset(data);
//         },
//         onError: (error) => {
//           setErrorbarOpenAuth(true);
//         },
//       });
//       onSave(payload);
//       // setOpen(false);
//     } catch (error) {
//       console.error("Failed to update scheme details", error);
//     }
//   };

//   const handleClose = () => {
//     setOpen(false);
//     // reset(data);
//   };

//   // const schemeType = watch("scheme_type");

//   return (
//     <>
//       <SuccessBar
//         snackbarOpen={successabarOpen}
//         message={"Scheme Successfully Updated!"}
//         setSnackbarOpen={setSuccessbarOpen}
//       />
//       <ErrorBar
//         snackbarOpen={errorsbarOpen}
//         message={"Error in Updating Scheme!"}
//         setSnackbarOpen={setErrorbarOpen}
//       />

//       <SuccessBar
//         snackbarOpen={successabarOpenAuth}
//         message={"Authorized Capital Successfully Added!"}
//         setSnackbarOpen={setSuccessbarOpenAuth}
//       />
//       <ErrorBar
//         snackbarOpen={errorsbarOpenAuth}
//         message={"Error in Adding Authorized Capital!"}
//         setSnackbarOpen={setErrorbarOpenAuth}
//       />

//       <Modal open={open} onClose={handleClose}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             // width: 600,
//             bgcolor: "background.paper",
//             border: 'none',
//             borderRadius: 5,
//             // boxShadow: 24,
//             p: 2,
//           }}
//         >
//           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//             <HeaderDesc title="Edit NIC Asia Dynamic Debt Fund" />
//             <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
//           </Box>

//           <form onSubmit={handleSubmit(handleSave)}>
//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(3 , 1fr)",
//                 gap: 1,
//               }}
//             >
//               <Box sx={{ width: "100%", mt: 1 }}>
//                 <TypographyLabel title={"Scheme Name"} />
//                 <Controller
//                   name="scheme_name"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       sx={{ margin: 0, width: "100%" }}
//                       size="small"
//                       placeholder="Navya Large Cap Fund"
//                       error={!!errors.scheme_name}
//                       helperText={errors.scheme_name?.message}
//                     />
//                   )}
//                 />
//               </Box>

//               <Box sx={{ width: "100%", mt: 1 }}>
//                 <TypographyLabel title={"Scheme Number"} />
//                 <Controller
//                   name="scheme_number"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       sx={{ margin: 0, width: "100%" }}
//                       size="small"
//                       placeholder=""
//                       error={!!errors.scheme_number}
//                       helperText={errors.scheme_number?.message}
//                     />
//                   )}
//                 />
//               </Box>

//               <Box sx={{ width: "100%", mt: 1 }}>
//                 <TypographyLabel title={"Scheme Type"} />
//                 <Controller
//                   name="scheme_type"
//                   defaultValue="open_ended"
//                   control={control}
//                   render={({ field }) => (
//                     <Select {...field} size="small" fullWidth>
//                       <MenuItem value="open_ended">Open-Ended</MenuItem>
//                       <MenuItem value="close_ended">Close-Ended</MenuItem>
//                     </Select>
//                   )}
//                 />
//                 {errors.scheme_type && (
//                   <Typography color="error">
//                     {errors.scheme_type.message}
//                   </Typography>
//                 )}
//               </Box>

//               {schemeType === "close_ended" ? (
//                 <Box sx={{ mt: 1, width: "100%" }}>
//                   <LocalizationProvider dateAdapter={AdapterDayjs}>
//                     <TypographyLabel title="Maturity Date" />
//                     <Controller
//                       name="maturity_date"
//                       control={control}
//                       rules={{
//                         required: {
//                           value: true,
//                           message: "Start date is required",
//                         },
//                       }}
//                       render={({ field }) => (
//                         <DatePicker
//                           {...field}
//                           sx={{
//                             width: "100%",
//                             "& .MuiSvgIcon-root": {
//                               width: "16px",
//                               height: "16px",
//                             },
//                           }}
//                           slotProps={{ textField: { size: "small" } }}
//                           // value={field.value}
//                           value={field.value ? dayjs(field.value) : null}
//                           onChange={(date) => field.onChange(date)}
//                           // error={!!errors.maturity_date}
//                           // helperText={errors.maturity_date?.message}
//                         />
//                       )}
//                     />
//                   </LocalizationProvider>
//                   {errors.maturity_date && (
//                     <Typography color="error">
//                       {errors.maturity_date.message}
//                     </Typography>
//                   )}
//                 </Box>
//               ) : null}

//               <Box sx={{ width: "100%", mt: 1 }}>
//                 <TypographyLabel title={"NAV Calculation Method"} />
//                 <Controller
//                   name="nav_calculation_method"
//                   defaultValue="daily"
//                   control={control}
//                   render={({ field }) => (
//                     <Select {...field} size="small" fullWidth>
//                       <MenuItem value="daily">Daily</MenuItem>
//                       <MenuItem value="weekly">Weekly</MenuItem>
//                       <MenuItem value="monthly">Monthly</MenuItem>
//                       <MenuItem value="quarterly">Quarterly</MenuItem>
//                     </Select>
//                   )}
//                 />
//                 {errors.nav_calculation_method && (
//                   <Typography color="error">
//                     {errors.nav_calculation_method.message}
//                   </Typography>
//                 )}
//               </Box>

//               <Box sx={{ width: "100%", mt: 1 }}>
//                 <TypographyLabel title={"Authorized Capital"} />
//                 <Controller
//                   name="authorized_capital"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       disabled
//                       {...field}
//                       sx={{ margin: 0, width: "100%" }}
//                       size="small"
//                       placeholder=""
//                       error={!!errors.authorized_capital}
//                       helperText={errors.authorized_capital?.message}
//                     />
//                   )}
//                 />
//               </Box>

//               <Box sx={{ width: "100%", mt: 1 }}>
//                 <TypographyLabel title={"Scheme Size"} />
//                 <Controller
//                   name="scheme_size"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       disabled
//                       sx={{ margin: 0, width: "100%" }}
//                       size="small"
//                       placeholder=""
//                       error={!!errors.scheme_size}
//                       helperText={errors.scheme_size?.message}
//                     />
//                   )}
//                 />
//               </Box>

//               <Box sx={{ width: "100%", mt: 1 }}>
//                 <TypographyLabel title={"Seed Capital"} />
//                 <Controller
//                   name="seed_capital"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       disabled
//                       sx={{ margin: 0, width: "100%" }}
//                       size="small"
//                       placeholder=""
//                       error={!!errors.seed_capital}
//                       helperText={errors.seed_capital?.message}
//                     />
//                   )}
//                 />
//               </Box>

//               <Box sx={{ mt: 1, width: "100%" }}>
//                 <LocalizationProvider dateAdapter={AdapterDayjs}>
//                   <TypographyLabel title={"Allotment Date"} />
//                   <Controller
//                     name="allotment_date"
//                     control={control}
//                     render={({ field }) => (
//                       <DatePicker
//                         {...field}
//                         disabled
//                         sx={{
//                           width: "100%",
//                           "& .MuiSvgIcon-root": {
//                             width: "16px",
//                             height: "16px",
//                           },
//                         }}
//                         slotProps={{ textField: { size: "small" } }}
//                         value={field.value ? dayjs(field.value) : null}
//                         onChange={(date) => field.onChange(date)}
//                       />
//                     )}
//                   />
//                 </LocalizationProvider>
//                 {errors.allotment_date && (
//                   <Typography color="error">
//                     {errors.allotment_date.message}
//                   </Typography>
//                 )}
//               </Box>

//               <Box sx={{ mt: 1, width: "100%" }}>
//                 <TypographyLabel title={"Allotted Capital"} />
//                 <Controller
//                   name="allotted_capital"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       disabled
//                       sx={{ width: "100%" }}
//                       size="small"
//                       placeholder=""
//                       error={!!errors.allotted_capital}
//                       helperText={errors.allotted_capital?.message}
//                     />
//                   )}
//                 />
//               </Box>

//               <Box sx={{ mt: 1, width: "100%" }}>
//                 <TypographyLabel title={"Total Subscribed Units"} />
//                 <Controller
//                   name="total_subscribed_units"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       sx={{ width: "100%" }}
//                       size="small"
//                       placeholder=""
//                       error={!!errors.total_subscribed_units}
//                       helperText={errors.total_subscribed_units?.message}
//                     />
//                   )}
//                 />
//               </Box>
//             </Box>
//             <Box sx={{ mt: 1 }}>
//               {/* <RoundedButton title1="Update Record" /> */}
//               <Button
//                   type="submit"
//                   color="primary"
//                   variant="contained"
//                 >
//                 Update Record
//                  </Button>
//             </Box>
//           </form>

// <Box sx={{mt:5}}>

//             <form onSubmit={handleSubmit_add(handleAddCapital)}>
//               <HeaderDesc title="Add Authorized Capital" />
//               <Box
//                 sx={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(3 , 1fr)",
//                   gap: 2,
//                 }}
//               >
//                 <Box sx={{ mt: 1, width: "100%" }}>
//                   <TypographyLabel title={"Authorized Capital Addition"} />
//                   <Controller
//                     name="authorized_capital_addition"
//                     control={control_add}
//                     render={({ field }) => (
//                       <TextField
//                         {...field}
//                         sx={{ width: "100%" }}
//                         size="small"
//                         placeholder=""
//                         error={!!errors_add.authorized_capital_addition}
//                         helperText={errors_add.authorized_capital_addition?.message}
//                       />
//                     )}
//                   />
//                 </Box>

//                 <Box sx={{ mt: 1, width: "100%" }}>
//                   <LocalizationProvider dateAdapter={AdapterDayjs}>
//                     <TypographyLabel
//                       title={"Authorized Capital Addition Date"}
//                     />
//                     <Controller
//                       name="authorized_capital_addition_date"
//                       control={control_add}
//                       render={({ field }) => (
//                         <DatePicker
//                           {...field}
//                           sx={{
//                             width: "100%",
//                             "& .MuiSvgIcon-root": {
//                               width: "16px",
//                               height: "16px",
//                             },
//                           }}
//                           slotProps={{ textField: { size: "small" } }}
//                           value={field.value}
//                           onChange={(date) => field.onChange(date)}
//                           //   error={!!errors.entry_date}
//                           //   helperText={errors.entry_date?.message}
//                         />
//                       )}
//                     />
//                   </LocalizationProvider>
//                   {errors_add.seed_capital_addition_date && (
//                     <Typography color="error">
//                       {errors_add.seed_capital_addition_date.message}
//                     </Typography>
//                   )}
//                 </Box>

//                 <Box sx={{ mt: 1, width: "100%" }}>
//                   <TypographyLabel title={"Revised Scheme Size"} />
//                   <Controller
//                     name="revised_scheme_size"
//                     control={control_add}
//                     render={({ field }) => (
//                       <TextField
//                         {...field}
//                         sx={{ width: "100%" }}
//                         size="small"
//                         placeholder=""
//                         error={!!errors_add.revised_scheme_size}
//                         helperText={errors_add.revised_scheme_size?.message}
//                       />
//                     )}
//                   />
//                 </Box>

//                 <Box sx={{ mt: 1, width: "100%" }}>
//                   <LocalizationProvider dateAdapter={AdapterDayjs}>
//                     <TypographyLabel title={"Seed Capital Addition Date"} />
//                     <Controller
//                       name="seed_capital_addition_date"
//                       control={control_add}
//                       render={({ field }) => (
//                         <DatePicker
//                           {...field}
//                           sx={{
//                             width: "100%",
//                             "& .MuiSvgIcon-root": {
//                               width: "16px",
//                               height: "16px",
//                             },
//                           }}
//                           slotProps={{ textField: { size: "small" } }}
//                           value={field.value}
//                           onChange={(date) => field.onChange(date)}
//                           //   error={!!errors.entry_date}
//                           //   helperText={errors.entry_date?.message}
//                         />
//                       )}
//                     />
//                   </LocalizationProvider>
//                   {errors_add.seed_capital_addition_date && (
//                     <Typography color="error">
//                       {errors_add.seed_capital_addition_date.message}
//                     </Typography>
//                   )}
//                 </Box>

//                 <Box sx={{ mt: 1, width: "100%" }}>
//                   <TypographyLabel title={"Additional Seed Capital"} />
//                   <Controller
//                     name="additional_seed_capital"
//                     control={control_add}
//                     render={({ field }) => (
//                       <TextField
//                         {...field}
//                         sx={{ width: "100%" }}
//                         size="small"
//                         placeholder=""
//                         error={!!errors_add.additional_seed_capital}
//                         helperText={errors_add.additional_seed_capital?.message}
//                       />
//                     )}
//                   />
//                 </Box>
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: "row-reverse",
//                   justifyContent: "flex-end",
//                   marginTop: "16px",
//                 }}
//               >
//                 {/* <RoundedButton
//                   title1="Add Capital"
//                   title2="Cancle"
//                   onClick2={handleClose}
//                 /> */}
//                  <Button
//                   type="submit"
//                   color="primary"
//                   variant="contained"
//                 >
//                    Add Capital
//                  </Button>
//               </Box>
//             </form>
// </Box>

//         </Box>
//       </Modal>
//     </>
//   );
// };

// export default EditSchemeModal;
