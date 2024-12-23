import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const useGetNavValue = () => {
  const getNavValue = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/dashboard/ltp/nav-value/`
    );
    return response.data;
  };
  return useQuery({
    queryFn: getNavValue,
    queryKey: ["NavValue"],
    // enabled: false,
  });
};