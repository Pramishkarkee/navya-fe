import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useTheme,
  Autocomplete,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ColumnDef } from "@tanstack/react-table";
import { Visibility } from "@mui/icons-material";
import { colorTokens } from "../../theme";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import axios from "axios";
import * as yup from "yup";
import { usePatchBondAndDebentureSalesData } from "services/BondAndDebenture/BondAndDebenture";
import { useGetAllStockBrokerData } from "services/StockBroker/StockBrokerServices";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import axios from "axios";
import RoundedButton from "components/Button/Button";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import dayjs, { Dayjs } from "dayjs";
import { useGlobalStore } from "store/GlobalStore";
// import { Modal } from "antd";
// import SecurityTypes from "pages/Parameters Setup/Sector/SecurityTypes";

// Sales details validation schema
const salesValidationSchema = yup.object().shape({
  sales_units: yup
    .number()
    .required("Sold Units is required")
    .positive()
    .integer(),
  sale_price: yup.number().required("Selling Price is required").positive(),
  broker_name: yup.string().required("Broker Name is required").optional(),
  sale_date: yup.date().required("Sale Date is required").nullable(),
  remarks: yup.string().required("Sales Remarks is required"),
});

interface ModalData {
  [key: string]: string;
}

const formatDateToSimple = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ViewModal = ({
  open,
  setOpen,
  data,
  modalData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: { id: number };
  modalData: ModalData;
}) => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(salesValidationSchema),
  });

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const allotmentDate = useGlobalStore(state => state.allotmentDate)
  const theme = useTheme();
  const [successbar, setSuccessbar] = useState(false);
  const [errorbar, setErrorbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [brokerList, setBrokerList] = useState([]);

  const { data: brokerData, isSuccess } = useGetAllStockBrokerData();

  const { mutate: SalesData, isPending: PendingConfirm } = usePatchBondAndDebentureSalesData();

  const brokerOptions = brokerData?.responseData?.map((item) => ({
    broker_id: item.id,
    broker_name: item.broker_name,
    broker_code: item.broker_code,
  }));

  //  const findBroker = brokerList.find((option) => option.broker_name === modalData["Status"]);

  // const islisted = findBroker?.bond_status ? "listed" : "unlisted";

  const findStatus = modalData["Status"];

  useEffect(() => {
    if (isSuccess) {
      setBrokerList(brokerOptions);
    }
  }, [isSuccess]);

  const onSubmit = async (formData: Record<string, any>) => {
    const temp1 = {
      txn_units: formData.sales_units,
      txn_price: formData.sale_price,
      remarks: formData.remarks,
      txn_date: formatDateToSimple(formData.sale_date),
      bond_and_debenture: data.id,
      broker: Number(formData.broker_name),
    };
    const temp2 = {
      txn_units: formData.sales_units,
      txn_price: formData.sale_price,
      remarks: formData.remarks,
      txn_date: formatDateToSimple(formData.sale_date),
      bond_and_debenture: data.id,
    };
    const tempData = findStatus === "Listed" ? temp1 : temp2;

    SalesData(tempData, {
      onSuccess: () => {
        handleClose();
        setSuccessbar(true);
      },
      onError: (error) => {
        setErrorbar(true);
        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage(
            error.response.data.non_field_errors
              ? error.response.data.non_field_errors[0]
              : error.response.data.details
              ? error.response.data.details[0]
              : "Error in Selling Units!"
          );
        } else {
          setErrorMessage("Error in Selling Units!");
          console.error(error);
        }
      },
    });
    handleClose();

    // try {
    //   const formattedData = {
    //     ...formData,
    //     sale_date: formatDateToSimple(formData.sale_date),
    //     debenture_id: data.id,
    //   };

    //   const response = await axios.post('https://api-mf-acc.navyaadvisors.com/accounting/api/v1/debentures/sell/', formattedData);
    // handleClose();
    // } catch (error) {
    //   console.error("Error updating sales details:", error);
    // }
  };

  return (
    <>
      <SuccessBar
        snackbarOpen={successbar}
        setSnackbarOpen={setSuccessbar}
        message="Units Sell Successfully"
      />
      <ErrorBar
        snackbarOpen={errorbar}
        setSnackbarOpen={setErrorbar}
        message={errorMessage}
      />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ textDecoration: "underline" }}>Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Sales Details</Typography>
              <form>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mt: 0.5,
                  }}
                >
                  <Controller
                    name="sales_units"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="medium"
                        {...field}
                        label="Sold Units"
                        error={!!errors.sales_units}
                        helperText={errors.sales_units?.message}
                      />
                    )}
                  />
                  <Controller
                    name="sale_price"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="medium"
                        {...field}
                        label="Selling Price"
                        error={!!errors.sale_price}
                        helperText={errors.sale_price?.message}
                      />
                    )}
                  />

                  {findStatus === "Listed" ? (
                    <Controller
                      name="broker_name"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          size="medium"
                          options={brokerList}
                          getOptionLabel={(option) =>
                            `${option.broker_name} (${option.broker_code})`
                          }
                          value={
                            brokerList.find(
                              (option) => option.broker_id === field.value
                            ) || null
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Broker Name"
                              error={!!errors.broker_name}
                              helperText={errors.broker_name?.message}
                            />
                          )}
                          onChange={(e, value) => {
                            field.onChange(value ? value?.broker_id : "");
                          }}
                        />
                      )}
                    />
                  ) : null}

                  {/* <Controller
                    name="sale_date"
                    control={control}
                    render={({ field }) => (
                      <TextField
                      size="medium"
                        {...field}
                        label="Sale Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.sale_date}
                        helperText={errors.sale_date?.message}
                      />
                    )}
                  /> */}

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      name="sale_date"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <DatePicker<Dayjs>
                          label="Sale Date"
                          {...field}
                          sx={{
                            width: "100%",
                            "& .MuiSvgIcon-root": {
                              width: "26px",
                              height: "26px",
                            },
                          }}
                          slotProps={{ textField: { size: "small" } }}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date) => field.onChange(date)}
                          minDate={dayjs(allotmentDate)}
                          // error={!!errors.applyDate}
                          // helperText={errors.applyDate?.message}
                        />
                      )}
                    />
                  </LocalizationProvider>

                  <Controller
                    name="remarks"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="medium"
                        {...field}
                        label="Sales Remarks"
                        multiline
                        rows={3}
                        error={!!errors.remarks}
                        helperText={errors.remarks?.message}
                      />
                    )}
                  />
                </Box>
              </form>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Entry Details</Typography>
              <Box>
                {Object.entries(modalData).map(([key, value]) => (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">{key}</Typography>
                    <Typography variant="body1">{String(value)}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{pb:3 , px:3}}>
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
          {/* <Button onClick={handleSubmit(onSubmit)} color="primary" variant="contained">
            Confirm
          </Button> */}
          <RoundedButton 
          title1="Confirm" 
          onClick1={handleSubmit(onSubmit)}
          loading={PendingConfirm}
           />
        </DialogActions>
      </Dialog>
    </>
  );
};

