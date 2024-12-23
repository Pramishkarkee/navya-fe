import { Box } from "@mui/material";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import DateField from "components/DateField/DateField";
import RoundedButton from "components/Button/Button";
import PostingTable from "components/Table/PostingTable";
import PostingRemarks from "components/PostingRemarks/PostingRemarks";
import { useForm } from "react-hook-form";
import { OnlineSIPPaymentPostingTableHeader } from "constants/OnlineSIPTable/PaymentPostingTableHeader";
import SipPaymentEntry from "../SIP Payment/SipPaymentPosting";

const OnlineSipPaymentPosting = () => {
  const { control } = useForm();

  const handleLoad = () => {
    // console.log('handle load clicked')
  };

  const handleAuthorize = () => {
    // console.log("authorize dclicked")
  };

  const handleReject = () => {
    // console.log("reject clicked")
  };

  return (
    // <Box sx={{
    //     display: 'flex',
    //     flexDirection: 'column',
    //     gap: 1.5
    // }}>
    //     <DistributionSchemeField
    //         control={control}
    //         label1="Distribution Center (Request)"
    //     />

    //     <DateField
    //         dateLabel1="Date (From)"
    //         dateLabel2="Date (To)"
    //     />

    //     <RoundedButton
    //         title1="Load"
    //         onClick1={handleLoad}
    //     />

    //     <Box>
    //         <PostingTable columns={OnlineSIPPaymentPostingTableHeader} data={SipPaymentPostingData} />
    //     </Box>

    //     <PostingRemarks control={control} />

    //     <RoundedButton

    //         title1="Authorize"
    //         onClick1={handleAuthorize}
    //         title2="Reject"
    //         onClick2={handleReject}

    //     />

    // </Box>
    <SipPaymentEntry />
  );
};

export default OnlineSipPaymentPosting;
