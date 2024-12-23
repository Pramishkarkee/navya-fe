// import {
//     Box,
//     Button,
//     Grid,
//     MenuItem,
//     Select,
//     TextField,
//     Typography,
//     styled,
//     useTheme,
//   } from "@mui/material";
//   import AttachFileIcon from "@mui/icons-material/AttachFile";
//   import HeaderDesc from "components/HeaderDesc/HeaderDesc";
//   import TypographyLabel from "components/InputLabel/TypographyLabel";
//   import {useEffect, useRef, useState } from "react";
//   import Auth from "utils/Auth";
//   import axios, { isAxiosError } from "axios";
//   import SuccessBar from "components/Snackbar/SuccessBar";
//   import ErrorBar from "components/Snackbar/ErrorBar";
//   import RoundedButton from "components/Button/Button";
//   // import { usePatchBatchTransaction } from "services/BatchTransaction/BatchTransactionServices";
//   import { PaginationState } from "@tanstack/react-table";
//   import ReceiptTable from "components/Table/TanstackTable";
//   import { Controller, useForm } from "react-hook-form";
//   import { yupResolver } from "@hookform/resolvers/yup";
//   import * as yup from "yup";
//   import { Empty } from "antd";
//   import { ColumnDef } from "@tanstack/react-table";

//   // type LTPUpdate = {
//   //   sn: number;
//   //   symbol: string;
//   //   value: number;
//   //   business_date: string;
//   //   buy_sell: string;
//   //   quantity: number;
//   //   rate: number;
//   //   amount: number;
//   //   stc_type: string;
//   // };

//   type MutualFundSetup = {
//     boid_no: string;
//     full_name: string;
//     allotted_unit: number;
//     contact1: string;
//     // amount: number;
//   };
  
//   interface FileInput {
//     lastModified?: number;
//     lastModifiedDate?: Date;
//     name: string;
//     size: number;
//     type: string;
//     webkitRelativePath?: string;
//   }
  
//   const VisuallyHiddenInput = styled("input")({
//     clip: "rect(0 0 0 0)",
//     clipPath: "inset(50%)",
//     height: 1,
//     overflow: "hidden",
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     whiteSpace: "nowrap",
//     width: 1,
//   });
  
//   const BatchImport = () => {
//     const theme = useTheme();
//     const BASE_URL = import.meta.env.VITE_BASE_URL;
  
//     const hiddenFileInput = useRef(null);
//     const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
//     const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  
//     const [batchSuccess, setBatchSuccess] = useState(false);
//     const [batchError, setBatchError] = useState(false);
  
//     const [uploadData, setUploadData] = useState(null);
//     const [errorMsgs, setErrorMsgs] = useState("");
  
//     const [fileUpload, setFileUpload] = useState<FileInput>(null);
//     const [file, setFile] = useState<File | null>(null);
  
  
//     const [next, setNext] = useState(false);
//     const [prev, setPrev] = useState(false);
//     const [pagination, setPagination] = useState<PaginationState>({
//       pageIndex: 0,
//       pageSize: 20,
//     });
  
//     const [isPendingState, setIsPendingState] = useState(false);
  
//     const schema = yup.object().shape({
//       face_value: yup.number().required("Face Value is required").typeError("Face Value must be a number").min(0, "Face Value must be greater than 0"),
//       scheme_name: yup.string().required("Scheme Name is required"),
//       seed_capital: yup.number().required("Seed Capital is required").typeError("Seed Capital must be a number").min(0, "Seed Capital must be greater than 0"),
//       scheme_type: yup.string().required("Scheme Type is required"),
//       file : yup.mixed().required("File is required").optional(),
//     });
  
//     const {
//       handleSubmit,
//       control,
//       formState: { errors },
//     } = useForm({
//       resolver: yupResolver<any>(schema),
//       defaultValues: {
//         face_value: "",
//         scheme_name: "",
//         seed_capital: "",
//         scheme_type: "close_ended",
//       },
//     });
//     console.log(errors);
  
//     const toalPageCount = Math.ceil(1);
  
