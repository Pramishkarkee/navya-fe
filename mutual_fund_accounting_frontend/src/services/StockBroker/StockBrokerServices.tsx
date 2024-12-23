import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";
import { useMutation } from "@tanstack/react-query";

// For Getting Stock Broker Data List with Pagination
const getStockBrokerData = async (
  pageNo: number,
  pageSize: number,
  search: string
) => {
  const response = await axiosInstance.get(
    `/accounting/api/v1/parameters/stock-broker/?page=${pageNo}&per_page=${pageSize}&search=${search}`
  );
  return response.data;
};
export const useGetStockBrokerData = (
  page_no: number,
  pageSize: number,
  search: string
) => {
  return useQuery({
    queryKey: ["GetStockBrokerData", page_no, pageSize, search],
    queryFn: () => getStockBrokerData(page_no, pageSize, search),
    placeholderData: keepPreviousData,
    // retry: false,
  });
};

// For deleting Stock Broker Data
export const useDeleteStockBrokerData = (id: number) => {
  const queryClient = useQueryClient();
  const deleteStockBrokerData = async (data: any) => {
    const response = await axiosInstance.delete(
      `/accounting/api/v1/parameters/stock-broker/${id}/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: deleteStockBrokerData,
    mutationKey: ["GetStockBrokerData", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetStockBrokerData"] });
    },
  });
};

// For Updating Stock Broker Data
export const useUpdateStockBrokerData = (id: number) => {
  const queryClient = useQueryClient();
  const updateStockBrokerData = async (data: any) => {
    const response = await axiosInstance.patch(
      `/accounting/api/v1/parameters/stock-broker/${id}/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: updateStockBrokerData,
    mutationKey: ["UpdateStockBrokerData", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetStockBrokerData"] });
    },
  });
};

// For Creating Stock Broker Data
export const usePatchStockBrokerData = () => {
  const createStockBrokerData = async (data: any) => {
    const response = await axiosInstance.post(
      "/accounting/api/v1/parameters/stock-broker/",
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: createStockBrokerData,
    mutationKey: ["CreateStockBrokerData"],
  });
};

// For Getting ALL Stock Broker Data List
const getAllStockBrokerData = async () => {
  const response = await axiosInstance.get("/accounting/api/v1/parameters/broker-list");
  return response.data;
};
export const useGetAllStockBrokerData = () => {
  return useQuery({
    queryKey: ["GetAllStockBrokerData"],
    queryFn: getAllStockBrokerData,
    // retry: false,
  });
};

const getSearchStockBrokerData = async (id: any) => {
  const response = await axiosInstance.get(
    `/accounting/api/v1/parameters/stock-broker/?search=${id}`
  );
  return response.data;
};
export const useGetSearchStockBrokerData = (id: any) => {
  return useQuery({
    queryKey: ["GetStockBrokerData", id],
    queryFn: () => getSearchStockBrokerData(id),
    placeholderData: keepPreviousData,
    // retry: false,
  });
};

// posting
export const usePostStockBrokerPostingList = () => {
  const queryClient = useQueryClient();
  const postStockBrokerPostingList = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/parameters/stock-broker/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: postStockBrokerPostingList,
    mutationKey: ["postStockBrokerPostingList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["postStockBrokerPostingList"],
      });
    },
  });
};
