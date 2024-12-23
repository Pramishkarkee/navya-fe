import {
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import SchemeName from "components/Scheme Field/SchemeName";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";

interface IFormInput {
  SchemeName: string;
  navDate: string;
}
export default function NavEntryFormPosting() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitSuccessful, errors },
  } = useForm<IFormInput>({
    defaultValues: {
      SchemeName: "Navya Large Cap Fund",
      navDate: "",
    },
  });

  const theme = useTheme();

  const handleAuthorize: SubmitHandler<IFormInput> = (data) => {
    console.log("form data", data);
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  const handleReject = () => {
    console.log("clicked Reject");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleAuthorize)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <SchemeName />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box mb={1} sx={{ width: "50%" }}>
          <TypographyLabel title={"Nav Date"} />
          <Controller
            name="navDate"
            control={control}
            rules={{
              required: { value: true, message: "Nav Date is required" },
            }}
            render={({ field: { onChange, value, ref } }) => {
              return (
                <DatePicker
                  value={value ? value : null}
                  onChange={onChange}
                  inputRef={ref}
                  sx={{
                    width: "75%",
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

      <Box>
        <Stack spacing={2}>
          <Paper
            elevation={0}
            sx={{
              width: "50%",
              borderRadius: "12px",
              border: `1px solid ${theme.palette.primary.dark}`,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  lineHeight: "17px",
                  color: theme.palette.secondary[1000],
                  borderBottom: ` 1px solid ${theme.palette.primary.dark}`,
                  padding: 1,
                }}
              >
                Nav Value Entry
              </Typography>
            </Box>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 1,
                }}
              >
                <Typography>Nav Value</Typography>
                <Typography>10.23</Typography>
              </Box>
              <Divider sx={{ padding: "0 8px " }} />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 1,
                }}
              >
                <Typography>Entry By</Typography>
                <Typography>Simon Harper</Typography>
              </Box>
              <Divider sx={{}} />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 1,
                }}
              >
                <Typography>Entry Date</Typography>
                <Typography>07/03/2024</Typography>
              </Box>
            </Box>
          </Paper>
        </Stack>
      </Box>

      <Box>
        <RoundedButton
          title1="Authorize"
          onClick1={handleAuthorize}
          title2="Reject"
          onClick2={handleReject}
        />
      </Box>
    </Box>
  );
}