//     useEffect(() => {
//       if (uploadData?.next === null) {
//         setNext(false);
//       } else {
//         setNext(true);
//       }
//       if (uploadData?.previous === null) {
//         setPrev(false);
//       } else {
//         setPrev(true);
//       }
//     }, [uploadData]);
  
//     const handleCSVUpload = async (e) => {
//       const uploadedFile = e.target.files[0];
//       setFile(uploadedFile);
//       setFileUpload(uploadedFile);
//     };
  
//     const handleFileUpload = async (data) => {
//       setIsPendingState(true);
//       try {
//         const formData = new FormData();
  
//         formData.append("file", file ? file : null);
//         formData.append("face_value", data.face_value);
//         formData.append("scheme_name", data.scheme_name);
//         formData.append("seed_capital", data.seed_capital);
//         formData.append("scheme_type", data.scheme_type );
//         // formData.append("import_date", date.format("YYYY-MM-DD"));
//         // formData.append("broker_code", data.broker_code);
//         const headers = {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${Auth.getAccessToken()}`,
//         };
  
//         const response = await axios.post(
//           `${BASE_URL}/accounting/api/v1/accounting/allotment-excel-json-calculator/`,
//           formData,
//           {
//             headers: headers,
//           }
//         );
  
//         if (response.data.isSuccess) {
//           // setSuccessMsgs(response?.data?.message);
//           setUploadData(response.data);
//           setSuccessSnackbarOpen(true);
//           setIsPendingState(false);
//         } else {
//           setErrorMsgs("Error occured while uploading file.");
//           setErrorSnackbarOpen(true);
//         }
//       } catch (error) {
//         setIsPendingState(false);
//         if (isAxiosError(error) && error.response) {
//           setErrorMsgs(
//             error?.response?.data?.file
//               ? error?.response?.data?.file
//               : "Error occured while uploading file."
//           );
//           setErrorSnackbarOpen(true);
//         }
//       }
//     };
  
//     const handleFileUploadClick = () => {
//       hiddenFileInput.current.click();
//     };
  
//     // const { mutate: handleConfirmBatchUpdate } = usePatchBatchTransaction();
  
//     // const handleConfirmBatchUpdateClick = async (e) => {
//     //   e.preventDefault();
  
//     //   const payload = uploadData?.responseData.map((item) => {
//     //     return {
//     //       face_value: item.face_value,
//     //       scheme_name: item.scheme_name,
//     //       seed_capital: item.seed_capital,
//     //       scheme_type: item.scheme_type,
//     //     };
//     //   });
  
//     //   handleConfirmBatchUpdate(payload, {
//     //     onSuccess: () => {
//     //       setSuccessSnackbarOpen(true);
//     //       setUploadData([]);
//     //     },
//     //     onError: (error) => {
//     //       if (isAxiosError(error) && error.response) {
//     //         setErrorMsgs(
//     //           error?.response?.data?.details
//     //             ? error?.response?.data?.details[0]
//     //             : error?.response?.data?.non_field_errors
//     //             ? error?.response?.data?.non_field_errors[0]
//     //             : "Error on Submitting Batch"
//     //         );
//     //         setErrorSnackbarOpen(true);
//     //       }
//     //     },
//     //   });
//     // };
  
//     // const BatchUpdateTableHeader: ColumnDef<LTPUpdate>[] = [
//     //   {
//     //     header: "S.N",
//     //     accessorKey: "sn",
//     //     cell: (data) => {
//     //       return (
//     //         <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
//     //           {data.row.index + 1}
//     //         </Typography>
//     //       );
//     //     },
//     //   },
  
