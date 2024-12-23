import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

const getUnitPurchase = async () => {
  const response = await axiosInstance.get(
    "/sip-up/api/v1/unit-purchase/dashboard/"
  );

  return response.data;
};
export const useGetUnitPurchase = () => {
  return useQuery({
    queryKey: ["DashboardUnitPurchase"],
    queryFn: getUnitPurchase,
    placeholderData: keepPreviousData,
  });
};

const getSIPPurchase = async () => {
  const response = await axiosInstance.get("/sip-up/api/v1/sip/sip-dashboard/");
  return response.data;
};
export const useGetSIPPurchase = () => {
  return useQuery({
    queryKey: ["DashboardSIPPurchase"],
    queryFn: getSIPPurchase,
    placeholderData: keepPreviousData,
  });
};

// For Dashboard NAV History
export const getNAVHistory = async (timePeriod: any) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/nav-value-dashboard/?weeks_days=${timePeriod}`
  );
  return response.data;
};
export const useGetNAVHistory = (timePeriod: string) => {
  return useQuery({
    queryKey: ["DashboardNAVHistory", timePeriod],
    queryFn: () => getNAVHistory(timePeriod),
    placeholderData: keepPreviousData,
    // enabled: false,
  });
};

// For Dashboard SIP Registration
export const getDashboardSIPRegister = async (
  timeDataReg: string,
  valueDataReg: string
) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-dashboard/?weeks_days=${timeDataReg}&con=${valueDataReg}`
  );
  return response.data;
};
export const useGetDashboardSIPRegister = (
  timeReg: string,
  valueReg: string
) => {
  return useQuery({
    queryKey: ["DashboardSIPRegister", timeReg, valueReg],
    queryFn: () => getDashboardSIPRegister(timeReg, valueReg),
    placeholderData: keepPreviousData,
  });
};

// For Dashboard SIP Payment
export const getDashboardSIPPayment = async (
  timeDataPay: string,
  valueDataPay: string
) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-payment-dash/?weeks_days=${timeDataPay}&con=${valueDataPay}`
  );
  return response.data;
};
export const useGetDashboardSIPPayment = (
  timePay: string,
  valuePay: string
) => {
  return useQuery({
    queryKey: ["DashboardSIPPayment", timePay, valuePay],
    queryFn: () => getDashboardSIPPayment(timePay, valuePay),
    placeholderData: keepPreviousData,
  });
};

//  For Dashboard Unit Purchase
export const getDashboardUnitPurchase = async (
  timeDataUnit: string,
  valueDataUnit: string
) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/unit-purchase/unit_purchase_total_amount_one_week/?week_days=${timeDataUnit}&condition=${valueDataUnit}`
  );
  // const response = await axiosInstance.get(`/sip-up/api/v1/unit-purchase/unit_purchase_count_one_week/?week_days=${timeDataUnit}&&con=${valueDataUnit}`);
  return response.data;
};
export const useGetDashboardUnitPurchase = (
  timeUnit: string,
  valueUnit: string
) => {
  return useQuery({
    queryKey: ["DashboardUnitPuchase", timeUnit, valueUnit],
    queryFn: () => getDashboardUnitPurchase(timeUnit, valueUnit),
    placeholderData: keepPreviousData,
  });
};

// For Dashboard Payment Gateway Transactions
export const getPaymentTransaction = async (
  timeDataTran: string,
  methodDataTran: string
) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-payment-transaction/?weeks_days=${timeDataTran}&con=${methodDataTran}`
  );
  return response.data;
};
export const useGetPaymentTransaction = (
  timeTran: string,
  methodTran: string
) => {
  return useQuery({
    queryKey: ["PaymentTransaction", timeTran, methodTran],
    queryFn: () => getPaymentTransaction(timeTran, methodTran),
    placeholderData: keepPreviousData,
  });
};

// For Dashboard SIP cancelation and Amendment
export const getSIPCancellationAndAmendent = async (
  timeDataCan: string,
  valueDataCan: string
) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-cancelled-dashboard/?weeks_days=${timeDataCan}&con=${valueDataCan}`
  );
  return response.data;
};
export const useGetSIPCancellationAndAmendent = (
  timeCan: string,
  valueCan: string
) => {
  return useQuery({
    queryKey: ["SIPCancellationAndAmendent", timeCan, valueCan],
    queryFn: () => getSIPCancellationAndAmendent(timeCan, valueCan),
    placeholderData: keepPreviousData,
  });
};

// For Dashboard Unit Redemption
export const getUnitRedemption = async (
  timeDataRed: string,
  valueDataRed: string
) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/unit-purchase/unit-redemption-dashboard/?week_days=${timeDataRed}&condition=${valueDataRed}`
  );
  return response.data;
};
export const useGetUnitRedemption = (timeRed: string, valueRed: string) => {
  return useQuery({
    queryKey: ["UnitRedemption", timeRed, valueRed],
    queryFn: () => getUnitRedemption(timeRed, valueRed),
    placeholderData: keepPreviousData,
  });
};

// For Dashboard SIP Payment
// export const getSIPPaymentamount = async (amountfield: string) => {
//     const response = await axiosInstance.get(`/sip-up/api/v1/sip/sip-payment-dash/?weeks_days=1week&con=${amountfield}`);
//     return response.data;
// }
// export const useGetSIPPaymentamount = (amountfield: string) => {
//     return useQuery({
//         queryKey: ['PaymentSIPAmount', amountfield],
//         queryFn: () => getSIPPaymentamount(amountfield),
//     })
// }

// export const getSIPPaymentunit = async (unitfield: string) => {
//     const response = await axiosInstance.get(`/sip-up/api/v1/sip/sip-payment-dash/?weeks_days=1week&con=${unitfield}`);
//     return response.data;
// }
// export const useGetSIPPaymentunit = (unitfield: string) => {
//     return useQuery({
//         queryKey: ['PaymentSIPNumber', unitfield],
//         queryFn: () => getSIPPaymentunit(unitfield),
//     })
// }
