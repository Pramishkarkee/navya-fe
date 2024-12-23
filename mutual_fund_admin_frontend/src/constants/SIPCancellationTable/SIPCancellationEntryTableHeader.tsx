import { Typography, Box, useTheme } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";

type SIPCancellationHeader = {
  id: number;
  share_holder_number: number;
  full_name: string;
  // boid: number;
  holderType: string;
  // schemeName: string;
  // distributionCenter: string;
  sip_start_date: string,
  amount: string,
  action: any;
};

export const SIPCancellationEntryTableHeader: ColumnDef<SIPCancellationHeader>[] =
  [
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
    // {
    //   header: "BOID",
    //   accessorKey: "boid",
    //   cell: (data) => {
    //     return <Typography>{data.row.original.boid_no}</Typography>;
    //   },
    // },
    {
      header: "Holder Type",
      accessorKey: "holderType",
      cell: () => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}> Individual</Typography>;
      },
    },
    {
      header: "SIP Start Date",
      accessorKey: "",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.sip_start_date}</Typography>;
      },
    },
    {
      header: "Amount",
      accessorKey: "",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}> {data.row.original.amount} </Typography>;
      },
    },

    // {
    //   header: "Scheme Name",
    //   accessorKey: "schemeName",
    //   cell: (data) => {
    //     return <Typography>{data.row.original.schemeName}</Typography>;
    //   },
    // },
    // {
    //   header: "Distriution Center",
    //   accessorKey: "distriutionCenter",
    //   cell: (data) => {
    //     return <Typography>{data.row.original.distribution_center}</Typography>;
    //   },
    // },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: () => {
        const theme = useTheme();



        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 0.6,
              color: theme.palette.primary.fullDarkmainColor,
              "&:hover": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
          >
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>Details</Typography>
          </Box>
        );
      },
    },
  ];