import {
  Box,
  TextField,
  Typography,
  MenuItem,
  useTheme,
  Select,
  Autocomplete,
} from "@mui/material";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useCreateBankAccount,
  useGetBankListData,
} from "services/BankAccount/BankAccountServices";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import { useEffect, useState } from "react";
import axios from "axios";
// import { axiosInstance } from "config/axiosInstance";
// import InfoIcon from "@mui/icons-material/Info";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { colorTokens } from "../../../theme";

type Data = {
  bank_name: string;
  account_number: string;
  bank_account_type: string;
  current_account: string;
  interest_rate: number;
  opening_balance: number;
  minimum_balance_amount: number;
};

const schema = yup
  .object({
    bank_name: yup.string().required("Bank Name is required"),
    account_number: yup.string().required("Account Number is required"),
    bank_account_type: yup.string().required("Bank Account Type is required"),
    current_account: yup.string().optional(),
    // current_account: yup.string().test('is-required', 'Current Account is required', function(value) {
    //   const bankAccountType = this.resolve(yup.ref('bank_account_type'));
    //   if (bankAccountType === "2") {
    //     return value !== undefined && value !== '';
    //   }
    //   return true;
    // }),

    interest_rate: yup
      .number()
      .required("Interest Rate is required")
      .optional(),
    opening_balance: yup
      .number()
      .positive("Opening Balance must be a positive number")
      .required("Opening Balance is required")
      .min(0, "")
      .optional(),
    minimum_balance_amount: yup
      .number()
      .positive("Minimum Balance Amount must be a positive number")
      .required("Minimum Balance Amount is required")
      .min(0, "")
      .optional(),
  })
  .required();

