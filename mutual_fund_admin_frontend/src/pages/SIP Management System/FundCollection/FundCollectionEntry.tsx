import { Box, useTheme } from "@mui/material";
import React, { useState } from "react";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import DateField from "components/DateField/DateField";
import RoundedButton from "components/Button/Button";
import RadioButtons from "components/RadioButtons/RadioButtons";
import { Controller, useForm } from "react-hook-form";
import PostingTable from "components/Table/PostingTable";
import { FundCollectionEntryTableHeader } from "constants/FundCollection/FundCollectionEntryTable";

const FundCollectionEntry = () => {
  
  const theme = useTheme();
  const [value, setValue] = useState("Purchase");
  const [selectedRows, setSelectedRows] = useState([])

  const {control} = useForm()

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleProceed = () => {
    // console.log("Proceed clicked");
  };
  const handleReset = () => {
    // console.log("Reset clicked");
  };

  const FundEntryTableData = [
    {
      regNo: 1, 
      name:"Dinesh Khadka",
      boid: 12341234, 
      sipAmt: 2000,
      receivedAmt: 2000,
      balanceAmt: 2000, 
      actionDate: '2024-03-10',
      due: 5
    },
    {
      regNo: 1, 
      name:"Dinesh Khadka",
      boid: 12341234, 
      sipAmt: 2000,
      receivedAmt: 2000,
      balanceAmt: 2000, 
      actionDate: '2024-03-10',
      due: 5
    }
  ]

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <DistributionSchemeField label1="Distribution Center (Request)" control={control} />
      </Box>
      <Box>
        {/* <DateField dateLabel1="Start Date" /> */}
      </Box>
      {/* <RadioButtons value={value} onChange={handleChange} control={control} /> */}
      <Box>
        <PostingTable columns={FundCollectionEntryTableHeader} data={FundEntryTableData} setSelectedRows={setSelectedRows} />
      </Box>
      <Box></Box>
      <Box>
        <RoundedButton
          title1="Proceed"
          title2="Reset"
          onClick1={handleProceed}
          onClick2={handleReset}
        />
      </Box>
    </Box>
  );
};

export default FundCollectionEntry;
