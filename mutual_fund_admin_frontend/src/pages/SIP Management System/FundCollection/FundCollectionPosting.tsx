import { Box } from "@mui/material";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import PostingRemarks from "components/PostingRemarks/PostingRemarks";
import RoundedButton from "components/Button/Button";
import { useForm } from "react-hook-form";

const FundCollectionPosting = () => {
  const { control } = useForm();
  const handleAuthorize = () => {
    // console.log("Authorize Clicked");
  };
  const handleReject = () => {
    // console.log("Reject Clicked");
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <DistributionSchemeField
          label1="Distribution Centrer (Request)"
          control={control}
        />
      </Box>
      <Box>
        <HeaderDesc title={"Requests"} />
        <Box>Table goes here....</Box>
      </Box>
      <Box>{/* <PostingRemarks control={control} /> */}</Box>
      <RoundedButton
        title1="Authorize"
        title2="Reject"
        onClick1={handleAuthorize}
        onClick2={handleReject}
      />
    </Box>
  );
};

export default FundCollectionPosting;
