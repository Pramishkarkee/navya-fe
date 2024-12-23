import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import InterestCollection from "./InterestCollection";
import CollectionPosting from "./CollectionPosting";
import InterestCollectionList from "./InterestCollectionList";

const IntrestCollectionIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Collection Entry",
      value: 0,
      component: <InterestCollection />,
    },
    {
      label: "Collection Posting",
      value: 1,
      component: <CollectionPosting />,
    },
    {
      label: "Collection List",
      value: 1,
      component: <InterestCollectionList />,
    },
  ];

  return (
    <Box sx={{ py: 1 }}>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
};

export default IntrestCollectionIndex;
