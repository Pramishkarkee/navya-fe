import React from "react";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";

// icons
import PersonIcon from "@mui/icons-material/Person";
import UserProfile from "components/UserProfile/UserProfile";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

import { useTheme } from "@mui/material";

export interface NavbarDetailProps {
  navValue: number;
  navDate: string | Date;
}

export default function NavbarDetail({ navValue, navDate }: NavbarDetailProps) {
  //   const { navValue, navDate } = props;
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "popover-button" : undefined;

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
              color: theme.palette.secondary.baseGray,
            }}
          >
            <EventOutlinedIcon sx={{ fontSize: "1.1rem" }} />
            As of {navDate.toString()}
          </Typography>
          <IconButton aria-describedby={id} onClick={handleClick}>
            <PersonIcon sx={{ color: theme.palette.secondary.main }} />
          </IconButton>
          <Popover
            elevation={0}
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: theme.palette.secondary.lightGrey,
                borderRadius: "0.6rem",
              }}
            >
              <UserProfile />
            </Box>
          </Popover>
      </Box>
    </>
  );
}
