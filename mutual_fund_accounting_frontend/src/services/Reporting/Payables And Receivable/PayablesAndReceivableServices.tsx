import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const useGetPayablesAndReceivablesList = (
  type: string,
  days: string,
  from_date: string,
  to_date: string,
  pageNo: number
) => {
  const getPayablesAndReceivablesList = async (
    type: string,
    days: string,
    from_date: string,
    to_date: string,
    pageNo: number
  ) => {
    let apiUrl = `/accounting/api/v1/reports/payables-and-receivables?search=${days}`;

    apiUrl += `&from_date=${from_date}&to_date=${to_date}&page=${pageNo}`;

    if (type !== "all") {
      apiUrl += `&type=${type}`;
    }

    const response = await axiosInstance.get(apiUrl);
    return response.data;
  };

  return useQuery({
    queryKey: [
      "PayablesAndReceivables",
      type,
      days,
      from_date,
      to_date,
      pageNo,
    ],
    queryFn: () =>
      getPayablesAndReceivablesList(type, days, from_date, to_date, pageNo),
    placeholderData: keepPreviousData,
    retry: 1,
  });
};
