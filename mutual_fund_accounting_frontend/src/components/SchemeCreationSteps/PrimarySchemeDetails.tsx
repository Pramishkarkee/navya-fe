// import {
//     Box,
//     TextField,
//     useTheme,
//     Typography,
//     Select,
//     MenuItem,
//   } from "@mui/material";
//   import RoundedButton from "components/Button/Button";
//   import TypographyLabel from "components/InputLabel/TypographyLabel";
//   import { Controller, useForm } from "react-hook-form";
//   import * as yup from "yup";
//   import { yupResolver } from "@hookform/resolvers/yup";
//   import { usePostPrimarySchemeDetails } from "services/MutualFundSetup/MutualFundSetupServices";
//   import { useState, useEffect } from "react";
//   import SuccessBar from "components/Snackbar/SuccessBar";
//   import ErrorBar from "components/Snackbar/ErrorBar";
//   import axios from "axios";
//   import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
//   import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
//   import dayjs from "dayjs";
  
//   export interface Data {
//     scheme_number: string;
//     maturity_date: Date;
//     nav_calculation_method: string;
//     authorized_capital: string;
//     scheme_size: string;
//     allotment_date: Date;
//     allotted_capital: string;
//     total_subscribed_units: string;
//   }

//   export default function StockEntry() {
//     const theme = useTheme();
//     const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
//     const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
//     const [errorMsgs, setErrorMsgs] = useState("");
//     const [successMsgs, setSuccessMsgs] = useState("");

//     const {
//       mutate: PrimaryScheme,
//       isSuccess: PrimarySchemeSuccess,
//       isError: PrimarySchemekError,
//     } = usePostPrimarySchemeDetails();
  
//     const schema = yup
//       .object({
//         scheme_number: yup.string().required("Scheme Number is required"),
//         maturity_date: yup.date().required("Maturity Date is required"),
//         nav_calculation_method: yup.string().required("NAV Calculation Method is required"),
//         authorized_capital: yup.string().required("Authorized Capital is required"),
//         scheme_size: yup.string().required("Scheme Size is required"),
//         allotment_date: yup.date().required("Allotment Date is required"),
//         allotted_capital: yup.string().required("Allotted Capital is required"),
//         total_subscribed_units: yup.string().required("Total Subscribed Units is required"),
//       })
//       .required();
  
//     const {
//       handleSubmit,
//       reset,
//       control,
//     //   setValue,
//     //   watch,
//       formState: { errors },
//     } = useForm<Data>({
//       resolver: yupResolver<any>(schema),
//       defaultValues: {
//         scheme_number: "",
//         maturity_date: null,
//         nav_calculation_method: "daily",
//         authorized_capital: "",
//         scheme_size: "",
//         allotment_date: null,
//         allotted_capital: "",
//         total_subscribed_units: "",
//       },
//     });
  
//     const onSubmit = (data: Data) => {
//       const tempData = {
//         scheme_number: data.scheme_number,
//         maturity_date: dayjs(data.maturity_date).format("YYYY-MM-DD"),
//         nav_calculation_method: data.nav_calculation_method,
//         authorized_capital: data.authorized_capital,
//         scheme_size: data.scheme_size,
//         allotment_date: dayjs(data.allotment_date).format("YYYY-MM-DD"),
//         allotted_capital: data.allotted_capital,
//         total_subscribed_units: data.total_subscribed_units,
//       };
  
//       PrimaryScheme(tempData, {
//         onSuccess: () => {
//           setErrorMsgs(null);
//           setSuccessMsgs("Submitted Successfully");
//           setSnackbarSuccessOpen(true);
//           reset();
//         },
//         onError: (error) => {
//             if(axios.isAxiosError(error) && error.response) {
//                 setErrorMsgs(
//                error.response.data.message
//                 ? error.response.data.message
//               : "Network error occurred."
//           );
//           setSnackbarErrorOpen(true);
//         }
//        },
//       });
//     };
  
//     useEffect(() => {
//       if (PrimarySchemeSuccess) {
//         setSnackbarSuccessOpen(true);
//       }
//       if (PrimarySchemekError) {
//         setSnackbarErrorOpen(true);
//       }
//     }, [PrimarySchemeSuccess, PrimarySchemekError]);
  
  
//     return (
//       <Box>
//         <Box
//           sx={{
//             paddingTop: 1,
//             display: "flex",
//             flexDirection: "column",
//             gap: 2,
//             width: { xs: "50%", md: "60%", lg: "80%", xl: "80%" },
//           }}
//           component="form"
//           onSubmit={handleSubmit(onSubmit)}
//         >
//           <Typography
//             sx={{
//               fontSize: "16px",
//               fontWeight: 600,
//               lineHeight: "19px",
//               color: "#212121",
//               textAlign: "center",
//               width: "max-content",
//               borderBottom: `1px solid ${theme.palette.secondary.main}`,
//             }}
//           >
//             Scheme Setup
//           </Typography>
  
//           <Box sx={{
//             display:"grid",
//             gridTemplateColumns: "repeat(3, 1fr)",
//             gap: "10px",
//             width: "70%",
//           }}>
  
//           <Box sx={{ mt: 2, width: "100%" }}>
//             <TypographyLabel title="Scheme Number" />
//             <Controller
//               name="scheme_number"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   fullWidth
//                   size="small"
//                   placeholder="Scheme Number"
//                   error={!!errors.scheme_number}
//                   helperText={errors.scheme_number?.message}
//                 />
//               )}
//             />
//           </Box>

