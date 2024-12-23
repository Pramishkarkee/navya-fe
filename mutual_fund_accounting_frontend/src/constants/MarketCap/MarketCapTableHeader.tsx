/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Typography, useTheme } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDeleteMarketCap } from "services/MarketCap/MarketCapService";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import { colorTokens } from "../../theme";
import MarketAndCommissionModal from "components/Modal/MarketAndCommissionModal";

type MarketCapTableHeaders = {
  id: number;
  market_cap: string;
  range_from: string;
  range_to: string;
  created_at: string;
  updated_at: string;
};

export const MarketCapTableColumns: ColumnDef<MarketCapTableHeaders>[] = [
  {
    header: "ID",
    accessorKey: "id",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
          {data.row.original.id}
        </Typography>
      );
    },
  },
  {
    header: "Market Cap",
    accessorKey: "market_cap",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
          {data.row.original.market_cap || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Minimum Range",
    accessorKey: "range_from",
    cell: (data) => {
      return (
        <Typography
          sx={{
            textAlign: "right",
            width: "91px",
            fontSize: "14px",
            fontWeight: "400px",
            // width: { sm: "100%", md: "80%", lg: "25%" },
          }}
        >
          {Number(data.row.original.range_from)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,") || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Maximum Range",
    accessorKey: "range_to",
    cell: (data) => {
      return (
        <Typography
          sx={{
            textAlign: "right",
            width: "93px",
            fontSize: "14px",
            fontWeight: "400px",

            // width: { sm: "100%", md: "100%", lg: "25%" },
          }}
        >
          {Number(data.row.original.range_to)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,") || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: (data) => {
      const [open, setOpen] = useState<boolean>(false);

      const ModalData = {
        "Market Cap Name": data?.row?.original?.market_cap || "N/A",
        "Minimum Range": data?.row?.original?.range_from || "N/A",
        "Maximum Range": data?.row?.original?.range_to || "N/A",
      };

      return (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <ActionCell data={data} />

          {/* <Button
            variant="text"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              color: colorTokens.mainColor[1100],
              fontSize: "14px",
            }}
            onClick={() => {
              setOpen(true);
            }}
          >
            <EditIcon sx={{ fontSize: "1rem" }} />
            Edit
          </Button> */}

          {open && (
            <MarketAndCommissionModal
              open={open}
              setOpen={setOpen}
              desc="Market Cap Details"
              data={ModalData}
              handleUpdateRecord={() => {}}
            />
          )}
        </Box>
      );
    },
  },
];

// eslint-disable-next-line react-refresh/only-export-components
const ActionCell = ({ data }) => {
  const theme = useTheme();
  const [successBarOpen, setSuccessBarOpen] = useState(false);
  const [errorBarOpen, setErrorBarOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { mutate: deleteMarketCap, isSuccess: deleteSuccess } =
    useDeleteMarketCap(data.row.original.id);

  // useEffect(() => {
  //   if (deleteSuccess) {

  //     setTimeout(() => {
  //       setSuccessBarOpen(true);
  //     }, 1000);
  //   }
  // }, [deleteSuccess]);

  const handleDelete = () => {
    setConfirmOpen(true);
  };
  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };
  const handleConfirmDelete = () => {
    const deleteId = data.row.original.id;
    deleteMarketCap(deleteId, {
      onSuccess: () => {
        setConfirmOpen(false);
        setSuccessBarOpen(true);
        // setTimeout(() => {
        //   setSuccessBarOpen(true);
        // }, 1000);
      },
      onError: (error) => {
        setErrorBarOpen(true);
        // console.error("Failed to delete:", error);
      },
    });
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
              {data.row.original.market_cap}?
            </Typography>
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}>
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
          mr: 2,
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
    </>
  );
};

// import React from "react";
// import {  Typography } from "@mui/material";
// import { ColumnDef } from "@tanstack/react-table";
// // import { IndeterminateRadiobox } from "components/Table/PostingTable";

// type MarketCapTableHeaders = {
// id: number,
// market_cap: string,
// range_from: string,
// range_to: string,
// created_at: string,
// updated_at: string,
// };

// export const MarketCapTableColumns: ColumnDef<MarketCapTableHeaders>[] = [
//     {
//         header: " ID",
//         accessorKey: "id",
//         cell: (data) => {
//             return <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.id}</Typography>;
//         },
//     },

//     {
//         header: "Market Cap",
//         accessorKey: "market_cap",
//         cell: (data) => {
//             return (
//                 <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.market_cap}</Typography>
//             );
//         },
//     },
//     {
//         header: "Range From",
//         accessorKey: "range_from",
//         cell: (data) => {
//             return (
//                 <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.range_from}</Typography>
//             );
//         },
//     },
//     {
//         header: "Range To",
//         accessorKey: "range_to",
//         cell: (data) => {
//             return <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.range_to}</Typography>;
//         },
//     },
// ];
