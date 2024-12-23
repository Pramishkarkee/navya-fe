import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  useTheme,
  FormControl,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Select,
  MenuItem,
  Typography,
  // Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import CloseIcon from "@mui/icons-material/Close";
import { usePatchStockDetails } from "services/Stock Mapping/StockMappingService";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import { useGetSectorData } from "services/";
import * as yup from "yup";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import { yupResolver } from "@hookform/resolvers/yup";
// import { useGetSectorData } from "services/SectorData/SectorDataServices";
import { useGetAllSectorData } from "services/SectorData/SectorDataServices";

interface EditModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any;
  onSave: (updatedData: any) => void;
}

type EditFields = {
  symbol: string;
  stock_name: string;
  sector: string;
  stock_description: string;
  price_per_share: string;
  stock_paid_up_capital: string;
  is_stock_listed: boolean;
  face_value: string;
  security_type: string;
};

const shareTypeOptions = [
  { label: "Equity Shares", id: 1, value: "equity_shares" },
  // { label: "Corporate Debentures", id: 2, value: "corporate_debentures" },
  // { label: "Government Bonds", id: 3, value: "government_bonds" },
  { label: "Mutual Funds", id: 2, value: "mutual_funds" },
  { label: "Preference Shares", id: 3, value: "preference_shares" },
];

