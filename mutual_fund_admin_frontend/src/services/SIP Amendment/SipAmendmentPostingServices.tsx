import {
  keepPreviousData,
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const useGetAmendmentPostingDetail = (
  fromDate: string,
  toDate: string
) => {
  const amendmentPostingDetail = async () => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/sip/sip-amendment-list/?from_date=${fromDate}&to_date=${toDate}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: fromDate && toDate ? amendmentPostingDetail : skipToken,
    // queryFn: amendmentPostingDetail,
    queryKey: ["amendmentPosting"],
    placeholderData: keepPreviousData,
  });
};

export const usePatchAmendmentPosting = () => {
  const queryClient = useQueryClient();

  const patchAmendmentPosting = async (data) => {
    const response = await axiosInstance.patch(
      `/sip-up/api/v1/sip/sip-amendment-posting/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: patchAmendmentPosting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["amendmentPosting"] });
    },
    // mutationKey: ["amendment"],
  });
};

export const usePatchAmendmentPostingReject = () => {
  const queryClient = useQueryClient();

  const patchAmendmentPostingReject = async (data) => {
    const response = await axiosInstance.patch(
      `/sip-up/api/v1/sip/sip-register-rejected/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: patchAmendmentPostingReject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["amendmentPosting"] });
    },
  });
};
