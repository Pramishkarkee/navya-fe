import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import OwnerInformation from "components/OwnerInformation/OwnerInformation";
import { useForm } from "react-hook-form";
import RoundedButton from "components/Button/Button";
import PostingTable from "components/Table/PostingTable";
import { useGetSipInstallmentList } from "services/SIP Payment/sipPaymentServices";
import { SipInstallmentPaymentHeaders } from "constants/SIP Payment Table/SipPaymentHeaders";
import { useSipInstallmentMutation } from "services/SIP Payment/sipPaymentServices";
import ErrorBar from "components/Snackbar/ErrorBar";
import SuccessBar from "components/Snackbar/SuccessBar";
import { useGetUserRoles } from "services/Roles/RolesServices";
import { PaginationState } from "@tanstack/react-table";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ExportButtonSip from "components/Button/ExportSipButton";

type LoadData = {
  boid: string;
};

const SipPaymentEntry = () => {
  const [filter, setFilter] = React.useState<string | undefined>();

  const [snaackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tempTableData, setTempTableData] = useState([]);
  const [boid, setBoid] = useState("");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [resetCheckBox, setResetCheckBox] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const { control, handleSubmit } = useForm({
    defaultValues: {
      boid: "",
    },
  });
  const { mutate: authorizeSipMutate } = useSipInstallmentMutation();

  const { data: sipInstallmentData, isSuccess: sipInstallmentSuccess } =
    useGetSipInstallmentList(boid, filter);

  const { data: userRolesData } = useGetUserRoles();

  useEffect(() => {
    if (sipInstallmentSuccess && !isPaymentSuccess) {
      if (
        !sipInstallmentData?.results?.data ||
        sipInstallmentData?.results?.data.length === 0
      ) {
        setErrorMsg("There is no SIP List Available for the given BOID.");
        setSnackbarErrorOpen(true);
      } else {
        setTableData(sipInstallmentData?.results?.data ?? []);
      }
    }
  }, [sipInstallmentSuccess, sipInstallmentData]);

  // useEffect(() => {
  //   // amendmentPostingDataRefetch();
  //   if (sipInstallmentSuccess) {
  //     setTableData(sipInstallmentData?.results?.data ?? []);

  //     if (
  //       !sipInstallmentData?.results?.data ||
  //       sipInstallmentData?.results?.data.length === 0
  //     ) {
  //       setErrorMsg("There is no SIP List Available for the given BOID.");
  //       setSnackbarErrorOpen(true);
  //     }
  //   }
  // }, [sipInstallmentSuccess, sipInstallmentData]);

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
    // setSnackbarOpen(false);
    // setSnackbarErrorOpen(false);
    // setMessage("");
    // setErrorMsg("");

    setBoid(data.boid);
    setFilter(data.boid);
  };

  useEffect(() => {
    const tempData = sipInstallmentData?.results?.data?.filter(
      (item) => item.payment_status === "pending"
    );
    setTempTableData(tempData);
  }, [sipInstallmentData, sipInstallmentSuccess]);

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
    if (sipInstallmentData?.next === null && tableData.length > 10) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (sipInstallmentData?.previous === null && tableData.length > 10) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [sipInstallmentData, sipInstallmentSuccess, tableData]);

  const handlePayment = () => {
    const tempData = selectedRows?.map((item) => item?.id);
    const tempIntervals = selectedRows?.map((item) => item.interval);

    if (tempData.length === 0) {
      setSnackbarErrorOpen(true);
      setErrorMsg("You must select at least one SIP");
      return;
    }

    const finalData = {
      sip_ids: tempData,
      intervals: tempIntervals,
    };
    authorizeSipMutate(finalData, {
      onSuccess: () => {
        setResetCheckBox(true);
        setSnackbarOpen(true);
        setMessage("SIP Authorized Successfully");
        setErrorMsg("");
        setSnackbarErrorOpen(false);
        setIsPaymentSuccess(true);
        // setTableData((prevTableData) =>
        //   prevTableData.filter((row) => !selectedRows.includes(row))
        // );
        // setSelectedRows([]);
      },
      onError: (authorizeSipError) => {
        setSnackbarErrorOpen(true);
        setErrorMsg("Error in authorizing");
      },
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleLoad)}>
      <SuccessBar
        snackbarOpen={snaackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        message={message}
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
              ? !userRolesData?.responseData?.sip_payment?.payment
              : false
          }
        />
      </Box>

      {sipInstallmentData?.results?.data?.length > 0 ? (
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <HeaderDesc title="Table Data" />
            <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
              <ExportButtonSip
                boidNumber={boid}
                exportUrl={`${BASE_URL}/sip-up/api/v1/sip/sip-installment-list/`}
                fileName={`SIP Payment${boid ? ` - ${boid}` : ""}.csv`}
                paymentStatus="pending"
              />
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <PostingTable
              data={sipInstallmentData?.results?.data}
              columns={SipInstallmentPaymentHeaders}
              setSelectedRows={setSelectedRows}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
              pageCount={totalPage}
              resetSelectionTrigger={resetCheckBox}
            />
            {selectedRows.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <RoundedButton title1="Submit" onClick1={handlePayment} />
              </Box>
            )}
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
