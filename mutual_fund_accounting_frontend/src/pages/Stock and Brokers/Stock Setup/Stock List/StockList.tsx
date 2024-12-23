import { Box, Button, Modal, Typography, useTheme } from "@mui/material";
import ReceiptTable from "components/Table/TanstackTable";
// import { StockMappingTableListEntryHeader } from "constants/Stock Mapping/StockMappingTableList";
import SearchText from "components/Button/Search";
// import DownloadButton from "components/Button/DownloadExcel";
import {
  useGetAllStockMappingList,
  useGetStockMappingListDate,
} from "services/Stock Mapping/StockMappingService";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import DateField from "components/DateFilter/DateField";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import DateFormatter from "utils/DateFormatter";
import RoundedButton from "components/Button/Button";
import { useDeleteStockDetails } from "services/Stock Mapping/StockMappingService";
import { ColumnDef } from "@tanstack/react-table";
import EditStockModal from "../EditStockList";
import { Edit } from "@mui/icons-material";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import DeleteIcon from "@mui/icons-material/Delete";
import { Empty } from "antd";
import debounce from "utils/Debounce";

type StockMappingEntry = {
  id: number;
  symbol: number;
  stock_name: string;
  face_value: string;
  price_per_share: string;
  stock_description: string;
  stock_paid_up_capital: string;
  current_units: number;
  effective_rate: number;
  total_investment: number;
  is_stock_listed: boolean;
  txn_scheme_limit: string;
  txn_paid_up_limit: string;
  security_type: string;
};

