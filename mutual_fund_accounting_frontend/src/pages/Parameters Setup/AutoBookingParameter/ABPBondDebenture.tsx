import React, { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
} from "@mui/material";
import RoundedButton from "components/Button/Button";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { colorTokens } from "../../../theme";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import SchemeName from "components/Scheme Field/SchemeName";

export default function BondAndDebenture() {
  const handleAdd = () => {
    console.log("ADD clicked");
  };

  const handleReset = () => {
    console.log("RESET clicked");
  };

  const handleAuthorize = () => {
    console.log("AUTHOROZE clicked");
  };

  const handleReject = () => {
    console.log("REJECT clicked");
  };

  const [selectedMenu, setSelectedMenu] = useState<string>("Entry");
  const handleChange = (e: SelectChangeEvent<typeof selectedMenu>) => {
    setSelectedMenu(e.target.value);
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
        <Box sx={{ width: { xs: "70%", md: "50%", lg: "50%" } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
            <Box>
              <SchemeName />
            </Box>
            <Box>
              <TypographyLabel title={"Auto Booking ID"} />
              <TextField
                fullWidth
                // sx={{ width: "232px", height: "32px" }}
                size="small"
                placeholder="Auto Booking ID"
              ></TextField>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              marginTop: "2rem",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <TypographyLabel title={"Name"} />
                  <TextField
                    size="small"
                    placeholder="Name"
                    sx={{ width: "150px", height: "32px" }}
                  ></TextField>
                </Box>
                <Box>
                  <TypographyLabel title={"Booking Amount"} />
                  <TextField
                    size="small"
                    placeholder="Booking Amount"
                    sx={{ width: "150px", height: "32px" }}
                  ></TextField>
                </Box>
              </Box>
              <Box>
                <TypographyLabel title={"Account Head (DR)"} />
                <TextField
                  size="small"
                  placeholder="Account Head(DR)"
                  sx={{ width: "320px", height: "32px" }}
                ></TextField>
              </Box>
              <Box>
                <TypographyLabel title={"Account Head (CR)"} />
                <TextField
                  size="small"
                  placeholder="Account Head(CR)"
                  sx={{ width: "320px", height: "32px" }}
                ></TextField>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box>
                    <TypographyLabel title={"Effective Date"} />
                    <DatePicker
                      sx={{
                        width: "153px",
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
                    <TypographyLabel title={" Valid Up To"} />
                    <DatePicker
                      sx={{
                        width: "153px",
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
                </LocalizationProvider>
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  mb: -0.8,
                }}
              >
                <Box>
                  <TypographyLabel title={"Purchse Units"} />
                  <TextField
                    size="small"
                    placeholder="Your Purchsed Units"
                    sx={{ width: "150px" }}
                  />
                </Box>
                <Box>
                  <TypographyLabel title={"Purchase Date"} />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{
                        width: "150px",
                        "& .MuiSvgIcon-root": {
                          width: "16px",
                          height: "16px",
                        },
                      }}
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </LocalizationProvider>
                </Box>
              </Box>
              <Box mb={-0.5}>
                <TypographyLabel title={"Ledger Head (Dr)"} />
                <TextField
                  size="small"
                  placeholder="Ledger Head(DR)"
                  sx={{ width: "320px", height: "32px" }}
                ></TextField>
              </Box>
              <Box mt={0.3}>
                <TypographyLabel title={"Ledger Head (CR)"} />
                <TextField
                  size="small"
                  placeholder="Ledger Head(CR)"
                  sx={{ width: "320px", height: "32px" }}
                ></TextField>
              </Box>
              <Box mt={0.1}>
                <TypographyLabel title={"Number of Days"} />
                <TextField
                  size="small"
                  placeholder="Number of Days"
                  sx={{ width: "148px", height: "32px" }}
                ></TextField>
              </Box>
            </Box>
          </Box>

          <Box mt={3}>
            <RoundedButton
              title1="Add"
              title2="Reset"
              onClick1={handleAdd}
              onClick2={handleReset}
            />
          </Box>
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
            <Box sx={{ width: "50%" }}>
              <TypographyLabel title={"Scheme Name"} />
              <TextField fullWidth size="small" select />
            </Box>
            <Box>
              <TypographyLabel title={"Auto Booking Id"} />
              <TextField sx={{ width: "50%" }} size="small" select />
            </Box>
            <Box>
              <Typography>Tabular data goes here...seee yaa!!!</Typography>
            </Box>
            <Box sx={{ width: "50%" }}>
              <InputLabel>Posting Remarks</InputLabel>
              <TextField fullWidth placeholder="Your Remarks" />
            </Box>
            <Box mt={1}>
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
