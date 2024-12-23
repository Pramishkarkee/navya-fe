import React, { useEffect, useState } from "react";
import { Box, TextField } from "@mui/material";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { SectorTable } from "constants/Table Headers/SectorData/SectorDataTableHeader";
import {
  useGetSectorData,
  usePatchSectorData,
} from "services/SectorData/SectorDataServices";
import ReceiptTable from "components/Table/TanstackTable";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SuccessBar from "components/Snackbar/SuccessBar";
import { PaginationState } from "@tanstack/react-table";
import ErrorBar from "components/Snackbar/ErrorBar";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import axios from "axios";
import { Empty } from "antd";

interface SectorData {
  max_threshold: any;
  min_threshold: any;
  name: string;
  code: string;
  // min_threshold: string | number;
  // max_threshold: string | number;
}

export default function InvestmentSector() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorBarOpen, setErrorBarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();

  const schema = yup.object().shape({
    code: yup.string().required("Sector Id is required"),
    name: yup.string().required("Sector Name is required"),
    min_threshold: yup.string().optional().nullable(),
    max_threshold: yup.string().optional().nullable(),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      min_threshold: "",
      max_threshold: "",
    },
  });

  const { data: SectorData } = useGetSectorData(pagination.pageIndex + 1);
  const { mutate: SectorDataAdded } = usePatchSectorData();

  const totalPageCount = Math.ceil(SectorData?.responseData?.count / 10);

  useEffect(() => {
    if (SectorData?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (SectorData?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [SectorData]);

  const SectorSubmit = (data: SectorData) => {
    const tempData = {
      name: data?.name,
      code: data?.code,
      min_threshold: data?.min_threshold,
      max_threshold: data?.max_threshold,
    };

    SectorDataAdded(tempData, {
      onSuccess: () => {
        // setTableData((prevData) => [...prevData, newData]);
        // setValue("name", "");
        // setValue("code", "");
        setSnackbarOpen(true);
        reset();
        setValue("name", "");
        setValue("code", "");
        setValue("min_threshold", "");
        setValue("max_threshold", "");
      },
      onError: (error) => {
        setErrorBarOpen(true);
        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage(
            error.response.data.code
              ? error.response.data.code[0]
              : "Error in submitting data!"
          );
        } else {
          setErrorMessage("Error in submitting data!");
          console.error(error);
        }
      },
    });
  };

  const handleResetButton = () => {
    setValue("name", "");
    setValue("code", "");
  };

  return (
    <>
      <SuccessBar
        snackbarOpen={snackbarOpen}
        message={"Sector Created Successfully!"}
        setSnackbarOpen={setSnackbarOpen}
      />

      <ErrorBar
        snackbarOpen={errorBarOpen}
        message={errorMessage}
        setSnackbarOpen={setErrorBarOpen}
      />

      <Box
        component="form"
        onSubmit={handleSubmit(SectorSubmit)}
        sx={{
          p: "0.5rem",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box>
          <TypographyLabel title={"Sector ID"} />
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                placeholder="Enter Sector ID"
                error={Boolean(errors.code)}
                helperText={errors?.code?.message}
              />
            )}
          />
        </Box>
        <Box>
          <TypographyLabel title={"Sector Name"} />
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                placeholder="Enter Sector Name"
                error={Boolean(errors.name)}
                helperText={errors?.name?.message}
              />
            )}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          {/* <Box>
            <TypographyLabel title={"Minimum Investment Threshold(%)"} />
            <Controller
              name="min_threshold"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  placeholder="5%"
                  error={Boolean(errors.min_threshold)}
                  helperText={errors?.min_threshold?.message}
                />
              )}
            />
          </Box> */}
          {/* <Box>
            <TypographyLabel title={"Maximum Investment Threshold(%)"} />
            <Controller
              name="max_threshold"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  placeholder="7.82%"
                  error={Boolean(errors.max_threshold)}
                  helperText={errors?.max_threshold?.message}
                />
              )}
            />
          </Box> */}
        </Box>
        <Box>
          <RoundedButton
            title1="Add"
            onClick1={handleSubmit(SectorSubmit)}
            title2="Reset"
            onClick2={handleResetButton}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 4, width: "100%" }}>
        <HeaderDesc title={"Sector Table"} />

        {SectorData?.responseData?.results.length === 0 ? (
          <Box sx={{}}>
            <ReceiptTable
              columns={SectorTable}
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
              mt: 1,
              maxWidth: "1500px",
              width: { sm: "400px", md: "450px", lg: "450px" },
            }}
          >
            <ReceiptTable
              columns={SectorTable}
              data={SectorData?.responseData?.results ?? []}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
              pageCount={totalPageCount}
              // isLoading={SectorDataLoading}
            />
          </Box>
        )}
      </Box>
    </>
  );
}

// import React, { useEffect, useState } from "react";
// import { Box, TextField } from "@mui/material";
// import RoundedButton from "components/Button/Button";
// import TypographyLabel from "components/InputLabel/TypographyLabel";
// import { SectorTable } from "constants/Table Headers/SectorData/SectorDataTableHeader";
// import {
//   useGetSectorData,
//   usePatchSectorData,
// } from "../../../services/SectorData/Sector";
// import ReceiptTable from "../../../components/Table/TanstackTable";
// import { Controller, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import SuccessBar from "components/Snackbar/SuccessBar";
// interface SectorData {
//   name: string;
//   code: string;

// }

// export default function InvestmentSector() {

//   const [snackbarOpen, setSnackbarOpen] = useState(false);

