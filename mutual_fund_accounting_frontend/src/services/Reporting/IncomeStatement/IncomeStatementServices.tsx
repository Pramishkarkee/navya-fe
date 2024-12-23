import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const useGetIncomeExpenseStatement = () => {
  const getIncomeExpenses = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/reporting/net-income-expenses/`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["incone_expense"],
    queryFn: getIncomeExpenses,
  });
};
