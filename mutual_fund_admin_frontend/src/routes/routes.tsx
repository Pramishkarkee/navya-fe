/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";

const Dashboard = lazy(() => import("pages/Dashboard"));
const OnlineSipIndex = lazy(
  () => import("pages/SIP Management System/Online SIP/OnlineSipIndex")
);
const SipAmendmentIndex = lazy(
  () => import("pages/SIP Management System/SIP Amendment/SipAmendmentIndex")
);
const OnlineTxnPosting = lazy(
  () =>
    import(
      "pages/Transaction Management/Online Transaction Posting/OnlineTxnPosting"
    )
);
const UnitPurchaseIndex = lazy(
  () => import("pages/Transaction Management/Unit Purchase/UnitPurchaseIndex")
);
const RedemptionIndex = lazy(
  () => import("pages/Transaction Management/Unit Redemption/RedemptionIndex")
);
const UnitTxnReceipts = lazy(
  () =>
    import(
      "pages/Transaction Management/Unit Transaction Receipts/UnitTxnReceipts"
    )
);
const UnitRedemptionTxnReceipts = lazy(
  () =>
    import(
      "pages/Transaction Management/Unit Transaction Receipts/UnitRedemptionTxnReceipts"
    )
);
const FundCollectionIndex = lazy(
  () => import("pages/SIP Management System/FundCollection/FundCollectionIndex")
);
const SIPRegistrationIndex = lazy(
  () =>
    import("pages/SIP Management System/SIP Registration/SIPRegistrationIndex")
);
const SIPCancellationIndex = lazy(
  () =>
    import("pages/SIP Management System/SIPCancellation/SIPCancellationIndex")
);

const HolderStatement = lazy(
  () => import("pages/SIP Management System/SIP Statement/HolderStatement")
);
const SipPaymentIndex = lazy(
  () => import("pages/SIP Management System/SIP Payment/SIPPaymentIndex")
);
const ShareHolderInformation = lazy(
  () =>
    import(
      "pages/Holder Management/ShareHolderInformation/ShareHolderInformation"
    )
);
const BOIDCorrection = lazy(
  () => import("pages/Holder Management/BOIDCorrection/BOIDCorrection")
);
const SIPDetails = lazy(
  () => import("pages/Holder Management/ShareHolderInformation/SIPDetails")
);
const UnitDetails = lazy(
  () => import("pages/Holder Management/ShareHolderInformation/UnitDetails")
);
const PaymentReports = lazy(() => import("pages/Reports/PaymentReports"));

export const routes = [
  {
    path: "/dashboard",
    component: <Dashboard />,
  },
  // {
  //   path: "/create-users",
  //   component: <CreateUsersIndex />,
  // },
  // {
  //   path: "/view-users",
  //   component: <ViewUsersIndex />,
  // },
  {
    path: "/share-holder-information",
    component: <ShareHolderInformation />,
  },
  {
    path: "/boid-correction",
    component: <BOIDCorrection />,
  },
  {
    path: "/unit-purchase",
    component: <UnitPurchaseIndex />,
  },
  {
    path: "/unit-redemption",
    component: <RedemptionIndex />,
  },
  {
    path: "/online-transaction-posting",
    component: <OnlineTxnPosting />,
  },
  {
    path: "/unit-transaction-receipts",
    component: <UnitTxnReceipts />,
  },
  {
    path: "/unit-redemption-transaction-receipts",
    component: <UnitRedemptionTxnReceipts />,
  },

  //SIP Routes
  {
    path: "/sip-registration",
    component: <SIPRegistrationIndex />,
  },
  {
    path: "/fund-collection",
    component: <FundCollectionIndex />,
  },
  {
    path: "/verify-online-sip",
    component: <OnlineSipIndex />,
  },
  {
    path: "/sip-amendment",
    component: <SipAmendmentIndex />,
  },
  {
    path: "/sip-cancellation",
    component: <SIPCancellationIndex />,
  },
  {
    path: "/sip-holders-statement",
    component: <HolderStatement />,
  },
  {
    path: "/sip-payment",
    component: <SipPaymentIndex />,
  },
  {
    path: "/sip-details",
    component: <SIPDetails />,
  },
  {
    path: "/unit-details",
    component: <UnitDetails />,
  },
  {
    path: "/reports",
    component: <PaymentReports />,
  },
];

//Routes without lazyload

// import Dashboard from "pages/Dashboard";
// import OnlineSipIndex from "pages/SIP Management System/Online SIP/OnlineSipIndex";
// import SipAmendmentIndex from "pages/SIP Management System/SIP Amendment/SipAmendmentIndex";
// import OnlineTxnPosting from "pages/Transaction Management/Online Transaction Posting/OnlineTxnPosting";
// import UnitPurchaseIndex from "pages/Transaction Management/Unit Purchase/UnitPurchaseIndex";
// import RedemptionIndex from "pages/Transaction Management/Unit Redemption/RedemptionIndex";
// import UnitTxnReceipts from "pages/Transaction Management/Unit Transaction Receipts/UnitTxnReceipts";
// import UnitRedemptionTxnReceipts from "pages/Transaction Management/Unit Transaction Receipts/UnitRedemptionTxnReceipts";
// import FundCollectionIndex from "pages/SIP Management System/FundCollection/FundCollectionIndex";
// import SIPRegistrationIndex from "pages/SIP Management System/SIP Registration/SIPRegistrationIndex";
// import SIPCancellationIndex from "pages/SIP Management System/SIPCancellation/SIPCancellationIndex";
// import CreateUsersIndex from "pages/UserManagement/CreateUser/CreateUser";
// import ViewUsersIndex from "pages/UserManagement/ViewUser/ViewUser";
// import HolderStatement from "pages/SIP Management System/SIP Statement/HolderStatement";
// import SipPaymentEntry from "pages/SIP Management System/SIP Payment/SipPaymentEntry";
// import ShareHolderInformation from "pages/Holder Management/ShareHolderInformation/ShareHolderInformation";
// import BOIDCorrection from "pages/Holder Management/BOIDCorrection/BOIDCorrection";
// import SIPDetails from "pages/Holder Management/ShareHolderInformation/SIPDetails";
// import UnitDetails from "pages/Holder Management/ShareHolderInformation/UnitDetails";