const BankAccountCreate = () => {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Data>({
    resolver: yupResolver<any>(schema),
    defaultValues: {
      bank_name: "",
      account_number: "",
      bank_account_type: "3",
      interest_rate: 0,
      opening_balance: 0,
      minimum_balance_amount: 0,
    },
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorbarOpen, setErrorbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [BankOptions, setBankOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [AllBanks, setAllBanks] = useState([]);
  const [CurrentAccounts, setCurrentAccounts] = useState<
    { account_id: number; account_number: string }[]
  >([]);

  const { mutate: PostBankAccount, isError: ErrorBrokerData } =
    useCreateBankAccount();
  const { data: BankList, refetch: BankListRefetch } = useGetBankListData();

  // const fetchBankDetails = async () => {
  //   try {
  //     const response = await axiosInstance.get("/accounting/api/v1/parameters/bank-list/");
  //     if (response.data.isSuccess) {
  //       const options = response.data.responseData.map((bank) => ({
  //         value: bank.id,
  //         label: bank.bank_name,
  //       }));
  //       setBankOptions(options);
  //       setAllBanks(response.data.responseData);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching bank details:", error);
  //   }
  // };

  useEffect(() => {
    const options = BankList?.responseData?.map((bank) => ({
      value: bank.id,
      label: bank.bank_name,
    }));
    setBankOptions(options);
    setAllBanks(BankList?.responseData);
  }, [BankList]);

  const AccountType = watch("bank_account_type");

  const handleBankChange = (selectedBankId) => {
    const selectedBank = AllBanks.find((bank) => bank.id === selectedBankId);
    if (selectedBank) {
      const currentAccounts = selectedBank.bank_accounts?.CURRENT || [];
      setCurrentAccounts(currentAccounts);
    }
  };

  const handleSetupAccount = (data: Data) => {
    const baseData = {
      bank: Number(data.bank_name),
      account_number: data.account_number,
      account_type: Number(data.bank_account_type),
    };

    const type2Data = {
      ...baseData,
      current_account: Number(data.current_account),
      interest_rate: data.interest_rate,
    };

    const type3Data = {
      ...baseData,
      minimum_balance_amount: data.minimum_balance_amount,
      opening_balance: data.opening_balance,
    };

    let tempData;

    if (AccountType === "2") {
      tempData = type2Data;
    } else if (AccountType === "3") {
      tempData = type3Data;
    } else {
      tempData = baseData;
    }

    PostBankAccount(tempData, {
      onSuccess: () => {
        setSnackbarOpen(true);
        BankListRefetch();
        reset();
      },
      onError: (error) => {
        setErrorbarOpen(true);

        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage(
            error.response.data.account_number
              ? error.response.data.account_number[0]
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

  return (
    <>
      {snackbarOpen && (
        <SuccessBar
          snackbarOpen={snackbarOpen}
          message={"Bank Account Successfully Created!"}
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
        onSubmit={handleSubmit(handleSetupAccount)}
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
            Account Detail
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
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 0 }}>
              <Box sx={{ width: "50%" }}>
                <TypographyLabel title={"Bank Name"} />
                <Controller
                  name="bank_name"
                  control={control}
                  render={({ field }) => (
                    <Select
                      sx={{ width: "100%" }}
                      {...field}
                      size="small"
                      onChange={(event) => {
                        field.onChange(event.target.value);
                        handleBankChange(event.target.value);
                      }}
                      error={!!errors.bank_name}
                    >
                      {BankOptions?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.bank_name && (
                  <Typography color="error" sx={{ fontSize: "12px" }}>
                    {errors.bank_name.message}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ width: "50%" }}>
              <TypographyLabel title={"Account Number"} />
              <Controller
                name="account_number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="Please Enter Your Account Number"
                    error={!!errors.account_number}
                    helperText={errors.account_number?.message}
                  />
                )}
              />
            </Box>

            <Box sx={{ width: "50%", flex: "calc(50%-1rem)" }}>
              <TypographyLabel title={"Bank Account Type"} />
              <Controller
                name="bank_account_type"
                defaultValue="3"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="small"
                    fullWidth
                    placeholder="Please Select Account Type"
                  >
                    <MenuItem disabled value="1">
                      Fixed Deposit
                    </MenuItem>
                    <MenuItem value="2">Call Account</MenuItem>
                    <MenuItem value="3">Current Account</MenuItem>
                  </Select>
                )}
              />

              {errors.bank_account_type && (
                <Typography color="error">
                  {errors.bank_account_type.message}
                </Typography>
              )}
            </Box>

            {AccountType === "3" ? (
              <>
                <Box sx={{ width: "50%" }}>
                  <TypographyLabel title={"Minimum Balance Amount (Rs)"} />
                  <Controller
                    name="minimum_balance_amount"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        placeholder="1000000"
                        error={!!errors.minimum_balance_amount}
                        helperText={errors.minimum_balance_amount?.message}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ width: "50%" }}>
                  <TypographyLabel title={"Opening Balance (Rs)"} />
                  <Controller
                    name="opening_balance"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        placeholder="1000000"
                        error={!!errors.opening_balance}
                        helperText={errors.opening_balance?.message}
                      />
                    )}
                  />
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ width: "50%", mt: 0 }}>
                  <TypographyLabel title={"Link To Current Account"} />
                  <Controller
                    name="current_account"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange } }) => (
                      <Autocomplete
                        size="small"
                        options={CurrentAccounts.map((account) => ({
                          id: account.account_id,
                          label: `${
                            AllBanks.find(
                              (bank) => bank.id === Number(watch("bank_name"))
                            )?.bank_initials
                          } ${account.account_number} (Current Account)`,
                          account_id: account.account_id,
                        }))}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                          <TextField placeholder="" {...params} />
                        )}
                        onChange={(_, data) => onChange(data?.account_id)}
                      />
                    )}
                  />
                  <Typography variant="caption" color="error">
                    {errors.current_account?.message}
                  </Typography>
                </Box>

                <Box sx={{ width: "50%" }}>
                  <TypographyLabel title={"Interest Rate (In %)"} />
                  <Controller
                    name="interest_rate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        placeholder="5"
                        error={!!errors.interest_rate}
                        helperText={errors.interest_rate?.message}
                      />
                    )}
                  />
                </Box>
              </>
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <InfoOutlinedIcon color="disabled" fontSize="small" />
            <Typography
              sx={{ color: colorTokens.grey[500], fontSize: "0.9rem" }}
            >
              {`${
                Number(watch("bank_name"))
                  ? AllBanks.find(
                      (bank) => bank.id === Number(watch("bank_name"))
                    )?.bank_initials
                  : ""
              }`}
              -{" "}
              {Number(watch("bank_account_type")) === 1
                ? "FD"
                : Number(watch("bank_account_type")) === 2
                ? "CALL"
                : "CURRENT"}
              - {watch("account_number")} will be the created sub-ledger head
            </Typography>
          </Box>
        </Box>
        <Box>
          <RoundedButton title1="Create Bank Account" />
        </Box>
      </Box>
    </>
  );
};

