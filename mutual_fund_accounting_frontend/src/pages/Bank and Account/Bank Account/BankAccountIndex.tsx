import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import BankAccountCreate from "./BankAccountCreate";
import BankAccountList from "./BankAccountList";
import BankAccountPosting from "./BankAccountPosting";

const StockIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Bank Account Creation",
      value: 0,
      component: <BankAccountCreate />,
    },
    {
      label: "Bank Account Posting",
      value: 1,
      component: <BankAccountPosting />,
    },
    {
      label: "Bank Account List",
      value: 2,
      component: <BankAccountList />,
    },
  ];

  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
};

export default StockIndex;
