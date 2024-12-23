import React from "react";
import { Box, Grid, TextField, Typography, Autocomplete } from "@mui/material";
import RoundedButton from "components/Button/Button";
import { SectorOptions } from "constants/SectorData/SectorData";
import TypographyLabel from "components/InputLabel/TypographyLabel";


export default function ParameterDefinition() {
  const OnBasisOptions = [
    "Basis Options 1",
    "Basis Options 2",
    "Basis Options 3",
  ];

  const handleAdd = () => {
    console.log("clicked add");
  };

  const handleReset = () => {
    console.log("clicked reset");
  };

  return (
    <Box sx={{ p: 0.5 }}>
      <Grid container spacing={1} sx={{ width: { xs: "60%", lg: "50%" } }}>
        <Grid item xs={6}>
          <TypographyLabel title={"Scheme Name"} />
          <TextField fullWidth size="small" />
        </Grid>

        <Grid item xs={6}>
          <TypographyLabel title={"External Limit (%)"} />
          <TextField fullWidth size="small" />
        </Grid>

        <Grid item xs={6}>
          <TypographyLabel title={"Sector"} />
          <Autocomplete
            size="small"
            options={SectorOptions}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>

        <Grid item xs={6}>
          <TypographyLabel title={"Internal Limit (%)"} />
          <TextField fullWidth size="small" />
        </Grid>

        <Grid item xs={6}>
          <TypographyLabel title={"On Basis Of"} />
          <Autocomplete
            size="small"
            options={OnBasisOptions}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <RoundedButton
          title1="Add"
          title2="Reset"
          onClick1={handleAdd}
          onClick2={handleReset}
        />
      </Box>
    </Box>
  );
}
