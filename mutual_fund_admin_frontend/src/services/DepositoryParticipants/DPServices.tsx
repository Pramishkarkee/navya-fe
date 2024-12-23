import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const useGetDPList = () => {
  const getDPList = async () => {
    const response = await axiosInstance.get(
      `sip-up/api/v1/unit-purchase/list_licensed_depository_view/`
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["dp"],
    queryFn: getDPList,
    placeholderData: keepPreviousData,
  });
};
