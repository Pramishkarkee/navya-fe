import BasicTabComponent from "components/Tab/Tab";
import SIPRegistrationEntry from "./SIPRegistrationEntry";
import SIPRegistrationEntryPosting from "./SIPRegistrationEntryPosting";
import SIPRegistrationReceipt from "./SIPRegistrationReceipt";
import SIPRegistrationRejected from "./SIPRegistrationRejected";
import { Box } from "@mui/material";
import { useGetUserRoles } from "services/Roles/RolesServices";

const SIPRegistrationIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
    disabled?: boolean;
  }

  const { data: userRolesData } = useGetUserRoles();

  const tabData: TabData[] = [
    {
      label: "SIP Registration Entry",
      value: 0,
      component: <SIPRegistrationEntry />,
      disabled:
        userRolesData && userRolesData?.responseData?.sip_reg
          ? !userRolesData?.responseData?.sip_reg?.entry
          : false,
    },
    {
      label: "SIP Registration Posting",
      value: 1,
      component: <SIPRegistrationEntryPosting />,
      disabled:
        userRolesData && userRolesData?.responseData?.sip_reg
          ? !userRolesData?.responseData?.sip_reg?.posting
          : false,
    },
    {
      label: "SIP Registration Receipt",
      value: 2,
      component: <SIPRegistrationReceipt />,
      disabled:
        userRolesData && userRolesData?.responseData?.sip_reg
          ? !userRolesData?.responseData?.sip_reg?.payment
          : false,
    },
    {
      label: "SIP Registration Rejected",
      value: 2,
      component: <SIPRegistrationRejected />,
      disabled:
        userRolesData && userRolesData?.responseData?.sip_reg
          ? !userRolesData?.responseData?.sip_reg?.payment
          : false,
    },
  ];

  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
};

export default SIPRegistrationIndex;