export default BankAccountCreate;

// import { Box, TextField, Typography, MenuItem, useTheme, Select, Autocomplete } from "@mui/material";
// import RoundedButton from "components/Button/Button";
// import TypographyLabel from "components/InputLabel/TypographyLabel";
// import { Controller, useForm } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useCreateBankAccount } from "services/BankAccount/BankAccountServices";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import ErrorBar from "components/Snackbar/ErrorBar";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { axiosInstance } from "config/axiosInstance";

// type Data = {
//   bank_name: string;
//   account_number: string;
//   bank_account_type: string;
//   current_account: string;
//   interest_rate: number;
//   opening_balance: number;
//   minimum_balance_amount: number;
// };

// const schema = yup
//   .object({
//     bank_name: yup.string().required("Bank Name is required"),
//     account_number: yup.string().required("Account Number is required"),
//     bank_account_type: yup.string().required("Bank Account Type is required"),
//     current_account: yup.string().optional(),
//     interest_rate: yup
//       .number()
//       .required("Interest Rate is required")
//       .optional(),
//       // .nullable()
//       // .positive("Interest Rate must be a positive number"),
//     opening_balance: yup.number().positive("Opening Balance must be a positive number").required("Opening Balance is required"),
//     minimum_balance_amount: yup.number().positive("Minimum Balance Amount must be a positive number").required("Minimum Balance Amount is required").optional(),
//   })
//   .required();

// const BankAccountCreate = () => {
//   const theme = useTheme();

//   const {
//     control,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<Data>({
//     resolver: yupResolver<any>(schema),
//     defaultValues: {
//       account_number: "",
//       bank_account_type: "2",

//     },
//   });

//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [errorbarOpen, setErrorbarOpen] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string>("");
//   const [BankOptions, setBankOptions] = useState<{ value: number; label: string }[] >([]);

//   const { mutate: PostBankAccount , isError : ErrorBrokerData } = useCreateBankAccount();

//   useEffect(() => {
//     const fetchBankDetails = async () => {
//       try {
//         const response = await axiosInstance.get(
//           "/accounting/api/v1/parameters/bank-list/"
//         );
//         if (response.data.isSuccess) {
//           const options = response.data.responseData.map((bank) => ({
//             value: bank.id,
//             label: bank.bank_name,
//           }));
//           setBankOptions(options);
//         }
//       } catch (error) {
//         console.error("Error fetching bank details:", error);
//       }
//     };

//     fetchBankDetails();
//   }, []);

//   const AccountType = watch("bank_account_type");

//   const handleSetupAccount = (data: Data) => {
//     const baseData = {
//       bank: Number(data.bank_name),
//       account_number: data.account_number,
//       account_type: Number(data.bank_account_type),
//       opening_balance: data.opening_balance,
//     };

//     const type2Data = {
//       ...baseData,
//       link_to_current_account: data.current_account,
//       interest_rate: data.interest_rate,
//     };

//     const type3Data = {
//       ...baseData,
//       minimum_balance_amount: data.minimum_balance_amount,
//     };

//     let tempData;

//     if (AccountType === "2") {
//       tempData = type2Data;
//     } else if (AccountType === "3") {
//       tempData = type3Data;
//     } else {
//       tempData = baseData;
//     }

//     PostBankAccount(tempData, {
//       onSuccess: () => {
//         setSnackbarOpen(true);
//       },
//     onError: (error) => {
//       setErrorbarOpen(true);

