import React, { useState } from "react";
import { Box, Typography, Modal, Grid, useTheme } from "@mui/material";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ViewCitizenshipModal from "./ViewCitizenshipModal";
import Auth from "utils/Auth";
import SuccessBar from "components/Snackbar/SuccessBar";

interface ViewModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: Record<string, string>;
  fileType?: string;
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  borderRadius: "8px",
  p: 4,
};

const ViewModal: React.FC<ViewModalProps> = ({
  open,
  setOpen,
  data,
  fileType,
}) => {
  const theme = useTheme();
  const handleClose = () => setOpen(false);

  const [citizenshipModalOpen, setCitizenshipModalOpen] = useState(false);
  const [citizenshipPath, setCitizenshipPath] = useState("");
  // const [successBarOpen, setSuccessBarOpen] = useState(false);
  // const sipHolderName = data?.Name;
  // console.log(sipHolderName);

  const handleViewCitizenship = async (path: string) => {
    console.log("file type", fileType);
    console.log(path);
    if (fileType === null) {
      return;
    }

    const anchor = document.createElement("a");
    document.body.appendChild(anchor);
    const file = path;

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${Auth.getAccessToken()}`);

    try {
      const response = await fetch(file, { headers, method: "GET" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blobby = await response.blob();
      console.log("blobby", blobby);
      const objectUrl = window.URL.createObjectURL(blobby);

      anchor.target = "_blank";
      anchor.href = objectUrl;
      anchor.download =
        fileType === "application/pdf"
          ? `${sipHolderName}_citizenship.pdf`
          : `${sipHolderName}_citizenship.png`;
      anchor.click();

      window.URL.revokeObjectURL(objectUrl);
      setSuccessBarOpen(true);
    } catch (error) {
      console.error("Failed to fetch file:", error);
    }

    fetch(file, { headers })
      .then((response) => {
        return response.blob();
      })
      .then((blobby) => {
        console.log("blobby", blobby);
        const objectUrl = window.URL.createObjectURL(blobby);

        anchor.target = "_blank";
        anchor.href = objectUrl;
        anchor.download =
          fileType === "application/pdf"
            ? `${sipHolderName}_citizenship.pdf`
            : `${sipHolderName}_citizenship.png`;
        anchor.click();

        window.URL.revokeObjectURL(objectUrl);
      })
      .then(() => setSuccessBarOpen(true));

    if (fileType === "application/pdf") {
      window.open(`${path}`, "_blank");
    } else {
      setCitizenshipPath(path);
      setCitizenshipModalOpen(true);
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {/* <SuccessBar
            snackbarOpen={successBarOpen}
            setSnackbarOpen={setSuccessBarOpen}
            message="Downloaded Successfully"
          /> */}
          <HeaderDesc title="Details" />
          <Grid
            container
            sx={{ mt: 2.5, columnGap: { xs: 4, lg: 6 }, rowGap: 1.5 }}
          >
            {Object.entries(data).map(([key, value]) => (
              <Grid
                item
                xs={5.5}
                key={key}
                sx={{
                  borderBottom: `1px solid ${theme.palette.secondary.lightGrey}`,
                }}
              >
                <>
                  <Typography
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ fontWeight: "bold" }}>{key} </span>
                    {key === "Citizenship" ? (
                      <span
                        onClick={() => handleViewCitizenship(value)}
                        style={{
                          color: theme.palette.primary[1100],
                          cursor: "pointer",
                        }}
                      >
                        Download Citizenship
                      </span>
                    ) : (
                      <span style={{ color: theme.palette.secondary[700] }}>
                        {" "}
                        {value}{" "}
                      </span>
                    )}
                  </Typography>
                </>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>

      <ViewCitizenshipModal
        open={citizenshipModalOpen}
        setOpen={setCitizenshipModalOpen}
        path={citizenshipPath}
      />
    </>
  );
};

export default ViewModal;
