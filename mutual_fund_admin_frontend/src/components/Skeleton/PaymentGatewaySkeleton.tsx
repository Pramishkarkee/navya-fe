import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material";

const ColumnChartSkeleton = () => {
  const theme = useTheme();
  return (
    <Stack spacing={2} useFlexGap>
      <Card
        sx={{
          width:389,
          height: 'fit-content',
          borderRadius: "0.8rem",
          "&.MuiCard-root": {
            boxShadow: "none",
            // border: `0.1rem solid ${theme.palette.grey[400]}`,
            border: "2px solid #D4D4D4",

            md : {width : 370},
            lg : {width : 340},
            xl : {width : 389}

          },
        }}
      >
        <CardHeader
          titleTypographyProps={{
            fontSize: 20,
            fontWeight: 400,
            display: "flex",
            justifyContent: "center",
          }}
          title={<Skeleton animation="wave" width="80%" />}
        />


        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box>
            <Skeleton
              variant="rectangular"
              animation="wave"
              width={100}
              height={28}
            />
            <Skeleton width="50%" animation="wave" height={20} />
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box>
            <Skeleton
              animation="wave"
              variant="rectangular"
              width={100}
              height={28}
            />
            <Skeleton animation="wave" width="50%" height={20} />
          </Box>
        </CardContent>

        <Box sx={{ width: "100%", p: 2 }}>
          <Typography>
            <Skeleton animation="wave" width="30%" />
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="40%"
            height={40}
          />
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="50%"
            height={40}
          />
        </Box>  
        </Box>
   
        <CardContent>
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="100%"
            height={180}
            sx={{ borderRadius: "16px" }}
          />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ColumnChartSkeleton;
