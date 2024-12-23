import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, InputAdornment } from "@mui/material";
import TypographyLabel from "../InputLabel/TypographyLabel";
import { Controller } from "react-hook-form";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface DateFieldProps {
  dateLabel?: string;
  control?: any;
  maxDateValue?: any;
  minDateValue?: any;
}

const DateField = ({ dateLabel, control, maxDateValue, minDateValue }: DateFieldProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ width: "35%" }}>
          <TypographyLabel title={dateLabel} />
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <MobileDatePicker
                {...field}
                maxDate={maxDateValue}
                minDate={minDateValue}  
                format="YYYY-MM-DD"
                slotProps={{
                  textField: {
                    size: "small",
                    placeholder: "YYYY-MM-DD",
                    InputProps: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarMonthIcon />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
                sx={{
                  width: "100%",
                  "& .MuiSvgIcon-root": {
                    width: "18px",
                    height: "18px",
                  },
                }}
              />
            )}
          />
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default DateField;












// import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { Box } from "@mui/material";
// import TypographyLabel from "../InputLabel/TypographyLabel";
// import { Controller } from "react-hook-form";
// // import dayjs from "dayjs";

// interface DateFieldProps {
//   dateLabel?: string;
//   control?: any;
//   maxDateValue?: any;
//   minDateValue?: any;
// }


// const DateField = ({  dateLabel, control, maxDateValue, minDateValue }: DateFieldProps) => {
//   //  maxDateValue = dayjs();
      

//   return (
//     <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <Box sx={{ width: "35%" }}>
//           <TypographyLabel title={dateLabel} />
//           <Controller
//             name="startDate"
//             control={control}
//             render={({ field }) => (
//               <MobileDatePicker
//                 {...field}
//                 maxDate={maxDateValue}
//                 minDate={minDateValue}
  
//                 format="YYYY-MM-DD"
            
                
//                 slotProps={{ textField: { size: "small" } }}
//                 sx={{
//                   width: "100%",
//                   "& .MuiSvgIcon-root": {
//                     width: "16px",
//                     height: "16px",
//                   },
//                 }}
//               />
//             )}
//           />
//         </Box>
//       </LocalizationProvider>
//     </Box>
//   );
// };

// export default DateField;