//   const schema = yup.object().shape({
//     code: yup
//     // .length(5, "Sector Id must be 5 characters long")
//       .string()
//       .required("Sector Id is required"),
//     name: yup.string().required("Sector Name is required"),
//   });

//   const {
//     control,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const { data: SectorData, isLoading: SectorDataLoading } = useGetSectorData();
//   const {
//     mutate: SectorDataAdded,
//     isSuccess: SectorDataSuccess,
//     isError: SectorDataError,
//   } = usePatchSectorData();

//   const BOIDSubmit = (data: SectorData) => {
//     const tempData = {
//       name: data?.name || SectorData?.responseData?.name || "",
//       code: data?.code || SectorData?.responseData?.code || "",
//     };
//     SectorDataAdded(tempData);
//   };

//   useEffect(() => {
//     if (SectorDataSuccess) {
//       setValue("name", "");
//       setValue("code", "");
//     }
//   }, [SectorDataSuccess, setValue , setSnackbarOpen]);

//   const handleAddButton = () => {
//   };

//   const handleResetButton = () => {
//   };

//   if(SectorDataSuccess){
//    <SuccessBar snackbarOpen={true} message={'Successfully Submitted!'} setSnackbarOpen={true}   />
//     setSnackbarOpen(true);
//   }

//   return (
//     <>
//       <Box
//         component="form"
//         onSubmit={handleSubmit(BOIDSubmit)}
//         sx={{
//           p: "0.5rem",
//           display: "flex",
//           flexDirection: "column",
//           gap: 2,
//         }}
//       >
//         <Box>
//           <TypographyLabel title={"Sector ID"} />
//           <Controller
//             name="code"
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 size="small"
//                 placeholder="Enter Sector ID"
//                 error={Boolean(errors.code)}
//                 helperText={errors?.code?.message}
//               />
//             )}
//           />
//         </Box>
//         <Box>
//           <TypographyLabel title={"Sector Name"} />
//           <Controller
//             name="name"
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 size="small"
//                 placeholder="Enter Sector Name"
//                 error={Boolean(errors.name)}
//                 helperText={errors?.name?.message}
//               />
//             )}
//           />
//         </Box>
//         <Box>
//           <RoundedButton
//             title1="Add"
//             onClick1={handleAddButton}
//             title2="Reset"
//             onClick2={handleResetButton}
//           />
//         </Box>
//       </Box>

//       <Box sx={{maxHeight:500 , overflow:'hidden' , width:600}}>
//       <ReceiptTable
//         data={SectorData?.responseData ?? []}
//         columns={SectorTable}
//         // Loading={SectorDataLoading}
//       />
//       </Box>
//     </>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { Box, TextField } from "@mui/material";
// import RoundedButton from "components/Button/Button";
// import TypographyLabel from "components/InputLabel/TypographyLabel";
// import { SectorTable } from "constants/Table Headers/SectorData/SectorDataTableHeader";
// import { useGetSectorData, usePatchSectorData } from "services/SectorData/Sector";
// import ReceiptTable from "components/Table/TanstackTable";
// import { Controller, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import SuccessBar from "components/Snackbar/SuccessBar";

// interface SectorData {
//   name: string;
//   code: string;
// }

// export default function InvestmentSector() {
//   const [snackbarOpen, setSnackbarOpen] = useState(false);

//   const schema = yup.object().shape({
//     code: yup.string().required("Sector Id is required"),
//     name: yup.string().required("Sector Name is required"),
//   });

//   const {
//     control,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const { data: SectorData, isLoading: SectorDataLoading } = useGetSectorData();
//   const {
//     mutate: SectorDataAdded,
//     isSuccess: SectorDataSuccess,
//     isError: SectorDataError,
//   } = usePatchSectorData();

//   const BOIDSubmit = (data: SectorData) => {
//     const tempData = {
//       name: data?.name || SectorData?.responseData?.name || "",
//       code: data?.code || SectorData?.responseData?.code || "",
//     };
//     SectorDataAdded(tempData);
//   };

//   useEffect(() => {
//     if (SectorDataSuccess) {
//       setValue("name", "");
//       setValue("code", "");
//       setSnackbarOpen(true);
//     }
//   }, [SectorDataSuccess, setValue]);

//   const handleAddButton = () => {
//     // You can add any custom behavior here if needed
//   };

//   const handleResetButton = () => {
//     setValue("name", "");
//     setValue("code", "");
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
//       <Box
//         component="form"
//         onSubmit={handleSubmit(BOIDSubmit)}
//         sx={{
//           p: "0.5rem",
//           display: "flex",
//           flexDirection: "column",
//           gap: 2,
//         }}
//       >
//         <Box>
//           <TypographyLabel title={"Sector ID"} />
//           <Controller
//             name="code"
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 size="small"
//                 placeholder="Enter Sector ID"
//                 error={Boolean(errors.code)}
//                 helperText={errors?.code?.message}
//               />
//             )}
//           />
//         </Box>
//         <Box>
//           <TypographyLabel title={"Sector Name"} />
//           <Controller
//             name="name"
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 size="small"
//                 placeholder="Enter Sector Name"
//                 error={Boolean(errors.name)}
//                 helperText={errors?.name?.message}
//               />
//             )}
//           />
//         </Box>
//         <Box>
//           <RoundedButton
//             title1="Add"
//             onClick1={handleSubmit(BOIDSubmit)}
//             title2="Reset"
//             onClick2={handleResetButton}
//           />
//         </Box>
//       </Box>

//       <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
//         <ReceiptTable
//           data={SectorData?.responseData ?? []}
//           columns={SectorTable}
//           // isLoading={SectorDataLoading}
//         />
//       </Box>
//     </>
//   );
// }
