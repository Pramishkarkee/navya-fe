import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";
import { DividendData } from "pages/Stock and Brokers/Dividend/DividendEntry";

//Dividend Creation
export const usePostDividendCreate = () => {
  const postDividendCreate = async (data: DividendData) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/dividend/create/`,
      data
    );
    return response.data.responseData;
  };

  return useMutation({
    mutationKey: ["dividendCreate"],
    mutationFn: postDividendCreate,
  });
};

//Get Auction list details end points

export const useGetDividendList = (
  page_no: number,
  start_date: string,
  end_date: string,
  search: any
) => {
  const getDividendList = async (
    pageNo: number,
    start_date: string,
    end_date: string,
    search: any
  ) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/dividend/list/?from_date=${start_date}&page=${pageNo}&to_date=${end_date}&search=${search}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: () => getDividendList(page_no, start_date, end_date, search),
    queryKey: ["dividendList", page_no, start_date, end_date, search],
    placeholderData: keepPreviousData,
  });
};

// Get Auction list details by id end points

// export const useGetDividendListID = (id: any) => {
//     const getDividendListID = async (id: any) => {
//         const response = await axiosInstance.get(
//             `/accounting/api/v1/dividend/list/?id=${id}`
//         );
//         return response.data;
//     }
//     return useQuery({
//         queryFn: () => getDividendListID(id),
//         queryKey: ['dividendList', id],
//         enabled: !!id,
//     })
// }

//Patch parameters-bank-details Services

export const usePatchDividendDetails = (id: number) => {
  const queryClient = useQueryClient();
  const patchDividendDetails = async (data: any) => {
    const response = await axiosInstance.patch(
      `/accounting/api/v1/dividend/update/${id}/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: patchDividendDetails,
    mutationKey: ["dividendList", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dividendList"] });
    },
  });
};

//Get Auction list details end points

export const useGetDividendSettlementList = (
  page_number: number,
  start_date: string,
  end_date: string,
  scheme_name: any
) => {
  const getDividendSettlementList = async (
    pageNo: number,
    start_date: string,
    end_date: string,
    scheme_name: any
  ) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/dividend/list-dividend-settlement/?from_date=${start_date}&page=${pageNo}&to_date=${end_date}&search=${scheme_name}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: () =>
      getDividendSettlementList(page_number, start_date, end_date, scheme_name),
    queryKey: ["DividendList", page_number, start_date, end_date, scheme_name],
  });
};

//Dividend Creation
export const usePostDividendSettlementCreate = () => {
  const queryClient = useQueryClient();
  const postDividendSettlementCreate = async (data) => {
    // console.log("data", data);
    const response = await axiosInstance.post(
      `/accounting/api/v1/dividend/create-dividend-settlement/`,
      data
    );
    return response.data.responseData;
  };

  return useMutation({
    mutationFn: postDividendSettlementCreate,
    // mutationKey: ["DividendList"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dividendList"] });
    },
  });
};

//Dividend Eligible shares

export const usePostEligibleShares = () => {
  const postEligibleShares = async (data) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/dividend/eligible-share-units/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: postEligibleShares,
    mutationKey: ["eligibleshares"],
  });
};

// Posting

export const useGetDividendPostingList = (
  page_no: number,
  start_date: string,
  end_date: string,
  search: any
) => {
  const getDividendPostingList = async (
    page_no: number,
    start_date: string,
    end_date: string,
    search: any
  ) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/dividend/list-pending/?from_date=${start_date}&page=${page_no}&to_date=${end_date}&search=${search}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: () =>
      getDividendPostingList(page_no, start_date, end_date, search),
    queryKey: ["pendingDividendList", page_no, start_date, end_date, search],
    placeholderData: keepPreviousData,
  });
};

export const usePostDividendPostingList = () => {
  const queryClient = useQueryClient();
  const postDividendPostingList = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/dividend/approve-pending/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: postDividendPostingList,
    mutationKey: ["pendingDividendList"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingDividendList"] });
    },
  });
};

export const usePostPendingDividendReject = () => {
  const queryClient = useQueryClient();
  const pendingDividendReject = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/dividend/reject-pending/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: pendingDividendReject,
    mutationKey: ["pendingDividendList"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingDividendList"] });
    },
  });
};

// Dividend Settlement Posting related services

export const useGetAllPendingDividendSettlement = (
  fromDate: string,
  toDate: string,
  search: string,
  pageNumber: number
) => {
  const getAllPendingDividendSettlement = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/dividend/list-pending-dividend-settlement/?search=${search}&from_date=${fromDate}&to_date=${toDate}&page=${pageNumber}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: [
      "getAllPendingDividendSettlement",
      fromDate,
      toDate,
      search,
      pageNumber,
    ],
    queryFn: () => getAllPendingDividendSettlement(),
    placeholderData: keepPreviousData,
  });
};

export const usePostApproveDividendSettlement = () => {
  const queryClient = useQueryClient();
  const PostApproveDividendSettlement = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/dividend/approve-pending-dividend-settlement/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PostApproveDividendSettlement,
    mutationKey: ["approveDividendSettlement"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllPendingDividendSettlement"],
      });
    },
  });
};

export const useGetAllRejectedDividendSettlement = () => {
  const getAllRejectedDividendSettlement = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/dividend/list-rejected-dividend-settlement/`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["getAllRejectedDividendSettlement"],
    queryFn: () => getAllRejectedDividendSettlement(),
    placeholderData: keepPreviousData,
  });
};

export const usePostRejectDividendSettlement = () => {
  const queryClient = useQueryClient();
  const PostRejectDividendSettlement = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/dividend/reject-pending-dividend-settlement/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PostRejectDividendSettlement,
    mutationKey: ["rejectDividendSettlement"],

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllPendingDividendSettlement"],
      });
    },
  });
};
