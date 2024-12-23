import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

// const baseUrl = "https://api-mf-acc.navyaadvisors.com";
// const baseUrl = import.meta.env.VITE_BASE_URL;

// Api handling for creating user
type Data = {
  username: string;
  password: string;
  confirm_password: string;
};

export const useCreateUserMutation = () => {
  const createUser = async (data: Data) => {
    const response = await axiosInstance.post(`/accounting/api/v1/users/register/`, data);
    return response.data;
  };

  return useMutation({
    mutationFn: createUser,
    onError: (error) => {
      console.error("error", error);
    },
  });
};

//Api for fetching User List

export const useGetUserList = () => {
  const getUserList = async () => {
    const response = await axiosInstance.get(`/accounting/api/v1/users/user_list/`);
    return response.data;
  };

  return useQuery({
    queryKey: ["user"],
    queryFn: getUserList,
    placeholderData: keepPreviousData,
  });
};

//Api for fetching User Detail

export const useGetUserDetail = (id: number) => {
  const getUserDetail = async () => {
    const response = await axiosInstance.get(`/accounting/api/v1/users/${id}/`);
    return response.data;
  };

  return useQuery({
    queryKey: ["user", id],
    queryFn: getUserDetail,
    enabled: false,
    retry: false,
  });
};

//Api for Deleting Users

export const useDeleteUserDetail = () => {
  const queryClient = useQueryClient();

  const deleteUserDetail = async (id: number) => {
    const response = await axiosInstance.delete(`/accounting/api/v1/users/${id}/`);
    return response.data;
  };
  return useMutation({
    mutationFn: deleteUserDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onSettled: (error) => {},
  });
};

//Api for changing User's Password
type PassData = {
  password: string;
  confirm_password: string;
};

export const usePutChangeUserPass = () => {
  const changeUserPass = async ({
    id,
    data,
  }: {
    id: number;
    data: PassData;
  }) => {
    const response = await axiosInstance.put(
      `/accounting/api/v1/users/${id}/change-password/`,
      data
    );
    return response.data;
  };

  return useMutation({
    mutationFn: changeUserPass,
    onSettled: (error) => {},
  });
};

//Api for Editing User

type EditUserData = {
  username: string;
};

export const usePatchEditUser = () => {
  const editUserDetail = async ({
    id,
    data,
  }: {
    id: number;
    data: EditUserData;
  }) => {
    const response = await axiosInstance.put(`/accounting/api/v1/users/me/${id}/`, data);
    return response.data;
  };
  return useMutation({
    mutationFn: editUserDetail,
    onSettled: (data, error) => {},
  });
};

// Get User Roles and Permissions
export const useGetUserRoles = () => {
  const getUserRoles = async () => {
    // const response = await axiosInstance.get(`/accounting/api/v1/users/roles/`);
    const response = await axiosInstance.get(`/api/v1/users/role/`);
    return response.data;
  };
  return useQuery({
    queryKey: ["userRoles"],
    queryFn: getUserRoles,
    placeholderData: keepPreviousData,
  });
};

// Get user Roles List 
export const useGetUserRolesList = () => {
  const getUserRolesList = async () => {
    const response = await axiosInstance.get(`/api/v1/users/role/list/`);
    return response.data;
  };
  return useQuery({
    queryKey: ["userRolesList"],
    queryFn: getUserRolesList,
    placeholderData: keepPreviousData,
  });
};

//Get User Permissions List
export const useGetUserPermissions = () => {
  const getUserPermissions = async () => {
    const response = await axiosInstance.get(`/api/v1/users/permission`);
    return response.data;
  };
  return useQuery({
    queryKey: ["userPermissions"],
    queryFn: getUserPermissions,
    placeholderData: keepPreviousData,
  });
};

//Get Permission Types List
export const useGetPermissionTypes = () => {
  const getPermissionTypes = async () => {
    const response = await axiosInstance.get(`/api/v1/users/permission/type`);
    return response.data;
  };
  return useQuery({
    queryKey: ["permissionTypes"],
    queryFn: getPermissionTypes,
    placeholderData: keepPreviousData,
  });
};

// Get Permission List
export const useGetPermissionList = () => {
  const getPermissionList = async () => {
    const response = await axiosInstance.get(`/api/v1/users/permission`);
    return response.data;
  };
  return useQuery({
    queryKey: ["permissionList"],
    queryFn: getPermissionList,
    placeholderData: keepPreviousData,
  });
};


// Post User Roles and Permissions
export const usePostUserRoles = () => {
  const queryClient = useQueryClient();
  const getPostUserRoles = async (data: any) => {
    const response = await axiosInstance.post(`/api/v1/users/role/`, data);
    return response.data;
  };
  return useMutation({
    mutationFn: getPostUserRoles,
    mutationKey: ["postUserRoles"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRoles"] });
    },
  });
};


// Patch User Roles and Permissions
export const usePatchUserRoles = (id: number) => {
  const queryClient = useQueryClient();
  
  const getPatchUserRoles = async (data: any) => {
    const response = await axiosInstance.put(
      `/api/v1/users/role/${id}`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: getPatchUserRoles,
    mutationKey: ["patchUserRoles", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRoles"] });
    },
  });
};


// Get User Creation
export const useGetUserCreation = () => {
  const getUserCreation = async () => {
    const response = await axiosInstance.get(`/api/v1/users/user`);
    return response.data;
  };
  return useQuery({
    queryKey: ["userCreation"],
    queryFn: getUserCreation,
    placeholderData: keepPreviousData,
  });
};


// Post User Creation
export const usePostUserCreation = () => {
  const queryClient = useQueryClient();
  const getPostUserCreation = async (data: any) => {
    const response = await axiosInstance.post(`/api/v1/users/user`, data);
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: getPostUserCreation,
    mutationKey: ["postUserCreation"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCreation"] });
    },
  });
};


// Patch User Creation
export const usePatchUserCreation = (id: number) => {
  const queryClient = useQueryClient();
  const getPatchUserCreation = async (data: any) => {
    const response = await axiosInstance.put(
      `/api/v1/users/user/${id}`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: getPatchUserCreation,
    mutationKey: ["patchUserCreation", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCreation"] });
    },
  });
};


// Delete User Creation
export const useDeleteUserCreation = () => {
  const queryClient = useQueryClient();
  const getDeleteUserCreation = async (id: number) => {
    const response = await axiosInstance.delete(`/accounting/api/v1/users/new-user/${id}/`);
    return response.data;
  };
  return useMutation({
    mutationFn: getDeleteUserCreation,
    mutationKey: ["deleteUserCreation"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCreation"] });
    },
  });
};

