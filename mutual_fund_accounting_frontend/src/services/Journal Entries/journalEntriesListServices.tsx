import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

const getJournalEntriesList = async (
  start_date: string,
  page_no: number,
  end_date: string,
  pageSize: number
) => {
  const response = await axiosInstance.get(
    `/accounting/api/v1/accounting/journals/formatted/?from_date=${start_date}&page=${page_no}&to_date=${end_date}&per_page=${pageSize}`
  );
  return response.data;
};

const getJournalEntryDetail = async (id) => {
  const response = await axiosInstance.get(
    `/accounting/api/v1/accounting/journals/${id}/formatted/`
  );
  return response.data;
};

export const useGetJournalEntriesList = (
  start_date: string,
  page_number: number,
  end_date: string,
  pageSize: number
) => {
  return useQuery({
    queryKey: ["JournalEntryList", start_date, page_number, end_date, pageSize],
    queryFn: () =>
      getJournalEntriesList(start_date, page_number, end_date, pageSize),
    placeholderData: keepPreviousData,
  });
};

export const useGetJournalDetails = (id: number | null) => {
  return useQuery({
    queryKey: ["JournalEntryDetail", id],
    queryFn: () => getJournalEntryDetail(id),
    enabled: false,
  });
};

//Journal entry posting

export const useGetPendingJournalEntriesList = (
  start_date: string,
  end_date: string,
  page_no: number,
  pageSize: number
) => {
  const getPendingJournalEntry = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/accounting/journals/list-pending?from_date=${start_date}&to_date=${end_date}&page=${page_no}&per_page=${pageSize}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: [
      "pendingJournalEntryList",
      start_date,
      end_date,
      page_no,
      pageSize,
    ],
    queryFn: getPendingJournalEntry,
    placeholderData: keepPreviousData,
  });
};

export const usePostApprovePendingJournalEntry = () => {
  const queryClient = useQueryClient();
  const approvePendingJournalEntry = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/accounting/journals/approve-pending`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: approvePendingJournalEntry,
    mutationKey: ["postJournalVoucherPostingList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingJournalEntryList"],
      });
    },
  });
};

export const usePostRejectPendingJournalEntry = () => {
  const queryClient = useQueryClient();
  const rejectPendingJournalEntry = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/accounting/journals/reject-pending`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: rejectPendingJournalEntry,
    mutationKey: ["postJournalVoucherPostingList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingJournalEntryList"],
      });
    },
  });
};
