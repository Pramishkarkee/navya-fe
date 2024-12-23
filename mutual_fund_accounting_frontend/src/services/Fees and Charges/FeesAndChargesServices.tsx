import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

// For  Fees and Charges Parameter Data
export const usePatchFeesAndChargesParameter = () => {
  const PatchFeesAndChargesParameter = async (data: any) => {
    const response = await axiosInstance.patch(
      "/accounting/api/v1/parameters/fees-and-charges/",
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PatchFeesAndChargesParameter,
    mutationKey: ["FeesAndChargesParameter"],
  });
};

// For getting Fees and Charges Parameter Data

export const useGetFeesAndChargesParameter = () => {
  const useGetFeesAndChargesParameter = async () => {
    const response = await axiosInstance.get(
      "/accounting/api/v1/parameters/fees-and-charges/"
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["FeesAndChargesParameter"],
    queryFn: useGetFeesAndChargesParameter,
    // placeholderData: keepPreviousData,
  });
};