//       if (axios.isAxiosError(error) && error.response) {
//           setErrorMessage(
//               error.response.data.broker_code
//                   ? error.response.data.broker_code[0]
//                   : error.response.data.transaction_limit
//                       ? error.response.data.transaction_limit[0]
//                       : 'Error in submitting data!'
//           );
//       } else {
//           setErrorMessage('Error in submitting data!');
//       }
//   }
//     }
//   );
//   };

//   return (
//     <>
//       {snackbarOpen && (
//         <SuccessBar
//           snackbarOpen={snackbarOpen}
//           message={"Successfully Submitted!"}
//           setSnackbarOpen={setSnackbarOpen}
//         />
//       )}

//       {ErrorBrokerData && (
//         <ErrorBar
//           snackbarOpen={errorbarOpen}
//           message={errorMessage}
//           setSnackbarOpen={setErrorbarOpen}
//         />
//       )}

//       <Box
//         component="form"
//         onSubmit={handleSubmit(handleSetupAccount)}
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
//             Account Detail
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

//                <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 0 }}>
//                 <Box sx={{ width: "50%" }}>
//                   <TypographyLabel title={"Bank Name"} />
//                   <Controller
//                     name="bank_name"
//                     control={control}
//                     render={({ field }) => (
//                       <Select
//                         sx={{ width: "100%" }}
//                         {...field}
//                         size="small"
//                         onChange={(event) => {
//                           field.onChange(event.target.value);
//                           // fetchBranchDetails(event.target.value);
//                         }}
//                         error={!!errors.bank_name}
//                         // MenuProps={customMenuProps}
//                       >
//                         {BankOptions.map((option) => (
//                           <MenuItem key={option.value} value={option.value}>
//                             {option.label}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     )}
//                   />
//                   {errors.bank_name && (
//                     <Typography color="error" sx={{ fontSize: "12px" }}>
//                       {errors.bank_name.message}
//                     </Typography>
//                   )}
//                 </Box>
//               </Box>

//               <Box sx={{ width: "50%" }}>
//               <TypographyLabel title={"Account Number"} />
//               <Controller
//                 name="account_number"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth
//                     size="small"
//                     placeholder="Please Enter Your Account Number"
//                     error={!!errors.account_number}
//                     helperText={errors.account_number?.message}
//                   />
//                 )}
//               />
//             </Box>

//              <Box sx={{ width: "50%", flex: "calc(50%-1rem)" }}>
//                   <TypographyLabel title={"Bank Account Type"} />
//                   <Controller
//                     name="bank_account_type"
//                     defaultValue="2"
//                     control={control}
//                     render={({ field }) => (
//                       <Select {...field} size="small" fullWidth placeholder="Please Select Account Type">
//                         <MenuItem disabled value="1"> Fixed Deposit</MenuItem>
//                         <MenuItem value="2">Call Account</MenuItem>
//                         <MenuItem value="3">Current Account</MenuItem>
//                       </Select>
//                     )}
//                   />

//                   {errors.bank_account_type && (
//                     <Typography color="error">{errors.bank_account_type.message}</Typography>
//                   )}
//               </Box>

//           {AccountType === "3" ? (

//             <Box sx={{ width: "50%" }}>
//               <TypographyLabel title={"Minimum Balance Amount (Rs)"} />
//               <Controller
//                 name="minimum_balance_amount"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth
//                     size="small"
//                     placeholder="1000000"
//                     error={!!errors.minimum_balance_amount}
//                     helperText={errors.minimum_balance_amount?.message}
//                   />
//                 )}
//               />
//             </Box>

//             ) :
//             <>
//             <Box sx={{ width: "50%", mt: 0 }}>
//               <TypographyLabel title={"Link To Current Account"} />
//               <Controller
//                 name="current_account"
//                 control={control}
//                 defaultValue=""
//                 render={({ field }) => (
//                   <Autocomplete
//                     {...field}
//                     size="small"
//                     options={
//                       BankOptions?.map((option) => option.label) ?? []
//                     }
//                     renderInput={(params) => (
//                       <TextField placeholder="" {...params} />
//                     )}
//                     onChange={(_, data) => field.onChange(data)}
//                   />
//                 )}
//               />
//               <Typography variant="caption" color="error">
//                 {errors.current_account?.message}
//               </Typography>
//             </Box>

