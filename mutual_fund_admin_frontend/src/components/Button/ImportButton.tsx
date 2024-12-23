import React, { useState, ChangeEvent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
} from "@mui/material";
import { SaveAlt } from "@mui/icons-material";
import Auth from "utils/Auth";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";

interface ImportButtonProps {
  mode: string;
}

const ImportButton: React.FC<ImportButtonProps> = ({ mode }) => {
  const theme = useTheme();
  const [successBarOpen, setSuccessBarOpen] = useState<boolean>(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      setErrorMsg("Please select a file to upload.");
      setSnackbarErrorOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("mode", mode);

    let headers = new Headers();
    headers.append("Authorization", `Bearer ${Auth.getAccessToken()}`);

    fetch(`${BASE_URL}/sip-up/api/v1/sip/file-upload/`, {
      method: "POST",
      headers: headers,
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setDialogOpen(false);
        setSuccessBarOpen(true);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
        setErrorMsg("There was an error uploading the file.");
        setSnackbarErrorOpen(true);
      });
  };

  return (
    <>
      <Button
        onClick={handleDialogOpen}
        variant="outlined"
        startIcon={<SaveAlt />}
        style={{
          borderColor: "#F5F5F5",
          borderRadius: "15px",
          height: "33px",
          color: theme.palette.primary.fullDarkmainColor,
          backgroundColor: "white",
          transition: "background-color 0.3s, color 0.3s",
        }}
      >
        Import
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <input type="file" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} sx={{ color: theme.palette.primary.fullDarkmainColor,
}}>
            Cancel
          </Button>
          <Button onClick={handleFileUpload} sx={{ color: theme.palette.primary.fullDarkmainColor,
 }}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      <SuccessBar
        snackbarOpen={successBarOpen}
        setSnackbarOpen={setSuccessBarOpen}
        message="File uploaded successfully"
      />
      <ErrorBar
        snackbarOpen={snackbarErrorOpen}
        setSnackbarOpen={setSnackbarErrorOpen}
        message={errorMsg}
      />
    </>
  );
};

export default ImportButton;
