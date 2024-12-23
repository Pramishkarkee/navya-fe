import { Box } from "@mui/material";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { AmendmentReceiptTableHeaders } from "constants/SIPAmendmentTable/AmendmentReceiptTable";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import DateField from "components/DateField/DateField";
import RoundedButton from "components/Button/Button";
import ReceiptTable from "components/Table/TanstackTable";

import { useGetSIPAmendmentReceipt } from "services/SIP Amendment/SipAmendmentReceiptServices";
import { useEffect, useState } from "react";
import DateFormatter from "utils/DateFormatter";
import ErrorBar from "components/Snackbar/ErrorBar";
import { PaginationState } from "@tanstack/react-table";
import dayjs from "dayjs";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ExportButtonSip from "components/Button/ExportSipButton";

interface AmendmentReceiptData {
  startDate: string;
  endDate: string;
}

const schema = yup
  .object({
    startDate: yup.object().required(),
    endDate: yup.object().required(),
    postingRemark: yup.string().label("Remarks"),
  })
  .required();

const AmendmentReceipt = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
    },
    resolver: yupResolver(schema),
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [tableData, setTableData] = useState([]);
  const [loadClicked, setLoadClicked] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [searchData, setSearchData] = useState({
    from_date: "",
    to_date: "",
  });
  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: amendmentReceiptData,
    isSuccess: amendmentReceiptSuccess,
    refetch: AmendmentReceiptRefetch,
  } = useGetSIPAmendmentReceipt(searchData?.from_date, searchData.to_date);

  const totalPage = Math.ceil(amendmentReceiptData?.meta?.records / 10);

  useEffect(() => {
    if (amendmentReceiptSuccess && loadClicked) {
      setTableData(amendmentReceiptData?.responseData?.results ?? []);

      if (
        !amendmentReceiptData?.responseData?.results ||
        amendmentReceiptData?.responseData?.results.length === 0
      ) {
        setErrorMsgs(
          "There is no SIP Receipt List Available for the given Date."
        );
        setSnackbarErrorOpen(true);
      }
    }
  }, [amendmentReceiptSuccess, loadClicked, amendmentReceiptData, searchData]);

  useEffect(() => {
    AmendmentReceiptRefetch();
    if (amendmentReceiptData?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (amendmentReceiptData?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [amendmentReceiptData, amendmentReceiptSuccess, AmendmentReceiptRefetch]);

  const handleSearch = (data: AmendmentReceiptData) => {
    if (!data && !data?.startDate && !data?.endDate) {
      setErrorMsgs("Both start and end dates must be selected.");
      setSnackbarErrorOpen(true);
    } else {
      const fromDate = new Date(data?.startDate);
      const toDate = new Date(data?.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatter.format(toDate.toISOString());

      if (formattedFromDate && formattedToDate) {
        setSearchData({
          from_date: formattedFromDate,
          to_date: formattedToDate,
        });
      }
      setLoadClicked(true);
    }
  };



  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleSearch)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Box>
        <ErrorBar
          snackbarOpen={snackbarErrorOpen}
          setSnackbarOpen={setSnackbarErrorOpen}
          message={errorMsgs}
        />
      </Box>
      <DistributionSchemeField
        control={control}
        label1="Distribution Center (Request)"
      />

      <Box
        sx={{
          width: { xs: "100%", sm: "96%", md: "94%", lg: "72%", xl: "60%" },
        }}
      >
        <DateField
          control={control}
          dateLabel1="Date (From)"
          dateLabel2="Date (To)"
        />
      </Box>
      <RoundedButton title1="Search" onClick1={handleSearch} />

      {tableData.length > 0 && (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <HeaderDesc title="Table" />
            <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
              <ExportButtonSip
                exportUrl={`${BASE_URL}/sip-up/api/v1/sip/sip-amendment-receipt/`}
                fileName={`Amendment Receipt.csv`}
                fromDate={searchData.from_date}
                toDate={searchData.to_date}
              />
            </Box>
          </Box>
          <ReceiptTable
            columns={AmendmentReceiptTableHeaders}
            data={tableData ?? []}
            pagination={pagination}
            setPagination={setPagination}
            next={next}
            prev={prev}
            pageCount={totalPage}
          />
        </Box>
      )}
    </Box>
  );
};

export default AmendmentReceipt;
