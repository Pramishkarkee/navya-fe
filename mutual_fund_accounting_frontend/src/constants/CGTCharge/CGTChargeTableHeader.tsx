import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteCGTChargeList } from "services/CGTCharge/CGTChargeServices";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";

type CGTChargeTableHeaders = {
  id: number;
  name: string;
  min_range: string;
  max_range: string;
  cgt_rate: string;
};

export const CGTChargeTableColumns: ColumnDef<CGTChargeTableHeaders>[] = [
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
    header: "Name",
    accessorKey: "name",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
          {data.row.original.name || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Minimum Range",
    accessorKey: "min_range",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
          {data.row.original.min_range || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Maximum Range",
    accessorKey: "max_range",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
          {data.row.original.max_range || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "CGT Rate",
    accessorKey: "cgt_rate",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
          {data.row.original.cgt_rate || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: (data) => {
      // const [open, setOpen] = useState<boolean>(false);
      return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <ActionCell data={data} />
        </Box>
      );
    },
  },
];

// eslint-disable-next-line react-refresh/only-export-components
const ActionCell = ({ data }) => {
  const [successBarOpen, setSuccessBarOpen] = useState(false);
  const [errorBarOpen, setErrorBarOpen] = useState(false);

  const { mutate: deleteMarketCap } = useDeleteCGTChargeList(
    data.row.original.id
  );

  const handleDelete = () => {
    const deleteId = data.row.original.id;
    deleteMarketCap(deleteId, {
      onSuccess: () => {
        setSuccessBarOpen(true);
      },
      onError: (error) => {
        setErrorBarOpen(true);
      },
    });
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

      <Box
        onClick={handleDelete}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 0.6,
          "&:hover": {
            textDecoration: "underline",
            cursor: "pointer",
          },
        }}
      >
        <DeleteIcon color="error" sx={{ fontSize: "14px", fontWeight: 600 }} />
        <Typography sx={{ fontSize: "1rem", fontWeight: 600 }}>
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
