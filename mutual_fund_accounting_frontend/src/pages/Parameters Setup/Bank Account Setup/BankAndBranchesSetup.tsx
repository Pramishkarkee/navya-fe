import { Box, TextField, Typography, useTheme, MenuItem } from "@mui/material";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";

export default function BankAndBranchesSetup() {
  const theme = useTheme();
  const handleAddRow = () => {
    console.log("ADD clicked");
  };
  const handleAddEntry = () => {
    console.log("ADD entry clicked");
  };
  const handleReset = () => {
    console.log("Reset clicked");
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: { xs: "70%", md: "80%", lg: "60%", xl: "40%" },
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
          }}
        >
          <Box>
            <TypographyLabel title={"Bank Code"} />
            <TextField fullWidth size="small" select>
              <MenuItem>ABC</MenuItem>
              <MenuItem>ABC</MenuItem>
            </TextField>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Box>
              <TypographyLabel title={"NRB Symbol"} />
              <TextField fullWidth size="small" placeholder="NRB Symbol" />
            </Box>
            <Box>
              <TypographyLabel title={"CDS Code"} />
              <TextField fullWidth size="small" placeholder="CDS Code" />
            </Box>
            <Box>
              <TypographyLabel title={"CIPS Code"} />
              <TextField fullWidth size="small" placeholder="CIPS Code" />
            </Box>
          </Box>
          <Box>
            <TypographyLabel title={"Bank Name"} />
            <TextField fullWidth size="small" placeholder="Bank Name" />
          </Box>
          <Box>
            <TypographyLabel title={"Address"} />
            <TextField fullWidth size="small" placeholder="Address" />
          </Box>
        </Box>
      </Box>
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
          }}
        >
          <Box sx={{ width: "max-content" }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "19px",
                color: "#212121",
                textAlign: "center",
                width: "max-content",
                borderBottom: `1px solid ${theme.palette.secondary.main}`,
              }}
            >
              {" "}
              Details{" "}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Box sx={{ width: "50%" }}>
              <TypographyLabel title={"Branch ID"} />
              <TextField fullWidth size="small" placeholder="Branch ID" />
            </Box>
            <Box sx={{ width: "50%" }}>
              <TypographyLabel title={"CIPS Code"} />
              <TextField fullWidth size="small" placeholder="CIPS Code" />
            </Box>
          </Box>
          <Box>
            <TypographyLabel title={"Address"} />
            <TextField fullWidth size="small" placeholder="Address" />
          </Box>
          <Box>
            <TypographyLabel title={"Telephone Number"} />
            <TextField
              fullWidth
              type="number"
              size="small"
              placeholder="Telephone Number"
            />
          </Box>
          <RoundedButton title1="Add Row" onClick1={handleAddRow} />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ width: "max-content" }}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "19px",
              color: "#212121",
              textAlign: "center",
              width: "max-content",
              borderBottom: `1px solid ${theme.palette.secondary.main}`,
            }}
          >
            {" "}
            Entries{" "}
          </Typography>
        </Box>
        <Box>
          <Typography>Table goes here....SEE YAA!!!</Typography>
        </Box>
        <Box>
          <RoundedButton
            title1="Add Entry"
            title2="Reset"
            onClick1={handleAddEntry}
            onClick2={handleReset}
          />
        </Box>
      </Box>
    </Box>
  );
}
