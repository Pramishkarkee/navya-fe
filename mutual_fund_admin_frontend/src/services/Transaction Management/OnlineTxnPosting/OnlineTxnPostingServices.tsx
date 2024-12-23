import {
  useMutation,
  useQueryClient,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const useGetOnlineTxnPostingList = () => {
  const getOnlineTxnPostingList = async (data) => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/unit-purchase/list/?${data}`
    );
    // console.log(response);
    return response.data.results;
  };
  return useQuery({
    queryFn: getOnlineTxnPostingList,
    queryKey: ["unitpurchase"],
    placeholderData: keepPreviousData,
  });
};

export const useMutationOnlineTxnPosting = () => {
  const queryClient = useQueryClient();

  const authorizeOnlineTxnPosting = async (id: number) => {
    const response = await axiosInstance.patch(
      `/sip-up/api/v1/sip/sip-update/${id}`
    );
    return response.data;
  };

  return useMutation({
    mutationFn: authorizeOnlineTxnPosting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unitpurchase"] });
    },
    onError: (error) => {
      // console.log("Error", error);
    },
  });
};
