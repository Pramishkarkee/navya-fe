import React, { useState } from "react";
import {
  Box,
  Typography,
  Modal,
  Grid,
  useTheme,
  Button,
  TextField,
} from "@mui/material";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import EditIcon from "@mui/icons-material/Edit";
import RoundedButton from "components/Button/Button";

interface ViewModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  desc: string;
  handleUpdateRecord?: any;
  data: Record<string, any>; // Type definition for the data prop
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

const MarketAndCommissionModal: React.FC<ViewModalProps> = ({
  open,
  setOpen,
  desc,
  data,
  handleUpdateRecord,
}) => {
  const theme = useTheme();
  const handleClose = () => setOpen(false);

  const [maxValue, setMaxValue] = useState(`${data["Maximum Range"]}`);
  const [minValue, setMinValue] = useState(`${data["Minimum Range"]}`);
  const [commissionValue, setCommissionValue] = useState(
    `${data["Commission Rate (%)"]}`
  );

  const [editMax, setEditMax] = useState<boolean>(false);
  const [editMin, setEditMin] = useState<boolean>(false);
  const [editcommission, setEditcommission] = useState<boolean>(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <HeaderDesc title={desc} />
        <Grid
          container
          sx={{ mt: 2.5, columnGap: { xs: 4, lg: 6 }, rowGap: 1.5 }}
        >
          {Object.entries(data).map(([key, value]) => (
            <Grid item xs={5.5} key={key}>
              {key === "Maximum Range" ? (
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>{key} </span>
                  {!editMax ? (
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: theme.palette.secondary[700],
                        }}
                      >
                        {" "}
                        {value}
                      </Typography>
                      <Button
                        onClick={() => setEditMax(true)}
                        sx={{
                          padding: "6px 0",
                          minWidth: "0",
                          color: theme.palette.secondary[700],
                        }}
                      >
                        <EditIcon sx={{ fontSize: "16px" }} />
                      </Button>
                    </Box>
                  ) : (
                    <TextField
                      size="small"
                      value={maxValue}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setMaxValue(event.target.value)
                      }
                    />
                  )}
                </Typography>
              ) : key === "Minimum Range" ? (
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>{key} </span>
                  {!editMin ? (
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: theme.palette.secondary[700],
                        }}
                      >
                        {" "}
                        {value}
                      </Typography>
                      <Button
                        onClick={() => setEditMin(true)}
                        sx={{
                          padding: "6px 0",
                          minWidth: "0",
                          color: theme.palette.secondary[700],
                        }}
                      >
                        <EditIcon sx={{ fontSize: "16px" }} />
                      </Button>
                    </Box>
                  ) : (
                    <TextField
                      size="small"
                      value={minValue}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setMinValue(event.target.value)
                      }
                    />
                  )}
                </Typography>
              ) : key === "Commission Rate (%)" ? (
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>{key} </span>
                  {!editcommission ? (
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: theme.palette.secondary[700],
                        }}
                      >
                        {" "}
                        {value}
                      </Typography>
                      <Button
                        onClick={() => setEditcommission(true)}
                        sx={{
                          padding: "6px 0",
                          minWidth: "0",
                          color: theme.palette.secondary[700],
                        }}
                      >
                        <EditIcon sx={{ fontSize: "16px" }} />
                      </Button>
                    </Box>
                  ) : (
                    <TextField
                      size="small"
                      value={commissionValue}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setCommissionValue(event.target.value)
                      }
                    />
                  )}
                </Typography>
              ) : (
                <Typography
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontWeight: "bold" }}>{key} </span>
                  <span style={{ color: theme.palette.secondary[700] }}>
                    {" "}
                    {value}{" "}
                  </span>
                </Typography>
              )}
            </Grid>
          ))}
        </Grid>
        <Box mt={1}>
          <RoundedButton title1="Update Record" onClick1={handleUpdateRecord} />
        </Box>
      </Box>
    </Modal>
  );
};

export default MarketAndCommissionModal;
