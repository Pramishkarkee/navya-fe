import React from "react";
import { Box, Typography, Modal, Grid, useTheme, Button } from "@mui/material";

interface ViewModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  title: string;
  onClick: () => void;
  //   data: string; // Type definition for the data prop
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { sm: "50%", md: "50%", lg: "30%" },
  bgcolor: "background.paper",
  borderRadius: "8px",
  p: 4,
};

const ConfirmationModal: React.FC<ViewModalProps> = ({
  open,
  setOpen,
  title,
  message,
  onClick,
  //   data,
}) => {
  const theme = useTheme();
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Grid container sx={{ columnGap: { xs: 4, lg: 6 }, rowGap: 4 }}>
          <Grid
            item
            xs={12}
            sx={{
              width: "100%",
              // borderBottom: `1px solid ${theme.palette.secondary.lightGrey}`,
            }}
          >
            <Typography
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <span
                style={{
                  color: theme.palette.secondary[700],
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {" "}
                {title}{" "}
              </span>
            </Typography>
            <Typography
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <span style={{ color: theme.palette.secondary[700] }}>
                {" "}
                {message}{" "}
              </span>
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 4,
                mt: 2,
                // justifyContent: "space-evenly",
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "6px",
                  color: "#fff",
                  backgroundColor: theme.palette.primary[1100],
                  ":hover": {
                    color: theme.palette.secondary.main,
                  },
                }}
                onClick={onClick}
              >
                Yes
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "6px",
                  borderColor: theme.palette.secondary[700],
                  color: theme.palette.secondary.main,
                  backgroundColor: theme.palette.primary.light,
                }}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
