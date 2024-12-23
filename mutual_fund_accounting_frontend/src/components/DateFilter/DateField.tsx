import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box } from "@mui/material";
import TypographyLabel from "../InputLabel/TypographyLabel";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";
import { useGlobalStore } from "store/GlobalStore";

interface DateFieldProps {
  dateLabel1: string;
  dateLabel2?: string;
  control?: any;
  maxDateValue?: any;
  isMinDate?: boolean;
}

const DateField = ({
  dateLabel1,
  dateLabel2,
  control,
  maxDateValue,
  isMinDate = true,
}: DateFieldProps) => {
  const allotmentDate = useGlobalStore((state) => state.allotmentDate);
  // const { setAllotmentDate }= useGlobalStore()

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
                maxDate={maxDateValue}
                 minDate={dayjs(isMinDate && allotmentDate)}
                format="YYYY-MM-DD" // format should be in "DD-MM-YYYY"
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
                  format="YYYY-MM-DD" // format should be in "DD-MM-YYYY"
                  maxDate={maxDateValue}
                  minDate={dayjs(isMinDate && allotmentDate)}
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
