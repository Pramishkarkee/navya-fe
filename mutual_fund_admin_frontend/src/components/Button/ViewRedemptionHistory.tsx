import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useTheme } from "@mui/material/styles";
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TableHead from "@mui/material/TableHead";
import { styled } from "@mui/material/styles";
import { Visibility } from "@mui/icons-material";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";

interface RedemptionData {
  lot_number: number;
  units_redeemed: number;
  redeem_date: string;
  created_at: string;
  updated_at: string;
}

interface RedemptionLotsData {
  id: number;
  lot_number: number;
  units_redeemed: number;
  created_at: string;
  updated_at: string;
  current_units: number;
  previous_units: number;
}

interface Props {
  redemptionHistory: RedemptionData[];
  redemptionLotHistory: RedemptionLotsData[];
  lot_number: number;
}

const ViewRedemptionHistory: React.FC<Props> = ({
  redemptionHistory,
  redemptionLotHistory,
  lot_number,
}) => {
  const [openView, setOpenView] = useState(false);
  const [openNestedModal, setOpenNestedModal] = useState(false);
  const [selectedLotNumber, setSelectedLotNumber] = useState<number | null>(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleViewHistory = () => {
    setOpenView(true);
  };

  const handleClose = () => {
    setOpenView(false);
  };

  const handleNestedModalOpen = (lotNumber: number) => {
    setSelectedLotNumber(lotNumber);
    setOpenNestedModal(true);
  };

  const handleNestedModalClose = () => {
    setOpenNestedModal(false);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.secondary.lightGrey,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  const filteredLotHistory = redemptionLotHistory.filter(
    (lot) => lot.lot_number === selectedLotNumber
  );
  return (
    <>
      <Button
        sx={{
          marginLeft: "-8px",
          color: theme.palette.primary.main,
          textTransform: "none",
          fontWeight: 500,
          fontSize: 15,
          "&:hover": {
            backgroundColor: "transparent",
            hover: "none",
          },
        }}
        onClick={handleViewHistory}
      >
        View Redemption History
      </Button>

      <Dialog
        open={openView}
        onClose={handleClose}
        PaperProps={{
          style: { width: fullScreen ? "95%" : "60%", borderRadius: "20px" },
        }}
        maxWidth="xl"
        fullScreen={fullScreen}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <DialogTitle sx={{ flex: 1, textAlign: "center" }}>
            View Redemption History
          </DialogTitle>
          <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
        </Box>

        <DialogContent>
          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Lot No</StyledTableCell>
                  <StyledTableCell align="center">
                    Units Redeemed
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Redeem Date
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Created Date
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Updated Date
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Action
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {redemptionHistory.length > 0 ? (
                  redemptionHistory.map((data, index) => (
                    <TableRow key={index}>
                      <StyledTableCell align="center">
                        {data.lot_number}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {data.units_redeemed}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {formatDate(data.redeem_date)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {formatDate(data.created_at)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {formatDate(data.updated_at)}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        onClick={() => handleNestedModalOpen(data.lot_number)}
                        sx={{
                          color: theme.palette.secondary.darkmainColor,
                          fontWeight: "medium",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Visibility />
                        <span style={{ marginLeft: "5px" }}>Lot History</span>
                      </StyledTableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          mt: 3,
                        }}
                      >
                        <CloudRoundedIcon
                          sx={{ color: "#E0E0E0", mb: 1, fontSize: "4rem" }}
                        />
                        <Typography>
                          No Redemption History Available
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      <Modal
        open={openNestedModal}
        onClose={handleNestedModalClose}
        aria-labelledby="nested-modal-title"
        aria-describedby="nested-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: fullScreen ? "95%" : "60%",
            bgcolor: "background.paper",
            border: "2px solid #ffff",
            borderRadius: "20px",
          }}
        >
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
              marginTop: "18px",
            }}
          >
            <ArrowBackIcon
              sx={{ marginLeft: "25px", color: "#9E9E9E" }}
              onClick={handleNestedModalClose}
            />
            <DialogTitle id="nested-modal-title">
              {selectedLotNumber} Lot History
            </DialogTitle>
            <CloseIcon
              sx={{ marginRight: "25px" }}
              onClick={handleNestedModalClose}
            />
          </DialogActions>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Lot ID</StyledTableCell>
                    <StyledTableCell align="center">
                      Units Redeemed
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Previous Units
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Created Date
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Updated Date
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Current Units
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLotHistory.length > 0 ? (
                    filteredLotHistory.map((lot) => (
                      <TableRow key={lot.id}>
                        <StyledTableCell align="center">
                          {lot.id}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {lot.units_redeemed}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {lot.previous_units}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {formatDate(lot.created_at)}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {formatDate(lot.updated_at)}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {lot.current_units}
                        </StyledTableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mt: 3,
                          }}
                        >
                          <CloudRoundedIcon
                            sx={{ color: "#E0E0E0", mb: 1, fontSize: "4rem" }}
                          />
                          <Typography>
                            No Lot details data available for this BOID Number
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Box>
      </Modal>
    </>
  );
};

export default ViewRedemptionHistory;
