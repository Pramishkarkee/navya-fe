import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

//stock information
export const useGetStockInfoReport = (symbol, pageNo , pageSize) => {
  const getStockInforeport = async (symbol, pageNo, pageSize) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/reporting/stock-information/?symbol=${symbol}&page=${pageNo}&per_page=${pageSize}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["stockinfo" , symbol , pageNo , pageSize],
    queryFn: ()=> getStockInforeport(symbol , pageNo , pageSize),
    placeholderData: keepPreviousData,
  });
};
