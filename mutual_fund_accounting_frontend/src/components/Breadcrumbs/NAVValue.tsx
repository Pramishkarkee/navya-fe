import React from "react";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

import { useTheme } from "@mui/material";

export interface NavbarDetailProps {
  navValue: number;
  navDate: string;
}

export default function NavbarDetail({ navValue, navDate }: NavbarDetailProps) {
  const theme = useTheme();

  return (
    <>
      <Box
        component="section"
        sx={{
          display: "flex",
          gap:1,
          justifyContent: "space-between",
          alignItems: "center",
          width: "fullWidth",
        }}
      >
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "1rem",
            fontWeight: "500",
            color: theme.palette.secondary.main,
            // color: "black",
          }}
        >
          NAV: {navValue}
          </Typography>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: "0.9rem",
              color: theme.palette.grey[700],
            }}
          >
            <EventOutlinedIcon sx={{ fontSize: "1rem" , mr: 0.2 }} />
            As of {navDate}
          </Typography>
         
      </Box>
    </>
  );
}
