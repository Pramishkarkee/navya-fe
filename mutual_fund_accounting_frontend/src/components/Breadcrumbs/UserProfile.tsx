import * as React from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  useTheme,
  Stack,
} from "@mui/material";

export default function UserProfile() {
  const theme = useTheme();
  const navigate = useNavigate();
  const userName = localStorage.getItem("UserName");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("UserName");
    navigate("/");
  };

  function stringAvatar(name: string) {
    //Incase of name being null, emptyString or undefined
    if (!name || !name.trim()) {
      return {
        sx: {
          bgcolor: theme.palette.primary[1100],
        },
        children: "NA",
      };
    }
    // To extract the initials letters from the name
    const nameInitials = name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .join("");
    //Incase of name length being less than 2
    if (name.length < 2) {
      return {
        sx: {
          bgcolor: theme.palette.primary[1100],
        },
        children: nameInitials,
      };
    }
    return {
      sx: {
        bgcolor: theme.palette.primary[1100],
      },
      children: nameInitials.toUpperCase(),
    };
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
          width: "12rem",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Stack direction="row" spacing={2}>
            <Avatar {...stringAvatar(`${userName}`)} />
          </Stack>
          <Typography
            sx={{ fontSize: 14, fontWeight: 500, textTransform: "capitalize" }}
          >
            {userName}
          </Typography>
        </Box>
        {/* <Box sx={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <IconButton onClick={handleChangePassword}>
            <CreateIcon sx={{ color: "black" }} />
          </IconButton>
          <Typography onClick={handleChangePassword} sx={{ cursor: "pointer" }}>
            Change Password
          </Typography>
        </Box> */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.0rem" }}>
          <IconButton onClick={handleLogout}>
            <LogoutIcon sx={{ color: theme.palette.secondary.main }} />
          </IconButton>
          <Typography onClick={handleLogout} sx={{ cursor: "pointer" }}>
            Log Out
          </Typography>
        </Box>
      </Box>
    </>
  );
}