//             <Box sx={{ width: "50%" }}>
//               <TypographyLabel title={"Interest Rate (In %)"} />
//               <Controller
//                 name="interest_rate"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth
//                     size="small"
//                     placeholder="5"
//                     error={!!errors.interest_rate}
//                     helperText={errors.interest_rate?.message}
//                   />
//                 )}
//               />
//             </Box>
//             </>}

//             <Box sx={{ width: "50%" }}>
//               <TypographyLabel title={"Opening Balance (Rs)"} />
//               <Controller
//                 name="opening_balance"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth
//                     size="small"
//                     placeholder="1000000"
//                     error={!!errors.opening_balance}
//                     helperText={errors.opening_balance?.message}
//                   />
//                 )}
//               />
//             </Box>

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
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 gap: 2,
//               }}
//             >
//             </Box>
//             <Box>
//               <RoundedButton title1="Create Bank Acocunt" />
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default BankAccountCreate;

// // import React from 'react'
// // import {
// //   Autocomplete,
// //   Box,
// //   TextField,
// //   Typography,
// //   useTheme,
// //   Select,
// //   MenuItem,
// // } from "@mui/material";
// // import TypographyLabel from "components/InputLabel/TypographyLabel";
// // import { schemaNameOptions } from "constants/Stock Data/StockData";
// // import { useState, useEffect } from "react";
// // import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// // import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// // import RoundedButton from "components/Button/Button";
// // import * as yup from "yup";
// // import { yupResolver } from "@hookform/resolvers/yup";
// // import { Controller, useForm } from "react-hook-form";
// // import SuccessBar from "components/Snackbar/SuccessBar";
// // import ErrorBar from "components/Snackbar/ErrorBar";
// // import { usePostIpoCreate } from "services/ipo/ipoServices";
// // import dayjs from "dayjs";
// // import { axiosInstance } from "config/axiosInstance";

// // const customMenuProps = {
// //   PaperProps: {
// //     style: {
// //       maxHeight: 200,
// //     },
// //   },
// // };

// // const schema = yup
// //   .object({
// //     // stock_name: yup.string().required().label("Stock Name is required"),
// //     // application_form_number: yup.number().required().label("Symbol is required"),
// //     // schema_name: yup.string().required().label("Schema Name is required"),
// //     // applied_units: yup.number().required().label("Applied Units is required"),
// //     // per_share_value: yup
// //     //   .number()
// //     //   .required()
// //     //   .label("Per Share Value is required"),
// //     // share_application_type: yup.string().required().label("Share Application Type is required"),
// //     // apply_date: yup.string().required("Apply Date is required").nullable(),
// //     bank_name: yup.string().required().label("Bank Name is required"),
// //     // branch_name: yup.string().required().label("Branch Name is required"),
// //     // bank_account_number: yup.string().required().label("Bank Account Number is required"),
// //     // cheque_number: yup.string().required().label("Cheque Number is required"),
// //     // deposit_amount: yup.number().required().label("Deposit Amount is required"),
// //   })
// //   .required();
// // const BankAccountCreate = () => {
// //   const {
// //     handleSubmit,
// //     control,
// //     watch,
// //     reset,
// //     setValue,
// //     formState: { errors },
// //   } = useForm<any>({
// //     resolver: yupResolver<any>(schema),
// //     defaultValues: {
// //       bank_name: "",

// //     },
// //   });
// //   const theme = useTheme();
//   // const [BankOptions, setBankOptions] = useState<
//   //   { value: number; label: string }[]
//   // >([]);

// //   const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
// //   const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
// //   const [errorMsgs, setErrorMsgs] = useState("");
// //   const [successMsgs, setSuccessMsgs] = useState("");
// //   const [stockSymbols, setStockSymbols] = useState<any[]>([]);

