import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

// For Getting ALL Unlisted Stock Data List
const getAllUnlistedStockData = async (id: string) => {
  const response = await axiosInstance.get(
    `/accounting/api/v1/parameters/transfer-share/?search=${id}`
  );
  return response.data;
};
export const useGetAllUnlistedStockData = (id: string) => {
  return useQuery({
    queryKey: ["GetAllUnlistedStockData", id],
    queryFn: () => getAllUnlistedStockData(id),
    // retry: false,
  });
};

// For Creating Unlisted Stock Data Transfer
export const useTransferUnlistedStockData = () => {
  const createTransferStockrData = async (data: any) => {
    const response = await axiosInstance.post(
      "/accounting/api/v1/parameters/transfer-share/",
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: createTransferStockrData,
    mutationKey: ["CreateUnlistedStockData"],
  });
};

export const usePostTransferUnlistedStockPosting = () => {
  const queryClient = useQueryClient();
  const PostTransferUnlistedStockPosting = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/parameters/transfer-share/approve/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: PostTransferUnlistedStockPosting,
    mutationKey: ["PostTransferUnlistedStockPosting"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["PostTransferUnlistedStockPosting"],
      });
    },
  });
};

export const usePostTransferUnlistedStockPostingReject = () => {
  const queryClient = useQueryClient();
  const PostTransferUnlistedStockPostingReject = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/parameters/transfer-share/reject/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: PostTransferUnlistedStockPostingReject,
    mutationKey: ["PostTransferUnlistedStockPosting"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["PostTransferUnlistedStockPosting"],
      });
    },
  });
};
