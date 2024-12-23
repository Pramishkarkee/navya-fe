import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

// For Getting Commission Rate Data List
  const getCommissionRateList = async (pageNo : number) => {
    const response = await axiosInstance.get(`/accounting/api/v1/parameters/commission-charge/?page=${pageNo}`);
    return response.data;
  }
  export const useGetCommissionRateList = (page_number : number) => {
    return useQuery({
        queryKey: ['GetCommissionRateList' , page_number],
        queryFn: () => getCommissionRateList(page_number),
        placeholderData: keepPreviousData,
        // retry: false,
    })
  }

  //For Getting Broker Charge Commison Rate Data
  const getBrokerChargeCommissionRate = async () => {
    const response = await axiosInstance.get(`/accounting/api/v1/parameters/min-commission-charge/`);
    return response.data;
  }
  export const useGetBrokerChargeCommissionRate = () => {
    return useQuery({
        queryKey: ['GetBrokerChargeCommissionRate'],
        queryFn: getBrokerChargeCommissionRate,
        placeholderData: keepPreviousData,
        // retry: false,
    })
  }


  // For updating Broker Charge Commission Rate Data
export const usePatchBrokerChargeCommissionRate = () => {
  const BrokerChargeCommissionRateRequest = async (data: any) => {
    const response = await axiosInstance.patch(
      '/accounting/api/v1/parameters/min-commission-charge/',
      data
    );
    return response.data;
  } 
  return useMutation({
    mutationFn: BrokerChargeCommissionRateRequest,
    mutationKey: ["BrokerChargeCommissionRateCreate"],
  })
}


    // For Creating Commission Rate Data
export const usePatchCommissionRate = () => {
  const CommissionRateRequest = async (data: any) => {
    const response = await axiosInstance.post(
      '/accounting/api/v1/parameters/commission-charge/',
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: CommissionRateRequest,
    mutationKey: ["CommissionRateCreate"],
  });
};


// For Deleting Commission Rate Data
export const useDeleteCommissionRate = (id_no : number) => {
  const queryClient = useQueryClient();
  const CommissionRateDelete = async (id: number) => {
    const response = await axiosInstance.delete(
      `/accounting/api/v1/parameters/commission-charge/${id}/`
    );
    return response.data;
  };
  return useMutation({
    mutationFn: () => CommissionRateDelete(id_no),
    mutationKey: ["GetCommissionRateList" , id_no],
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["GetCommissionRateList"]});
    }
  });
};