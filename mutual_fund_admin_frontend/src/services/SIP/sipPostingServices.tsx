import {
  useQuery,
  useMutation,
  useQueryClient,
  skipToken,
  keepPreviousData,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

const getSipOnlineList = async (
  pagination: number,
  from_date: string,
  to_date: string
) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-list/?page=${pagination}&sip_status=pending&portal=Online&from_date=${from_date}&to_date=${to_date}`
  );
  return response.data;
};

const getSipList = async (
  pagination: number,
  from_date: string,
  to_date: string
) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-list/?page=${pagination}&sip_status=pending&portal=Office&from_date=${from_date}&to_date=${to_date}`
  );
  return response.data;
};

const authorizeSip = async (data) => {
  const response = await axiosInstance.patch(
    "/sip-up/api/v1/sip/sip-register-authorize/",
    data
  );
  return response.data;
};

const rejectSip = async (data) => {
  const response = await axiosInstance.patch(
    "/sip-up/api/v1/sip/sip-register-rejected/",
    data
  );
  return response.data;
};

const getSipReceipts = async (data, fromDate, toDate) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-list/?page=${data}&sip_status=success&from_date=${fromDate}&to_date=${toDate}`
  );

  return response.data;
};

const getSipListByBoid = async (boid: string) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-list/?boid_no=${boid}&sip_status=success`
  );
  return response.data;
};

export const useGetPendigOnlineSipList = (
  pagination: number,
  from_date: string,
  to_date: string
) => {
  return useQuery({
    queryKey: ["PendingSip", pagination],
    queryFn: () => getSipOnlineList(pagination, from_date, to_date),
    placeholderData: keepPreviousData,
    // enabled: false,
    // staleTime: 0,
  });
};

export const useGetPendigSipList = (
  pagination: number,
  fromDate: string,
  toDate: string
) => {
  return useQuery({
    queryKey: ["PendingSip", pagination, fromDate, toDate],
    queryFn: () => getSipList(pagination, fromDate, toDate),
    placeholderData: keepPreviousData,
    // enabled: false,
    // staleTime: 0,
  });
};

export const useAuthorizeSipMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authorizeSip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PendingSip"] });
    },
  });
};

export const useRejectSipMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectSip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PendingSip"] });
    },
  });
};

export const useGetSipReceipts = (page, from_date, to_date) => {
  return useQuery({
    queryKey: ["SipReceipts", page, from_date, to_date],
    queryFn: () => getSipReceipts(page, from_date, to_date),
    placeholderData: keepPreviousData,
  });
};

export const useGetSipByBoid = (boid: string) => {
  return useQuery({
    queryKey: ["SipListByBoid"],
    queryFn: boid ? () => getSipListByBoid(boid) : skipToken,
    placeholderData: keepPreviousData,
  });
};

//portal-office
const getPendingSipListByBoid = async (boid: string) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-list/?boid_no=${boid}&sip_status=pending&portal=Office`
  );
  return response.data;
};

export const useGetPendingSipListByBoid = (boid: string) => {
  return useQuery({
    queryKey: ["SipListByBoid"],
    queryFn: boid ? () => getPendingSipListByBoid(boid) : skipToken,
    placeholderData: keepPreviousData,
  });
};

//sip-receipts by boid

const getSipReceiptsByBoid = async (boid) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-list/?boid_no=${boid}&sip_status=success`
  );

  return response.data;
};

export const useGetSipReceiptsByBoid = (boid) => {
  return useQuery({
    queryKey: ["SipReceipts", boid],
    queryFn: () => getSipReceiptsByBoid(boid),
    placeholderData: keepPreviousData,
  });
};
