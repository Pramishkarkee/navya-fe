import {
  Box,
  TextField,
  Typography,
  MenuItem,
  useTheme,
  Select,
} from "@mui/material";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";
// import ReceiptTable from "components/Table/TanstackTable";
// import { StockBrokerTableEntryHeader1 } from "constants/Stocks Broker/StockBrokerTable";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePatchStockBrokerData } from "services/StockBroker/StockBrokerServices";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import { useState } from "react";
import axios from "axios";

type Data = {
  stock_exchange: string;
  broker_code: string;
  broker_name: string;
  broker_address: string;
  transaction_limit: number;
  schema_name: string;
  total_transaction_limit: number;
  // ledger_head_payable: string;
  // ledger_head_receiveable: string;
};

const schema = yup
  .object({
    stock_exchange: yup.string().required("Stock Exchange is required"),
    broker_code: yup
      .number()
      .required("Broker Code is required")
      .positive("Broker Code must be a positive number"),
    broker_name: yup.string().required("Broker Name is required"),
    broker_address: yup.string().required("Address is required"),
    transaction_limit: yup
      .number()
      .required("Transaction Limit is required")
      .positive("Transaction Limit must be a positive number"),
    total_transaction_limit: yup
      .number()
      .required("Total Transaction Limit is required")
      .positive("Total Transaction Limit must be a positive number"),

    // schema_name: yup.string().required("Schema Name is required"),
    // ledger_head_payable: yup.string().required("Ledger Head Payable is required"),
    // ledger_head_receiveable: yup.string().required("Ledger Head Receivable is required"),
  })
  .required();

