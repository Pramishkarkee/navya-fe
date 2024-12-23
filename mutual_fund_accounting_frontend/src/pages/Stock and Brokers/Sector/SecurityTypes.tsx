import React from "react";
import { Box, TextField } from "@mui/material";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";
export default function SecurityTypes() {
  const handleAddButton = () => {};

  const handleResetButton = () => {};

  return (
    <Box
      sx={{
        p: "0.5rem",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box>
        <TypographyLabel title={"Sector Type"} />
        <TextField sx={{ width: "316px" }} size="small" select />
      </Box>
      <Box>
        <TypographyLabel title={"Securites Code"} />
        <TextField placeholder="Securities Code" size="small" />
      </Box>
      <Box>
        <TypographyLabel title={"Type Name"} />
        <TextField placeholder="Enter Type Name" size="small" />
      </Box>
      <Box>
        <RoundedButton
          title1="Add"
          onClick1={handleAddButton}
          title2="Reset"
          onClick2={handleResetButton}
        />
      </Box>
    </Box>
  );
}
