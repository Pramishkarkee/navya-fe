import { Box } from "@mui/material";
import FundCollectionEntry from "./FundCollectionEntry";
import FundCollectionPosting from "./FundCollectionPosting";
import BasicTabComponent from "components/Tab/Tab";

const FundCollectionIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }
  const tabData: TabData[] = [
    {
      label: "Fund Collection Entry",
      value: 0,
      component: <FundCollectionEntry />,
    },
    {
      label: "Fund Collection Posting",
      value: 1,
      component: <FundCollectionPosting />,
    },
  ];
  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
};

export default FundCollectionIndex;
