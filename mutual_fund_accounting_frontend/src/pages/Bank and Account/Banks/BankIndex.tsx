import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import BankAndBranches from "./Bank and Branches/BankAndBranches";
import BankList from "./Bank List/BankList";
// import BankPosting from "./Bank Posting/BankPosting";

export default function BankIndex() {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Bank Entry",
      value: 0,
      component: <BankAndBranches />,
    },
    {
      label: "List of Banks",
      value: 1,
      component: <BankList />,
    },

    // {
    //   label: "Bank Posting (WIP)",
    //   value: 2,
    //   component: <BankPosting />,
    // },
  ];

  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
}
