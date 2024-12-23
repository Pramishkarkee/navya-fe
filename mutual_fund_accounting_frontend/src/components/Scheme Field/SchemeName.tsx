import { Box, MenuItem, Select, Typography } from "@mui/material";
import React, { useState } from "react";

const SchemeName = () => {
  var schemeName = "Navya Large Cap Fund";

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 0.5, width: "50%" }}
    >
      <Typography sx={{ fontSize: "14px" }}>Scheme Name</Typography>
      <Select size="small" value={schemeName} disabled fullWidth>
        <MenuItem value="Navya Large Cap Fund">Navya Large Cap Fund</MenuItem>
      </Select>
    </Box>
  );
};

export default SchemeName;
