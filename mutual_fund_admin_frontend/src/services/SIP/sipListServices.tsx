import { useQuery, skipToken, keepPreviousData } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

interface searchDataInterface {
  dp: string;
  distributionCenter: string;
  schemeName: string;
  boid: string;
}

const getFilteredSipList = async (searchData: searchDataInterface) => {
  // const response = await axiosInstance.get(`/sip-up/api/v1/sip/sip-list/?boid_no=${searchData.boid}&db_center=${searchData.distributionCenter}&scheme_name=${searchData.schemeName}`)
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-list/?boid_no=${searchData.boid}&scheme_name=${searchData.schemeName}`
  );

  return response.data;
};

export const useGetFilteredSipList = (searchData) => {
  return useQuery({
    queryKey: ["FIlteredSip"],
    queryFn:
      searchData.boid && searchData.schemeName
        ? () => getFilteredSipList(searchData)
        : skipToken,
    placeholderData: keepPreviousData,
  });
};
