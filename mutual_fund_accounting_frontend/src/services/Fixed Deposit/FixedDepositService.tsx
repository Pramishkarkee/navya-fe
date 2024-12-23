import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// For Getting Fixed Deposit Data List
const getFixedDepositData = async (
  pageNo: number,
  start_date: string,
  end_date: string,
  id: any
) => {
  const response = await axiosInstance.get(
    `/accounting/api/v1/fix-deposit/list-fix-deposit/?from_date=${start_date}&page=${pageNo}&to_date=${end_date}&search=${id}`
  );
  return response.data;
};
export const useGetFixedDepositData = (
  page_number: number,
  start_date: string,
  end_date: string,
  id: any
) => {
  return useQuery({
    queryKey: ["GetAllFixedDepositData", page_number, start_date, end_date, id],
    queryFn: () => getFixedDepositData(page_number, start_date, end_date, id),
    placeholderData: keepPreviousData,
    // retry: false,
  });
};

// For Getting All Fixed Deposit Bank List
const getFixedDepositBankList = async () => {
  const response = await axiosInstance.get(
    "/accounting/api/v1/parameters/bank-list/"
  );
  return response.data;
};
export const useGetFixedDepositBankList = () => {
  return useQuery({
    queryKey: ["GetAllFixedDepositDateData"],
    queryFn: getFixedDepositBankList,
    // retry: false,
  });
};

// For Getting All Bank List which has bank balance
const getBankBalanceList = async () => {
  const response = await axiosInstance.get(
    "/accounting/api/v1/banks/bank-balance-list/"
  );
  return response.data;
};
export const useGetBankBalanceList = () => {
  return useQuery({
    queryKey: ["GetBankList"],
    queryFn: getBankBalanceList,
    // retry: false,
  });
};

// For Creating Fixed Deposit Data
export const usePatchFixedDepositData = () => {
  const FixedDepositDataRequest = async (data: any) => {
    const response = await axiosInstance.post(
      "/accounting/api/v1/fix-deposit/create-fix-deposit/",
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: FixedDepositDataRequest,
    mutationKey: ["CreateSectorData"],
  });
};

// Patch Fixed Deposit Data

export const useCancelFixedDeposit = (id) => {
  const queryClient = useQueryClient();
  const cancelDeposit = async (data) => {
    const response = await axiosInstance.patch(
      `/accounting/api/v1/fix-deposit/cancel-fix-deposit/${id}/`,
      data
    );
    return response.data;
  };

  return useMutation({
    mutationKey: ["GetAllFixedDepositData", id],
    mutationFn: cancelDeposit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetAllFixedDepositData"] });
    },
  });
};

export const useSettleFixedDepositData = (id) => {
  const queryClient = useQueryClient();

  const SettleDeposit = async () => {
    const payload = {
      is_mature: "true",
    };

    const response = await axiosInstance.post(
      `/accounting/api/v1/fix-deposit/fix-deposit-mature/${id}/`,
      payload
    );
    return response.data;
  };

  return useMutation({
    mutationFn: SettleDeposit,
    mutationKey: ["GetAllFixedDepositData", id],
    // mutationKey: ["fixedDeposit", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetAllFixedDepositData"] });
      // queryClient.invalidateQueries({ queryKey: ["fixedDeposit"] });
    },
  });
};

// // For Settling Fixed Deposit Data
// export const useSettleFixedDepositData = (id : number) => {
//   const queryClient = useQueryClient();

//   const SettleFixedDepositDataRequest = async (data: any, id : number) => {
//     const response = await axiosInstance.post(
//       `/accounting/api/v1/fix-deposit/fix-deposit-mature/${id}/`,
//       data
//     );
//     return response.data;
//   };
//   return useMutation({
//     mutationKey: ["CreateSectorData" , id],
//     mutationFn: (data : any) => SettleFixedDepositDataRequest(data, id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["GetAllFixedDepositData"] });
//       // queryClient.invalidateQueries({ queryKey: ["fixedDeposit"] });
//     },
//   });
// };

// For Getting Fixed Deposit Cancelled Data List
const getFixedDepositCancelledData = async (
  pageNo: number,
  start_date: string,
  end_date: string,
  id: any
) => {
  const response = await axiosInstance.get(
    `/accounting/api/v1/fix-deposit/list-cancel-fix-deposit/?from_date=${start_date}&page=${pageNo}&to_date=${end_date}&search=${id}`
  );
  return response.data;
};
export const useGetFixedDepositCancelledData = (
  page_number: number,
  start_date: string,
  end_date: string,
  id: any
) => {
  return useQuery({
    queryKey: [
      "GetAllFixedDepositCancelledData",
      page_number,
      start_date,
      end_date,
      id,
    ],
    queryFn: () =>
      getFixedDepositCancelledData(page_number, start_date, end_date, id),
    placeholderData: keepPreviousData,
    // retry: false,
  });
};

export const usePostBankAccountPostingList = () => {
  const queryClient = useQueryClient();
  const postBankAccountPostingList = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/parameters/bank-list/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: postBankAccountPostingList,
    mutationKey: ["postBankAccountPostingList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["postBankAccountPostingList"],
      });
    },
  });
};

// Posting Fixed Deposit Data
export const useGetPendingFixedDepositList = (
  pageNo: number,
  startDate: string,
  endDate: string,
  value: string
) => {
  const getPendingFixedDepositList = async () => {
    const response = axiosInstance.get(
      `/accounting/api/v1/fix-deposit/list-pending/?search=${value}&from_date=${startDate}&page=${pageNo}&to_date=${endDate}`
    );
    return (await response).data;
  };
  return useQuery({
    queryKey: ["pendingFixedDeposit"],
    queryFn: getPendingFixedDepositList,
  });
};

export const usePostApproveFixedDepositPosting = () => {
  const queryClient = useQueryClient();
  const ApprovePendingFixedDeposit = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/fix-deposit/approve-pending/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: ApprovePendingFixedDeposit,
    mutationKey: ["postFixedDepositPostingList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingFixedDeposit"],
      });
    },
  });
};

export const usePostRejectFixedDepositPosting = () => {
  const queryClient = useQueryClient();
  const RejectPendingFixedDeposit = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/fix-deposit/reject-pending/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: RejectPendingFixedDeposit,
    mutationKey: ["postFixedDepositPostingList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingFixedDeposit"],
      });
    },
  });
};

export const usePostApproveCancelFixedDepositPosting = () => {
  const queryClient = useQueryClient();
  const ApprovePendingCancelFixedDeposit = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/fix-deposit/list-fix-deposit/approve-pending/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: ApprovePendingCancelFixedDeposit,
    mutationKey: ["postFixedDepositPostingList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingFixedDeposit"],
      });
    },
  });
};

export const usePostRejectCancelFixedDepositPosting = () => {
  const queryClient = useQueryClient();
  const RejectPendingCancelFixedDeposit = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/fix-deposit/list-fix-deposit/reject-pending/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: RejectPendingCancelFixedDeposit,
    mutationKey: ["postFixedDepositPostingList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingFixedDeposit"],
      });
    },
  });
};
