import React, { useState } from "react";
import {
  Grid,
  Box,
  SelectChangeEvent,
  FormControl,
  Select,
  MenuItem,
  Typography,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RoundedButton from "components/Button/Button";
import { colorTokens } from "../../../theme";
import TypographyLabel from "components/InputLabel/TypographyLabel";

export default function BondAndDebentureAmortization() {
  const [selectedMenu, setSelectedMenu] = useState<string>("Entry");

  const handleAdd = () => {
    console.log("ADD clicked");
  };

  const handleReset = () => {
    console.log("RESET clicked");
  };

  const handleAuthorize = () => {
    console.log("Authorized clicked");
  };

  const handleReject = () => {
    console.log("Reject clicked");
  };

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
        <Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
            <Box>
              <TypographyLabel title={"Scheme Name"} />
              <TextField sx={{ width: "50%" }} size="small" select>
                <MenuItem>ABC</MenuItem>
                <MenuItem>ABC</MenuItem>
              </TextField>
            </Box>
            <Box>
              <TypographyLabel title={"Auto Booking ID"} />
              <TextField
                sx={{ width: "50%" }}
                size="small"
                placeholder="Auto Booking ID"
              ></TextField>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              marginTop: "1rem",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <TypographyLabel title={"Name"} />
                <TextField
                  size="small"
                  placeholder="Name"
                  sx={{ width: "320px", height: "32px" }}
                ></TextField>
              </Box>
              <Box>
                <TypographyLabel title={"Stock Account"} />
                <TextField
                  size="small"
                  placeholder="Stock Account"
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
                    <TypographyLabel title={"Valid Up To"} />
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
              <Box mb={-1}>
                <TypographyLabel title={"Booking Amount"} />
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Booking Amount"
                />
              </Box>
              <Box mb={-2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TypographyLabel title={"Purchase Date"} />
                  <DatePicker
                    slotProps={{ textField: { size: "small" } }}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        width: "16px",
                        height: "16px",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
              <Box mt={1}>
                <TypographyLabel title={"Number of Days"} />
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Number of Days"
                />
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
              <TypographyLabel title={"Posting Remark"} />
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