const StockBrokerSetup = () => {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Data>({
    resolver: yupResolver<any>(schema),
    // defaultValues: {
    //   stock_exchange: "NEPSE",
    //   broker_code: "",
    //   broker_name: "",
    //   broker_address: "",
    //   transaction_limit: 0,
    //   schema_name: "Navya Large Cap Fund",
    //   // ledger_head_payable: "",
    //   // ledger_head_receiveable: "",
    // },
  });

  // const tabledata = [
  //   {
  //     schema_name: "Navya Large Cap Fund",
  //     ledger_head_payable: "NAASA Securities Payable",
  //     ledger_head_receiveable: "NAASA Securities Receiveable",
  //   },
  //   {
  //     schema_name: "NIC ASIA Another Scheme",
  //     ledger_head_payable: "NAASA Securities Payable",
  //     ledger_head_receiveable: "NAASA Securities Receiveable",
  //   },
  // ];

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorbarOpen, setErrorbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { mutate: patchStockBrokerData, isError: ErrorBrokerData } =
    usePatchStockBrokerData();

  const handleSetupBroker = (data: Data) => {
    const tempData = {
      stock_exchange: data.stock_exchange,
      broker_code: data.broker_code,
      broker_name: data.broker_name,
      broker_address: data.broker_address,
      transaction_limit: data.transaction_limit,
      total_transaction_limit: data.total_transaction_limit,
      // schema_name: data.schema_name,
      // ledger_head_payable: data.ledger_head_payable,
      // ledger_head_receiveable: data.ledger_head_receiveable,
    };

    patchStockBrokerData(tempData, {
      onSuccess: () => {
        setValue("broker_name", "");
        setValue("stock_exchange", "");
        setValue("broker_code", "");
        setValue("transaction_limit", 0);
        setValue("broker_address", "");
        setValue("total_transaction_limit", 0);
        // setValue("schema_name", "");
        // setValue("ledger_head_payable", "");
        // setValue("ledger_head_receiveable", "");
        setSnackbarOpen(true);
      },
      onError: (error) => {
        setErrorbarOpen(true);

        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage(
            error.response.data.broker_code
              ? error.response.data.broker_code[0]
              : error.response.data.transaction_limit
              ? error.response.data.transaction_limit[0]
              : "Error in submitting data!"
          );
        } else {
          setErrorMessage("Error in submitting data!");
          console.error(error);
        }
      },
    });
  };

  // const handleAddRow = (event: React.MouseEvent) => {
  //   event.preventDefault();
  // };

  return (
    <>
      {snackbarOpen && (
        <SuccessBar
          snackbarOpen={snackbarOpen}
          message={"Successfully Submitted!"}
          setSnackbarOpen={setSnackbarOpen}
        />
      )}

      {ErrorBrokerData && (
        <ErrorBar
          snackbarOpen={errorbarOpen}
          message={errorMessage}
          setSnackbarOpen={setErrorbarOpen}
        />
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(handleSetupBroker)}
        sx={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 1 }}
      >
        <Box sx={{ width: "50px" }}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "19px",
              color: "#212121",
              textAlign: "center",
              width: "max-content",
              borderBottom: `1px solid ${theme.palette.secondary.main}`,
            }}
          >
            Broker Definition
          </Typography>
        </Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "50%",
              }}
            >
              <Box sx={{ width: "100%", flex: "calc(50%-1rem)" }}>
                <TypographyLabel title={"Scheme Name"} />

                <Controller
                  name="schema_name"
                  defaultValue="Navya Large Cap Fund"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="small"
                      fullWidth
                      placeholder="Please Select Schema"
                    >
                      <MenuItem value="Navya Large Cap Fund">
                        NAVYA LARGE CAP FUND
                      </MenuItem>
                    </Select>
                  )}
                />

                {errors.schema_name && (
                  <Typography color="error">
                    {errors.schema_name.message}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ width: "50%", flex: "calc(50%-1rem)" }}>
              <TypographyLabel title={"Stock Exchange"} />
              <Controller
                name="stock_exchange"
                defaultValue="NEPSE"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="small"
                    fullWidth
                    placeholder="Please Select Stock Exchange"
                  >
                    <MenuItem value="NEPSE">NEPSE</MenuItem>
                  </Select>
                )}
              />
              {errors.stock_exchange && (
                <Typography color="error" sx={{ fontSize: "12px" }}>
                  {errors.stock_exchange.message}
                </Typography>
              )}
            </Box>
            <Box sx={{ width: "50%" }}>
              <TypographyLabel title={"Broker Code"} />
              <Controller
                name="broker_code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="Please Enter Broker Code"
                    error={!!errors.broker_code}
                    helperText={errors.broker_code?.message}
                  />
                )}
              />
            </Box>
            <Box sx={{ width: "50%" }}>
              <TypographyLabel title={"Name"} />
              <Controller
                name="broker_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="Please Enter Broker Name"
                    error={!!errors.broker_name}
                    helperText={errors.broker_name?.message}
                  />
                )}
              />
            </Box>
            <Box sx={{ width: "50%" }}>
              <TypographyLabel title={"Address"} />
              <Controller
                name="broker_address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="Please Enter Address"
                    error={!!errors.broker_address}
                    helperText={errors.broker_address?.message}
                  />
                )}
              />
            </Box>
            <Box sx={{ width: "50%" }}>
              <TypographyLabel title={"Per Transaction Limit"} />
              <Controller
                name="transaction_limit"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="Please Enter Transaction Limit"
                    error={!!errors.transaction_limit}
                    helperText={errors.transaction_limit?.message}
                  />
                )}
              />
            </Box>
            <Box sx={{ width: "50%" }}>
              <TypographyLabel title={"Total Transaction Limit"} />
              <Controller
                name="total_transaction_limit"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="Please Enter Total Transaction Limit"
                    error={!!errors.total_transaction_limit}
                    helperText={errors.total_transaction_limit?.message}
                  />
                )}
              />
            </Box>
          </Box>
        </Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* <Box sx={{ width: "50px" }}>
              <Typography
                sx={{
                  mt: 2,
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "19px",
                  color: "#212121",
                  textAlign: "center",
                  width: "max-content",
                  borderBottom: `1px solid ${theme.palette.secondary.main}`,
                }}
              >
                Stock Broker Ledger Setup
              </Typography>
            </Box> */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
              {/* <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  width: "50%",
                }}
              >
                <Box sx={{ width: "100%", flex: "calc(50%-1rem)" }}>
                  <TypographyLabel title={"Schema Name"} />
                
                  <Controller
                    name="schema_name"
                    defaultValue="Navya Large Cap Fund"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} size="small" fullWidth>
                        <MenuItem value="Navya Large Cap Fund">NAVYA LARGE CAP FUND</MenuItem>
                      </Select>
                    )}
                  />
                
                  {errors.schema_name && (
                    <Typography color="error">{errors.schema_name.message}</Typography>
                  )}
                </Box>
              </Box> */}
              {/* <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  width: "50%",
                }}
              >
                <Box sx={{ width: "50%", flex: "calc(50%-1rem)" }}>
                  <TypographyLabel title={"Ledger Head Payable"} />
                  <Controller
                    name="ledger_head_payable"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        placeholder="Ledger Head Payable"
                        error={!!errors.ledger_head_payable}
                        helperText={errors.ledger_head_payable?.message}
                      />
                    )}
                  />
                </Box>
                <Box sx={{ width: "50%", flex: "calc(50%-1rem)" }}>
                  <TypographyLabel title={"Ledger Head Receivable"} />
                  <Controller
                    name="ledger_head_receiveable"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        placeholder="Ledger Head Receivable"
                        error={!!errors.ledger_head_receiveable}
                        helperText={errors.ledger_head_receiveable?.message}
                      />
                    )}
                  />
                </Box>
              </Box> */}
            </Box>
            <Box>
              <RoundedButton title1="Setup Stock Broker" />
            </Box>
          </Box>
        </Box>
        {/* <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ width: "50px" }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "19px",
                color: "#212121",
                textAlign: "center",
                width: "max-content",
                borderBottom: `1px solid ${theme.palette.secondary.main}`,
              }}
            >
              Entries
            </Typography>
          </Box>
          <Box>
            <ReceiptTable columns={StockBrokerTableEntryHeader1} data={tabledata ?? []} />
          </Box>
          <Box>
            <RoundedButton title1="SETUP STOCK BROKER" onClick1={handleSubmit(handleSetupBroker)} />
          </Box>
        </Box> */}
      </Box>
    </>
  );
};

