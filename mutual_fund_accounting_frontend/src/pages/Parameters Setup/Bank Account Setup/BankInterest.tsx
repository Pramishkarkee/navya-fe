import { Box, TextField, MenuItem } from "@mui/material";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";

export default function BankInterest() {
  const handleAddEntry = () => {
    console.log("ADD entry clicked");
  };
  const handleReset = () => {
    console.log("Reset clicked");
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: { xs: "70%", md: "80%", lg: "60%", xl: "40%" },
        }}
      >
        <Box>
          <TypographyLabel title={"Scheme Name"} />
          <TextField fullWidth size="small" select placeholder="Scheme Name ">
            <MenuItem>ABC</MenuItem>
            <MenuItem>ABC</MenuItem>
          </TextField>
        </Box>
        <Box>
          <TypographyLabel title={"Bank Account"} />
          <TextField fullWidth size="small" placeholder="Bank Account " />
        </Box>
        <Box>
          <TypographyLabel title={"Account Type"} />
          <TextField fullWidth size="small" select placeholder="Account Type ">
            <MenuItem>ABC</MenuItem>
            <MenuItem>ABC</MenuItem>
          </TextField>
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
