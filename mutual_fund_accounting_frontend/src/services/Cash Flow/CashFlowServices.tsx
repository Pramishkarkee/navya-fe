import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const useGetCashFlowList = (
  //   type: string,
  days: string,
  from_date: string,
  to_date: string,
  pageNo: number
) => {
  const getGetCashFlowList = async (
    // type: string,
    days: string,
    from_date: string,
    to_date: string,
    pageNo: number
  ) => {
    let apiUrl = `/accounting/api/v1/reports/cash-flow?search=${days}`;

    apiUrl += `&from_date=${from_date}&to_date=${to_date}&page=${pageNo}`;

    // if (type !== "all") {
    //   apiUrl += `&type=${type}`;
    // }

    const response = await axiosInstance.get(apiUrl);
    return response.data;
  };

  return useQuery({
    queryKey: [
      "cashFlow",
      //  type,
      days,
      from_date,
      to_date,
      pageNo,
    ],
    queryFn: () =>
      getGetCashFlowList(
        // type,
        days,
        from_date,
        to_date,
        pageNo
      ),
    placeholderData: keepPreviousData,
    retry: 1,
  });
};
