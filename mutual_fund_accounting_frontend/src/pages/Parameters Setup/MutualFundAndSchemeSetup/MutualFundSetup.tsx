import {
  Box,
  Typography,
  useTheme,
  Modal,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDeleteMutualSetup } from "services/MutualFundSetup/MutualFundSetupServices";
import {
  useGetMutualFundSetupList,
} from "services/MutualFundSetup/MutualFundSetupServices";
import EditSchemeModal from "pages/Parameters Setup/MutualFundAndSchemeSetup/EditMutualFundScheme";
import ErrorBar from "components/Snackbar/ErrorBar";
import SuccessBar from "components/Snackbar/SuccessBar";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ReceiptTable from "components/Table/TanstackTable";
import { Empty } from "antd";
import { ColumnDef } from "@tanstack/react-table";
import { 
  // Delete,
  Edit 
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "store/GlobalStore";



type MutualFundEntry = {
  id: number;
  scheme_name: string;
  scheme_number: number;
  scheme_type: string;
  maturity_date: string;
  nav_calculation_method: string;
  scheme_size: number;
  total_seed_capital: number;
  allotment_date: string;
  alloted_capital: number;
  authorized_capital: number;
};

const MutualFundSetup = () => {
  const navigate = useNavigate();
  const [disableScheme, setDisableScheme] = useState<boolean>(false);
  const theme = useTheme();

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();

  const { data: MutualFundSetupData } = useGetMutualFundSetupList(
    pagination.pageIndex + 1
  );

  const totalPageCount = Math.ceil(
    MutualFundSetupData?.responseData?.count / 10
  );
  useEffect(() => {
    if (MutualFundSetupData?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (MutualFundSetupData?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }

    if (MutualFundSetupData?.responseData?.results.length === 1) {
      setDisableScheme(true);
    } else {
      setDisableScheme(false);
    }
  }, [MutualFundSetupData]);

  const MutualFundSetupTableEntryHeader: ColumnDef<MutualFundEntry>[] = [
    {
      header: "ID",
      accessorKey: "id",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {data?.row?.original?.id}
          </Typography>
        );
      },
    },
    {
      header: "Scheme Name",
      accessorKey: "scheme_name",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {data?.row?.original?.scheme_name}
          </Typography>
        );
      },
    },
    {
      header: "Scheme Number",
      accessorKey: "scheme_number",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {data?.row?.original?.scheme_number}
          </Typography>
        );
      },
    },
    {
      header: "Scheme Type",
      accessorKey: "scheme_type",
      cell: (data) => {
        const schemeType = data?.row?.original?.scheme_type;
        const displaySchemeType =
          schemeType === "open_ended" ? "Open-Ended" : "Close-Ended";
        return (
          <Typography
            align="left"
            sx={{ fontSize: "14px", fontWeight: "400px" }}
          >
            {displaySchemeType}
          </Typography>
        );
      },
    },

    {
      header: "Maturity Date",
      accessorKey: "maturity_date",
      cell: (data) => {
        return (
          <Typography
            align="left"
            sx={{ fontSize: "14px", fontWeight: "400px" }}
          >
            {data?.row?.original?.maturity_date ?? "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "NAV Method",
      accessorKey: "nav_calculation_method",
      cell: (data) => {
        return (
          <Typography
            align="left"
            sx={{ fontSize: "14px", fontWeight: "400px", textTransform: "capitalize" }}
          >
            {data?.row?.original?.nav_calculation_method}
          </Typography>
        );
      },
    },
    {
      header: "Scheme Size",
      accessorKey: "scheme_size",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {data?.row?.original?.scheme_size}
          </Typography>
        );
      },
    },
    {
      header: "Seed Capital",
      accessorKey: "total_seed_capital",
      cell: (data) => {
        return (
          <Typography
            style={{
              width: "60%",
              textAlign: "right",
              fontSize: "14px",
              fontWeight: "400px",
            }}
          >
            {Number(data?.row?.original?.total_seed_capital).toLocaleString()}
          </Typography>
        );
      },
    },
    {
      header: "Allotment Date",
      accessorKey: "allotment_date",
      cell: (data) => {
        return (
          <Typography
            align="left"
            sx={{ width: "max-content", fontSize: "14px", fontWeight: "400px" }}
          >
            {data?.row?.original?.allotment_date}
          </Typography>
        );
      },
    },
    {
      header: "Authorized Capital",
      accessorKey: "authorized_capital",
      cell: (data) => {
        return (
          <Typography
            style={{ width: "60%", textAlign: "right", fontSize: "0.85rem" }}
          >
            {Number(data?.row?.original?.authorized_capital).toLocaleString()}
          </Typography>
        );
      },
    },
    {
      header: "Allotment Capital",
      accessorKey: "alloted_capital",
      cell: (data) => {
        return (
          <Typography
            style={{
              width: "60%",
              textAlign: "right",
              fontSize: "14px",
              fontWeight: "400px",
            }}
          >
            {Number(data?.row?.original?.alloted_capital).toLocaleString()}
          </Typography>
        );
      },
    },

    {
      header: "Actions",
      accessorKey: "actions",
      cell: (data) => {
        return (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <ActionCell data={data} />
          </Box>
        );
      },
    },
  ];

  // eslint-disable-next-line react-refresh/only-export-components
  const ActionCell = ({ data }) => {
    const theme = useTheme();
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [successBarOpen, setSuccessBarOpen] = useState<boolean>(false);
    const [errorBarOpen, setErrorBarOpen] = useState<boolean>(false);

    // const [disableScheme, setDisableScheme] = useState<boolean>(false);

    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

    const { mutate: deleteMutualSetup } = useDeleteMutualSetup(
      data.row.original.id
    );

    // const handleDelete = () => {
    //   setConfirmOpen(true);
    // };

    const handleConfirmDelete = () => {
      const deleteId = data.row.original.id;
      deleteMutualSetup(deleteId, {
        onSuccess: () => {
          setConfirmOpen(false);
          setSuccessBarOpen(true);
        },
        onError: () => {
          setErrorBarOpen(true);
        },
      });
    };

    const handleConfirmClose = () => {
      setConfirmOpen(false);
    };
    const handleEdit = () => {
      handleSave(data.row.original);
      setEditOpen(true);
    };

    const handleSave = (updatedData: MutualFundEntry) => {
      console.log("Updated Data:", updatedData);
    };

    const { setAllotmentDate} = useGlobalStore((state) => ({
      setAllotmentDate: state.setAllotmentDate,
      allotmentDate: state.allotmentDate,
    }));
  
    useEffect(() => {
      const allotmentDateValue = (data.row.original.allotment_date);
      setAllotmentDate(allotmentDateValue);
    }, [data.row.original.allotment_date, setAllotmentDate]);

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
        <Box>
          <EditSchemeModal
            open={editOpen}
            setOpen={setEditOpen}
            data={data.row.original}
            onSave={handleSave}
          />
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
            <Box
              onClick={handleEdit}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 0.2,
                // color: colorTokens.mainColor[900],
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              <Edit
                sx={{
                  fontSize: "14px",
                  color: theme.palette.grey[600],
                  "&:hover": {
                    color: theme.palette.grey[900],
                  },
                }}
              />
              <Typography
                fontSize="14px"
                fontWeight={600}
                sx={{ userSelect: "none" }}
              >
                Edit
              </Typography>
            </Box>

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
                  Are you sure you want to Delete
                  <Typography sx={{ fontWeight: 500 }}>
                    {data.row.original.scheme_name}?
                  </Typography>
                </Typography>
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Button
                    sx={{
                      backgroundColor: theme.palette.secondary.main,
                      "&:hover": {
                        bgcolor: theme.palette.primary.main,
                      },
                    }}
                    variant="contained"
                    onClick={() => handleConfirmDelete()}
                  >
                    Confirm
                  </Button>
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
                </Box>
              </Box>
            </Modal>

            {/* <Box
              onClick={handleDelete}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 0.2,
                // color: '#b71c1c',
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              <Delete color="error" sx={{ fontSize: "16px" }} />
              <Typography
                fontSize="13px"
                fontWeight={600}
                sx={{ userSelect: "none" }}
              >
                Delete
              </Typography>
            </Box> */}
          </Box>
        </Box>
      </>
    );
  };

  return (
    <>
      <Box sx={{mt:2}}>
       <HeaderDesc title={"Scheme Creation"} />
      </Box>
      {/* <Link to="/scheme-creation" style={{ textDecoration: "none" }}> */}
        <Button
          variant="contained"
          color="secondary"
          disabled={disableScheme} 
          onClick={() => {
            navigate("/scheme-creation");
          }}
          sx={{
            mt: 2,
            borderRadius: "100px",
            padding: "6px 24px",
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "20px",
            "&:hover": {
              bgcolor: theme.palette.primary.main,
            },
          }}
        >
          Create New Scheme
        </Button>
      {/* </Link> */}
     

      <Box sx={{ width: "120%" }}>
        <Box sx={{ mt: 4, pr: 0 }}>
          <HeaderDesc title={"Existing Scheme"} />
        </Box>
        {MutualFundSetupData?.responseData?.results.length === 0 ? (
          <Box>
            <ReceiptTable
              columns={MutualFundSetupTableEntryHeader}
              data={[]}
              // pagination={pagination}
              // setPagination={setPagination}
              // next={next}
              // prev={prev}
              // pageCount={totalPageCount}
            />
            <Box
              sx={{
                display: "flex",
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
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              px: 0,
              mt: 1,
              maxWidth: "1500px",
              width: { xl: "110%", lg: "105%", md: "90%" },
            }}
          >
            <ReceiptTable
              columns={MutualFundSetupTableEntryHeader}
              data={MutualFundSetupData?.responseData?.results ?? []}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
              pageCount={totalPageCount}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default MutualFundSetup;
















// import {
//   Box,
//   MenuItem,
//   TextField,
//   Typography,
//   useTheme,
//   Select,
//   // Button,
//   // Autocomplete,
//   FormControl,
//   // InputLabel,
//   FormHelperText,
//   Modal,
//   Button,
//   // Autocomplete,
// } from "@mui/material";
// import TypographyLabel from "components/InputLabel/TypographyLabel";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import React, { useEffect, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import * as yup from "yup";
// import dayjs from "dayjs";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useDeleteMutualSetup } from "services/MutualFundSetup/MutualFundSetupServices";

// // import { MutualFundSetupTableEntryHeader } from "constants/MutualFundSetup/MutualFundSetupTableHeader";
// import {
//   usePostCreateMutualFundSetup,
//   useGetMutalFundFaceValue,
//   useGetMutualFundSetupList,
// } from "services/MutualFundSetup/MutualFundSetupServices";
// import EditSchemeModal from "pages/Parameters Setup/MutualFundAndSchemeSetup/EditMutualFundScheme";
// // import { useGetAllStockBrokerData } from "services/StockBroker/StockBrokerServices";

// //   import dayjs from "dayjs";
// import ErrorBar from "components/Snackbar/ErrorBar";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import ReceiptTable from "components/Table/TanstackTable";
// import { Empty } from "antd";
// import RoundedButton from "components/Button/Button";
// import { ColumnDef } from "@tanstack/react-table";
// import { Delete, Edit } from "@mui/icons-material";
// import { colorTokens } from "../../../theme";

// const validationSchema = yup.object().shape({
//   par_value: yup
//     .number()
//     .required("Par Value is required")
//     .positive("Must be a positive number"),
//   scheme_name: yup.string().required("Scheme Name is required"),
//   scheme_number: yup.string().required("Scheme Number is required"),
//   // .positive("Must be a positive number"),
//   scheme_type: yup.string().required("Security is required"),

//   maturity_date: yup.string().optional().nullable(),
//   nav_calculation_method_open: yup
//     .string()
//     .required("Calculation method is required"),
//   nav_calculation_method_close: yup.string().optional(),
//   // .required("Calculation method is required"),

//   authorized_capital: yup.string().required("Capital Amount is required"),
//   // .positive("Must be a positive number"),

//   scheme_size: yup
//     // .number()
//     .string()
//     .required("Scheme Size is required"),
//   seed_capital: yup
//     // .number()
//     .string()
//     .required("Seed Capital is required"),
//   allotment_date: yup.date().required("Allotment Date is required").optional(),
//   allotted_capital: yup
//     .string()
//     // .number()
//     .required("Allotted Capital is required"),
//   total_subscribed_units: yup
//     .string()
//     .required("Total Subscribed Units is required"),
//   // .positive("Must be a positive number"),
// });

// type MutualFundEntry = {
//   id: number;
//   scheme_name: string;
//   scheme_number: number;
//   scheme_type: string;
//   maturity_date: string;
//   nav_calculation_method: string;
//   scheme_size: number;
//   total_seed_capital: number;
//   allotment_date: string;
//   alloted_capital: number;
//   authorized_capital: number;
// };

// const MutualFundSetup = () => {
//   const theme = useTheme();

//   const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
//   const [next, setNext] = useState<boolean>();
//   const [prev, setPrev] = useState<boolean>();

//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [errorbarOpen, setErrorbarOpen] = useState(false);
//   const [faceValue, setFaceValue] = useState([]);

//   // const [disableScheme , setDisableScheme] = useState(false);

//   const { data: MutualFundSetupData } = useGetMutualFundSetupList(
//     pagination.pageIndex + 1
//   );

//   const { data: mutualFundFaceValue } = useGetMutalFundFaceValue();

//   const totalPageCount = Math.ceil(
//     MutualFundSetupData?.responseData?.count / 10
//   );

//   // const formatIndianNumber = (amount: number | undefined | null): string => {
//   //   const formattedAmount = amount ?? 0;
//   //   return formattedAmount.toLocaleString(undefined, {
//   //     maximumFractionDigits: 2,
//   //   });
//   // };

//   const {
//     handleSubmit,
//     // setValue,
//     control,
//     reset,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(validationSchema),
//     defaultValues: {
//       par_value: mutualFundFaceValue?.responseData[0]?.value,
//       scheme_name: "",
//       scheme_number: "",
//       scheme_type: "open_ended",
//       maturity_date: "",
//       // nav_calculation_method_close: "weekly",
//       // nav_calculation_method_open: "daily",
//       authorized_capital: "",
//       // scheme_size: formatIndianNumber(5000000000),
//       // seed_capital: formatIndianNumber(75000000),
//       // allotment_date: null,
//       // allotted_capital: formatIndianNumber(1000000000),
//       // allotted_capital: 0,
//       // total_subscribed_units: (formatIndianNumber((seed_capital + allotted_capital) / faceValue[0]?.face_value )),
//       scheme_size: "",
//       seed_capital: "",
//       allotment_date: null,
//       allotted_capital: "",
//       total_subscribed_units: "",
//       nav_calculation_method_open: "daily",
//       nav_calculation_method_close: "weekly",
//     },
//   });

//   // const seedCapital = watch("seed_capital");
//   // const allottedCapital = watch("allotted_capital");
//   // const parValue = watch("par_value");

//   useEffect(() => {
//     if (mutualFundFaceValue?.isSuccess) {
//       const faceValueOptions = mutualFundFaceValue.responseData.map(
//         (facevalue) => ({
//           face_id: facevalue.id,
//           face_value: facevalue.value,
//           face_name: facevalue.scheme_name,
//         })
//       );
//       setFaceValue(faceValueOptions);

//       if (faceValueOptions.length > 0) {
//         setValue("par_value", faceValueOptions[0].face_id);
//       }

//       // setValue("total_subscribed_units", formatIndianNumber((seed_capital + allotted_capital) / faceValueOptions[0].face_value));
//     }
//   }, [mutualFundFaceValue, setValue]);

//   // useEffect(() => {
//   //   const currentFaceValue = faceValue.find(
//   //     (fv) => fv.face_id === parValue
//   //   )?.face_value;
//   //   if (currentFaceValue) {
//   //     // const totalSubscribedUnits = ((((seedCapital).replace(/,/g, ""))) + ((allottedCapital).replace(/,/g, ""))) / currentFaceValue;
//   //     const totalSubscribedUnits =
//   //       (Number(seedCapital.replace(/,/g, "")) +
//   //         Number(allottedCapital.replace(/,/g, ""))) /
//   //       currentFaceValue;

//   //     setValue(
//   //       "total_subscribed_units",
//   //       formatIndianNumber(Number(totalSubscribedUnits))
//   //     );

//   //   }
//   // }, [allottedCapital, faceValue, parValue, seedCapital, setValue]);

//   const {
//     mutate: MutualFundSetupMutate,
//     error: MutualFundSetupError,
//     isSuccess: MutualFundSetupSuccess,
//   } = usePostCreateMutualFundSetup();

//   useEffect(() => {
//     if (MutualFundSetupSuccess) {
//       setSnackbarOpen(true);
//       // reset();
//     }
//   }, [MutualFundSetupSuccess, reset]);

//   useEffect(() => {
//     if (MutualFundSetupData?.responseData?.next === null) {
//       setNext(true);
//     } else {
//       setNext(false);
//     }
//     if (MutualFundSetupData?.responseData?.previous === null) {
//       setPrev(true);
//     } else {
//       setPrev(false);
//     }
//   }, [MutualFundSetupData]);

//   const schemeType = watch("scheme_type");

//   const SchemeSubmit = (data) => {
//     const tempData = {
//       par_value: data.par_value,
//       scheme_name: data.scheme_name,
//       scheme_number: data.scheme_number,
//       scheme_type: data.scheme_type,
//       maturity_date:
//         schemeType === "open_ended"
//           ? null
//           : dayjs(data.maturity_date).format("YYYY-MM-DD"),
//       nav_calculation_method:
//         schemeType === "open_ended"
//           ? data.nav_calculation_method_open
//           : data.nav_calculation_method_close,
//       authorized_capital: Number(data.authorized_capital),
//       scheme_size: Number(data.scheme_size.replace(/,/g, "")),
//       seed_capital: Number(data.seed_capital.replace(/,/g, "")),
//       allotment_date: dayjs(data.allotment_date).format("YYYY-MM-DD"),
//       alloted_capital: Number(data.allotted_capital.replace(/,/g, "")),
//       total_subscribed_units: Number(
//         data.total_subscribed_units.replace(/,/g, "")
//       ),
//     };

//     MutualFundSetupMutate(tempData, {
//       onSuccess: () => {
//         setSnackbarOpen(true);
//         // setDisableScheme(true);
//         reset();
//       },
//       onError: () => {
//         setErrorbarOpen(true);
//       },
//     });
//   };

//   const MutualFundSetupTableEntryHeader: ColumnDef<MutualFundEntry>[] = [
//     {
//       header: "ID",
//       accessorKey: "id",
//       cell: (data) => {
//         return (
//           <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
//             {data?.row?.original?.id}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "Scheme Name",
//       accessorKey: "scheme_name",
//       cell: (data) => {
//         return (
//           <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
//             {data?.row?.original?.scheme_name}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "Scheme Number",
//       accessorKey: "scheme_number",
//       cell: (data) => {
//         return (
//           <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
//             {data?.row?.original?.scheme_number}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "Scheme Type",
//       accessorKey: "scheme_type",
//       cell: (data) => {
//         const schemeType = data?.row?.original?.scheme_type;
//         const displaySchemeType =
//           schemeType === "open_ended" ? "Open-Ended" : "Close-Ended";
//         return (
//           <Typography
//             align="left"
//             sx={{ fontSize: "14px", fontWeight: "400px" }}
//           >
//             {displaySchemeType}
//           </Typography>
//         );
//       },
//     },

//     {
//       header: "Maturity Date",
//       accessorKey: "maturity_date",
//       cell: (data) => {
//         return (
//           <Typography
//             align="left"
//             sx={{ fontSize: "14px", fontWeight: "400px" }}
//           >
//             {data?.row?.original?.maturity_date ?? "N/A"}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "NAV Method",
//       accessorKey: "nav_calculation_method",
//       cell: (data) => {
//         return (
//           <Typography
//             align="left"
//             sx={{ fontSize: "14px", fontWeight: "400px", textTransform: "capitalize" }}
//           >
//             {data?.row?.original?.nav_calculation_method}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "Scheme Size",
//       accessorKey: "scheme_size",
//       cell: (data) => {
//         return (
//           <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
//             {data?.row?.original?.scheme_size}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "Seed Capital",
//       accessorKey: "total_seed_capital",
//       cell: (data) => {
//         return (
//           <Typography
//             style={{
//               width: "60%",
//               textAlign: "right",
//               fontSize: "14px",
//               fontWeight: "400px",
//             }}
//           >
//             {Number(data?.row?.original?.total_seed_capital).toLocaleString()}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "Allotment Date",
//       accessorKey: "allotment_date",
//       cell: (data) => {
//         return (
//           <Typography
//             align="left"
//             sx={{ width: "max-content", fontSize: "14px", fontWeight: "400px" }}
//           >
//             {data?.row?.original?.allotment_date}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "Authorized Capital",
//       accessorKey: "authorized_capital",
//       cell: (data) => {
//         return (
//           <Typography
//             style={{ width: "60%", textAlign: "right", fontSize: "0.85rem" }}
//           >
//             {Number(data?.row?.original?.authorized_capital).toLocaleString()}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "Allotment Capital",
//       accessorKey: "alloted_capital",
//       cell: (data) => {
//         return (
//           <Typography
//             style={{
//               width: "60%",
//               textAlign: "right",
//               fontSize: "14px",
//               fontWeight: "400px",
//             }}
//           >
//             {Number(data?.row?.original?.alloted_capital).toLocaleString()}
//           </Typography>
//         );
//       },
//     },

//     {
//       header: "Actions",
//       accessorKey: "actions",
//       cell: (data) => {
//         return (
//           <Box sx={{ display: "flex", justifyContent: "center" }}>
//             <ActionCell data={data} />
//           </Box>
//         );
//       },
//     },
//   ];

//   // eslint-disable-next-line react-refresh/only-export-components
//   const ActionCell = ({ data }) => {
//     const theme = useTheme();
//     const [editOpen, setEditOpen] = useState(false);
//     const [successBarOpen, setSuccessBarOpen] = useState(false);
//     const [errorBarOpen, setErrorBarOpen] = useState(false);

//     const [confirmOpen, setConfirmOpen] = useState(false);

//     const { mutate: deleteMutualSetup } = useDeleteMutualSetup(
//       data.row.original.id
//     );

//     const handleDelete = () => {
//       setConfirmOpen(true);
//     };

//     const handleConfirmDelete = () => {
//       const deleteId = data.row.original.id;
//       deleteMutualSetup(deleteId, {
//         onSuccess: () => {
//           setConfirmOpen(false);
//           setSuccessBarOpen(true);
//         },
//         onError: (error) => {
//           setErrorBarOpen(true);
//         },
//       });
//     };

//     const handleConfirmClose = () => {
//       setConfirmOpen(false);
//     };
//     const handleEdit = () => {
//       handleSave(data.row.original);
//       setEditOpen(true);
//     };

//     const handleSave = (updatedData: MutualFundEntry) => {
//       console.log("Updated Data:", updatedData);
//     };

//     return (
//       <>
//         <SuccessBar
//           snackbarOpen={successBarOpen}
//           setSnackbarOpen={setSuccessBarOpen}
//           message="Deleted Successfully!"
//         />
//         <ErrorBar
//           snackbarOpen={errorBarOpen}
//           setSnackbarOpen={setErrorBarOpen}
//           message="Failed to Delete!"
//         />
//         <Box>
//           <EditSchemeModal
//             open={editOpen}
//             setOpen={setEditOpen}
//             data={data.row.original}
//             onSave={handleSave}
//           />
//           <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
//             <Box
//               onClick={handleEdit}
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//                 gap: 0.2,
//                 // color: colorTokens.mainColor[900],
//                 "&:hover": {
//                   cursor: "pointer",
//                 },
//               }}
//             >
//               <Edit
//                 sx={{
//                   fontSize: "14px",
//                   color: theme.palette.grey[600],
//                   "&:hover": {
//                     color: theme.palette.grey[900],
//                   },
//                 }}
//               />
//               <Typography
//                 fontSize="14px"
//                 fontWeight={600}
//                 sx={{ userSelect: "none" }}
//               >
//                 Edit
//               </Typography>
//             </Box>

//             <Modal open={confirmOpen} onClose={handleConfirmClose}>
//               <Box
//                 sx={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   width: "30%",
//                   bgcolor: "background.paper",
//                   borderRadius: "8px",
//                   p: 4,
//                   textAlign: "center",
//                 }}
//               >
//                 <Typography variant="h6" component="h2">
//                   Confirmation
//                 </Typography>
//                 <Typography sx={{ mt: 2 }}>
//                   Are you sure you want to Delete
//                   <Typography sx={{ fontWeight: 500 }}>
//                     {data.row.original.scheme_name}?
//                   </Typography>
//                 </Typography>
//                 <Box
//                   sx={{
//                     mt: 3,
//                     display: "flex",
//                     justifyContent: "space-around",
//                   }}
//                 >
//                   <Button
//                     sx={{
//                       backgroundColor: theme.palette.secondary.main,
//                       "&:hover": {
//                         bgcolor: theme.palette.primary.main,
//                       },
//                     }}
//                     variant="contained"
//                     onClick={() => handleConfirmDelete()}
//                   >
//                     Confirm
//                   </Button>
//                   <Button
//                     sx={{
//                       color: theme.palette.secondary.main,
//                       "&:hover": {
//                         bgcolor: theme.palette.primary.mediumColor,
//                       },
//                     }}
//                     variant="outlined"
//                     onClick={handleConfirmClose}
//                   >
//                     Cancel
//                   </Button>
//                 </Box>
//               </Box>
//             </Modal>

//             {/* <Box
//               onClick={handleDelete}
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//                 gap: 0.2,
//                 // color: '#b71c1c',
//                 "&:hover": {
//                   cursor: "pointer",
//                 },
//               }}
//             >
//               <Delete color="error" sx={{ fontSize: "16px" }} />
//               <Typography
//                 fontSize="13px"
//                 fontWeight={600}
//                 sx={{ userSelect: "none" }}
//               >
//                 Delete
//               </Typography>
//             </Box> */}
//           </Box>
//         </Box>
//       </>
//     );
//   };

//   const disableScheme =
//     MutualFundSetupData &&
//     MutualFundSetupData?.responseData?.results[0]?.scheme_disable;

//   return (
//     <>
//       {snackbarOpen && (
//         <SuccessBar
//           snackbarOpen={snackbarOpen}
//           message={"Successfully Submitted!"}
//           setSnackbarOpen={setSnackbarOpen}
//         />
//       )}

//       {MutualFundSetupError && (
//         <ErrorBar
//           snackbarOpen={errorbarOpen}
//           message={"Error in submitting data!"}
//           setSnackbarOpen={setErrorbarOpen}
//         />
//       )}
//       <Box component="form" onSubmit={handleSubmit(SchemeSubmit)}>
//         <Box sx={{ width: "50px", marginBottom: "5px" }}>
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
//             Mutual Fund Parameters
//           </Typography>
//         </Box>
//         <Box sx={{ width: "50%", my: "15px" }}>
//           <TypographyLabel title={"Mutual Fund Face Value (Rs)"} />

//           {/* <Controller
//               name="par_value"
//               control={control}
//               render={({ field }) => (
//                 <Autocomplete
//                   {...field}
//                   size="small"
//                   options={faceValue}
//                   getOptionLabel={(option) => `${option.face_value} `}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       error={!!errors.par_value}
//                       helperText={errors.par_value?.message}
//                     />
//                   )}
//                   onChange={(_, data) =>
//                     field.onChange(data ? data.face_id : "")
//                   }
               
//                 />
//               )}
//             /> */}

          // <Controller
          //   name="par_value"
          //   control={control}
          //   render={({ field }) => (
          //     <FormControl size="small" error={!!errors.par_value}>
          //       {/* <InputLabel>Par Value</InputLabel> */}
          //       <Select
          //         sx={{ width: "150%" }}
          //         {...field}
          //         disabled={!!disableScheme}
          //         value={field.value || ""}
          //         onChange={(e) => field.onChange(e.target.value)}
          //       >
          //         {faceValue.map((option) => (
          //           <MenuItem key={option.face_id} value={option.face_id}>
          //             {option.face_value}
          //           </MenuItem>
          //         ))}
          //       </Select>
          //       {errors.par_value && (
          //         <FormHelperText>{errors.par_value.message}</FormHelperText>
          //       )}
          //     </FormControl>
          //   )}
          // />
//         </Box>

//         <Box sx={{ width: "50px", mt: 2 }}>
//           <Typography
//             sx={{
//               fontSize: "18px",
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
//         </Box>
//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: "repeat(3 , 1fr)",
//             // gridTemplateColumns: '4fr 3fr 3fr',
//             gap: 2,
//           }}
//         >
//           <Box sx={{ width: "100%", mt: 2 }}>
//             <TypographyLabel title={"Scheme Name"} />
            // <Controller
            //   name="scheme_name"
            //   control={control}
            //   render={({ field }) => (
            //     <TextField
            //       disabled={!!disableScheme}
            //       {...field}
            //       sx={{ margin: 0, width: "100%" }}
            //       size="small"
            //       placeholder="Enter Scheme Name"
            //       error={!!errors.scheme_name}
            //       helperText={errors.scheme_name?.message}
            //     />
            //   )}
            // />
//           </Box>

          // <Box sx={{ width: "100%", mt: 2 }}>
          //   <TypographyLabel title={"Scheme Number"} />
          //   <Controller
          //     name="scheme_number"
          //     control={control}
          //     render={({ field }) => (
          //       <TextField
          //         disabled={!!disableScheme}
          //         {...field}
          //         sx={{ margin: 0, width: "100%" }}
          //         size="small"
          //         placeholder="Enter Scheme Number"
          //         error={!!errors.scheme_number}
          //         helperText={errors.scheme_number?.message}
          //       />
          //     )}
          //   />
          // </Box>

          // <Box sx={{ width: "100%", mt: 2 }}>
          //   <TypographyLabel title={"Scheme Type"} />
          //   <Controller
          //     name="scheme_type"
          //     control={control}
          //     render={({ field }) => (
          //       <Select
          //         {...field}
          //         disabled={!!disableScheme}
          //         size="small"
          //         fullWidth
          //       >
          //         <MenuItem value="open_ended">Open-Ended</MenuItem>
          //         <MenuItem value="close_ended">Close-Ended</MenuItem>
          //       </Select>
          //     )}
          //   />
          //   {errors.scheme_type && (
          //     <Typography color="error">
          //       {errors.scheme_type.message}
          //     </Typography>
          //   )}
          // </Box>

//           {schemeType === "close_ended" ? (
            // <Box sx={{ mt: 2, width: "100%" }}>
            //   <LocalizationProvider dateAdapter={AdapterDayjs}>
            //     <TypographyLabel title="Maturity Date" />
            //     <Controller
            //       name="maturity_date"
            //       control={control}
            //       render={({ field }) => (
            //         <DatePicker
            //           disabled={!!disableScheme}
            //           {...field}
            //           sx={{
            //             width: "100%",
            //             "& .MuiSvgIcon-root": {
            //               width: "16px",
            //               height: "16px",
            //             },
            //           }}
            //           slotProps={{ textField: { size: "small" } }}
            //           value={field.value}
            //           onChange={(date) => field.onChange(date)}
            //         />
            //       )}
            //     />
            //   </LocalizationProvider>
            //   {errors.maturity_date && (
            //     <Typography color="error">
            //       {errors.maturity_date.message}
            //     </Typography>
            //   )}
            // </Box>
//           ) : null}

//           {schemeType === "close_ended" && (
            // <Box sx={{ width: "100%", mt: 2 }}>
            //   <TypographyLabel title={"NAV Calculation Method"} />
            //   <Controller
            //     name="nav_calculation_method_close"
            //     defaultValue={"weekly"}
            //     control={control}
            //     render={({ field }) => (
            //       <Select
            //         {...field}
            //         disabled={!!disableScheme}
            //         size="small"
            //         fullWidth
            //       >
            //         <MenuItem value="daily">Daily</MenuItem>
            //         <MenuItem value="weekly">Weekly</MenuItem>
            //         <MenuItem value="monthly">Monthly</MenuItem>
            //         <MenuItem value="quarterly">Quarterly</MenuItem>
            //       </Select>
            //     )}
            //   />
            //   {errors.nav_calculation_method_close && (
            //     <Typography color="error">
            //       {errors.nav_calculation_method_close.message}
            //     </Typography>
            //   )}
            // </Box>
//           )}
//           {schemeType === "open_ended" && (
//             <Box sx={{ width: "100%", mt: 2 }}>
//               <TypographyLabel title={"NAV Calculation Method"} />
//               <Controller
//                 name="nav_calculation_method_open"
//                 defaultValue="daily"
//                 control={control}
//                 render={({ field }) => (
//                   <Select
//                     {...field}
//                     disabled={!!disableScheme}
//                     size="small"
//                     fullWidth
//                   >
//                     <MenuItem value="daily">Daily</MenuItem>
//                     <MenuItem value="weekly">Weekly</MenuItem>
//                     <MenuItem value="monthly">Monthly</MenuItem>
//                     <MenuItem value="quarterly">Quarterly</MenuItem>
//                   </Select>
//                 )}
//               />
//               {errors.nav_calculation_method_open && (
//                 <Typography color="error">
//                   {errors.nav_calculation_method_open.message}
//                 </Typography>
//               )}
//             </Box>
//           )}

          // <Box sx={{ width: "100%", mt: 2 }}>
          //   <TypographyLabel title={"Authorized Capital"} />
          //   <Controller
          //     name="authorized_capital"
          //     control={control}
          //     render={({ field }) => (
          //       <TextField
          //         disabled={!!disableScheme}
          //         {...field}
          //         sx={{ margin: 0, width: "100%" }}
          //         size="small"
          //         placeholder="1000000000"
          //         error={!!errors.authorized_capital}
          //         helperText={errors.authorized_capital?.message}
          //       />
          //     )}
          //   />
          // </Box>

          // <Box sx={{ width: "100%", mt: 2 }}>
          //   <TypographyLabel title={"Scheme Size"} />
          //   <Controller
          //     name="scheme_size"
          //     control={control}
          //     render={({ field }) => (
          //       <TextField
          //         disabled={!!disableScheme}
          //         {...field}
          //         sx={{ margin: 0, width: "100%" }}
          //         size="small"
          //         placeholder="500000000"
          //         error={!!errors.scheme_size}
          //         helperText={errors.scheme_size?.message}
          //       />
          //     )}
          //   />
          // </Box>

          // <Box sx={{ width: "100%", mt: 2 }}>
          //   <TypographyLabel title={"Seed Capital"} />
          //   <Controller
          //     name="seed_capital"
          //     control={control}
          //     render={({ field }) => (
          //       <TextField
          //         disabled={!!disableScheme}
          //         {...field}
          //         sx={{ margin: 0, width: "100%" }}
          //         size="small"
          //         placeholder="75000000"
          //         error={!!errors.seed_capital}
          //         helperText={errors.seed_capital?.message}
          //       />
          //     )}
          //   />
          // </Box>

          // <Box sx={{ mt: 2, width: "100%" }}>
          //   <LocalizationProvider dateAdapter={AdapterDayjs}>
          //     <TypographyLabel title={"Allotment Date"} />
          //     <Controller
          //       name="allotment_date"
          //       control={control}
          //       render={({ field }) => (
          //         <DatePicker
          //           disabled={!!disableScheme}
          //           {...field}
          //           sx={{
          //             width: "100%",
          //             "& .MuiSvgIcon-root": {
          //               width: "16px",
          //               height: "16px",
          //             },
          //           }}
          //           slotProps={{ textField: { size: "small" } }}
          //           value={field.value}
          //           onChange={(date) => field.onChange(date)}
          //           //   error={!!errors.entry_date}
          //           //   helperText={errors.entry_date?.message}
          //         />
          //       )}
          //     />
          //   </LocalizationProvider>
          //   {errors.allotment_date && (
          //     <Typography color="error">
          //       {errors.allotment_date.message}
          //     </Typography>
          //   )}
          // </Box>

          // <Box sx={{ mt: 2, width: "100%" }}>
          //   <TypographyLabel title={"Allotted Capital"} />
          //   <Controller
          //     name="allotted_capital"
          //     control={control}
          //     render={({ field }) => (
          //       <TextField
          //         disabled={!!disableScheme}
          //         {...field}
          //         // defaultValue={parseInt(formatIndianNumber(10000))}
          //         sx={{ width: "100%" }}
          //         size="small"
          //         placeholder="425000000"
          //         error={!!errors.allotted_capital}
          //         helperText={errors.allotted_capital?.message}
          //       />
          //     )}
          //   />
          // </Box>

          // <Box sx={{ mt: 2, width: "100%" }}>
          //   <TypographyLabel title={"Total Subscribed Units"} />
          //   <Controller
          //     name="total_subscribed_units"
          //     control={control}
          //     render={({ field }) => (
          //       <TextField
          //         disabled={!!disableScheme}
          //         {...field}
          //         sx={{ width: "100%" }}
          //         size="small"
          //         placeholder="50000000"
          //         error={!!errors.total_subscribed_units}
          //         helperText={errors.total_subscribed_units?.message}
          //       />
          //     )}
          //   />
          // </Box>
//         </Box>
//         <Box>
//           <RoundedButton title1="Add Scheme" disable={disableScheme} />
//         </Box>
//       </Box>

//       <Box sx={{ width: "120%" }}>
//         <Box sx={{ mt: 4, pr: 0 }}>
//           <HeaderDesc title={"Scheme Details"} />
//         </Box>
//         {MutualFundSetupData?.responseData?.results.length === 0 ? (
//           <Box>
//             <ReceiptTable
//               columns={MutualFundSetupTableEntryHeader}
//               data={[]}
//               // pagination={pagination}
//               // setPagination={setPagination}
//               // next={next}
//               // prev={prev}
//               // pageCount={totalPageCount}
//             />
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 ml: { md: 5, lg: 20 },
//                 mt: 5,
//               }}
//             >
//               <Empty
//                 imageStyle={{ height: 150, width: 150 }}
//                 description="No Data Available"
//               />
//             </Box>
//           </Box>
//         ) : (
//           <Box
//             sx={{
//               px: 0,
//               mt: 1,
//               maxWidth: "1500px",
//               width: { xl: "110%", lg: "105%", md: "90%" },
//             }}
//           >
//             <ReceiptTable
//               columns={MutualFundSetupTableEntryHeader}
//               data={MutualFundSetupData?.responseData?.results ?? []}
//               pagination={pagination}
//               setPagination={setPagination}
//               next={next}
//               prev={prev}
//               pageCount={totalPageCount}
//             />
//           </Box>
//         )}
//       </Box>
//     </>
//   );
// };

// export default MutualFundSetup;

// import {
//   Box,
//   TextField,
//   Autocomplete,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   MenuItem,
//   Select,
// //   Select,
// //   MenuItem,
// } from "@mui/material";
// import TypographyLabel from "components/InputLabel/TypographyLabel";
// import { MutualFundSchemeType } from "constants/Stock Data/StockData";
// import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import RoundedButton from "components/Button/Button";
// import ReceiptTable from "components/Table/TanstackTable";
// import { ColumnDef } from "@tanstack/react-table";
// import { useState, useEffect } from "react";
// import { usePostCreateStockTransaction } from "services/Stock Transaction/StockTransactionService";
// import { useForm, Controller } from "react-hook-form";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import ErrorBar from "components/Snackbar/ErrorBar";
// // import { axiosInstance } from "config/axiosInstance";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// type Transaction = {
//   original?: Transaction;

//   scheme_name: string;
//   scheme_number: number;
//   transaction_method: string;

//   maturity_date : object;
// //   tranction_type: string;
//   scheme_type: string;
//   stock_code: string;
//   units: string;
//   rate: string;
//   broker_code: number;
// };

// // export interface TransactionList {

// //   transaction_list: Transaction[];
// // }

// const schema = yup
//   .object({
//     scheme_name: yup.string().required("Scheme Name is required"),
//     scheme_number: yup.number().required("Scheme Number is required"),
//     scheme_type: yup.string().required("Scheme Method is required"),
//     maturity_date: yup.date().required("Maturity Date is required").nullable(),

//     // stock_code: yup.string().required("Stock Code is required"),
//     units: yup
//       .number()
//       .required("Units are required")
//       .typeError("Units must be a number"),
//     rate: yup
//       .number()
//       .required("Rate is required")
//       .typeError("Rate must be a number"),
//     // broker_code: yup.number().required("Broker Code is required"),
//   })
//   .required();

// const StockTransaction = () => {
//   // const theme = useTheme();
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [selectedTransaction, setSelectedTransaction] =
//     useState<Transaction | null>(null);

//   const [showTransactions, setShowTransactions] = useState(false);
// //   const [stockSymbols, setStockSymbols] = useState<string[]>([]);
// //   const [brokerCodeDropdown, setBrokerCodeDropdown] = useState<any[]>([]);
//   const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
//   const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
//   const [errorMsgs, setErrorMsgs] = useState("");
//   const [successMsgs, setSuccessMsgs] = useState("");
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

//   const {
//     handleSubmit,
//     control,
//     reset,
//     formState: { errors },
//   } = useForm<Transaction>({
//     resolver: yupResolver<any>(schema),
//   });

//   const {
//     mutate: CreateStockTransaction,
//     isSuccess: CreateStockTransactionSuccess,
//     isError: CreateStockTransactionError,
//   } = usePostCreateStockTransaction();

//   useEffect(() => {
//     if (CreateStockTransactionSuccess) {
//       setSuccessMsgs("Stock Transaction Entry Request has been submitted.");
//       setSnackbarSuccessOpen(true);
//       reset();
//     } else if (CreateStockTransactionError) {
//       setErrorMsgs("Error submitting Stock Transaction Entry Request.");
//       setSnackbarErrorOpen(true);
//       reset();
//     }
//   }, [CreateStockTransactionSuccess, reset, CreateStockTransactionError]);

//   useEffect(() => {
//     const savedTransactions = localStorage.getItem("transactions");
//     if (savedTransactions) {
//       setTransactions(JSON.parse(savedTransactions));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("transactions", JSON.stringify(transactions));
//   }, [transactions]);

// //   useEffect(() => {
// //     const fetchStockSymbols = async () => {
// //       try {
// //         const response = await axiosInstance.get(
// //           "/accounting/api/v1/parameters/stock-list/"
// //         );
// //         if (response.data.isSuccess) {
// //           const symbols = response.data.responseData.map(
// //             (stock: any) => stock.symbol
// //           );
// //           setStockSymbols(symbols);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching stock symbols:", error);
// //       }
// //     };

// //     fetchStockSymbols();
// //   }, []);

// //   useEffect(() => {
// //     const fetchBrokerCodes = async () => {
// //       try {
// //         const response = await axiosInstance.get(
// //           "/accounting/api/v1/parameters/broker-list"
// //         );
// //         if (response.data.isSuccess) {
// //           setBrokerCodeDropdown(response.data.responseData);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching broker codes:", error);
// //       }
// //     };

// //     fetchBrokerCodes();
// //   }, []);

//   const onSubmit = (data: Transaction) => {
//     const newTransaction: Transaction = {
//       ...data,
//       broker_code: Number(data.broker_code),
//     };
//     setTransactions((prevTransactions) => [
//       ...prevTransactions,
//       newTransaction,
//     ]);
//     setShowTransactions(true);
//   };

//   const handleCompleteTransaction = async () => {
//     try {
//       const sanitizedTransactions = transactions.map(({ ...rest }) => rest);

//       const payload = { transaction_list: sanitizedTransactions };
//       await CreateStockTransaction(payload);
//       localStorage.removeItem("transactions");
//       setTransactions([]);
//       setShowTransactions(false);
//       reset();
//     } catch (error) {
//       console.error("Error completing transaction:", error);
//     }
//   };

//   const handleEdit = (item: Transaction) => {
//     setSelectedTransaction({ ...item, original: item });
//     setOpenEditDialog(true);
//   };

//   const handleDelete = (item: Transaction) => {
//     setSelectedTransaction(item);
//     setOpenDeleteDialog(true);
//   };

//   const handleEditSave = () => {
//     if (selectedTransaction) {
//       setTransactions((prevTransactions) =>
//         prevTransactions.map((transaction) =>
//           transaction === selectedTransaction.original
//             ? selectedTransaction
//             : transaction
//         )
//       );
//       setSelectedTransaction(null);
//       setOpenEditDialog(false);
//     }
//   };

//   const handleDeleteConfirm = () => {
//     if (selectedTransaction) {
//       setTransactions(
//         transactions.filter(
//           (transaction) => transaction !== selectedTransaction
//         )
//       );
//       setSelectedTransaction(null);
//       setOpenDeleteDialog(false);
//     }
//   };

//   const StockTransactionTableEntryHeader: ColumnDef<Transaction>[] = [
//     {
//       header: "Transaction Method",
//       accessorKey: "scheme_type",
//       cell: (data) => (
//         <Typography>{data.row.original.scheme_type}</Typography>
//       ),
//     },
//     {
//       header: "Scheme Name",
//       accessorKey: "scheme_name",
//       cell: (data) => <Typography>{data.row.original.scheme_name}</Typography>,
//     },
//     {
//         header: "Scheme Number",
//         accessorKey: "scheme_number",
//         cell: (data) => <Typography>{data.row.original.scheme_number}</Typography>,
//       },
//       {
//         header: "Maturity Date",
//         accessorKey: "maturity_date",
//         cell: (data) => <>{data.row.original.maturity_date}</>,
//         // cell: (data) => <Typography>{data.row.original.maturity_date}</Typography>,
//       },
//     {
//       header: "Rate",
//       accessorKey: "rate",
//       cell: (data) => <Typography>{data.row.original.rate}</Typography>,
//     },
//     {
//       header: "Units",
//       accessorKey: "units",
//       cell: (data) => <Typography>{data.row.original.units}</Typography>,
//     },
//     // {
//     //   header: "Broker Code",
//     //   accessorKey: "broker_code",
//     //   cell: (data) => <Typography>{data.row.original.broker_code}</Typography>,
//     // },
//     {
//       header: "Actions",
//       accessorKey: "actions",
//       cell: (data) => (
//         <Box sx={{ display: "flex", flexDirection: "row", gap: 0.6 }}>
//           <Button
//             onClick={() => handleEdit(data.row.original)}
//             variant="text"
//             color="primary"
//           >
//             <EditOutlinedIcon sx={{ color: "#3E2723" }} />
//           </Button>
//           <Button
//             onClick={() => handleDelete(data.row.original)}
//             variant="text"
//             color="primary"
//           >
//             <DeleteOutlineOutlinedIcon />
//           </Button>
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <Box
//       component="form"
//       sx={{ width: { xs: "70%", lg: "80%" } }}
//       onSubmit={handleSubmit(onSubmit)}
//     >
//       <Box sx={{ mt: 2 }}>
//         <HeaderDesc title="Scheme Setup" />
//         <Box
//           sx={{
//             mt: 1.5,
//             display: "grid",
//             alignItems: "center",
//             gridTemplateColumns: 'repeat(3, 1fr)',

//             // flexWrap: "wrap",
//             gap: "1rem",
//           }}
//         >
//              <Box sx={{ flex: "calc(50% - 1rem)" }}>
//             <TypographyLabel title="Scheme Name" />
//             <Controller
//               name="scheme_name"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   placeholder="NIC ASIA Dynamic Debit Fund"
//                   sx={{ width: "100%" }}
//                   size="small"
//                   {...field}
//                   error={!!errors.scheme_name}
//                   helperText={errors.scheme_name?.message}
//                 />
//               )}
//             />
//           </Box>

//           <Box sx={{ flex: "calc(50% - 1rem)" }}>
//             <TypographyLabel title="Scheme Number" />
//             <Controller
//               name="scheme_number"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   placeholder=""
//                   sx={{ width: "100%" }}
//                   size="small"
//                   {...field}
//                   error={!!errors.scheme_number}
//                   helperText={errors.scheme_number?.message}
//                 />
//               )}
//             />
//           </Box>

//           <Box sx={{ flex: "calc(50% - 1rem)" }}>
//             <TypographyLabel title="Scheme Type" />
//             <Controller
//               name="scheme_type"
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   {...field}
//                   size="small"
//                   fullWidth
//                   error={!!errors.scheme_type}
//                 >
//                   <MenuItem value="close-ended">Close-Ended</MenuItem>
//                   <MenuItem value="open-ended">Open-Ended</MenuItem>
//                 </Select>
//               )}
//             />
//             {errors.scheme_type && (
//               <Typography color="error" sx={{ fontSize: "12px" }}>
//                 {errors.scheme_type.message}
//               </Typography>
//             )}
//           </Box>
//           {/* <Box sx={{ flex: "calc(50% - 1rem)" }}>
//             <TypographyLabel title="Stock Symbol" />
//             <Controller
//               name="stock_code"
//               control={control}
//               render={({ field }) => (
//                 <Autocomplete
//                   size="small"
//                   options={stockSymbols}
//                   {...field}
//                   onChange={(event, value) => field.onChange(value)}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       error={!!errors.stock_code}
//                       helperText={errors.stock_code?.message}
//                     />
//                   )}
//                 />
//               )}
//             />
//           </Box> */}
//           {/* <Box sx={{ flex: "calc(50% - 1rem)" }}>
//             <TypographyLabel title="Broker Code" />
//             <Controller
//               name="broker_code"
//               control={control}
//               render={({ field }) => (
//                 <Autocomplete
//                   size="small"
//                   value={
//                     brokerCodeDropdown.find(
//                       (broker: any) => broker.broker_code === field.value
//                     ) || brokerCodeDropdown[0]
//                   }
//                   options={brokerCodeDropdown}
//                   getOptionLabel={(option) =>
//                     `${option.broker_name} (${option.broker_code})`
//                   }
//                   {...field}
//                   onChange={(event, value) => {
//                     if (value) {
//                       field.onChange(value.broker_code);
//                     } else {
//                       field.onChange(null);
//                     }
//                   }}
//                   renderOption={(props, option) => (
//                     <li {...props}>
//                       {option.broker_name} ({option.broker_code})
//                     </li>
//                   )}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       error={!!errors.broker_code}
//                       helperText={errors.broker_code?.message}
//                     />
//                   )}
//                 />
//               )}
//             />
//           </Box> */}
//            <Box sx={{ width: "calc(50% - 0.5rem)" }}>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <TypographyLabel title="Maturity Date" />
//               <Controller
//                 name="maturity_date"
//                 control={control}
//                 defaultValue={null}
//                 render={({ field }) => (
//                   <DatePicker
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
//                     // error={!!errors.applyDate}
//                     // helperText={errors.applyDate?.message}
//                   />
//                 )}
//               />
//             </LocalizationProvider>
//           </Box>

//           <Box sx={{ flex: "calc(50% - 1rem)" }}>
//             <TypographyLabel title="Rate" />
//             <Controller
//               name="rate"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   placeholder="Please Enter Rate"
//                   sx={{ width: "100%" }}
//                   size="small"
//                   {...field}
//                   error={!!errors.rate}
//                   helperText={errors.rate?.message}
//                 />
//               )}
//             />
//           </Box>
//           <Box sx={{ flex: "calc(50% - 1rem)" }}>
//             <TypographyLabel title="Units" />
//             <Controller
//               name="units"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   placeholder="Please Enter Units"
//                   sx={{ width: "49%" }}
//                   size="small"
//                   {...field}
//                   error={!!errors.units}
//                   helperText={errors.units?.message}
//                 />
//               )}
//             />
//           </Box>
//         </Box>
//       </Box>
//       <Box mt={2}>
//         <RoundedButton
//           title1="Add Transaction"
//           onClick1={handleSubmit(onSubmit)}
//         />
//       </Box>
//       {showTransactions && (
//         <Box sx={{ mt: 2 }}>
//           <HeaderDesc title="Transaction Entries" />
//           <Box
//             sx={{
//               mt: 1.5,
//               display: "flex",
//               alignItems: "center",
//               flexWrap: "wrap",
//               gap: "1rem",
//             }}
//           >
//             <Box>
//               <ReceiptTable
//                 columns={StockTransactionTableEntryHeader}
//                 data={transactions}
//               />
//             </Box>
//           </Box>
//           <Box mt={2}>
//             <RoundedButton
//               title1="Complete Transaction"
//               onClick1={handleCompleteTransaction}
//             />
//           </Box>
//         </Box>
//       )}
//       <SuccessBar
//         snackbarOpen={snackbarSuccessOpen}
//         setSnackbarOpen={setSnackbarSuccessOpen}
//         message={successMsgs}
//       />
//       <ErrorBar
//         snackbarOpen={snackbarErrorOpen}
//         setSnackbarOpen={setSnackbarErrorOpen}
//         message={errorMsgs}
//       />

//       {/* Edit Dialog */}
//       {showTransactions && (
//         <Box>
//           <Dialog
//             open={openEditDialog}
//             onClose={() => setOpenEditDialog(false)}
//           >
//             <DialogTitle>Edit Transaction</DialogTitle>
//             <DialogContent>
//               <Box
//                 sx={{
//                   mt: 1.5,
//                   display: "flex",
//                   alignItems: "center",
//                   flexWrap: "wrap",
//                   gap: "1rem",
//                 }}
//               >
//                 <Box sx={{ flex: "calc(50% - 1rem)" }}>
//                   <TypographyLabel title="Transaction Type" />
//                   <Autocomplete
//                     size="small"
//                     options={MutualFundSchemeType}
//                     value={selectedTransaction?.scheme_type || ""}
//                     onChange={(event, value) =>
//                       setSelectedTransaction((prev) =>
//                         prev
//                           ? { ...prev, scheme_type: value || "" }
//                           : null
//                       )
//                     }
//                     renderInput={(params) => <TextField {...params} />}
//                   />
//                 </Box>
//                 {/* <Box sx={{ flex: "calc(50% - 1rem)" }}>
//                   <TypographyLabel title="Stock Symbol" />
//                   <Autocomplete
//                     size="small"
//                     options={stockSymbols}
//                     value={selectedTransaction?.stock_code || ""}
//                     onChange={(event, value) =>
//                       setSelectedTransaction((prev) =>
//                         prev ? { ...prev, stock_code: value || "" } : null
//                       )
//                     }
//                     renderInput={(params) => <TextField {...params} />}
//                   />
//                 </Box> */}
//                 {/* <Box sx={{ flex: "calc(50% - 1rem)" }}>
//                   <TypographyLabel title="Broker Code" />
//                   <Autocomplete
//                                         size="small"
//                                         options={brokerCodeDropdown}
//                                         value={selectedTransaction?.broker_code || ''}
//                                         onChange={(event, value) => setSelectedTransaction(prev => prev ? { ...prev, broker_code: Number(value) } : null)}
//                                         renderInput={(params) => <TextField {...params} />}
//                                     />
//                   <Autocomplete
//                     size="small"
//                     options={brokerCodeDropdown}
//                     getOptionLabel={(option) =>
//                       `${option.broker_name} (${option.broker_code})`
//                     }
//                     value={
//                       brokerCodeDropdown.find(
//                         (option) =>
//                           option.broker_code ===
//                           selectedTransaction?.broker_code
//                       ) || null
//                     }
//                     onChange={(event, value) =>
//                       setSelectedTransaction((prev) =>
//                         prev
//                           ? { ...prev, broker_code: value?.broker_code || "" }
//                           : null
//                       )
//                     }
//                     renderInput={(params) => <TextField {...params} />}
//                   />
//                 </Box> */}

//                 <Box sx={{ flex: "calc(50% - 1rem)" }}>
//                   <TypographyLabel title="Scheme Name" />
//                   <TextField
//                     sx={{ width: "100%" }}
//                     size="small"
//                     value={selectedTransaction?.scheme_name || ""}
//                     onChange={(e) =>
//                       setSelectedTransaction((prev) =>
//                         prev ? { ...prev, scheme_name: e.target.value } : null
//                       )
//                     }
//                   />
//                 </Box>
//                 <Box sx={{ flex: "calc(50% - 1rem)" }}>
//                   <TypographyLabel title="Scheme Number" />
//                   <TextField
//                     sx={{ width: "100%" }}
//                     size="small"
//                     value={selectedTransaction?.scheme_number || ""}
//                     onChange={(e) =>
//                       setSelectedTransaction((prev) =>
//                         prev ? { ...prev, scheme_number: parseInt(e.target.value) } : null
//                       )
//                     }
//                   />
//                 </Box>
//                 <Box sx={{ width: "calc(50% - 0.5rem)" }}>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <TypographyLabel title="Apply Date" />
//               <Controller
//                 name="maturity_date"
//                 control={control}
//                 defaultValue={null}
//                 render={({ field }) => (
//                   <DatePicker
//                     {...field}
//                     sx={{
//                       width: "100%",
//                       "& .MuiSvgIcon-root": {
//                         width: "16px",
//                         height: "16px",
//                       },
//                     }}
//                     slotProps={{ textField: { size: "small" } }}
//                     value={selectedTransaction?.maturity_date || ""}
//                     onChange={(e) =>
//                       setSelectedTransaction((prev) =>
//                         prev ? { ...prev, maturity_date: e.target.value } : null
//                       )
//                     }
//                     // error={!!errors.applyDate}
//                     // helperText={errors.applyDate?.message}
//                   />
//                 )}
//               />
//             </LocalizationProvider>
//           </Box>
//                 <Box sx={{ flex: "calc(50% - 1rem)" }}>
//                   <TypographyLabel title="Rate" />
//                   <TextField
//                     sx={{ width: "100%" }}
//                     size="small"
//                     value={selectedTransaction?.rate || ""}
//                     onChange={(e) =>
//                       setSelectedTransaction((prev) =>
//                         prev ? { ...prev, rate: e.target.value } : null
//                       )
//                     }
//                   />
//                 </Box>
//                 <Box sx={{ flex: "calc(50% - 1rem)" }}>
//                   <TypographyLabel title="Unit" />
//                   <TextField
//                     sx={{ width: "100%" }}
//                     size="small"
//                     value={selectedTransaction?.units || ""}
//                     onChange={(e) =>
//                       setSelectedTransaction((prev) =>
//                         prev ? { ...prev, units: e.target.value } : null
//                       )
//                     }
//                   />
//                 </Box>
//               </Box>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setOpenEditDialog(false)} color="primary">
//                 Cancel
//               </Button>
//               <Button onClick={handleEditSave} color="primary">
//                 Save
//               </Button>
//             </DialogActions>
//           </Dialog>

//           {/* Delete Dialog */}
//           <Dialog
//             open={openDeleteDialog}
//             onClose={() => setOpenDeleteDialog(false)}
//           >
//             <DialogTitle>Confirm Delete</DialogTitle>
//             <DialogContent>
//               <Typography>
//                 Are you sure you want to delete this transaction?
//               </Typography>
//             </DialogContent>
//             <DialogActions>
//               <Button
//                 onClick={() => setOpenDeleteDialog(false)}
//                 color="primary"
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleDeleteConfirm} color="primary">
//                 Delete
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default StockTransaction;