//     //   {
//     //     header: "Symbol",
//     //     accessorKey: "symbol",
//     //     cell: (data) => {
//     //       return (
//     //         <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
//     //           {data.row.original.symbol}
//     //         </Typography>
//     //       );
//     //     },
//     //   },
//     //   {
//     //     header: "Transaction Type",
//     //     accessorKey: "buy_sell",
//     //     cell: (data) => {
//     //       return (
//     //         <Typography
//     //           sx={{
//     //             textAlign: "left",
//     //             width: { sm: "40%", md: "30%", lg: "35%" },
//     //             textTransform: "capitalize",
//     //             fontSize: "14px",
//     //             fontWeight: "400",
//     //           }}
//     //         >
//     //           {data.row.original.buy_sell === "purchase" ? "Purchase" : "Sell"}
//     //         </Typography>
//     //       );
//     //     },
//     //   },
//     //   {
//     //     header: "Stock Type",
//     //     accessorKey: "stc_type",
//     //     cell: (data) => {
//     //       const StockType = data.row.original?.stc_type?.replace(/_/g, " ");
//     //       return (
//     //         <Typography
//     //           sx={{
//     //             textTransform: "capitalize",
//     //             fontSize: "14px",
//     //             fontWeight: "400",
//     //           }}
//     //           textAlign="left"
//     //         >
//     //           {StockType ?? "-"}
//     //         </Typography>
//     //       );
//     //     },
//     //   },
//     //   {
//     //     header: "Quantity",
//     //     accessorKey: "quantity",
//     //     cell: (data) => {
//     //       return (
//     //         <Typography
//     //           textAlign="right"
//     //           sx={{ fontSize: "14px", fontWeight: "400", width: "45px" }}
//     //         >
//     //           {data.row.original.quantity}
//     //         </Typography>
//     //       );
//     //     },
//     //   },
//     //   {
//     //     header: "Rate",
//     //     accessorKey: "rate",
//     //     cell: (data) => {
//     //       return (
//     //         <Typography
//     //           textAlign="right"
//     //           sx={{ fontSize: "14px", fontWeight: "400", width: "30px" }}
//     //         >
//     //           {data.row.original.rate}
//     //         </Typography>
//     //       );
//     //     },
//     //   },
//     //   {
//     //     header: "Amount",
//     //     accessorKey: "amount",
//     //     cell: (data) => {
//     //       return (
//     //         <Typography
//     //           textAlign="right"
//     //           sx={{ fontSize: "14px", fontWeight: "400", width: "45px" }}
//     //         >
//     //           {data.row.original.amount}
//     //         </Typography>
//     //       );
//     //     },
//     //   },
     
//     // ];

//     const BatchUpdateTableHeader: ColumnDef<MutualFundSetup>[] = [
//         {
//           header: "BOID",
//           accessorKey: "boid_no",
//           cell: (data) => {
//             return (
//               <Typography sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}>
//                 {data.row.original.boid_no}
//               </Typography>
//             );
//           },
//         },
//         {
//           header: "Name",
//           accessorKey: "full_name",
//           cell: (data) => {
//             return (
//               <Typography sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}>
//                 {data.row.original.full_name}
//               </Typography>
//             );
//           },
//         },
//         {
//           header: "Unit Held",
//           accessorKey: "allotted_unit",
//           cell: (data) => {
//             return (
//               <Typography sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}>
//                 {data.row.original.allotted_unit}
//               </Typography>
//             );
//           },
//         },
//         {
//           header: "Phone Number",
//           accessorKey: "contact1",
//           cell: (data) => {
//             return (
//               <Typography sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}>
//                 {data.row.original.contact1}
//               </Typography>
//             );
//           },
//         },
//         {
//           header: "Total Amount",
//           accessorKey: "allotted_unit",
//           cell: (data) => {
//             return (
//               <Typography sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}>
//                 {data.row.original.allotted_unit * 10}
//               </Typography>
//             );
//           },
//         },
//         {
//           header: "Actions",
//           accessorKey: "amount",
//           cell: (data) => {
//             return (
//               <Typography sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}>
//                 {/* {data.row.original.amount} */}
//                 View Details
//               </Typography>
//             );
//           },
//         },
//       ];
  
//     return (
//       <Grid container spacing={3}>
//         <Grid item xs={12} sm={12} md={8} lg={8}>
//           <SuccessBar
//             snackbarOpen={successSnackbarOpen}
//             setSnackbarOpen={setSuccessSnackbarOpen}
//             message={"Details Uploaded Successfully."}
//           />
//           <ErrorBar
//             snackbarOpen={errorSnackbarOpen}
//             setSnackbarOpen={setErrorSnackbarOpen}
//             message={errorMsgs}
//           />
  