//           <Box sx={{ mt: 2, width: "100%" }}>
//               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <TypographyLabel title="Maturity Date" />
//                 <Controller
//                   name="maturity_date"
//                   control={control}
//                   render={({ field }) => (
//                     <DatePicker
//                     //   disabled={!!disableScheme}
//                       {...field}
//                       sx={{
//                         // width: "100%",
//                         "& .MuiSvgIcon-root": {
//                           width: "16px",
//                           height: "16px",
//                         },
//                       }}
//                       slotProps={{ textField: { size: "small" } }}
//                       value={field.value}
//                       onChange={(date) => field.onChange(date)}
//                     />
//                   )}
//                 />
//               </LocalizationProvider>
//               {errors.maturity_date && (
//                 <Typography sx={{fontSize:'12px', mt:0.7}} color="error">
//                   {errors.maturity_date.message}
//                 </Typography>
//               )}
//           </Box>

//           <Box sx={{ width: "100%", mt: 2 }}>
//               <TypographyLabel title={"NAV Calculation Method"} />
//               <Controller
//                 name="nav_calculation_method"
//                 defaultValue={"weekly"}
//                 control={control}
//                 render={({ field }) => (
//                   <Select
//                     {...field}
//                     // disabled={!!disableScheme}
//                     size="small"
//                     error={!!errors.nav_calculation_method}
//                     fullWidth
//                   >
//                     <MenuItem value="daily">Daily</MenuItem>
//                     <MenuItem value="weekly">Weekly</MenuItem>
//                     <MenuItem value="monthly">Monthly</MenuItem>
//                     <MenuItem value="quarterly">Quarterly</MenuItem>
//                   </Select>
//                 )}
//               />
//               {errors.nav_calculation_method && (
//                 <Typography sx={{fontSize:'12px', mt:0.5}} color="error">
//                   {errors.nav_calculation_method.message}
//                 </Typography>
//               )}
//           </Box>

//           <Box sx={{ width: "100%", mt: 2 }}>
//             <TypographyLabel title={"Authorized Capital"} />
//             <Controller
//               name="authorized_capital"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                 //   disabled={!!disableScheme}
//                   {...field}
//                   sx={{ margin: 0, width: "100%" }}
//                   size="small"
//                   placeholder="1000000000"
//                   error={!!errors.authorized_capital}
//                   helperText={errors.authorized_capital?.message}
//                 />
//               )}
//             />
//           </Box>

//           <Box sx={{ width: "100%", mt: 2 }}>
//             <TypographyLabel title={"Scheme Size"} />
//             <Controller
//               name="scheme_size"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                 //   disabled={!!disableScheme}
//                   {...field}
//                   sx={{ margin: 0, width: "100%" }}
//                   size="small"
//                   placeholder="500000000"
//                   error={!!errors.scheme_size}
//                   helperText={errors.scheme_size?.message}
//                 />
//               )}
//             />
//           </Box>

//           <Box sx={{ mt: 2, width: "100%" }}>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <TypographyLabel title={"Allotment Date"} />
//               <Controller
//                 name="allotment_date"
//                 control={control}
//                 render={({ field }) => (
//                   <DatePicker
//                     // disabled={!!disableScheme}
//                     {...field}
//                     sx={{
//                       width: "100%",
//                       "& .MuiSvgIcon-root": {
//                         width: "16px",
//                         height: "16px",
//                       },
//                     }}
//                     slotProps={{ textField: { size: "small" } }}
//                     value={field.value}
//                     onChange={(date) => field.onChange(date)}
//                     //   helperText={errors.entry_date?.message}
//                   />
//                 )}
//               />
//             </LocalizationProvider>
//             {errors.allotment_date && (
//               <Typography sx={{fontSize:'12px', mt:0.7}}  color="error">
//                 {errors.allotment_date.message}
//               </Typography>
//             )}
//           </Box>

//           <Box sx={{ mt: 2, width: "100%" }}>
//             <TypographyLabel title={"Allotted Capital"} />
//             <Controller
//               name="allotted_capital"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                 //   disabled={!!disableScheme}
//                   {...field}
//                   // defaultValue={parseInt(formatIndianNumber(10000))}
//                   sx={{ width: "100%" }}
//                   size="small"
//                   placeholder="425000000"
//                   error={!!errors.allotted_capital}
//                   helperText={errors.allotted_capital?.message}
//                 />
//               )}
//             />
//           </Box>

//           <Box sx={{ mt: 2, width: "100%" }}>
//             <TypographyLabel title={"Total Subscribed Units"} />
//             <Controller
//               name="total_subscribed_units"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                 //   disabled={!!disableScheme}
//                   {...field}
//                   sx={{ width: "100%" }}
//                   size="small"
//                   placeholder="50000000"
//                   error={!!errors.total_subscribed_units}
//                   helperText={errors.total_subscribed_units?.message}
//                 />
//               )}
//             />
//           </Box>

//           </Box>
  
//           <Box>
//             <RoundedButton title1="Add" onClick1={handleSubmit(onSubmit)} />
//           </Box>
//         </Box>
  
//         <SuccessBar
//           snackbarOpen={snackbarSuccessOpen}
//           setSnackbarOpen={setSnackbarSuccessOpen}
//           message={successMsgs}
//         />
//         <ErrorBar
//           snackbarOpen={snackbarErrorOpen}
//           setSnackbarOpen={setSnackbarErrorOpen}
//           message={errorMsgs}
//         />
//       </Box>
//     );
//   }

