import {  keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";
import { useMutation } from "@tanstack/react-query";



// For Getting Sector Data with Pagination
const getSectorData = async (pageNo : number) => {
    const response = await axiosInstance.get(`/accounting/api/v1/parameters/sectors/?page=${pageNo}`);
    return response.data;
  }
  export const useGetSectorData = (page_no) => {
    return useQuery({
        queryKey: ['GetSectorData', page_no],
        queryFn: () => getSectorData(page_no),
        placeholderData: keepPreviousData,
        // retry: false,
    })
  }
  // For Getting All Sector Data
const getAllSectorData = async () => {
  const response = await axiosInstance.get(`/accounting/api/v1/parameters/sector-list/`);
  return response.data;
}
export const useGetAllSectorData = () => {
  return useQuery({
      queryKey: ['GetAllSectorData', ],
      queryFn: () => getAllSectorData(),
      // retry: false,
  })
}


// For Creatinog Sector Data
export const usePatchSectorData = () => {
  const queryClient = useQueryClient();
  const SectorDataRequest = async (data: any) => {
    const response = await axiosInstance.post(
      '/accounting/api/v1/parameters/sectors/',
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: SectorDataRequest,
    mutationKey: ["GetSectorData"],
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['GetSectorData'] });
    }
  });
};

  