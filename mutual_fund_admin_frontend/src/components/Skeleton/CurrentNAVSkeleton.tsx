import React from "react";
import {
  Box,
  // Card,
  CardContent,
  // CardHeader,
  Skeleton,
  // Stack,
  ToggleButton,
  ToggleButtonGroup,
  // Typography,
} from "@mui/material";
// import { useTheme } from "@mui/material";

const StockChartSkeleton = () => {
  // const theme = useTheme();
  return (
    // <Stack spacing={2} useFlexGap>
      <Box
        sx={{
          mt: 2,
          width: "100%",
          // maxWidth: 600,
          borderRadius: "1rem",
          height: "fit-content",
          boxShadow: "none",          
          
          border: "2px solid #D4D4D4",

        }}
      >
        <Box sx={{
          margin: "1rem",
          marginTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

        }}>
          <Box>
            <Skeleton animation="wave" width="100px" />
            <Skeleton animation="wave" width="150px" />
          </Box>
          <Box>
            <Skeleton animation="wave" width="100px" />
            <Skeleton animation="wave" width="100px" />
          </Box>

        </Box>
        
        <ToggleButtonGroup
          color="primary"
          sx={{
            display: "flex",
            justifyContent: "start",
            ml: 2,
            height: "2rem",
          }}
        >
          {["1W", "1M", "3M", "6M", "1Y"].map((label, index) => (
            <ToggleButton key={index} value={label}>
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={30}
                height={20}
                sx={{ borderRadius: "4px"}}
              />
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <CardContent>
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="100%"
            height={205}
            sx={{ borderRadius: "16px" }}
          />
        </CardContent>
      </Box>
  );
};

export default StockChartSkeleton;




// import React from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   CardHeader,
//   Skeleton,
//   Stack,
//   ToggleButton,
//   ToggleButtonGroup,
//   Typography,
// } from "@mui/material";
// import { useTheme } from "@mui/material";


// const StockChartSkeleton = () => {
//   const theme = useTheme();
//   return (
//     <Stack spacing={2} useFlexGap>
//       <Card
//         sx={{
//           width: 389,
//           borderRadius: "1rem",
//           height: "fit-content",
//           boxShadow: "none",
//           border: `0.1rem solid ${theme.palette.grey[400]}`,
//           "&.MuiCard-root": {
//             md : {width : 370},
//             lg : {width : 340},
//             xl : {width : 389}
//           },
//         }}
//       >
//         <CardHeader
//           titleTypographyProps={{
//             fontSize: 20,
//             display: "flex",
//             justifyContent: "center",
//           }}
//           title={<Skeleton animation="wave" width="50%" />}
//         />
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             width: "100%",
//           }}
//         >
//           <Typography>
//             <Skeleton animation="wave" width="6rem" sx={{ fontSize: "3rem" }} />
//           </Typography>
//           <Typography>
//             <Skeleton
//               animation="wave"
//               width="5rem"
//               sx={{ fontSize: "1rem", mb: 1 }}
//             />
//           </Typography>
//         </Box>

//         <ToggleButtonGroup
//           color="primary"
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             height: "2rem",
//           }}
//         >
//           <ToggleButton sx={{ borderRadius: "4rem" }} value={""}>
//             <Skeleton
//               animation="wave"
//               variant="circular"
//               width={20}
//               height={20}
//             />
//             <Typography sx={{ fontSize: "0.8rem" }}>
//               <Skeleton animation="wave" width={40} />
//             </Typography>
//           </ToggleButton>
//           <ToggleButton value={""}>
//             <Skeleton
//               animation="wave"
//               variant="circular"
//               width={20}
//               height={20}
//             />
//             <Typography>
//               <Skeleton animation="wave" width={40} />
//             </Typography>
//           </ToggleButton>
//           <ToggleButton value={""}>
//             <Skeleton
//               animation="wave"
//               variant="circular"
//               width={20}
//               height={20}
//             />
//             <Typography>
//               <Skeleton animation="wave" width={40} />
//             </Typography>
//           </ToggleButton>
//           <ToggleButton sx={{ borderRadius: "4rem" }} value={""}>
//             <Skeleton
//               animation="wave"
//               variant="circular"
//               width={20}
//               height={20}
//             />
//             <Typography>
//               <Skeleton animation="wave" width={40} />
//             </Typography>
//           </ToggleButton>
//         </ToggleButtonGroup>

//         <CardContent>
//           <Skeleton
//             animation="wave"
//             variant="rectangular"
//             width="100%"
//             height={205}
//             sx={{ borderRadius: "16px" }}
//           />
//         </CardContent>
//       </Card>
//     </Stack>
//   );
// };

// export default StockChartSkeleton;
