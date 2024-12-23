import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

// For Getting CGT Charge Data List
  const getCGTChargeList = async (pageNo : number) => {
    const response = await axiosInstance.get(`/accounting/api/v1/parameters/cgt-charge/?page=${pageNo}`);
    return response.data;
  }
  export const useGetCGTChargeList = (page_number) => {
    return useQuery({
        queryKey: ['GetCGTCharge' , page_number],
        queryFn: () => getCGTChargeList(page_number),
        // retry: false,
    })
  }


    // For Creating CGT Charge Data
export const usePatchCGTChargeList = () => {
  const CreateCGTChargeList = async (data: any) => {
    const response = await axiosInstance.post(
      '/accounting/api/v1/parameters/cgt-charge/',
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: CreateCGTChargeList,
    mutationKey: ["CreateCGTCharge"],
  });
};

// For Deleting CGT Charge Data
export const useDeleteCGTChargeList = (id_no : number) => {
  const queryClient = useQueryClient();
  const CGTChargeDelete = async (id: number) => {
    const response = await axiosInstance.delete(
      `/accounting/api/v1/parameters/cgt-charge/${id}/`
    );
    return response.data;
  };
  return useMutation({
    mutationFn: () => CGTChargeDelete(id_no),
    mutationKey: ["GetCGTCharge" , id_no],
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["GetCGTCharge"]});
    }
  });
};