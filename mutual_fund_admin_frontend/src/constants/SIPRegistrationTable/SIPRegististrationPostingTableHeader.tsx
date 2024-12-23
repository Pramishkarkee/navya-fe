import { Box, Button, Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { IndeterminateCheckbox } from "components/Table/PostingTable";
import { Visibility } from "@mui/icons-material";
import { colorTokens } from "../../theme";
import ViewModal from "components/Modal/ViewModal";
import { useState } from "react";

type SIPRegistrationPostingHeaders = {
  SN: number;
  ref_id: string;
  full_name: string;
  time_period: string;
  sip_start_date: string;
  sip_status: string;
  boid_no: string;
  amount: string;
  email: string;
  phone: string;
  citizen_file_path: string;
  sip_end_date: string;
  sip_interval: string;
  sip_model: string;
  actions: any;
  citizen_sip_id: string;
  sip_term_type: string;
  sip_term: string;
};

export const SIPRegistrationPostingTableHeaders: ColumnDef<SIPRegistrationPostingHeaders>[] =
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
      header: "S.No",
      accessorKey: "SN",
      cell: (data) => {
        return (
          <Box>
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
              {data.row.index + 1}
            </Typography>
          </Box>
        );
      },
    },
    {
      header: "SIP Registration No.",
      accessorKey: "ref_id",
      cell: (data) => {
        return (
          <Box>
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.ref_id}</Typography>
          </Box>
        );
      },
    },
    {
      header: "Full Name",
      accessorKey: "full_name",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.full_name}</Typography>;
      },
    },
    {
      header: "BOID",
      accessorKey: "boid_no",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}> {data.row.original.boid_no}</Typography>;
      },
    },
    {
      header: "Time Period",
      accessorKey: "time_period",
      cell: (data) => {
        const { sip_model, sip_term, sip_term_type } = data.row.original;
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {sip_model === "Unlimited"
              ? "Unlimited"
              : `${sip_term} ${sip_term_type}`}
          </Typography>
        );
      },
    },

    {
      header: "Action Date",
      accessorKey: "sip_start_date",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.sip_start_date}</Typography>;
      },
    },

    {
      header: "SIP Amount",
      accessorKey: "amount",
      cell: (data) => {
        return (
          <Typography sx={{ textAlign: "right", width: "80%", fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.amount}
          </Typography>
        );
      },
    },
    {
      header: "SIP Status",
      accessorKey: "sip_status",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.sip_status}</Typography>;
      },
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: (item) => {
        const [open, setOpen] = useState(false);
        const [fileType, setFileType] = useState("");
        const handleView = () => {
          setFileType(item.row.original.citizen_sip_id);
          setOpen(true);
        };

        const data: Record<string, string> = {
          "Registration Number": item.row.original.ref_id,
          BOID: item.row.original.boid_no,
          Name: item.row.original.full_name,
          Email: item.row.original.email,
          "Contact  Number": item.row.original.phone,
          "SIP Start Date": item.row.original.sip_start_date,
          "SIP Model": item.row.original.sip_model,
          "SIP Interval": item.row.original.sip_interval,
          "SIP End Date": item.row.original.sip_end_date,
          // "Payment Mode": "Cash",
          "Entry Date": item.row.original.sip_start_date,
          "Received Amount": item.row.original.amount,
          Citizenship: item.row.original.citizen_file_path,
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
            <ViewModal
              open={open}
              setOpen={setOpen}
              data={data}
              fileType={fileType}
            />
          </>
        );
      },
    },
  ];
