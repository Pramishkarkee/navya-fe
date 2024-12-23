import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";
import { Data } from "pages/Stock and Brokers/Stock Setup/Stock Entry/StockEntry";

//Get all stock transaction details end points
const getAllStockMappingList = async () => {
  const response = await axiosInstance.get("/accounting/api/v1/parameters/stocks/");
  console.log("response", response.data.responseData);
  return response.data.responseData;
};
export const useGetAllStockMappingList = () => {
  return useQuery({
    queryKey: ["getAllStockMappingList"],
    queryFn: getAllStockMappingList,
  });
};

export const useGetStockMappingListDate = (
  fromDate: string,
  toDate: string,
  page_no: number,
  id: any,
  pageSize: number
) => {
  const getStockMappingListID = async (
    fromDate: string,
    toDate: string,
    pageNo: number,
    id: any,
    pageSize: number
  ) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/parameters/stocks/?from_date=${fromDate}&to_date=${toDate}&page=${pageNo}&search=${id}&per_page=${pageSize}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: () =>
      getStockMappingListID(fromDate, toDate, page_no, id, pageSize),
    queryKey: [
      "getAllStockMappingList",
      fromDate,
      toDate,
      page_no,
      id,
      pageSize,
    ],
    placeholderData: keepPreviousData,
    // enabled: !!id,
  });
};

//Get Bank list details by id end points
// export const useStockMappingListID = (id: any) => {
//     const getStockMappingListtID = async (id: any) => {
//         try {
//             const response = await axiosInstance.get(
//                 `/accounting/api/v1/parameters/stocks/?search=${id}`,
//             );
//             return response.data;
//         } catch (err) {
//             return null;
//         }

//     };

//     return useQuery({
//         queryFn: () => getStockMappingListtID(id),
//         queryKey: ["getAllStockMappingListid", id],
//         enabled: !!id,
//     });
// };
export const usePostCreateStock = () => {
  const postCreateStock = async (data: Data) => {
    // console.log("data", data);
    const response = await axiosInstance.post(
      `/accounting/api/v1/parameters/stocks/`,
      data
    );
    return response.data.responseData;
  };

  return useMutation({
    mutationKey: ["createStockTransaction"],
    mutationFn: postCreateStock,
    retry: false,
    // retry: false,
    onSettled: (data, error) => {
      // console.log("User Created data", data);
      // console.log("Error", error);
    },
  });
};

//Patch parameters Stock List Services
export const usePatchStockDetails = (id: number) => {
  const queryClient = useQueryClient();
  const PatchPatchStockDetails = async (data: any) => {
    const response = await axiosInstance.patch(
      `/accounting/api/v1/parameters/stocks/${id}/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: PatchPatchStockDetails,
    mutationKey: ["getAllStockMappingList", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllStockMappingList"] });
    },
  });
};

//For deleting stock mapping list
export const useDeleteStockDetails = (id: number) => {
  const queryClient = useQueryClient();
  const deleteStockDetails = async (data: any) => {
    const response = await axiosInstance.delete(
      `/accounting/api/v1/parameters/stocks/${id}/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: deleteStockDetails,
    mutationKey: ["getAllStockMappingList", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllStockMappingList"] });
    },
  });
};

// posting modal
export const usePostStockAndBondPostingList = () => {
  const queryClient = useQueryClient();
  const postStockAndBondPostingList = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/parameters/stocks/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: postStockAndBondPostingList,
    mutationKey: ["postStockAndBondPostingList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["postStockAndBondPostingList"],
      });
    },
  });
};
