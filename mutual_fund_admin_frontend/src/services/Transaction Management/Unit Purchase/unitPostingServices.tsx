import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const useGetOnlineUnitPurchaseList = (
  page: number,
  start_date: string,
  end_date: string
) => {
  const getUnitOnlinePurchaseList = async () => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/unit-purchase/list/?page=${page}&is_rejected=False&portal=Online&start_date=${start_date}&end_date=${end_date}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: getUnitOnlinePurchaseList,
    queryKey: ["unitpurchaseOnline", page, start_date, end_date],
    placeholderData: keepPreviousData,
  });
};

// export const useGetUnitPurchaseList = (fromDate : string , toDate : string ,page_no : number ,  ) => {
//   const getUnitPurchaseList = async () => {
//     const response = await axiosInstance.get(
//       // `/sip-up/api/v1/unit-purchase/list/?page=${page}&is_approved=False&portal=Office@from_date`
//       `sip-up/api/v1/unit-purchase/list/?start_date=${fromDate}&page=${page_no}&end_date=${toDate}&is_approved=False&portal=Office`

export const useGetOnlineUnitPurchaseSearchList = (boid_number) => {
  const getUnitOnlinePurchaseSearchList = async () => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/unit-purchase/list/?boid_number=${boid_number}&is_approved=False`
    );
    return response.data;
  };
  return useQuery({
    // <<<<<<< @fix/Dashboard
    //     queryFn: getUnitPurchaseList,
    //     queryKey: ["unitpurchase", page_no , fromDate , toDate],
    // =======
    queryFn: getUnitOnlinePurchaseSearchList,
    queryKey: ["unitpurchaseOnlineSearch", boid_number],
    enabled: !!boid_number,
    placeholderData: keepPreviousData,
  });
};

export const useMutationUnitPurchasePosting = () => {
  const queryClient = useQueryClient();

  const authorizeUnitPosting = async (data) => {
    const response = await axiosInstance.put(
      `/sip-up/api/v1/unit-purchase/authorize/`,
      data
    );
    return response.data;
  };

  return useMutation({
    mutationFn: authorizeUnitPosting,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["unitpurchase"] });
    },
    onError: (error) => {
      // console.log("Error", error);
    },
  });
};
export const useMutationUnitPurchaseRejectPosting = () => {
  const queryClient = useQueryClient();

  const authorizeUnitRejectPosting = async (data) => {
    const response = await axiosInstance.put(
      `/sip-up/api/v1/unit-purchase/reject/`,
      data
    );
    return response.data;
  };

  return useMutation({
    mutationFn: authorizeUnitRejectPosting,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["unitpurchase"] });
    },
    onError: (error) => {
      // console.log("Error", error);
    },
  });
};

export const useGetUnitPurchaseList = (
  fromDate: string,
  toDate: string,
  page_no: number
) => {
  const getUnitPurchaseList = async () => {
    const response = await axiosInstance.get(
      `sip-up/api/v1/unit-purchase/list/?start_date=${fromDate}&page=${page_no}&end_date=${toDate}&is_approved=False&is_rejected=False&portal=Office`
    );
    return response.data;
  };
  return useQuery({
    queryFn: getUnitPurchaseList,
    queryKey: ["unitpurchase", page_no, fromDate, toDate],
    placeholderData: keepPreviousData,
  });
};

export const useGetUnitPurchaseSearchList = (boid_number) => {
  const getUnitPurchaseSearchList = async () => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/unit-purchase/list/?boid_number=${boid_number}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: getUnitPurchaseSearchList,
    queryKey: ["unitpurchaseSearch", boid_number],
    enabled: !!boid_number,
    placeholderData: keepPreviousData,
  });
};

// Export service

// export const useGetOnlineUnitPurchaseExportList = () => {
//   const getUnitOnlinePurchaseExportList = async () => {
//     const response = await axiosInstance.get(
//       `/sip-up/api/v1/unit-purchase/list/?export=true`
//     );
//     return response.data;
//   };
//   return useQuery({
//     queryFn: getUnitOnlinePurchaseExportList,
//     queryKey: ["unitpurchaseOnlineExport",],
//     // enabled: !!boid_number,
//   });
// };
