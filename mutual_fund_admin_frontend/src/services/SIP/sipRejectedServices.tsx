import {
  keepPreviousData,
  useQuery,
  // useMutation,
  // useQueryClient,
  // skipToken,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

const getSipReject = async (data, fromDate, toDate) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-list/?page=${data}&sip_status=rejected&from_date=${fromDate}&to_date=${toDate}`
  );
  return response.data;
};

export const useGetSipReject = (page, from_date, to_date) => {
  return useQuery({
    queryKey: ["SipReject", page, from_date, to_date],
    queryFn: () => getSipReject(page, from_date, to_date),
    placeholderData: keepPreviousData,
  });
};

//sip-Reject by boid

const getSipRejectByBoid = async (boid) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-list/?boid_no=${boid}&sip_status=rejected`
  );

  return response.data;
};

export const useGetSipRejectByBoid = (boid) => {
  return useQuery({
    queryKey: ["SipReject", boid],
    queryFn: () => getSipRejectByBoid(boid),
    placeholderData: keepPreviousData,
  });
};
