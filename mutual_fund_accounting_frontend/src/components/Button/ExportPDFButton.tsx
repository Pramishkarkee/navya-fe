import React, { useState } from "react";
import { Button, useTheme } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import { axiosInstance } from "config/axiosInstance";

export interface ExportButtonProps {
  baseURL?: string;
  title?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  baseURL,
  title = "Export",
}) => {
  const theme = useTheme();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successBarOpen, setSuccessBarOpen] = useState<boolean>(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get(baseURL, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const contentDisposition = response.headers["content-disposition"];
      const matchedFileName = contentDisposition?.match(/filename="?(.+)"?/);
      const fileName = matchedFileName?.[1];
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setSuccessBarOpen(true);
    } catch (error) {
      setErrorMsg("Error while exporting file");
      setSnackbarErrorOpen(true);
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
