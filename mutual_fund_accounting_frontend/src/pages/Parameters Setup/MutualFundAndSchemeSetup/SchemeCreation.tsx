/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { PaginationState } from "@tanstack/react-table";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import RoundedButton from "components/Button/Button";
import ReceiptTable from "components/Table/TanstackTable";
import { Empty } from "antd";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  usePostCreateMutualFundSetup,
  useGetMutalFundFaceValue,
  usePostMutualFundShareholders,
} from "services/MutualFundSetup/MutualFundSetupServices";
import { useNavigate } from "react-router-dom";
import {SchemeFileUloadTableHeader} from "constants/Table Headers/SchemeCreationFileUpload/SchemeCreationFileUploadTableHeader"

interface FileInput {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  lastModifiedDate: Date;
  webkitRelativePath: string;
}
export interface Data {
  scheme_number: string;
  maturity_date: Date;
  nav_calculation_method: string;
  nav_calculation_method_open: string;
  nav_calculation_method_close: string;

  authorized_capital: string;
  scheme_size: string;
  allotment_date: Date;
  allotted_capital: string;
  total_subscribed_units: string;
  par_value: string;
  scheme_name: string;
  seed_capital: string;
  scheme_type: string;
  file: FileInput;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const steps = [
  "Initial Scheme Setup",
  "Primary Scheme Details",
  "Scheme Finalization",
];

const schema = yup
  .object({
    scheme_number: yup.string().label("Scheme Number is required").optional(),
    maturity_date: yup
      .date()
      .label("Maturity Date is required")
      .optional()
      .nullable(),
    nav_calculation_method: yup
      .string()
      .label("NAV Calculation Method is required")
      .optional(),
    authorized_capital: yup
      .string()
      .label("Authorized Capital is required")
      .optional()
      .nullable(),
    scheme_size: yup.string().label("Scheme Size is required").optional(),
    allotment_date: yup
      .date()
      .label("Allotment Date is required")
      .optional()
      .nullable(),
    allotted_capital: yup
      .string()
      .label("Allotted Capital is required")
      .optional(),
    total_subscribed_units: yup
      .string()
      .label("Total Subscribed Units is required")
      .optional(),

    par_value: yup
      .number()
      .label("Face Value is required")
      .typeError("Face Value must be a number")
      .min(0, "Face Value must be greater than 0"),
    scheme_name: yup.string().label("Scheme Name is required"),
    seed_capital: yup
      .number()
      .label("Seed Capital is required")
      .typeError("Seed Capital must be a number")
      .min(0, "Seed Capital must be greater than 0"),
    scheme_type: yup.string().label("Scheme Type is required"),
    file: yup.mixed().label("File is required").optional(),
  })
  .required();

const SchemeStepper: React.FC = () => {
  const navigate = useNavigate();

  const theme = useTheme();

  const { data: faceValueData } = useGetMutalFundFaceValue();
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<Data>({
    // resolver: yupResolver<any>(schema),
    defaultValues: {
      scheme_number: "",
      maturity_date: null,
      nav_calculation_method_open: "daily",
      nav_calculation_method_close: "weekly",
      authorized_capital: "",
      scheme_size: "",
      allotment_date: null,
      allotted_capital: "",
      total_subscribed_units: "",
      par_value: faceValueData?.responseData[0]?.id,
      scheme_name: "",
      seed_capital: "",
      scheme_type: "close_ended",
    },
  });

  const schemeType = watch("scheme_type");

  const [fileUpload, setFileUpload] = useState<FileInput>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState(null);
  const [faceValue, setFaceValue] = useState([]);

  const [successSnackbarOpen, setSuccessSnackbarOpen] =
    useState<boolean>(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState<boolean>(false);
  const [errorMsgs, setErrorMsgs] = useState<string>("");

  const [finalizeSnackbarOpen, setFinalizeSnackbarOpen] =
    useState<boolean>(false);
  const [finalizeErrorSnackbarOpen, setFinalizeErrorSnackbarOpen] =
    useState<boolean>(false);
  const [finalizeErrorMsgs, setFinalizeErrorMsgs] = useState<string>("");

  const { mutate: createMutualFundSetup } = usePostCreateMutualFundSetup();
  const { mutate: postMutualFundShareholders, isPending: FileUploadPending } =
    usePostMutualFundShareholders();

  useEffect(() => {
    setValue("allotted_capital", uploadData?.meta?.total_allotted_capital);
    setValue("total_subscribed_units", uploadData?.meta?.total_sub_units);
  }, [uploadData]);

  useEffect(() => {
    if (faceValueData?.isSuccess) {
      const faceValueOptions = faceValueData.responseData.map((facevalue) => ({
        face_id: facevalue.id,
        face_value: facevalue.value,
        face_name: facevalue.scheme_name,
      }));
      setFaceValue(faceValueOptions);
    }
  }, [faceValueData]);

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleFinalize = () => {
    const payload_for_open = {
      par_value: watch("par_value"),
      scheme_name: watch("scheme_name"),
      scheme_number: watch("scheme_number"),
      scheme_type: watch("scheme_type"),
      authorized_capital: watch("authorized_capital"),
      scheme_size: watch("scheme_size"),
      seed_capital: watch("seed_capital"),
      allotment_date: dayjs(watch("allotment_date")).format("YYYY-MM-DD"),
      alloted_capital: watch("allotted_capital"),
      total_subscribed_units: watch("total_subscribed_units"),
      nav_calculation_method:
        schemeType === "close_ended"
          ? watch("nav_calculation_method_close")
          : watch("nav_calculation_method_open"),
      allotted_file: file,
    };
    const payload_for_close = {
      par_value: watch("par_value"),
      scheme_name: watch("scheme_name"),
      scheme_number: watch("scheme_number"),
      scheme_type: watch("scheme_type"),
      maturity_date: dayjs(watch("maturity_date")).format("YYYY-MM-DD"),
      authorized_capital: watch("authorized_capital"),
      scheme_size: watch("scheme_size"),
      seed_capital: watch("seed_capital"),
      allotment_date: dayjs(watch("allotment_date")).format("YYYY-MM-DD"),
      alloted_capital: watch("allotted_capital"),
      total_subscribed_units: watch("total_subscribed_units"),
      nav_calculation_method:
        schemeType === "close_ended"
          ? watch("nav_calculation_method_close")
          : watch("nav_calculation_method_open"),
      allotted_file: file,
    };
    const payload =
      schemeType === "close_ended" ? payload_for_close : payload_for_open;
    createMutualFundSetup(payload, {
      onSuccess: () => {
        setFinalizeSnackbarOpen(true);
        navigate("/mutual-fund-scheme-setup");
      },
      onError: (error) => {
        setFinalizeErrorSnackbarOpen(true);
        if (axios.isAxiosError(error) && error.response) {
          setFinalizeErrorMsgs(
            error?.response?.data?.par_value
              ? `Face Value: ${error?.response?.data?.par_value}`
              : error?.response?.data?.scheme_number
              ? error?.response?.data?.scheme_number
              : error?.response?.data?.maturity_date
              ? `Maturity Date: ${error?.response?.data?.maturity_date}`
              : error?.response?.data?.authorized_capital
              ? `Authorized Capital: ${error?.response?.data?.authorized_capital}`
              : error?.response?.data?.scheme_size
              ? `Scheme Size: ${error?.response?.data?.scheme_size}`
              : error?.response?.data?.allotment_date
              ? `Allotment Date: ${error?.response?.data?.allotment_date}`
              : error?.response?.data?.alloted_capital
              ? `Allotted Capital: ${error?.response?.data?.alloted_capital}`
              : error?.response?.data?.total_subscribed_units
              ? `Total Subscribed Units: ${error?.response?.data?.total_sub_units}`
              : error?.response?.data?.seed_capital
              ? `Seed Capital: ${error?.response?.data?.seed_capital}`
              : "Error occured while uploading file."
          );
        }
        setFinalizeErrorSnackbarOpen(true);
      },
    });
  };

  const InitialSchemeSetup: React.FC = () => {
    const hiddenFileInput = useRef(null);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
    const handleCSVUpload = async (e) => {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      setFileUpload(uploadedFile);
    };

    const handleFileUpload = (data) => {
      // setIsPendingState(true);
      const payload = {
        file: file ? file : null,
        seed_capital: data.seed_capital,
        scheme_name: data.scheme_name,
        face_value: faceValue.find((face) => face.face_id === data.par_value)
          .face_value,
        scheme_type: data.scheme_type,
      };

      postMutualFundShareholders(payload, {
        onSuccess: (data) => {
          setUploadData(data);
          setSuccessSnackbarOpen(true);
          // setIsPendingState(false);
        },
        onError: (error) => {
          // setIsPendingState(false);
          if (axios.isAxiosError(error) && error.response) {
            setErrorMsgs(
              error?.response?.data?.file
                ? error?.response?.data?.file
                : error?.response?.data?.seed_capital
                ? `Seed Capital: ${error?.response?.data?.seed_capital}`
                : "Error occured while uploading file."
            );
          }
          setErrorSnackbarOpen(true);
        },
      });
    };
    const handleFileUploadClick = () => {
      hiddenFileInput.current.click();
    };
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <SuccessBar
            snackbarOpen={successSnackbarOpen}
            setSnackbarOpen={setSuccessSnackbarOpen}
            message={"Details Uploaded Successfully."}
          />
          <ErrorBar
            snackbarOpen={errorSnackbarOpen}
            setSnackbarOpen={setErrorSnackbarOpen}
            message={errorMsgs}
          />

          <Box sx={{ mt: 1 }} component="form">
            <HeaderDesc title="New Scheme Details" />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 2fr",
                columnGap: 2,
              }}
            >
              <Box sx={{ mt: 1, width: "100%" }}>
                <TypographyLabel title="Mutual Fund Face Value (Rs)" />
                {/* <Controller
                  name="face_value"
                  control={control}
                  render={({ field }) => (
                      <TextField
                      // disabled={!!disableScheme}
                      {...field}
                      sx={{ margin: 0, width: "100%" }}
                      size="small"
                      placeholder="10"
                      error={!!errors.face_value}
                      // helperText={errors.scheme_name?.message}
                      helperText={errors.face_value?.message?.toString()}
                      />
                  )}
                  /> */}

                <Controller
                  name="par_value"
                  control={control}
                  render={({ field }) => (
                    // <FormControl size="small" error={!!errors.par_value}>
                    <Select
                      size="small"
                      fullWidth
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      {faceValue.map((option) => (
                        <MenuItem key={option.face_id} value={option.face_id}>
                          {option?.face_value ?? ""}
                        </MenuItem>
                      ))}
                    </Select>
                    // </FormControl>
                  )}
                />
                {errors.par_value && (
                  <FormHelperText>{errors.par_value.message}</FormHelperText>
                )}
              </Box>

              <Box sx={{ width: "100%", mt: 1 }}>
                <TypographyLabel title={"Scheme Name"} />
                <Controller
                  name="scheme_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      //   disabled={!!disableScheme}
                      {...field}
                      sx={{ margin: 0, width: "100%" }}
                      size="small"
                      placeholder="Enter Scheme Name"
                      error={!!errors.scheme_name}
                      helperText={errors.scheme_name?.message.toString()}
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
                      // disabled={!!disableScheme}
                      {...field}
                      sx={{ margin: 0, width: "100%" }}
                      size="small"
                      placeholder="75000000"
                      error={!!errors.seed_capital}
                      helperText={errors.seed_capital?.message.toString()}
                    />
                  )}
                />
              </Box>

              <Box sx={{ width: "100%", mt: 1 }}>
                <TypographyLabel title={"Scheme Type"} />
                <Controller
                  name="scheme_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      //   disabled={!!disableScheme}
                      size="small"
                      fullWidth
                    >
                      <MenuItem value="open_ended">Open-Ended</MenuItem>
                      <MenuItem value="close_ended">Close-Ended</MenuItem>
                    </Select>
                  )}
                />
                {errors.scheme_type && (
                  <Typography color="error">
                    {errors.scheme_type.message.toString()}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <HeaderDesc title="Units and Shareholders Allotment" />
              <Box sx={{ mt: 1 }}>
                <TypographyLabel title="Upload the Allotment File (.xlsx/.csv)" />

                <Button
                  variant="outlined"
                  startIcon={<AttachFileIcon />}
                  onClick={handleFileUploadClick}
                  sx={{
                    borderRadius: 2,
                    width: 230,
                    borderColor: theme.palette.secondary[700],
                    color: theme.palette.primary[1100],
                    textTransform: "none",
                  }}
                >
                  {fileUpload ? fileUpload.name : "Select a File"}

                  <VisuallyHiddenInput
                    type="file"
                    hidden
                    ref={hiddenFileInput}
                    sx={{ display: "none" }}
                    accept=".csv , application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={handleCSVUpload}
                  />
                </Button>
                <Box mt={1}>
                  <RoundedButton
                    title1="Upload"
                    onClick1={handleSubmit(handleFileUpload)}
                    // disable={isPendingState}
                    loading={FileUploadPending}
                  />
                </Box>
              </Box>
            </Box>

            <Box
              sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <HeaderDesc title="Upload Preview" />

              <Box>
                {uploadData?.responseData?.length > 0 ? (
                  <Box
                    sx={{
                      maxWidth: "1500px",
                      width: { md: "125%", lg: "110%", xl: "120%" },
                    }}
                  >
                    <ReceiptTable
                      columns={SchemeFileUloadTableHeader}
                      // data={uploadData?.responseData ?? []}
                      data={
                        uploadData?.responseData?.slice(
                          pagination.pageIndex * pagination.pageSize,
                          pagination.pageIndex * pagination.pageSize +
                            pagination.pageSize
                        ) ?? []
                      }
                      pagination={pagination}
                      setPagination={setPagination}
                      pageCount={1}
                      next={true}
                      prev={true}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      maxWidth: "1500px",
                      width: { md: "130%", lg: "100%", xl: "100%" },
                    }}
                  >
                    <ReceiptTable columns={SchemeFileUloadTableHeader} data={[]} />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        ml: { md: 5, lg: 20 },
                        // mt: 5,
                      }}
                    >
                      <Empty
                        imageStyle={{ height: 150, width: 150 }}
                        description="No Data Available"
                      />
                    </Box>
                  </Box>
                )}
              </Box>

              {uploadData?.responseData?.length > 0 && (
                <Box>
                  <HeaderDesc title="New Scheme Details" />
                  <Box
                    sx={{
                      mt: 1,
                      width: "60%",
                      rowGap: 1,
                      display: "grid",
                      gridTemplateColumns: "2fr 2fr",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "15px",
                          color: theme.palette.grey[500],
                        }}
                      >
                        Total Alloted Capital
                      </Typography>
                      <Typography sx={{ fontWeight: 500 }}>
                        NPR{" "}
                        {uploadData?.meta?.total_allotted_capital
                          ? uploadData?.meta?.total_allotted_capital.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )
                          : null}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "15px",
                          color: theme.palette.grey[500],
                        }}
                      >
                        Total Unit Holders
                      </Typography>
                      <Typography sx={{ fontWeight: 500 }}>
                        {(uploadData?.meta?.total_units_holder).toLocaleString() ??
                          "-"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "15px",
                          color: theme.palette.grey[500],
                        }}
                      >
                        Total Subscribed Unit
                      </Typography>
                      <Typography sx={{ fontWeight: 500 }}>
                        {(uploadData?.meta?.total_sub_units).toLocaleString() ??
                          "-"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    );
  };

  const PrimarySchemeDetails: React.FC = () => {
    const theme = useTheme();

    return (
      <>
        <Box
          sx={{
            paddingTop: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: { xs: "50%", md: "60%", lg: "80%", xl: "80%" },
          }}
          component="form"
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
            Scheme Setup
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
              width: { xs: "180%", md: "120%", lg: "80%", xl: "100%" },
            }}
          >
            <Box sx={{ mt: 0, width: "100%" }}>
              <TypographyLabel title="Scheme Number" />
              <Controller
                name="scheme_number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="Scheme Number"
                    error={!!errors.scheme_number}
                    helperText={errors.scheme_number?.message}
                  />
                )}
              />
            </Box>

            {schemeType === "close_ended" && (
              <Box sx={{ mt: 0, width: "100%" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TypographyLabel title="Maturity Date" />
                  <Controller
                    name="maturity_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            width: "16px",
                            height: "16px",
                          },
                        }}
                        slotProps={{ textField: { size: "small" } }}
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                      />
                    )}
                  />
                </LocalizationProvider>
                {errors.maturity_date && (
                  <Typography sx={{ fontSize: "12px", mt: 0.7 }} color="error">
                    {errors.maturity_date.message}
                  </Typography>
                )}
              </Box>
            )}

            {schemeType === "close_ended" && (
              <Box sx={{ width: "100%", mt: 0 }}>
                <TypographyLabel title={"NAV Calculation Method"} />
                <Controller
                  name="nav_calculation_method_close"
                  // defaultValue={"weekly"}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="small"
                      error={!!errors.nav_calculation_method_close}
                      fullWidth
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                    </Select>
                  )}
                />
                {errors.nav_calculation_method && (
                  <Typography sx={{ fontSize: "12px", mt: 0.5 }} color="error">
                    {errors.nav_calculation_method_close.message}
                  </Typography>
                )}
              </Box>
            )}

            {schemeType === "open_ended" && (
              <Box sx={{ width: "100%", mt: 0}}>
                <TypographyLabel title={"NAV Calculation Method"} />
                <Controller
                  name="nav_calculation_method_open"
                  // defaultValue={"weekly"}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="small"
                      error={!!errors.nav_calculation_method_open}
                      fullWidth
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                    </Select>
                  )}
                />
                {errors.nav_calculation_method_open && (
                  <Typography sx={{ fontSize: "12px", mt: 0.5 }} color="error">
                    {errors.nav_calculation_method_open.message}
                  </Typography>
                )}
              </Box>
            )}

            <Box sx={{ width: "100%", mt: 2 }}>
              <TypographyLabel title={"Authorized Capital"} />
              <Controller
                name="authorized_capital"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ margin: 0, width: "100%" }}
                    size="small"
                    placeholder="1000000000"
                    error={!!errors.authorized_capital}
                    helperText={errors.authorized_capital?.message}
                  />
                )}
              />
            </Box>

            <Box sx={{ width: "100%", mt: 2 }}>
              <TypographyLabel title={"Scheme Size"} />
              <Controller
                name="scheme_size"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ margin: 0, width: "100%" }}
                    size="small"
                    placeholder="500000000"
                    error={!!errors.scheme_size}
                    helperText={errors.scheme_size?.message}
                  />
                )}
              />
            </Box>

            <Box sx={{ mt: 2, width: "100%" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TypographyLabel title={"Allotment Date"} />
                <Controller
                  name="allotment_date"
                  control={control}
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
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      //   helperText={errors.entry_date?.message}
                    />
                  )}
                />
              </LocalizationProvider>
              {errors.allotment_date && (
                <Typography sx={{ fontSize: "12px", mt: 0.7 }} color="error">
                  {errors.allotment_date.message}
                </Typography>
              )}
            </Box>

            <Box sx={{ mt: 2, width: "100%" }}>
              <TypographyLabel title={"Seed Capital"} />
              <Controller
                name="seed_capital"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    defaultValue={uploadData?.meta?.seed_capital}
                    sx={{ width: "100%" }}
                    size="small"
                    placeholder="75000000"
                    error={!!errors.seed_capital}
                    helperText={errors.seed_capital?.message}
                  />
                )}
              />
            </Box>

            <Box sx={{ mt: 2, width: "100%" }}>
              <TypographyLabel title={"Allotted Capital"} />
              <Controller
                name="allotted_capital"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    defaultValue={uploadData?.meta?.total_allotted_capital}
                    sx={{ width: "100%" }}
                    size="small"
                    placeholder="425000000"
                    error={!!errors.allotted_capital}
                    helperText={errors.allotted_capital?.message}
                  />
                )}
              />
            </Box>

            <Box sx={{ mt: 2, width: "100%" }}>
              <TypographyLabel title={"Total Subscribed Units"} />
              <Controller
                name="total_subscribed_units"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: "100%" }}
                    size="small"
                    placeholder="50000000"
                    error={!!errors.total_subscribed_units}
                    helperText={errors.total_subscribed_units?.message}
                  />
                )}
              />
            </Box>
          </Box>
        </Box>
      </>
    );
  };

  const SchemeFinalization: React.FC = () => {
    // const allFormData = watch();
    const allFormData = getValues();
    const theme = useTheme();
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

    const maturityDate = new Date(allFormData.maturity_date);
    const allotmentDate = new Date(allFormData.allotment_date);
    const formattedMaturityDate = `${maturityDate.getFullYear()}/${String(
      maturityDate.getMonth() + 1
    ).padStart(2, "0")}/${String(maturityDate.getDate()).padStart(2, "0")}`;
    const formattedAllotmentDate = `${allotmentDate.getFullYear()}/${String(
      allotmentDate.getMonth() + 1
    ).padStart(2, "0")}/${String(allotmentDate.getDate()).padStart(2, "0")}`;

    return (
      <>
        <SuccessBar
          snackbarOpen={finalizeSnackbarOpen}
          setSnackbarOpen={setFinalizeSnackbarOpen}
          message={"Scheme Created Successfully!"}
        />
        <ErrorBar
          snackbarOpen={finalizeErrorSnackbarOpen}
          setSnackbarOpen={setFinalizeErrorSnackbarOpen}
          message={finalizeErrorMsgs}
        />
        <Box>
          <HeaderDesc title="Scheme Summary" />
          <Box
            sx={{
              mt: 1.5,
              width: "80%",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
              marginBottom: "20px",
              fontFamily: "",
            }}
          >
            <Box>
              <Typography
                sx={{ fontSize: "15px", color: theme.palette.grey[500] }}
              >
                Scheme Name
              </Typography>
              <Typography sx={{ fontWeight: 500 }}>
                {allFormData.scheme_name || "-"}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "15px", color: theme.palette.grey[500] }}
              >
                Scheme Number
              </Typography>
              <Typography sx={{ fontWeight: 500 }}>
                {allFormData.scheme_number || "-"}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "15px", color: theme.palette.grey[500] }}
              >
                Scheme Type
              </Typography>
              <Typography sx={{ fontWeight: 500 }}>
                {allFormData.scheme_type === "close_ended"
                  ? "Close-Ended"
                  : "Open-Ended"}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "15px", color: theme.palette.grey[500] }}
              >
                Maturity Date
              </Typography>
              {allFormData.scheme_type === "close_ended" ? (
                <Typography sx={{ fontWeight: 500 }}>
                  {allFormData?.maturity_date ? formattedMaturityDate : "N/A"}
                </Typography>
              ) : (
                <Typography sx={{ fontWeight: 500 }}>{"N/A"}</Typography>
              )}
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "15px", color: theme.palette.grey[500] }}
              >
                NAV Calculation
              </Typography>
              {schemeType === "close_ended" ? (
                <Typography
                  sx={{ fontWeight: 500, textTransform: "capitalize" }}
                >
                  {allFormData.nav_calculation_method_close}
                </Typography>
              ) : (
                <Typography
                  sx={{ fontWeight: 500, textTransform: "capitalize" }}
                >
                  {allFormData.nav_calculation_method_open}
                </Typography>
              )}
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "15px", color: theme.palette.grey[500] }}
              >
                Authorized Capital
              </Typography>
              <Typography sx={{ fontWeight: 500 }}>
                {Number(allFormData?.authorized_capital).toLocaleString()}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "15px", color: theme.palette.grey[500] }}
              >
                Scheme Size
              </Typography>
              <Typography sx={{ fontWeight: 500 }}>
                {Number(allFormData?.scheme_size).toLocaleString()}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "15px", color: theme.palette.grey[500] }}
              >
                Seed Capital
              </Typography>
              <Typography sx={{ fontWeight: 500 }}>
                {Number(allFormData?.seed_capital).toLocaleString()}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "15px", color: theme.palette.grey[500] }}
              >
                Allotment Date
              </Typography>
              <Typography sx={{ fontWeight: 500 }}>
                {allFormData?.allotment_date ? formattedAllotmentDate : "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "15px", color: theme.palette.grey[500] }}
              >
                Allotted Capital
              </Typography>
              <Typography sx={{ fontWeight: 500 }}>
                {allFormData?.allotted_capital ? Number(allFormData?.allotted_capital).toLocaleString() : "0"}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "15px", color: theme.palette.grey[500] }}
              >
                Total Subscribed Units
              </Typography>
              <Typography sx={{ fontWeight: 500 }}>
                { allFormData?.total_subscribed_units ? Number(allFormData?.total_subscribed_units).toLocaleString() : "0"}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: "15px", color: theme.palette.grey[500] }}
              >
                Number of Shareholders
              </Typography>
              <Typography sx={{ fontWeight: 500 }}>
                {uploadData?.meta?.total_units_holder?.toLocaleString() ?? "0"}
              </Typography>
            </Box>
          </Box>

          <HeaderDesc title="Shareholders" />

          {uploadData?.responseData?.length > 0 ? (
            <Box
              sx={{
                mt: 1,
                maxWidth: "1500px",
                width: { md: "85%", lg: "70%", xl: "75%" },
              }}
            >
              <ReceiptTable
                columns={SchemeFileUloadTableHeader}
                // data={uploadData?.responseData ?? []}
                data={
                  uploadData?.responseData?.slice(
                    pagination.pageIndex * pagination.pageSize,
                    pagination.pageIndex * pagination.pageSize +
                      pagination.pageSize
                  ) ?? []
                }
                pagination={pagination}
                setPagination={setPagination}
                pageCount={1}
                next={true}
                prev={true}
              />
            </Box>
          ) : (
            <Box
              sx={{
                mt: 1,
                maxWidth: "1500px",
                width: { md: "85%", lg: "70%", xl: "65%" },
              }}
            >
              <ReceiptTable columns={SchemeFileUloadTableHeader} data={[]} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  ml: { md: 5, lg: 20 },
                  // mt: 5,
                }}
              >
                <Empty
                  imageStyle={{ height: 150, width: 150 }}
                  description="No Data Available"
                />
              </Box>
            </Box>
          )}
        </Box>
      </>
    );
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <InitialSchemeSetup />;
      case 1:
        return <PrimarySchemeDetails />;
      default:
        return <SchemeFinalization />;
    }
  };

  return (
    <Box sx={{ 
      mt: 2,
     width: { xs: "100%", md: "110%", lg: "150%", xl: "120%"}
      }}>
      <Stepper sx={{ p: 0 }} activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 3, mb: 2 }}>{renderStepContent(activeStep)}</Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{
            borderRadius: "25px",
          }}
        >
          Go Back
        </Button>
        <Button
          variant="contained"
          // onClick={handleNext}
          onClick={
            activeStep === steps.length - 1 ? handleFinalize : handleNext
          }
          //   disabled={activeStep === steps.length - 1}
          sx={{
            borderRadius: "25px",
            backgroundColor: theme.palette.secondary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          {activeStep === steps.length - 1
            ? "Finilize Scheme Setup"
            : "Continue"}
        </Button>
      </Box>
    </Box>
  );
};

export default SchemeStepper;
