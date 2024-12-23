import { useEffect, useState } from "react";

import {
  Box,
  Grid,
  Select,
  MenuItem,
  TextField,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import OwnerInformation from "components/OwnerInformation/OwnerInformation";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import RoundedButton from "components/Button/Button";
import { BankOptions } from "constants/BankData/BankData";
import { useForm } from "react-hook-form";
import SearchButton from "components/Button/SearchButton";
import { useGetSipByBoid } from "services/SIP/sipPostingServices";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Controller, useFieldArray } from "react-hook-form";

import EditIcon from "@mui/icons-material/Edit";
import { usePatchAmendmentRequest } from "services/SIP Amendment/SipAmendmentRequestServices";
import DateFormatter from "utils/DateFormatter";
import ErrorBar from "components/Snackbar/ErrorBar";
import SuccessBar from "components/Snackbar/SuccessBar";
import axios from "axios";

const CustomTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "16px",
}));

const CustomBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
}));

type searchData = {
  distributionCenter: string;
  schemeName: string;
  dp: string;
  boid: string;
  amount: string;
  model: string;
  interval: string;
  term: string;
  termType: string;
  end_date: string | null;
};

interface sipData {
  amount: string;
  applied_unit: number;
  boid_no: string;
  citizen_file_path: string;
  created_by: null;
  db_center: string | null;
  email: string;
  enrolled_drep: boolean;
  full_name: string;
  id: number;
  phone: string;
  ref_id: string;
  remarks: string;
  return_amount: string;
  scheme_name: string;
  share_holder_number: string;
  sip_end_date: string | null;
  sip_identifier: string;
  sip_interval: string | null;
  sip_model: string;
  sip_start_date: string;
  sip_status: string;
  sip_term: string | null;
  sip_term_type: string | null;
  time_period: string | null;
}

