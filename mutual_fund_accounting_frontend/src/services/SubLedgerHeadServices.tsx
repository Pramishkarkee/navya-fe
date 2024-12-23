import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

const postSubLedgerHead = async (data) => {
  const response = await axiosInstance.post(
    "/accounting/api/v1/accounting/sub_ledger_heads/",
    data
  );
  return response.data.responseData;
};

const getSubLedgerHeadList = async (pageNo: number, pageSize: number, subLedgerCode:string) => {
  const response = await axiosInstance.get(
    `/accounting/api/v1/accounting/sub_ledger_heads/?page=${pageNo}&per_page=${pageSize}&sub_ledger_code=${subLedgerCode}`
  );

  return response.data;
};

// Post Sub Ledger Head
export const useSubLedgerHeadMutation = () => {
  return useMutation({
    mutationFn: postSubLedgerHead,
    onError: (error) => {
      console.error(error);
    },
  });
};

// Get Sub Ledger Head List
export const useGetSubLedgerHeadList = (page_no: number, pageSize, subLedgerCode:string) => {
  return useQuery({
    queryKey: ["subledgerHeadList", page_no, pageSize, subLedgerCode],
    queryFn: () => getSubLedgerHeadList(page_no, pageSize, subLedgerCode),
    placeholderData: keepPreviousData,
  });
};

// Update Mutual Fund Setup end points
export const usePatchSubLedgerHead = (id: number) => {
  const queryClient = useQueryClient();
  const getPatchSubLedgerHead = async (data: any) => {
    const response = await axiosInstance.patch(
      `/accounting/api/v1/accounting/sub_ledger_heads/${id}/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: getPatchSubLedgerHead,
    mutationKey: ["subledgerHeadList", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subledgerHeadList"] });
    },
  });
};

// Delete Sub Ledger Head
export const useDeleteSubLedger = (id_no: number) => {
  const queryClient = useQueryClient();
  const SubLedgerDelete = async (id: number) => {
    const response = await axiosInstance.delete(
      `/accounting/api/v1/accounting/sub_ledger_heads/${id}/`
    );
    return response.data;
  };
  return useMutation({
    mutationFn: () => SubLedgerDelete(id_no),
    mutationKey: ["subledgerHeadList", id_no],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subledgerHeadList"] });
    },
  });
};

// Ledger Head All List for dropdown
const getAllLedgerHeadList = async () => {
  const response = await axiosInstance.get(
    `/accounting/api/v1/accounting/ledger_heads/?paginate=False`
  );
  return response.data;
};
export const useGetAllLedgerHeadList = () => {
  return useQuery({
    queryFn: getAllLedgerHeadList,
    queryKey: ["allledgerHeadList"],
  });
};

//Sub Ledger Head All List for dropdown
const getAllSubLedgerHeadList = async () => {
  const response = await axiosInstance.get(
    `/accounting/api/v1/accounting/sub_ledger_heads/?paginate=False`
  );
  return response.data;
};
export const useGetAllSubLedgerHeadList = () => {
  return useQuery({
    queryFn: getAllSubLedgerHeadList,
    queryKey: ["allSubledgerHeadList"],
  });
};
