import { keepPreviousData, skipToken, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";
import { useMutation } from "@tanstack/react-query";

// For ShareHolder BOID Correction
const getBOIDCorrection = async (boid: string) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/boid-correction/?boid_no=${boid}`
  );
  return response.data;
};
export const useGetBOIDCorrection = (boidValue: string) => {
  return useQuery({
    queryKey: ["UserBOIDCorrection", boidValue],
    queryFn: boidValue ? () => getBOIDCorrection(boidValue) : skipToken,
    retry: false,
    placeholderData: keepPreviousData,
  });
};

// For ShareHolder BOID Correction Update
export const usePatchBOIDRequest = (id: number) => {
  const BOIDRequest = async (data: any) => {
    const response = await axiosInstance.put(
      `/sip-up/api/v1/sip/boid-correction/${id}/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: BOIDRequest,
    mutationKey: ["amendment", id],
  });
};
