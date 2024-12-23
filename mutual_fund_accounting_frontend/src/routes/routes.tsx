/* eslint-disable react-refresh/only-export-components */

import { lazy } from "react";
import ThresholdSetup from "pages/Parameters Setup/Sector Setup/SectorSetup";
import FeesAndCharges from "pages/Parameters Setup/Fees and Charges/FeesAndCharges";
import SipAndUnitParameters from "pages/Parameters Setup/SIP and Unit Parameters/SipAndUnitParameter";
import BankAccountAsssignment from "pages/Bank and Account/Bank Account Assignment/BankAccountAssignment";
import InvestmentRestrictions from "pages/Parameters Setup/Investment Restrictions/InvestmentRestrictions";

const Dashboard = lazy(() => import("pages/Dashboard"));
const LTPdateIndex = lazy(() => import("pages/DayClose/LTPUpdate/LTPIndex"));
const BankIndex = lazy(() => import("pages/Bank and Account/Banks/BankIndex"));
const Sector = lazy(() => import("pages/Stock and Brokers/Sector/SectorIndex"));

const IPOIndex = lazy(() => import("pages/IPORightShareAndAuction/IPO/IpoIndex"));
const ActivityLogs = lazy(() => import("pages/Front Office/Activity/ActivityLogs"));
const DayCloseIndex = lazy(() => import("pages/DayClose/DayCloseMain/DayCloseIndex"));
const TrialBalance = lazy(() => import("pages/Reporting/Trial Balance/TrialBalance"));
const BalanceSheet = lazy(() => import("pages/Reporting/Balance Sheet/BalanceSheet"));
const DepositIndex = lazy(() => import("pages/Fixed Income/Fix Deposit/DepositIndex"));
const SEBONCharge = lazy(() => import("pages/Parameters Setup/SebonCharge/SebonCharge"));
const DividendIndex = lazy(() => import("pages/Stock and Brokers/Dividend/DividendIndex"));
const LedgerHead = lazy(() => import("pages/GL Account/Ledger Head Setup/LedgerSetupIndex"));
const CGTChargeIndex = lazy(() => import("pages/Parameters Setup/CGTCharge/CGTChargeIndex"));
const CAIndex = lazy(() => import("pages/IPORightShareAndAuction/Corporate Auction/CAIndex"));
const StockIndex = lazy(() => import("pages/Stock and Brokers/Stock Broker/StockBrokerIndex"));
const StockMappingIndex = lazy(() => import("pages/Stock and Brokers/Stock Setup/StockMapping"));
const ExitLoadSetup = lazy(() => import("pages/Parameters Setup/Exit Load Setup/ExitLoadSetup"));
const MarketCapSetup = lazy(() => import("pages/Parameters Setup/MarketCapSetup/MarketCapIndex"));
const StockInformation = lazy(() => import("pages/Reporting/Stock Infromation/StockInformation"));
const CommissionRate = lazy(() => import("pages/Parameters Setup/CommissionRate/CommissionIndex"));
const ViewJournalEntries = lazy(() => import("pages/GL Account/Journal Entry/ViewJournalEntries"));
const UsersAndRoles = lazy(() => import("pages/User Management/CreateAndViewUsers/UsersAndRoles"));
const SubLedgerHead = lazy(() => import("pages/GL Account/Ledger Head Setup/SubLedgerSetupIndex"));
const LedgerDetailsIndex = lazy(() => import("pages/GL Account/Ledger Details/LedgerDetailsIndex"));
const BankAccountIndex = lazy(() => import("pages/Bank and Account/Bank Account/BankAccountIndex"));
const JournalVoucherIndex = lazy(() => import("pages/GL Account/Journal Entry/JournalVoucherIndex"));
const BatchTransactionIndex = lazy(() => import("pages/Stock and Brokers/Batch Transaction/BatchIndex"));
const GeneralParameters = lazy(() => import("pages/Parameters Setup/GeneralParameters/GeneralParameter"));
const LedgerTransactionDetails = lazy(() => import("pages/Reporting/SubLedgerDetails/LedgerTrxnDetails"));
const SubLedgerDetailsIndex = lazy(() => import("pages/GL Account/Ledger Details/SubLedgerDetailsIndex"));
const StockTransferIndex = lazy(() => import( "pages/Stock and Brokers/TransferStock/StockTransferIndex"));
const BondAndDebenture = lazy(() => import("pages/Fixed Income/Bond And Debenture/BondAndDebentureIndex"));
const SchemeCreation = lazy(() => import("pages/Parameters Setup/MutualFundAndSchemeSetup/SchemeCreation"));
const MutualFundSetup = lazy(() =>import("pages/Parameters Setup/MutualFundAndSchemeSetup/MutualFundSetup"));
const InvestmentStatusReport = lazy(() => import("pages/Reporting/Investment Status/SummarizedInformation"));
const RolesAndPermissions = lazy(() => import("pages/User Management/RolesAndPermission/RolesAndPermission"));
const SubLedgerTransactionDetails = lazy(() => import("pages/Reporting/SubLedgerDetails/SubLedgerTrxnDetails"));
const StockTransactionIndex = lazy(() =>import("pages/Stock and Brokers/Stock Transaction/StockTransactionIndex"));
const IntrestCollectionIndex = lazy (() => import("pages/Fixed Income/Interest Collection/InterestCollectionIndex"));
const UnrealizedGainLossSummary = lazy(() =>import("pages/DayClose/UnrealizedGainLossSummary/UnrealizedGainLossSummary"));
const IPORightshareParameter = lazy(() =>import("pages/Parameters Setup/IPORightshareParameter/IPORightshareParameter" ));
const IncomeStatement = lazy(() => import("pages/Reporting/Income Statement/IncomeStatement"));

