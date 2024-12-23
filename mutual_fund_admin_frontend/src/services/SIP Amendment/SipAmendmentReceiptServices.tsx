import { keepPreviousData, skipToken, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const useGetSIPAmendmentReceipt = (fromDate: string, toDate: string) => {
  const getSipAmendmentReceipt = async () => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/sip/sip-amendment-receipt/?from_date=${fromDate}&to_date=${toDate}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["amendment", fromDate, toDate],
    queryFn: fromDate && toDate ? getSipAmendmentReceipt : skipToken,
    placeholderData: keepPreviousData,
  });
};
