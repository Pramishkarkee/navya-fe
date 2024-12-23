/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteCommissionRate } from "services/CommissionRate/CommissionRate";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import EditIcon from "@mui/icons-material/Edit";
import { colorTokens } from "../../theme";
import MarketAndCommissionModal from "components/Modal/MarketAndCommissionModal";
import { useTheme } from "@mui/material";

type CommissionTableHeaders = {
  id: number;
  share_types: string;
  min_range: number;
  max_range: number;
  commission_rate: string;
};

export const CommissionRateTableColumns: ColumnDef<CommissionTableHeaders>[] = [
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
  // {
  //   header: "Security Type",
  //   accessorKey: "share_types",
  //   cell: (data) => {
  //     return <Typography>{data.row.original.share_types}</Typography>;
  //   },
  // },
  {
    header: "Security Type",
    accessorKey: "share_types",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
          {data.row.original.share_types === "mutual_funds"
            ? "Mutual Funds"
            : data.row.original.share_types === "corporate_debentures"
            ? "Corporate Debentures"
            : data.row.original.share_types === "equity_shares"
            ? "Equity Shares"
            : data.row.original.share_types === "government_bonds"
            ? "Government Bonds"
            : data.row.original.share_types === "preference_shares"
            ? "Preference Shares"
            : data.row.original.share_types}
        </Typography>
      );
    },
  },
  {
    header: "Minimum Range",
    accessorKey: "min_range",
    cell: (data) => {
      return (
        <Typography
          sx={{
            textAlign: "right",
            width: "91px",
            fontSize: "14px",
            fontWeight: "400px",

            // width: { sm: "100%", md: "100%", lg: "35%" },
          }}
        >
          {data.row.original.min_range
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
        </Typography>
      );
    },
  },
  {
    header: "Maximum Range",
    accessorKey: "max_range",
    cell: (data) => {
      return (
        <Typography
          sx={{
            textAlign: "right",
            width: "95px",
            fontSize: "14px",
            fontWeight: "400px",

            // width: { sm: "100%", md: "100%", lg: "35%" },
          }}
        >
          {data.row.original.max_range
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
        </Typography>
      );
    },
  },
  {
    header: "Commission Rate (%)",
    accessorKey: "commission_rate",
    cell: (data) => {
      return (
        <Typography
          sx={{
            textAlign: "right",
            width: "98px",
            fontSize: "14px",
            fontWeight: "400px",

            //  width: { sm: "100%", md: "100%", lg: "35%" },
          }}
        >
          {Number(data.row.original.commission_rate).toFixed(2)}
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
        "Security Type": data?.row?.original?.share_types,
        "Minimum Range": data?.row?.original?.min_range,
        "Maximum Range": data?.row?.original?.max_range,
        "Commission Rate (%)": data?.row?.original?.commission_rate,
      };

      return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
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
              desc="Commission Rate Details"
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

  const { mutate: deleteCommissionRate } = useDeleteCommissionRate(
    data.row.original.id
  );

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    const deleteId = data.row.original.id;
    deleteCommissionRate(deleteId, {
      onSuccess: () => {
        setConfirmOpen(false);
        setSuccessBarOpen(true);
      },
      onError: (error) => {
        setErrorBarOpen(true);
      },
    });
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  return (
    <>
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
            {
              <Typography sx={{ fontWeight: 500 }}>
                {data.row.original.share_types === "mutual_funds"
                  ? "Mutual Funds"
                  : data.row.original.share_types === "corporate_debentures"
                  ? "Corporate Debentures"
                  : data.row.original.share_types === "equity_shares"
                  ? "Equity Shares"
                  : data.row.original.share_types === "government_bonds"
                  ? "Government Bonds"
                  : data.row.original.share_types === "preference_shares"
                  ? "Preference Shares"
                  : data.row.original.share_types}
                ?
              </Typography>
            }
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
          {/* <Box sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}>
                      <Button variant="contained" color="error" onClick={() => handleConfirmDelete()}>
                        Confirm
                      </Button>
                      <Button variant="contained" color="inherit" onClick={handleConfirmClose}>
                        Cancel
                      </Button>
                    </Box> */}
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
    </>
  );
};

// import React, { useState } from "react";
// import { Box, Typography } from "@mui/material";
// import { ColumnDef } from "@tanstack/react-table";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useDeleteCommissionRate } from "services/CommissionRate/CommissionRate";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import ErrorBar from "components/Snackbar/ErrorBar";

// type CommissionTableHeaders = {
//   id: number;
//   share_types: string;
//   min_range: string;
//   max_range: string;
//   commission_rate: string;
// };

// export const DividentSettlementTableColumns: ColumnDef<CommissionTableHeaders>[] = [
//   {
//     header: "ID",
//     accessorKey: "id",
//     cell: (data) => {
//       return <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.id}</Typography>;
//     },
//   },
//   {
//     header: "Share Type",
//     accessorKey: "share_types",
//     cell: (data) => {
//       return <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.share_types}</Typography>;
//     },
//   },
//   {
//     header: "Minimum Range",
//     accessorKey: "min_range",
//     cell: (data) => {
//       return <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.min_range}</Typography>;
//     },
//   },
//   {
//     header: "Maximum Range",
//     accessorKey: "max_range",
//     cell: (data) => {
//       return <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.max_range}</Typography>;
//     },
//   },
//   {
//     header: "Commission Rate",
//     accessorKey: "commission_rate",
//     cell: (data) => {
//       return <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.commission_rate}</Typography>;
//     },
//   },
//   {
//     header: "Actions",
//     accessorKey: "actions",
//     cell: (data) => {
//       return <ActionCell data={data}
//         />;
//     },
//   },
// ];

// const ActionCell = ({ data }) => {
//   const [deleteId, setDeleteId] = useState<number | null>(null);

//   const [successBarOpen , setSuccessBarOpen] = useState(false);
//   const [errorBarOpen , setErrorBarOpen] = useState(false);

//   const { mutate: deleteCommissionRate } = useDeleteCommissionRate( deleteId);

//   const handleDelete = () => {
//     setDeleteId(data.row.original.id);
//     deleteCommissionRate(data.row.original.id, {
//       onSuccess: () => {
//         setSuccessBarOpen(true);
//         console.log("Deleted successfully");
//       },
//       onError: (error) => {
//         setErrorBarOpen(true);
//         console.error("Failed to delete:", error);
//       },
//     });
//   };

//   return (
//     <>
//     <SuccessBar
//     snackbarOpen={successBarOpen}
//     setSnackbarOpen={setSuccessBarOpen}
//     message="Deleted Successfully"
//     />
//     <ErrorBar
//     snackbarOpen={errorBarOpen}
//     setSnackbarOpen={setErrorBarOpen}
//     message="Failed to delete"
//     />

//     <Box
//       onClick={handleDelete}
//       sx={{
//         display: "flex",
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 0.6,
//         "&:hover": {
//           textDecoration: "underline",
//           cursor: "pointer",
//         },
//       }}
//     >
//       <DeleteIcon sx={{ fontSize: "0.9rem" }} />
//       <Typography sx={{ fontSize: "1rem" }}>Delete</Typography>
//     </Box>
//     </>
//   );
// };

// import React, { useState } from "react";
// import {  Box, Typography } from "@mui/material";
// import { ColumnDef } from "@tanstack/react-table";
// // import BankDetailsModal from "components/Modal/BankDetailsModal";
// // import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// // import { IndeterminateRadiobox } from "components/Table/PostingTable";
// import { useDeleteCommissionRate } from "services/CommissionRate/CommissionRate";

// type CommissionTableHeaders = {
//     id: number,
//     share_types: string,
//     min_range: string,
//     max_range: string,
//     commission_rate: string,
// };

// export const DividentSettlementTableColumns: ColumnDef<CommissionTableHeaders>[] = [
//     {
//         header: " ID",
//         accessorKey: "id",
//         cell: (data) => {
//             return <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.id}</Typography>;
//         },
//     },

//     {
//         header: "Share Type",
//         accessorKey: "share_types",
//         cell: (data) => {
//             return (
//                 <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.share_types}</Typography>
//             );
//         },
//     },
//     {
//         header: "Minimum Range",
//         accessorKey: "min_range",
//         cell: (data) => {
//             return (
//                 <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.min_range}</Typography>
//             );
//         },
//     },
//     {
//         header: "Maximum Range",
//         accessorKey: "max_range",
//         cell: (data) => {
//             return <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.max_range}</Typography>;
//         },
//     },
//     {
//         header: "Commission Rate",
//         accessorKey: "commission_rate",
//         cell: (data) => {
//             return <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.commission_rate}</Typography>;
//         },
//     },
//     {
//         header: "Actions",
//         accessorKey: "actions",
//         cell: (data) => {
//     //   const [open, setOpen] = useState(false);
//          const [id , setId] = useState<number>(0);

//         const { data:  useCancelFixedDeposit} = useDeleteCommissionRate(id);

//         id = data.row.original.id;
//         setId(id);

//           const handleView = () => {
//             console.log("delete");
//           };
//           return (
//             <>
//               <Box
//                 onClick={handleView}
//                 sx={{
//                   display: "flex",
//                   flexDirection: "row",
//                   alignItems: "center",
//                   gap: 0.6,
//                 //   color: colorTokens.mainColor[1100],
//                   "&:hover": {
//                     textDecoration: "underline",
//                     cursor: "pointer",
//                   },
//                 }}
//               >
//                 <DeleteIcon sx={{ fontSize: "0.9rem" }} />
//                 <Typography sx={{ fontSize: "1rem" }}>Delete</Typography>
//               </Box>
//             </>
//           );
//         },
//       },
// ];
