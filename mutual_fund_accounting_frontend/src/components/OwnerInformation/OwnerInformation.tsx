import {
  Box,
  TextField,
  Autocomplete,
  Button,
  useTheme,
  Typography,
} from "@mui/material";
import TypographyLabel from "../InputLabel/TypographyLabel";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

interface OwnerInformationProps {
  searchButton?: boolean;
  header?: boolean;
  control?: any;
  errors?: any;
  onClickSearch?: () => void;
}

export default function OwnerInformation({
  searchButton = false,
  header = false,
  onClickSearch,
}: OwnerInformationProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {header && (
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
            Owner Information
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Box sx={{ flexBasis: "50%" }}>
          <TypographyLabel title="Depository Participants" />
          <Autocomplete
            size="small"
            id="controllable-states-demo"
            sx={{ "& .MuiSvgIcon-root": { width: "20px", height: "20px" } }}
            options={['a', 'b']}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
        <Box sx={{ flexBasis: "50%" }}>
          <TypographyLabel title="BOID" />
          <TextField fullWidth size="small" placeholder="BOID Number" />
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
            >
              Search
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
