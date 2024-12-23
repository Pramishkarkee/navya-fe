import React, { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLoginMutation } from "services/Auth/AuthServices";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Logo from "../assets/Logo.svg";
import Background from "../assets/Background.svg";

import RoundedButton from "../components/Button/Button";
import SuccessBar from "../components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import { isAxiosError } from "axios";

export interface LoginData {
  username: string;
  password: string;
}

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const theme = useTheme();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutate: AuthMutation, isPending } = useLoginMutation();

  const handleLogin = async (data: LoginData) => {

    const payload = {
      username: data?.username,
      password: btoa(data?.password),
    };

    AuthMutation(payload, {
      onSuccess: () => {
        setSuccessMessage("Login Successful!");
        setOpenError(false);
        setOpenSuccess(true);
      },
      onError: (error) => {
        if (isAxiosError(error) && error.response) {
          console.log("object", error.response.data.responseData);
          setErrorMessage(
            error.response.data.responseData
              ? error.response.data.responseData.detail
              : `Error Occured while logging in.`
          );
          setOpenError(true);
        }
      },
    });
  };

  return (
    <>
      <Box>
        <SuccessBar
          snackbarOpen={openSuccess}
          setSnackbarOpen={setOpenSuccess}
          message={successMessage}
        />
        <ErrorBar
          snackbarOpen={openError}
          setSnackbarOpen={setOpenError}
          message={errorMessage}
        />
      </Box>
      <form onSubmit={handleSubmit(handleLogin)}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundImage: `url(${Background})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundColor: theme.palette.primary.light,
          }}
        >
          <Box
            sx={{
              py: 4,
              px: 8,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "400px",
              backgroundColor: "#fff",
              borderRadius: "10px",
            }}
          >
            <Box sx={{ alignSelf: "center" }}>
              <img src={Logo} />
            </Box>
            <Box>
              <Typography
                sx={{ color: theme.palette.secondary.main, fontWeight: 600 }}
              >
                Login to your account
              </Typography>
            </Box>

            <Controller
              name="username"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  fullWidth
                  placeholder="Username"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  size="small"
                  fullWidth
                  placeholder="Password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />

            <Box sx={{ alignSelf: "center" }}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <RoundedButton title1="Login" loading={isPending} />
              </Box>
            </Box>
          </Box>
        </Box>
      </form>
    </>
  );
};

export default Login;
