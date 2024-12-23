import { DatePicker, LocalizationProvider , MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box } from "@mui/material";
import TypographyLabel from "./../InputLabel/TypographyLabel";
import { Controller } from "react-hook-form";

interface DateFieldProps {
  dateLabel1: string;
  dateLabel2?: string;
  control?: any;
}

// export const getTodayDate = () => {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, '0');
//   const day = String(today.getDate()).padStart(2, '0');

//   return `${year}-${month}-${day}`;
// }

const DateField = ({ dateLabel1, dateLabel2 , control  }: DateFieldProps) => {
  
  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ width: "50%" }}>
          <TypographyLabel title={dateLabel1} />
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <MobileDatePicker
                {...field}
                format="YYYY-MM-DD"
                slotProps={{ textField: { size: "small" } }}
                sx={{
                  width: "100%",
                  "& .MuiSvgIcon-root": {
                    width: "16px",
                    height: "16px",
                  },
                }}
              />
            )}
          />
        </Box>
        {dateLabel2 && (
          <Box sx={{ width: "50%" }}>
            <TypographyLabel title={dateLabel2} />
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <MobileDatePicker
                  {...field}
                  format="YYYY-MM-DD"
                  slotProps={{ textField: { size: "small" } }}
                  sx={{
                    width: "100%",
                    "& .MuiSvgIcon-root": {
                      width: "16px",
                      height: "16px",
                    },
                  }}
                />
              )}
            />
          </Box>
        )}
      </LocalizationProvider>
    </Box>
  );
};

export default DateField;
