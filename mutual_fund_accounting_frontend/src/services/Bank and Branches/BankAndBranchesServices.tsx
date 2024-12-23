import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
// import { AxiosError } from "axios";
import { axiosInstance } from "config/axiosInstance";
import { UserFormInput } from "pages/Bank and Account/Banks/Bank and Branches/BankAndBranches";

//Get Bank list details end points

export const useGetgetBankListQuery = (page) => {
  const getBankList = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/parameters/bank-details/?page=${page}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["bankList", page],
    queryFn: getBankList,
    placeholderData: keepPreviousData,
  });
};

export const useGetBankListDate = (
  fromDate: string,
  toDate: string,
  page_no: number,
  id: any
) => {
  const getBankListID = async (
    fromDate: string,
    toDate: string,
    pageNo: number,
    id: any
  ) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/parameters/bank-details/?start_date=${fromDate}&end_date=${toDate}&page=${pageNo}&search=${id}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: () => getBankListID(fromDate, toDate, page_no, id),
    queryKey: ["bankList", fromDate, toDate, page_no, id],
    placeholderData: keepPreviousData,
    // enabled: !!id,
  });
};
//Get Bank list details by id end points
// export const useGetgetBankListID = (id: any) => {
//     const getBankListID = async (id: any) => {
//         try {
//             const response = await axiosInstance.get(
//                 `/accounting/api/v1/parameters/bank-details/?search=${id}`
//             );
//             console.log(response);
//             return response.data;
//         } catch (err) {
//             return null;
//         }
//     };

//     return useQuery({
//         queryFn: () => getBankListID(id),
//         queryKey: ["BankListID", id],
//         enabled: !!id,
//     });
// };
//Patch parameters-bank-details Services
export const usePatchBankDetails = (id: number) => {
  const queryClient = useQueryClient();
  const PatchPatchBankDetails = async (data: any) => {
    const response = await axiosInstance.patch(
      `/accounting/api/v1/parameters/bank-details/${id}/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: PatchPatchBankDetails,
    mutationKey: ["bankList", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankList"] });
    },
  });
};
//Bank and branches list end points
export const usePostBanksAndBrachesDetails = () => {
  const postBanksAndBracchesDetails = async (data: UserFormInput) => {
    // console.log("data", data);
    const response = await axiosInstance.post(
      `/accounting/api/v1/parameters/bank-details/`,
      data
    );
    return response.data.responseData;
  };

  return useMutation({
    mutationKey: ["bankandBranches"],
    mutationFn: postBanksAndBracchesDetails,
    // onSettled: (data, error) => {
    //     // console.log("User Created data", data);
    //     // console.log("Error", error);
    // },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  const deleteBranch = async (id: number) => {
    const response = await axiosInstance.delete(
      `/accounting/api/v1/banks/branch-details/${id}/`
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: deleteBranch,
    mutationKey: ["bankList"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankList"] });
    },
  });
};

// bank posting method
export const usePostBankPostingList = () => {
  const queryClient = useQueryClient();
  const postBankPostingList = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/parameters/bank-details/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: postBankPostingList,
    mutationKey: ["postBankPostingList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["postBankPostingList"],
      });
    },
  });
};
