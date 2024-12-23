import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Paper,
  Typography,
  useTheme,
  TextField,
  Button,
  Chip,
  Select,
  MenuItem,
  Input,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

//mui icons
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";

//components
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import OwnerInformation from "components/OwnerInformation/OwnerInformation";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import RoundedButton from "components/Button/Button";

//constants
import { BankOptions } from "constants/BankData/BankData";

//react hook form
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import dayjs from "dayjs";

//api services
import axios from "axios";

import { useSipRegEntryMutation } from "services/SIP/sipEntryServices";
import { useGetBOIDSearchResult } from "services/ShareHolderDetails/shareHolderDetails";

//snackbar
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import ImportButton from "components/Button/ImportButton";

// const VisuallyHiddenInput = styled("input")({
//   clip: "rect(0 0 0 0)",
//   clipPath: "inset(50%)",
//   height: 1,
//   overflow: "hidden",
//   position: "absolute",
//   bottom: 0,
//   left: 0,
//   whiteSpace: "nowrap",
//   width: 1,
// });

interface CitizenshipInput {
  lastModified?: number;
  lastModifiedDate?: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath?: string;
}

interface SipEntryInput {
  distributionCenter: string;
  schemeName: string;
  boid: string;
  email: string;
  phone: string;
  full_name: string;
  amount: number;
  sip_model: string;
  sip_interval: string;
  reinvestment: boolean;
  holder_type: string;
  sip_term: number;
  sip_term_type: string;
  citizenship: CitizenshipInput;
}

