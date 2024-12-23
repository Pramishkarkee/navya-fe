import { Typography } from "@mui/material";
import React from "react";

const TypographyLabel = ({ title }) => {
  return (
    <Typography sx={{ fontSize: "14px",  mb: "4px", width: "max-content" }}>
      {" "}
      {title}{" "}
    </Typography>
  );
};

export default TypographyLabel;
