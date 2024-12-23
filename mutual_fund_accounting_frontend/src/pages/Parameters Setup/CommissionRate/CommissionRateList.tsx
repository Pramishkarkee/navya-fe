import { Box, TextField, Typography } from "@mui/material";
import { PaginationState } from "@tanstack/react-table";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ReceiptTable from "components/Table/TanstackTable";
// import { MarketCapTableColumns } from "constants/MarketCap/MarketCapTableHeader";
import { CommissionRateTableColumns } from "constants/CommissionData/CommissionTableHeader";

import { useEffect, useState } from "react";
import {
  useGetCommissionRateList,
  // usePatchCommissionRate,
  useGetBrokerChargeCommissionRate,
  usePatchBrokerChargeCommissionRate
} from "services/CommissionRate/CommissionRate";
// import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import { Empty } from "antd";
import RoundedButton from "components/Button/Button";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";

const CommissionRateList = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [successabarOpen, setSuccessbarOpen] = useState<boolean>();
  const [errorsbarOpen, setErrorbarOpen] = useState<boolean>();

  const { data: CommissionRateData } = useGetCommissionRateList(pagination.pageIndex + 1);
  const { data: BrokerChargeData } = useGetBrokerChargeCommissionRate();
  const { mutate: patchCommissionRateData } = usePatchBrokerChargeCommissionRate();

  const totalPageCount = Math.ceil(CommissionRateData?.count / 10);

  const [BrokerCharge, setBrokerCharge] = useState<number>();
  const [changeRate, setChangeRate] = useState<boolean>();

  const handleChangeCommissionRate = (e) => {
    setChangeRate(true);
    setBrokerCharge(Number(e.target.value));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const payload = {
      min_commission_amt: BrokerCharge,
    };
    patchCommissionRateData(payload, {
      onSuccess: () => {
        console.log("Broker Charge Updated");
        setSuccessbarOpen(true);
      },
      onError: (error) => {
        console.log("Broker Charge Update Error", error);
        setErrorbarOpen(true);
      },
    });
  };

  useEffect(() => {
    setBrokerCharge(BrokerChargeData?.responseData?.min_commission_amt ?? 10);

    if (CommissionRateData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (CommissionRateData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [CommissionRateData, BrokerChargeData]);

  return (
    <>
     <SuccessBar
        snackbarOpen={successabarOpen}
        setSnackbarOpen={setSuccessbarOpen}
        message={"Successfully Updated!"}
      />
      <ErrorBar
        snackbarOpen={errorsbarOpen}
        setSnackbarOpen={setErrorbarOpen}
        message={"Error in Updating Commission Rate!"}
      />

    <Box component="form" sx={{ }}>
      <Box sx={{ my: 2.5 }}>
        <HeaderDesc title="Commission Rate List" />
      </Box>

      <Box component='form'
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        mb: 1,
      }}>
        <Typography >Minimum Broker Charge Per Transaction: </Typography>
        <TextField
          id="outlined-basic"
          variant="outlined"
          size="small"
          value={BrokerCharge}
          onChange={handleChangeCommissionRate}
          sx={{ width: "10%" }}
        />
        {changeRate && 
        <RoundedButton title1="Update" onClick1={handleUpdate} />
        }
      </Box>

      {CommissionRateData?.results?.length === 0 ? (
        <Box
          sx={{
          }}
        >
          <ReceiptTable
          columns={CommissionRateTableColumns}
          data={[]}
          // pagination={pagination}
          // setPagination={setPagination}
          // next={next}
          // prev={prev}
          // pageCount={totalPageCount}
        />
        <Box sx={{display: 'flex', flexDirection:'column', justifyContent:'center' , alignItems:'center' , ml:{ md: 5 , lg: 20}, mt: 5  }}>
          {/* <CloudRoundedIcon sx={{ color: "#E0E0E0", fontSize: "12rem" }} /> */}
          <Empty imageStyle={{ height: 150, width: 150 }} description="No Data Available" />
          {/* <Typography>No Data Available</Typography> */}
        </Box>
          
        </Box>
      ) : (
        <Box sx={{maxWidth:'1500px', width: { xl: "130%", lg: "125%", md: "110%" } }}>
        <ReceiptTable
          columns={CommissionRateTableColumns}
          data={CommissionRateData?.results ?? []}
          pagination={pagination}
          setPagination={setPagination}
          next={next}
          prev={prev}
          pageCount={totalPageCount}
        />  
        </Box>
      )}
    </Box>
    </>
  );
};

export default CommissionRateList;









// import {
//     Box,
//     Typography,
  
//   } from "@mui/material";
//   import { PaginationState } from "@tanstack/react-table";
//   import HeaderDesc from "components/HeaderDesc/HeaderDesc";
//   import ReceiptTable from "components/Table/TanstackTable";
  // import { DividentSettlementTableColumns } from "constants/CommissionData/CommissionTableHeader";
//   import { useEffect, useState } from "react";
//   import {
//     useGetCommissionRateList,
//     // usePatchFixedDepositData,
//   } from "services/CommissionRate/CommissionRate";
// import CloudRoundedIcon from "@mui/icons-material/CloudRounded";

  
//   const CommissionList = () => {
//     const [pagination, setPagination] = useState<PaginationState>({
//       pageIndex: 0,
//       pageSize: 10,
//     });
//     const [next, setNext] = useState<boolean>();
//     const [prev, setPrev] = useState<boolean>();
  
//     const { data: CommissionRateData } =
//     useGetCommissionRateList(pagination.pageIndex + 1);

//     const totalPageCount = Math.ceil(CommissionRateData?.count /10);

//     useEffect(() => {
//       if (CommissionRateData?.next === null) {
//         setNext(true);
//       } else {
//         setNext(false);
//       }
//       if (CommissionRateData?.previous === null) {
//         setPrev(true);
//       } else {
//         setPrev(false);
//       }
//   }, [CommissionRateData]);

  
//     return (
//       <Box component="form" sx={{  }}>
//         <Box sx={{my:4}}>
//         <HeaderDesc title="Commission Charge List" />
//         </Box>
  
//         {/* <ReceiptTable
//           columns={DividentSettlementTableColumns}
//           data={CommissionRateData?.results ?? []}
//           pagination={pagination}
//           setPagination={setPagination}
//           next={next}
//           prev={prev}
//           pageCount={totalPageCount}
//         /> */}

//        {CommissionRateData?.results?.length === 0 ? (
//         <Box
//         sx={{
//         }}
//         >
//           <ReceiptTable
//           columns={CommissionRateData}
//           data={[]}
//           // pagination={pagination}
//           // setPagination={setPagination}
//           // next={next}
//           // prev={prev}
//           // pageCount={totalPageCount}
//         />
//         <Box sx={{display: 'flex', flexDirection:'column', justifyContent:'center' , alignItems:'center' , ml:{ md: 5 , lg: 20}  }}>
//           <CloudRoundedIcon sx={{ color: "#E0E0E0", fontSize: "12rem" }} />
//           <Typography>No Data Available</Typography>
//         </Box>
          
//         </Box>
//       ) : (
//         <ReceiptTable
//         columns={DividentSettlementTableColumns}
//         data={CommissionRateData?.results ?? []}
//         pagination={pagination}
//         setPagination={setPagination}
//         next={next}
//         prev={prev}
//         pageCount={totalPageCount}
//           />
//           )}
//         </Box>
//     );
//   };
  
//   export default CommissionList;
  