import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";



// For Getting Dasboard Secruity Data List
const getSecurityDataList = async (timeRange: string, securityType: string, sectorType: string, bondType: string) => {

  let tempURL = `/accounting/api/v1/dashboard/equity-investment/?range=${timeRange}&investment_type=${securityType}`;
  if(sectorType !== '') {
    tempURL = tempURL + `&sector=${sectorType}`;
    }

  if(bondType !== '') {
    tempURL = tempURL + `&bond=${bondType}`;
    }
  
    const response = await axiosInstance.get(tempURL);
    // const response = await axiosInstance.get(`/accounting/api/v1/dashboard/equity-investment/?range=${timeRange}&investment_type=${securityType}&sector=${sectorType}&bond=${bondType}`);
    return response.data;
  }
  export const useGetSecurityDataList = (timeRange: string, securityType:string, sectorType: string, bondType: string) => {
    return useQuery({
        queryKey: ['GetSecurityDataList' , timeRange, securityType, sectorType, bondType],
        queryFn: () => getSecurityDataList(timeRange, securityType, sectorType, bondType),
        placeholderData: keepPreviousData,
        retry: false,
    })
  }


// For Getting Dashboard NAV Chart Data List
const getNAVChartData = async (timeRange: string) => {
    const response = await axiosInstance.get(`/accounting/api/v1/dashboard/nav-value/?range=${timeRange}`);
    return response.data;
  }
  export const useGetNAVChartData = (timeRange: string) => {
    return useQuery({
        queryKey: ['GetNAVChartData' , timeRange],
        queryFn: () => getNAVChartData(timeRange),
        placeholderData: keepPreviousData,
        retry: false,
    })
  }


// For Getting Dashboard Payable and Receivable Data List
const getPayableReceivableData = async () => {
    const response = await axiosInstance.get(`/accounting/api/v1/dashboard/payables-receivables/`);
    return response.data;
  }
  export const useGetPayableReceivableData = () => {
    return useQuery({
        queryKey: ['GetPayableReceivableData' ],
        queryFn: () => getPayableReceivableData(),
        placeholderData: keepPreviousData,
        retry: false,
    })
  }


// For Getting Dashboard Asset Allocation Data List
const getAssetAllocationData = async () => {
    const response = await axiosInstance.get(`/accounting/api/v1/dashboard/assets/`);
    return response.data;
  }
  export const useGetAssetAllocationData = () => {
    return useQuery({
        queryKey: ['GetAssetAllocationData' ],
        queryFn: () => getAssetAllocationData(),
        placeholderData: keepPreviousData,
        retry: false,
    })
  }


  // For Getting Dashboard Liabilities Data List
const getLiabilitiesData = async () => {
    const response = await axiosInstance.get(`/accounting/api/v1/dashboard/liabilities/`);
    return response.data;
  }
  export const useGetLiabilitiesData = () => {
    return useQuery({
        queryKey: ['GetLiabilitiesData' ],
        queryFn: () => getLiabilitiesData(),
        placeholderData: keepPreviousData,
        retry: false,
    })
  }


// For Getting Dasboard Income and Expense Data List
const getIncomeExpenseData = async (timeRange:string) => {
    const response = await axiosInstance.get(`/accounting/api/v1/dashboard/income-expenses/?range=${timeRange}`);
    return response.data;
  }
  export const useGetIncomeExpenseData = (timeRange:string) => {
    return useQuery({
        queryKey: ['GetIncomeExpenseData', timeRange ],
        queryFn: () => getIncomeExpenseData(timeRange),
        placeholderData: keepPreviousData,
        retry: false,
    })
  }


  // For Getting Dashboard News and Alerts Data List
const getNewsAlertsData = async (timePeriod : string) => {
    const response = await axiosInstance.get(`/accounting/api/v1/dashboard/news-alerts/?date=${timePeriod}`);
    return response.data;
  }
  export const useGetNewsAlertsData = (timePeriod : string) => {
    return useQuery({
        queryKey: ['GetNewsAlertsData', timePeriod ],
        queryFn: () => getNewsAlertsData(timePeriod),
        placeholderData: keepPreviousData,
        retry: 1,
    })
  }