const DateFormatterUnit = {
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
const schema = yup
  .object({
    startDate: yup.object().required(),
    endDate: yup.object().required(),
    id: yup.number(),
  })
  .required();
export default function StockList() {
  const { control, handleSubmit, register, setValue } = useForm({
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
    },
    resolver: yupResolver(schema),
  });

  const theme = useTheme();
  const [id, setId] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const [loadClicked, setLoadClicked] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);

  const [searchData, setSearchData] = useState({
    from_date: "",
    to_date: "",
  });

  // const {
  //   data: stockMappingData,
  //   // isSuccess: stockMappingDataSuccess,
  //   refetch: refetchStockMapping,
  // } = useGetAllStockMappingList();
  // const { data: stockMappingDataId, isSuccess: stockMappingDataIdSuccess } = useStocMappingListID(id);

  const {
    data: stockMappingListDataByDate,
    isSuccess: stockMappingListByDateSuccess,
    refetch: refetchStockMapping,
  } = useGetStockMappingListDate(
    searchData?.from_date,
    searchData?.to_date,
    pagination.pageIndex + 1,
    id,
    pageSize
  );

  const totalPageCount = Math.ceil(
    stockMappingListDataByDate?.responseData?.count / pageSize
  );

  const handleLoad = (data) => {
    setId(data.id || "");
    if (data?.startDate && data?.endDate) {
      const fromDate = new Date(data?.startDate);
      const toDate = new Date(data?.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatterUnit.format(toDate.toISOString());

      if (formattedFromDate && formattedToDate) {
        setSearchData({
          from_date: formattedFromDate,
          to_date: formattedToDate,
        });
      }
      setLoadClicked(true);
    } else {
      setErrorMsgs("Both start and end dates must be selected.");
      setSnackbarErrorOpen(true);
    }
  };

  useEffect(() => {
    const responseData = stockMappingListDataByDate?.responseData;

    setNext(responseData?.next === null);
    setPrev(responseData?.previous === null);
  }, [stockMappingListDataByDate]);

  useEffect(() => {
    const responseData =
      stockMappingListDataByDate?.responseData?.results ?? [];
    setDisplayData(id ? responseData : responseData);
  }, [id, stockMappingListDataByDate]);

  useEffect(() => {
    refetchStockMapping();

    if (stockMappingListByDateSuccess && loadClicked) {
      const results = stockMappingListDataByDate?.responseData?.results ?? [];
      setDisplayData(results);

      if (results.length === 0) {
        setErrorMsgs("There is no Unit List Available for the given Date.");
        setSnackbarErrorOpen(true);
      }
    }
  }, [
    stockMappingListByDateSuccess,
    loadClicked,
    stockMappingListDataByDate,
    refetchStockMapping,
  ]);

  // const handleSearch = (data) => {
  //     setId(data.id || "");
  // };

  const handleReset = () => {
    setSearchData({
      from_date: "",
      to_date: "",
    });
    setId("");
    setDisplayData(stockMappingListDataByDate);
  };

  // const handleDownloadExcel = () => {
  // };

  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
      setValue("id", value);
    }, 500),
    [setValue]
  );

  const StockMappingTableListEntryHeader: ColumnDef<StockMappingEntry>[] = [
    {
      header: "ID",
      accessorKey: "id",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
          >
            {data?.row?.original?.id}
          </Typography>
        );
      },
    },
    {
      header: "Symbol",
      accessorKey: "symbol",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
          >
            {data?.row?.original?.symbol}
          </Typography>
        );
      },
    },
    {
      header: "Stock Name",
      accessorKey: "stock_name",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
          >
            {data?.row?.original?.stock_name}
          </Typography>
        );
      },
    },
    {
      header: "Security Type",
      accessorKey: "security_type",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
          >
            {data?.row?.original?.security_type === "equity_shares"
              ? "Equity Share"
              : data?.row?.original?.security_type === "mutual_funds"
              ? "Mutual Fund"
              : "Preference Share"
              }
          </Typography>
        );
      },
    },
    {
      header: "Face Value",
      accessorKey: "face_value",
      cell: (data) => {
        return (
          <Typography
            align="right"
            sx={{
              fontSize: "14px",
              fontWeight: "400px",
              width: { sm: "80%", md: "60%", lg: "40%" },
            }}
          >
            {Number(data?.row?.original?.face_value).toLocaleString()}
          </Typography>
        );
      },
    },
    {
      header: "Number of Share",
      accessorKey: "price_per_share",
      cell: (data) => {
        const NumberOfShares =
          Number(data?.row?.original?.stock_paid_up_capital) /
          Number(data?.row?.original?.face_value);
        return (
          <Typography
            align="right"
            sx={{
              fontSize: "14px",
              fontWeight: "400px",
              width: { sm: "80%", md: "60%", lg: "40%" },
            }}
          >
            {Number(NumberOfShares).toLocaleString()}
          </Typography>
        );
      },
    },

    {
      header: "Paid Up Capital",
      accessorKey: "stock_paid_up_capital",
      cell: (data) => {
        return (
          <Typography
            align="right"
            sx={{
              fontSize: "14px",
              fontWeight: "400px",
              width: "88px",
              // width: { sm: "80%", md: "60%", lg: "40%" },
            }}
          >
            {Number(
              data?.row?.original?.stock_paid_up_capital
            ).toLocaleString()}
          </Typography>
        );
      },
    },
    {
      header: "Listed/Unlisted",
      accessorKey: "is_stock_listed",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400px",
              textAlign: "center",
            }}
          >
            {data?.row?.original?.is_stock_listed ? "Listed" : "Unlisted"}
          </Typography>
        );
      },
    },

    {
      header: "Paid Up Capital (%)",
      accessorKey: "txn_paid_up_limit",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400px",
              textAlign: "center",
            }}
          >
            {data?.row?.original?.txn_paid_up_limit}
          </Typography>
        );
      },
    },
    {
      header: "MF Scheme Size (%)",
      accessorKey: "txn_scheme_limit",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400px",
              textAlign: "center",
            }}
          >
            {data?.row?.original?.txn_scheme_limit}
          </Typography>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (data) => {
        const [editOpen, setEditOpen] = useState(false);
        // const theme = useTheme();

        const handleEdit = () => {
          setEditOpen(true);
        };

        const handleSave = (updatedData: StockMappingEntry) => {};

        return (
          <>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <EditStockModal
                open={editOpen}
                setOpen={setEditOpen}
                data={data.row.original}
                onSave={handleSave}
              />

              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box
                  onClick={handleEdit}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 0.2,
                    // color: colorTokens.mainColor[1100],
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  <Edit
                    sx={{
                      fontSize: "16px",
                      color: theme.palette.grey[900],
                      "&:hover": {
                        color: theme.palette.grey[900],
                      },
                    }}
                  />
                  <Typography
                    fontSize="13px"
                    fontWeight={600}
                    sx={{ userSelect: "none" }}
                  >
                    Edit
                  </Typography>
                </Box>
                <ActionCell data={data} />
              </Box>
            </Box>
          </>
        );
      },
    },
  ];

  const ActionCell = ({ data }) => {
    const theme = useTheme();
    const [successBarOpen, setSuccessBarOpen] = useState(false);
    const [errorBarOpen, setErrorBarOpen] = useState(false);
    const [successMsgs, setSuccessMsgs] = useState("");

    const [confirmOpen, setConfirmOpen] = useState(false);

    const { mutate: deleteStockSetup } = useDeleteStockDetails(
      data?.row?.original?.id
    );

    // const handleDelete = () => {
    //   const deleteId = data.row.original.id;
    //   // deleteMarketCap(deleteId, {
    //   //   onSuccess: () => {
    //   //     setSuccessBarOpen(true);
    //   //   },
    //   //   onError: (error) => {
    //   //     setErrorBarOpen(true);
    //   //     console.error("Failed to delete:", error);
    //   //   },
    //   // });
    // };

    const handleDelete = () => {
      setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
      const stock_setup = data?.row?.original?.stock_setup;
      deleteStockSetup(stock_setup, {
        onSuccess: () => {
          setConfirmOpen(false);
          setSuccessBarOpen(true);
          setSuccessMsgs(
            `${data?.row?.original.stock_setup} Deleted successfully`
          );
        },
        onError: (error) => {
          setErrorBarOpen(true);
          console.error("Failed to delete:", error);
        },
      });
    };

    const handleConfirmClose = () => {
      setConfirmOpen(false);
    };

    return (
      <>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
          <SuccessBar
            snackbarOpen={successBarOpen}
            setSnackbarOpen={setSuccessBarOpen}
            message="Deleted Successfully"
          />
          <ErrorBar
            snackbarOpen={errorBarOpen}
            setSnackbarOpen={setErrorBarOpen}
            message="Failed to delete"
          />

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
                  {data.row.original.symbol}?
                </Typography>
              </Typography>
              <Box
                sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}
              >
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
              </Box>
            </Box>
          </Modal>

          <Box
            onClick={handleDelete}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 0.2,
              "&:hover": {
                // textDecoration: "underline",
                cursor: "pointer",
              },
            }}
          >
            <DeleteIcon color="error" sx={{ fontSize: "14px" }} />
            <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
              Delete
            </Typography>
          </Box>
        </Box>
      </>
    );
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 1 }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          component="form"
          onSubmit={handleSubmit(handleLoad)}
          sx={{ width: "100%", display: "flex", gap: 3, marginTop: 1, ml: -1 }}
        >
          <SearchText
            title="Search"
            {...register("id")}
            onChange={(e) => debouncedSetId(e.target.value)}
            onClick={handleSubmit(handleLoad)}
          />
          <Box sx={{ mt: -2 }}>
            <DateField
              control={control}
              dateLabel1="Date (From)"
              dateLabel2="Date (To)"
            />
          </Box>
          <RoundedButton title1="Load" onClick1={handleSubmit(handleLoad)} />
        </Box>

        {/* <Box sx={{ marginLeft: "auto", marginRight: -50 ,}}>
                    <DownloadButton onClick={handleDownloadExcel} />
                </Box> */}
      </Box>
      <Box>
        {displayData?.length > 0 ? (
          <Box
            sx={{
              maxWidth: "1500px",
              width: { md: "110%", lg: "120%", xl: "125%" },
            }}
          >
            <ReceiptTable
              columns={StockMappingTableListEntryHeader}
              data={displayData}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
              pageCount={totalPageCount}
              setPageSize={setPageSize}
            />
          </Box>
        ) : (
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
            <Empty
              imageStyle={{ height: 150, width: 150 }}
              description="No Data Available"
            />
            <Typography
              onClick={handleReset}
              sx={{
                color: theme.palette.primary[1100],
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reset Filters
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