// //   useEffect(() => {
// //     const fetchBankDetails = async () => {
// //       try {
// //         const response = await axiosInstance.get(
// //           "/accounting/api/v1/parameters/bank-list/"
// //         );
// //         if (response.data.isSuccess) {
// //           const options = response.data.responseData.map((bank) => ({
// //             value: bank.id,
// //             label: bank.bank_name,
// //           }));
// //           setBankOptions(options);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching bank details:", error);
// //       }
// //     };

// //     fetchBankDetails();
// //   }, []);

// //   const onSubmit = (data: any) => {
// //     setErrorMsgs(null);
// //     // ipoCreation(data,
// //     //   {
// //     //   onSuccess: () => {
// //     //     setErrorMsgs(null);
// //     //     setSuccessMsgs("Ipo Entry has been submitted successfully.");
// //     //     setSnackbarSuccessOpen(true);
// //     //     reset();
// //     //   },
// //     //   onError: (error: any) => {
// //     //     console.error("API error", error);
// //     //     setSuccessMsgs("");
// //     //     setErrorMsgs("Error while creating Ipo.");
// //     //     setSnackbarErrorOpen(true);
// //     //   },
// //     // });
// //   };
// //   return (
// //     <Box component="form" onSubmit={handleSubmit(onSubmit)}>

//       // <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 2 }}>
//       //   <Box sx={{ width: "250px" }}>
//       //     <TypographyLabel title={"Bank Name"} />
//       //     <Controller
//       //       name="bank_name"
//       //       control={control}
//       //       render={({ field }) => (
//       //         <Select
//       //           sx={{ width: "250px" }}
//       //           {...field}
//       //           size="small"
//       //           onChange={(event) => {
//       //             field.onChange(event.target.value);
//       //             // fetchBranchDetails(event.target.value);
//       //           }}
//       //           error={!!errors.bank_name}
//       //           MenuProps={customMenuProps}
//       //         >
//       //           {BankOptions.map((option) => (
//       //             <MenuItem key={option.value} value={option.value}>
//       //               {option.label}
//       //             </MenuItem>
//       //           ))}
//       //         </Select>
//       //       )}
//       //     />
//       //     {errors.bank_name && (
//       //       <Typography color="error" sx={{ fontSize: "12px" }}>
//       //         {/* {errors.bank_name.message} */}
//       //       </Typography>
//       //     )}
//       //   </Box>

//       // </Box>
// //       <Box>
// //         <TypographyLabel title={"Account Number"} />
// //         <Controller
// //           name="account_number"
// //           control={control}
// //           render={({ field }) => (
// //             <TextField
// //               {...field}
// //               sx={{ width: "250px" }}
// //               size="small"
// //               placeholder="Please Enter Account Number"
// //               error={!!errors.cheque_number}
// //             // helperText={errors.cheque_number?.message}
// //             />
// //           )}
// //         />
// //       </Box>

// //     </Box>
// //   )
// // }

// // export default BankAccountCreate

// import {
//   Box,
//   TextField,
//   Typography,
//   MenuItem,
//   useTheme,
//   Select,
//   Autocomplete,
// } from "@mui/material";
// import RoundedButton from "components/Button/Button";
// import TypographyLabel from "components/InputLabel/TypographyLabel";
// import { Controller, useForm } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useCreateBankAccount } from "services/BankAccount/BankAccountServices";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import ErrorBar from "components/Snackbar/ErrorBar";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { axiosInstance } from "config/axiosInstance";

// type Data = {
//   bank_name: string;
//   account_number: string;
//   bank_account_type: string;
//   current_account: string;
//   interest_rate: number;
//   opening_balance: number;
//   minimum_balance_amount: number;
// };

// const schema = yup
//   .object({
//     bank_name: yup.string().required("Bank Name is required"),
//     account_number: yup.string().required("Account Number is required"),
//     bank_account_type: yup.string().required("Bank Account Type is required"),
//     current_account: yup.string().optional(),
//     interest_rate: yup
//       .number()
//       .required("Interest Rate is required")
//       .optional(),
//     // .nullable()
//     // .positive("Interest Rate must be a positive number"),
//     opening_balance: yup
//       .number()
//       .positive("Opening Balance must be a positive number")
//       .required("Opening Balance is required"),
//     minimum_balance_amount: yup
//       .number()
//       .positive("Minimum Balance Amount must be a positive number")
//       .required("Minimum Balance Amount is required")
//       .optional(),
//   })
//   .required();

