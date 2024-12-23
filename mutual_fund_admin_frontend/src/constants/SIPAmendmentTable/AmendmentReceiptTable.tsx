import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import { colorTokens } from "../../theme";
import Receipt from "../../assets/Receipt.svg";
import SuccessBar from "components/Snackbar/SuccessBar";
import ViewModal from "components/Modal/ViewModal";
import Auth from "utils/Auth";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';


type AmendmentReceiptHeader = {
  id: number;
  boid_no: string;
  name: string;
  term: string;
  sip_model: string;
  sip_interval: string;
  amount: string;
  amendment_id: string;
  created_at: string;
  actions: any;
};

export const AmendmentReceiptTableHeaders: ColumnDef<AmendmentReceiptHeader>[] =
  [
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
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.name}</Typography>;
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
      header: "SIP Model",
      accessorKey: "sip_model",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.sip_model}</Typography>;
      },
    },
    {
      header: "SIP Interval",
      accessorKey: "sip_interval",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.sip_interval || '-'}</Typography>;
      },
    },
    {
      header: "SIP Term",
      accessorKey: "sip_term",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
          {data.row.original.term || '-'}
          {/* {data.row.original.sip_interval === "Monthly" ? "Month" : 
          data.row.original.sip_interval === "Quarterly" ? "Quarter" :
          data.row.original.sip_interval === "Semi-Annually" ? "Semi Annual" : "Year"  } */}
        </Typography>
      },
    },
    {
      header: "SIP Interval",
      accessorKey: "created_at",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.created_at.split("T")[0]}</Typography>
        );
      },
    },
    {
      header: "Current Amount",
      accessorKey: "amount",
      cell: (data) => {
        return (
          <Typography textAlign="right" width="90%" sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.amount}
          </Typography>
        );
      },
    },

    {
      header: "Actions",
      accessorKey: "actions",
      cell: (data) => {
        const [successBarOpen, setSuccessBarOpen] = useState(false);
        const [modalOpen, setModalOpen] = useState(false);
        const [modalData, setModalData] = useState({});

        const BASE_URL = import.meta.env.VITE_BASE_URL;

        const handleView = (rowData) => {
          const finalModalData = {
            "BOID": rowData.boid_no,
            "Name": rowData.name,
            "Current Amount": rowData.amount,
            "SIP Model": rowData.sip_model,
            "Term": rowData.term || "-",
            "SIP Interval": rowData.sip_interval || "-",
            "Amendment Date " : rowData.created_at.split("T")[0],
          };

          setModalData(finalModalData);
          setModalOpen(true);
        };

        const handleReceipt = () => {
          const anchor = document.createElement("a");
          document.body.appendChild(anchor);
          const file = `${BASE_URL}/sip-up/api/v1/sip/generate-report-file/${data.row.original.amendment_id}/`;

          const headers = new Headers();
          headers.append("Authorization", `Bearer ${Auth.getAccessToken()}`);

          fetch(file, { headers })
            .then((response) => {
              return response.blob();
            })
            .then((blobby) => {
              const objectUrl = window.URL.createObjectURL(blobby);

              anchor.target = "_blank";
              anchor.href = objectUrl;
              anchor.download = `Amendment Receipt ${data?.row?.original?.id}.pdf`;
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
              justifyContent: "center",
              gap: 1.5,
            }}
          >
            <SuccessBar
              snackbarOpen={successBarOpen}
              setSnackbarOpen={setSuccessBarOpen}
              message="Downloaded Successfully"
            />

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
                gap: 0.5,
                alignItems: "center",
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

            <Box
              onClick={handleReceipt}
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 0.5,
                alignItems: "center",
                color: colorTokens.mainColor[1100],
                "&:hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
            >
              {/* <img src={Receipt} alt="Reciept Icon" /> */}
              <ArticleOutlinedIcon sx={{ fontSize: "14px", fontWeight: 400 }} />
              <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>Receipt</Typography>
            </Box>
          </Box>
        );
      },
    },
  ];