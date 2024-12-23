import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

//summarized information
export const useGetInvestmentStatusSummarized = (securityType: string) => {
  const getInvestmentStatus = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/reporting/listed-unlisted-share-list/?listed_unlisted=${securityType}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["summarizedinfo"],
    queryFn: getInvestmentStatus,
  });
};
