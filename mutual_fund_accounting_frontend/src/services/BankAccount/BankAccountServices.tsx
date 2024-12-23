import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// For Getting Bank List Data
const getBankListData = async () => {
  const response = await axiosInstance.get(
    `/accounting/api/v1/parameters/bank-list/`
  );
  return response.data;
};
export const useGetBankListData = () => {
  return useQuery({
    queryKey: ["GetAllBankListData"],
    queryFn: () => getBankListData(),
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

// For Getting List of Bank Account Created
const getBankAccontCreatedList = async () => {
  const response = await axiosInstance.get("/accounting/api/v1/banks/accounts");
  return response.data;
};
export const useGetBankAccontCreatedList = () => {
  return useQuery({
    queryKey: ["GetBankAccontCreatedList"],
    queryFn: getBankAccontCreatedList,
    placeholderData: keepPreviousData,
    // retry: false,
  });
};

// For Creating Bank Account Data
export const useCreateBankAccount = () => {
  const queryClient = useQueryClient();
  const CreateBankAccount = async (data: any) => {
    const response = await axiosInstance.post(
      "/accounting/api/v1/banks/accounts",
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: CreateBankAccount,
    mutationKey: ["GetAllBankListData"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetAllBankListData"] });
    },
  });
};

// Patch Bank Account Data
export const usePatchBankAccount = (id) => {
  const queryClient = useQueryClient();
  const patchAccount = async (data) => {
    const response = await axiosInstance.patch(
      `/accounting/api/v1/banks/accounts/${id}`,
      data
    );
    return response.data;
  };

  return useMutation({
    mutationKey: ["GetBankAccontCreatedList", id],
    mutationFn: patchAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetBankAccontCreatedList"] });
    },
  });
};

// Delete Bank Account Data
export const useDeleteBankAccount = (id_no: number) => {
  const queryClient = useQueryClient();
  const BankAccountDelete = async (id: number) => {
    const response = await axiosInstance.delete(
      `/accounting/api/v1/banks/accounts/${id}`
    );
    return response.data;
  };
  return useMutation({
    mutationFn: () => BankAccountDelete(id_no),
    mutationKey: ["GetBankAccontCreatedList", id_no],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetBankAccontCreatedList"] });
    },
  });
};

//Bank Account Posting
export const useGetPendingBankAccontCreatedList = (
  searchValue: string,
  page: number
) => {
  const getPendingBankAccount = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/banks/accounts/list-pending?search=${searchValue}&page=${page}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["pendingBankAccountList", searchValue, page],
    queryFn: getPendingBankAccount,
    placeholderData: keepPreviousData,
  });
};

export const usePostApprovePendingBankAccount = () => {
  const queryClient = useQueryClient();
  const ApproveBankAccount = async (data: any) => {
    const response = await axiosInstance.post(
      "/accounting/api/v1/banks/accounts/approve-pending",
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: ApproveBankAccount,
    mutationKey: ["approveBankAccount"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingBankAccountList"] });
    },
  });
};

export const usePostARejectPendingBankAccount = () => {
  const queryClient = useQueryClient();
  const RejectBankAccount = async (data: any) => {
    const response = await axiosInstance.post(
      "/accounting/api/v1/banks/accounts/reject-pending",
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: RejectBankAccount,
    mutationKey: ["RejectBankAccount"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingBankAccountList"] });
    },
  });
};