export default StockBrokerSetup;

// import { Box, TextField, Typography, MenuItem, useTheme, Select } from "@mui/material";
// import RoundedButton from "components/Button/Button";
// import TypographyLabel from "components/InputLabel/TypographyLabel";
// import ReceiptTable from "components/Table/TanstackTable";
// import { StockBrokerTableEntryHeader1 } from "constants/Stocks Broker/StockBrokerTable";
// import { Controller, useForm } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import {
//   usePatchStockBrokerData,
// } from "services/StockBroker/StockBrokerServices copy";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import { useState } from "react";
// // import Button from '@mui/material/Button';

// type Data = {
//   stock_exchange: string;
//   broker_code: string;
//   broker_name: string;
//   broker_address: string;
//   transaction_limit: number;
//   schema_name: string;
//   ledger_head_payable: string;
//   ledger_head_receiveable: string;
// };

// const schema = yup
// .object({
//   stock_exchange: yup.string().required("Stock Name is required"),
//   broker_code: yup.string().required("Broker Code is required"),
//   broker_name: yup.string().required("Broker Name is required"),
//   address: yup.string().required("Address is required"),
//   transaction_limit: yup.number().required("Transaction Limit is required") .positive("Interest Rate must be a positive number"),
//   schema_name: yup.string().required().label("Schemaname"),
//   ledger_head_payable: yup.string().required().label("Ledgerheadpayable"),
//   ledger_head_receiveable: yup.string().required().label("Ledgerheadreceiveable"),
// })
// .required();

