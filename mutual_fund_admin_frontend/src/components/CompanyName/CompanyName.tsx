import React, { useState } from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material";

const CompanyName = () => {
  const [companyName, setCompanyName] = useState("NIC ASIA Capital");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        mb: 1.5,
        width: "50%",
      }}
    >
      <Typography sx={{ fontSize: "14px" }}>Scheme Name</Typography>
      <Select size="small" value={companyName} disabled fullWidth>
        <MenuItem value="NIC ASIA Capital">NIC ASIA Capital</MenuItem>
      </Select>
    </Box>
  );
};

export default CompanyName;
