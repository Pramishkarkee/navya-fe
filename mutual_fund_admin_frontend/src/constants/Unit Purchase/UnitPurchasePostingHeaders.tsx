import { ColumnDef } from "@tanstack/react-table";
import { Box, Typography } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { IndeterminateCheckbox } from "components/Table/PostingTable";
import { useState } from "react";
import ViewModal from "components/Modal/ViewModal";
import { colorTokens } from "../../theme";
import DateFormatter from "utils/DateFormatter";

type PostingHeaders = {
  // reqNo: number;
  boid_number: string;
  full_name: string;
  email: string;
  distribution_center: string;
  purchased_nav_value: number;
  applied_units: string;
  amount: string;
  actions: any;
  contact_number: string;
  share_holder_number: string;
  created_at: string;
};
export const UnitPurchasePostingHeader: ColumnDef<PostingHeaders>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <div className="px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  },
  // {
  //   header: "Req No",
  //   accessorKey: "reqNo",
  //   cell: () => {
  //     // console.log(data);
  //     return <Typography>Hello</Typography>;
  //   },
  // },
  {
    header: "BOID",
    accessorKey: "boid_number",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.boid_number}</Typography>;
    },
  },
  {
    header: "Name",
    accessorKey: "full_name",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.full_name}</Typography>;
    },
  },
  // {
  //   header: "Email",
  //   accessorKey: "email",
  //   cell: (data) => {
  //     return <Typography>{data.row.original.email}</Typography>;
  //   },
  // },
  // {
  //   header: "Distribution Center",
  //   accessorKey: "distribution_center",
  //   cell: (data) => {
  //     return <Typography>{data.row.original.distribution_center}</Typography>;
  //   },
  // },
  {
    header: "NAV",
    accessorKey: "purchased_nav_value",
    cell: (data) => {
      return (
        <Typography textAlign="right" width="40%" sx={{ fontSize: "14px", fontWeight: 400 }}>
          {data.row.original.purchased_nav_value ?? "-"}
        </Typography>
      );
    },
  },
  {
    header: "Applied Units",
    accessorKey: "applied_units",
    cell: (data) => {
      return (
        <Typography textAlign="right" width="50%" sx={{ fontSize: "14px", fontWeight: 400 }}>
          {Number(data?.row?.original?.applied_units)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
        </Typography>
      );
    },
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: (data) => {
      return (
        <Typography textAlign="right" width="60%" sx={{ fontSize: "14px", fontWeight: 400 }}>
          {Number(data?.row?.original?.amount)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
        </Typography>
      );
    },
  },
  {
    header: "Purchase Date",
    accessorKey: "purchase_date",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
          {DateFormatter.format(data.row.original.created_at)}
        </Typography>
      );
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: (data) => {
      const [open, setOpen] = useState(false);

      const handleView = () => {
        setOpen(true);
        // console.log(data);
      };

      const modalData: Record<string, string> = {
        // "Registration Number": data.row.original.,
        BOID: data.row.original.boid_number,
        Name: data.row.original.full_name,
        Email: data.row.original.email,
        "Contact  Number": data.row.original.contact_number,
        // "Vendor Transaction ID": "Rs 100",
        // "Payment Mode": "Rs 100",
        // "Entry Date": data.row.original.,
        // "Interval Sequence Number": "Rs 100",
        "Received Amount": data.row.original.amount,
        "Applied Units": data.row.original.applied_units,
        "Share Holder Number": data.row.original.share_holder_number,
        // "Citizenship Number": "Rs 100",
        // "Transaction Status": "Rs 100",
      };

      return (
        <>
          <ViewModal open={open} setOpen={setOpen} data={modalData} />
          <Box
            onClick={handleView}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 0.6,
              color: colorTokens.mainColor[1100],
              "&:hover": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
          >
            <Visibility sx={{ fontSize: "14px", fontWeight: 400 }} />
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>View</Typography>
          </Box>
        </>
      );
    },
  },
];