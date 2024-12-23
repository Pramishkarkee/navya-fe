import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import OwnerInformation from "components/OwnerInformation/OwnerInformation";
import {  useForm } from "react-hook-form";
import RoundedButton from "components/Button/Button";
import ReceiptTable from "components/Table/TanstackTable";
import { useGetSipPaymentEntry } from "services/SIP Payment/SipPaymentEntry";
import ErrorBar from "components/Snackbar/ErrorBar";
import SuccessBar from "components/Snackbar/SuccessBar";
import { useGetUserRoles } from "services/Roles/RolesServices";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import ExportButtonSip from "components/Button/ExportSipButton";
import { colorTokens } from "../../../theme";
import SIPPaymentAction from "./SIPPaymentAction";

type LoadData = {
  boid: string;
};

type OnlineSIPTableHeaders = {
    //   regNo: number;
    //   interval: number;
    //   actionDate: string;
    //   payment_status: string;
    //   payment_date: string;
    
  SN: number;
  boid_no: string;
  full_name: string;
  email: string;
  phone: string;
  amount: number;
  applied_unit: number;
  
};

const SipPaymentEntry = () => {
  const [filter, setFilter] = React.useState<string | undefined>();

  const [snaackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [tableData, setTableData] = useState([]);
  const [tempTableData, setTempTableData] = useState([]);
  const [boid, setBoid] = useState("");

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

//   const BASE_URL = import.meta.env.VITE_BASE_URL;

  const { control, handleSubmit } = useForm({
    defaultValues: {
      dp: "NIC ASIA Bank",
      boid: "",
    },
  });

  const {
    data: sipInstallmentData,
    isSuccess: sipInstallmentSuccess,
    error: sipInstallmentError,
    isError: isSipInstallmentError,
  } = useGetSipPaymentEntry(boid , filter);

  const { data: userRolesData } = useGetUserRoles();

  useEffect(() => {
    // amendmentPostingDataRefetch();
    if (sipInstallmentSuccess) {
      setTableData(sipInstallmentData?.responseData?.results ?? []);

      if (
        !sipInstallmentData?.responseData?.results ||
        sipInstallmentData?.responseData?.results.length === 0
      ) {
        setErrorMsg("There is no SIP List Available for the given BOID.");
        setSnackbarErrorOpen(true);
      }
    }
  }, [sipInstallmentSuccess, sipInstallmentData]);

  // useEffect(() => {
  //   if (authorizeSipSuccess) {
  //     setSnackbarOpen(true);
  //     setMessage("SIP Authorized Successfully");
  //   }
  // }, [authorizeSipSuccess, authorizeSipData]);

  // useEffect(() => {
  //   if (isAuthorizeError) {
  //     setSnackbarErrorOpen(true);
  //     setErrorMsg("Error in authorizing");
  //   }
  // }, [isAuthorizeError, authorizeSipError]);

  const handleLoad = (data: LoadData) => {
    if (!data.boid || data.boid.length !== 16) {
      setSnackbarErrorOpen(true);
      setErrorMsg("Invalid BOID");
      return;
    }

    setBoid(data.boid);
    setFilter(data.boid);
  };

  useEffect(() => {
    const tempData = sipInstallmentData?.responseData?.results.filter(
      (item) => item.payment_status === "pending"
    );
    setTempTableData(tempData);
  }, [sipInstallmentData, sipInstallmentSuccess]);

  useEffect(() => {
    if (isSipInstallmentError) {
      setSnackbarErrorOpen(true);
      // console.error(sipInstallmentError);
    }
  }, [sipInstallmentError, isSipInstallmentError]);

  useEffect(() => {
    if (tempTableData) {
      const formattedData = tempTableData?.map((item, index) => ({
        SN: index + 1,
        regNo: item.id,
        interval: item.interval,
        actionDate: item.payment_date.split("T")[0],
        payment_status: item.payment_status,
        appliedUnit: item.applied_unit,
      }));

      setTableData(formattedData);
    }
  }, [tempTableData]);

  const totalPage = Math.ceil(tableData.length / 10);

  useEffect(() => {
    // setTableData(PendingSipListData?.responseData?.results || []);
    if (sipInstallmentData?.responseData?.next === null && tableData.length > 10) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (sipInstallmentData?.responseData?.previous === null && tableData.length > 10) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [sipInstallmentData, sipInstallmentSuccess, tableData]);

  const SipInstallmentPaymentHeaders: ColumnDef<OnlineSIPTableHeaders>[] = [
    {
      header: "S.No",
      accessorKey: "SN",
      cell: (data) => {
        return (
          <Box>
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
              {data.row.index + 1}
            </Typography>
          </Box>
        );
      },
    },
    // {
    //   header: "SIP Registration No.",
    //   size: 1,
    //   accessorKey: "regNo",
    //   cell: (data) => {
    //     return (
    //       <Box>
    //         <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.regNo}</Typography>
    //       </Box>
    //     );
    //   },
    // },
    {
      header: "Installment No.",
      size: 1,
      accessorKey: "boid_no",
      cell: (data) => {
        return (
          <Box>
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
              {" "}
              {data.row.original.boid_no}
            </Typography>
          </Box>
        );
      },
    },
    {
      header: "Name",
      accessorKey: "full_name",
      cell: (data) => {
        return (
          <Box>
            <Typography
              textAlign="left"
            //   width="40%"
              sx={{ fontSize: "14px", fontWeight: 400 }}
            >
              {data.row.original.full_name}
            </Typography>
          </Box>
        );
      },
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data?.row?.original?.email}
          </Typography>
        );
      },
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.phone}
          </Typography>
        );
      },
    },
        {
        header: "Applied Unit",
        accessorKey: "applied_unit",
        cell: (data) => {
            return (
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
                {data.row.original.applied_unit}
            </Typography>
            );
        },
    },
    {
        header: "Amount",
        accessorKey: "amount",
        cell: (data) => {
            return (
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
                {data.row.original.amount}
            </Typography>
            );
        },
        },
    {
      header: "Action",
      accessorKey: "action",
      cell: (data) => {
        const [open, setOpen] = useState(false);
        const handleAction = () => {
          setOpen(true);
        };
        const handleSave = () => {
            setOpen(false);
            };

        return (
          <Box>
            <Typography
              onClick={handleAction}
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                ml: 0,
                color: colorTokens.mainColor[900],
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Payment
            </Typography>
          
            <SIPPaymentAction
                open={open}
                setOpen={setOpen}
                data={data.row.original}
                onSave={handleSave}
            />
          </Box>
        );
      },
    },
  ];

  return (
    <Box component="form" onSubmit={handleSubmit(handleLoad)}>
      <SuccessBar
        snackbarOpen={snaackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        message='Success'
      />
      <ErrorBar
        snackbarOpen={snackbarErrorOpen}
        setSnackbarOpen={setSnackbarErrorOpen}
        message={errorMsg}
      />

      <OwnerInformation control={control} />
      <Box sx={{ mt: 2 }}>
        <RoundedButton
          title1="Load"
          disable={
            userRolesData && userRolesData?.responseData?.sip_payment
              ? !userRolesData?.responseData?.sip_payment?.entry
              : false
          }
        />
      </Box>

      {sipInstallmentData?.responseData?.results.length > 0 ? (
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <HeaderDesc title="Table Data" />
            {/* <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
              <ExportButtonSip
                boidNumber={boid}
                exportUrl={`${BASE_URL}/sip-up/api/v1/sip/sip-installment-list/`}
                fileName={`Sip Payment${boid ? ` - ${boid}` : ""}.csv`}
              />
            </Box> */}
          </Box>
          <Box sx={{ mt: 2 }}>
            <ReceiptTable
              data={sipInstallmentData?.responseData?.results}
              columns={SipInstallmentPaymentHeaders}
              //   setSelectedRows={setSelectedRows}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
              pageCount={totalPage}
            />

            {/* <Box sx={{ mt: 2 }}>
              <RoundedButton title1="Submit" onClick1={handlePayment} />
            </Box> */}
          </Box>
        </Box>
      ) : (
        <Box>
          <ErrorBar
            snackbarOpen={snackbarErrorOpen}
            setSnackbarOpen={setSnackbarErrorOpen}
            message={errorMsg}
          />
        </Box>
      )}
    </Box>
  );
};

export default SipPaymentEntry;
