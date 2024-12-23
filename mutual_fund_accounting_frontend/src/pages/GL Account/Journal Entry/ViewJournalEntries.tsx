import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import * as yup from "yup";
import { Empty } from "antd";
import { useForm } from "react-hook-form";
import { PaginationState } from "@tanstack/react-table";
import { yupResolver } from "@hookform/resolvers/yup";

import { Box, Typography, useTheme } from "@mui/material";
import { Visibility } from "@mui/icons-material";

import DateFormatter from "utils/DateFormatter";
import RoundedButton from "components/Button/Button";
import TableModal from "components/Modal/TableModal";
import DateField from "components/DateFilter/DateField";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ReceiptTable from "components/Table/TanstackTable";
import {
  useGetJournalDetails,
  useGetJournalEntriesList,
} from "services/Journal Entries/journalEntriesListServices";
import ExportButtonWithOptions from "components/Button/ExportButtonWithOption";

const DateFormatterAmendment = {
  format: (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  },
};

const ViewJournalEntries = () => {
  const theme = useTheme();
  const schema = yup.object().shape({
    startDate: yup.object().required(),
    endDate: yup.object().required(),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
    },
    resolver: yupResolver(schema),
  });

  const BASEURL = import.meta.env.VITE_BASE_URL;
  const [tableData, setTableData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [entryId, setEntryId] = useState<number | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });

  const {
    data: entryListData,
    isSuccess: entryListSuccess,
    refetch: entryListRefetch,
  } = useGetJournalEntriesList(
    searchData.from_date,
    pagination.pageIndex + 1,
    searchData.to_date,
    pageSize
  );

  const {
    data: entryDetailData,
    isSuccess: entryDetailSuccess,
    refetch: entryDetailRefetch,
  } = useGetJournalDetails(entryId);

  const totalPages = Math.ceil(entryListData?.responseData?.count / pageSize);

  const handleLoad = (data) => {
    if (data.startDate && data.endDate) {
      const fromDate = new Date(data.startDate);
      const toDate = new Date(data.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatterAmendment.format(
        toDate.toISOString()
      );

      setSearchData({
        from_date: formattedFromDate,
        to_date: formattedToDate,
      });
      setPagination({ pageIndex: 0, pageSize: 10 });
    }
  };
  // const handleExport = (startDate: Date, endDate: Date, format: string) => {};
  useEffect(() => {
    if (entryListData?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (entryListData?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [entryListData, entryListSuccess]);

  useEffect(() => {
    if (entryListSuccess) {
      const tempData = entryListData?.responseData?.results?.map((item) => ({
        entryNo: item.id,
        transactionDate: item.created_at,
        entryBy: item.entered_by,
        drAmt: item.dr_total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"),
        crAmt: item.cr_total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"),

        description:
          item.narration !== null && item.narration !== ""
            ? item.narration
            : item.entries.map((entry) => entry.description).slice(-1),
      }));

      setTableData(tempData);
    }
  }, [entryDetailData, entryListSuccess, entryListData]);

  const handleEntry = async (id: number) => {
    setEntryId(id);
    setModalOpen(true);
  };

  useEffect(() => {
    entryDetailRefetch();
    if (entryDetailSuccess) {
      const tempData = entryDetailData?.responseData?.entries?.map(
        (item, index) => ({
          sn: index + 1,
          ledgerHead: item.sub_ledger_head,
          drAmt: item.dr !== null ? item.dr : "",
          crAmt: item.cr !== null ? item.cr : "",
          desc: item.description,
        })
      );

      setModalData(tempData);
    }
  }, [entryId, entryDetailData, entryDetailSuccess, entryDetailRefetch]);

  const handleModalClose = () => {
    setModalOpen(false);
    setModalData([]);
  };

  const handleReset = () => {
    setSearchData({ from_date: "", to_date: "" });
    entryListRefetch();
  };

  const JournalEntriesTableHeaders = [
    {
      header: "S.N.",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.index + 1}
          </Typography>
        );
      },
    },
    {
      header: "Created Date",
      accessorKey: "transactionDate",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: 400, width: "max-content" }}
          >
            {" "}
            {data.row.original.transactionDate.split("T")[0]}{" "}
          </Typography>
        );
      },
    },
    {
      header: "Timestamp",
      accessorKey: "transactionDate",
      cell: (data) => {
        const transactionDate = new Date(data.row.original.transactionDate);
        const nepaliTime = transactionDate.toLocaleTimeString("en-US");
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: 400, width: "max-content" }}
          >
            {nepaliTime}
          </Typography>
        );
      },
    },

    {
      header: "Description",
      accessorKey: "description",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {" "}
            {data.row.original.description}{" "}
          </Typography>
        );
      },
    },
    {
      header: "Entered By",
      accessorKey: "entered_by",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {" "}
            {data.row.original.entered_by}{" "}
          </Typography>
        );
      },
    },
    {
      header: "Dr Amount",
      accessorKey: "drAmt",
      cell: (data) => {
        return (
          <Typography
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "60px",
              fontSize: "14px",
              fontWeight: 400,
              mr: 8,
            }}
          >
            {" "}
            {data.row.original.drAmt}{" "}
          </Typography>
        );
      },
    },
    {
      header: "Cr Amount",
      accessorKey: "crAmt",
      cell: (data) => {
        return (
          <Typography
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "60px",
              fontSize: "14px",
              fontWeight: 400,
              mr: 2,
            }}
          >
            {" "}
            {data.row.original.crAmt}{" "}
          </Typography>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: (data) => {
        return (
          <Box
            onClick={() => handleEntry(data.row.original.entryNo)}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 0.5,
              textAlign: "center",
              color: theme.palette.primary[1100],
              "&:hover": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
          >
            <Visibility sx={{ fontSize: "14px", fontWeight: 600 }} />
            <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
              View
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <TableModal
        open={modalOpen}
        handleClose={handleModalClose}
        data={modalData}
        id={entryId}
        isExport={true}
      />
      <Box sx={{ mt: 2 }}>
        <HeaderDesc title="Journal Entries" />
      </Box>

      <Box sx={{ mt: 2 }} onSubmit={handleSubmit(handleLoad)} component="form">
        <DateField
          control={control}
          dateLabel1="Date (From)"
          dateLabel2="Date (To)"
          maxDateValue={dayjs()}
        />
        <RoundedButton title1="Load" />
      </Box>
      {entryListData?.responseData?.results?.length > 0 ? (
        <Box
          sx={{
            my: 2,
            maxWidth: "1500px",
            width: { xl: "130%", lg: "129%", md: "110%" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: { xl: "130%", lg: "129%", md: "110%" },
            }}
          >
            <ExportButtonWithOptions
              baseURL={`${BASEURL}/accounting/api/v1/accounting/journals/formatted/export/`}
              startDate={searchData.from_date}
              endDate={searchData.to_date}
            />
          </Box>
          <ReceiptTable
            data={tableData ?? []}
            columns={JournalEntriesTableHeaders}
            pagination={pagination}
            setPagination={setPagination}
            next={next}
            prev={prev}
            pageCount={totalPages}
            setPageSize={setPageSize}
          />
        </Box>
      ) : (
        <Box sx={{ width: "120%", mt: 4 }}>
          <ReceiptTable columns={JournalEntriesTableHeaders} data={[]} />
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
            <Empty imageStyle={{}} description="No Data Available" />
            <Typography
              onClick={handleReset}
              sx={{
                color: theme.palette.primary[700],
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reset Filters
            </Typography>
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
};

export default ViewJournalEntries;
