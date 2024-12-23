import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

// For Getting Market Cap Data List
  const getMarketCapList = async (pageNo : number) => {
    const response = await axiosInstance.get(`/accounting/api/v1/parameters/market-cap/?page=${pageNo}`);
    return response.data;
  }
  export const useGetMarketCapList = (page_number) => {
    return useQuery({
        queryKey: ['GetMarketCapList' , page_number],
        queryFn: () => getMarketCapList(page_number),
        // retry: false,
    })
  }


    // For Creating Market Cap Data
export const usePatchMarketCap = () => {
  const MarketCapRequest = async (data: any) => {
    const response = await axiosInstance.post(
      '/accounting/api/v1/parameters/market-cap/',
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: MarketCapRequest,
    mutationKey: ["MarketCapCreate"],
  });
};

// For Deleting Market Cap Data
export const useDeleteMarketCap = (id_no : number) => {
  const queryClient = useQueryClient();
  const MarketCapDelete = async (id: number) => {
    const response = await axiosInstance.delete(
      `accounting/api/v1/parameters/market-cap/${id}/`
    );
    return response.data;
  };
  return useMutation({
    mutationFn: () => MarketCapDelete(id_no),
    mutationKey: ["GetMarketCapList" , id_no],
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["GetMarketCapList"]});
    }
  });
};