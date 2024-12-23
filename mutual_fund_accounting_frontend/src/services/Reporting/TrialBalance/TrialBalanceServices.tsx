import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

//Trial Balance
export const useGetTrialBalance = (fromDate, toDate) => {
  const getTrialBalance = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/reporting/trial-balance/?from_date=${fromDate}&to_Date=${toDate}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["trialbalance", fromDate, toDate],
    queryFn: getTrialBalance,
  });
};
