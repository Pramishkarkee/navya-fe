import React from "react";
import {
  Box,
  TextField,
  Autocomplete,
  useTheme,
  Typography,
} from "@mui/material";
import TypographyLabel from "../InputLabel/TypographyLabel";


const BankDetails = ({ bankNameOptions, branchNameOptions }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ width: "max-content" }}>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "19px",
            color: "#212121",
            textAlign: "center",
            width: "max-content",
            borderBottom: `1px solid ${theme.palette.primary[1100]}`,
          }}
        >
          {" "}
          Bank Details{" "}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Box sx={{ width: "50%" }}>
          <TypographyLabel title="Bank Name" />
          <Autocomplete
            size="small"
            id="controllable-states-demo"
            sx={{ "& .MuiSvgIcon-root": { width: "20px", height: "20px" } }}
            options={bankNameOptions}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
        <Box sx={{ width: "50%" }}>
          <TypographyLabel title="Branch Name" />
          <Autocomplete
            size="small"
            id="controllable-states-demo"
            sx={{ "& .MuiSvgIcon-root": { width: "20px", height: "20px" } }}
            options={branchNameOptions}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
        <Box sx={{ width: "50%" }}>
          <TypographyLabel title="Account Number" />
          <TextField fullWidth size="small" placeholder="BOID Number" />
        </Box>
      </Box>
    </Box>
  );
};

export default BankDetails;
