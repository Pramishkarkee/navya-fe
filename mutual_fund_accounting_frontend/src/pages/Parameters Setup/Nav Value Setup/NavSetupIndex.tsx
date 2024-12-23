import NavEntryForm from "./NAVEntryForm";
import NavEntryFormPosting from "./NAVEntryFormPosting";
import BasicTabComponent from "components/Tab/Tab";

export default function NavSetupIndex() {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Entry Form",
      value: 0,
      component: <NavEntryForm />,
    },
    {
      label: "Posting Form",
      value: 1,
      component: <NavEntryFormPosting />,
    },
  ];

  return <BasicTabComponent tabData={tabData} />;
}
