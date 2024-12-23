import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

// For Getting IPO Rightshare Parameter Data List
  const getIPORIghtshareParameterList = async () => {
    const response = await axiosInstance.get('/accounting/api/v1/parameters/ipo-lock-in-period/');
    return response.data;
  }
  export const useGetIPORightshareParameterList = () => {
    return useQuery({
        queryKey: ['IPORightShareParameterList'],
        queryFn: getIPORIghtshareParameterList,
        retry: false,
    })
  }


    // For creating IPORIghtshare Parameter Data
export const usePatchIPORightshareParameter = () => {
  const PatchIPORightshareParameter = async (data: any) => {
    const response = await axiosInstance.post(
      '/accounting/api/v1/parameters/ipo-lock-in-period/',
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PatchIPORightshareParameter,
    mutationKey: ["IPORightshareParameterCreate"],
  });
};