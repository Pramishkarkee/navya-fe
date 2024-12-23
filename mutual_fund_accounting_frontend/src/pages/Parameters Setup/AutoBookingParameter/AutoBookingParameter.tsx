import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme,
  Autocomplete,
} from "@mui/material";
import RoundedButton from "components/Button/Button";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { colorTokens } from "../../../theme";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import {
  ledgerHeadOptionsCredit,
  ledgerHeadOptionsDebit,
  schemaNameOptions,
  timePeriodOptions,
} from "constants/Stock Data/StockData";

export default function AutoBookingParameter() {
  const theme = useTheme();
  const [selectedMenu, setSelectedMenu] = useState<string>("Entry");
  const [error, setError] = useState<string>("");
  const [effectiveStartDate, setEffectiveStartDate] = useState<Date | null>(
    null
  );
  const [endingDate, setEndingDate] = useState<Date | null>(null);
  const [numberOfDays, setNumberOfDays] = useState<number | null>(null);

  const handleAdd = () => {
    console.log("ADD clicked");
  };

  const handleAuthorize = () => {
    console.log("AUTHOROZE clicked");
  };

  const handleReject = () => {
    console.log("REJECT clicked");
  };

  const handleChange = (e: SelectChangeEvent<typeof selectedMenu>) => {
    setSelectedMenu(e.target.value);
  };

  const handleEffectiveDateChange = (date: Date | null) => {
    setEffectiveStartDate(date);
    setError("");
    calculateTimePeriod();
  };

  const handleEndingDateChange = (date: Date | null) => {
    setEndingDate(date);
    setError("");
    calculateTimePeriod();
  };

  const calculateTimePeriod = (): string | null => {
    if (effectiveStartDate && endingDate) {
      // Compare if endingDate is after effectiveDate
      if (endingDate.getTime() > effectiveStartDate.getTime()) {
        const differenceInTime =
          endingDate.getTime() - effectiveStartDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        setNumberOfDays(differenceInDays);
        return differenceInDays.toString() + " days";
      } else {
        setError("Ending date should be after effective date");
        return null;
      }
    }
    return null;
  };

  return (
    <Box>
      <Box paddingTop={1}>
        <FormControl sx={{ width: "150px" }}>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            value={selectedMenu}
            onChange={handleChange}
            sx={{
              borderRadius: "24px",
              backgroundColor: colorTokens.grey[100],
              "& .MuiInputBase-input": {
                padding: "10px",
              },
            }}
          >
            <MenuItem value={"Entry"}>Entry</MenuItem>
            <MenuItem value={"Posting"}>Posting</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {selectedMenu === "Entry" ? (
        <Box>
          {/* {error && <Typography color="error">{error}</Typography>} */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
            <Box sx={{ width: "50px" }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "19px",
                  color: "#212121",
                  textAlign: "center",
                  width: "max-content",
                  borderBottom: `1px solid ${theme.palette.secondary.main}`,
                }}
              >
                {" "}
                Scheme Details and Identifier{" "}
              </Typography>
            </Box>
            <Box sx={{ width: { xs: "70%", lg: "45%" } }}>
              <TypographyLabel title={"Scheme Name"} />

              <Autocomplete
                size="small"
                options={schemaNameOptions}
                // multiple={false}
                renderInput={(params) => (
                  <TextField placeholder="NIC ASIA MUTUAL FUND" {...params} />
                )}
              />
            </Box>
            <Box>
              <TypographyLabel title={"Automation Name"} />
              <TextField
                sx={{ width: { xs: "70%", lg: "45%" } }}
                size="small"
                placeholder="Name of Automation"
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              marginTop: "1rem",
              gap: 2,
              width: { xs: "70%", lg: "50%" },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ width: "50px" }}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "19px",
                    color: "#212121",
                    textAlign: "center",
                    width: "max-content",
                    borderBottom: `1px solid ${theme.palette.secondary.main}`,
                  }}
                >
                  {" "}
                  Automation Details{" "}
                </Typography>
              </Box>
              <Box>
                <TypographyLabel title={"Total Amount"} />
                <TextField
                  sx={{ width: "100%" }}
                  size="small"
                  placeholder="400000"
                />
              </Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <TypographyLabel title={"Effective Date"} />
                    <DatePicker
                      value={effectiveStartDate}
                      onChange={handleEffectiveDateChange}
                      sx={{
                        width: "200px",
                        height: "34px",
                        "& .MuiSvgIcon-root": {
                          width: "16px",
                          height: "16px",
                        },
                      }}
                      slotProps={{
                        textField: { size: "small" },
                      }}
                    />
                  </Box>
                  <Box>
                    <TypographyLabel title={"Ending Date"} />
                    <DatePicker
                      value={endingDate}
                      onChange={handleEndingDateChange}
                      sx={{
                        width: "200px",
                        "& .MuiSvgIcon-root": {
                          width: "16px",
                          height: "16px",
                        },
                      }}
                      slotProps={{
                        textField: { size: "small" },
                      }}
                    />
                    {error && <Typography color="error">{error}</Typography>}
                  </Box>
                </Box>
                <Box>
                  <TypographyLabel title={"Time Period"} />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      sx={{ width: "50%" }}
                      placeholder={numberOfDays ? numberOfDays.toString() : ""}
                      size="small"
                    >
                      {" "}
                      days
                    </TextField>
                    <Autocomplete
                      sx={{ width: "50%" }}
                      size="small"
                      options={timePeriodOptions}
                      renderInput={(params) => (
                        <TextField placeholder="Daily" {...params} />
                      )}
                    />
                  </Box>
                </Box>
              </LocalizationProvider>

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}
              >
                <Box sx={{ width: "50px" }}>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      lineHeight: "19px",
                      color: "#212121",
                      textAlign: "center",
                      width: "max-content",
                      borderBottom: `1px solid ${theme.palette.secondary.main}`,
                    }}
                  >
                    {" "}
                    Automation Ledger Details{" "}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                  <Box sx={{ width: "200px" }}>
                    <TypographyLabel title={"Ledger Head (Debit)"} />
                    <Autocomplete
                      size="small"
                      options={ledgerHeadOptionsDebit}
                      renderInput={(params) => (
                        <TextField
                          placeholder="Stock Broker - Payable"
                          {...params}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ width: "200px" }}>
                    <TypographyLabel title={"Ledger Head (Credit)"} />
                    <Autocomplete
                      size="small"
                      options={ledgerHeadOptionsCredit}
                      renderInput={(params) => (
                        <TextField placeholder="NIC ASIA Bank" {...params} />
                      )}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box mt={3}>
            <RoundedButton title1="Add Automation" onClick1={handleAdd} />
          </Box>
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ width: "50%" }}>
              <TypographyLabel title={"Scheme Name"} />
              <TextField fullWidth size="small" select></TextField>
            </Box>
            <Box>
              <TypographyLabel title={"Auto Booking Id"} />
              <TextField sx={{ width: "50%" }} size="small" select></TextField>
            </Box>
            {/* <Box>
              <Typography>Tabular data goes here...seee yaa!!!</Typography>
            </Box> */}
            <Box mt={3}>
              <RoundedButton
                title1="Authorize"
                title2="Reject"
                onClick1={handleAuthorize}
                onClick2={handleReject}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
