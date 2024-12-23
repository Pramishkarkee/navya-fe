import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";
import { useMutation } from "@tanstack/react-query";

// For Getting Interest Collection Data List
const getInterestCollectionData = async (
  fromDate: string,
  toDate: string,
  interest: string,
  pageNo: number,
  id: any
) => {
  const response = await axiosInstance.get(
    `accounting/api/v1/fix-deposit/interest-collection/?interest_type=${interest}&page=${pageNo}&search=${id}&from_date=${fromDate}&to_date=${toDate}`
  );
  return response.data;
};

export const useGetInterestCollectionData = (
  fromDate: string,
  toDate: string,
  interest_type: string,
  page_no,
  id: any
) => {
  return useQuery({
    queryKey: [
      "GetInterestCollection",
      fromDate,
      toDate,
      interest_type,
      page_no,
      id,
    ],
    queryFn: () =>
      getInterestCollectionData(fromDate, toDate, interest_type, page_no, id),
    placeholderData: keepPreviousData,
    // retry: false,
    // enabled: !!id,
  });
};

// const getBankDetailData = async (bank_id: number) => {
//   const response = await axiosInstance.get(`/accounting/api/v1/parameters/bank-list/?bank_id=${bank_id}`);
//   return response.data;
// }
// export const useGetBankDetailData = (bankid: number) => {
//   return useQuery({
//     queryKey: ['GetBankDetail', bankid],
//     queryFn: () => getBankDetailData(bankid),
//     // retry: false,
//   })
// }

const getBankDetailData = async () => {
  const response = await axiosInstance.get(
    `/accounting/api/v1/parameters/bank-list/`
  );
  return response.data;
};
export const useGetBankDetailData = () => {
  return useQuery({
    queryKey: ["GetBankDetail"],
    queryFn: () => getBankDetailData(),
    // retry: false,
  });
};

// For Creating Interest Collection Adjustment
export const usePatchInterestCollectionData = () => {
  const queryClient = useQueryClient();

  const createInterestCollectionData = async (data: any) => {
    const response = await axiosInstance.post(
      "/accounting/api/v1/fix-deposit/interest-collection-adjustment/",
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: createInterestCollectionData,
    mutationKey: ["GetInterestCollection"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetInterestCollection"] });
      // queryClient.invalidateQueries({ queryKey: ["fixedDeposit"] });
    },
  });
};

// Posting
export const usePostInterestCollectionPostingList = () => {
  const queryClient = useQueryClient();
  const postInterestCollectionPostingList = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/fix-deposit/interest-collection/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: postInterestCollectionPostingList,
    mutationKey: ["postInterestCollectionPostingList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["postInterestCollectionPostingList"],
      });
    },
  });
};

export const usePostApproveInterestCollectionPosting = () => {
  const queryClient = useQueryClient();
  const ApproveInterestCollectionPosting = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/fix-deposit/interest-collection/approve-pending/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: ApproveInterestCollectionPosting,
    mutationKey: ["postInterestCollectionPostingList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["postInterestCollectionPostingList"],
      });
    },
  });
};

export const usePostRejectInterestCollectionPosting = () => {
  const queryClient = useQueryClient();
  const RejectInterestCollectionPosting = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/fix-deposit/interest-collection/reject-pending/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: RejectInterestCollectionPosting,
    mutationKey: ["postInterestCollectionPostingList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["postInterestCollectionPostingList"],
      });
    },
  });
};
