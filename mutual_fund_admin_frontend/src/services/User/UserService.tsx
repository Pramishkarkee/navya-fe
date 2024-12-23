import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const useGetUserName = () => {
  const getUserName = async () => {
    const response = await axiosInstance.get(`/api/v1/users/me`);
    return response.data;
  };
  return useQuery({
    queryFn: getUserName,
    queryKey: ["username"],
    placeholderData: keepPreviousData,
  });
};
