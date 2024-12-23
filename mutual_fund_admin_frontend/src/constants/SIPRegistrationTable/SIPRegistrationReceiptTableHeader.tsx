import { Box, Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { colorTokens } from "../../theme";
import ReceiptIcon from "../../assets/Receipt.svg";
import { useState } from "react";
import SuccessBar from "components/Snackbar/SuccessBar";
import { Visibility } from "@mui/icons-material";
import ViewModal from "components/Modal/ViewModal";
import Auth from "utils/Auth";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

type SIPRegistrationReceiptHeaders = {
  // SN: number;
  id: number;
  ref_id: string;
  full_name: string;
  time_period: string;
  sip_start_date: string;
  boid_no: number;
  amount: number;
  sip_status: string;
  actions: any;
  sip_identifier: string;
};

export const SIPRegistrationReceiptTableHeaders: ColumnDef<SIPRegistrationReceiptHeaders>[] =
  [
    {
      header: "S.No",
      accessorKey: "SN",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}> {data.row.index + 1}</Typography>;
      },
    },
    {
      header: "Registration No",
      accessorKey: "ref_id",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.ref_id}</Typography>;
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
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.boid_no}</Typography>;
      },
    },
    {
      header: "Time Period",
      accessorKey: "time_period",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.time_period?.split(" ")[0]
              ? data.row.original.time_period
              : "Unlimited"}
          </Typography>
        );
      },
    },
    {
      header: "Action Date",
      accessorKey: "sip_start_date",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.sip_start_date}</Typography>
        );
      },
    },

    {
      header: "SIP Amount",
      accessorKey: "amount",
      cell: (data) => {
        return (
          <Typography sx={{ textAlign: "right", width: "90%", fontSize: "14px", fontWeight: 400 }}>
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
      cell: (data) => {
        const [successBarOpen, setSuccessBarOpen] = useState(false);
        const [modalOpen, setModalOpen] = useState(false);
        const [modalData, setModalData] = useState({});

        const BASE_URL = import.meta.env.VITE_BASE_URL;

        const handleView = (rowData) => {
          // console.log(rowData)

          const finalModalData = {
            "Registration Number": rowData.ref_id,
            BOID: rowData.boid_no,
            Name: rowData.full_name,
            Email: rowData.email,
            "Contact Number": rowData.phone,
            "SIP Start Date": rowData.sip_start_date,
            "SIP Amount": rowData.amount,
            "SIP Model": rowData?.sip_model,
            "SIP Interval": rowData?.sip_interval,
            "SIP Period": rowData?.time_period,
          };

          setModalData(finalModalData);
          setModalOpen(true);
        };

        const handleReceipt = () => {
          let anchor = document.createElement("a");
          document.body.appendChild(anchor);
          let file = `${BASE_URL}/sip-up/api/v1/sip/generate-report-file/${data.row.original.sip_identifier}/`;

          let headers = new Headers();
          headers.append("Authorization", `Bearer ${Auth.getAccessToken()}`);

          fetch(file, { headers })
            .then((response) => {
              return response.blob();
            })
            .then((blobby) => {
              // console.log("blobby", blobby)
              let objectUrl = window.URL.createObjectURL(blobby);

              anchor.target = "_blank";
              anchor.href = objectUrl;
              anchor.download = `SIP Receipt ${data?.row?.original?.id}.pdf`;
              anchor.click();

              window.URL.revokeObjectURL(objectUrl);
            })
            .then(() => setSuccessBarOpen(true));
        };

        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <>
              <ViewModal
                open={modalOpen}
                setOpen={setModalOpen}
                data={modalData}
              />

              <Box
                onClick={() => handleView(data.row.original)}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 0.5,
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
              {/* <a
                href={`https://api-mf.navyaadvisors.com/sip-up/api/v1/sip/generate-report-file/${data.row.original.sip_identifier}/`}
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: 'none'
                }}
              > */}
              <Box
                onClick={handleReceipt}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 0.5,
                  color: colorTokens.mainColor[1100],
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
              >
                {/* <img src={ReceiptIcon} /> */}
                <ArticleOutlinedIcon sx={{ fontSize: "14px", fontWeight: 400 }} />
                <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>Receipt</Typography>
              </Box>
              {/* </a> */}
              <SuccessBar
                snackbarOpen={successBarOpen}
                setSnackbarOpen={setSuccessBarOpen}
                message="Downloaded Successfully"
              />
            </>
          </Box>
        );
      },
    },
  ];