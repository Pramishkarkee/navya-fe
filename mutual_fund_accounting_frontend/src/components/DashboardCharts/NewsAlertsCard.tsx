import React, { useEffect, useState } from "react";
import { Box, Divider, Typography, useTheme } from "@mui/material";
import { useGetNewsAlertsData } from "services/Dashboard/DashboadServices";
import DateField from "components/DateFilter/SingleDateFilter";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link } from "react-router-dom";

const IncomeExpenses: React.FC = () => {
  const theme = useTheme();

  const fakeData = [
    {
        "title": "Sanchalak Rajinama Swikriti Patra [RURU]",
        "source": "NEPSE",
        "link": "https://nepalstock.com/api/nots/application/fetchFiles?encryptedId=3a9eb473c1ef0e2b63895550f53a609b24412eaf64511c4d3cd42066bd0a82eb28d4961b2c00d1ac255584bc74e198a54c1a628fc809cc02467e99f3ed48fbf2",
        "dateTime": "2024-10-28T05:57:56.707721+00:00"
    },
    {
        "title": "Appointment of CEO [SICL]",
        "source": "NEPSE",
        "link": "https://nepalstock.com/api/nots/application/fetchFiles?encryptedId=56b158840768ca62884ea792c114e546b59d6a1212566db9a8af1eeb10919da1240aa76c17afe405450bc5a6a1c27dc87a1fd37eef3ef9363794584c1cbf4458",
        "dateTime": "2022-10-26T09:59:00Z"
    },
    {
        "title": "9th AGM minute of Gurans Laghubitta Bittiya Sanstha Ltd. [GLBSL]",
        "source": "NEPSE",
        "link": "https://nepalstock.com/api/nots/application/fetchFiles?encryptedId=f47f19a15c55167c62de850278e5e98625eb58f663a6298e8db418c89ec9282daddcd572bbceb29bce01b9fc6be842ab79a68edda0593d3230e426cddffa3f52",
        "dateTime": "2022-10-27T10:45:00Z"
    },
    {
        "title": "Appointment of BOD Member [NTC]",
        "source": "NEPSE",
        "link": "https://nepalstock.com/api/nots/application/fetchFiles?encryptedId=003c16fb25e8695731e831ed42c7be277d0ef431dca3c217780dbe63bde7ea958fcbdcbde6632f68d873dd53b3db1b2d7361e518e4a2f573a59ba01670fe475c",
        "dateTime": "2022-10-28T10:45:00Z"
    },
    {
        "title": "Book Closure Notice [GLICL]",
        "source": "NEPSE",
        "link": "https://nepalstock.com/api/nots/application/fetchFiles?encryptedId=4c2b5a5b5c", 
        "dateTime": "2022-10-29T10:45:00Z"
    },
    {
        "title": "Book Closure Notice [GLICL]",
        "source": "NEPSE",
        "link": "https://nepalstock.com/api/nots/application/fetchFiles?encryptedId=4c2b5a5b5c", 
        "dateTime": "2022-10-30T10:45:00Z"
    },    
]

  const schema = yup.object().shape({
    startDate: yup.object().required(),
  });

  const { control, watch } = useForm({
    defaultValues: {
      startDate: null,
    },
    resolver: yupResolver(schema),
  });

  const [searchData, setSearchData] = useState({
    filterDate: "",
  });

  const { data: IncomeExpensesData } = useGetNewsAlertsData(searchData.filterDate);
  console.log(IncomeExpensesData);

  const selectedDate = watch("startDate");

  useEffect(() => {
    if (selectedDate) {
      setSearchData({
        filterDate: dayjs(selectedDate?.toString()).format("YYYY-MM-DD"),
      });
    }
  }, [selectedDate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        px: "20px",
        paddingTop: "20px",
        border: "2px solid #D4D4D4",
        borderRadius: "15px",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "start", md: "space-between" },
          gap: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "10px",
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "20px",
            }}
          >
            News & Alerts
          </Typography>
          <Typography
            sx={{
              fontWeight: 500,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "14px",
              backgroundColor: theme.palette.secondary.softColor,
              borderRadius: "50px",
              width: "30px",
            }}
          >
            {fakeData.length}
          </Typography>
        </Box>
      </Box>
      <Divider />
      
      <DateField dateLabel="" control={control} />

      {fakeData.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
            <Typography
                sx={{
                // color: theme.palette.grey[600],
                fontSize: "16px",
                fontWeight: 500,
                }}
            >
                No News & Alerts Found
            </Typography>
        </Box>
        ) : (


      <Box sx={{
        maxHeight: "250px",
        maxWidth: "auto",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
            width: "5px",
            },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.grey[300],
            borderRadius: "10px",
        },
       }}>

      {fakeData.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px",
            borderBottom: "1px solid #D4D4D4",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                display: "flex",
                gap: "5px",
                alignItems: "center",
                color: theme.palette.grey[600],
              }}
            >
              {item.source} 
          <FiberManualRecordIcon sx={{fontSize:'7px', color:"gray" }} />
              {item.dateTime.split("T")[0]}
          <FiberManualRecordIcon sx={{fontSize:'7px', color:"gray" }} />              
            {new Date(item.dateTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                })}
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 400,
              }}
            > 
            <Link 
            target="_blank"
            to = {item.link}
            style={{
                textDecoration: "none", 
                color: "black",
                display: "flex", 
                gap: "5px",
                alignItems: "center",   
            }}
            >
              {item.title}
              <OpenInNewIcon sx={{fontSize:'16px', cursor:"pointer" }} />
            </Link>  
            </Typography>
          </Box>
        </Box>
      ))
    }     
      </Box>
            )}


    </Box>
  );
};

export default IncomeExpenses;