const EditStockModal: React.FC<EditModalProps> = ({
  open,
  setOpen,
  data,
  onSave,
}) => {
  const theme = useTheme();
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [successMsgs, setSuccessMsgs] = useState("");
  const [sectorOptions, setSectorOptions] = useState<
    { sector_id: any; sector_name: string; sector_code: string }[]
  >([]);

  const { mutate: patchStockDetails } = usePatchStockDetails(data?.id);

  const schema = yup
    .object({
      symbol: yup.string().required("Symbol is required").optional(),
      stock_name: yup.string().required("Stock name is required").optional(),
      sector: yup.string().required("Sector is required"),
      stock_description: yup
        .string()
        .required("Stock description is required")
        .optional(),
      price_per_share: yup
        .string()
        .required("Price per share is required")
        .optional(),
      stock_paid_up_capital: yup
        .string()
        .required("Stock paid up capital is required")
        .optional(),
      is_stock_listed: yup
        .boolean()
        .required("Is stock listed is required")
        .optional(),
      face_value: yup.string().required("Face value is required").optional(),
      security_type: yup
        .string()
        .required("Security type is required")
        .optional(),
      txn_scheme_limit: yup
        .string()
        .required()
        .label("Transaction Scheme Type Limit"),
      txn_paid_up_limit: yup
        .string()
        .required()
        .label("Transaction Paid Up Capital Limit"),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      symbol: data.symbol,
      stock_name: data.stock_name,
      price_per_share: Number(data.price_per_share).toFixed(2),
      stock_paid_up_capital: Number(data.stock_paid_up_capital).toFixed(2),
      face_value: Number(data.face_value).toFixed(2),
      security_type: data.security_type,
      sector: data.sector,
      txn_scheme_limit: Number(data.txn_scheme_limit).toFixed(2),
      txn_paid_up_limit: Number(data.txn_paid_up_limit).toFixed(2),
      stock_description: data.stock_description,
      is_stock_listed: data.is_stock_listed,
    },
    resolver: yupResolver<any>(schema),
  });

  const { data: stockData } = useGetAllSectorData();

  useEffect(() => {
    if (stockData?.isSuccess) {
      setSectorOptions(
        stockData.responseData.map((sector: any) => ({
          sector_id: sector.id,
          sector_name: sector.name,
          sector_code: sector.code,
        }))
      );
    }
  }, [stockData]);

  const handleSave = (formValues: EditFields) => {
    const formattedValues = {
      ...formValues,
      price_per_share: parseFloat(formValues.price_per_share).toFixed(2),
      stock_paid_up_capital: parseFloat(
        formValues.stock_paid_up_capital
      ).toFixed(2),
      face_value: parseFloat(formValues.face_value).toFixed(2),
    };

    patchStockDetails(formattedValues, {
      onSuccess: () => {
        setSuccessMsgs("Stock Details Updated Successfully.");
        setSnackbarSuccessOpen(true);
        onSave(formattedValues);
        setOpen(false);
      },
      onError: (error) => {
        setErrorMsgs("Error updating Stock Setup.");
        setSnackbarErrorOpen(true);
        console.log("Error", error);
      },
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getErrorMessage = (error: any): string | undefined => {
    if (typeof error === "string") return error;
    if (error && typeof error.message === "string") return error.message;
    return undefined;
  };

  return (
    <Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            maxHeight: "90vh",
            bgcolor: "background.paper",
            border: "2px solid #fff",
            borderRadius: 8,
            boxShadow: 24,
            p: 3.7,
            overflowY: "auto",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* <HeaderDesc title="Edit Stock Entry Details" /> */}
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "18px",
                color: theme.palette.primary.pureColor,
              }}
            >
              Edit Stock Entry Details
            </Typography>
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
          </Box>

          <Box
            component="form"
            sx={{ mt: 1 }}
            onSubmit={handleSubmit(handleSave)}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Controller
                name="symbol"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    margin="normal"
                    label="Symbol"
                    error={!!errors.symbol}
                    helperText={getErrorMessage(errors.symbol)}
                  />
                )}
              />
              <Controller
                name="stock_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    margin="normal"
                    label="Stock Name"
                    error={!!errors.stock_name}
                    helperText={getErrorMessage(errors.stock_name)}
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, marginBottom: "7px" }}>
              <Controller
                name="price_per_share"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    margin="normal"
                    label="Number of Share"
                    error={!!errors.price_per_share}
                    helperText={getErrorMessage(errors.price_per_share)}
                  />
                )}
              />
              <Controller
                name="stock_paid_up_capital"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    margin="normal"
                    label="Paid Up Capital"
                    error={!!errors.stock_paid_up_capital}
                    helperText={getErrorMessage(errors.stock_paid_up_capital)}
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, marginBottom: "7px" }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ width: "100%" }}>
                  <TypographyLabel title="Face Value" />
                  <Controller
                    name="face_value"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        sx={{ width: "260px" }}
                        size="small"
                        placeholder="Please Enter Face value"
                        error={!!errors.face_value}
                        // helperText={getErrorMessage(errors.face_value)}
                      />
                    )}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ width: "100%" }}>
                  <TypographyLabel title="Security Type" />
                  <Controller
                    name="security_type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        sx={{ width: "260px" }}
                        size="small"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        {shareTypeOptions.map((option) => (
                          <MenuItem key={option.id} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ width: "100%" }}>
                <TypographyLabel title="Sector" />
                <Controller
                  name="sector"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      size="small"
                      options={sectorOptions}
                      getOptionLabel={(option) => option.sector_name}
                      isOptionEqualToValue={(option, value) =>
                        option.sector_id === value.sector_id
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!errors.sector}
                          helperText={getErrorMessage(errors.sector)}
                        />
                      )}
                      value={
                        sectorOptions.find(
                          (sector) => sector.sector_id === Number(field.value)
                        ) || null
                      }
                      onChange={(_, data) =>
                        field.onChange(data ? data.sector_id : "")
                      }
                    />
                  )}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              {/* <Box sx={{ mt: 2 }}> */}
              {/* <TypographyLabel title="Stock Transaction Limit ( Scheme Size %)" /> */}
              <Controller
                name="txn_scheme_limit"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    margin="normal"
                    placeholder="1.23"
                    label="Stock Transaction Limit ( Scheme Size %)"
                    error={!!errors.txn_scheme_limit}
                    helperText={getErrorMessage(
                      errors.txn_scheme_limit?.message
                    )}
                  />
                )}
              />
              {/* </Box> */}

              {/* <Box sx={{ mt: 2 }}> */}
              {/* <TypographyLabel title="Stock Transaction Limit (Paid Up Capital %)" /> */}
              <Controller
                name="txn_paid_up_limit"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="2.54"
                    margin="normal"
                    label="Stock Transaction Limit (Paid Up Capital %)"
                    error={!!errors.txn_paid_up_limit}
                    helperText={getErrorMessage(
                      errors.txn_paid_up_limit?.message
                    )}
                  />
                )}
              />
              {/* </Box> */}
            </Box>

            <Controller
              name="stock_description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  fullWidth
                  margin="normal"
                  label="Stock Description"
                  multiline
                  minRows={2}
                  error={!!errors.stock_description}
                  helperText={getErrorMessage(errors.stock_description)}
                />
              )}
            />
            <Box>
              <FormControl>
                <Controller
                  name="is_stock_listed"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="Is this stock listed?"
                      labelPlacement="end"
                    />
                  )}
                />
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "2px",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  width: "fit-content",
                  borderRadius: "100px",
                  padding: "6px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: "20px",
                  backgroundColor: theme.palette.secondary.main,
                  "&:hover": {
                    bgcolor: theme.palette.primary.main,
                  },
                }}
                type="submit"
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <SuccessBar
        snackbarOpen={snackbarSuccessOpen}
        setSnackbarOpen={setSnackbarSuccessOpen}
        message={successMsgs}
      />
      <ErrorBar
        snackbarOpen={snackbarErrorOpen}
        setSnackbarOpen={setSnackbarErrorOpen}
        message={errorMsgs}
      />
    </Box>
  );
};
export default EditStockModal;

