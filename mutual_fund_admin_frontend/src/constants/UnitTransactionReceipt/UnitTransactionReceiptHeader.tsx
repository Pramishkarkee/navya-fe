/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";

import { Box, Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { colorTokens } from "../../theme";
import { Visibility } from "@mui/icons-material";
import Receipt from "../../assets/Receipt.svg";
import SuccessBar from "components/Snackbar/SuccessBar";
import ViewModal from "components/Modal/ViewModal";
import Auth from "utils/Auth";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

type UnitTransactionHeaders = {
  SN: number;
  id: number;
  boid_number: string;
  full_name: string;
  applied_units: string;
  purchased_nav_value: number;
  amount: string;
  unit_identifier: string;
  actions: any;
};

export const UnitTransactionReceiptHeader: ColumnDef<UnitTransactionHeaders>[] =
  [
    {
      header: "S. No.",
      accessorKey: "SN",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}> {data.row.index + 1} </Typography>;
      },
    },

    {
      header: "BOID",
      accessorKey: "boid_number",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.boid_number}</Typography>;
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
      header: "Applied Units",
      accessorKey: "applied_units",
      cell: (data) => {
        return (
          <Typography width="70%" textAlign={"right"} sx={{ fontSize: "14px", fontWeight: 400 }}>
            {Number(data.row.original.applied_units)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
          </Typography>
        );
      },
    },
    {
      header: "Purchase NAV",
      accessorKey: "purchased_nav_value",
      cell: (data) => {
        return (
          <Typography width="65%" textAlign={"right"} sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.purchased_nav_value}
          </Typography>
        );
      },
    },
    {
      header: "Deposit Amount",
      accessorKey: "amount",
      cell: (data) => {
        return (
          <Typography width="70%" textAlign={"right"} sx={{ fontSize: "14px", fontWeight: 400 }}>
            {Number(data.row.original.amount)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
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
          // console.log(rowData)

          const finalModalData = {
            "Share Holder Number": rowData.share_holder_number,
            BOID: rowData.boid_number,
            Name: rowData.full_name,
            Email: rowData.email,
            "Contact Number": rowData.contact_number,
            "Applied Units": rowData.applied_units,
            Amount: rowData.amount,
          };

          setModalData(finalModalData);
          setModalOpen(true);
        };

        const handleReceipt = () => {
          let anchor = document.createElement("a");
          document.body.appendChild(anchor);
          let file = `${BASE_URL}/sip-up/api/v1/sip/generate-report-file/${data.row.original.unit_identifier}/`;

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
              anchor.download = `Unit Receipt ${data?.row?.original?.id}.pdf`;
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
            {/* 
            <a
              href={`https://api-mf.navyaadvisors.com/sip-up/api/v1/sip/generate-report-file/${data.row.original.unit_identifier}/`}
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
            {/* </a> */}
          </Box>
        );
      },
    },
  ];