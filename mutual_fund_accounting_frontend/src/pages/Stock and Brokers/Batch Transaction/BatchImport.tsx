import {
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { useCallback, useEffect, useRef, useState } from "react";
import Auth from "utils/Auth";
import axios, { isAxiosError } from "axios";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import RoundedButton from "components/Button/Button";
import { useGetAllStockBrokerData } from "services/StockBroker/StockBrokerServices";
import { usePatchBatchTransaction } from "services/BatchTransaction/BatchTransactionServices";
import { PaginationState } from "@tanstack/react-table";
import ReceiptTable from "components/Table/TanstackTable";
// import { BatchUpdateTableHeader } from "constants/BatchTransactions/BatchTransactionTableHeader";
// import SearchText from "components/Button/Search";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Empty } from "antd";

import { Delete, Edit } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { useGlobalStore } from "store/GlobalStore";

// Added Just for Test Purpose
// import { usePatchBondAndDebentureSalesData } from "services/BondAndDebenture/BondAndDebenture";
// import { useDeleteBankAccount } from "services/BankAccount/BankAccountServices";

type LTPUpdate = {
  sn: number;
  symbol: string;
  value: number;
  business_date: string;
  buy_sell: string;
  quantity: number;
  rate: number;
  amount: number;
  stc_type: string;
};

interface FileInput {
  lastModified?: number;
  lastModifiedDate?: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath?: string;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

// const debounce = (func, delay) => {
//   let timeoutId;
//   return (...args) => {
//     if (timeoutId) clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => {
//       func(...args);
//     }, delay);
//   };
// };

const BatchImport = () => {
  const allotmentDate = useGlobalStore((state) => state.allotmentDate);
  const theme = useTheme();
  const todayDate = dayjs();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const hiddenFileInput = useRef(null);
  const [date, setDate] = useState(todayDate);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const [batchSuccess, setBatchSuccess] = useState(false);
  const [batchError, setBatchError] = useState(false);

  const [uploadData, setUploadData] = useState(null);
  const [errorMsgs, setErrorMsgs] = useState("");

  const [fileUpload, setFileUpload] = useState<FileInput>(null);
  const [file, setFile] = useState<File | null>(null);

  const [brokerCodeDropdown, setBrokerCodeDropdown] = useState<any[]>([]);

  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const [isPendingState, setIsPendingState] = useState(false);

  const schema = yup.object().shape({
    broker_code: yup.string().required("Broker Code is required"),
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<any>(schema),
    defaultValues: {
      broker_code: null,
    },
  });

  const BrokerCode = watch("broker_code");

  const { data: stockBrokerData, refetch: refetchStockBroker } =
    useGetAllStockBrokerData();

  const toalPageCount = Math.ceil(1);

  useEffect(() => {
    if (stockBrokerData) {
      setBrokerCodeDropdown(stockBrokerData.responseData);
    }
  }, [stockBrokerData]);

  useEffect(() => {
    if (uploadData?.next === null) {
      setNext(false);
    } else {
      setNext(true);
    }
    if (uploadData?.previous === null) {
      setPrev(false);
    } else {
      setPrev(true);
    }
  }, [uploadData]);

  const handleCSVUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setFileUpload(uploadedFile);
  };

  const handleFileUpload = async (data) => {
    setIsPendingState(true);
    try {
      const formData = new FormData();

      formData.append("file", file ? file : null);
      formData.append("import_date", date.format("YYYY-MM-DD"));
      formData.append("broker_code", data.broker_code);
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${Auth.getAccessToken()}`,
      };

      const response = await axios.post(
        `${BASE_URL}/accounting/api/v1/batch-update/stock-bond-batch-update/`,
        formData,
        {
          headers: headers,
        }
      );

      if (response.data.isSuccess) {
        // setSuccessMsgs(response?.data?.message);
        setUploadData(response.data);
        setSuccessSnackbarOpen(true);
        setIsPendingState(false);
      } else {
        setErrorMsgs("Error occured while uploading file.");
        setErrorSnackbarOpen(true);
      }
    } catch (error) {
      setIsPendingState(false);
      if (isAxiosError(error) && error.response) {
        setErrorMsgs(
          error?.response?.data?.file
            ? error?.response?.data?.file
            : "Error occured while uploading file."
        );
        setErrorSnackbarOpen(true);
      }
    }
  };

  const handleFileUploadClick = () => {
    hiddenFileInput.current.click();
  };

  const { mutate: handleConfirmBatchUpdate } = usePatchBatchTransaction();

  const handleConfirmBatchUpdateClick = async (e) => {
    e.preventDefault();

    const payload = uploadData?.responseData.map((item) => {
      return {
        symbol: item.symbol,
        quantity: item.quantity,
        rate: item.rate,
        buy_sell: item.buy_sell,
        txn_date: item.transaction_date,
        commission_rate: item.stock_comm.toFixed(2),
        broker_code: BrokerCode,
      };
    });

    handleConfirmBatchUpdate(payload, {
      onSuccess: () => {
        setSuccessSnackbarOpen(true);
        setUploadData([]);
      },
      onError: (error) => {
        if (isAxiosError(error) && error.response) {
          setErrorMsgs(
            error?.response?.data?.details
              ? error?.response?.data?.details[0]
              : error?.response?.data?.non_field_errors
              ? error?.response?.data?.non_field_errors[0]
              : "Error on Submitting Batch"
          );
          setErrorSnackbarOpen(true);
        }
      },
    });
  };

  const salesValidationSchema = yup.object().shape({
    buy_sell: yup.string().required("Transaction Type is required"),
    quantity: yup.number().required("Quantity is required"),
    rate: yup.number().required("Rate is required"),
    amount: yup.number().required("Amount is required"),
  });

  // Edit Modal Component

  const EditModal = ({
    open,
    setOpen,
    data,
  }: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    data: any;
  }) => {
    const {
      handleSubmit,
      setValue,
      reset,
      watch,
      control,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(salesValidationSchema),
      defaultValues: {
        buy_sell: data?.buy_sell || "",
        quantity: data?.quantity || "",
        rate: data?.rate || "",
        amount: data?.amount || "",
      },
    });

    const handleClose = () => {
      reset();
      setOpen(false);
    };

    const theme = useTheme();
    const [successbar, setSuccessbar] = useState(false);
    const [errorbar, setErrorbar] = useState(false);

    const handleChange = (
      event: React.ChangeEvent<
        | HTMLInputElement
        | HTMLTextAreaElement
        | { name?: string; value: unknown }
      >
    ) => {
      const { name, value } = event.target;
      if (
        name === "buy_sell" ||
        name === "quantity" ||
        name === "rate" ||
        name === "amount"
      ) {
        setValue(name, value as string);
      }
    };

    const ItemQuantity = watch("quantity");
    const ItemRate = watch("rate");

    useEffect(() => {
      setValue("amount", ItemQuantity * ItemRate);
    }, [ItemQuantity, ItemRate, data, setValue]);

    const handleConfirmEdit = (formData: any) => {
      setUploadData((prevUploadData) => {
        const updatedData = prevUploadData?.responseData.map((item) => {
          if (item.s_n === data.s_n) {
            return {
              ...item,
              ...formData,
            };
          }
          return item;
        });
        return {
          ...prevUploadData,
          responseData: updatedData,
        };
      });

      setSuccessbar(true);
      setOpen(false);
    };

    return (
      <>
        <SuccessBar
          snackbarOpen={successbar}
          setSnackbarOpen={setSuccessbar}
          message="Successfully Updated!"
        />
        <ErrorBar
          snackbarOpen={errorbar}
          setSnackbarOpen={setErrorbar}
          message="Error Occured while Updating Data"
        />

        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle sx={{ textDecoration: "underline" }}>
            Edit Details
          </DialogTitle>
          <DialogContent>
            <Box component="form">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  mt: 0.5,
                }}
              >
                <Controller
                  name="buy_sell"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="medium"
                      fullWidth
                      onChange={(event) => {
                        field.onChange(event);
                        handleChange(
                          event as React.ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        );
                      }}
                    >
                      <MenuItem value="purchase">Purchase</MenuItem>
                      <MenuItem value="sell">Sell</MenuItem>
                    </Select>
                  )}
                />
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      size="medium"
                      {...field}
                      label="Quantity"
                      error={!!errors.quantity}
                      helperText={errors.quantity?.message}
                      onChange={handleChange}
                    />
                  )}
                />
                <Controller
                  name="rate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      size="medium"
                      {...field}
                      label="Rate"
                      error={!!errors.rate}
                      helperText={errors.rate?.message}
                      onChange={handleChange}
                    />
                  )}
                />
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      // disabled
                      size="medium"
                      // id="outlined-read-only-input"
                      InputProps={{ readOnly: true }}
                      // slotProps={{ readOnly: true }}
                      {...field}
                      label="Amount"
                      error={!!errors.amount}
                      helperText={errors.amount?.message}
                      onChange={handleChange}
                    />
                  )}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                color: theme.palette.secondary.main,
                mt: 1,
                borderRadius: 10,
                lineHeight: "20px",
              }}
            >
              Cancel
            </Button>
            <RoundedButton
              title1="Confirm"
              onClick1={handleSubmit(handleConfirmEdit)}
            />
          </DialogActions>
        </Dialog>
      </>
    );
  };

  //Another Way for Edit Modal Component
  // const EditModal = ({
  //   open,
  //   setOpen,
  //   data,
  // }: {
  //   open: boolean;
  //   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  //   data: any;
  // }) => {
  //   const {
  //     handleSubmit,
  //     // setValue,
  //     watch,
  //     reset,
  //     control,
  //     formState: { errors },
  //   } = useForm({
  //     resolver: yupResolver(salesValidationSchema),
  //     defaultValues: {
  //       buy_sell: data?.buy_sell || "",
  //       quantity: data?.quantity || "",
  //       rate: data?.rate || "",
  //       amount: data?.amount || "",
  //     },
  //   });

  //   const Transaction = watch("buy_sell");

  //   const handleClose = () => {
  //     reset();
  //     setOpen(false);
  //   };

  //   const theme = useTheme();
  //   const [successbar, setSuccessbar] = useState(false);
  //   const [errorbar, setErrorbar] = useState(false);

  //   const handleConfirmEdit = (formData: any) => {
  //     setUploadData((prevUploadData) => {
  //       const updatedData = prevUploadData?.responseData.map((item) => {
  //         if (item.s_n === data.s_n) {
  //           return {
  //             ...item,
  //             ...formData,
  //           };
  //         }
  //         return item;
  //       });
  //       return {
  //         ...prevUploadData,
  //         responseData: updatedData,
  //       };
  //     });

  //     setOpen(false);
  //     setSuccessbar(true);
  //   };

  //   return (
  //     <>
  //       <SuccessBar
  //         snackbarOpen={successbar}
  //         setSnackbarOpen={setSuccessbar}
  //         message="Data Successfully Updated"
  //       />
  //       <ErrorBar
  //         snackbarOpen={errorbar}
  //         setSnackbarOpen={setErrorbar}
  //         message="Error Occured while Updating Data"
  //       />

  //       <Dialog open={open} onClose={handleClose} fullWidth>
  //         <DialogTitle sx={{ textDecoration: "underline" }}>
  //           Edit Details
  //         </DialogTitle>
  //         <DialogContent>
  //           <Box component="form">
  //             <Box
  //               sx={{
  //                 display: "flex",
  //                 flexDirection: "column",
  //                 gap: 2,
  //                 mt: 0.5,
  //               }}
  //             >
  //               <Controller
  //                 name="buy_sell"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <Select
  //                     {...field}
  //                     size="medium"
  //                     fullWidth
  //                   >
  //                     <MenuItem value="purchase">Purchase</MenuItem>
  //                     <MenuItem value="sell">Sell</MenuItem>
  //                   </Select>
  //                 )}
  //               />
  //               {errors.buy_sell && (
  //                 <Typography color="error">
  //                   {errors.buy_sell.message}
  //                 </Typography>
  //               )}

  //               <Controller
  //                 name="quantity"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <TextField
  //                     size="medium"
  //                     {...field}
  //                     label="Quantity"
  //                     error={!!errors.quantity}
  //                     helperText={errors.quantity?.message}
  //                   />
  //                 )}
  //               />
  //               <Controller
  //                 name="rate"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <TextField
  //                     size="medium"
  //                     {...field}
  //                     label="Rate"
  //                     error={!!errors.rate}
  //                     helperText={errors.rate?.message}
  //                   />
  //                 )}
  //               />
  //               <Controller
  //                 name="amount"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <TextField
  //                     size="medium"
  //                     {...field}
  //                     label="Amount"
  //                     error={!!errors.amount}
  //                     helperText={errors.amount?.message}
  //                   />
  //                 )}
  //               />
  //             </Box>
  //           </Box>
  //         </DialogContent>
  //         <DialogActions>
  //           <Button
  //             variant="outlined"
  //             onClick={handleClose}
  //             sx={{
  //               color: theme.palette.secondary.main,
  //               mt: 1,
  //               borderRadius: 10,
  //               lineHeight: "20px",
  //             }}
  //           >
  //             Cancel
  //           </Button>
  //           <RoundedButton
  //             title1="Confirm"
  //             onClick1={handleSubmit(handleConfirmEdit)}
  //           />
  //         </DialogActions>
  //       </Dialog>
  //     </>
  //   );
  // };

  // Table Header Component

  const BatchUpdateTableHeader: ColumnDef<LTPUpdate>[] = [
    {
      header: "S.N",
      accessorKey: "sn",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {data.row.index + 1}
          </Typography>
        );
      },
    },

    {
      header: "Symbol",
      accessorKey: "symbol",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {data.row.original.symbol}
          </Typography>
        );
      },
    },
    {
      header: "Transaction Type",
      accessorKey: "buy_sell",
      cell: (data) => {
        return (
          <Typography
            sx={{
              textAlign: "left",
              width: { sm: "40%", md: "30%", lg: "35%" },
              textTransform: "capitalize",
              fontSize: "14px",
              fontWeight: "400",
            }}
          >
            {data.row.original.buy_sell === "purchase" ? "Purchase" : "Sell"}
          </Typography>
        );
      },
    },
    {
      header: "Stock Type",
      accessorKey: "stc_type",
      cell: (data) => {
        const StockType = data.row.original?.stc_type?.replace(/_/g, " ");
        return (
          <Typography
            sx={{
              textTransform: "capitalize",
              fontSize: "14px",
              fontWeight: "400",
            }}
            textAlign="left"
          >
            {StockType ?? "-"}
          </Typography>
        );
      },
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      cell: (data) => {
        return (
          <Typography
            textAlign="right"
            sx={{ fontSize: "14px", fontWeight: "400", width: "45px" }}
          >
            {data.row.original.quantity}
          </Typography>
        );
      },
    },
    {
      header: "Rate",
      accessorKey: "rate",
      cell: (data) => {
        return (
          <Typography
            textAlign="right"
            sx={{ fontSize: "14px", fontWeight: "400", width: "30px" }}
          >
            {data.row.original.rate}
          </Typography>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (data) => {
        return (
          <Typography
            textAlign="right"
            sx={{ fontSize: "14px", fontWeight: "400", width: "45px" }}
          >
            {data.row.original.amount}
          </Typography>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (data) => {
        const [editOpen, setEditOpen] = useState(false);

        const handleEdit = () => {
          setEditOpen(true);
        };

        return (
          <>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <EditModal
                open={editOpen}
                setOpen={setEditOpen}
                data={data.row.original}
                // onSave={handleSave}
              />

              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box
                  onClick={handleEdit}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 0.2,
                    fontSize: "14px",
                    fontWeight: "400",
                    // color: colorTokens.mainColor[1100],
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  <Edit sx={{ fontSize: "14px" }} />
                  <Typography fontSize="14px" fontWeight="500">
                    Edit
                  </Typography>
                </Box>
                <ActionCell data={data} />
              </Box>
            </Box>
          </>
        );
      },
    },
  ];

  // Delete Button Component
  const ActionCell = ({ data }) => {
    const theme = useTheme();
    const [successBarOpen, setSuccessBarOpen] = useState<boolean>(false);
    const [errorBarOpen, setErrorBarOpen] = useState<boolean>(false);

    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleDelete = () => {
      setConfirmOpen(true);
    };

    const handleConfirmDelete = (s_n: number) => {
      // setUploadData(uploadData?.responseData.filter((item) => item.s_n !== s_n));

      setUploadData((prevUploadData) => ({
        ...prevUploadData,
        responseData: prevUploadData?.responseData?.filter(
          (item) => item.s_n !== s_n
        ),
      }));
    };

    const handleConfirmClose = () => {
      setConfirmOpen(false);
    };

    return (
      <>
        <SuccessBar
          snackbarOpen={successBarOpen}
          setSnackbarOpen={setSuccessBarOpen}
          message="Deleted Successfully!"
        />
        <ErrorBar
          snackbarOpen={errorBarOpen}
          setSnackbarOpen={setErrorBarOpen}
          message="Failed to Delete!"
        />

        <Modal open={confirmOpen} onClose={handleConfirmClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "30%",
              bgcolor: "background.paper",
              borderRadius: "8px",
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" component="h2">
              Confirmation
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Are you sure you want to Delete (
              <span style={{ fontWeight: 500 }}>
                {data.row.original.symbol}
              </span>
              )?
            </Typography>
            <Box
              sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}
            >
              <Button
                sx={{
                  color: theme.palette.secondary.main,
                  "&:hover": {
                    bgcolor: theme.palette.primary.mediumColor,
                  },
                }}
                variant="outlined"
                onClick={handleConfirmClose}
              >
                Cancel
              </Button>
              <Button
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  "&:hover": {
                    bgcolor: theme.palette.primary.main,
                  },
                }}
                variant="contained"
                onClick={() => handleConfirmDelete(data.row.original.s_n)}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>

        <Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
            <Box
              onClick={handleDelete}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 0,
                // color: colorTokens.mainColor[900],
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              <Delete
                color="error"
                sx={{ fontSize: "14px", ml: 1.5, fontWeight: "400" }}
              />
              <Typography fontSize="14px" fontWeight="500">
                Delete
              </Typography>
            </Box>
          </Box>
        </Box>
      </>
    );
  };

  const handleReset = () => {
    refetchStockBroker();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12} lg={8}>
        <SuccessBar
          snackbarOpen={successSnackbarOpen}
          setSnackbarOpen={setSuccessSnackbarOpen}
          message={"Details Uploaded Successfully."}
        />
        <ErrorBar
          snackbarOpen={errorSnackbarOpen}
          setSnackbarOpen={setErrorSnackbarOpen}
          message={errorMsgs}
        />

        <SuccessBar
          snackbarOpen={batchSuccess}
          setSnackbarOpen={setBatchSuccess}
          message={"Batch Updated Successfully."}
        />
        <ErrorBar
          snackbarOpen={batchError}
          setSnackbarOpen={setBatchError}
          message={errorMsgs}
        />

        <Box sx={{ mt: 1 }} component="form">
          <HeaderDesc title="Upload Details" />
          <Box sx={{ mt: 2, width: "50%" }}>
            <TypographyLabel title="Date of Imported Data" />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{}}>
                <DatePicker
                  format="YYYY-MM-DD"
                  maxDate={todayDate}
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        borderRadius: 2,
                        "& .MuiInputBase-root": {
                          borderRadius: 2,
                        },
                        "& fieldset": {
                          borderRadius: 2,
                        },
                      },
                    },
                  }}
                  minDate={dayjs(allotmentDate)}
                  sx={{
                    // width: "100%",
                    "& .MuiSvgIcon-root": {
                      width: "16px",
                      height: "16px",
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>

          <Box sx={{ mt: 2, width: 230 }}>
            <TypographyLabel title="Broker Code" />
            <Controller
              name="broker_code"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  size="small"
                  options={brokerCodeDropdown}
                  getOptionLabel={(option) =>
                    `${option.broker_name} (${option.broker_code})`
                  }
                  value={
                    brokerCodeDropdown.find(
                      (option) => option.broker_code === field.value
                    ) || null
                  }
                  onChange={(event, value) => {
                    if (value) {
                      field.onChange(value.broker_code);
                    } else {
                      field.onChange(null);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.broker_code}
                      helperText={errors.broker_code?.message?.toString()}
                    />
                  )}
                />
              )}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <TypographyLabel title="Floorsheet File" />
            <Button
              variant="outlined"
              startIcon={<AttachFileIcon />}
              onClick={handleFileUploadClick}
              sx={{
                borderRadius: 2,
                width: 230,
                borderColor: theme.palette.secondary[700],
                color: theme.palette.primary[1100],
                textTransform: "none",
              }}
            >
              {fileUpload ? fileUpload.name : "Select a File"}

              <VisuallyHiddenInput
                type="file"
                // value={field.value?.name}
                hidden
                ref={hiddenFileInput}
                sx={{ display: "none" }}
                accept=".csv , application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleCSVUpload}
              />
            </Button>
            <Box mt={1}>
              <RoundedButton
                title1="Upload"
                onClick1={handleSubmit(handleFileUpload)}
                // disable={isPendingState}
                loading={isPendingState}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 2 }}>
            <HeaderDesc title="Upload Preview" />
            {/* <Box>
              <SearchText
                title="Search"
                onChange={(e) => debouncedSetValue(e.target.value)}
                // onClick={handleSearchClick}
              />
            </Box> */}
            <Box>
              {uploadData?.responseData?.length > 0 ? (
                <Box
                  sx={{
                    maxWidth: "1500px",
                    width: { md: "105%", lg: "180%", xl: "180%" },
                  }}
                >
                  <ReceiptTable
                    columns={BatchUpdateTableHeader}
                    data={uploadData?.responseData ?? []}
                    pagination={pagination}
                    setPagination={setPagination}
                    pageCount={toalPageCount}
                    next={next}
                    prev={prev}
                  />

                  <Box mt={0}>
                    {" "}
                    <RoundedButton
                      title1="Confirm Batch Update"
                      onClick1={handleConfirmBatchUpdateClick}
                    />
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    maxWidth: "1500px",
                    width: { md: "105%", lg: "180%", xl: "180%" },
                  }}
                >
                  <ReceiptTable columns={BatchUpdateTableHeader} data={[]} />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      ml: { md: 5, lg: 20 },
                      mt: 5,
                    }}
                  >
                    <Empty
                      imageStyle={{ height: 150, width: 150 }}
                      description="No Data Available"
                    />
                    <Typography
                      onClick={handleReset}
                      sx={{
                        color: theme.palette.primary[1100],
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Reset Filters
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default BatchImport;
