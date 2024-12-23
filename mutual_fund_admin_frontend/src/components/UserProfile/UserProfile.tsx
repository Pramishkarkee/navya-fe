import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Box, IconButton, Typography, useTheme } from "@mui/material";

// icons
// import CreateIcon from "@mui/icons-material/Create";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";
import { useGetUserName } from "services/User/UserService";

export default function BackgroundLetterAvatars() {
  const theme = useTheme();
  const navigate = useNavigate();

  const { data: userName } = useGetUserName();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  function stringAvatar(name: string) {
    //Incase of name being null, emptyString or undefined
    if (!name || !name.trim()) {
      return {
        sx: {
          bgcolor: theme.palette.secondary.main,
        },
        children: "NA",
      };
    }

    //To extract the initials letters from the name
    const nameInitials = name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .join("");

    //Incase of name length being less than 2
    if (name.length < 2) {
      return {
        sx: {
          bgcolor: theme.palette.secondary.main,
        },
        children: nameInitials,
      };
    }

    return {
      sx: {
        bgcolor: theme.palette.secondary.main,
      },
      children: nameInitials,
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
            <Avatar {...stringAvatar(`${userName?.responseData?.full_name}`)} />
          </Stack>
          <Typography
            sx={{ fontSize: 14, fontWeight: 500, textTransform: "capitalize" }}
          >
            {userName?.responseData?.full_name}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <IconButton onClick={handleLogout}>
            <LogoutIcon sx={{ color: "black" }} />
          </IconButton>
          <Typography onClick={handleLogout} sx={{ cursor: "pointer" }}>
            Log Out
          </Typography>
        </Box>
      </Box>
    </>
  );
}