// // export default function StockBrokerSetup() {
//   const StockBrokerSetup = () => {
//   const theme = useTheme();

// const {
//   control,
//   handleSubmit,
//   setValue,
//   formState: { errors },
// } = useForm<Data>({
//   resolver: yupResolver<any>(schema),
//   defaultValues: {
//     stock_exchange: "",
//     broker_code: "",
//     broker_name: "",
//     broker_address: "",
//     transaction_limit: 0,
//     // schema_name: "",
//     // ledger_head_payable: "",
//     // ledger_head_receiveable: "",

//   },
// });
// const tabledata = [
//   {
//     schema_name: "Navya Large Cap Fund",
//     ledger_head_payable: "NAASA Securities Payable",
//     ledger_head_receiveable: "NAASA Securities Receiveable",
//   },
//   {
//     schema_name: "NIC ASIA Another Scheme",
//     ledger_head_payable: "NAASA Securities Payable",
//     ledger_head_receiveable: "NAASA Securities Receiveable",
//   },
// ];
// const [snackbarOpen, setSnackbarOpen] = useState(false);

//   const {
//     mutate: StockBrokerAdded,
//   } = usePatchStockBrokerData();

//   const handleSetupBroker = (data) => {
//     const tempData = {
//       stock_exchange: (data.stock_exchange),
//       broker_code: Number(data.broker_code),
//       broker_name: data.broker_name,
//       broker_address: data.broker_address,
//       transaction_limit: Number(data.transaction_limit),
//       schema_name: data.schema_name,
//       ledger_head_payable: data.ledger_head_payable,
//       ledger_head_receiveable: data.ledger_head_receiveable,
//     };
//     StockBrokerAdded(tempData, {
//       onSuccess: () => {

//         // setValue(data.stock_exchange, "");
//         // setValue(data.broker_code, "");
//         // setValue(data.broker_name, "");
//         // setValue(data.borker_address, "");
//         // setValue(data.transaction_limit, "");
//         // setValue(data.schema_name, "");
//         // setValue(data.ledger_head_payable, "");
//         // setValue(data.ledger_head_receiveable, "");

//         setValue(data.broker_name, "");
//         setValue(data.stock_exchange, "");
//         setValue(data.borker_code, "");
//         setValue(data.transaction_limit, "");
//         setValue(data.broker_address, "");
//         setSnackbarOpen(true);
//       },
//     });
//   };

//   const handleAddRow = (event) => {
//     event.preventDefault();
//   };

//   return (
//     <>
//      {snackbarOpen && (
//         <SuccessBar
//           snackbarOpen={snackbarOpen}
//           message={"Successfully Submitted!"}
//           setSnackbarOpen={setSnackbarOpen}
//         />
//       )}

//       <Box
//       component="form"
//       onSubmit={handleSubmit(handleSetupBroker)}
//         sx={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 1 }}
//       >
//         <Box sx={{ width: "50px" }}>
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
//             Broker Definition
//           </Typography>
//         </Box>
//         <Box>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               gap: 2,
//             }}
//           >
//             <Box sx={{ width: "50%", flex: "calc(50%-1rem)" }}>
//               <TypographyLabel title={"Stock Exchange"} />
//               <Controller
//                 name="ledger_head_receiveable"
//                 defaultValue="NEPSE"
//                 control={control}
//                 render={({ field }) => (
//                   <Select {...field} size="small" fullWidth>
//                     <MenuItem value="NEPSE">NEPSE</MenuItem>
//                   </Select>
//                 )}
//               />
//             </Box>
//             <Box sx={{ width: "50%" }}>
//               <TypographyLabel title={"Broker Code"} />
//               <Controller
//                   name="broker_code"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       fullWidth
//                       size="small"
//                       placeholder="45"
//                       error={!!errors.broker_code}
//                       helperText={errors.broker_code?.message}
//                     />
//                   )}
//                 />
//             </Box>
//             <Box sx={{ width: "50%" }}>
//               <TypographyLabel title={"Name"} />
//               <Controller
//                   name="broker_name"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       fullWidth
//                       size="small"
//                       placeholder="NAASA Securities Ltd."
//                       error={!!errors.broker_name}
//                       helperText={errors.broker_name?.message}
//                     />
//                   )}
//                 />
//             </Box>

