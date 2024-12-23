import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import OnlineSipPaymentPosting from "./OnlineSipPaymentPosting";
import OnlineSipRegPosting from "./OnlineSipRegPosting";
import { useGetUserRoles } from "services/Roles/RolesServices";

const OnlineSipIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
    disabled: boolean;
  }
  const { data: userRolesData } = useGetUserRoles();

  const tabData: TabData[] = [
    {
      label: "Online SIP Registration Posting",
      value: 0,
      component: <OnlineSipRegPosting />,
      disabled:
        userRolesData && userRolesData?.responseData?.sip_onlineSip
          ? !userRolesData?.responseData?.sip_onlineSip?.reg
          : false,
    },
    {
      label: "Online SIP Payment Posting",
      value: 1,
      component: <OnlineSipPaymentPosting />,
      disabled:
        userRolesData && userRolesData?.responseData?.sip_onlineSip
          ? !userRolesData?.responseData?.sip_onlineSip?.posting
          : false,
    },
  ];

  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
};

export default OnlineSipIndex;
