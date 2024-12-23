import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

//get method for unrealized gain loss
const getUnrealizedgainLoss = async (pageNo : number, pageSize:number) => {
  const response = await axiosInstance.get(
    `/accounting/api/v1/stock_transactions/stock-change-price/?page=${pageNo}&per_page=${pageSize}`
  );
  return response.data;
};

export const useGetUnrealizedGainLossSummary = (pageNo: number, pageSize:number) => {
  return useQuery({
    queryKey: ["unrealizedGainLoss" , pageNo, pageSize],
    queryFn: ()=> getUnrealizedgainLoss(pageNo, pageSize),
    placeholderData: keepPreviousData,
  });
};


//Post method for unrealized gain loss summary
export const usePostUnrealizedGainLossSummary = () => {
  const queryClient = useQueryClient();

  const postUnrealizedgainLoss = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/stock_transactions/stock-change-price/`,
      data
    );
    return response.data;
  };

  return useMutation({
    mutationFn: postUnrealizedgainLoss,
    mutationKey: ["unrealizedGainLoss"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unrealizedGainLoss"] });
    },
  });
};
