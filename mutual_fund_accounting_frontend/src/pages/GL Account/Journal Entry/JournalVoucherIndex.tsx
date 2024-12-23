import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import JournalEntryIndex from "./JournalEntryIndex";
import JournalVoucherPosting from "./JournalVoucherPosting";

export default function JournalVoucherIndex() {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Journal Entry",
      value: 0,
      component: <JournalEntryIndex />,
    },
    {
      label: "Journal Entry Posting",
      value: 2,
      component: <JournalVoucherPosting />,
    },
  ];

  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
}
