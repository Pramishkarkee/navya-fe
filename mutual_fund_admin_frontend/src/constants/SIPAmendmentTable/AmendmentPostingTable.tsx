import { ColumnDef } from "@tanstack/react-table";
import { IndeterminateCheckbox } from "components/Table/PostingTable";
import { Typography, Box } from "@mui/material";
import { colorTokens } from "../../theme";
import { Visibility } from "@mui/icons-material";
import ViewModal from "components/Modal/ViewModal";
import { useState } from "react";

type AmendmentPostingHeader = {
  id: number;
  boid_no: string;
  share_holder_number: string;
  full_name: string;
  email: string;
  phone: string;
  scheme_name: string;
  applied_unit: string;
  sip_start_date: string;
  sip_end_date: string;
  sip_model: string;
  sip_term_type: string;
  sip_term: string;
  sip_interval: string;
  time_period: string;
  amount: string;
  ref_id: string;
  actions: any;
};

export const AmendmentPostingTableHeaders: ColumnDef<AmendmentPostingHeader>[] =
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
    {
      header: "Reference ID",
      accessorKey: "ref_id",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.ref_id}</Typography>;
      },
    },
    {
      header: "Amendment No",
      accessorKey: "amendmentNo",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.id}</Typography>;
      },
    },
    {
      header: "Full Name",
      accessorKey: "name",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.full_name}</Typography>;
      },
    },
    {
      header: "BOID",
      accessorKey: "boid",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.boid_no}</Typography>;
      },
    },

    {
      header: "Applied Units",
      accessorKey: "appliedUnits",
      cell: (data) => {
        return (
          <Typography textAlign="right" width="65%" sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.applied_unit}
          </Typography>
        );
      },
    },
    {
      header: "Applied Date",
      accessorKey: "appliedDate",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.sip_start_date}</Typography>;
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (data) => {
        return (
          <Typography textAlign="right" width="65%" sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.amount}
          </Typography>
        );
      },
    },

    {
      header: "Action",
      accessorKey: "actions",
      cell: (cellData) => {
        // console.log(data);
        const [open, setOpen] = useState(false);
        const handleView = () => {
          setOpen(true);
        };

        const data: Record<string, string> = {
          ReferenceId: cellData.row.original.ref_id,
          "Share Holder Number": cellData.row.original.share_holder_number,
          BOID: cellData.row.original.boid_no,
          Fullname: cellData.row.original.full_name,
          Email: cellData.row.original.email,
          PhoneNo: cellData.row.original.phone,
          Amount: cellData.row.original.amount,
          "Applied Unit": cellData.row.original.applied_unit,
          "Scheme Name": cellData.row.original.scheme_name,
          "SIP Interval": cellData.row.original.sip_interval,
          "SIP Model": cellData.row.original.sip_model,
          "Time Period": cellData.row.original.sip_model === "Limited" ? `${cellData.row.original.time_period} ${cellData.row.original.sip_term_type}` : "-",
          "SIP Start Date": cellData.row.original.sip_start_date,
          "SIP End Date": cellData.row.original.sip_model === "Limited" ? cellData.row.original.sip_end_date : "-",
          // "SIP Term Type": cellData.row.original.sip_term_type,
          // "SIP Term": cellData.row.original.sip_term,
        };

        return (
          <>
            <Box
              onClick={handleView}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 0.4,
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
            <ViewModal open={open} setOpen={setOpen} data={data} />
          </>
        );
      },
    },
  ];