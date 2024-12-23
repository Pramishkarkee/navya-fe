import { Box, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import SchemeName from "components/Scheme Field/SchemeName";
import dayjs from "dayjs";
import { useEffect } from "react";

//react hook form
import { useForm, Controller, SubmitHandler } from "react-hook-form";

interface IFormInputs {
  schemeName: string;
  navValue: number;
  navDate: string;
}

export default function NavEntryForm() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitSuccessful, errors },
  } = useForm<IFormInputs>({
    defaultValues: {
      schemeName: "Navya Large Cap Fund",
      navValue: 0,
      navDate: "",
    },
  });

  const handleAdd: SubmitHandler<IFormInputs> = (data) => {
    console.log("Form data", data);
  };
  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  return (
    <Box component="form" onSubmit={handleSubmit(handleAdd)}>
      <Box
        sx={{
          p: "0.5rem 0.5rem 0.5rem 0",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <SchemeName />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ width: "50%" }}>
            <TypographyLabel title={"Nav Value"} />
            <Controller
              name="navValue"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  placeholder="Enter Nav Value"
                  size="small"
                />
              )}
            />
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ width: "50%" }} mb={1}>
              <TypographyLabel title={"Nav Date"} />
              <Controller
                name="navDate"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value, ref } }) => {
                  return (
                    <DatePicker
                      value={value ? value : null}
                      onChange={onChange}
                      inputRef={ref}
                      // {...field}
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
                  );
                }}
              />
            </Box>
          </LocalizationProvider>
        </Box>

        {/* <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <Box sx={{ flex: "calc(50%-2rem)" }}>
            <TypographyLabel title={"Nav Entry BY"} />
            <Controller
              name="entryBy"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ width: "100%" }}
                  placeholder="Enter Your Name"
                  size="small"
                />
              )}
            />
          </Box>

          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box mb={0.7}>
                <TypographyLabel title={"Nav Entry Date"} />
                <Controller
                  name="entryDate"
                  control={control}
                  render={({ field: { onChange, value, ref } }) => {
                    return (
                      <DatePicker
                        value={value ? value : null}
                        onChange={onChange}
                        inputRef={ref}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            width: "16px",
                            height: "16px",
                          },
                        }}
                        slotProps={{
                          textField: { size: "small" },
                        }}
                      />
                    );
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>
        </Box> */}
        {/* <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <Box sx={{ flex: "calc(50%-1rem)" }}>
            <TypographyLabel title={"Nav Approved By"} />
            <TextField
              fullWidth
              placeholder="Enter Approver's Name"
              size="small"
            />
          </Box>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box mb={0.5}>
              <TypographyLabel title={"Nav Approved Date"} />
              <DatePicker
                sx={{
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
        </Box> */}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
        }}
      >
        <Box>
          <RoundedButton title1="Submit Nav" onClick1={handleAdd} />
        </Box>
      </Box>
    </Box>
  );
}
