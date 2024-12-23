import React, { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  useTheme,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { ExportButtonProps } from "./ExportButton";
import ErrorBar from "components/Snackbar/ErrorBar";
import SuccessBar from "components/Snackbar/SuccessBar";

interface ExportOptionButtonProps extends ExportButtonProps {
  format?: string;
}

const filesType = [
  {
    label: "CSV",
    value: "csv",
  },
  {
    label: "XLSX",
    value: "xlsx",
  },
  {
    label: "PDF",
    value: "pdf",
  },
];

const ExportButtonWithOptions: React.FC<ExportOptionButtonProps> = ({
  baseURL,
  startDate,
  endDate,
  title = "Export",
}) => {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false);
  const id = open ? "simple-popover" : undefined;
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successBarOpen, setSuccessBarOpen] = useState<boolean>(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);

  const handleExport = async (fileFormat: string) => {
    const headers = new Headers();
    headers.append(
      "Authorization",
      `Bearer ${localStorage.getItem("access_token")}`
    );
    try {
      const response = await axios.get(
        `${baseURL}?from_date=${startDate}&to_date=${endDate}&export_format=${fileFormat}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const contentDisposition = response.headers["content-disposition"];

      const matchedFileName = contentDisposition?.match(/filename="?(.+)"?/);
      const fileName =
        matchedFileName?.[1] ||
        `JournalEntries-${dayjs().format("YYYY-MM-DD")}.${fileFormat}`;

      const mimeTypes: Record<string, string> = {
        csv: "text/csv",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        pdf: "application/pdf",
      };

      const blob = new Blob([response.data], {
        type: mimeTypes[fileFormat] || "application/octet-stream",
      });

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
    <Box
    // component="section"
    // sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
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
        onClick={() => setOpen(true)}
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
      {open && (
        <Popover
          id={id}
          open={open}
          onClose={() => setOpen(false)}
          anchorOrigin={{
            vertical: 265,
            horizontal: "right",
          }}
          sx={{ width: "220px" }}
        >
          <List sx={{ pt: 0 }}>
            {filesType.map((type, index) => (
              <ListItem disablePadding key={index}>
                <ListItemButton onClick={() => handleExport(type.value)}>
                  <ListItemText primary={type.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Popover>
      )}
    </Box>
  );
};

export default ExportButtonWithOptions;
