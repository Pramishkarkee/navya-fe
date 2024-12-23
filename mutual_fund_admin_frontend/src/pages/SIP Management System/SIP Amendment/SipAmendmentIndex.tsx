import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import AmendmentRequest from "./AmendmentRequest";
import AmendmentPosting from "./AmendmentPosting";
import AmendmentReceipt from "./AmendmentReceipt";
import { useGetUserRoles } from "services/Roles/RolesServices";

const SipAmendmentIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
    disabled?: boolean;
  }

  const { data: userRolesData } = useGetUserRoles();

  const tabData: TabData[] = [
    {
      label: "Amendment Request",
      value: 0,
      component: <AmendmentRequest />,
      disabled:
        userRolesData && userRolesData?.responseData?.sip_amendment
          ? !userRolesData?.responseData?.sip_amendment?.request
          : false,
    },
    {
      label: "Amendment Posting",
      value: 1,
      component: <AmendmentPosting />,
      disabled:
        userRolesData && userRolesData?.responseData?.sip_amendment
          ? !userRolesData?.responseData?.sip_amendment?.posting
          : false,
    },
    {
      label: "Amendment Receipt",
      value: 2,
      component: <AmendmentReceipt />,
      disabled:
        userRolesData && userRolesData?.responseData?.sip_amendment
          ? !userRolesData?.responseData?.sip_amendment?.payment
          : false,
    },
  ];
  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
};

export default SipAmendmentIndex;
