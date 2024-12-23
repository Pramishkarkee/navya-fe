import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import SIPCancellationEntry from "./SIPCancellationEntry";
import SIPCancellationPosting from "./SIPCancellationPosting";
import { useGetUserRoles } from "services/Roles/RolesServices";

const SIPCancellationIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
    disabled?: boolean;
  }

  const { data: userRolesData } = useGetUserRoles();

  const tabData: TabData[] = [
    {
      label: "SIP Cancellation Entry",
      value: 0,
      component: <SIPCancellationEntry />,
      disabled:
        userRolesData && userRolesData?.responseData?.sip_cancellation
          ? !userRolesData?.responseData?.sip_cancellation?.entry
          : false,
    },
    {
      label: "SIP Cancellation Posting",
      value: 1,
      component: <SIPCancellationPosting />,
      disabled:
        userRolesData && userRolesData?.responseData?.sip_cancellation
          ? !userRolesData?.responseData?.sip_cancellation?.posting
          : false,
    },
  ];
  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
};

export default SIPCancellationIndex;