// import React, { useState, useEffect } from "react";
// import {
//     Modal,
//     Box,
//     TextField,
//     Button,
//     useTheme,
//     FormControl,
//     FormControlLabel,
//     Checkbox,
//     Autocomplete,
// } from "@mui/material";
// import { Controller, useForm } from "react-hook-form";
// import TypographyLabel from "components/InputLabel/TypographyLabel";
// import CloseIcon from '@mui/icons-material/Close';
// import { usePatchStockDetails } from "services/Stock Mapping/StockMappingService";
// import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import { useGetAllSectorData } from "services/SectorData/SectorDataServices";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import ErrorBar from "components/Snackbar/ErrorBar";

// interface EditModalProps {
//     open: boolean;
//     setOpen: (open: boolean) => void;
//     data: any;
//     onSave: (updatedData: any) => void;
// }

// type EditFields = {
//     symbol: string;
//     stock_name: string;
//     sector: string;
//     stock_description: string;
//     price_per_share: string;
//     stock_paid_up_capital: string;
//     is_stock_listed: boolean;
// };

// const EditStockModal: React.FC<EditModalProps> = ({ open, setOpen, data, onSave }) => {
//     const theme = useTheme();
//     const [sectorOptions, setSectorOptions] = useState<{
//         sector_id: any; sector_name: string, sector_code: string
// }[]>([]);
//     const [successabarOpen, setSuccessbarOpen] = useState<boolean>();
//     const [errorsbarOpen, setErrorbarOpen] = useState<boolean>();

//     const { mutate: patchStockDetails } = usePatchStockDetails(data?.id);

//     const schema = yup.object({
//         symbol: yup.string().required("Symbol is required"),
//         stock_name: yup.string().required("Stock name is required"),
//         sector: yup.string().required("Sector is required"),
//         stock_description: yup.string().required("Stock description is required"),
//         price_per_share: yup.string().required("Price per share is required"),
//         stock_paid_up_capital: yup.string().required("Stock paid up capital is required"),
//         is_stock_listed: yup.boolean().required("Is stock listed is required"),
//     }).required();

//     const {
//         control,
//         handleSubmit,
//         formState: { errors },
//         reset
//     } = useForm<EditFields>({
//         resolver: yupResolver<any>(schema),
//         // defaultValues: data,
//     });

//     const { data: stockData } = useGetAllSectorData();

//     useEffect(() => {
//         if (stockData?.isSuccess) {
//             setSectorOptions(
//                 stockData.responseData.map((sector: any) => ({
//                     sector_id : sector.id,
//                     sector_name: sector.name,
//                     sector_code: sector.code,
//                 }))
//             );
//         }
//     }, [stockData]);

//     // console.log(stockData.responseData.map(sector => {sector.id}) , "sector_id")
//     // console.log(stockData?.responseData?.map((sector: { sector_name: any; }) => sector.sector_name), "sector_id");
//     //    console.log(stockData?.responseData?.map((sector: { id: any; }) => sector.id), "sector_id");

//     // useEffect(() => {
//     //     reset(data);
//     // }, [data, reset]);

//     const handleSave = async (formData: EditFields) => {
//         try {
//             await patchStockDetails(formData ,
//                 {
//                     onSuccess: () => {
//                         console.log("Success")
//                         setOpen(false);
//                         setSuccessbarOpen(true);

