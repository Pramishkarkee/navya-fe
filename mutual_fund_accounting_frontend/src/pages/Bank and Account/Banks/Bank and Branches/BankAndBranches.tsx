import { Add, DeleteOutlined } from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import ErrorIcon from "@mui/icons-material/Error";
import { useEffect, useState } from "react";
import { usePostBanksAndBrachesDetails } from "services/Bank and Branches/BankAndBranchesServices";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const schema = yup
  .object()
  .shape({
    bank_name: yup.string().required().label("Bank Name"),
    bank_code: yup.string().required().label("Bank Code"),
    bank_address: yup.string().required().label("Bank Address"),
    swift_code: yup.string().required().label("Swift Code"),
    // nrb_symbol: yup.string().required().label("Nrbcode"),
    // branches: yup.object().shape({ branch_name: yup.string(), branch_code: yup.string(), branch_address: yup.string(), branch_type: yup.string() }).required().label("Branches"),
    // branches: yup.mixed().required().label("Branches"),
    branches: yup.mixed(),
    bank_type: yup.string().required().label("Bank Type"),
    is_main_branch: yup.boolean().required().label("Is Main Branch"),
  })
  .required();

export interface BankBranch {
  sn: number;
  branch_code: string;
  branch_address: string;
  branch_id: any;
  cpi_code: number;
  tel_no: number;
}
export interface UserFormInput {
  bank_name: string;
  bank_code: string;
  bank_address: string;
  swift_code: string;
  // nrb_symbol: string;
  branches: BankBranch[];
  bank_type: string;
  is_main_branch: boolean;
}
const columns = [
  {
    label: "S.No",
    width: "5%",
  },
  {
    label: "Branch ID",
    width: "23.75%",
  },
  {
    label: "Address",
    width: "23.75%",
  },
  {
    label: "Tel Number",
    width: "23.75%",
  },
  {
    label: "CIPS Code",
    width: "23.75%",
  },
];
const DefTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  height: "1rem",
  padding: "0rem",
  lineHeight: 1.5,
  fontFamily: "inherit",
  borderRight: `1px solid ${theme.palette.secondary.lightGrey}`,
  borderBottom: `1px solid ${theme.palette.secondary.lightGrey}`,
  "&.MuiTableCell-root:last-child": {
    borderRight: "none",
  },
}));
export default function BankAndBranches() {
  const theme = useTheme();
  const [showMessage, setShowMessage] = useState(false);

  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [successMsgs, setSuccessMsgs] = useState("");

  const {
    mutate: banksAndBrachesDetails,
    isSuccess: banksAndBrachesDetailsSuccess,
    isError: banksAndBrachesDetailsError,
  } = usePostBanksAndBrachesDetails();

  // const {
  //   control,
  //   handleSubmit,
  //   reset,
  //   formState: { errors, isSubmitSuccessful },
  // } = useForm<UserFormInput>({
  //   resolver: yupResolver<any>(schema),
  //   defaultValues: {
  //     bank_name: "",
  //     bank_code: "",
  //     bank_address: "",
  //     swift_code: "",
  //     is_main_branch: true,
  //     //   nrb_symbol: "",
  //     bank_type: "",
  //     //   branches: [
  //     //     {
  //     //       branch_code: "",
  //     //       branch_name: "",
  //     //       branch_address: "",
  //     //       branch_type: "",
  //     //     },
  //     //   ],
  //   },
  // });
  // console.log("error", errors);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitSuccessful },
  } = useForm<UserFormInput>({
    resolver: yupResolver<any>(schema),
    defaultValues: {
      bank_name: "",
      bank_code: "",
      bank_address: "",
      swift_code: "",
      is_main_branch: true,
      bank_type: "commercial_bank",
      branches: [
        {
          sn: 1,
          branch_code: "",
          branch_address: "",
          tel_no: 0,
          cpi_code: 0,
          branch_id: null,
        },
      ],
    },
  });
  const watchIsMainBranch = watch("is_main_branch");
  const watchBankAddress = watch("bank_address");
  useEffect(() => {
    if (watchIsMainBranch) {
      // Synchronize all branch addresses with the bank address when is_main_branch is true
      setRows((prevRows) =>
        prevRows.map((row) => ({
          ...row,
          branch_address: watchBankAddress,
        }))
      );
    }
  }, [watchIsMainBranch, watchBankAddress]);

  // useEffect(() => {
  //   if (banksAndBrachesDetailsSuccess) {
  //     setSuccessMsgs("Bank and Branches Entry Request has been submitted.");
  //     setSnackbarSuccessOpen(true);
  //     reset();
  //   }
  // }, [banksAndBrachesDetailsSuccess, reset]);

  // useEffect(() => {
  //   if (banksAndBrachesDetailsError) {
  //     setErrorMsgs("Error submitting Bank and Branches Entry Request.");
  //     setSnackbarErrorOpen(true);
  //   }
  // }, [banksAndBrachesDetailsError]);

  const handleBanksAndBrachesDetails = async (data: UserFormInput) => {
    try {
      banksAndBrachesDetails(
        { ...data, branches: rows },
        {
          onSuccess: () => {
            setErrorMsgs(null);
            setSuccessMsgs(
              "Bank and Branches Entry Request has been submitted."
            );
            setSnackbarSuccessOpen(true);
            reset();
          },
          onError: (error) => {
            setSuccessMsgs("");
            if (axios.isAxiosError(error) && error.response) {
              if (error.response.data) {
                // Extracting the error messages
                const errorMessages = extractErrorMessages(error.response.data);
                setErrorMsgs(errorMessages);
                setSnackbarErrorOpen(true);
              }
            }
          },
        }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Helper function to extract error messages
  const extractErrorMessages = (errorData: any): string => {
    if (errorData && errorData.branches) {
      return errorData.branches
        .map((branchError: any) => {
          return Object.entries(branchError)
            .map(([key, messages]) => {
              // Ensure messages is an array of strings
              if (Array.isArray(messages)) {
                return messages.join(", ");
              }
              return "";
            })
            .join(", ");
        })
        .join("; ");
    }
    return "An unknown error occurred.";
  };

  useEffect(() => {
    if (isSubmitSuccessful && banksAndBrachesDetailsSuccess) {
      reset();
      setRows([
        {
          sn: 1,
          branch_code: "",
          branch_address: "",
          tel_no: 0,
          cpi_code: 0,
          branch_id: null,
        },
      ]);
    }
  }, [isSubmitSuccessful, reset, banksAndBrachesDetailsSuccess]);

  const [rows, setRows] = useState<BankBranch[]>([
    {
      sn: 1,
      branch_code: "",
      branch_address: "",
      tel_no: 0,
      cpi_code: 0,
      branch_id: null,
    },
    // {
    //     sn: 2,
    //     branch_name: '',
    //     branch_address: '',
    //     branch_code: '',
    //     branch_type: '',
    //     branch_id: null,
    //     cpi_code: 0,
    //     tel_no: 0,
    // }
  ]);

  const handleRowChange = (index: number, field: number | string, value) => {
    const updatedRows = [...rows];
    if (watchIsMainBranch && field === "branch_address") {
      return; // Prevent changes to the branch address if is_main_branch is true
    }
    if (typeof value === "object" && "id" in value) {
      updatedRows[index][field] = value.label;
      updatedRows[index][`${field}_id`] = value.id;
    } else {
      updatedRows[index][field] = value;
    }
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    const newRows = Array.from({ length: 3 }, (_, i) => ({
      sn: rows.length + i + 1,
      branch_code: "",
      branch_address: watchIsMainBranch ? watchBankAddress : "",
      tel_no: 0,
      cpi_code: 0,
      branch_id: null,
    }));
    setRows([...rows, ...newRows]);
  };

  const handleClear = () => {
    setRows([
      {
        sn: 1,
        branch_code: "",
        branch_address: "",
        tel_no: 0,
        cpi_code: 0,
        branch_id: null,
      },
    ]);
  };

  const handleDeleteClick = (index: number) => {
    if (rows.length === 1) return;
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows.map((row, idx) => ({ ...row, sn: idx + 1 })));
  };

  const handleFocus = () => {
    setShowMessage(true);
  };
  return (
    <Box
      component="form"
      // onSubmit={handleSubmit(handleBanksAndBrachesDetails)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: { xs: "100%", sm: "80%", md: "100%", lg: "70%" },
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
          {" "}
          Bank Details{" "}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <Box>
            <TypographyLabel title={"Bank Code"} />
            <Box>
              <Controller
                name="bank_code"
                control={control}
                render={({ field }) => (
                  <TextField
                    style={{ width: "300px" }}
                    onFocus={handleFocus}
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="Please Enter Bank Code"
                    error={Boolean(errors.bank_code)}
                  />
                )}
              />
              {showMessage && (
                <Box sx={{ display: "flex", color: "#9E9E9E" }}>
                  <ErrorIcon sx={{ fontSize: "0.9rem", marginTop: "2px" }} />
                  <Typography sx={{ fontSize: "12px" }}>
                    {" "}
                    If the bank code doesn't exist, a new bank entry will be
                    made
                  </Typography>
                </Box>
              )}
              {errors.bank_code && (
                <Typography sx={{ fontSize: "12px" }} color="error">
                  {errors.bank_code.message}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <Box>
            <TypographyLabel title={"Bank Name"} />
            <Controller
              name="bank_name"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: "300px" }}
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="Please Enter Bank Name"
                  error={Boolean(errors.bank_name)}
                  helperText={errors.bank_name && errors.bank_name.message}
                />
              )}
            />
          </Box>
          <Box>
            <TypographyLabel title={"NRB Category"} />
            <Box sx={{ width: "300px" }}>
              <Controller
                name="bank_type"
                control={control}
                render={({ field }) => (
                  <Select {...field} size="small" fullWidth>
                    <MenuItem value="commercial_bank">Commercial Bank</MenuItem>
                    <MenuItem value="development_banks">
                      Development Bank
                    </MenuItem>
                    <MenuItem value="finance">Finance</MenuItem>
                    <MenuItem value="microfinance">Microfinance</MenuItem>
                    <MenuItem value="infrastructure">Infrastructure</MenuItem>
                  </Select>
                )}
              />
              {errors.bank_type && (
                <Typography sx={{ fontSize: "12px" }} color="error">
                  {errors.bank_type.message}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <Box>
            <TypographyLabel title={"Bank Address"} />
            <Controller
              name="bank_address"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: "300px" }}
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="Please Enter Bank Address"
                  error={Boolean(errors.bank_address)}
                  helperText={
                    errors.bank_address && errors.bank_address.message
                  }
                />
              )}
            />
          </Box>
          <Box>
            <TypographyLabel title={"SWIFT Code"} />
            <Controller
              name="swift_code"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: "300px" }}
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="Please Enter Swift Code"
                  error={Boolean(errors.swift_code)}
                  helperText={errors.swift_code && errors.swift_code.message}
                />
              )}
            />
          </Box>

          {/* <Box>
            <TypographyLabel title={"NRB Symbol"} />
            <Controller
              name="nrb_symbol"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ width: "300px" }}
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="Please Enter NRB Symbol"
                  error={Boolean(errors.nrb_symbol)}
                  helperText={errors.nrb_symbol && errors.nrb_symbol.message}
                />
              )}
            />
          </Box> */}
        </Box>
      </Box>
      <Box sx={{ width: "max-content" }}>
        <FormControl>
          <Controller
            name="is_main_branch"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="Is Main Branch?"
                labelPlacement="end"
              />
            )}
          />
        </FormControl>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginTop: "10px",
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
            {" "}
            Branch Details{" "}
          </Typography>
        </Box>
        <Table sx={{ width: { xs: "110%", lg: "200%" } }}>
          <TableHead>
            <TableRow>
              {columns?.map((item, index) => (
                <DefTableCell
                  key={index}
                  sx={{
                    width: item.width,
                    p: 1.5,
                    textAlign: index === 2 || index === 3 ? "start" : "start",
                  }}
                >
                  {item.label}
                </DefTableCell>
              ))}
              <DefTableCell
                sx={{
                  p: 1,
                }}
              ></DefTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {Object.keys(row).map(
                  (field, cellIndex) =>
                    field !== "branch_id" && (
                      <DefTableCell
                        key={cellIndex}
                        sx={{
                          border: "1px solid #ccc",
                          textAlign:
                            cellIndex === 0
                              ? "center"
                              : cellIndex === 2 || cellIndex === 3
                              ? "end"
                              : "start",
                        }}
                      >
                        {cellIndex === 0 ? (
                          row.sn
                        ) : cellIndex === 1 ? (
                          <TextField
                            sx={{ width: "100%" }}
                            size="medium"
                            value={row[field]}
                            onChange={(e) =>
                              handleRowChange(rowIndex, field, e.target.value)
                            }
                          />
                        ) : (
                          <TextField
                            fullWidth
                            size="medium"
                            value={
                              field === "branch_address" && watchIsMainBranch
                                ? watchBankAddress
                                : row[field] === 0
                                ? ""
                                : row[field]
                            }
                            onChange={(e) =>
                              handleRowChange(rowIndex, field, e.target.value)
                            }
                            inputProps={{
                              readOnly: cellIndex === 0 ? true : false,
                              style: {
                                textAlign:
                                  cellIndex === 2 || cellIndex === 3
                                    ? "start"
                                    : cellIndex === 0
                                    ? "center"
                                    : "start",
                              },
                            }}
                            sx={{
                              p: 0,
                              borderRadius: 0,
                              "& .MuiOutlinedInput-input": {
                                color: theme.palette.secondary[700],
                              },
                              "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": {
                                  borderColor: "#B2BAC2",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: theme.palette.secondary.main,
                                },
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                border: "1px solid transparent",
                                borderRadius: 0,
                              },
                            }}
                          />
                        )}
                      </DefTableCell>
                    )
                )}
                <DefTableCell sx={{ textAlign: "center" }}>
                  <IconButton onClick={() => handleDeleteClick(rowIndex)}>
                    <DeleteOutlined />
                  </IconButton>
                </DefTableCell>
              </TableRow>
            ))}
            <TableRow>
              <DefTableCell sx={{ p: 1, textAlign: "center" }}>
                <IconButton
                  onClick={() => {
                    setRows([
                      ...rows,
                      {
                        sn: rows.length + 1,
                        branch_code: "",
                        branch_address: watchIsMainBranch
                          ? watchBankAddress
                          : "",
                        tel_no: 0,
                        cpi_code: 0,
                        branch_id: null,
                      },
                    ]);
                  }}
                  sx={{
                    bgcolor: theme.palette.primary[1100],
                    color: "#fff",
                    p: 0,
                    "&:hover": {
                      bgcolor: theme.palette.secondary.main,
                    },
                  }}
                >
                  <Add sx={{ fontSize: "1.2rem" }} />
                </IconButton>
              </DefTableCell>
              <DefTableCell></DefTableCell>
              {[...Array(columns.length - 1)].map((_, index) => (
                <DefTableCell key={index}></DefTableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>

        <Box sx={{ display: "flex", gap: 1, my: 2 }}>
          <Button
            variant="contained"
            onClick={handleAddRow}
            size="small"
            sx={{
              boxShadow: "none",
              display: "flex",
              flexDirection: "row",
              gap: 1,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "100px",
              bgcolor: theme.palette.background.light,
              color: theme.palette.primary[1100],
              "&:hover": {
                bgcolor: theme.palette.secondary[300],
                boxShadow: "none",
              },
            }}
          >
            <Box
              sx={{
                bgcolor: theme.palette.primary[1100],
                color: "#fff",
                display: "flex",
                borderRadius: "50%",
              }}
            >
              <Add sx={{ fontSize: "1.2rem" }} />
            </Box>
            <Typography sx={{ fontSize: "14px" }}> Add Lines </Typography>
          </Button>
          <Button
            variant="outlined"
            onClick={handleClear}
            size="small"
            sx={{ borderRadius: "100px" }}
          >
            Clear Lines
          </Button>
        </Box>
        <RoundedButton
          title1="Complete Bank Entry"
          onClick1={handleSubmit(handleBanksAndBrachesDetails)}
        />
      </Box>
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
}
