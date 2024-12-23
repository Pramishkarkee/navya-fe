import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

const getAccHeadList = async () => {
  const response = await axiosInstance.get("/accounting/api/v1/accounting/account_heads/");
  // console.log("response", response.data.responseData)
  return response.data.responseData;
};

export const useGetAccHeadQuery = () => {
  return useQuery({
    queryKey: ["Acc_heads"],
    queryFn: getAccHeadList,
  });
};