//                     },
//                     onError: (error) => {
//                         console.log("Error" , error)
//                         setErrorbarOpen(true);
//                     }
//                 }
//             );
//             onSave(formData);
//             setOpen(false);
//         } catch (error) {
//             console.error("Failed to update stock details", error);
//         }
//     };

//     const handleClose = () => {
//         setOpen(false);
//     };

//     return (
//         <>
//         <SuccessBar
//         snackbarOpen={successabarOpen}
//         message={"Stock Details Successfully Updated"}
//         setSnackbarOpen={setSuccessbarOpen}
//         />
//         <ErrorBar
//         snackbarOpen={errorsbarOpen}
//         message={"Error in Updating Stock Details"}
//         setSnackbarOpen={setErrorbarOpen}
//         />

//         <Modal open={open} onClose={handleClose}>
//             <Box sx={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 width: 600,
//                 bgcolor: 'background.paper',
//                 border: '2px solid #fff',
//                 borderRadius: 8,
//                 boxShadow: 24,
//                 p: 4
//             }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <HeaderDesc title='Edit Stock Entry Details' />
//                     <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
//                 </Box>

//                 <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit(handleSave)}>
//                     <Box sx={{ display: "flex", gap: 2 }}>
//                         <Controller
//                             name="symbol"
//                             control={control}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     margin="normal"
//                                     label="Symbol"
//                                     error={!!errors.symbol}
//                                     helperText={errors.symbol?.message}
//                                 />
//                             )}
//                         />
//                         <Controller
//                             name="stock_name"
//                             control={control}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     margin="normal"
//                                     label="Stock Name"
//                                     error={!!errors.stock_name}
//                                     helperText={errors.stock_name?.message}
//                                 />
//                             )}
//                         />
//                     </Box>
//                     <Box sx={{ display: "flex", gap: 2, marginBottom: "7px" }}>
//                         <Controller
//                             name="price_per_share"
//                             control={control}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     margin="normal"
//                                     label="Price Per Share"
//                                     error={!!errors.price_per_share}
//                                     helperText={errors.price_per_share?.message}
//                                 />
//                             )}
//                         />
//                         <Controller
//                             name="stock_paid_up_capital"
//                             control={control}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     margin="normal"
//                                     label="Stock Paid Up Capital"
//                                     error={!!errors.stock_paid_up_capital}
//                                     helperText={errors.stock_paid_up_capital?.message}
//                                 />
//                             )}
//                         />
//                     </Box>
//                     <Box sx={{ display: "flex", gap: 2 }}>
//                         <Box sx={{ width: "100%" }}>
//                             <TypographyLabel title="Sector" />
//                             <Controller
//                                 name="sector"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <Autocomplete
//                                         {...field}
//                                         size="small"
//                                         options={sectorOptions}
//                                         getOptionLabel={(option) => option.sector_name}
//                                         // isOptionEqualToValue={(option, value) => option.sector_ode === value.sector_code}
//                                         isOptionEqualToValue={(option, value) => option.sector_id === value.sector_id}
//                                         renderInput={(params) => (
//                                             <TextField
//                                                 {...params}
//                                                 error={!!errors.sector}
//                                                 helperText={errors.sector?.message}
//                                                 />
//                                                 )}
//                                                 value={
//                                                     // sectorOptions.find(sector => Number(sector.sector_code) === data.sector) || null
//                                                     sectorOptions.find((sector) => sector.sector_id === Number(field.value)) || null

//                                                     }
//                                                     onChange={(_, data) =>
//                                                         {
//                                                             console.log(data,"dat...")
//                                                     field.onChange(data ? data.sector_id : "")
//                                                     }
//                                                 }
//                                                 />
//                                                 )}
//                                                 />

//                         </Box>
//                     </Box>

//                     <Controller
//                         name="stock_description"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 margin="normal"
//                                 label="Stock Description"
//                                 multiline
//                                 minRows={2}
//                                 error={!!errors.stock_description}
//                                 helperText={errors.stock_description?.message}
//                             />
//                         )}
//                     />
//                     <Box>
//                         <FormControl>
//                             <Controller
//                                 name="is_stock_listed"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <FormControlLabel
//                                         control={<Checkbox {...field} checked={field.value} />}
//                                         label="Is this stock listed?"
//                                         labelPlacement="end"
//                                     />
//                                 )}
//                             />
//                         </FormControl>
//                     </Box>
//                     <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
//                         <Button
//                             variant="contained"
//                             sx={{
//                                 width: 'fit-content',
//                                 borderRadius: "100px",
//                                 padding: "6px 24px",
//                                 fontSize: "14px",
//                                 fontWeight: 600,
//                                 lineHeight: "20px",
//                                 backgroundColor: theme.palette.secondary.main,
//                                 "&:hover": {
//                                     bgcolor: theme.palette.primary.main,
//                                 },
//                             }}
//                             type="submit"
//                         >
//                             Save
//                         </Button>
//                     </Box>
//                 </Box>
//             </Box>
//         </Modal>
//         </>
//     );
// };

