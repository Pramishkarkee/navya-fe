import { Typography, Box } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { IndeterminateCheckbox } from "components/Table/PostingTable";
import { useState } from "react";
import { Visibility } from "@mui/icons-material";
import ViewModal from "components/Modal/ViewModal";
import { colorTokens } from "../../theme";

type UnitTransactionPosting = {
  // reqNo: number;
  boid_number: number;
  full_name: string;
  email: string;
  distribution_center: string;
  nav: number;
  applied_units: number;
  amount: number;
  actions: any;
};

export const UnitTransactionPostingTableHeader: ColumnDef<UnitTransactionPosting>[] =
  [
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
    {
      header: "Email",
      accessorKey: "email",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.email}</Typography>;
      },
    },
    {
      header: "Distribution Center",
      accessorKey: "distribution_center",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.distribution_center}</Typography>;
      },
    },
    {
      header: "NAV",
      accessorKey: "nav",
      cell: () => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>Hello</Typography>;
      },
    },
    {
      header: "Applied Units",
      accessorKey: "applied_units",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.applied_units}</Typography>;
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.amount}</Typography>;
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: () => {
        const [open, setOpen] = useState(false);

        const handleView = () => {
          setOpen(true);
        };

        const data: Record<string, string> = {
          "Registration Number": "Rs 100",
          BOID: "Rs 100",
          Name: "Rs 100",
          Email: "Rs 100",
          "Contact  Number": "Rs 100",
          "Vendor Transaction ID": "Rs 100",
          "Payment Mode": "Rs 100",
          "Entry Date": "Rs 100",
          "Interval Sequence Number": "Rs 100",
          "Received Amount": "Rs 100",
          "Citizenship Number": "Rs 100",
          "Transaction Status": "Rs 100",
        };

        return (
          <>
            <ViewModal open={open} setOpen={setOpen} data={data} />
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
