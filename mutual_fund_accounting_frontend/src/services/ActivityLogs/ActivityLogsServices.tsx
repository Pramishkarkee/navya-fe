import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const useGetActivityLogs = (page: number) => {
  const getActivityLogs = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/activity-logs/list/?page=${page}`
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["activityLogs"],
    queryFn: () => getActivityLogs(),
  });
};
