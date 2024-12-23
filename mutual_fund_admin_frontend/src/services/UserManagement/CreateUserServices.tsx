import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const useCreateUserMutataion = () => {
  const createUser = async (data) => {
    // const response = await axiosInstance.post(`/admin-service/register/`, data);
    const response = await axiosInstance.post(
      // `/auth/api/v1/user-service/register/`,
      `/api/v1/user-service/register/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: createUser,
    onSettled: (data, error) => {
      // console.log("User Created data", data);
      console.log("Error", error);
    },
  });
};
