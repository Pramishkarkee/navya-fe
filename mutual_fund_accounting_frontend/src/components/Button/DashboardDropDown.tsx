import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  useTheme,
  Typography,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";

const DropdownWithIcon = ({ options, value, onChange, label }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <FormControl size="small" sx={{ margin: 0, padding: 0 }}>
      <Select
        autoWidth
        labelId="dropdown-label"
        id="demo-simple-select"
        value={value}
        onChange={onChange}
        size="small"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: "250px",
              maxWidth: "auto",
              overflowY: "auto",
            },
          },
        }}
        IconComponent={() => null}
        startAdornment={
          <TuneIcon
            onClick={handleToggle}
            sx={{
              color: "#616161",
              cursor: "pointer",
              size: "small",
              fontSize: "20px",
              marginRight: "2px",
            }}
          />
        }
        variant="outlined"
        displayEmpty
        sx={{
          height: "27px",
          borderBlockColor: "white",
          borderRadius: "7px",
          backgroundColor: "#F5F5F5",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #D4D4D4",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #D4D4D4",
          },
          "& .MuiOutlinedInput-input": {
            mr: "-15px",
          },
          "&:hover": {
            "&& fieldset": {
              border: "1px solid #D4D4D4",
            },
          },
        }}
      >
        <MenuItem disabled value="">
          <Typography
            sx={{
              mt: "2px",
              color: theme.palette.grey[600],
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {`Select ${label}`}
          </Typography>
        </MenuItem>

        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DropdownWithIcon;
