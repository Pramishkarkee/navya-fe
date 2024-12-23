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
  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/", { replace: true });
    } else {
      try {
        const decodedToken: decodedJWt = jwtDecode(accessToken);
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("access_token");
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [accessToken, navigate]);

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Box sx={{ p: "20px 26px", width: { xs: "70%", lg: "50%" } }}>
        <BreadCrumbs />
        <Outlet />
      </Box>
    </Box>
  );
}