//             <Box sx={{ width: "50%" }}>
//               <TypographyLabel title={"Address"} />
//               <Controller
//                   name="broker_address"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       fullWidth
//                       size="small"
//                       placeholder="Narayan Chaur, Kathmandu"
//                       error={!!errors.broker_address}
//                       helperText={errors.broker_address?.message}
//                     />
//                   )}
//                 />
//             </Box>
//             <Box sx={{ width: "50%" }}>
//                   <TypographyLabel title={"Transaction Limit"} />
//                   <Controller
//                   name="transaction_limit"
//                   control={control}
//                   // defaultValue="0"
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       fullWidth
//                       size="small"
//                       placeholder="0-Limit"
//                       error={!!errors.transaction_limit}
//                       helperText={errors.transaction_limit?.message}
//                     />
//                   )}
//                 />
//                 </Box>
//           </Box>
//         </Box>
//         <Box>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               gap: 2,
//             }}
//           >
//             <Box sx={{ width: "50px" }}>
//               <Typography
//                 sx={{
//                   mt: 2,
//                   fontSize: "16px",
//                   fontWeight: 600,
//                   lineHeight: "19px",
//                   color: "#212121",
//                   textAlign: "center",
//                   width: "max-content",
//                   borderBottom: `1px solid ${theme.palette.secondary.main}`,
//                 }}
//               >
//                 Stock Broker Ledger Setup
//               </Typography>
//             </Box>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 gap: 2,
//               }}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 2,
//                   width: "50%",
//                 }}
//               >
//               <Box sx={{ width: "50%", flex: "calc(50%-1rem)" }}>
//               <TypographyLabel title={"Schema Name"} />
//               <Controller
//                 name="schema_name"
//                 defaultValue="nic_asia_dynamic_debt_fund"
//                 control={control}
//                 render={({ field }) => (
//                   <Select {...field} size="small">
//                     <MenuItem value="nic_asia_dynamic_debt_fund">NAVYA LARGE CAP FUND</MenuItem>
//                   </Select>
//                 )}
//               />
//             </Box>
//               </Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 2,
//                   width: "50%",
//                 }}
//               >
//               </Box>
//             </Box>
//             <Box>
//               <RoundedButton title1="Add Row" onClick1={handleAddRow} />
//               {/* <Button sx={{borderRadius:'5rem', height:'2rem'}} variant="contained" color="error">
//                Add Row
//               </Button> */}
//             </Box>
//           </Box>
//         </Box>
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             gap: 2,
//           }}
//         >
//           <Box sx={{ width: "50px" }}>
//             <Typography
//               sx={{
//                 fontSize: "16px",
//                 fontWeight: 600,
//                 lineHeight: "19px",
//                 color: "#212121",
//                 textAlign: "center",
//                 width: "max-content",
//                 borderBottom: `1px solid ${theme.palette.secondary.main}`,
//               }}
//             >
//               Entries
//             </Typography>
//           </Box>
//           <Box>
//             <ReceiptTable
//               columns={StockBrokerTableEntryHeader1}
//               data={tabledata ?? []}
//             />
//           </Box>
//           <Box>
//             {/* <RoundedButton
//               title1="SETUP STOCK BROKER"
//               // onClick1={handleSubmit(handleSetupBroker)}
//             /> */}
//             <RoundedButton
//               title1="SETUP STOCK BROKER"
//               onClick1={handleSubmit(handleSetupBroker)}
//               />
//           </Box>
//         </Box>
//       </Box>
//     </>
//   );
// }
// export default StockBrokerSetup;
