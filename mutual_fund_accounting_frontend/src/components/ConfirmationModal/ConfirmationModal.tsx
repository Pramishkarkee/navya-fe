import React from "react";
import { Box, Typography, Modal, Grid, useTheme, Button } from "@mui/material";

interface ViewModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: any;
  title: string;
  bTitle1: string;
  bTitle2: string;
  onClick: () => void;
  //   data: string; // Type definition for the data prop
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { sm: "50%", md: "40%", lg: "30%" },
  bgcolor: "background.paper",
  borderRadius: "8px",
  p: 2,
  alignItems: "center",
  // width: "30%",
};

const ConfirmationModal: React.FC<ViewModalProps> = ({
  open,
  setOpen,
  title,
  message,
  bTitle1,
  bTitle2,
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
        <Grid
          container
          sx={{
            mt: 2.5,
            columnGap: { xs: 4, lg: 6 },
            rowGap: 1.5,
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Grid
            item
            xs={12}
            gap={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              //   borderBottom: `1px solid ${theme.palette.secondary.lightGrey}`,
            }}
          >
            <Typography sx={{ display: "flex", justifyContent: "center" }}>
              <span
                style={{
                  color: theme.palette.secondary.darkGrey,
                  fontSize: "18px",
                  fontWeight: 500,
                  lineHeight: "16px",
                }}
              >
                {title}
              </span>
            </Typography>
            <Typography sx={{ display: "flex", justifyContent: "center" }}>
              <span
                style={{
                  color: theme.palette.secondary.darkGrey,
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "16px",
                }}
              >
                {message}
              </span>
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 4,
              }}
            >
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
                {bTitle1}
              </Button>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "6px",
                  borderColor: theme.palette.error[700],
                  color: "#fff",
                  backgroundColor: theme.palette.error.main,
                  "&:hover": {
                    bgcolor: theme.palette.error.main,
                  },
                  "&:disabled": {
                    backgroundColor: theme.palette.error.darkColor,
                  },
                }}
                onClick={onClick}
              >
                {bTitle2}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
