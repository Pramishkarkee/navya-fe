import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Modal,
  Grid,
  useTheme,
  TextField,
} from "@mui/material";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import RoundedButton from "components/Button/Button";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { usePatchAllotAuction } from "services/Auction/AuctionServices";
import dayjs from "dayjs";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import axios from "axios";
import { useGlobalStore } from "store/GlobalStore";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  bgcolor: "background.paper",
  borderRadius: "15px",
  p: 4,
  maxHeight: "82vh",
  overflowY: "auto",
};

interface AllotsUnitModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: Record<string, string>;
  auctionId: number;
}

const AllotsUnitModal: React.FC<AllotsUnitModalProps> = ({
  open,
  setOpen,
  data,
  auctionId,
}) => {
  const theme = useTheme();
  const allotmentDate = useGlobalStore((state) => state.allotmentDate);

  const [errorMsgs, setErrorMsgs] = useState("");
  const [successMsgs, setSuccessMsgs] = useState("");
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const [allotedUnits, setAllotedUnits] = useState("");
  const [applyDate, setApplyDate] = useState<dayjs.Dayjs | null>(null);
  const [allotmentRemarks, setAllotmentRemarks] = useState("");
  const [handleSubmitTrue, setHandleSubmitTrue] = useState(false);

  const { mutate: patchAllotAuctionDetails, isPending: AuctionDetailPending } =
    usePatchAllotAuction();

  const handleConfirm = () => {
    setHandleSubmitTrue(true);
    setErrorMsgs("");
    setSuccessMsgs("");

    patchAllotAuctionDetails(
      {
        allotted_ipo_id: String(auctionId),
        alloted_units: Number(allotedUnits),
        alloted_date: applyDate ? applyDate.format("YYYY-MM-DD") : null,
        remarks: allotmentRemarks,
      },
      {
        onSuccess: () => {
          setErrorMsgs(null);
          setSuccessMsgs(`${allotedUnits} Units Auction Alloted successfully.`);
          setSnackbarSuccessOpen(true);
        },
        onError: (error) => {
          console.log("error: ", error);
          if (axios.isAxiosError(error) && error.response) {
            const data = error.response.data;
            setErrorMsgs(
              data.details
                ? data.details
                : data.alloted_units.details
                ? data.alloted_units.details
                : data.alloted_date
                ? data.alloted_date[0]
                : "Error while updating Auction details"
            );
          }
          setSnackbarErrorOpen(true);
        },
      }
    );
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              mt: 2,
            }}
          >
            <HeaderDesc title="Details" />
            <CloseIcon
              sx={{ marginRight: "5px", cursor: "pointer" }}
              onClick={handleClose}
            />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <HeaderDesc title="Allotment Details" />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ mb: 1 }}>
                  <TypographyLabel title={"Alloted Units"} />
                  <TextField
                    required
                    size="small"
                    id="alloted_units"
                    name="alloted_units"
                    value={allotedUnits}
                    onChange={(e) => setAllotedUnits(e.target.value)}
                    sx={{
                      width: "240px",
                      "& .MuiSvgIcon-root": {
                        width: "16px",
                        height: "16px",
                      },
                    }}
                    error={!allotedUnits && handleSubmitTrue}
                    helperText={
                      !allotedUnits && handleSubmitTrue
                        ? "Alloted Units is required"
                        : ""
                    }
                  />
                </Box>
                <Box sx={{ mb: 1 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ margin: 0, padding: 0 }}>
                      <TypographyLabel title={"Allotment Date"} />
                      <DatePicker
                        sx={{
                          width: "240px",
                          "& .MuiSvgIcon-root": {
                            width: "16px",
                            height: "16px",
                          },
                        }}
                        slotProps={{
                          textField: {
                            size: "small",
                            error: !applyDate && handleSubmitTrue,
                            helperText:
                              !applyDate && handleSubmitTrue
                                ? "Allotment Date is required"
                                : "",
                          },
                        }}
                        value={applyDate}
                        onChange={(newValue) => setApplyDate(newValue)}
                        minDate={dayjs(allotmentDate)}
                      />
                    </Box>
                  </LocalizationProvider>
                </Box>
                <Box>
                  <TypographyLabel title={"Allotment Remarks"} />
                  <TextField
                    required
                    id="remarks"
                    name="remarks"
                    value={allotmentRemarks}
                    onChange={(e) => setAllotmentRemarks(e.target.value)}
                    multiline
                    rows={2}
                    sx={{
                      width: "240px",
                      "& .MuiSvgIcon-root": {},
                    }}
                  />
                  {!allotmentRemarks && handleSubmitTrue && (
                    <Typography sx={{ fontSize: "12px" }} color="error">
                      Allotment Remarks is required
                    </Typography>
                  )}
                </Box>
                <RoundedButton
                  title1="Confirm"
                  onClick1={handleConfirm}
                  loading={AuctionDetailPending}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <HeaderDesc title="Entry Details" />
              <Box sx={{ mb: 6 }}>
                {Object.entries(data).map(([key, value]) => (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: `1px solid ${theme.palette.secondary.lightGrey}`,
                      padding: "8px 0",
                    }}
                  >
                    <Typography sx={{ fontWeight: "bold" }}>{key}</Typography>
                    <Typography sx={{ color: theme.palette.secondary[700] }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <SuccessBar
        snackbarOpen={snackbarSuccessOpen}
        setSnackbarOpen={setSnackbarSuccessOpen}
        message={successMsgs}
      />
      <ErrorBar
        snackbarOpen={snackbarErrorOpen}
        setSnackbarOpen={setSnackbarErrorOpen}
        message={errorMsgs}
      />
    </>
  );
};

export default AllotsUnitModal;
