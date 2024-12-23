import { Box, Typography } from "@mui/material";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ReceiptTable from "components/Table/TanstackTable";
import React, { useEffect, useState } from "react";

import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

import { useGetSIPDetails } from "../../../services/ShareHolderDetails/shareHolderDetails";
import SIPDetailBox from "./SIPDetailBox";
import { useNavStore } from "../../../store/NavbarStore";
import { ColumnDef } from "@tanstack/react-table";
// import { colorTokens } from "../../../theme";
import { useTheme } from "@mui/material";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

type ShareHolderDetail = {
  id: number;
  full_name: string;
  boid_no: string;
  ref_id: string;
  time_period: string;
  share_holder_number: string;
  amount: string;
  total_units: string;
  phone: string;
  total_investement: string;
  citizen_file_path: string;
  sip_status: string;
  actions: any;
  sip_model: string;
};

const SIPDetails = () => {
  const theme = useTheme();
  const { sipBOID } = useNavStore();

  const [selectedSIPId, setSelectedSIPId] = useState<number | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();

  const { data: UserSIPDetails } = useGetSIPDetails(Number(sipBOID));

  const handleView = (id: number) => {
    setSelectedSIPId(id);
    setShowViewModal(true);
  };

  const BackToShareHolder = () => {
    // window.location.href = "/share-holder-information";
    window.history.back();
  };

  const totalPages = Math.ceil(UserSIPDetails?.meta?.records / 10);

  useEffect(() => {
    // setTableData(PendingSipListData?.responseData?.results || []);
    if (UserSIPDetails?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (UserSIPDetails?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [UserSIPDetails]);

  const ShareHolderDetailHeader: ColumnDef<ShareHolderDetail>[] = [
    {
      header: "SIP Number",
      accessorKey: "share_holder_number",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.share_holder_number}</Typography>;
      },
    },
    {
      header: "Reference Number",
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
      header:"SIP Model",
      accessorKey:"sip_model",
      cell:(data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.sip_model}</Typography>;
      }
    },
    {
      header: "Time Period",
      accessorKey: "time_period",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.sip_model === "Unlimited"
              ? "-"
              : data.row.original.time_period }
          </Typography>
        );
      },
    },
    {
      header: "SIP Amount",
      accessorKey: "sip_amount",
      cell: (data) => {
        return (
          <Typography textAlign="right" width="70%" sx={{ fontSize: "14px", fontWeight: 400 }}>
            {Number(data?.row?.original?.amount)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
          </Typography>
        );
      },
    },
    {
      header: "SIP Status",
      accessorKey: "sip_status",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 , textTransform:'capitalize' }}>{data.row.original.sip_status}</Typography>;
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (data) => (
        <Box
          onClick={() => handleView(data.row.original.id)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.6,
            // color: colorTokens.mainColor[1100],
            color: theme.palette.primary.fullDarkmainColor,
            "&:hover": {
              textDecoration: "underline",
              cursor: "pointer",
            },
          }}
        >
          <ArticleOutlinedIcon sx={{ fontSize: "0.9rem" }} />
          <Typography sx={{ fontSize: "1rem" }}>Details</Typography>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ my: 2 }}>
      <Box onClick={BackToShareHolder} sx={{
        
        display: "flex",
        alignItems: "center",
        gap: 0,
        mb: 2,  
        color: theme.palette.primary.main,
    
        "&:hover": {
          textDecoration: "underline",
          cursor: "pointer",
        },
      }}>
      <ArrowBackIosIcon fontSize={"small"} />
      <Typography sx={{
        fontWeight: 600,
      }}>
       Share Holder Information
     </Typography>
        </Box>
        <HeaderDesc title={"User SIPs Detail"} />
      </Box>
      {UserSIPDetails?.responseData?.results.length > 0 ? (
        <>
          <ReceiptTable
            columns={ShareHolderDetailHeader}
            data={UserSIPDetails?.responseData?.results ?? []}
            pagination={pagination}
            setPagination={setPagination}
            next={next}
            prev={prev}
            pageCount={totalPages}
          />

          {selectedSIPId && showViewModal && (
            <SIPDetailBox boid={sipBOID} selectedSIPId={selectedSIPId} />
          )}
        </>
      ) : (
        <>
          <ReceiptTable columns={ShareHolderDetailHeader} data={[]} />
          <Box
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "19px",
              color: "#212121",
              textAlign: "center",
              marginTop: "30px",
              marginLeft: "40px",
            }}
          >
            <CloudRoundedIcon sx={{ color: "#E0E0E0", fontSize: "12rem" }} />
            <Typography>No SIP Details available</Typography>
          </Box>
        </>
      )}
    </>
  );
};

export default SIPDetails;
