import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";
import { AuctionData } from "pages/IPORightShareAndAuction/Corporate Auction/Auction Entry/AuctionEntry";

// interface AuctionData {
//   application_form_number: number;
//   stock: number;
//   applied_units: number;
//   per_share_value: number;
//   share_application_type: string;
//   apply_date: string;
//   bank: number;
//   form_fee: number;
//   // branch_name: string;
//   bank_account_number: string;
//   cheque_number: string;
//   deposit_amount: number;
//   bank_name_id?: number;
//   schema_name: string;
// }

//Auction Creation
export const usePostAuctionCreate = () => {
  const postAuctionCreate = async (data: AuctionData) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/auction/create/`,
      data
    );
    return response.data.responseData;
  };

  return useMutation({
    mutationKey: ["auction"],
    mutationFn: postAuctionCreate,
  });
};

//Get Auction list details end points

export const useGetAuctionList = (page_no: number) => {
  const getAuctionList = async (pageNo: number) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/auction/list/?page=${pageNo}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["auctionList", page_no],
    queryFn: () => getAuctionList(page_no),
    placeholderData: keepPreviousData,
  });
};

// Get Auction list details by id end points

export const useGetAuctionListDate = (
  fromDate: string,
  toDate: string,
  id: any
) => {
  const getAuctionListID = async (
    fromDate: string,
    toDate: string,
    id: any
  ) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/auction/list/?from_date=${fromDate}&to_date=${toDate}&search=${id}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: () => getAuctionListID(fromDate, toDate, id),
    queryKey: ["auctionList", fromDate, toDate, id],
    placeholderData: keepPreviousData,
  });
};
export const useGetAuctionListID = (id: any) => {
  const getAuctionListID = async (id: any) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/auction/list/?search=${id}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: () => getAuctionListID(id),
    queryKey: ["auctionList", id],
    placeholderData: keepPreviousData,
    enabled: !!id,
  });
};

//Patch parameters-bank-details Services

export const usePatchAuctionDetails = (id: number) => {
  const queryClient = useQueryClient();
  const patchAuctionDetails = async (data: any) => {
    const response = await axiosInstance.patch(
      `/accounting/api/v1/auction/update/${id}/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: patchAuctionDetails,
    mutationKey: ["auctionList", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctionList"] });
    },
  });
};

// POSTING
export const useGetPendingAuctionList = (
  fromDate: string,
  toDate: string,
  search: any,
  pageNo: number
) => {
  const getPendingAuctionList = async (
    fromDate: string,
    toDate: string,
    search: any,
    pageNo: number
  ) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/auction/list-pending/?from_date=${fromDate}&to_date=${toDate}&search=${search}&page=${pageNo}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: () => getPendingAuctionList(fromDate, toDate, search, pageNo),
    queryKey: ["pendingAuctionList", fromDate, toDate, search, pageNo],
    placeholderData: keepPreviousData,
    // enabled: !!id,
  });
};

export const usePostPendingAuctionPosting = () => {
  const queryClient = useQueryClient();
  const PendingAuctionPosting = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/auction/approve-pending/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PendingAuctionPosting,
    mutationKey: ["postAuctionPostingList"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingAuctionList"],
      });
    },
  });
};

export const usePostPendingAuctionReject = () => {
  const queryClient = useQueryClient();
  const PendingAuctionReject = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/auction/reject-pending/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PendingAuctionReject,
    mutationKey: ["postAuctionReject"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingAuctionList"],
      });
    },
  });
};

//Auction Allotment, Allotment posting and List
//Auction Allotment
export const useGetPendingAllotmentList = (
  fromDate: string,
  toDate: string,
  search: any,
  pageNo: number
) => {
  const getPendingAllotmentList = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/auction/list-non-allotted-auction-pending/?from_date=${fromDate}&to_date=${toDate}&search=${search}&page=${pageNo}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: getPendingAllotmentList,
    queryKey: ["pendingAuctionAllotment", fromDate, toDate, search, pageNo],
    placeholderData: keepPreviousData,
  });
};

export const usePatchAllotAuction = () => {
  const queryClient = useQueryClient();
  const patchAllotAuction = async (data: any) => {
    const response = await axiosInstance.patch(
      `/accounting/api/v1/auction/allotted-auction/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: patchAllotAuction,
    mutationKey: ["auctionAllotmentList"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingAuctionAllotment"] });
    },
  });
};

//Auction Allotment posting
export const useGetPendingAuctionAllotmentList = (
  fromDate: string,
  toDate: string,
  search: any,
  pageNo: number
) => {
  const getPendingAuctionAllotmentList = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/auction/list-allotted-auction-pending/?from_date=${fromDate}&to_date=${toDate}&search=${search}&page=${pageNo}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: getPendingAuctionAllotmentList,
    queryKey: ["pendingAuctionAllotmentList", fromDate, toDate, search, pageNo],
    placeholderData: keepPreviousData,
  });
};

export const usePostPendingAuctionAllotment = () => {
  const queryClient = useQueryClient();
  const PostAuctionAllotment = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/auction/approve-allotted-pending/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PostAuctionAllotment,
    mutationKey: ["postAuctionAllotPosting"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingAuctionAllotmentList"],
      });
    },
  });
};

export const usePostPendingAuctionAllotmentReject = () => {
  const queryClient = useQueryClient();
  const PostPendingAuctionReject = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/auction/allotted-reject/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PostPendingAuctionReject,
    mutationKey: ["postAuctionRejectPosting"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingAuctionAllotmentList"],
      });
    },
  });
};
