import { useState } from "react";

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
// import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import RoundedButton from "components/Button/Button";
import { RolesOptions } from "constants/RolesOptions/RolesOptions";
import { useCreateUserMutation } from "services/UserManagementServices/services/UserManagemenServices";

import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const schema = yup
  .object({
    username: yup.string().required().label("Username"),
    full_name: yup.string().required().label("Fullname"),
    branch: yup.string().required().label("Branch"),
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

type Data = {
  username: string;
  full_name: string;
  password: string;
  confirm_password: string;
  branch: string;
};

const CreateUsersIndex = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarError, setSnackbarError] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [checked, setChecked] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Data>({
    resolver: yupResolver<any>(schema),
    defaultValues: {
      username: "",
      full_name: "",
      password: "",
      confirm_password: "",
      branch: "Thapathali",
    },
  });
  const theme = useTheme();
  const {
    mutate,
    isSuccess: createUserSuccess,
    isError: createUserError,
  } = useCreateUserMutation();

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleConfirmShowPassword = () => {
    setConfirmShowPassword((show) => !show);
  };

  // useEffect(() => {
  //   if (createUserSuccess) {
  //     setSnackbarOpen(true)
  //     reset()
  //   }

  // }, [createUserSuccess])

  // useEffect(() => {

  //   if (createUserError) {
  //     setSnackbarError(true)

  //   }

  // }, [createUserError])

  const handleCreateUser = async (data: Data) => {
    // const data: Data = {
    //   username,
    //   password,
    //   confirm_password,
    // };
    mutate(data, {
      onSuccess: (data) => {
        setSnackbarOpen(true);
        reset();
      },
      onError: (error) => {
        // setSnackbarError(true)
        if (axios.isAxiosError(error) && error.response) {
          setSnackbarError(true);
          setErrorMessage(
            error.response.data.password
              ? error.response.data.password[0]
              : error.response.data.password
              ? error.response.data.password[1]
              : error.response.data.username
              ? error.response.data.username[0]
              : "Error in submitting data!"
          );
        }
      },
    });
  };

  // useEffect(() => {
  //   reset();
  // }, [isSubmitSuccessful]);

  const handleReset = () => {};

  //   const handleCheckboxChange = (value) => {
  //     const currentIndex = checked.indexOf(value);
  //     const newChecked = [...checked];
  //     if (currentIndex === -1) {
  //       newChecked.push(value);
  //     } else {
  //       newChecked.splice(value);
  //     }
  //     setChecked(newChecked);
  //   };

  const handleCheckboxChange = (roles: any) => {
    const index = selectedRoles.findIndex(
      (selectedRole) => selectedRole.id === roles.id
    );
    if (index !== -1) {
      setSelectedRoles(
        selectedRoles.filter((selectedRole) => selectedRole.id !== roles.id)
      );
      setChecked(checked.filter((id) => id !== roles.id));
    } else {
      setSelectedRoles([...selectedRoles, roles]);
      setChecked([...checked, roles.id]);
    }
  };

  return (
    <>
      {createUserSuccess && (
        <SuccessBar
          snackbarOpen={snackbarOpen}
          setSnackbarOpen={setSnackbarOpen}
          message="User Created Successfully"
        />
      )}
      {createUserError && (
        <ErrorBar
          snackbarOpen={snackbarError}
          setSnackbarOpen={setSnackbarError}
          message={errorMessage}
        />
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(handleCreateUser)}
        // onSubmit={handleSubmit(handleCreateUser)}
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
                        helperText={
                          errors.full_name && errors.full_name.message
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
        <Box sx={{ width: { sm: "130%", md: "90%", lg: "150%", xl: "130%" } }}>
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
                        {RolesOptions.map((roles, index) => (
                          <Box key={index}>
                            <ListItem
                              id={roles.label}
                              sx={{ padding: "0 0 0 16px" }}
                            >
                              <ListItemText
                                sx={{ color: theme.palette.secondary[1000] }}
                                primary={roles.label}
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
                            {index !== RolesOptions.length - 1 && (
                              <Divider sx={{ margin: "0 24px 0 16px" }} />
                            )}
                          </Box>
                        ))}
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
                      <HeaderDesc title="Current Roles" />
                      <Box>
                        {selectedRoles.length === 0 ? (
                          <Box mt={1}>
                            <Typography>No Roles Selected</Typography>
                          </Box>
                        ) : (
                          <List>
                            {checked.map((id) => (
                              <ListItem key={id} id={id} sx={{ padding: "0" }}>
                                <ListItemText
                                  sx={{ color: theme.palette.secondary[1000] }}
                                  primary={
                                    RolesOptions?.find(
                                      (roles) => roles.id === id
                                    ).label
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
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
            title1="Create User"
            title2="Reset"
            onClick1={handleCreateUser}
            onClick2={handleReset}
          />
        </Box>
      </Box>
    </>
  );
};

export default CreateUsersIndex;