// export default EditStockModal;

// import React, { useState, useEffect } from "react";
// import {
//     Modal,
//     Box,
//     TextField,
//     Button,
//     useTheme,
//     FormControl,
//     FormControlLabel,
//     Checkbox,
//     Autocomplete,
// } from "@mui/material";
// import { Controller, useForm } from "react-hook-form";
// import TypographyLabel from "components/InputLabel/TypographyLabel";
// import CloseIcon from '@mui/icons-material/Close';
// import { usePatchStockDetails } from "services/Stock Mapping/StockMappingService";

// import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import { useGetSectorData } from "services/SectorData/Sector";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import ErrorBar from "components/Snackbar/ErrorBar";

// interface EditModalProps {
//     open: boolean;
//     setOpen: (open: boolean) => void;
//     data: any;
//     onSave: (updatedData: any) => void;
// }

// type EditFields = {
//     id: number;
//     symbol: string;
//     stock_name: string;
//     sector: string;
//     stock_description: string;
//     price_per_share: string;
//     stock_paid_up_capital: string;
//     is_stock_listed: boolean;
// };

// const EditStockModal: React.FC<EditModalProps> = ({ open, setOpen, data }) => {
//     const theme = useTheme();
//     const [sectorOptions, setSectorOptions] = useState<{ sector_name: string, sector_code: string }[]>([]);
//     const [successabarOpen, setSuccessbarOpen] = useState<boolean>();
//     const [errorsbarOpen, setErrorbarOpen] = useState<boolean>();

//     // console.log("object", data)

//     const { mutate: patchStockDetails } = usePatchStockDetails(data?.id);

//     const schema = yup.object({
// symbol: yup.string().required("Symbol is required"),
// stock_name: yup.string().required("Stock name is required"),
// sector: yup.string().required("Sector is required"),
// stock_description: yup.string().required("Stock description is required"),
// price_per_share: yup.string().required("Price per share is required"),
// stock_paid_up_capital: yup.string().required("Stock paid up capital is required"),
// is_stock_listed: yup.boolean().required(),
//     }).required();

//     const {
//         control,
//         handleSubmit,
//         formState: { errors },
//         reset
//     } = useForm<EditFields>({
//         resolver: yupResolver<any>(schema),
//         defaultValues: {
//             symbol: data?.symbol,
//             stock_name: data?.stock_name,
//             // sector: String(data?.sector),
//             stock_description: data?.stock_description,
//             price_per_share: data?.price_per_share,
//             stock_paid_up_capital: data?.stock_paid_up_capital,
//             is_stock_listed: data?.is_stock_listed
//         }
//     });

//     const { data: stockData } = useGetSectorData();

//     useEffect(() => {
//         if (stockData?.isSuccess) {
//             setSectorOptions(
//                 stockData.responseData.map((sector: any) => ({
//                     sector_name: sector.name,
//                     sector_code: sector.code,
//                 }))
//             );
//         }
//     }, [stockData]);

//     useEffect(() => {
//         reset(data);
//     }, [data, reset]);

//     const handleSave = (data : EditFields) => {
//         const payload = {
//             id: data.id,
//             symbol: data.symbol,
//             stock_name: data.stock_name,
//             stock_description: data.stock_description,
//             price_per_share: data.price_per_share,
//             stock_paid_up_capital: data.stock_paid_up_capital,
//             is_stock_listed: data.is_stock_listed,
//             sector: data.sector,
//             };

//         patchStockDetails(payload ,
//             {
//                 onSuccess: () => {
//                     console.log("Success")
//                     setOpen(false);
//                     setSuccessbarOpen(true);
//                 },
//                 onError: (error) => {
//                     setErrorbarOpen(true);
//                     console.log("Error" , error)
//                 }
//             }
//         );