// const BankAccountCreate = () => {
//   const theme = useTheme();

//   const {
//     control,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<Data>({
//     resolver: yupResolver<any>(schema),
//     defaultValues: {
//       account_number: "",
//       bank_account_type: "2",
//     },
//   });

//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [errorbarOpen, setErrorbarOpen] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string>("");
//   const [BankOptions, setBankOptions] = useState<
//     {
//       bank_accounts: any; value: number; label: string
// }[]
//   >([]);
//   const [CurrentAccounts, setCurrentAccounts] = useState<
//     { account_id: number; account_number: string }[]
//   >([]);

//   const { mutate: PostBankAccount, isError: ErrorBrokerData } = useCreateBankAccount();

//   useEffect(() => {
//     const fetchBankDetails = async () => {
//       try {
//         const response = await axiosInstance.get("/accounting/api/v1/parameters/bank-list/");
//         if (response.data.isSuccess) {
//           const options = response.data.responseData.map((bank) => ({
//             value: bank.id,
//             label: bank.bank_name,
//           }));
//           setBankOptions(options);
//         }
//       } catch (error) {
//         console.error("Error fetching bank details:", error);
//       }
//     };

//     fetchBankDetails();
//   }, []);

//   const AccountType = watch("bank_account_type");

//   const handleBankChange = (selectedBankId) => {
//     const selectedBank = BankOptions.find((bank) => bank.value === selectedBankId);
//     if (selectedBank) {
//       const currentAccounts = selectedBank.bank_accounts?.CURRENT || [];
//       setCurrentAccounts(currentAccounts);
//     }
//   };

//   const handleSetupAccount = (data: Data) => {
//     const baseData = {
//       bank: Number(data.bank_name),
//       account_number: data.account_number,
//       account_type: Number(data.bank_account_type),
//       opening_balance: data.opening_balance,
//     };

//     const type2Data = {
//       ...baseData,
//       link_to_current_account: data.current_account,
//       interest_rate: data.interest_rate,
//     };

//     const type3Data = {
//       ...baseData,
//       minimum_balance_amount: data.minimum_balance_amount,
//     };

//     let tempData;

//     if (AccountType === "2") {
//       tempData = type2Data;
//     } else if (AccountType === "3") {
//       tempData = type3Data;
//     } else {
//       tempData = baseData;
//     }

//     PostBankAccount(tempData, {
//       onSuccess: () => {
//         setSnackbarOpen(true);
//       },
//       onError: (error) => {
//         setErrorbarOpen(true);

//         if (axios.isAxiosError(error) && error.response) {
//           setErrorMessage(
//             error.response.data.broker_code
//               ? error.response.data.broker_code[0]
//               : error.response.data.transaction_limit
//               ? error.response.data.transaction_limit[0]
//               : "Error in submitting data!"
//           );
//         } else {
//           setErrorMessage("Error in submitting data!");
//           console.error(error);
//         }
//       },
//     });
//   };

//   return (
//     <>
//       {snackbarOpen && (
//         <SuccessBar
//           snackbarOpen={snackbarOpen}
//           message={"Successfully Submitted!"}
//           setSnackbarOpen={setSnackbarOpen}
//         />
//       )}

//       {ErrorBrokerData && (
//         <ErrorBar
//           snackbarOpen={errorbarOpen}
//           message={errorMessage}
//           setSnackbarOpen={setErrorbarOpen}
//         />
//       )}