//           <SuccessBar
//             snackbarOpen={batchSuccess}
//             setSnackbarOpen={setBatchSuccess}
//             message={"Batch Updated Successfully."}
//           />
//           <ErrorBar
//             snackbarOpen={batchError}
//             setSnackbarOpen={setBatchError}
//             message={errorMsgs}
//           />
  
//           <Box sx={{ mt: 1 }} component="form">
//           <HeaderDesc title="New Scheme Details" />

//           <Box sx={{
//             display:"grid",
//             gridTemplateColumns: "2fr 2fr",
//             columnGap: 2,
//           }}>

//           <Box sx={{ mt: 1, width: "100%" }}>
//               <TypographyLabel title="Mutual Fund Face Value (Rs)" />
//               <Controller
//                 name="face_value"
//                 control={control}
//                 render={({ field }) => (
//                     <TextField
//                     // disabled={!!disableScheme}
//                     {...field}
//                     sx={{ margin: 0, width: "100%" }}
//                     size="small"
//                     placeholder="10"
//                     error={!!errors.face_value}
//                     // helperText={errors.scheme_name?.message}
//                     helperText={errors.face_value?.message?.toString()}
//                     />
//                 )}
//                 />
//           </Box>

//           <Box sx={{ width: "100%", mt: 1 }}>
//             <TypographyLabel title={"Scheme Name"} />
//             <Controller
//               name="scheme_name"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                 //   disabled={!!disableScheme}
//                   {...field}
//                   sx={{ margin: 0, width: "100%" }}
//                   size="small"
//                   placeholder="Enter Scheme Name"
//                   error={!!errors.scheme_name}
//                   // helperText={errors.scheme_name?.message.toString()}
//                 />
//               )}
//             />
//           </Box>

//           <Box sx={{ width: "100%", mt: 1 }}>
//             <TypographyLabel title={"Seed Capital"} />
//             <Controller
//               name="seed_capital"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                 //   disabled={!!disableScheme}
//                   {...field}
//                   sx={{ margin: 0, width: "100%" }}
//                   size="small"
//                   placeholder="75000000"
//                   error={!!errors.seed_capital}
//                   helperText={errors.seed_capital?.message.toString()}
//                 />
//               )}
//             />
//           </Box>

//           <Box sx={{ width: "100%", mt: 1 }}>
//             <TypographyLabel title={"Scheme Type"} />
//             <Controller
//               name="scheme_type"
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   {...field}
//                 //   disabled={!!disableScheme}
//                   size="small"
//                   fullWidth
//                 >
//                   <MenuItem value="open_ended">Open-Ended</MenuItem>
//                   <MenuItem value="close_ended">Close-Ended</MenuItem>
//                 </Select>
//               )}
//             />
//             {errors.scheme_type && (
//               <Typography color="error">
//                 {errors.scheme_type.message.toString()}
//               </Typography>
//             )}
//           </Box>
//           </Box>

//             <Box sx={{ mt:3 }}>
//             <HeaderDesc title="Units and Shareholders Allotment" />
//             <Box sx={{ mt: 1}}>
//             <TypographyLabel title="Upload the Allotment File (.xlsx/.csv)" />
//             <Controller
//               name="file"
//               control={control}
//               render={({
//                 field: {...field },
//               }) =>(
//               <Button
//                 variant="outlined"
//                 startIcon={<AttachFileIcon />}
//                 onClick={handleFileUploadClick}
//                 sx={{
//                   borderRadius: 2,
//                   width: 230,
//                   borderColor: theme.palette.secondary[700],
//                   color: theme.palette.primary[1100],
//                   textTransform: "none",
//                 }}
//               >
//                 {fileUpload ? fileUpload.name : "Select a File"}
  
//                 <VisuallyHiddenInput
//                   {...field}
//                   type="file"
//                   // value={field.value?.name}
//                   hidden
//                   ref={hiddenFileInput}
//                   sx={{ display: "none" }}
//                   accept=".csv , application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
//                   onChange={handleCSVUpload}
//                 />
//               </Button>
//               )}
//               />
//               {errors.file && (
//                 <Typography sx={{fontSize:"12px"}} color="error">{errors.file?.message?.toString()}</Typography>
//               )}
//               <Box mt={1}>
//                 <RoundedButton
//                   title1="Upload"
//                   onClick1={handleSubmit(handleFileUpload)}
//                   // disable={isPendingState}
//                   loading={isPendingState}
//                 />
//               </Box>
//             </Box>
//             </Box>
  
