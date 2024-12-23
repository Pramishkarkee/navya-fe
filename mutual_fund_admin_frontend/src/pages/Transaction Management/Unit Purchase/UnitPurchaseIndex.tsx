import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import UnitPurchaseEntry from "./UnitPurchaseEntry";
import UnitPurchasePosting from "./UnitPurchasePosting";
import UnitPurchaseReceipts from "./UnitTxnReceipts";
import UnitPurchaseReject from "./UnitTxnReject";
import { useGetUserRoles } from "services/Roles/RolesServices";

const UnitPurchaseIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
    disabled: boolean;
  }
  const { data: userRolesData } = useGetUserRoles();

  const tabData: TabData[] = [
    {
      label: "Unit Purchase Entry",
      value: 0,
      component: <UnitPurchaseEntry />,
      disabled:
        userRolesData && userRolesData?.responseData?.up_create
          ? !userRolesData?.responseData?.up_create?.entry
          : false,
    },
    {
      label: "Unit Purchase Posting",
      value: 1,
      component: <UnitPurchasePosting />,
      disabled:
        userRolesData && userRolesData?.responseData?.up_create
          ? !userRolesData?.responseData?.up_create?.posting
          : false,
    },
    {
      label: "Unit Purchase Receipt",
      value: 2,
      component: <UnitPurchaseReceipts />,
      disabled:
        userRolesData && userRolesData?.responseData?.up_create
          ? !userRolesData?.responseData?.up_create?.payment
          : false,
    },
    {
      label: "Unit Purchase Rejected",
      value: 3,
      component: <UnitPurchaseReject />,
      disabled:
        userRolesData && userRolesData?.responseData?.up_create
          ? !userRolesData?.responseData?.up_create?.payment
          : false,
    },
  ];

  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
};

export default UnitPurchaseIndex;
