import Card from "@mui/material/Card";
// import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { Box, Button, CardContent } from "@mui/material";
// import CheckIcon from "@mui/icons-material/Check";

import React, { useEffect, useState } from "react";
// import ToggleButton from "@mui/material/ToggleButton";
// import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CurrentNAVSkeleton from "components/Skeleton/CurrentNAVSkeleton";

import CurrentNAVChart from "../Charts/CurrentNAVChart";
import { useGetNAVHistory } from "../../../services/Dashboard/dashboardServices";
import { useTheme } from "@mui/material";
import { useGetNavValue } from "services/NavValue/NavValueServices";
import { colorTokens } from "../../../theme";

export default function CurrentNAV() {
  const theme = useTheme();

  // const [timePeriod, setTimePeriod] = useState("1month");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [filter, setFilter] = useState<"1week" | "1month" | "3month" | "6month" | "1year">("1month");


  const {
    isLoading,
    isError,
    data: NAVData,
    // refetch,
  } = useGetNAVHistory(filter);

  const { data: navValue } = useGetNavValue();

  const changeAmount =
    navValue?.meta?.change_nav || 0;
  const changePercentage =
    navValue?.meta?.change_percentage || 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // const handleChange = (
  //   event: React.MouseEvent<HTMLElement>,
  //   newTimePeriod: string
  // ) => {
  //   // event.preventDefault();
  //   if(newTimePeriod !== null){
  //     setTimePeriod(newTimePeriod);
  //   }
  // };

  // useEffect(() => {
  //   refetch();
  // }, [timePeriod, refetch]);

  return (
    <>
      {(isLoading || isDataLoading) ? (
        <Box
          sx={{
            md : {height : 225},
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CurrentNAVSkeleton />
        </Box>
      ) : isError ? (
        <Card
          sx={{
            // width: 3,
            mt: 2,
            height: 277,
            // height : "fit-content",
            borderRadius: "0.8rem",
            "&.MuiCard-root": {
              boxShadow: "none",
              // border: `0.1rem solid ${theme.palette.grey[400]}`,
              border: "2px solid #D4D4D4",


              // width: 320,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 277,
            }}
          >
            <Typography>Error at Fetching Data</Typography>
          </Box>
        </Card>
      ) : (
        <Box
          sx={{
            width: '100%',
            mt: 2,
            pb: 0,
            borderRadius: "0.8rem",
            height: "fit-content",
            // minHeight: 300,
            border: "2px solid #D4D4D4",

            
          }}
        >
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
        }}>
          <Box>
          <Typography sx={{
            fontSize: "22px",
            fontWeight: 500,
            ml: 0,
            mt: 1,
          }}>
          NAV Value
          </Typography>
          <Typography sx={{
            color : theme.palette.grey[500],
            ml: 0,
          }}>
          Navya Large Cap Fund
          </Typography>
        </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "28px",
                fontWeight: 500,
                color: theme.palette.primary.fullDarkmainColor,
              }}
            >
              {navValue?.responseData?.nav_value || 0}
            </Typography>
            {/* <Typography
            sx={{
              textAlign: { xs: "start", md: "right" },
              fontSize: "14px",
              color: changeAmount > 0 ? "#16A34A" : 
                     changeAmount < 0 ? "#DC2626" :
                     "black",
            }}
          >
            {changeAmount > 0
              ? `+${changeAmount.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}`
              : `${changeAmount.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}`}{" "}
            ({changePercentage}%)
          </Typography> */}
          </Box>
      </Box>

          {/* <ToggleButtonGroup
            color="info"
            value={timePeriod}
            exclusive
            onChange={handleChange}
            aria-label="Toggle menu"
            sx={{
              display: "flex",
              justifyContent: "center",
              height: "2rem",
            }}
          >
            <ToggleButton sx={{ borderRadius: "4rem" }} value="1week">
              {timePeriod === "1week" && (
                <CheckIcon sx={{ height: "1rem", width: "1rem" }} />
              )}
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
                1 Week
              </Typography>
            </ToggleButton>
            <ToggleButton value="1month">
              {timePeriod === "1month" && (
                <CheckIcon sx={{ height: "1rem", width: "1rem" }} />
              )}

              <Typography sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
                1 Month
              </Typography>
            </ToggleButton>
            <ToggleButton value="3month">
              {timePeriod === "3month" && (
                <CheckIcon sx={{ height: "1rem", width: "1rem" }} />
              )}
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
                3 Month
              </Typography>
            </ToggleButton>
            <ToggleButton sx={{ borderRadius: "4rem" }} value="6month">
              {timePeriod === "6month" && (
                <CheckIcon sx={{ height: "1rem", width: "1rem" }} />
              )}
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
                6 Month
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup> */}

    <Box sx={{ display: "flex", gap: 1, ml:2 }}>
       
        <Button
          sx={{
            backgroundColor:
              filter === "1week"
                ? colorTokens.mainColor[50]
                : theme.palette.grey[100],
            color:
              filter === "1week"
                ? theme.palette.primary.main
                : theme.palette.grey[600],
            border: filter === "1week" ? `1px solid ${theme.palette.primary.main}` : "1px solid #ccc",
            minWidth: "25px",
            height: "25px",
            fontSize: "13px",
          }}
          onClick={() => setFilter("1week")}
        >
          1W
        </Button>

        <Button
          sx={{
            backgroundColor:
              filter === "1month"
                ? colorTokens.mainColor[50]
                : theme.palette.grey[100],
            color:
              filter === "1month"
                ? theme.palette.primary.main
                : theme.palette.grey[600],
            border: filter === "1month" ? `1px solid ${theme.palette.primary.main}` : "1px solid #ccc",
            minWidth: "25px",
            height: "25px",
            fontSize: "13px",
          }}
          onClick={() => setFilter("1month")}
        >
          1M
        </Button>

        <Button
          sx={{
            backgroundColor:
              filter === "3month"
                ? colorTokens.mainColor[50]
                : theme.palette.grey[100],
            color:
              filter === "3month"
                ? theme.palette.primary.main
                : theme.palette.grey[600],
            border: filter === "3month" ? `1px solid ${theme.palette.primary.main}` : "1px solid #ccc",
            minWidth: "25px",
            height: "25px",
            fontSize: "13px",
          }}
          onClick={() => setFilter("3month")}
        >
          3M
        </Button>

        <Button
          sx={{
            backgroundColor:
              filter === "6month"
                ? colorTokens.mainColor[50]
                : theme.palette.grey[100],
            color:
              filter === "6month"
                ? theme.palette.primary.main
                : theme.palette.grey[600],
            border: filter === "6month" ? `1px solid ${theme.palette.primary.main}` : "1px solid #ccc",
            minWidth: "25px",
            height: "25px",
            fontSize: "13px",
          }}
          onClick={() => setFilter("6month")}
        >
          6M
        </Button>

        <Button
          sx={{
            backgroundColor:
              filter === "1year" 
                ? colorTokens.mainColor[50] 
                : theme.palette.grey[100],
            color:
              filter === "1year"
                ? theme.palette.primary.main
                : theme.palette.grey[600],
            border: filter === "1year" ? `1px solid ${theme.palette.primary.main}` : "1px solid #ccc",
            minWidth: "25px",
            height: "25px",
            fontSize: "13px",
          }}
          onClick={() => setFilter("1year")}
        >
          1Y
        </Button>

        
      </Box>


          {/* Current NAV History Chart */}
          <CardContent
            sx={{
              p:0,
              mb:1,
              "&.MuiCardContent-root": {
                pb: 0,
              },
            }}
          >
            <CurrentNAVChart data={NAVData} />
          </CardContent>
        </Box>
      )}
    </>
  );
}