const SIPRegistrationEntry = () => {
  const theme = useTheme();
  const [snaackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [startDate, setStartDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState("");
  const [boidNo, setBoidNo] = useState("");

  const { mutate: sipRegEntryMutate } = useSipRegEntryMutation();

  const { data: boidSearchData } = useGetBOIDSearchResult(boidNo, 1);

  // console.log(boidSearchData," boid search data")
  // console.log(boidSearchData?.responseData?.results[0]?.full_name, "full name")

  const schema = yup
    .object({
      distributionCenter: yup.string().required(),
      schemeName: yup.string().required(),
      boid: yup.string().required().length(16).label("BOID"),
      email: yup.string().required().email().label("Email"),
      // phone: yup
      //   .string()
      //   .required("Phone number is required")
      //   .matches(/^[0-9]{9,10}$/, "Phone number must be 9 or 10 digits")
      //   .label("Phone Number"),
      phone: yup.string().required().label("Phone Number"),
      full_name: yup.string().required().label("Full Name"),
      amount: yup
        .number()
        .required("Amount is required")
        .positive("Amount must be positive")
        .typeError("Amount must be a number")
        .min(1000, "Minimum amount is 1000")
        .label("Amount"),
      sip_model: yup.string(),
      reinvestment: yup.boolean().default(true),

      sip_interval: yup.string(),
      sip_term_type: yup.string(),

      // sip_term: yup.number()
      // .required('SIP term is required')
      // .min(1, 'Minimum 1 year required')
      // .max(10000, 'Maximum 10000 years allowed')
      // .typeError('SIP term must be a number')
      // .test('valid-installments', 'Minimum 6 installments required based on SIP interval and term type',
      //   function(value) {
      //     const { sip_interval, sip_term_type } = this.parent;

      //     const intervalMap: Record<string, number> = {
      //       'Monthly': 1,
      //       'Quarterly': 3,
      //       'half-yearly': 6,
      //       'annually': 12,
      //     };

      //     if (!sip_interval || !sip_term_type || !value) return false;

      //     const totalMonths = sip_term_type === 'Months' ? value : value * 12;

      //     const installments = totalMonths / intervalMap[sip_interval];

      //     return installments >= 6;
      //   }
      // ),

      sip_term: yup.number().when(["sip_model"], ([sip_model], schema) => {
        if (sip_model === "Limited") {
          return schema
            .positive("Term must be positive")
            .typeError("SIP term must be a number")
            .test(
              "min-installments",
              "Minimum 6 installments required based on SIP Interval and Term Type",
              function (value) {
                const { sip_interval, sip_term_type } = this.parent;

                let minimumTerm;

                if (sip_term_type === "Months") {
                  switch (sip_interval) {
                    case "Monthly":
                      minimumTerm = 6;
                      break;
                    case "Quarterly":
                      minimumTerm = 18;
                      break;
                    case "Half_Yearly":
                      minimumTerm = 36;
                      break;
                    case "Annually":
                      minimumTerm = 72;
                      break;
                    default:
                      return true;
                  }
                } else if (sip_term_type === "Years") {
                  switch (sip_interval) {
                    case "Monthly":
                      minimumTerm = 1;
                      break;
                    case "Quarterly":
                      minimumTerm = 2;
                      break;
                    case "Half_Yearly":
                      minimumTerm = 3;
                      break;
                    case "Annually":
                      minimumTerm = 6;
                      break;
                    default:
                      return true;
                  }
                } else {
                  return true;
                }

                return value >= minimumTerm;
              }
            );
        } else {
          return schema.nullable();
        }
      }),

      citizenship: yup.mixed().required("Document File is required"),
      holder_type: yup.string().required().label("Holder Type"),
    })
    .required();

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    register,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      distributionCenter: "Navya Advisors",
      schemeName: "Navya Large Cap Fund",
      boid: "",
      email: "",
      phone: "",
      full_name: "",
      // amount: 1000,
      sip_model: "Limited",
      sip_interval: "Monthly",
      // sip_term: 0,
      reinvestment: true,
      sip_term_type: "Years",
      citizenship: null,
      holder_type: "resident_natural_person",
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const maxValue = 10000;

  const handleReset = () => {
    reset();
  };

  const holderType = watch("holder_type");
  const sipModul = watch("sip_model");

  const onSubmit: SubmitHandler<SipEntryInput> = (data) => {
    const FinalData = {
      boid_no: data.boid,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      amount: data.amount,
      enrolled_drep: data.reinvestment,
      sip_model: data.sip_model,

      // sip_interval: sipModul === "Limited" ? data.sip_interval : null,
      sip_interval: data.sip_interval,
      sip_term: sipModul === "Limited" ? data.sip_term : null,
      sip_term_type: sipModul === "Limited" ? data.sip_term_type : null,
      sip_end_date: sipModul === "Limited" ? endDate : null,

      sip_start_date: startDate,
      citizen_file_upload: data.citizenship,
      holder_type: data.holder_type ? data?.holder_type : "",
    };

    sipRegEntryMutate(FinalData, {
      onSuccess: () => {
        setMessage("SIP Entry Successfully Added");
        setSnackbarOpen(true);
        reset();
      },
      onError: (error) => {
        setSnackbarErrorOpen(true);
        if (axios.isAxiosError(error) && error?.response) {
          setErrorMsg(
            error?.response?.data?.message ||
              error?.response?.data?.detail ||
              "Error occurred while SIP Registration"
          );
        } else {
          setErrorMsg("An unexpected error occurred");
        }
      },
    });
  };

  const watchSipModel = watch("sip_model");
  const term = watch("sip_term");
  const termType = watch("sip_term_type");
  const citizenship = watch("citizenship") as SipEntryInput["citizenship"];

  useEffect(() => {
    if (term && termType === "Years") {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + Number(term));
      const formattedDate = futureDate.toISOString().split("T")[0];
      setEndDate(formattedDate);
    } else if (term && termType === "Months") {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + Number(term));
      const formattedDate = futureDate.toISOString().split("T")[0];
      setEndDate(formattedDate);
      // setEndDate(futureDate)
    }
  }, [watchSipModel, term, termType]);

  // Set the boid data from ownerinformation component
  const handleBoidChange = (boid: string) => {
    setBoidNo(boid);
  };

  useEffect(() => {
    if (
      boidSearchData?.responseData?.results.length === 1 &&
      boidNo.length === 16
    ) {
      setValue(
        "full_name",
        boidSearchData?.responseData?.results[0]?.full_name
      );
      setValue("email", boidSearchData?.responseData?.results[0]?.email);
      setValue("phone", boidSearchData?.responseData?.results[0]?.phone);
    }
    if (
      boidNo.length !== 16 ||
      boidSearchData?.responseData?.results.length === 0
    ) {
      setValue("full_name", "");
      setValue("email", "");
      setValue("phone", "");
    }
  }, [boidNo, boidSearchData, setValue]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Box>
        <DistributionSchemeField
          label1="Distribution Center"
          control={control}
        />
      </Box>

      {/* <Box>
        <DateField dateLabel1="Start Date" />
      </Box> */}

      <Box mt={1} sx={{ width: { lg: "80%" } }}>
        <ImportButton mode="sip_registration" />

        <OwnerInformation
          header
          control={control}
          errors={errors}
          onBoidChange={handleBoidChange}
        />
      </Box>
      <Box sx={{ width: { lg: "80%" } }}>
        <Stack spacing={2}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "12px",
              border: `1px solid ${theme.palette.primary.dark}`,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{}}>
                <Typography
                  sx={{
                    lineHeight: "17px",
                    borderBottom: 1,
                    borderColor: theme.palette.primary.dark,
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#000000",
                    padding: 1,
                  }}
                >
                  SIP Entry
                </Typography>
              </Box>

              <Box
                sx={{ p: 1, display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
              >
                <Box sx={{ flexBasis: "calc(33% - 0.5rem)" }}>
                  <TypographyLabel title="Full Name" />

                  <Controller
                    name="full_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        // required
                        fullWidth
                        size="small"
                        placeholder="Name"
                        {...field}
                        error={Boolean(errors.full_name)}
                        helperText={errors?.full_name?.message}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flexBasis: "calc(33% - 0.5rem)" }}>
                  <TypographyLabel title="Email ID" />
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        // required
                        size="small"
                        // type="email"
                        placeholder="Email ID"
                        error={Boolean(errors.email)}
                        helperText={errors?.email?.message}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flexBasis: "calc(33% - 0.5rem)" }}>
                  <TypographyLabel title="Contact Number" />
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        // required
                        fullWidth
                        size="small"
                        type="phone"
                        placeholder="Phone Number"
                        error={Boolean(errors.phone)}
                        helperText={errors?.phone?.message}
                      />
                    )}
                  />
                </Box>
                <Box sx={{ flexBasis: "calc(33% - 0.5rem)" }}>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <TypographyLabel title="Holder Type" />
                  </Box>

                  <Controller
                    name="holder_type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        fullWidth
                        required
                        size="small"
                        onChange={(value) => field.onChange(value)}
                      >
                        <MenuItem value="resident_natural_person">
                          Resident Natural Person
                        </MenuItem>
                        <MenuItem value="resident_institution">
                          Resident Institution
                        </MenuItem>
                        <MenuItem value="others">Others</MenuItem>
                      </Select>
                    )}
                  />
                </Box>

                <Box sx={{ flexBasis: "calc(33% - 0.5rem)" }}>
                  <TypographyLabel title="Amount" />
                  <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        // required
                        size="small"
                        type="number"
                        inputProps={{
                          min: 1000,
                        }}
                        placeholder="Amount"
                        error={Boolean(errors.amount)}
                        helperText={errors?.amount?.message}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flexBasis: "calc(33% - 0.5rem)" }}>
                  <TypographyLabel title="Interval" />

                  <Controller
                    name="sip_interval"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        fullWidth
                        required
                        size="small"
                        defaultValue="Monthly"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setValue("sip_term", 0);
                        }}
                      >
                        <MenuItem value="Monthly">Monthly</MenuItem>
                        <MenuItem value="Quarterly">Quarterly</MenuItem>
                        <MenuItem value="Half_Yearly">Half Yearly</MenuItem>
                        <MenuItem value="Annually">Annually</MenuItem>
                      </Select>
                    )}
                  />
                </Box>

                <Box sx={{ flexBasis: "calc(33% - 0.5rem)" }}>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <TypographyLabel title="Model" />
                  </Box>

                  <Controller
                    name="sip_model"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        fullWidth
                        required
                        size="small"
                        defaultValue="Limited"
                        onChange={(value) => field.onChange(value)}
                      >
                        <MenuItem value="Limited">Limited</MenuItem>
                        <MenuItem value="Unlimited">Unlimited</MenuItem>
                      </Select>
                    )}
                  />
                </Box>

                {/* <Box sx={{ flexBasis: "calc(33% - 0.5rem)" }}>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <TypographyLabel title="Payment Type" />
                  </Box>

                  <Controller
                    name="payment_method"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        fullWidth
                        required
                        size="small"
                        defaultValue="cash"
                        onChange={(value) => field.onChange(value)}
                      >
                        <MenuItem value="cash">Cash</MenuItem>
                        <MenuItem value="bank">Bank</MenuItem>
                        <MenuItem value="ESewa">ESewa</MenuItem>
                        <MenuItem value="Khalti">Khalti</MenuItem>
                        <MenuItem value="connect_ips">Connect IPS</MenuItem>
                        <MenuItem value="fonepay">Fonepay</MenuItem>
                      </Select>
                    )}
                  />
                </Box> */}

                {watch("sip_model") === "Limited" && (
                  <>
                    <Box sx={{ flexBasis: "calc(33% - 0.5rem)" }}>
                      <TypographyLabel title="Term" />
                      <Box sx={{ display: "flex", gap: "0.5rem" }}>
                        <Controller
                          name="sip_term"
                          control={control}
                          rules={{
                            max: {
                              value: maxValue,
                              message: `Value must be less than or equal to ${maxValue}`,
                            },
                          }}
                          render={({ field }) => (
                            <TextField
                              {...register("sip_term")}
                              {...field}
                              inputProps={{
                                max: { maxValue },
                              }}
                              size="small"
                              type="number"
                              placeholder="Term"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || Number(value) <= maxValue) {
                                  field.onChange(value);
                                }
                              }}
                            />
                          )}
                        />

                        <Controller
                          name="sip_term_type"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...register("sip_term_type")}
                              {...field}
                              defaultValue="Years"
                              size="small"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setValue("sip_term", 0);
                              }}
                            >
                              <MenuItem value="Years"> Years</MenuItem>
                              <MenuItem value="Months"> Months</MenuItem>
                            </Select>
                          )}
                        />
                      </Box>
                      {errors.sip_term && (
                        <Typography
                          sx={{ ml: 1, fontSize: "12px", color: "#d32f2f" }}
                        >
                          {errors.sip_term.message}
                        </Typography>
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        flexBasis: "calc(33% - 0.5rem)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "12px",
                            mt: "4px",
                            alignContent: "center",
                          }}
                        >
                          Total Duration
                        </Typography>
                        <TodayOutlinedIcon
                          sx={{
                            width: "14px",
                            height: "14px",
                          }}
                        />
                      </Box>
                      <Chip
                        label={
                          endDate.length > 0 && term
                            ? startDate + " - " + endDate
                            : "Set Term"
                        }
                        sx={{
                          width: "max-content",
                          backgroundColor: theme.palette.primary.light,
                          mt: 1,
                          "& .MuiChip-label": {
                            color: theme.palette.secondary[700],
                            fontSize: "0.9rem",
                          },
                        }}
                      />
                    </Box>
                  </>
                )}
              </Box>
              <Box sx={{ width: "50%", mt: 1, mx: 1 }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: theme.palette.secondary.darkGrey,
                  }}
                >
                  {holderType === "resident_institution"
                    ? "Company Document (Registration or PAN)"
                    : holderType === "others"
                    ? "Legal Document (Front and Back)"
                    : "Citizenship (Front and Back)"}
                </Typography>
                {/* <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 2,
                      mt: 0.5,
                    }}
                  > */}

                <Controller
                  control={control}
                  name="citizenship"
                  render={({ field: { value, onChange, ...field } }) => (
                    <Button
                      variant="outlined"
                      component="label"
                      // role={undefined}
                      sx={{
                        borderRadius: "100px",
                        width: "max-content",
                        height: "auto",
                        padding: "4px 8px",
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary[1100],
                        borderColor: "white",
                        textTransform: "none",
                      }}
                      // onClick={handleUploadFile}
                    >
                      {citizenship ? citizenship.name : "Choose File"}
                      <Input
                        {...field}
                        type="file"
                        // value={field.value?.name}
                        sx={{ display: "none" }}
                        // accept=" .pdf, .png, .jpg, .jpeg"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onChange(e.target.files[0])
                        }
                      />
                    </Button>
                  )}
                />
                <Typography sx={{ ml: 1, fontSize: "12px", color: "#d32f2f" }}>
                  {errors.citizenship && errors.citizenship.message}
                </Typography>

                {/* <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "12px",
                        textAlign: "center",
                        color: theme.palette.secondary[500],
                        mt: "10px",
                      }}
                    >
                      only .pdf
                    </Typography>
                  </Box> */}
              </Box>
              <Box sx={{ p: 1 }}>
                <FormControlLabel
                  control={
                    <Controller
                      name="reinvestment"
                      control={control}
                      render={({ field }) => (
                        <Checkbox defaultChecked {...field} />
                      )}
                    />
                  }
                  label="Check if the user wants to enroll for the Dividend Re-Investment Plan"
                />
              </Box>
            </Box>
          </Paper>
        </Stack>
      </Box>
      <Box>
        <RoundedButton title1="Submit" title2="Reset" onClick2={handleReset} />
      </Box>

      <SuccessBar
        snackbarOpen={snaackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        message={message}
      />

      <ErrorBar
        snackbarOpen={snackbarErrorOpen}
        setSnackbarOpen={setSnackbarErrorOpen}
        message={errorMsg}
      />
    </Box>
  );
};

export default SIPRegistrationEntry;
