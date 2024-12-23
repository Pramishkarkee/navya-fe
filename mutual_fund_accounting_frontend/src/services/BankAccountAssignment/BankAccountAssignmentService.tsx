import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

// For Getting Bank Account Assignment Data List
  const getBankAccAssignmentList = async () => {
    const response = await axiosInstance.get('/accounting/api/v1/parameters/transaction-bank-accounts');
    return response.data;
  }
  export const useGetBankAccAssignmentList = () => {
    return useQuery({
        queryKey: ['BankAccAssignmentList'],
        queryFn: getBankAccAssignmentList,
        // retry: false,
    })
  }


    // For creating Bank Account Assignment Data
export const usePatchBankAccAssignment = () => {
  const PatchBankAccAssignment = async (data: any) => {
    const response = await axiosInstance.post(
      '/accounting/api/v1/parameters/transaction-bank-accounts',
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PatchBankAccAssignment,
    mutationKey: ["BankAccAssignmentCreate"],
  });
};