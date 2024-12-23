import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

//Auction Creation
export const usePostIpoCreate = () => {
  const postAIpoCreate = async (data) => {
    const response = await axiosInstance.post(`/accounting/api/v1/ipo/`, data);
    return response.data.responseData;
  };

  return useMutation({
    mutationKey: ["ipo"],
    mutationFn: postAIpoCreate,
  });
};

//Get Auction list details end points

export const useGetIpoList = (page_no: number) => {
  const getIpoList = async (pageNo: number) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/ipo/?page=${pageNo}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["ipoList", page_no],
    queryFn: () => getIpoList(page_no),
    placeholderData: keepPreviousData,
  });
};

export const useGetIPOListDate = (
  fromDate: string,
  toDate: string,
  id: any
) => {
  const getIPOListID = async (fromDate: string, toDate: string, ID: any) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/ipo/?from_date=${fromDate}&to_date=${toDate}&search=${ID}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: () => getIPOListID(fromDate, toDate, id),
    queryKey: ["ipoList", fromDate, toDate, id],
    // enabled: !!id,
  });
};

// Get IPO list details by id end points

export const useGetIpoListID = (id: any) => {
  const getIpoListID = async (id: any) => {
    try {
      const response = await axiosInstance.get(
        `/accounting/api/v1/ipo/?search=${id}`
      );
      return response.data;
    } catch (err) {
      return null;
    }
  };
  return useQuery({
    queryFn: () => getIpoListID(id),
    queryKey: ["ipoList", id],
    enabled: !!id,
  });
};

//Patch parameters-bank-details Services

export const usePatchIpoDetails = (id: number) => {
  const queryClient = useQueryClient();
  const patchIpoDetails = async (data: any) => {
    const response = await axiosInstance.patch(
      `/accounting/api/v1/ipo/${id}/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: patchIpoDetails,
    mutationKey: ["ipoList", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ipoList"] });
    },
  });
};

// posting

export const useGetPendingIPOFPOList = (
  fromDate: string,
  toDate: string,
  search: any,
  pageNo: number
) => {
  const getPendingIPOFPOList = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/ipo/list-pending/?from_date=${fromDate}&to_date=${toDate}&search=${search}&page=${pageNo}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: getPendingIPOFPOList,
    queryKey: ["pendingipofpoList", fromDate, toDate, search, pageNo],
    placeholderData: keepPreviousData,
  });
};

export const usePostPendingIPOFPOPosting = () => {
  const queryClient = useQueryClient();
  const PostIPOPostingList = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/ipo/approve-pending/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: PostIPOPostingList,
    mutationKey: ["postIPOFPOPosting"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingipofpoList"],
      });
    },
  });
};

export const usePostPendingIPOFPOReject = () => {
  const queryClient = useQueryClient();
  const PostPendingIPOFPOReject = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/ipo/reject-pending/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: PostPendingIPOFPOReject,
    mutationKey: ["postIPOFPOPosting"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingipofpoList"],
      });
    },
  });
};

//IPO/FPO/Right Share Allotment Posting

export const useGetPendingIPOFPORightList = (
  fromDate: string,
  toDate: string,
  search: any,
  pageNo: number
) => {
  const getPendingIPOFPOList = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/ipo/list-ipo-not-allotted/?from_date=${fromDate}&to_date=${toDate}&search=${search}&page=${pageNo}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: getPendingIPOFPOList,
    queryKey: ["pendingipofpoAllotmentList", fromDate, toDate, search, pageNo],
    placeholderData: keepPreviousData,
  });
};
export const useGetPendingIPOFPOAllotmentList = (
  fromDate: string,
  toDate: string,
  search: any,
  pageNo: number
) => {
  const getPendingIPOFPOList = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/ipo/list-allotted-approve-pending/?from_date=${fromDate}&to_date=${toDate}&search=${search}&page=${pageNo}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: getPendingIPOFPOList,
    queryKey: ["pendingipofpoAllotmentList", fromDate, toDate, search, pageNo],
    placeholderData: keepPreviousData,
  });
};

export const usePatchAllotIPOFPO = () => {
  const queryClient = useQueryClient();
  const patchIpoDetails = async (data: any) => {
    const response = await axiosInstance.patch(
      `/accounting/api/v1/ipo/allotted-approve-pending/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: patchIpoDetails,
    mutationKey: ["allotipoList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingipofpoAllotmentList"],
      });
    },
  });
};

export const usePostPendingIPOFPOAllotment = () => {
  const queryClient = useQueryClient();
  const PostIPOPostingList = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/ipo/final-ipo-approve/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PostIPOPostingList,
    mutationKey: ["postIPOFPOPosting"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingipofpoAllotmentList"],
      });
    },
  });
};

export const usePostPendingIPOFPOAllotmentReject = () => {
  const queryClient = useQueryClient();
  const PostPendingIPOFPOReject = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/ipo/reject-alloted-ipo/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PostPendingIPOFPOReject,
    mutationKey: ["postIPOFPOPosting"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingipofpoAllotmentList"],
      });
    },
  });
};
