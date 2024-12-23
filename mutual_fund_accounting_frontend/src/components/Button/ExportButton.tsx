import React, { useState } from "react";
import { Button, useTheme } from "@mui/material";
import axios from "axios";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import { axiosInstance } from "config/axiosInstance";

export interface ExportButtonProps {
  filename?: string;
  baseURL?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  title?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  filename,
  baseURL,
  search,
  startDate,
  endDate,
  title = "Export",
}) => {
  const theme = useTheme();
  const [successBarOpen, setSuccessBarOpen] = useState<boolean>(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleExport = async () => {
    // console.log("testing1")
    // const header = new Headers();
    // header.append("Authorization", `Bearer ${localStorage.getItem("access_token")}`);
    try {
      const response = await axiosInstance.get(
        `${baseURL}&search=${search}&from_date=${startDate}&to_date=${endDate}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);

      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setSuccessBarOpen(true);
    } catch (error) {
      setErrorMsg("Error while exporting file");
      setSnackbarErrorOpen(true);
      console.error("Error while exporting file: ", error);
    }
  };

  return (
    <>
      <SuccessBar
        snackbarOpen={successBarOpen}
        setSnackbarOpen={setSuccessBarOpen}
        message="File Exported Successfully"
      />
      <ErrorBar
        snackbarOpen={snackbarErrorOpen}
        setSnackbarOpen={setSnackbarErrorOpen}
        message={errorMsg}
      />

      <Button
        variant="outlined"
        onClick={handleExport}
        startIcon={<ExitToAppIcon />}
        sx={{
          width: "fit-content",
          borderRadius: "100px",
          padding: "6px 24px",
          fontSize: "14px",
          fontWeight: 600,
          lineHeight: "20px",
          color: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.primary.light,
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        {title}
      </Button>
    </>
  );
};

export default ExportButton;
