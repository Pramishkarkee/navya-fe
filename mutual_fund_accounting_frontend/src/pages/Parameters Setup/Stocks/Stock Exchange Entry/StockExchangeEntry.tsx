import { Box, TextField, Typography, useTheme } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";

export default function StockExchangeEntry() {
  const theme = useTheme();

  const handleAddRow = () => {
    console.log("add row clicked!!");
  };
  const handleAddEntry = () => {
    console.log("add Entry clicked!!");
  };
  const handleReset = () => {
    console.log("Reset clicked!!");
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        paddingTop: 1,
        width: { xs: "70%", md: "80%", lg: "60%", xl: "40%" },
      }}
    >
      <Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <TypographyLabel title={"Stock Exchange Code"} />
            <TextField
              fullWidth
              size="small"
              placeholder="Stock Exchange Code"
            />
          </Box>
          <Box>
            <TypographyLabel title={"Name"} />
            <TextField fullWidth size="small" placeholder="Name" />
          </Box>
          <Box>
            <TypographyLabel title={"Stock Index"} />
            <TextField fullWidth size="small" placeholder="Stock Index" />
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Box width="50px">
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                borderBottom: `1px solid ${theme.palette.secondary.main}`,
                lineHeight: "19px",
                color: "#212121",
                textAlign: "center",
              }}
            >
              Details
            </Typography>
          </Box>
          <Box>
            <TypographyLabel title={"Comm Type"} />
            <TextField fullWidth size="small" placeholder="Comm Type" />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ width: "50%" }}>
                <TypographyLabel title={"Range From"} />
                <DatePicker
                  sx={{
                    width: "100%",
                    "& .MuiSvgIcon-root": {
                      width: "16px",
                      height: "16px",
                    },
                  }}
                  slotProps={{
                    textField: { size: "small" },
                  }}
                />
              </Box>
              <Box sx={{ width: "50%" }}>
                <TypographyLabel title={"Range To"} />
                <DatePicker
                  sx={{
                    width: "100%",
                    "& .MuiSvgIcon-root": {
                      width: "16px",
                      height: "16px",
                    },
                  }}
                  slotProps={{
                    textField: { size: "small" },
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Box sx={{ width: "50%" }}>
              <TypographyLabel title={"Value"} />
              <TextField fullWidth size="small" placeholder="Enter Value" />
            </Box>
            <Box sx={{ width: "50%" }}>
              <TypographyLabel title={"Value Type"} />
              <TextField
                fullWidth
                size="small"
                placeholder="Value Type"
                select
              ></TextField>
            </Box>
          </Box>
        </Box>
        <Box mt={2}>
          <RoundedButton title1="Add Row" onClick1={handleAddRow} />
        </Box>
      </Box>
      <Box>
        <Box width="50px" mt={3}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              borderBottom: `1px solid ${theme.palette.secondary.main}`,
              lineHeight: "19px",
              color: "#212121",
              textAlign: "center",
            }}
          >
            Entries
          </Typography>
        </Box>
        <Box>
          <Typography>Table Data goes here.... See Yaa!!!</Typography>
        </Box>
        <Box mt={2}>
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
