import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const useGetUnitPurchaseReject = (page) => {
  const getUnitPurchaseReject = async (page) => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/unit-purchase/list/?page=${page}&is_rejected=True`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["UnitPurchaseReject", page],
    queryFn: () => getUnitPurchaseReject(page),
    enabled: false,
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export const useGetUnitPurchaseRejectSearchList = (boid_number) => {
  const getUnitPurchaseRejectSearchList = async () => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/unit-purchase/list/?boid_number=${boid_number}&is_rejected=True`
    );
    return response.data;
  };
  return useQuery({
    queryFn: getUnitPurchaseRejectSearchList,
    queryKey: ["UnitPurchaseRejectSearch", boid_number],
    enabled: !!boid_number,
    retry: false,
    placeholderData: keepPreviousData,
  });
};
