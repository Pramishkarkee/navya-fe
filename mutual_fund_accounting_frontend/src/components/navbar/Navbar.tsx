import { useState } from "react";

import { useTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

//MUI Components
import {
  Box,
  Collapse,
  Divider,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
  Typography,
} from "@mui/material";

//mui icons
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

//zustand store
import { useNavStore } from "../../store/NavbarStore";

//nav items
import { navItems } from "../../constants/NavbarItems";

//assets
import Logo from "../../assets/Logo.svg";

const drawerWidth = 250;

interface NavItem {
  label: string;
  collapseItems?: CollapseItem[];
}

interface CollapseItem {
  label: string;
  path: string;
}

interface CollapseState {
  [index: number]: boolean;
}

function Navbar() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [showNavItemColor, setShowNavItemColor] = useState(Boolean);
  const [openCollapse, setOpenCollapse] = useState<{ [key: number]: boolean }>(
    {}
  );

  const activeLink = useNavStore((state) => state.activeLink);
  const activeLabel = useNavStore((state) => state.activeLabel);
  const setActiveLabel = useNavStore((state) => state.setActiveLabel);
  const setActiveLink = useNavStore((state) => state.setActiveLink);
  const setActiveBreadcrumbLabel = useNavStore(
    (state) => state.setActiveBreadCrumbLabel
  );

  const handleDashboardClick = () => {
    setActiveLabel("Dashboard");
    setActiveBreadcrumbLabel("Dashboard");
    setActiveLink("Dashboard");
    navigate("/dashboard");
    setOpenCollapse({});
  };
  // const handleDayCloseClick = () => {
  //   setActiveLabel("Day Close");
  //   setActiveBreadcrumbLabel("Day Close");
  //   setActiveLink("");
  //   navigate("/day-close");
  //   setOpenCollapse({});
  // };

  const handleNavItemClick = (item: NavItem, index: number) => {
    setActiveLabel(item.label);
    setOpenCollapse((prevState: CollapseState) => ({
      [index]: !prevState[index],
    }));
    setShowNavItemColor(true);
  };

  const handleCollapseItem = (collapseItem: CollapseItem) => {
    setShowNavItemColor(false);
    setActiveLink(collapseItem.path);
    navigate(collapseItem.path);
    setActiveBreadcrumbLabel(activeLabel);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{}}>
        <CssBaseline />
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: theme.palette.primary.light,
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar>
            <img src={Logo} alt="Nic ASIA Capital" />
          </Toolbar>
          <Divider />
          <List sx={{}}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleDashboardClick}
                sx={{
                  p: "0.4rem",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Divider
                  orientation="vertical"
                  flexItem
                  color={
                    activeLabel === "Dashboard"
                      ? theme.palette.secondary.main
                      : theme.palette.primary.light
                  }
                  sx={{
                    width: "5px",
                    borderRadius: "100px",
                    borderColor: "transparent",
                  }}
                />

                <Typography
                  sx={{
                    // flex: 10,
                    color:
                      activeLabel === "Dashboard"
                        ? theme.palette.secondary.main
                        : "inherit",
                    fontWeight: "medium",
                  }}
                >
                  Dashboard
                </Typography>
              </ListItemButton>
            </ListItem>

            <Divider sx={{ width: "90%", mx: "auto" }} />

            {navItems.map((item, index) => (
              <Box key={item.label}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleNavItemClick(item, index)}
                    sx={{
                      p: "0.4rem",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Divider
                      orientation="vertical"
                      flexItem
                      color={
                        item.label === activeLabel
                          ? theme.palette.secondary.main
                          : theme.palette.primary.light
                      }
                      sx={{
                        width: "5px",
                        borderRadius: "100px",
                        borderColor: "transparent",
                      }}
                    />
                    <Box
                      sx={{
                        // flex: 1,
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        sx={{
                          // flex: 10,
                          color:
                            item.label === activeLabel && showNavItemColor
                              ? theme.palette.secondary.main
                              : "inherit",
                          fontWeight: "medium",
                        }}
                      >
                        {item.label}
                      </Typography>

                      <Box
                        sx={{
                          // flex: 1,
                          display: "flex",
                          //   alignItems: "flex-end",
                          color:
                            item.label === activeLabel
                              ? theme.palette.secondary.main
                              : "inherit",
                        }}
                      >
                        {openCollapse[index] ? (
                          <ArrowDropUpIcon />
                        ) : (
                          <ArrowDropDownIcon />
                        )}
                      </Box>
                    </Box>
                  </ListItemButton>
                </ListItem>
                <Collapse in={openCollapse[index]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {/* Render collapse items here */}

                    {item.collapseItems?.map((collapseItem, collapseIndex) => (
                      <ListItem key={collapseIndex} disablePadding>
                        <ListItemButton
                          sx={{ p: "0.2rem" }}
                          onClick={() => handleCollapseItem(collapseItem)}
                        >
                          <Typography
                            sx={{
                              pl: 3,
                              fontWeight: "medium",
                              color:
                                activeLink === collapseItem.path
                                  ? theme.palette.secondary.main
                                  : "inherit",
                              fontSize: "14px",
                            }}
                          >
                            {collapseItem.label}
                          </Typography>
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
                <Divider sx={{ width: "90%", mx: "auto" }} />
              </Box>
            ))}
            {/* <ListItem disablePadding>
              <ListItemButton
                onClick={handleDayCloseClick}
                sx={{
                  p: "0.4rem",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Divider
                  orientation="vertical"
                  flexItem
                  color={
                    activeLabel === "Day Close"
                      ? theme.palette.secondary.main
                      : theme.palette.primary.light
                  }
                  sx={{
                    width: "5px",
                    borderRadius: "100px",
                    borderColor: "transparent",
                  }}
                />

                <Typography
                  sx={{
                    // flex: 10,
                    color:
                      activeLabel === "Day Close"
                        ? theme.palette.secondary.main
                        : "inherit",
                    fontWeight: "medium",
                  }}
                >
                  Day Close
                </Typography>
              </ListItemButton>
            </ListItem> */}
          </List>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}

export default Navbar;
