import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";
import { ViewUserInput } from "pages/UserManagement/ViewUser/ViewUser";

export const useGetUserList = (page) => {
  const getUserList = async () => {
    const response = await axiosInstance.get(
      // `/auth/api/v1/user-service/user-list/?page=${page}`
      `/api/v1/user-service/user-list/?page=${page}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["user", page],
    queryFn: getUserList,
    placeholderData: keepPreviousData,
  });
};

export const usePostChangeUserPass = () => {
  const changeUserPass = async (data) => {
    const response = await axiosInstance.post(
      // `/auth/api/v1/user-service/password-reset/`,
      `/api/v1/user-service/password-reset/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: changeUserPass,
    onSettled: (error) => {
      // console.log("Error", error);
    },
  });
};

export const useGetUserDetailData = (id: number) => {
  const getUserDetailData = async () => {
    const response = await axiosInstance.get(
      // `/auth/api/v1/user-service/user-retrive/${id}/`
      `/api/v1/user-service/user-retrive/${id}/`
    );
    return response.data;
  };
  return useQuery({
    queryFn: getUserDetailData,
    queryKey: ["user", id],
    enabled: false,
    placeholderData: keepPreviousData,
  });
};

export const useDeleteUserDetail = () => {
  const queryClient = useQueryClient();

  const deleteUserDetail = async (user_id: number) => {
    const response = await axiosInstance.delete(
      // `/auth/api/v1/user-service/user-delete/${user_id}/`
      `/api/v1/user-service/user-delete/${user_id}/`
    );
    return response.data;
  };

  return useMutation({
    mutationFn: deleteUserDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      // console.log("Error", error);
    },
  });
};
