import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import LTPUpdateImport from "./LTPUpdateImport";
import LTPUpdateList from "./LTPList";
import LTPUpdatePosting from "./LTPUpdatePosting";
import LTPUpdateHistory from "./LTPUpdateHistory";

export default function LTPdateIndex() {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "LTP Update Import",
      value: 0,
      component: <LTPUpdateImport />,
    },
    {
      label: "LTP Update Posting",
      value: 1,
      component: <LTPUpdatePosting />,
    },
    {
      label: "LTP Update List ",
      value: 2,
      component: <LTPUpdateList />,
    },
    // {
    //   label: "LTP Update History (WIP)",
    //   value: 2,
    //   component: <LTPUpdateHistory />,
    // },
  ];

  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
}
