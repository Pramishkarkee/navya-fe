import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import DividendEntry from "./DividendEntry";
import DividendSettlement from "./DividendSettlement";
import SettlementList from "./SettlementList";
import DividendPosting from "./DividendPosting";
import DividendSettlementPosting from "./DividendSettlementPosting";

const DividendIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Dividend Entry",
      value: 0,
      component: <DividendEntry />,
    },
    {
      label: "Dividend Posting",
      value: 1,
      component: <DividendPosting />,
    },
    {
      label: "Dividend Settlement",
      value: 2,
      component: <DividendSettlement />,
    },
    {
      label: "Settlement Posting",
      value: 3,
      component: <DividendSettlementPosting />,
    },
    {
      label: "Settlement List",
      value: 4,
      component: <SettlementList />,
    },
  ];

  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
};

export default DividendIndex;