//             <Box sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 2 }}>
//               <HeaderDesc title="Upload Preview" />
//               {/* <Box>
//                 <SearchText
//                   title="Search"
//                   onChange={(e) => debouncedSetValue(e.target.value)}
//                   // onClick={handleSearchClick}
//                 />
//               </Box> */}
//               <Box>
//                 {uploadData?.responseData?.clean_data?.length > 0 ? (
//                   <Box
//                     sx={{
//                       maxWidth: "1500px",
//                       width: { md: "105%", lg: "125%", xl: "130%" },
//                     }}
//                   >
//                     <ReceiptTable
//                       columns={BatchUpdateTableHeader}
//                       data={uploadData?.responseData?.clean_data ?? []}
//                       pagination={pagination}
//                       setPagination={setPagination}
//                       pageCount={toalPageCount}
//                       next={next}
//                       prev={prev}
//                     />
  
//                     {/* <Box mt={0}>
//                       {" "}
//                       <RoundedButton
//                         title1="Confirm Batch Update"
//                         onClick1={handleConfirmBatchUpdateClick}
//                       />
//                     </Box> */}
//                   </Box>
//                 ) : (
//                   <Box
//                     sx={{
//                       maxWidth: "1500px",
//                       width: { md: "105%", lg: "125%", xl: "130%" },
//                     }}
//                   >
//                     <ReceiptTable columns={BatchUpdateTableHeader} data={[]} />
//                     <Box
//                       sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         ml: { md: 5, lg: 20 },
//                         // mt: 5,
//                       }}
//                     >
//                       <Empty
//                         imageStyle={{ height: 150, width: 150 }}
//                         description="No Data Available"
//                       />
//                       <Typography
//                         // onClick={handleReset}
//                         sx={{
//                           color: theme.palette.primary[1100],
//                           fontWeight: 600,
//                           cursor: "pointer",
//                         }}
//                       >
//                         Reset Filters
//                       </Typography>
//                     </Box>
//                   </Box>
//                 )}
//               </Box>

//               <Box>
//                 <HeaderDesc title="New Scheme Details" />
//                 <Box sx={{
//                     mt:1,
//                     width:"60%",
//                     rowGap:1,   
//                     display:"grid",
//                     gridTemplateColumns: "2fr 2fr",
//                 }}>
//                 <Box>
//                     <Typography sx={{fontSize:'15px', color:theme.palette.grey[500]}}>Total Alloted Capital</Typography>
//                     <Typography sx={{fontWeight:500}}>NPR {uploadData?.meta?.total_allotted_capital ? uploadData?.meta?.total_allotted_capital.toLocaleString(undefined,{
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2
//                     }) : null}</Typography>
//                 </Box>
//                 <Box>
//                     <Typography sx={{fontSize:'15px', color:theme.palette.grey[500]}}>Total Unit Holders</Typography>
//                     <Typography sx={{fontWeight:500}}>{uploadData?.meta?.total_units_holder ?? null}</Typography>
//                 </Box>
//                 <Box>
//                     <Typography sx={{fontSize:'15px', color:theme.palette.grey[500]}}>Total Subscribed Unit</Typography>
//                     <Typography sx={{fontWeight:500}}>{uploadData?.meta?.total_sub_units ?? null}</Typography>
//                 </Box>
              
//                 </Box>

//               </Box>

//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     );
//   };
  
//   export default BatchImport;
  










// // import React from 'react';
// // import { Box, TextField } from '@mui/material';

// // const InitialSchemeSetup: React.FC = () => {
// //   return (
// //     <Box display="flex" flexDirection="column" gap={2}>
// //       <TextField label="Scheme Number" fullWidth />
// //       <TextField label="Authorized Capital" fullWidth />
// //       <TextField label="Allotted Capital" fullWidth />
// //     </Box>
// //   );
// // };

// // export default InitialSchemeSetup;
