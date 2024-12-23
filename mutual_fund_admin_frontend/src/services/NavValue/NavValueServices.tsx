import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const useGetNavValue = () => {
  const getNavValue = async () => {
    const response = await axiosInstance.get(`/sip-up/api/v1/sip/nav-value/`);
    return response.data;
  };
  return useQuery({
    queryFn: getNavValue,
    queryKey: ["NavValue"],
    placeholderData: keepPreviousData,
  });
};
