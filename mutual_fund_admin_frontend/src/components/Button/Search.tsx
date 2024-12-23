import React from "react";
import { InputAdornment, OutlinedInput, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchButtonProps {
  title: string;
  onClick?: () => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  sx?: React.CSSProperties;
}

const SearchText: React.FC<SearchButtonProps> = ({
  title,
  onClick,
  onChange,
  value,
  sx,
}) => {
  const theme = useTheme();
  return (
    <OutlinedInput
      placeholder={title}
      size="small"
      endAdornment={
        <InputAdornment position="end">
          <SearchIcon
            sx={{ color: "#616161", cursor: "pointer" }}
            onClick={onClick}
          />
        </InputAdornment>
      }
      onChange={onChange}
      value={value}
      sx={{
        width: "300px",
        borderRadius: "100px",
        padding: "6px 12px",
        fontSize: "14px",
        fontWeight: 600,
        // lineHeight: "20px",
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary[1300],
        textTransform: "none",
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        "&::placeholder": {
          color: theme.palette.text.primary,
        },
        ...sx,
      }}
    />
  );
};

export default SearchText;
