import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import SIPPaymentPosting from "./SipPaymentPosting";
import SIPPaymentApproved from "./SIPPaymentApproved";
import SIPPaymentEntry from "./SIPPaymentEntry";
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
      label: "SIP Payment Entry",
      value: 0,
      component: <SIPPaymentEntry />,
      disabled:
        userRolesData && userRolesData?.responseData?.sip_cancellation
          ? !userRolesData?.responseData?.sip_cancellation?.entry
          : false,
    },
    {
      label: "SIP Payment Posting",
      value: 1,
      component: <SIPPaymentPosting />,
      disabled:
        userRolesData && userRolesData?.responseData?.sip_cancellation
          ? !userRolesData?.responseData?.sip_cancellation?.posting
          : false,
    },
    {
      label: "SIP Payment Approved",
      value: 2,
      component: <SIPPaymentApproved />,
      disabled:
        userRolesData && userRolesData?.responseData?.sip_cancellation
          ? !userRolesData?.responseData?.sip_cancellation?.payment
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
