import React, { useState } from "react";
import { Box, Typography, Modal, Grid, useTheme, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { format } from "date-fns";
import DateField from "components/DateFilter/DateField";
import { useForm } from "react-hook-form";

interface ExportModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onExport: (startDate: Date, endDate: Date, format: string) => void;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "50%", md: "40%", lg: "30%" },
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 3,
};

const ExportModal: React.FC<ExportModalProps> = ({
  open,
  setOpen,
  onExport,
}) => {
  const theme = useTheme();
  const { control, handleSubmit, setValue } = useForm({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [exportFormat, setExportFormat] = useState("PDF");
  const entriesCount = 458;

  const handleClose = () => setOpen(false);

  const handleExport = () => {
    onExport(startDate, endDate, exportFormat);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="export-modal-title"
      aria-describedby="export-modal-description"
    >
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Typography
            id="export-modal-title"
            variant="h6"
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: "19px",
              color: "#212121",
              textAlign: "center",
              width: "max-content",
              borderBottom: `1px solid ${theme.palette.secondary.main}`,
            }}
          >
            Export Details
          </Typography>
          <Button
            onClick={handleClose}
            sx={{
              minWidth: "auto",
              p: 0.5,
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <CloseIcon />
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <DateField
                control={control}
                dateLabel1="Date (From)"
                dateLabel2="Date (To)"
              />
            </Box>

            <FormControl size="small" sx={{ width: "50%" }}>
              <InputLabel id="export-format-label">Export Format</InputLabel>
              <Select
                labelId="export-format-label"
                value={exportFormat}
                label="Export Format"
                onChange={(e) => setExportFormat(e.target.value)}
                sx={{
                  borderRadius: "4px",
                }}
              >
                <MenuItem value="PDF">PDF</MenuItem>
                {/* <MenuItem value="CSV">CSV</MenuItem>
                <MenuItem value="EXCEL">Excel</MenuItem> */}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 0.5,
              }}
            >
              No of Entries
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
              }}
            >
              {entriesCount}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleExport}
              sx={{
                width: "fit-content",
                borderRadius: "100px",
                padding: "6px 24px",
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: "20px",
                backgroundColor: theme.palette.secondary.main,
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                },
                "&:disabled": {
                  backgroundColor: theme.palette.primary.darkColor,
                },
              }}
            >
              Export Journal Entries
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ExportModal;
