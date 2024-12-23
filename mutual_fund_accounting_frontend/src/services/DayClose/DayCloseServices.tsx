import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

// For Creating Day Close Summary Data
export const usePatchDayCloseData = () => {
  const DayCloseDataRequest = async (data: any) => {
    const response = await axiosInstance.post(
      "/accounting/api/v1/accounting/day-close/",
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: DayCloseDataRequest,
    mutationKey: ["CreateDayCloseData"],
    retry: false,
  });
};

// For Creating Day Close Data
export const usePatchDayClose = () => {
  const queryClient = useQueryClient();

  const DayCloseRequest = async (data: any) => {
    const response = await axiosInstance.post(
      "/accounting/api/v1/accounting/day-close/?close_day=True",
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: DayCloseRequest,
    mutationKey: ["CreateDayClose"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetDayCloseData"] });
    },

    retry: false,
  });
};

// For Getting Day Close Data
export const useGetDayCloseData = (
  fromDate: string,
  toDate: string,
  page_no: number,
  id: any
) => {
  const DayCloseDataRequest = async (
    fromDate: string,
    toDate: string,
    pageNo: number,
    id: any
  ) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/accounting/day-close/?from_date=${fromDate}&to_date=${toDate}&page=${pageNo}&search=${id}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["GetDayCloseData", fromDate, toDate, page_no, id],
    queryFn: () => DayCloseDataRequest(fromDate, toDate, page_no, id),
    placeholderData: keepPreviousData,
    // retry: false,
  });
};

export const usePostNonTradingDay = () => {
  const postCreateNonTradingDay = async (data) => {
    // console.log("data", data);
    const response = await axiosInstance.post(
      `/accounting/api/v1/parameters/non-trading-day/`,
      data
    );
    return response.data;
  };

  return useMutation({
    mutationKey: ["createNonTradingDay"],
    mutationFn: postCreateNonTradingDay,
    onSettled: (data, error) => {
      // console.log("User Created data", data);
      // console.log("Error", error);
    },
  });
};

export const usePostDayClosePostingList = () => {
  const queryClient = useQueryClient();
  const postDayClosePostingList = async (data: any) => {
    const response = await axiosInstance.post(
      `/api/v1/accounting/day-close/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: postDayClosePostingList,
    mutationKey: ["postDayClosePostingList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["postDayClosePostingList"],
      });
    },
  });
};

//Day Close Posting list, Approve and reject pending

export const useGetPendingDayCloseData = (
  fromDate: string,
  toDate: string,
  page_no: number,
  id: any
) => {
  const PendingDayCloseData = async (
    fromDate: string,
    toDate: string,
    pageNo: number,
    id: any
  ) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/accounting/day-close/list-pending/?from_date=${fromDate}&to_date=${toDate}&page=${pageNo}&search=${id}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["pendingDayCloseList", fromDate, toDate, page_no, id],
    queryFn: () => PendingDayCloseData(fromDate, toDate, page_no, id),
    placeholderData: keepPreviousData,
  });
};

export const usePostApprovePendingDayClose = () => {
  const queryClient = useQueryClient();
  const pendingDayClosePostingApprove = async (data: any) => {
    const response = await axiosInstance.post(
      `/api/v1/accounting/day-close/approve-pending/`,
      data
    );
    return response.data;
  };

  return useMutation({
    mutationFn: pendingDayClosePostingApprove,
    mutationKey: ["approvetDayClosePosting"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingDayCloseList"],
      });
    },
  });
};

export const usePostrejectPendingDayClose = () => {
  const queryClient = useQueryClient();
  const pendingDayClosePostingReject = async (data: any) => {
    const response = await axiosInstance.post(
      `/api/v1/accounting/day-close/reject-pending/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: pendingDayClosePostingReject,
    mutationKey: ["rejectDayClosePosting"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingDayCloseList"],
      });
    },
  });
};
