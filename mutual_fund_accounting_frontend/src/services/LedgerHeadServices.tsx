import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

type FormData = {
  ledger_head: string;
  ledger_description: string;
  account_head: number;
  ledger_opening_date: string;
};

const postLedgerHead = async (data: FormData) => {
  const response = await axiosInstance.post(
    "/accounting/api/v1/accounting/ledger_heads/",
    data
  );
  return response.data.responseData;
};

const getLedgerHeadList = async (pageNo: number, pageSize: number, ledgerCode) => {
  const response = await axiosInstance.get(
    `/accounting/api/v1/accounting/ledger_heads/?page=${pageNo}&per_page=${pageSize}&ledger_code=${ledgerCode}`
  );

  return response.data;
};

export const useLedgerHeadMutation = () => {
  return useMutation({
    mutationFn: postLedgerHead,
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetLedgerHeadList = (page_no: number, pageSize, ledgerCode) => {
  return useQuery({
    queryKey: ["ledgerHeadList", page_no, pageSize, ledgerCode],
    queryFn: () => getLedgerHeadList(page_no, pageSize, ledgerCode),
    placeholderData: keepPreviousData,
  });
};
