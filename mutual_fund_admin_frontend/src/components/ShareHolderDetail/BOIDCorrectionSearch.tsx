import { Box, TextField, Button, useTheme } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TypographyLabel from "../InputLabel/TypographyLabel";
import { Controller } from "react-hook-form";
import { ChangeEvent } from "react";

interface OwnerInformationProps {
  header?: boolean;
  control?: any;
  errors?: any;
  searchButton?: boolean;
  onClickSearch?: any;
  searchKey:string;
  handleSetSearchKey:(e:ChangeEvent<HTMLInputElement>)=>void;
}

export default function BOIDCorrectionSearch({
  control,
  errors,
  searchButton = false,
  onClickSearch,
  handleSetSearchKey,
  searchKey
}: OwnerInformationProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Box sx={{ flexBasis: "30%" }}>
          <TypographyLabel title="Search For ShareHolder" />
          <Controller
            name="boid"
            control={control}
            defaultValue="" 
            render={({ field }) => (
              <TextField
              {...field}
              onChange={handleSetSearchKey}
              value={searchKey}
              fullWidth
              size="small"
              placeholder="Search by BOID"
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
              onClick={e=>{
                e.preventDefault();
                onClickSearch();
              }}
              type="submit"
            >
              Search
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