export const routes = [
  {
    path: "/dashboard",
    component: <Dashboard />,
  },

  {
    path: "/users",
    component: <UsersAndRoles />,
  },
  {
    path: "/roles-and-permissions",
    component: <RolesAndPermissions />,
  },

  //Parameter Setup Routes
  {
    path: "/general-parameters",
    component: <GeneralParameters />,
  },
  {
    path: "/ipo-fpo-parameters",
    component: <IPORightshareParameter />,
  },
  {
    path: "/mutual-fund-scheme-setup",
    component: <MutualFundSetup />,
  },
  {
    path: "/scheme-creation",
    component: <SchemeCreation />,
  },
  {
    path: "/market-cap-setup",
    component: <MarketCapSetup />,
  },
  {
    path: "/commission-rate",
    component: <CommissionRate />,
  },
  {
    path: "/sebon-charge",
    component: <SEBONCharge />,
  },
  {
    path: "/sector-threshold-setup",
    component: <ThresholdSetup />,
  },
  {
    path: "/fees-and-taxes-setup",
    component: <FeesAndCharges />,
  },

  // Banks and Accounts routes
  {
    path: "/banks",
    component: <BankIndex />,
  },
  {
    path: "/bank-account",
    component: <BankAccountIndex />,
  },
  {
    path: "/bank-account-assignment",
    component: <BankAccountAsssignment />,
  },

  //Stocks and Brokers routes
  {
    path: "/sector-setup",
    component: <Sector />,
  },
  {
    path: "/stock-bond-setup",
    component: <StockMappingIndex />,
  },
  {
    path: "/stock-broker-setup",
    component: <StockIndex />,
  },
  {
    path: "/stock-transactions",
    component: <StockTransactionIndex />,
  },
  {
    path: "/dividend",
    component: <DividendIndex />,
  },
  {
    path: "/transfer-stock",
    component: <StockTransferIndex />,
  },
  {
    path: "/batch-transaction",
    component: <BatchTransactionIndex />,
  },

  // IPO/FPO/Right and Auction routes
  {
    path: "/ipo-fpo-rightshare",
    component: <IPOIndex />,
  },
  {
    path: "/corporate-auction",
    component: <CAIndex />,
  },

  // Fixed Income Routes
  {
    path: "/fixed-deposit",
    component: <DepositIndex />,
  },
  {
    path: "/bond-and-debenture",
    component: <BondAndDebenture />,
  },
  {
    path: "/interest-collection",
    component: <IntrestCollectionIndex />,
  },

  //Gl Account routes
  {
    path: "/ledger-head-setup",
    component: <LedgerHead />,
  },
  {
    path: "/sub-ledger-head-setup",
    component: <SubLedgerHead />,
  },
  {
    path: "/journal-voucher",
    component: <JournalVoucherIndex />,
  },
  {
    path: "ledger-details",
    component: <LedgerDetailsIndex />,
  },
  {
    path: "/sub-ledger-details",
    component: <SubLedgerDetailsIndex />,
  },
  {
    path: "/journal-entries",
    component: <ViewJournalEntries />,
  },
  {
    path: "/ledger/:code/transaction",
    component: <LedgerTransactionDetails />,
  },
  {
    path: "/sub-ledger/:code/transaction",
    component: <SubLedgerTransactionDetails />,
  },

  // Reporting Routes
  {
    path: "/stock-information",
    component: <StockInformation />,
  },
  {
    path: "/trial-balance",
    component: <TrialBalance />,
  },
  {
    path: "/income-statement",
    component: <IncomeStatement />,
  },
  {
    path: "/investment-status",
    component: <InvestmentStatusReport />,
  },
  {
    path: "/balance-sheet",
    component: <BalanceSheet />,
  },
  // {
  //   path: "/payables-and-receivables",
  //   component: <PayablesAndReceivables />,
  // },
  // {
  //   path: "/cash-flow",
  //   component: <CashFlow />,
  // },

  // Day Close routes
  {
    path: "/ltp-update",
    component: <LTPdateIndex />,
  },
  {
    path: "/unrealized-gain-loss-summary",
    component: <UnrealizedGainLossSummary />,
  },
  {
    path: "/day-close",
    component: <DayCloseIndex />,
  },

  {
    path: "/sip-unit-parameter",
    component: <SipAndUnitParameters />,
  },
  {
    path: "/investment-restrictions",
    component: <InvestmentRestrictions />,
  },
  {
    path: "/cgt-charge-list",
    component: <CGTChargeIndex />,
  },

  {
    path: "/exit-load-setup",
    component: <ExitLoadSetup />,
  },

  {
    path: "/activity-logs",
    component: <ActivityLogs />,
  },
];
