import { Box, TextField, Button, useTheme } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TypographyLabel from "../InputLabel/TypographyLabel";
import { Controller } from "react-hook-form";

interface OwnerInformationProps {
  header?: boolean;
  control?: any;
  errors?: any;
  searchButton?: boolean;
  onClickSearch?: any;
  resetButton?: boolean;
  onClickReset?: any;
}

export default function OwnerInformation({
  control,
  errors,
  searchButton = false,
  resetButton = false,
  onClickSearch,
  onClickReset,
}: OwnerInformationProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Box sx={{ flexBasis: "30%" }}>
          <TypographyLabel title="Enter Details" />
          <Controller
            name="boid"
            control={control}
            defaultValue="" 
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder="Enter Share Holder Details"
                error={Boolean(errors?.boid)}
                helperText={errors?.boid?.message}
              />
            )}
          />
        </Box>

        {searchButton && (
          <Box mt={3.5}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderRadius: "24px",
                width: "max-content",
                height: "auto",
                padding: "4px 8px",
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary[1100],
                borderColor: "white",
              }}
              startIcon={<SearchOutlinedIcon />}
              onClick={onClickSearch}
              type="submit"
            >
              Search
            </Button>
          </Box>
        )}
         {resetButton && (
          <Box mt={3.5}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderRadius: "24px",
                width: "max-content",
                height: "auto",
                padding: "4px 8px",
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary[1100],
                borderColor: "white",
              }}
              // startIcon={<SearchOutlinedIcon />}
              onClick={onClickReset}
              type="button"
            >
              Reset
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

