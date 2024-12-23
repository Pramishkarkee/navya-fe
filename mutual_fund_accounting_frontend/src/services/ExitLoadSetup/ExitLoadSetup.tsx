import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

// For Getting Exit Load Data List
  const getExitLoadList = async (pageNo : number) => {
    const response = await axiosInstance.get(`/accounting/api/v1/parameters/exit-load/?page=${pageNo}`);
    return response.data;
  }
  export const useGetExitLoadList = (page_number : number) => {
    return useQuery({
        queryKey: ['ExitLoadList' , page_number],
        queryFn: () => getExitLoadList(page_number),
        // retry: false,
    })
  }


    // For Creating Exit Load Data
export const usePatchExitLoad = () => {
  const ExitLoadRequest = async (data: any) => {
    const response = await axiosInstance.post(
      '/accounting/api/v1/parameters/exit-load/',
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: ExitLoadRequest,
    mutationKey: ["ExitLoadCreate"],
  });
};


// For Deleting Exit Load Data
export const useDeleteExitLoad = (id_no : number) => {
  const queryClient = useQueryClient();
  const ExitLoadDelete = async (id: number) => {
    const response = await axiosInstance.delete(
      `/accounting/api/v1/parameters/exit-load/${id}/`
    );
    return response.data;
  };
  return useMutation({
    mutationFn: () => ExitLoadDelete(id_no),
    mutationKey: ["GetExitLoadList" , id_no],
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["GetExitLoadList"]});
    }
  });
};

// For Updating Exit Load Data
export const usePatchexitLoad = (id: number) => {
    const queryClient = useQueryClient();
    const patchExitLoad = async (data: any) => {
      const response = await axiosInstance.patch(
        `/accounting/api/v1/parameters/exit-load/${id}/`,
        data
      );
      return response.data.responseData;
    };
    return useMutation({
      mutationFn: patchExitLoad,
      mutationKey: ["ExitLoadList", id],
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ExitLoadList"] });
      },
    });
  };