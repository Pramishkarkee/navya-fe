import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

// Get the LTP Update data
export const useGetLTPUpdate = (page_no, symbol, pageSize) => {
  const getLTPUpdate = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/parameters/ltp/?page=${page_no}&symbol=${symbol}&per_page=${pageSize}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["ltpupdate", page_no, symbol, pageSize],
    queryFn: getLTPUpdate,
    placeholderData: keepPreviousData,
  });
};

// Post the LTP Upload data File
export const usePostLTPUpload = () => {
  const postLTPUpload = async (data) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/parameters/file-upload/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  };
  return useMutation({
    mutationKey: ["LTPFileUpload"],
    mutationFn: postLTPUpload,
  });
};

export const usePostApproveLTPUpdatePosting = () => {
  const queryClient = useQueryClient();
  const ApproveLTPUpdatePosting = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/parameters/ltp/approve-pending/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: ApproveLTPUpdatePosting,
    mutationKey: ["postFixedDepositPostingList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingFixedDeposit"],
      });
    },
  });
};

export const usePostRejectLTPUpdatePosting = () => {
  const queryClient = useQueryClient();
  const RejectLTPUpdatePosting = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/parameters/ltp/reject-pending/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: RejectLTPUpdatePosting,
    mutationKey: ["postFixedDepositPostingList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingFixedDeposit"],
      });
    },
  });
};
