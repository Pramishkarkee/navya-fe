import {
  keepPreviousData,
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

// Getting List of SIP Payment Entry
const getSipPaymentEntry = async (boid) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-list/?sip_status=success&boid_no=${boid}`
  );
  // const response = await axiosInstance.get(`/sip-up/api/v1/sip/sip-list/?page=1&sip_status=sucess&boid_no=${boid}`)
  return response.data;
};

export const useGetSipPaymentEntry = (boid, filter) => {
  return useQuery({
    queryKey: ["InstallmentList", boid, filter],
    queryFn: filter ? () => getSipPaymentEntry(boid) : skipToken,
    placeholderData: keepPreviousData,
  });
};

// Pathcing List of SIP Payment Entry
const paySipInstallment = async (data: any) => {
  const response = await axiosInstance.post(
    "/sip-up/api/v1/sip/sip-installment/",
    data
  );
  return response.data;
};
export const useSipEntryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paySipInstallment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["InstallmentList"] });
    },
  });
};
