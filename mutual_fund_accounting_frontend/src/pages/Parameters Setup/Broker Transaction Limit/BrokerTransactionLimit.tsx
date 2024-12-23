import { Box, TextField, Divider, MenuItem } from "@mui/material";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import SchemeName from "components/Scheme Field/SchemeName";

export default function BrokerTransactionLimit() {
  const handleAddButton = () => {
    console.log("clicked1");
  };

  const handleResetButton = () => {
    console.log("clicked2");
  };

  return (
    <Box paddingTop={1}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: { xs: "70%", md: "80%", lg: "60%", xl: "40%" },
        }}
      >
        <Box sx={{width:'100%'}}>
          <SchemeName />
        </Box>
        <Box>
          <TypographyLabel title={"Stock Exchange"} />
          <TextField
            fullWidth
            select
            placeholder="Securities Code"
            size="small"
          >
            <MenuItem>ABC</MenuItem>
            <MenuItem>ABC</MenuItem>
          </TextField>
        </Box>
        <Box>
          <TypographyLabel title={"Broker Code"} />
          <TextField fullWidth placeholder="Enter Broker Code" size="small" />
        </Box>
        <Divider sx={{ mt: 0.5, mb: 0.5, color: "#BDBDBD", width: "100%" }} />
        <Box>
          <TypographyLabel title={"Transaction Limit"} />
          <TextField fullWidth size="small" placeholder="Transaction Limit" />
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
    </Box>
  );
}
