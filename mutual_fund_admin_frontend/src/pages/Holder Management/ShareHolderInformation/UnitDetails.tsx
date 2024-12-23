import { Box, Typography } from "@mui/material";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ReceiptTable from "components/Table/TanstackTable";
import React, { useEffect, useState } from "react";

import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

import { useGetUnitDetails } from "../../../services/ShareHolderDetails/shareHolderDetails";

import UnitDetailBox from "./UnitDetailBox";
import { ColumnDef } from "@tanstack/react-table";
import { useNavStore } from "../../../store/NavbarStore";
import { useTheme } from "@mui/material";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

// import { colorTokens } from "../../../theme";

type ShareHolderDetail = {
  id: number;
  full_name: string;
  boid_number: string;
  portal: string;
  applied_units: string;
  time_period: string;
  share_holder_number: string;
  amount: string;
  total_units: string;
  phone: string;
  total_investement: string;
  citizen_file_path: string;
  actions: any;
  is_rejected: boolean;
};

const UnitDetails = () => {
  const theme = useTheme();
  const { unitBOID } = useNavStore();
  // console.log("", unitBOID);

  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();

  const { data: UserUnitDetails } = useGetUnitDetails(Number(unitBOID));

  const handleView = (id: number) => {
    setSelectedUnitId(id);
    setShowViewModal(true);
  };

  const BackToShareHolder = () => {
    // window.location.href = "/share-holder-information";
    window.history.back();
  }

  const totalPages = Math.ceil(UserUnitDetails?.count / 10);

  useEffect(() => {
    if (UserUnitDetails?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (UserUnitDetails?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [UserUnitDetails]);

  const ShareHolderDetailHeader: ColumnDef<ShareHolderDetail>[] = [
    {
      header: "Share Holder Number",
      accessorKey: "share_holder_number",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.share_holder_number}</Typography>;
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
      accessorKey: "boid_number",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.boid_number}</Typography>;
      },
    },
    {
      header: "Type",
      accessorKey: "portal",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
          {data.row.original.portal === "Online" ? "Online" : 
           data.row.original.portal === "Office" ? "Counter" : '-'}
           </Typography>;
      },
    },
    {
      header : "Unit Status",
      accessorKey : "is_rejected",
      cell : (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.is_rejected ? "Rejected" : "Approved"}</Typography>;
      }
    },
    {
      header: "Units",
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
        <HeaderDesc title={"Unit Transaction History"} />
      </Box>

      {UserUnitDetails?.responseData?.results.length > 0 ? (
        <>
          <ReceiptTable
            columns={ShareHolderDetailHeader}
            data={UserUnitDetails?.responseData?.results ?? []}
            pagination={pagination}
            setPagination={setPagination}
            next={next}
            prev={prev}
            pageCount={totalPages}
          />
          {selectedUnitId && showViewModal && (
            <UnitDetailBox boid={unitBOID} selectedUnitId={selectedUnitId} />
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
            <Typography>No Unit Details available.</Typography>
          </Box>
        </>
      )}
    </>
  );
};

export default UnitDetails;