export interface DebentureTableListHeaders {
  status: string;
  id: number;
  bond_name: string;
  broker_code: string;
  broker_name: string;
  invested_amount: string;
  type: string;
  cumm_units: string;
  purchase_price: string;
  coupon: string;
  purchase_date: string;
  maturity_date: string;
  coupon_rate: string;
  collection_date: string;
  coupon_amount: string;
  premium_amortization: string;
  days_until_interest: string;
  coupon_frequency: string;
  remaining_units: string;
  days_until_maturity: string;
  effective_rate: string;
  issue_date: string;
  face_value: string;
  bond_status: string;
  auto_book_coupon: boolean;
  auto_book_amortization: boolean;
  created_at: string;
}

export const DebentureTableList: ColumnDef<DebentureTableListHeaders>[] = [
  {
    header: "ID",
    accessorKey: "id",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
          {data.row.original.id}
        </Typography>
      );
    },
  },
  {
    header: "Issue Date",
    accessorKey: "issue_date",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
          {data.row.original.issue_date || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Name",
    accessorKey: "bond_name",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
          {data.row.original.bond_name || "N/A"}
        </Typography>
      );
    },
  },
  // {
  //   header: "Broker Name",
  //   accessorKey: "broker_name",
  //   cell: (data) => {
  //     return <Typography sx={{ fontSize: "0.85rem", textAlign: "left" }}>{data.row.original.broker_name}</Typography>;
  //   },
  // },
  // {
  //   header: "Security Type",
  //   accessorKey: "security_type",
  //   cell: (data) => {
  //     return <Typography sx={{ fontSize: "0.85rem", textAlign: "left" }}>{data.row.original.type}</Typography>;
  //   },
  // },
  {
    header: "Coupon Rate",
    accessorKey: "coupon_rate",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
          {parseInt(data.row.original.coupon_rate || "N/A")}
        </Typography>
      );
    },
  },
  {
    header: "Coupon Frequency",
    accessorKey: "coupon_frequency",
    cell: (data) => {
      const couponFrequency =
        Number(data.row.original.coupon_frequency) === 12
          ? "Monthly"
          : Number(data.row.original.coupon_frequency) === 3
          ? "Quarterly"
          : Number(data.row.original.coupon_frequency) === 2
          ? "Semi Annually"
          : "Annually";
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
          {couponFrequency}
        </Typography>
      );
    },
  },
  // {
  //   header: "Coupon Amount",
  //   accessorKey: "coupon",
  //   cell: (data) => {
  //     return <Typography sx={{ fontSize: "0.85rem", textAlign: "left", }}>{data.row.original.coupon}</Typography>;
  //   },
  // },
  {
    header: "Units",
    accessorKey: "cumm_units",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
          {parseInt(data.row.original.cumm_units || "N/A")}
        </Typography>
      );
    },
  },
  {
    header: "WACC Rate",
    accessorKey: "effective_rate",
    cell: (data) => {
      return (
        <Typography
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "65px",
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          {Number(
            data.row.original.effective_rate
              ? data.row.original.effective_rate
              : "N/A"
          ).toLocaleString()}
        </Typography>
      );
    },
  },
  {
    header: "Invested Amount",
    accessorKey: "invested_amount",
    cell: (data) => {
      return (
        <Typography
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "95px",
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          {Number(data.row.original.invested_amount || "N/A").toLocaleString()}
        </Typography>
      );
    },
  },
  // {
  //   header: "Total Investment",
  //   accessorKey: "purchase_amount",
  //   cell: (data) => {
  //     return <Typography sx={{ fontSize: "0.85rem", textAlign: "right", width: "75%" }}>{Number(data.row.original.purchase_price).toLocaleString()}</Typography>;
  //   },
  // },
  // {
  //   header: "Remaining Units",
  //   accessorKey: "remaining_units",
  //   cell: (data) => {
  //     return <Typography sx={{ fontSize: "0.85rem" }}>{(data.row.original.remaining_units)}</Typography>;
  //   },
  // },
  {
    header: "Maturity Date",
    accessorKey: "maturity_date",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
          {data.row.original.maturity_date || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Days To Maturity",
    accessorKey: "days_until_maturity",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
          {data.row.original.days_until_maturity
            ? data.row.original.days_until_maturity
            : "-"}
        </Typography>
      );
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: (data) => {
      const [open, setOpen] = useState(false);
      const handleView = () => {
        setOpen(true);
      };

      const securityTypes =
        data.row.original.type === "trading_securities"
          ? "Trading Securities"
          : "-";
      // const bondStatus = data.row.original.status === "listed" ? "Listed" : 'Unlisted';

      const modalData = {
        Name: data.row.original.bond_name || "N/A",
        "Security Type": securityTypes || "N/A",
        "Face Value": data.row.original.face_value || "N/A",
        "Coupon Rate": data.row.original.coupon_rate || "N/A",
        "Coupon Frequency":
          Number(data.row.original.coupon_frequency) === 12
            ? "Monthly"
            : Number(data.row.original.coupon_frequency) === 3
            ? "Quarterly"
            : Number(data.row.original.coupon_frequency) === 2
            ? "Semi Annually"
            : "Annually",
        Units: data.row.original.cumm_units || "N/A",
        "WACC Rate": data.row.original.effective_rate || "N/A",
        // "Remaining Units": data.row.original.remaining_units,
        // "Coupon": data.row.original.coupon,
        "Invested Amount": data.row.original.invested_amount || "N/A",
        // "Coupon Amount": data.row.original.coupon,
        // "Premium/Discount": data.row.original.premium_amortization,
        Status:
          data.row.original.bond_status === "listed" ? "Listed" : "Unlisted",
        "Purchase Date": data.row.original.created_at?.split("T")[0] || "N/A",
        "Issue Date": data.row.original.issue_date || "N/A",
        "Maturity Date": data.row.original.maturity_date || "N/A",
        "Auto Book Coupon": data.row.original.auto_book_coupon
          ? "Enabled"
          : "Disabled",
        "Auto Book Amortization": data.row.original.auto_book_amortization
          ? "Enabled"
          : "Disabled",
        "Days Until Maturity": data.row.original.days_until_maturity || "N/A",
      };

      return (
        <>
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1.5,
                width: "100px",
              }}
            >
              <ViewModal
                open={open}
                setOpen={setOpen}
                data={{ id: data.row.original.id }}
                modalData={modalData}
              />
              <Box
                onClick={handleView}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 0.6,
                  color: colorTokens.mainColor[1100],
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
              >
                <Visibility sx={{ fontSize: "14px", fontWeight: 600 }} />
                <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                  Sell Bond
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      );
    },
  },
];
