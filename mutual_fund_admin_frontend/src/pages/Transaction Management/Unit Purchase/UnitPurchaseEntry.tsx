import {
  Box,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
  Button,
  Divider,
  styled,
  Select,
  MenuItem,
} from "@mui/material";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import OwnerInformation from "components/OwnerInformation/OwnerInformation";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import RoundedButton from "components/Button/Button";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useUnitEntryMutation } from "services/Transaction Management/Unit Purchase/unitEntryServices";
import { useGetBOIDSearchResult } from "services/ShareHolderDetails/shareHolderDetails";

import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import ImportButton from "components/Button/ImportButton";
import { useGetNavValue } from "services/NavValue/NavValueServices";

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

export interface IUserEntryFormInputs {
  distributionCenter: string;
  schemeName: string;
  boid: string;
  full_name: string;
  contact_number: string;
  payment_method: string;
  email: string;
  applied_units: number;
  holder_type: string;
}

const UnitPurchaseEntry = () => {
  const theme = useTheme();
  const [citizenshipFile, setCitizenshipFile] = useState<File>();
  const [snaackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [boidNo, setBoidNo] = useState("");

  const { mutate: unitEntryDataMutate } = useUnitEntryMutation();

  const { data: BoidSearchData } = useGetBOIDSearchResult(boidNo, 1);

  const { data: navData, refetch: RefetchNavData } = useGetNavValue();

  const NAV_VALUE = navData?.responseData?.nav_value;
  const dpCharge = 5;

  const schema = yup
    .object({
      distributionCenter: yup.string().required(),
      schemeName: yup.string().required(),
      payment_method: yup.string(),
      boid: yup.string().required().length(16).label("BOID"),
      email: yup.string().required().email().label("Email"),
      // contact_number: yup
      //   .string()
      //   .required()
      //   .matches(/^[0-9]{9,10}$/, "Phone number must be 9 or 10 digits")
      //   .label("Contact Number"),
      contact_number: yup
        .string()
        .required()
        // .length(10)
        .label("Contact Number"),
      full_name: yup.string().required().label("Full Name"),
      holder_type: yup.string().required().label("Holder Type"),
      applied_units: yup
        .number()
        .required("Applied Units is required")
        .positive("Applied Units must be positive")
        .integer("Applied Units must be an integer")
        .typeError("Applied Units must be a number")
        .min(100)
        .max(250000)
        .label("Applied Units"),
    })
    .required();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      distributionCenter: "Navya Advisors",
      schemeName: "Navya Large Cap Fund",
      boid: "",
      full_name: "",
      contact_number: "",
      email: "",
      payment_method: "cash",
      holder_type: "resident_natural_person",
      applied_units: 0,
      // citizenship: citizenshipFile?.webkitRelativePath,
    },
    resolver: yupResolver(schema),
  });

  const appliedUnit = watch("applied_units");
  const holderType = watch("holder_type");

  const totalWithNav = Number(appliedUnit) * NAV_VALUE;

  const handleChangeAppliedUnit = async (e: any) => {
    RefetchNavData();
    const value = e.target.value;
    setValue("applied_units", value);
  };

  useEffect(() => {
    if (
      BoidSearchData?.responseData?.results?.length === 1 &&
      boidNo.length === 16
    ) {
      const data = BoidSearchData?.responseData?.results[0];
      setValue("full_name", data.full_name);
      setValue("email", data.email);
      setValue("contact_number", data.phone);
    }
    if (
      boidNo.length !== 16 ||
      BoidSearchData?.responseData?.results?.length === 0
    ) {
      setValue("full_name", "");
      setValue("email", "");
      setValue("contact_number", "");
    }
  }, [boidNo, BoidSearchData, setValue]);

  // const handleUploadFile = () => {
  //   console.log(" Choose File clicked!!!");
  // };

  const handlePurchaseEntry = async (data: IUserEntryFormInputs) => {
    const finalData: any = {
      boid_number: data.boid,
      full_name: data.full_name,
      email: data.email,
      contact_number: data.contact_number,
      distribution_center: data.distributionCenter,
      applied_units: data.applied_units,
      holder_type: data.holder_type ? data?.holder_type : "",
    };

    unitEntryDataMutate(finalData, {
      onSuccess: () => {
        setMessage("Unit Purchased Successfully");
        setSnackbarOpen(true);
        reset();
      },

      onError: (error) => {
        setSnackbarErrorOpen(true);
        if (axios.isAxiosError(error) && error?.response) {
          setErrorMsg(
            error?.response?.data?.message ||
              error?.response?.data?.detail ||
              "Error occurred while purchasing unit"
          );
        } else {
          setErrorMsg("An unexpected error occurred");
        }
      },
    });
  };

  const handleReset = () => {
    reset();
  };

  const handleChangeBoid = () => {
    return (boid: string) => {
      setBoidNo(boid);
    };
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handlePurchaseEntry)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 5 }}>
        <DistributionSchemeField
          label1="Distribution Center"
          control={control}
        />
      </Box>
      <Box>
        <ImportButton mode="unit_purchase" />
        <OwnerInformation
          header
          control={control}
          errors={errors}
          onBoidChange={handleChangeBoid()}
          // searchButton
          // onClickSearch={handleSearch}
        />
      </Box>

      <Box>
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
                  Existing Holder/New Holder
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <Box sx={{ flexBasis: "calc(50% - 0.5rem)" }}>
                  <TypographyLabel title="Name" />
                  <Controller
                    name="full_name"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        ref={null}
                        inputRef={field.ref}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        fullWidth
                        size="small"
                        placeholder="Name"
                        error={Boolean(errors.full_name)}
                        helperText={errors?.full_name?.message}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flexBasis: "calc(50% - 0.5rem)" }}>
                  <TypographyLabel title="Mobile Number" />
                  <Controller
                    name="contact_number"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        ref={null}
                        inputRef={field.ref}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        fullWidth
                        size="small"
                        type="tel"
                        placeholder="Contact Number"
                        error={Boolean(errors.contact_number)}
                        helperText={errors?.contact_number?.message}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flexBasis: "calc(50% - 0.5rem)" }}>
                  <TypographyLabel title="Email ID" />
                  <Controller
                    name="email"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        ref={null}
                        inputRef={field.ref}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        fullWidth
                        size="small"
                        type="email"
                        placeholder="Email ID"
                        error={Boolean(errors.email)}
                        helperText={errors?.email?.message}
                      />
                    )}
                  />
                </Box>

                {/* <Box sx={{ flexBasis: "calc(50% - 0.5rem)" }}>
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

                <Box sx={{ flexBasis: "calc(50% - 0.5rem)" }}>
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

                <Box>
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 2,
                      mt: 0.5,
                    }}
                  >
                    <Button
                      variant="outlined"
                      role={undefined}
                      component="label"
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
                      {citizenshipFile ? citizenshipFile.name : "Choose File"}
                      <VisuallyHiddenInput
                        type="file"
                        accept=" .pdf, .png, .jpeg, .jpg"
                        onChange={(e) => setCitizenshipFile(e.target.files[0])}
                        // onChange={(e) => {
                        //   if (e.target.files && e.target.files.length > 0) {
                        //     const files = e.target.files[0];
                        //     setCitizenshipFile({
                        //       name: files.name,
                        //       size: files.size,
                        //       type: files.type,
                        //       lastModified: files.lastModified,
                        //     });
                        //   }
                        // }}
                      />
                    </Button>
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
                      .pdf (less than ##mb)
                    </Typography> */}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Stack>
      </Box>

      {/* <Box>
          <BankDetails
            bankNameOptions={BankOptions}
            branchNameOptions={BankOptions}
          />
        </Box> */}
      <Box>
        <HeaderDesc title={"Application Details"} />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box>
            <TypographyLabel title={"Applied Unit"} />
            <Controller
              name="applied_units"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={handleChangeAppliedUnit}
                  fullWidth
                  size="small"
                  placeholder="No. of units"
                  error={Boolean(errors.applied_units)}
                  helperText={errors?.applied_units?.message}
                />
              )}
            />
          </Box>
        </Box>
        {appliedUnit > 0 && (
          <>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: theme.palette.primary.dark }}
            />

            <Paper
              elevation={0}
              sx={{
                width: "60%",
                height: "100%",
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary[1100],
                borderColor: "white",
                borderRadius: "20px",
                p: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "19px",
                  color: "#212121",
                  textAlign: "center",
                  width: "max-content",
                  borderBottom: `1px solid ${theme.palette.primary[1100]}`,
                  // padding: 1,
                }}
              >
                Details
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    // width: "100%",
                  }}
                >
                  <Typography>Total With NAV</Typography>
                  <Typography>{totalWithNav}</Typography>
                </Box>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    // width: "100%",
                  }}
                >
                  <Typography>DP Charge</Typography>
                  <Typography>{dpCharge}</Typography>
                </Box>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography>Total Required Amount</Typography>
                  <Typography>{totalWithNav + dpCharge}</Typography>
                </Box>
              </Box>
            </Paper>
          </>
        )}
      </Box>
      <Box>
        <RoundedButton
          title1="Submit"
          title2="Reset"
          // onClick1={handlePurchaseEntry}
          onClick2={handleReset}
        />
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

export default UnitPurchaseEntry;