//     };

//     const handleClose = () => {
//         setOpen(false);
//     };

//     return (
//         <>
//         <SuccessBar
//         snackbarOpen={successabarOpen}
//         message={"Stock Details Successfully Updated"}
//         setSnackbarOpen={setSuccessbarOpen}
//         />

//         <ErrorBar
//         snackbarOpen={errorsbarOpen}
//         message={"Error in Updating Stock Details"}
//         setSnackbarOpen={setErrorbarOpen}
//         />

//         <Modal open={open} onClose={handleClose}>
//             <Box sx={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 width: 600,
//                 bgcolor: 'background.paper',
//                 border: '2px solid #fff',
//                 borderRadius: 8,
//                 boxShadow: 24,
//                 p: 4
//             }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <HeaderDesc title='Edit Stock Entry Details' />
//                     <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
//                 </Box>

//                 <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit(handleSave)}>
//                     <Box sx={{ display: "flex", gap: 2 }}>
//                         <Controller
//                             name="symbol"
//                             control={control}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     margin="normal"
//                                     label="Symbol"
//                                     error={!!errors.symbol}
//                                     helperText={errors.symbol?.message}
//                                 />
//                             )}
//                         />
//                         <Controller
//                             name="stock_name"
//                             control={control}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     margin="normal"
//                                     label="Stock Name"
//                                     error={!!errors.stock_name}
//                                     helperText={errors.stock_name?.message}
//                                 />
//                             )}
//                         />
//                     </Box>
//                     <Box sx={{ display: "flex", gap: 2, marginBottom: "7px" }}>
//                         <Controller
//                             name="price_per_share"
//                             control={control}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     margin="normal"
//                                     label="Price Per Share"
//                                     error={!!errors.price_per_share}
//                                     helperText={errors.price_per_share?.message}
//                                 />
//                             )}
//                         />
//                         <Controller
//                             name="stock_paid_up_capital"
//                             control={control}
//                             render={({ field }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     margin="normal"
//                                     label="Stock Paid Up Capital"
//                                     error={!!errors.stock_paid_up_capital}
//                                     helperText={errors.stock_paid_up_capital?.message}
//                                 />
//                             )}
//                         />
//                     </Box>
//                     <Box sx={{ display: "flex", gap: 2 }}>
//                         <Box sx={{ width: "100%" }}>
//                             <TypographyLabel title="Sector" />
//                             <Controller
//                                 name="sector"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <Autocomplete
//                                         {...field}
//                                         size="small"
//                                         options={sectorOptions}
//                                         getOptionLabel={(option) => option.sector_name}
//                                         renderInput={(params) => (
//                                             <TextField
//                                                 {...params}
//                                                 error={!!errors.sector}
//                                                 helperText={errors.sector?.message}
//                                             />
//                                         )}
//                                         onChange={(_, data) => field.onChange(data ? data.sector_code : "")}
//                                     />
//                                 )}
//                             />
//                         </Box>
//                     </Box>
//                     <Controller
//                         name="stock_description"
//                         control={control}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 fullWidth
//                                 margin="normal"
//                                 label="Stock Description"
//                                 multiline
//                                 minRows={2}
//                                 error={!!errors.stock_description}
//                                 helperText={errors.stock_description?.message}
//                             />
//                         )}
//                     />
//                     <Box>
//                         <FormControl>
//                             <Controller
//                                 name="is_stock_listed"
//                                 control={control}
//                                 render={({ field }) => (

//                                     <FormControlLabel
//                                     control={<Checkbox {...field} checked={field.value} />}
//                                     label="Is this stock listed?"
//                                     labelPlacement="end"
//                                 />
//                             )}
//                         />
//                     </FormControl>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
//                     <Button
//                         variant="contained"
//                         sx={{
//                             width: 'fit-content',
//                             borderRadius: "100px",
//                             padding: "6px 24px",
//                             fontSize: "14px",
//                             fontWeight: 600,
//                             lineHeight: "20px",
//                             backgroundColor: theme.palette.secondary.main,
//                             "&:hover": {
//                                 bgcolor: theme.palette.primary.main,
//                             },
//                         }}
//                         type="submit"
//                     >
//                         Save
//                     </Button>
//                 </Box>
//             </Box>
//         </Box>

//         </Modal>
//         </>
// );
// };

// export default EditStockModal;
