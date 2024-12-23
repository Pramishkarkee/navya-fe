import BasicTabComponent from "components/Tab/Tab";
import RedemptionEntry from "./RedemptionEntry";
import RedemptionPosting from "./RedemptionPosting";
import RedemptionReceipts from "./UnitRedemptionTxnReceipts";
import { useGetUserRoles } from "services/Roles/RolesServices";
import { useState } from "react";
import RedemptionSettlement from "./RedemptionSettlement";
import RedemptionSettlementPosting from "./SettlementPosting";

const RedemptionIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
    disabled?: boolean;
  }
  const [boid, setBoid] = useState("");
  const { data: userRolesData } = useGetUserRoles();

  const tabData: TabData[] = [
    {
      label: "Unit Redemption Entry",
      value: 0,
      component: <RedemptionEntry setBoid={setBoid} />,
      disabled:
        userRolesData && userRolesData?.responseData?.up_redemption
          ? !userRolesData?.responseData?.up_redemption?.entry
          : false,
    },
    {
      label: "Unit Redemption Posting",
      value: 1,
      component: <RedemptionPosting setBoid={setBoid} boid_no={boid} />,
      disabled:
        userRolesData && userRolesData?.responseData?.up_redemption
          ? !userRolesData?.responseData?.up_redemption?.posting
          : false,
    },
    {
      label: "Settlement",
      value: 2,
      component: <RedemptionSettlement />,
    },
    {
      label: "Settlement Posting",
      value: 3,
      component: <RedemptionSettlementPosting />,
    },
    {
      label: "Unit Redemption Receipt",
      value: 4,
      component: <RedemptionReceipts />,
      disabled:
        userRolesData && userRolesData?.responseData?.up_redemption
          ? !userRolesData?.responseData?.up_redemption?.payment
          : false,
    },
  ];

  return <BasicTabComponent tabData={tabData} />;
};

export default RedemptionIndex;
