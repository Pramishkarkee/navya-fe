import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const useGetUnitPurchaseReceipts = (page) => {
  const getUnitPurchaseReceipts = async (page) => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/unit-purchase/list/?page=${page}&is_approved=True`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["UnitPurchaseReceipts", page],
    queryFn: () => getUnitPurchaseReceipts(page),
    enabled: false,
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export const useGetUnitPurchaseReceiptsSearchList = (boid_number) => {
  const getUnitPurchaseReceiptsSearchList = async () => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/unit-purchase/list/?boid_number=${boid_number}&is_approved=True`
    );
    return response.data;
  };
  return useQuery({
    queryFn: getUnitPurchaseReceiptsSearchList,
    queryKey: ["UnitPurchaseReceiptsSearch", boid_number],
    enabled: !!boid_number,
    retry: false,
    placeholderData: keepPreviousData,
  });
};
