import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import RoundedButton from "components/Button/Button";
import { useCreateUserMutataion } from "services/UserManagement/CreateUserServices";
import {
  useGetUserRoleDetails,
  useGetUserRoles,
} from "services/Roles/RolesServices";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import axios from "axios";

const schema = yup
  .object({
    username: yup.string().required().label("Username"),
    full_name: yup.string().required().label("Fullname"),
    email: yup.string().required().label("Email"),
    branch: yup.string().required().label("Branch"),
    phone_number: yup
      .string()
      .required()
      .test("len", "Invalid phone number. Digits Must be 10 ", (value) => {
        const phone = value.replace(/[^0-9.]/g, "");
        return phone.length === 10;
      })
      .matches(/^9[87]\d{8}$/, "Phone number must start with 98 or 97")
      .label("Phone Number"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    confirm_password: yup
      .string()
      .required("please confirm your password")
      .oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();

export interface UserFormInput {
  username: string;
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone_number: string;
  branch: string;
}

const CreateUsersIndex = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<UserFormInput>({
    resolver: yupResolver<any>(schema),
    defaultValues: {
      username: "",
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_number: "",
      branch: "Thapathali",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [checked, setChecked] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [checkedRoles, setCheckedRoles] = useState(null);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const theme = useTheme();

  const {
    mutate: createUserMutate,
    error: userCreateErrorData,
    isSuccess: userCreateSuccess,
  } = useCreateUserMutataion();

  const { data: userRolesData } = useGetUserRoles();
  const { data: userRolesList } = useGetUserRoleDetails();

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleConfirmShowPassword = () => {
    setConfirmShowPassword((show) => !show);
  };

  const handleCheckboxChange = (roles) => {
    const index = selectedRoles.findIndex(
      (selectedRole) => selectedRole.id === roles.id
    );
    if (index !== -1) {
      // setSelectedRoles(
      //   selectedRoles.filter((selectedRole) => selectedRole.id !== roles.id)
      // );
      // setChecked(checked.filter((id) => id !== roles.id));
      setSelectedRoles([]);
      setChecked([]);
      setCheckedRoles(null);
    } else {
      setSelectedRoles([roles]);
      setChecked([roles.id]);
      setCheckedRoles(roles.id);
    }
  };

  const handleCreateUser = (data: UserFormInput) => {
    const finalData = {
      username: data.username,
      full_name: data.full_name,
      email: data.email,
      password: data.password,
      confirm_password: data.confirm_password,
      phone_number: data.phone_number,
      branch: data.branch,
      role_id: checkedRoles,
    };
    createUserMutate(finalData, {
      onSuccess: () => {
        setSuccessMessage("User Created Successfully.");
        setSuccessSnackbarOpen(true);
        setCheckedRoles(null);
        reset();
        setSelectedRoles([]);
        setChecked([]);
        setCheckedRoles(null);
      },
      onError: (userCreateErrorData) => {
        setErrorSnackbarOpen(true);

        const errorMessage = axios.isAxiosError(userCreateErrorData) && userCreateErrorData?.response
          ? (() => {
            const errorData = userCreateErrorData.response.data;
            const errorMessages = [];

            errorData?.email
              ? errorMessages.push(`Email: ${errorData.email.join(", ")}`)
              : errorData?.password
                ? errorMessages.push(`Password: ${errorData.password.join(", ")}`)
                : errorData?.confirm_password
                  ? errorMessages.push(`Confirm Password: ${errorData.confirm_password.join(", ")}`)
                  : errorData?.non_field_errors
                    ? errorMessages.push(`${errorData.non_field_errors.join(", ")}`)
                    : errorData?.role_id
                      ? errorMessages.push(`Role: ${errorData.role_id.join(", ")}`)
                      : errorMessages.push("An unknown error occurred.");

            return errorMessages.join(" | ");
          })()
          : "Error occurred while creating user.";

        setErrorMessage(errorMessage);
        setErrorSnackbarOpen(true);
      }

      ,

    });
  };

  const handleReset = () => {
    reset();
    setSelectedRoles([]);
    setChecked([]);
    setCheckedRoles(null);
  };

  // useEffect(() => {
  //   if (isSubmitSuccessful && userCreateSuccess) {
  //     reset();
  //     setSelectedRoles([]);
  //     setChecked([]);
  //     setCheckedRoles(null);
  //   }
  // }, [isSubmitSuccessful, reset, userCreateSuccess]);

  // useEffect(() => {
  //   if (userCreateSuccess) {
  //     setSuccessMessage("User Created Successfully.");
  //     setSuccessSnackbarOpen(true);
  //     setCheckedRoles(null);
  //   }
  // }, [userCreateSuccess]);

  // useEffect(() => {
  //   if (userCreateErrorData) {
  //     if (
  //       axios.isAxiosError(userCreateErrorData) &&
  //       userCreateErrorData?.response
  //     ) {
  //       setErrorMessage(
  //         `${
  //           userCreateErrorData?.response?.data?.email
  //             ? userCreateErrorData?.response?.data?.email
  //             : userCreateErrorData?.response?.data?.role_id
  //             ? userCreateErrorData?.response?.data?.role_id
  //             : userCreateErrorData?.response?.data?.phone_number
  //         }`
  //       );
  //     } else {
  //       // Handle generic error cases
  //       setErrorMessage("Error occurred while creating user.");
  //     }
  //     setErrorSnackbarOpen(true);
  //   }
  // }, [userCreateErrorData]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleCreateUser)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: { xs: "100%", sm: "80%", md: "100%", lg: "70%" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          width: { xs: "100%", sm: "80%", md: "100%", lg: "200%" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box>
            <HeaderDesc title="New User Information" />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
              }}
            >
              <Box>
                <TypographyLabel title="Create Username" />
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      placeholder="Username"
                      error={Boolean(errors.username)}
                      helperText={errors.username && errors.username.message}
                    />
                  )}
                />
              </Box>
              <Box>
                <TypographyLabel title="Create Password" />
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      size="small"
                      placeholder="********"
                      error={Boolean(errors.password)}
                      helperText={errors.password && errors.password.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleShowPassword}>
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Box>
              <Box>
                <TypographyLabel title="Confirm Password" />
                <Controller
                  name="confirm_password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type={confirmShowPassword ? "text" : "password"}
                      size="small"
                      placeholder="********"
                      error={Boolean(errors.confirm_password)}
                      helperText={
                        errors.confirm_password &&
                        errors.confirm_password.message
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleConfirmShowPassword}>
                              {confirmShowPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
              }}
            >
              {/* <Box>
                <HeaderDesc title="" />
              </Box> */}
              <Box>
                <TypographyLabel title="Full name" />
                <Controller
                  name="full_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      placeholder="Full Name"
                      error={Boolean(errors.full_name)}
                      helperText={errors.full_name && errors.full_name.message}
                    />
                  )}
                />
              </Box>
              <Box>
                <TypographyLabel title=" Email" />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="email"
                      size="small"
                      placeholder="Email"
                      error={Boolean(errors.email)}
                      helperText={errors.email && errors.email.message}
                    />
                  )}
                />
              </Box>
              <Box>
                <TypographyLabel title="Phone Number" />
                <Controller
                  name="phone_number"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      placeholder="********"
                      error={Boolean(errors.phone_number)}
                      helperText={
                        errors.phone_number && errors.phone_number.message
                      }
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            // width: "100%",
          }}
        >
          <HeaderDesc title="Branch Information" />
          <Box sx={{ width: "150%" }}>
            <TypographyLabel title="Branch" />
            <Controller
              name="branch"
              control={control}
              render={({ field }) => (
                <Select {...field} size="small" fullWidth>
                  <MenuItem value="Thapathali">Thapathali Branch</MenuItem>
                  <MenuItem value="Durbarmarg">Durbarmarg Branch</MenuItem>
                  <MenuItem value="Naxal">Naxal Branch</MenuItem>
                </Select>
              )}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: { sm: "130%", md: "100%", lg: "115%", xl: "110%" } }}>
        <Stack spacing={2}>
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              borderRadius: "12px",
              border: `1px solid ${theme.palette.primary.dark}`,
            }}
          >
            <Box>
              <Box>
                <Typography
                  sx={{
                    lineHeight: "17px",
                    borderBottom: `1px solid ${theme.palette.primary.dark}`,
                    fontSize: "14px",
                    fontWeight: 500,
                    color: theme.palette.secondary[1000],
                    padding: 1,
                  }}
                >
                  Role Details
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
                <Box sx={{ width: "50%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      padding: 2,
                      width: "100%",
                    }}
                  >
                    <HeaderDesc title="Assign Roles" />
                    {/* <TextField
                      size="small"
                      placeholder="Search"
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: "28px",
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="search"
                              size="small"
                              onClick={handleSearch}
                            >
                              <SearchOutlinedIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    /> */}
                  </Box>
                  <Box
                    sx={{
                      mb: 2,
                      maxHeight: 350,
                      overflow: "auto",
                    }}
                  >
                    <List>
                      {userRolesList?.responseData?.data?.results?.map(
                        (roles, index) => (
                          <Box key={index}>
                            <ListItem
                              id={roles.id}
                              sx={{ padding: "0 0 0 16px" }}
                            >
                              <ListItemText
                                sx={{
                                  color: theme.palette.secondary[1000],
                                  textTransform: "none",
                                }}
                                primary={roles.role_description}
                              />
                              <ListItemIcon>
                                <Checkbox
                                  edge="end"
                                  // checked={checked.indexOf(roles.id) !== -1}
                                  checked={selectedRoles.some(
                                    (selectedRole) =>
                                      selectedRole.id === roles.id
                                  )}
                                  sx={{ padding: "0" }}
                                  onChange={() => handleCheckboxChange(roles)}
                                />
                              </ListItemIcon>
                            </ListItem>
                            {index !==
                              userRolesList?.responseData?.data?.results
                                ?.length -
                              1 && (
                                <Divider sx={{ margin: "0 24px 0 16px" }} />
                              )}
                          </Box>
                        )
                      )}
                    </List>
                  </Box>
                </Box>

                <Box>
                  <Divider orientation="vertical" sx={{}} />
                </Box>
                <Box sx={{ width: "50%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 1,
                      mt: 1,
                      padding: 1,
                    }}
                  >
                    <HeaderDesc title="Role Functions" />
                    <Box>
                      {selectedRoles?.length === 0 ? (
                        <Box mt={1}>
                          <Typography>No Role Selected</Typography>
                        </Box>
                      ) : (
                        <>
                          {selectedRoles[0]?.role_functions.length === 0 ? (
                            <Typography>
                              No Roles function for General Staff
                            </Typography>
                          ) : (
                            // <>
                            <List>
                              {selectedRoles[0]?.role_functions?.map(
                                (functionName) => (
                                  <Typography
                                    key={functionName}
                                    sx={{ fontSize: "16px", fontWeight: 500 }}
                                  >
                                    {functionName.charAt(0).toUpperCase() +
                                      functionName.slice(1)}
                                  </Typography>
                                  // <ListItem key={id} id={id} sx={{ padding: "0" }}>
                                  //   <ListItemText
                                  //     sx={{ color: theme.palette.secondary[1000] }}
                                  //     primary={
                                  //       userRolesList?.responseData?.data?.results?.find(
                                  //         (roles) => roles.id === id
                                  //       ).role_description
                                  //     }
                                  //   />
                                  // </ListItem>
                                )
                              )}
                            </List>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Stack>
      </Box>
      <Box>
        <RoundedButton
          disable={
            userRolesData && userRolesData?.responseData?.user
              ? !userRolesData?.responseData?.user?.admin_user_create
              : false
          }
          title1="Create User"
          title2="Reset"
          onClick2={handleReset}
        />
      </Box>
      <SuccessBar
        snackbarOpen={successSnackbarOpen}
        setSnackbarOpen={setSuccessSnackbarOpen}
        message={successMessage}
      />
      <ErrorBar
        snackbarOpen={errorSnackbarOpen}
        setSnackbarOpen={setErrorSnackbarOpen}
        message={errorMessage}
      />
    </Box>
  );
};

export default CreateUsersIndex;
