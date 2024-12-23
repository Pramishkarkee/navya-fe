import React, { 
  // useCallback,
   useEffect, useState } from "react";

import { Autocomplete, Box, Button, FormControl, Modal, TextField, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ReceiptTable from "components/Table/TanstackTable";
import {
  useGetSubLedgerHeadList,
  useDeleteSubLedger,
} from "services/SubLedgerHeadServices";
import {
  useGetSubLedgerList,
} from "services/Reporting/SubLedgerDetails/SubLedgerDetailsServices";

import { PaginationState } from "@tanstack/react-table";
import { Empty } from "antd";
// import { useForm } from "react-hook-form";
// import RoundedButton from "components/Button/Button";
// import SearchText from "components/Button/Search";
import { 
  // Delete,
  Edit, 
  Visibility } from "@mui/icons-material";
import ErrorBar from "components/Snackbar/ErrorBar";
import SuccessBar from "components/Snackbar/SuccessBar";
import EditSubLedgerModal from "pages/GL Account/Ledger Details/EditSubLedgerModule";
import ViewModal from "components/Modal/ViewModal";
// import { colorTokens } from "src/theme";

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
  const theme = useTheme();
  // const { 
    // control, 
    // handleSubmit,
    // register, 
    // setValue 
  // } = useForm({
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
  const [subLedgerList, setSubLedgerList] = useState([]);
  const [selectedSubLedger, setSelectedSubLedger] = useState("");

  const { data: ledgerHeadListData, isSuccess: ledgerHeadListSuccess } =
    useGetSubLedgerHeadList(pagination.pageIndex + 1, pageSize, selectedSubLedger);

  const { data: subLedgerListData } = useGetSubLedgerList();

  const totalPageCount = Math.ceil(
    ledgerHeadListData?.responseData.count / pageSize
  );

  useEffect(() => {
    const subLedgerList = subLedgerListData?.responseData?.map((item) => ({
      sub_ledger_head: item.sub_ledger_head,
      sub_ledger_code: item.sub_ledger_code,
    }));
    setSubLedgerList(subLedgerList);
  }, [subLedgerListData]);

  useEffect(() => {
    if (ledgerHeadListSuccess) {
      const tempData = ledgerHeadListData?.responseData?.results?.map(
        (item) => ({
          id: item.id,
          account_label: item.account_type_label,
          sub_ledger_description: item.sub_ledger_description,
          ledger_head: item.ledger_head_label,
          sub_ledger_head: item.sub_ledger_head,
          sub_ledger_code: item.sub_ledger_code,
          account_head_label: item.account_head_label,
          account_head_code: item.account_head_code,
          sub_ledger_opening_date: item.sub_ledger_opening_date,
          created: item.created_at,
          updated_at: item.updated_at,
          ledger_head_code: item.ledger_head_code,
          current_balance: item.current_balance,
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

  const ledgerListHeaders = [
    {
      header: "SN",
      accessorKey: "sn",
      cell: (data) => {
        return (
          <Typography
            sx={{ fontSize: "14px", fontWeight: 400, textAlign: "center" }}
          >
            {data.row.index + 1}
          </Typography>
        );
      },
    },
    {
      header: "Account Type",
      accessorKey: "account_label",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {" "}
            {data.row.original.account_label}{" "}
          </Typography>
        );
      },
    },
    {
      header: "Account Head Label",
      accessorKey: "account_head_label",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {" "}
            {data.row.original.account_head_label}{" "}
          </Typography>
        );
      },
    },
    {
      header: "Ledger Head",
      accessorKey: "ledger_head",
      cell: (data) => {
        return (
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Link
              to={`/ledger/${data.row.original.ledger_head_code}/transaction`}
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "#2f84d3",
                textDecoration: "none",
              }}
            >
              {data.row.original.ledger_head}
            </Link>
          </Box>
        );
      },
    },

    {
      header: "Sub Ledger code",
      accessorKey: "sub_ledger_code",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {" "}
            {data.row.original.sub_ledger_code}{" "}
          </Typography>
        );
      },
    },
    {
      header: "Sub Ledger Head",
      accessorKey: "sub_ledger_head",
      cell: (data) => {
        return (
          // <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
          //   {" "}
          //   {data.row.original.sub_ledger_head}{" "}
          // </Typography>
          <Box sx={{ display: "flex", alignItems: "flex-start", p:"10px" }}>
            <Link
              to={`/sub-ledger/${data.row.original.sub_ledger_code}/transaction`}
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "#2f84d3",
                textDecoration: "none",
              }}
            >
              {data.row.original.sub_ledger_head}
            </Link>
          </Box>
        );
      },
    },
    {
      header: "Current Balance",
      accessorKey: "current_balance",
      cell: (data) => {
        return (
          <Typography
            style={{}}
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              textAlign: "right",
              mr: {
                // sm : 2,
                md: 6,
                lg: 6,
              },
              // xl : 10
              // display: "flex", justifyContent: "flex-end", width: "0px", fontSize: "14px", fontWeight: 400, mr: 1 , ml: 10
            }}
          >
            {" "}
            {data.row.original.current_balance
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")}{" "}
          </Typography>
        );
        // return <Typography> {10000000} </Typography>;
      },
    },

    {
      header: "Action",
      accessorKey: "action",
      cell: (data) => {
        return (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "400px",
                ml: 2,
              }}
            >
              <ActionCell data={data} />
            </Box>
          </>
        );
      },
    },
  ];

  const ActionCell = ({ data }) => {
    const [editOpen, setEditOpen] = useState(false);
    const [successBarOpen, setSuccessBarOpen] = useState(false);
    const [errorBarOpen, setErrorBarOpen] = useState(false);

    const [open, setOpen] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState(false);

    const { mutate: deleteMutualSetup } = useDeleteSubLedger(
      data.row.original.id
    );

    // const handleDelete = () => {
    //   setConfirmDelete(true);
    // };

    const handleConfirmClose = () => {
      setConfirmDelete(false);
    };

    const handleConfirmDelete = () => {
      const deleteId = data.row.original.sn;
      deleteMutualSetup(deleteId, {
        onSuccess: () => {
          setConfirmDelete(false);
          setSuccessBarOpen(true);
        },
        onError: () => {
          setErrorBarOpen(true);
        },
      });
    };
    const handleEdit = () => {
      // handleSave(data.row.original);
      setEditOpen(true);
    };

    // const handleSave = (updatedData: MutualFundEntry) => {
    const handleSave = () => {};

    const handleView = () => {
      setOpen(true);
    };

    const modalData: Record<string, string> = {
      "Account Type": data.row.original.account_label,
      "Account Head Code": data.row.original.account_head_code,

      "Account Head": data.row.original.account_head_label,
      "Ledger Head Code": data.row.original.ledger_head_code,

      "Ledger Head ": data.row.original.ledger_head,
      "Sub-Ledger Code": data.row.original.sub_ledger_code,

      "Sub-Ledger Head": data.row.original.sub_ledger_head,
      "Sub-Ledger Description": data.row.original.sub_ledger_description,

      "Created Date": data.row.original.created.split("T")[0],
      "Sub-Ledger Opening Date":
        data.row.original.sub_ledger_opening_date.split("T")[0],

      "Updated Date": data.row.original.updated_at.split("T")[0],
      // "Current Balance": data.row.original.current_balance === null ? "0.00" : data.row.original.current_balance,
      "Current Balance": data.row.original.current_balance
        ? Number(data.row.original.current_balance)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        : "-",
    };

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
        <ViewModal open={open} setOpen={setOpen} data={modalData} />
        <Box>
          <EditSubLedgerModal
            open={editOpen}
            setOpen={setEditOpen}
            data={data.row.original}
            onSave={handleSave}
          />
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1, ml: 2 }}>
            <Box
              onClick={handleView}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 0.2,
                // color: theme.palette.secondary.main,
                color: theme.palette.primary[1100],
                "&:hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
            >
              <Visibility sx={{ fontSize: "14px", fontWeight: "bold" }} />
              <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                View
              </Typography>
            </Box>

            <Box
              onClick={handleEdit}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 0.1,
                // color: theme.palette.secondary.main,
                // color: theme.palette.primary[1100],
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

            <Modal open={confirmDelete} onClose={handleConfirmClose}>
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
                    {data.row.original.sub_ledger_head} ?
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
                {/* <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleConfirmDelete()}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={handleConfirmClose}
                  >
                    Cancel
                  </Button>
                </Box> */}
              </Box>
            </Modal>

            {/* <Box
              onClick={handleDelete}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 0.1,
                // color: theme.palette.secondary.main,
                // color: theme.palette.primary[1100],
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              <Delete color="error" sx={{ fontSize: "14px" }} />
              <Typography
                fontSize="14px"
                fontWeight={600}
                sx={{ userSelect: "none" }}
              >
                Delete
              </Typography>
            </Box> */}

            {/* <Box
              onClick={handleEdit}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 0.6,
                // color: theme.palette.secondary.main,
                color: theme.palette.primary[1100],
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              <Edit sx={{ fontSize: "0.85rem" }} />
              <Typography
                fontSize="0.85rem"
                fontWeight={600}
                sx={{ userSelect: "none" }}
              >
                Edit
              </Typography>
            </Box>
            <Modal open={confirmDelete} onClose={handleConfirmClose}>
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
                  Are you sure you want to Delete{" "}
                  {data.row.original.sub_ledger_head} ?
                </Typography>
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleConfirmDelete()}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={handleConfirmClose}
                  >
                    Cancel
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
                gap: 0.6,
                // color: theme.palette.secondary.main,
                color: theme.palette.primary[1100],
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              <Delete sx={{ fontSize: "0.85rem" }} />
              <Typography
                fontSize="0.85rem"
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

  // const debouncedSetId = useCallback(
  //   debounce((value) => {
  //     setId(value);
  //     setValue("id", value);
  //   }, 500),
  //   [setValue]
  // );

  return (
    <Box sx={{ width: "120%" }}>
      <Box sx={{ my: 3 }}>
        <HeaderDesc title="Sub-Ledger Entries" />

        <FormControl
            sx={{
              width: "350px",
              mt: 2.5,
            }}
          >
            <Autocomplete
              options={subLedgerList ?? []}
              // defaultValue={selectedLedger}
              getOptionLabel={(option) => option.sub_ledger_head}
              onChange={(event, newValue) =>
                setSelectedSubLedger(newValue?.sub_ledger_code || "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Sub-Ledger Head"
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
            width: { xl: "110%", lg: "105%", md: "90%" },
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
        <Box sx={{ width: "100%" }}>
          <ReceiptTable
            columns={ledgerListHeaders}
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
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              ml: { md: 5, lg: 20 },
              mt: 5,
            }}
          >
            {/* <CloudRoundedIcon sx={{ color: "#E0E0E0", fontSize: "12rem" }} /> */}
            <Empty imageStyle={{}} description="No Data Available" />
            {/* <Typography>No Data Available</Typography> */}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LedgerDetailsIndex;