const AmendmentRequest = () => {
  const theme = useTheme();

  const [boid, setBoid] = useState("");
  const [sipDetails, setSipDetails] = useState<sipData>();
  const [editAmt, setEditAmt] = useState(false);
  const [editModel, setEditModel] = useState(false);
  const [editInterval, setEditInterval] = useState(false);
  const [editTerm, setEditTerm] = useState(false);
  const [editTermType, setEditTermType] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [successMsgs, setSuccessMsgs] = useState("");
  const [loadClicked, setLoadClicked] = useState(false);
  // const [isSearchTriggered, setIsSearchTriggered] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const {
    data: SipByBoidData,
    isSuccess: SipByBoidSuccess,
    refetch: sipByBoidRefetch,
  } = useGetSipByBoid(boid);

  const {
    mutate: amendmentRequestMutate,
    isSuccess: amendmentRequestMutateSuccess,
    isError: amendmentRequestMutateError,
  } = usePatchAmendmentRequest(sipDetails?.id);

  const schema = yup
    .object({
      distributionCenter: yup.string(),
      schemeName: yup.string(),
      dp: yup.string(),
      boid: yup.string().required().length(16).label("BOID"),
      amount: yup.string(),

      model: yup.string(),
      interval: yup.string().nullable(),
      termType: yup.string().nullable(),

      // term: yup.string().nullable()
      term: yup.string().when(["model"], ([model], schema) => {
        return model === "Limited"
          ? schema
              // .required('SIP term is required for Limited module')
              .typeError("SIP term must be a number")
              .test(
                "min-installments",
                "Minimum 6 installments required based on SIP Interval and Term Type",
                function (value) {
                  const { interval, termType } = this.parent;

                  let minimumTerm;

                  if (termType === "Months") {
                    switch (interval) {
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
                  } else if (termType === "Years") {
                    switch (interval) {
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
              )
          : schema.nullable();
      }),

      end_date: yup.string().nullable(),
    })
    .required();

  const {
    control,
    reset,
    handleSubmit,
    register,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      distributionCenter: "Navya Advisors",
      schemeName: "Navya Large Cap Fund",
      dp: BankOptions[0],
      boid: "",
      amount: sipDetails?.amount || "",
      model: sipDetails?.sip_model || "",
      interval: sipDetails?.sip_interval || "",
      term: sipDetails?.sip_term || "",
      termType: sipDetails?.sip_term_type || "",
      end_date: sipDetails?.sip_end_date || "",
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  console.log(errors, "errors");
  const model = watch("model");
  console.log(model, "model");

  const maxValue = 10000;
  // const { replace } = useFieldArray({ name: 'amount' })

  // const handleSubmit = () => {
  //     console.log("subgmit clicked")
  // }

  useEffect(() => {
    if (SipByBoidSuccess && hasSearched) {
      if (
        (loadClicked && !SipByBoidData?.responseData?.results) ||
        SipByBoidData?.responseData?.results?.length === 0
      ) {
        setErrorMsgs(
          "There is no SIP Amendment Request Available for the given BOID."
        );
        setSnackbarErrorOpen(true);
      }
    }
  }, [SipByBoidSuccess, loadClicked, hasSearched, SipByBoidData]);

  const handleReset = () => {
    reset({
      distributionCenter: "Navya Advisors",
      schemeName: "NAVYA LARGE CAP FUND",
      dp: BankOptions[0],
      boid: "",
      amount: sipDetails?.amount || "",
      model: sipDetails?.sip_model || "",
      interval: sipDetails?.sip_interval || "",
      term: sipDetails?.sip_term || "",
      termType: sipDetails?.sip_term_type || "",
      end_date: sipDetails?.sip_end_date || "",
    });

    setEditAmt(false);
    setEditModel(false);
    setEditInterval(false);
    setEditTerm(false);
    setEditTermType(false);
  };

  const handleSearch = (data: searchData) => {
    setBoid(data.boid);
    // setIsSearchTriggered(true);
    setHasSearched(true);
    sipByBoidRefetch();
  };

  const amendmentSubmit = (data: searchData) => {
    const tempData = {
      sip_model: data?.model,
      amount: data?.amount,
      sip_interval: data?.interval,
      ...(data.model === "Limited" && {
        sip_term: data?.term,
        sip_term_type: data?.termType,
        sip_end_date: endDate,
      }),
    };

    amendmentRequestMutate(tempData, {
      onSuccess: () => {
        handleReset();
        setSuccessMsgs("Amendment Request has been submitted.");
        setSnackbarSuccessOpen(true);
      },
      onError: (error) => {
        console.log(error, "error");
        setSnackbarErrorOpen(true);
        if (axios.isAxiosError(error) && error.response) {
          setErrorMsgs(
            error.response.data.details
              ? error.response.data.details[0]
              : "An error occurred while submitting the Amendment Request."
          );
        } else {
          setErrorMsgs(
            "An error occurred while submitting the Amendment Request."
          );
        }
      },
    });
  };

  useEffect(() => {
    if (boid) {
      sipByBoidRefetch();
    }
  }, [boid]);

  const handleViewDetails = (sip: sipData) => {
    setSipDetails(sip);
    setValue("amount", sip.amount);
    setValue("model", sip.sip_model);
    setValue("interval", sip.sip_interval);
    setValue("term", sip.sip_term);
    setValue("termType", sip.sip_term_type);
    setValue("end_date", sip.sip_end_date);
  };

  // const end_date =  sipDetails?.sip_term_type === "Years" ? DateFormatter.format(
  //     new Date(
  //       new Date(sipDetails?.sip_start_date).setFullYear(
  //         new Date(sipDetails?.sip_start_date).getFullYear() +
  //           parseInt(sipDetails?.sip_term)
  //       )
  //     ).toString()
  //   ) : DateFormatter.format(
  //     new Date(
  //       new Date(sipDetails?.sip_start_date).setMonth(
  //         new Date(sipDetails?.sip_start_date).getMonth() +
  //           parseInt(sipDetails?.sip_term)
  //       )
  //     ).toString()
  //   )

  const term = watch("term");
  const termType = watch("termType");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (term && termType === "Years") {
      const futureDate = new Date(sipDetails?.sip_start_date);
      futureDate.setFullYear(futureDate.getFullYear() + Number(term));
      const formattedDate = futureDate.toISOString().split("T")[0];
      setEndDate(formattedDate);
    } else if (term && termType === "Months") {
      const futureDate = new Date(sipDetails?.sip_start_date);
      futureDate.setMonth(futureDate.getMonth() + Number(term));
      const formattedDate = futureDate.toISOString().split("T")[0];
      setEndDate(formattedDate);
      // setEndDate(futureDate)
    }
  }, [model, sipDetails?.sip_start_date, term, termType]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Box sx={{ width: "83.5%" }}>
        <DistributionSchemeField
          label1="Distribution Center"
          control={control}
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

      <Box
        component="form"
        onSubmit={handleSubmit(handleSearch)}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ flex: 100 }}>
          <OwnerInformation control={control} errors={errors} searchButton />
        </Box>
      </Box>

      {hasSearched &&
      boid &&
      SipByBoidData?.responseData?.results?.length > 0 ? (
        <Grid
          container
          rowGap={2}
          columnGap={3}
          sx={{
            mt: 2,
            flexGrow: 1,
            p: 2,
            width: "110%",
            borderRadius: "8px",
            border: `2px solid ${theme.palette.primary.dark}`,
          }}
        >
          {SipByBoidData?.responseData?.results.map((sip: sipData) => (
            <Grid item key={sip.id} xs={5.75}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    borderBottom: `2px solid ${theme.palette.primary[1100]}`,
                  }}
                >
                  SIP No. {sip.id}
                </Typography>
                <Typography
                  onClick={() => handleViewDetails(sip)}
                  sx={{
                    color: theme.palette.primary[1100],
                    alignSelf: "flex-end",
                    "&:hover": {
                      cursor: "pointer",
                      textDecoration: "underline",
                    },
                  }}
                >
                  View Details
                </Typography>
              </Box>
              <Box
                sx={{
                  mt: 0.3,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontWeight: 500 }}>Amount</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  Rs. {sip.amount}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>
          <ErrorBar
            snackbarOpen={snackbarErrorOpen}
            setSnackbarOpen={setSnackbarErrorOpen}
            message={errorMsgs}
          />
        </Box>
      )}

      {sipDetails?.id && (
        <Box component="form" onSubmit={handleSubmit(amendmentSubmit)}>
          <Box
            sx={{
              width: "110%",
              borderRadius: "8px",
              border: `2px solid ${theme.palette.primary.dark}`,
            }}
          >
            <Box sx={{ p: 1 }}>
              <Typography sx={{ fontWeight: "500" }}>
                {" "}
                SIP Registration No. {sipDetails.id} Details
              </Typography>
            </Box>

            <Divider
              sx={{
                width: "100%",
                backgroundColor: `${theme.palette.primary.dark}`,
              }}
            />

            <Grid
              container
              spacing={1}
              sx={{
                p: 1,
              }}
            >
              <Grid item xs={4}>
                <CustomTypography> Full Name</CustomTypography>
                <Typography>{sipDetails.full_name}</Typography>
              </Grid>

              <Grid item xs={4}>
                <CustomTypography> Email </CustomTypography>
                <Typography>{sipDetails.email}</Typography>
              </Grid>

              <Grid item xs={4}>
                <CustomTypography> Contact Number </CustomTypography>
                <Typography>{sipDetails.phone}</Typography>
              </Grid>

              <Grid item xs={4}>
                <CustomTypography> Start Date </CustomTypography>
                <Typography>{sipDetails.sip_start_date}</Typography>
              </Grid>

              {/*editable field*/}
              <Grid item xs={4}>
                <CustomBox>
                  <CustomTypography> Amount </CustomTypography>
                  {!editAmt && (
                    <IconButton onClick={() => setEditAmt(true)}>
                      <EditIcon sx={{ fontSize: "18px", color: "#000" }} />
                    </IconButton>
                  )}
                </CustomBox>
                {editAmt ? (
                  <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        // required
                        size="small"
                        type="number"
                        inputProps={{
                          min: 1000,
                        }}
                        error={Boolean(errors.amount)}
                        helperText={errors?.amount?.message}
                      />
                    )}
                  />
                ) : (
                  <Typography>{sipDetails.amount}</Typography>
                )}
              </Grid>

              <Grid item xs={4}>
                <CustomBox>
                  <CustomTypography> Interval </CustomTypography>
                  {!editInterval && (
                    <IconButton onClick={() => setEditInterval(true)}>
                      <EditIcon sx={{ fontSize: "18px", color: "#000" }} />
                    </IconButton>
                  )}
                </CustomBox>
                {editInterval ? (
                  <Controller
                    name="interval"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        fullWidth
                        required
                        size="small"
                        defaultValue="Monthly"
                        onChange={(value) => field.onChange(value)}
                      >
                        <MenuItem value="Monthly">Monthly</MenuItem>
                        <MenuItem value="Quarterly">Quarterly</MenuItem>
                        <MenuItem value="Half_Yearly">Half Yearly</MenuItem>
                        <MenuItem value="Annually">Annually</MenuItem>
                      </Select>
                    )}
                  />
                ) : (
                  <Typography>{sipDetails.sip_interval}</Typography>
                )}
              </Grid>

              <Grid item xs={4}>
                <CustomBox>
                  <CustomTypography> Model </CustomTypography>
                  {!editModel && (
                    <IconButton onClick={() => setEditModel(true)}>
                      <EditIcon sx={{ fontSize: "18px", color: "#000" }} />
                    </IconButton>
                  )}
                </CustomBox>
                {editModel ? (
                  <Controller
                    name="model"
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
                ) : (
                  <Typography>{sipDetails.sip_model}</Typography>
                )}
              </Grid>

              {model === "Limited" && (
                <>
                  <Grid item xs={4}>
                    <CustomBox>
                      <CustomTypography> Term </CustomTypography>
                      {!editTerm && (
                        <IconButton onClick={() => setEditTerm(true)}>
                          <EditIcon sx={{ fontSize: "18px", color: "#000" }} />
                        </IconButton>
                      )}
                    </CustomBox>
                    {editTerm ? (
                      <>
                        <Box sx={{ display: "flex", gap: "0.5rem" }}>
                          <Controller
                            name="term"
                            control={control}
                            rules={{
                              max: {
                                value: maxValue,
                                message: `Value must be less than or equal to ${maxValue}`,
                              },
                            }}
                            render={({ field }) => (
                              // <TextField
                              //   {...field}
                              //   size="small"
                              //   type="number"
                              //   placeholder="Term"
                              // />
                              <TextField
                                {...register("term")}
                                {...field}
                                inputProps={{
                                  max: { maxValue },
                                }}
                                size="small"
                                type="number"
                                placeholder="Term"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    value === "" ||
                                    Number(value) <= maxValue
                                  ) {
                                    field.onChange(value);
                                  }
                                }}
                              />
                            )}
                          />

                          <Controller
                            name="termType"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                defaultValue="Years"
                                size="small"
                                onChange={(value) => field.onChange(value)}
                              >
                                <MenuItem value="Years"> Years</MenuItem>
                                <MenuItem value="Months"> Months</MenuItem>
                              </Select>
                            )}
                          />
                        </Box>
                      </>
                    ) : (
                      <Typography>
                        {sipDetails.sip_term ?? "-"}{" "}
                        {sipDetails.sip_term_type ?? "-"}
                      </Typography>
                    )}
                    {errors.term && (
                      <Typography
                        sx={{ ml: 1, fontSize: "12px", color: "#d32f2f" }}
                      >
                        {errors.term.message}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={4}>
                    <CustomBox>
                      <CustomTypography> End Date </CustomTypography>
                    </CustomBox>
                    <Typography sx={{ mt: 0.5 }}>{endDate}</Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>

          <RoundedButton
            title1="Submit"
            onClick1={handleSubmit}
            title2="Reset"
            onClick2={handleReset}
          />
        </Box>
      )}
    </Box>
  );
};

export default AmendmentRequest;
