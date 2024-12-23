import Navbar from "../components/navbar/Navbar.tsx";
import { Outlet, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import BreadCrumbs from "../components/Breadcrumbs/Breadcrumbs.tsx";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
type decodedJWt = {
  iat: number;
  exp: number;
};

export default function Layout() {
  const access_token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!access_token) {
      navigate("/", { replace: true });
    }
  }, [access_token, navigate]);

  useEffect(() => {
    if (access_token) {
      try {
        // const decodedToken = JSON.parse(atob(access_token.split(".")[1]));
        const decodedToken: decodedJWt = jwtDecode(access_token);
        if (decodedToken.exp * 1000 < Date.now()) {
          // auth.logout();
          localStorage.removeItem("access_token");
          navigate("/", { replace: true });
        }
      } catch (error) {
        // console.error("Error decoding token:", error);
      }
    } else {
      // console.error("Access token is null or undefined");
    }
  });

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Box sx={{ p: "20px 26px", width: { xs: "70%", lg: "70%" } }}>
        <BreadCrumbs />
        <Outlet />
      </Box>
    </Box>
  );
}
