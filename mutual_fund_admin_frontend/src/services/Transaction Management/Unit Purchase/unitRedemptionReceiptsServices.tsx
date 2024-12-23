import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const useGetUnitRedemptionReceipts = (page) => {
  const getUnitRedemptionReceipts = async () => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/unit-purchase/reedm-list/?page=${page}&is_approved=True`
    );
    return response.data;
  };
  return useQuery({
    queryFn: getUnitRedemptionReceipts,
    queryKey: ["UnitRedemptionTxnReceipts", page],
    placeholderData: keepPreviousData,
    // enabled: false,
  });
};

export const useGetUnitRedemptionReceiptsSearch = (boid_number) => {
  const getUnitRedemptionReceiptsSearch = async () => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/unit-purchase/reedm-list/?boid_number=${boid_number}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: getUnitRedemptionReceiptsSearch,
    queryKey: ["UnitRedemptionReceiptsSearch", boid_number],
    enabled: !!boid_number,
    placeholderData: keepPreviousData,
  });
};
