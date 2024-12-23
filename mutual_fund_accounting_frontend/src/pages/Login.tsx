import { useState } from "react";
import { isAxiosError } from "axios";
import { useTheme } from "@mui/material/styles";
import { Box, TextField, Typography } from "@mui/material";

//assets import
import Logo from "../assets/Logo.svg";
import Background from "../assets/Background.svg";

//react queries hooks
import ErrorBar from "components/Snackbar/ErrorBar";
import RoundedButton from "components/Button/Button";
import SuccessBar from "components/Snackbar/SuccessBar";
import { useLoginMutation } from "services/loginServices";

type LoginData = {
  username: string;
  password: string;
  encodedString?: string;
};

const Login = () => {
  const theme = useTheme();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [successSnackbarOpen, setSuccessSnackbarOpen] =
    useState<boolean>(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState<boolean>(false);

  const { mutate: authMutate, isPending } = useLoginMutation();

  const handleLogin = async (e) => {
    e.preventDefault();

    const data: LoginData = {
      username: username,
      password: btoa(password),
    };

    authMutate(data, {
      onSuccess: () => {
        setSuccessSnackbarOpen(true);
      },
      onError: (error) => {
        console.log("error", error);
        if (isAxiosError(error) && error.response) {
          setErrorMsgs(
            error.response.data.message
              ? error.response.data.message
              : error?.response?.data?.detail
              ? error?.response?.data?.detail
              : error?.response?.data?.username
              ? "Username field must not be blank!!"
              : error?.response?.data?.password
              ? "Password field must not be blank!!"
              : "Error on Login!!"
          );
          setErrorSnackbarOpen(true);
        }
      },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        // backgroundImage: `url(${Background})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundColor: theme.palette.primary.light,
      }}
    >
      <SuccessBar
        message={"Logged In Successfully."}
        snackbarOpen={successSnackbarOpen}
        setSnackbarOpen={setSuccessSnackbarOpen}
      />
      <ErrorBar
        message={errorMsgs}
        snackbarOpen={errorSnackbarOpen}
        setSnackbarOpen={setErrorSnackbarOpen}
      />
      <Box
        component="form"
        onSubmit={handleLogin}
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
        <Box>
          <TextField
            size="small"
            fullWidth
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Box>

        <Box>
          <TextField
            size="small"
            fullWidth
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Box sx={{ alignSelf: "center" }}>
          <RoundedButton
            title1="Login"
            onClick1={handleLogin}
            loading={isPending}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
