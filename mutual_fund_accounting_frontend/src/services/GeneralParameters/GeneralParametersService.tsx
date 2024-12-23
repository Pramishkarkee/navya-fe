import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

// For Getting General Parameter Data List
  const getGeneralParameterList = async () => {
    const response = await axiosInstance.get('/accounting/api/v1/parameters/extra-parameters/');
    return response.data;
  }
  export const useGetGeneralParameterList = () => {
    return useQuery({
        queryKey: ['GetGemeralParameterList'],
        queryFn: getGeneralParameterList,
        retry: false,
    })
  }


    // For creating General Parameter Data
export const usePatchGeneralParameter = () => {
  const PatchGeneralParameter = async (data: any) => {
    const response = await axiosInstance.post(
      '/accounting/api/v1/parameters/extra-parameters/',
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PatchGeneralParameter,
    mutationKey: ["GeneralParameterCreate"],
  });
};