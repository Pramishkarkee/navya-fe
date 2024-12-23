import {
  useQuery,
  useMutation,
  useQueryClient,
  skipToken,
  keepPreviousData,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

const getSipInstallmentList = async (boid) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-installment-list/?payment_status=pending&boid_no=${boid}`
  );
  // const response = await axiosInstance.get(`/sip-up/api/v1/sip/sip-list/?page=1&sip_status=sucess&boid_no=${boid}`)
  return response.data;
};

const getSipInstallmentListApproved = async (pageNo: number, boid: string) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-installment-list/?payment_status=success&page=${pageNo}&boid_no=${boid}`
  );
  return response.data;
};
export const useGetSipInstallmentListApproved = (
  pageNo: number,
  boid: string
) => {
  return useQuery({
    queryKey: ["InstallmentListApproved", pageNo, boid],
    queryFn: () => getSipInstallmentListApproved(pageNo, boid),
    placeholderData: keepPreviousData,
  });
};

const paySipInstallment = async (data) => {
  const response = await axiosInstance.patch(
    "/sip-up/api/v1/sip/sip-installment-authorize/",
    data
  );
  return response.data;
};

export const useGetSipInstallmentList = (boid, filter) => {
  return useQuery({
    queryKey: ["InstallmentList", filter],
    queryFn: filter ? () => getSipInstallmentList(boid) : skipToken,
    placeholderData: keepPreviousData,
    // enabled: false
  });
};

export const useSipInstallmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paySipInstallment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["InstallmentList"] });
    },
  });
};
