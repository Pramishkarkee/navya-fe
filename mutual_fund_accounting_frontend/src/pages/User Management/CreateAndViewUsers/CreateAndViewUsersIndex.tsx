import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import CreateUser from "./CreateUser";
import ViewUser from "./ViewUser";
// import BankPosting from "./Bank Posting/BankPosting";

export default function BankIndex() {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Create User",
      value: 0,
      component: <CreateUser />,
    },
    {
      label: "View User",
      value: 1,
      component: <ViewUser />,
    },
   

  ];

  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
}
