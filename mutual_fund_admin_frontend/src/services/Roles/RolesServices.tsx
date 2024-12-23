import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const useGetUserRoles = () => {
  const getUserRoles = async () => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/user-service/role-permission-new/`
    );
    return response.data;
  };
  return useQuery({
    queryFn: getUserRoles,
    queryKey: ["userRoles"],
    placeholderData: keepPreviousData,
    retry: false,
  });
};

export const useGetUserRoleDetails = () => {
  const getUserRoleDetail = async () => {
    const response = await axiosInstance.get(
      `auth/api/v1/user-service/list-role/`
    );
    return response.data;
  };

  return useQuery({
    queryFn: getUserRoleDetail,
    queryKey: ["userRolesDetails"],
    placeholderData: keepPreviousData,
  });
};
