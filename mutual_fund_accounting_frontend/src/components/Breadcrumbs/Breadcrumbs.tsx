import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Breadcrumbs,
  Typography,
  useTheme,
  Box,
  Popover,
  IconButton,
  Button,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UserProfile from "./UserProfile";
import { useNavStore } from "../../store/NavbarStore";
import NavbarDetail, {
  NavbarDetailProps,
} from "components/Breadcrumbs/NAVValue";
import { useGetNavValue } from "services/NAVValue/NAVValueService";

export default function BreadCrumbs() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const pathNames = location.pathname.split("/").filter((x) => x);
  const activeBreadcrumbLabel = useNavStore(
    (state) => state.activeBreadcrumbLabel
  );
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const { data: navValue } = useGetNavValue();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navData: NavbarDetailProps = {
    navValue: navValue?.responseData?.nav || 0,
    navDate: navValue?.responseData?.txn_date?.split("T")[0] || "-",
  };

  const handleBackClick = () => {
    console.log(window.history.length);
    if (window.history.length > 3) {
      history.back();
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <Box
        component="section"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: { sm: "90%", md: "110%", lg: "160%", xl: "165%" },
          maxWidth: "1900px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            sx={{
              height: "32px",
              width: "32px",
              minWidth: "32px",
              borderRadius: "50%",
              border: "1px solid #C4C6CF",
            }}
            onClick={handleBackClick}
          >
            <ArrowBackIcon sx={{ color: theme.palette.primary[1000] }} />
          </Button>

          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{
              "& .MuiBreadcrumbs-separator": {
                margin: 0,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "1.2rem",
                color: theme.palette.secondary.darkGrey,
              }}
            >
              {activeBreadcrumbLabel}
            </Typography>
            {pathNames?.map((name) => {
              const words = name.split(/[-_]/).map((word) => {
                if (
                  word === "ipo" ||
                  word === "fpo" ||
                  word === "sebon" ||
                  word === "cgt" ||
                  word === "ltp"
                ) {
                  return word.toUpperCase();
                } else {
                  return word.charAt(0).toUpperCase() + word.slice(1);
                }
              });

              return (
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: 500,
                    color: theme.palette.secondary.darkColor,
                  }}
                  key={name}
                >
                  {words.join(" ")}
                </Typography>
              );
            })}
          </Breadcrumbs>
        </Box>

        <Box>
          <Box sx={{ display: "flex" }}>
            <NavbarDetail
              navValue={navData.navValue}
              navDate={navData.navDate}
            />

            <IconButton aria-describedby={id} onClick={handleClick}>
              <PersonIcon sx={{ color: theme.palette.primary[900] }} />
            </IconButton>
          </Box>

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
              <Box />
            </Box>
          </Popover>
        </Box>
      </Box>
    </>
  );
}
