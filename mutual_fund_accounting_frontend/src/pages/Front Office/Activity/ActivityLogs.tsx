import { Box, Button, Typography, useTheme } from "@mui/material";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Timeline } from "antd";
import SearchText from "components/Button/Search";
import DateField from "components/DateField/DateField";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import { useGetActivityLogs } from "services/ActivityLogs/ActivityLogsServices";
import { useEffect, useState } from "react";

const ActivityLogs = () => {
  const theme = useTheme();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);

  //   const {
  //     data: activityLogsData,
  //     refetch,
  //     isSuccess: activityLogsSuccess,
  //   } = useGetActivityLogs(pageIndex);

  const handleSearch = () => {};

  const handleReset = () => {};

  //   const handleNextClick = () => {
  //     setPageIndex((next) => next + 1);
  //   };

  //   const handlePrevClick = () => {
  //     setPageIndex((prev) => prev - 1);
  //   };

  //   useEffect(() => {
  //     // refetch();
  //     if (activityLogsData?.responseData?.next === null) {
  //       setNext(true);
  //     } else {
  //       setNext(false);
  //     }

  //     if (activityLogsData?.responseData?.previous === null) {
  //       setPrev(true);
  //     } else {
  //       setPrev(false);
  //     }
  //   }, [activityLogsData, activityLogsSuccess]);

  const customEntryGreenDot = (
    <CheckCircleOutlined
      style={{
        fontSize: "15px",
        color: "#16A34A",
        backgroundColor: "#16A34A",
        borderRadius: "50%",
      }}
    />
  );

  const customPostingGreenDot = (
    <CheckCircleOutlined
      style={{
        fontSize: "15px",
        color: "#15803D",
        backgroundColor: "#15803D",
        borderRadius: "50%",
      }}
    />
  );

  const customYellowEntryDot = (
    <CheckCircleOutlined
      style={{
        fontSize: "15px",
        color: "#FAD02C",
        backgroundColor: "#FAD02C",
        borderRadius: "50%",
      }}
    />
  );
  const customYellowPostingDot = (
    <CheckCircleOutlined
      style={{
        fontSize: "15px",
        color: "#EAB308",
        backgroundColor: "#EAB308",
        borderRadius: "50%",
      }}
    />
  );

  const timelineItems = [
    {
      dot: customEntryGreenDot,
      children: (
        <>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            05/09/2024
          </p>
          <p style={{ margin: 0 }}>
            New User Added (Entry){" "}
            <strong style={{ color: "#616161", fontWeight: "normal" }}>
              {" "}
              by Ajay Thakur
            </strong>{" "}
          </p>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            {" "}
            30 minutes ago
          </p>
        </>
      ),
    },
    {
      dot: customEntryGreenDot,
      children: (
        <>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            05/09/2024
          </p>
          <p style={{ margin: 0 }}>
            User Logged In{" "}
            <strong style={{ color: "#616161", fontWeight: "normal" }}>
              by Sagar Adhikari
            </strong>{" "}
          </p>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            {" "}
            35 minutes ago
          </p>
        </>
      ),
    },
    {
      dot: customPostingGreenDot,
      children: (
        <>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            05/09/2024
          </p>
          <p style={{ margin: 0 }}>
            Unit Purchase Posting{" "}
            <strong style={{ color: "#616161", fontWeight: "normal" }}>
              by Chetnath Gartoula
            </strong>{" "}
          </p>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            {" "}
            1hr ago
          </p>
        </>
      ),
    },
    {
      dot: customYellowEntryDot,
      children: (
        <>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            05/09/2024
          </p>
          <p style={{ margin: 0 }}>
            BOID Correction{" "}
            <strong style={{ color: "#616161", fontWeight: "normal" }}>
              by Satendra Yadav
            </strong>{" "}
          </p>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            {" "}
            2hrs ago
          </p>
        </>
      ),
    },
    {
      dot: customYellowEntryDot,
      children: (
        <>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            05/09/2024
          </p>
          <p style={{ margin: 0 }}>
            SIP Amendment Entry{" "}
            <strong style={{ color: "#616161", fontWeight: "normal" }}>
              by Sagar Adhikari
            </strong>{" "}
          </p>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            {" "}
            4hrs ago
          </p>
        </>
      ),
    },
    {
      dot: customYellowPostingDot,
      children: (
        <>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            05/09/2024
          </p>
          <p style={{ margin: 0 }}>
            SIP Amendment Posting{" "}
            <strong style={{ color: "#616161", fontWeight: "normal" }}>
              by Srijana Pandey
            </strong>{" "}
          </p>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            {" "}
            30 minutes ago
          </p>
        </>
      ),
    },
  ];

  const timelineItemsPrevious = [
    {
      dot: customEntryGreenDot,
      children: (
        <>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            05/08/2024
          </p>
          <p style={{ margin: 0 }}>
            New User Added (Entry){" "}
            <strong style={{ color: "#616161", fontWeight: "normal" }}>
              by Ajay Thakur
            </strong>{" "}
          </p>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            {" "}
            05:01 PM
          </p>
        </>
      ),
    },
    {
      dot: customEntryGreenDot,
      children: (
        <>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            05/08/2024
          </p>
          <p style={{ margin: 0 }}>
            User Logged In{" "}
            <strong style={{ color: "#616161", fontWeight: "normal" }}>
              by Sagar Adhikari
            </strong>{" "}
          </p>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            {" "}
            01:34 PM
          </p>
        </>
      ),
    },
    {
      dot: customPostingGreenDot,
      children: (
        <>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            05/08/2024
          </p>
          <p style={{ margin: 0 }}>
            Unit Purchase Posting{" "}
            <strong style={{ color: "#616161", fontWeight: "normal" }}>
              by Chetnath Gartoula
            </strong>{" "}
          </p>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            {" "}
            01:34 PM
          </p>
        </>
      ),
    },
    {
      dot: customYellowEntryDot,
      children: (
        <>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            05/08/2024
          </p>
          <p style={{ margin: 0 }}>
            BOID Correction{" "}
            <strong style={{ color: "#616161", fontWeight: "normal" }}>
              by Satendra Yadav
            </strong>{" "}
          </p>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            {" "}
            01:34 PM
          </p>
        </>
      ),
    },
    {
      dot: customYellowEntryDot,
      children: (
        <>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            05/08/2024
          </p>
          <p style={{ margin: 0 }}>
            SIP Amendment Entry{" "}
            <strong style={{ color: "#616161", fontWeight: "normal" }}>
              by Sagar Adhikari
            </strong>{" "}
          </p>
          <p style={{ color: "#616161", fontSize: "12px", margin: 0 }}>
            {" "}
            01:34 PM
          </p>
        </>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ width: "50px", marginTop: "15px", marginBottom: "25px" }}>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "19px",
            color: "#212121",
            textAlign: "center",
            width: "max-content",
            borderBottom: `1px solid ${theme.palette.secondary.main}`,
          }}
        >
          Search Filters
        </Typography>
      </Box>
      <Box sx={{ width: "100%", display: "flex", gap: 3 }}>
        <SearchText title="Search for Activity" onClick={handleSearch} />
        <DateField dateLabel1="" />
      </Box>
      <Box sx={{ width: "50px", marginTop: "15px", marginBottom: "25px" }}>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "19px",
            color: "#212121",
            textAlign: "center",
            width: "max-content",
            borderBottom: `1px solid ${theme.palette.secondary.main}`,
          }}
        >
          Activity Logs
        </Typography>
      </Box>
      {timelineItems.length > 0 ? (
        <>
          <Timeline style={{ marginBottom: "50px" }} items={timelineItems} />
          <Timeline items={timelineItemsPrevious} />
        </>
      ) : (
        <Box
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "19px",
            color: "#212121",
            textAlign: "center",
            marginTop: "30px",
            marginLeft: "400px",
          }}
        >
          <CloudRoundedIcon sx={{ color: "#E0E0E0", fontSize: "12rem" }} />
          <Typography>No logs available for the current filters</Typography>
          <Typography
            onClick={handleReset}
            sx={{ color: "#B71C1C", fontWeight: 600, cursor: "pointer" }}
          >
            Reset Filters
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: { sm: "100%", md: "50%", lg: "40%" },
        }}
      >
        <Button
          disabled={prev}
          variant="outlined"
          // onClick={handlePrevClick}
        >
          Prev
        </Button>
        <Button
          disabled={next}
          variant="outlined"
          // onClick={handleNextClick}
        >
          Next
        </Button>
      </Box>
    </>
  );
};

export default ActivityLogs;
