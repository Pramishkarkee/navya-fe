import {
  Box,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  useTheme,
} from "@mui/material";
import TypographyLabel from "../InputLabel/TypographyLabel";

interface RadioButtonsProps {
  value: string;
  onChange?: () => void;
}
const RadioButtons = ({ value, onChange }: RadioButtonsProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
      }}
    >
      <TypographyLabel title="Request Type" />
      <FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-controlled-radio-buttons-group"
          //   name="controlled-radio-buttons-group"
          value={value}
          onChange={onChange}
        >
          <FormControlLabel
            value="Purchase"
            control={
              <Radio
                sx={{
                  "&.MuiButtonBase-root": {
                    "&.Mui-checked": {
                      color: theme.palette.primary[1100],
                    },
                  },
                }}
              />
            }
            label="Purchase"
          />
          <FormControlLabel
            value="Redeemption"
            control={
              <Radio
                sx={{
                  "&.MuiButtonBase-root": {
                    "&.Mui-checked": {
                      color: theme.palette.primary[1100],
                    },
                  },
                }}
              />
            }
            label="Redeemption"
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default RadioButtons;
