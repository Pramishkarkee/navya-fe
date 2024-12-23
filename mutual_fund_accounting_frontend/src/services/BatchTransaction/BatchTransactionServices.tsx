import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

// For Getting Batch Transaction Uploaded Data List
  const getImportBatchTransactionList = async (broker_code : number, stock_symbol: string)  => {
    const response = await axiosInstance.get(`/accounting/api/v1/batch-update/stock-bond-confirm-update/?broker_code=${broker_code}&symbol=${stock_symbol}`);
    return response.data;
  }
  export const useGetImportBatchTransactionList = (number : number , symbol : string) => {
    return useQuery({
        queryKey: ['ImportBatchTransactionList' , number , symbol],
        queryFn: () => getImportBatchTransactionList(number , symbol),
        retry: false,
    })
  }

// For Creating Batch Transaction Data by uploading file
export const usePatchBatchTransaction = () => {
  const PatchBatchTransaction = async (data: any) => {
    const response = await axiosInstance.post(
      '/accounting/api/v1/batch-update/stock-bond-confirm-update/',
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PatchBatchTransaction,
    mutationKey: ["BatchTransactionCreate"],
  });
};

// For Approving Batch Transaction Data
export const usePatchBatchTransactionApproved = () => {
  const PatchBatchTransactionApproved = async (data: any) => {
    const response = await axiosInstance.post(
      '/accounting/api/v1/batch-update/stock-bond-approved/',
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PatchBatchTransactionApproved,
    mutationKey: ["BatchTransactionApproved"],
  });
};