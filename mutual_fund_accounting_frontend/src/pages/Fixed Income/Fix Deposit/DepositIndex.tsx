import FixedDepositEntry from "./FixedDepositEntry";
import FixedDepositList from "./FixedDepositList";
import CancelledFixedDepositList from "./CancelledFixedDepositList";
import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import FixedDepositPosting from "./FixedDepositPosting";
import CancelledFixedDepositPosting from "./CancelledFixedDepositePosting";

const DepositIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Fixed Deposit Entry",
      value: 0,
      component: <FixedDepositEntry />,
    },
    {
      label: "Fixed Deposits Posting",
      value: 1,
      component: <FixedDepositPosting />,
    },
    {
      label: "List of Fixed Deposits",
      value: 2,
      component: <FixedDepositList />,
    },
    {
      label: "Cancelled Fixed Deposit Posting",
      value: 3,
      component: <CancelledFixedDepositPosting />,
    },
    {
      label: "Cancelled Fixed Deposit List",
      value: 4,
      component: <CancelledFixedDepositList />,
    },
  ];

  return (
    <Box sx={{ py: 1 }}>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
};

export default DepositIndex;