//       <Box
//         component="form"
//         onSubmit={handleSubmit(handleSetupAccount)}
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
//             Account Detail
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
//             <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 0 }}>
//               <Box sx={{ width: "50%" }}>
//                 <TypographyLabel title={"Bank Name"} />
//                 <Controller
//                   name="bank_name"
//                   control={control}
//                   render={({ field }) => (
//                     <Select
//                       sx={{ width: "100%" }}
//                       {...field}
//                       size="small"
//                       onChange={(event) => {
//                         field.onChange(event.target.value);
//                         handleBankChange(event.target.value); // Update current accounts
//                       }}
//                       error={!!errors.bank_name}
//                       // MenuProps={customMenuProps}
//                     >
//                       {BankOptions.map((option) => (
//                         <MenuItem key={option.value} value={option.value}>
//                           {option.label}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   )}
//                 />
//                 {errors.bank_name && (
//                   <Typography color="error" sx={{ fontSize: "12px" }}>
//                     {errors.bank_name.message}
//                   </Typography>
//                 )}
//               </Box>
//             </Box>

//             <Box sx={{ width: "50%" }}>
//               <TypographyLabel title={"Account Number"} />
//               <Controller
//                 name="account_number"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth
//                     size="small"
//                     placeholder="Please Enter Your Account Number"
//                     error={!!errors.account_number}
//                     helperText={errors.account_number?.message}
//                   />
//                 )}
//               />
//             </Box>

//             <Box sx={{ width: "50%", flex: "calc(50%-1rem)" }}>
//               <TypographyLabel title={"Bank Account Type"} />
//               <Controller
//                 name="bank_account_type"
//                 defaultValue="2"
//                 control={control}
//                 render={({ field }) => (
//                   <Select
//                     {...field}
//                     size="small"
//                     fullWidth
//                     placeholder="Please Select Account Type"
//                   >
//                     <MenuItem disabled value="1">
//                       Fixed Deposit
//                     </MenuItem>
//                     <MenuItem value="2">Call Account</MenuItem>
//                     <MenuItem value="3">Current Account</MenuItem>
//                   </Select>
//                 )}
//               />

//               {errors.bank_account_type && (
//                 <Typography color="error">{errors.bank_account_type.message}</Typography>
//               )}
//             </Box>

//             {AccountType === "3" ? (
//               <Box sx={{ width: "50%" }}>
//                 <TypographyLabel title={"Minimum Balance Amount (Rs)"} />
//                 <Controller
//                   name="minimum_balance_amount"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       fullWidth
//                       size="small"
//                       placeholder="1000000"
//                       error={!!errors.minimum_balance_amount}
//                       helperText={errors.minimum_balance_amount?.message}
//                     />
//                   )}
//                 />
//               </Box>
//             ) : (
//               <>
//                 <Box sx={{ width: "50%", mt: 0 }}>
//                   <TypographyLabel title={"Link To Current Account"} />
//                   <Controller
//                     name="current_account"
//                     control={control}
//                     defaultValue=""
//                     render={({ field }) => (
//                       <Autocomplete
//                         {...field}
//                         size="small"
//                         options={CurrentAccounts.map(
//                           (account) => account.account_number
//                         )}
//                         renderInput={(params) => (
//                           <TextField placeholder="" {...params} />
//                         )}
//                         onChange={(_, data) => field.onChange(data)}
//                       />
//                     )}
//                   />
//                   <Typography variant="caption" color="error">
//                     {errors.current_account?.message}
//                   </Typography>
//                 </Box>

//                 <Box sx={{ width: "50%" }}>
//                   <TypographyLabel title={"Interest Rate (In %)"} />
//                   <Controller
//                     name="interest_rate"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField
//                         {...field}
//                         fullWidth
//                         size="small"
//                         placeholder="5"
//                         error={!!errors.interest_rate}
//                         helperText={errors.interest_rate?.message}
//                       />
//                     )}
//                   />
//                 </Box>
//               </>
//             )}

//             <Box sx={{ width: "50%" }}>
//               <TypographyLabel title={"Opening Balance (Rs)"} />
//               <Controller
//                 name="opening_balance"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth
//                     size="small"
//                     placeholder="1000000"
//                     error={!!errors.opening_balance}
//                     helperText={errors.opening_balance?.message}
//                   />
//                 )}
//               />
//             </Box>
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
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 gap: 2,
//               }}
//             ></Box>
//             <Box>
//               <RoundedButton title1="Create Bank Acocunt" />
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default BankAccountCreate;
