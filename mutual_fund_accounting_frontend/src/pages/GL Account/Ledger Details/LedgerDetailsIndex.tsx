import React, { 
  // useCallback, 
  useEffect, 
  useState 
} from "react";

import { Autocomplete, Box, FormControl, TextField, Typography } from "@mui/material";

import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ReceiptTable from "components/Table/TanstackTable";
import { useGetLedgerHeadList } from "services/LedgerHeadServices";
import {
  useGetLedgerList,
  // useGetSubLedgerTransactionDetails,
} from "services/Reporting/SubLedgerDetails/SubLedgerDetailsServices";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Empty } from "antd";
import { Link } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import RoundedButton from "components/Button/Button";
// import SearchText from "components/Button/Search";

// const debounce = (func, delay) => {
//   let timeoutId;
//   return (...args) => {
//     if (timeoutId) clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => {
//       func(...args);
//     }, delay);
//   };
// };

const LedgerDetailsIndex = () => {
  // const { 
    // control, 
    // handleSubmit, 
    // register,
    //  setValue
    //  } = useForm({
    // resolver: yupResolver(schema),
  // });
  // const [id, setId] = useState("");
  // const [displayData, setDisplayData] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [ledgerList, setLedgerList] = useState([]);
  const [selectedLedger, setSelectedLedger] = useState('');

  const { data: ledgerHeadListData, isSuccess: ledgerHeadListSuccess } =
    useGetLedgerHeadList(pagination.pageIndex + 1, pageSize, selectedLedger);
  
  const {data: ledgerListData} = useGetLedgerList();

  const totalPageCount = Math.ceil(
    ledgerHeadListData?.responseData.count / pageSize
  );

  useEffect(() => {
    const ledgerList = ledgerListData?.responseData?.map((item) => ({
      ledger_head: item.ledger_head,
      ledger_code: item.ledger_code,
    }));
    setLedgerList(ledgerList);
  }, [ledgerListData]);

  useEffect(() => {
    if (ledgerHeadListSuccess) {
      const tempData = ledgerHeadListData?.responseData?.results?.map(
        (item, index) => ({
          sn: index + 1,
          txnDate: item.ledger_opening_date,
          accType: item.account_type_label,
          accHead: item.account_head_label,
          ledgerHead: item.ledger_head,
          ledgerDesc: item.ledger_description,
          ledger_code: item.ledger_code,
          balance: item.current_balance,
        })
      );
      setTableData(tempData);
    }
  }, [ledgerHeadListData, ledgerHeadListSuccess]);

  useEffect(() => {
    if (ledgerHeadListData?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (ledgerHeadListData?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [ledgerHeadListData]);

  // useEffect(() => {
  //   if (id) {
  //     setDisplayData(
  //       ledgerHeadListData ? ledgerHeadListData?.responseData?.results : []
  //     );
  //   } else {
  //     setDisplayData(ledgerHeadListData?.responseData?.results || []);
  //   }
  // }, [id, ledgerHeadListData]);

  // const handleSearch = (data) => {
  //   setId(data.id || "");
  // };

  interface LedgerEntriesTableData {
    sn: number;
    txnDate: string;
    accType: string;
    ledger_code: string;
    accHead: string;
    ledgerHead: string;
    ledgerDesc: string;
    balance: number;
  }

  // export const UnrealizedGainLossTableHeader: ColumnDef<UnrealizedTableData>[] = [

  const ledgerListHeaders: ColumnDef<LedgerEntriesTableData>[] = [
    {
      header: "S. No",
      accessorKey: "sn",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {" "}
            {data.row.original.sn}{" "}
          </Typography>
        );
      },
    },
    {
      header: "Transaction Date",
      accessorKey: "txnDate",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {" "}
            {data.row.original.txnDate.split("T")[0]}{" "}
          </Typography>
        );
      },
    },
    {
      header: "Account Label",
      accessorKey: "accType",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {" "}
            {data.row.original.accType}{" "}
          </Typography>
        );
      },
    },
    {
      header: "Ledger Code",
      accessorKey: "ledger_code",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {" "}
            {data.row.original.ledger_code}{" "}
          </Typography>
        );
      },
    },
    {
      header: "Account Head",
      accessorKey: "accHead",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {" "}
            {data.row.original.accHead}{" "}
          </Typography>
        );
      },
    },
    {
      header: "Ledger Head",
      accessorKey: "ledgerHead",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
          >
            <Link
              to={`/ledger/${data.row.original.ledger_code}/transaction`}
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "#2f84d3",
                textDecoration: "none",
              }}
            >
              {data.row.original.ledgerHead}
            </Link>
          </Typography>
        );
      },
    },
    {
      header: "Current Balance",
      accessorKey: "balance",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "right" }}
          >
            {" "}
            {data.row.original.balance.toLocaleString(undefined,{
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
          </Typography>
        );
      },
    },
  ];

  // const debouncedSetId = useCallback(
  //   debounce((value) => {
  //     setId(value);
  //     setValue("id", value);
  //   }, 500),
  //   [setValue]
  // );

  return (
    <Box>
      <Box sx={{ my: 3 }}>
        <HeaderDesc title="Ledger Entries" />
        <FormControl
            sx={{
              width: "350px",
              mt: 2.5,
            }}
          >
            <Autocomplete
              options={ledgerList ?? []}
              // defaultValue={selectedLedger}
              getOptionLabel={(option) => option.ledger_head}
              onChange={(event, newValue) =>
                setSelectedLedger(newValue?.ledger_code || "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Ledger Head"
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </FormControl>
      </Box>
      {/* <Box
        component="form"
        onSubmit={handleSubmit(handleSearch)}
        sx={{
          width: "100%",
          display: "flex",
          gap: 3,
          marginTop: 2,
          ml: -1,
          mb: 3,
        }}
      >
        <SearchText
          title="Search"
          {...register("id")}
          onChange={(e) => debouncedSetId(e.target.value)}
          onClick={handleSubmit(handleSearch)}
        />

        <RoundedButton title1="Load" onClick1={handleSubmit(handleSearch)} />
      </Box> */}
      {ledgerHeadListData?.responseData?.results?.length > 0 ? (
        <Box
          sx={{
            maxWidth: "1500px",
            width: { md: "110%", lg: "125%", xl: "130%" },
          }}
        >
          <ReceiptTable
            columns={ledgerListHeaders}
            data={tableData}
            pagination={pagination}
            setPagination={setPagination}
            next={next}
            prev={prev}
            pageCount={totalPageCount}
            setPageSize={setPageSize}
          />
        </Box>
      ) : (
        <Box sx={{ width: "120%" }}>
          <ReceiptTable columns={ledgerListHeaders} data={[]} />
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
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LedgerDetailsIndex;
