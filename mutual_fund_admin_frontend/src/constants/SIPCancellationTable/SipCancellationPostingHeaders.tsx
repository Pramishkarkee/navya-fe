import { Typography, Box, useTheme } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import ViewModal from "components/Modal/ViewModal";
import { IndeterminateCheckbox } from "components/Table/PostingTable";
import { colorTokens } from "../../theme";
import { useState } from "react";

type SIPCancellationHeader = {
  id: number;
  share_holder_number: number;
  full_name: string;
  boid_no: string;
  holderType: string;
  sip_start_date: string;
  amount: string;
  action: any;
  email: string;
  phone: string;
  sip_status: string;
  applied_unit: string;
  scheme_name: string;
  sip_interval: string;
  sip_model: string;
  updated_at: string;
  time_period: string;
  sip_end_date: string;
  remarks: string;
  portal: string;
};

export const SipCancellationPostingHeaders: ColumnDef<SIPCancellationHeader>[] =
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
      header: "SIP No.",
      accessorKey: "sipNo",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.id}</Typography>;
      },
    },
    {
      header: "Holder Number",
      accessorKey: "holderNumber",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.share_holder_number}</Typography>;
      },
    },
    {
      header: "Name",
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
      header: "Holder Type",
      accessorKey: "holderType",
      cell: () => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}> Individual</Typography>;
      },
    },
    {
      header: "SIP Start Date",
      accessorKey: "sip_start_date",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.sip_start_date}</Typography>;
      },
    },
    {
      header: "SIP Cancelled Date",
      accessorKey: "updated_at",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.updated_at.split("T")[0]}</Typography>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}> {data.row.original.amount} </Typography>;
      },
    },

    {
      header: "Actions",
      accessorKey: "actions",
      cell: (data) => {
        const theme = useTheme();
        const [open, setOpen] = useState(false);

        const handleView = () => {
          setOpen(true);
          // console.log(data)
        };
        const modalData: Record<string, string> = {
          "Share Holder Number": data.row.original.share_holder_number.toString(),
          BOID: data.row.original.boid_no,
          "Scheme Name": data.row.original.scheme_name,
          "SIP Status": data.row.original.sip_status,
          Name: data.row.original.full_name,
          "SIP Entry Date": data.row.original.sip_start_date,
          "Applied Units": data.row.original.applied_unit,
          Amount: data.row.original.amount,
          Email: data.row.original.email,
          "Phone Number ": data.row.original.phone,
          "SIP Model": data.row.original.sip_model,
          "SIP Interval": data.row.original.sip_model === "Limited" ? data.row.original.sip_interval : "-",
          "SIP Time Period": data.row.original.sip_model === "Limited" ? data.row.original.time_period : "-",
          "SIP End Date": data.row.original.sip_model === "Limited" ? data.row.original.sip_end_date  : "-",
          "Remarks": data.row.original.remarks,
          "Portal": data.row.original.portal === "Online" ? "Online" : "Counter",


    
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
                justifyContent: "flex-start",
                gap: 0.6,
                // color: theme.palette.primary.fullDarkmainColor,
                color: colorTokens.mainColor[1100],
                "&:hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
            >
              <Typography sx={{ fontSize: "14px", color: theme.palette.primary.fullDarkmainColor, fontWeight: 600 }}>Details</Typography>
            </Box>
          </>
        );
      },
    },
  ];