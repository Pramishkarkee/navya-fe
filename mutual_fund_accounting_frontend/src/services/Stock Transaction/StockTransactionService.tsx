import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";
import { TransactionList } from "pages/Stock and Brokers/Stock Transaction/Stock Transaction/StockTransaction";

//Get all stock transaction details end points

export const useGetAllStockTransactionList = () => {
  const getAllStockTransactionList = async () => {
    const response = await axiosInstance.get(
      "/accounting/api/v1/stock_transactions/all-stock-transaction/"
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["getAllStockTransaction"],
    queryFn: getAllStockTransactionList,
  });
};

//Get all list stock settelement details end points
const getListStockSettlement = async () => {
  const response = await axiosInstance.get(
    "/accounting/api/v1/stock_transactions/list-stock-settlement/"
  );
  return response.data;
};
export const useGetListStockSettlement = () => {
  return useQuery({
    queryKey: ["getListStockSettlement"],
    queryFn: getListStockSettlement,
  });
};

//Create Stock Transaction end points
export const usePostCreateStockTransaction = () => {
  const postCreateStockTransaction = async (data: TransactionList) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/stock_transactions/create-stock-transaction/`,
      data
    );
    return response.data;
  };

  return useMutation({
    mutationKey: ["createStockTransaction"],
    mutationFn: postCreateStockTransaction,
  });
};

//Get Stock Transaction list details by id end points
export const useGetStockTransactionListID = (id: any) => {
  const getStockTransactionListID = async (id: any) => {
    try {
      const response = await axiosInstance.get(
        `/accounting/api/v1/stock_transactions/update-stock-transaction/${id}/`
      );
      return response.data;
    } catch (err) {
      return null;
    }
  };

  return useQuery({
    queryFn: () => getStockTransactionListID(id),
    queryKey: ["getAllStockTransaction", id],
    enabled: !!id,
  });
};

//Patch parameters-bank-details Services
export const usePatchStockDetails = (id: number) => {
  const queryClient = useQueryClient();
  const PatchPatchStockDetails = async (data: any) => {
    const response = await axiosInstance.patch(
      `/accounting/api/v1/stock_transactions/update-stock-transaction/${id}/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: PatchPatchStockDetails,
    mutationKey: ["getAllStockTransaction", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllStockTransaction"] });
    },
  });
};

//Create Stock Transaction end points
export const usePostCreateSettlementTransaction = () => {
  const queryClient = useQueryClient();

  const postCreateSettlementTransaction = async (data) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/stock_transactions/create-stock-settlement/`,
      data
    );
    return response.data;
  };

  return useMutation({
    mutationKey: ["getAllStockTransaction"],
    mutationFn: postCreateSettlementTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllStockTransaction"] });
    },
  });
};

//Get all stock transaction details end points

export const useGetAllSettlementTransactionList = () => {
  const getAllSettlementTransactionList = async () => {
    const response = await axiosInstance.get(
      "/accounting/api/v1/stock_transactions/list-stock-settlement/?is_settlement=true"
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["getAllSettlementTransaction"],
    queryFn: getAllSettlementTransactionList,
  });
};

export const useGetStockTransactionSettlementListDate = (
  fromDate: string,
  toDate: string,
  page_No: number,
  id: any
) => {
  const getStockTransactionSettlementListDate = async (
    fromDate: string,
    toDate: string,
    pageNo: number,
    id: any
  ) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/stock_transactions/list-stock-settlement/?is_settlement=true&from_date=${fromDate}&to_date=${toDate}&page=${pageNo}&search=${id}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: () =>
      getStockTransactionSettlementListDate(fromDate, toDate, page_No, id),
    queryKey: ["getAllSetteledStockTransaction", fromDate, toDate, page_No, id],
    placeholderData: keepPreviousData,
  });
};

export const useGetAllStockTransactionListByID = (id: any) => {
  const getAllStockTransactionListByID = async (id: any) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/stock_transactions/all-stock-transaction/?is_settlement=false&search=${id}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["getAllStockTransaction", id],
    queryFn: () => getAllStockTransactionListByID(id),
    enabled: !!id,
  });
};

export const useGetAllStockTransaction = () => {
  const getAllStockTransaction = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/stock_transactions/all-stock-transaction/?is_settlement=false`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["getAllStockTransaction"],
    queryFn: () => getAllStockTransaction(),
  });
};

export const useGetStockTransactionListDate = (
  fromDate: string,
  toDate: string,
  page_No: number,
  brokerCode: string
) => {
  const getStockTransactionListDate = async (
    fromDate: string,
    toDate: string,
    pageNo: number,
    brokerCode: string
  ) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/stock_transactions/all-stock-transaction/?is_settlement=false&from_date=${fromDate}&to_date=${toDate}&page=${pageNo}&broker_code=${brokerCode}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: () =>
      getStockTransactionListDate(fromDate, toDate, page_No, brokerCode),
    queryKey: ["getAllStockTransaction", fromDate, toDate, page_No, brokerCode],
    placeholderData: keepPreviousData,
  });
};

// Just for testing purpose only
export const usePostCreateSettlementTransactionTest = () => {
  const queryClient = useQueryClient();

  const postCreateSettlementTransactionTest = async (data) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/stock_transactions/create-stock-settlement/`,
      data
    );
    return response.data;
  };

  return useMutation({
    mutationKey: ["getAllStockTransaction"],
    mutationFn: postCreateSettlementTransactionTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllStockTransaction"] });
    },
  });
};

///Broker Code filterations
export const useGetBrokerListDate = (data: any) => {
  const getBrokerListID = async (data: any) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/parameters/broker-list`
    );
    return response.data;
  };
  return useQuery({
    queryFn: () => getBrokerListID(data),
    queryKey: ["getAllBrokerList", data],
  });
};

///Stock Symbol  filterations
export const useGetStockSymbolList = () => {
  const getStockSymbolList = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/parameters/stock-list/?listed=true`
    );
    return response.data;
  };
  return useQuery({
    queryFn: () => getStockSymbolList(),
    queryKey: ["getAllStockSymbolList"],
  });
};

//Get Stock Transaction Btoker Rate list details by id end points
export const useGetStockTransactionBrokerRateListID = (id: any) => {
  const getStockTransactionBrokerRateListID = async (id: any) => {
    try {
      const response = await axiosInstance.get(
        `/accounting/api/v1/stock_transactions/stock-transaction-broker-commissions/${id}/`
      );
      return response.data;
    } catch (err) {
      return null;
    }
  };

  return useQuery({
    queryFn: () => getStockTransactionBrokerRateListID(id),
    queryKey: ["getAllStockTransactionBrokerRateList", id],
    enabled: !!id,
  });
};

//For Undo stock transaction list
export const useDeleteStockTransactionDetails = (id: number) => {
  const queryClient = useQueryClient();
  const deleteStockTransactionDetails = async (data: any) => {
    const response = await axiosInstance.delete(
      `/accounting/api/v1/stock_transactions/reject-stock-transaction/${id}/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: deleteStockTransactionDetails,
    mutationKey: ["getAllStockTransaction", id],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllStockTransaction"],
      });
    },
  });
};

//post posting Services
export const usePostStockTransaction = () => {
  const queryClient = useQueryClient();
  const PostStockTransaction = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/stock_transactions/all-stock-transaction/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: PostStockTransaction,
    mutationKey: ["getAllStockTransaction"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllStockTransaction"] });
    },
  });
};

//Pending and Posting stock transaction services
export const useGetAllPendingStockTransaction = (
  fromDate: string,
  toDate: string,
  search: string,
  pageNumber: number
) => {
  const getAllPendingStockTransaction = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/stock_transactions/all-pending-stock-transaction/?search=${search}&from_date=${fromDate}&to_date=${toDate}&page=${pageNumber}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: [
      "getAllPendingStockTransaction",
      fromDate,
      toDate,
      search,
      pageNumber,
    ],
    queryFn: () => getAllPendingStockTransaction(),
    placeholderData: keepPreviousData,
  });
};

export const usePostApproveStockTransaction = () => {
  const queryClient = useQueryClient();
  const PostApproveStockTransaction = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/stock_transactions/approve-stock-transaction/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PostApproveStockTransaction,
    mutationKey: ["approveStockTransaction"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllPendingStockTransaction"],
      });
    },
  });
};

//Rejected stock transaction services
export const useGetAllRejectedStockTransaction = () => {
  const getAllRejectedStockTransaction = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/stock_transactions/all-rejected-stock-transaction/`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["getAllRejectedStockTransaction"],
    queryFn: () => getAllRejectedStockTransaction(),
    placeholderData: keepPreviousData,
  });
};

export const usePostRejectStockTransaction = () => {
  const queryClient = useQueryClient();
  const PostRejectStockTransaction = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/stock_transactions/reject-pending-stock-transaction/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PostRejectStockTransaction,
    mutationKey: ["rejectStockTransaction"],

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllPendingStockTransaction"],
      });
    },
  });
};

//Stock Settlement Posting related services

export const useGetAllPendingStockSettlement = (
  fromDate: string,
  toDate: string,
  search: string,
  pageNumber: number
) => {
  const getAllPendingStockSettlement = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/stock_transactions/list-pending-stock-settlement/?search=${search}&from_date=${fromDate}&to_date=${toDate}&page=${pageNumber}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: [
      "getAllPendingStockSettlement",
      fromDate,
      toDate,
      search,
      pageNumber,
    ],
    queryFn: () => getAllPendingStockSettlement(),
    placeholderData: keepPreviousData,
  });
};

export const usePostApproveStockSettlement = () => {
  const queryClient = useQueryClient();
  const PostApproveStockSettlement = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/stock_transactions/approve-pending-stock-settlement/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PostApproveStockSettlement,
    mutationKey: ["getAllStockTransaction"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllPendingStockSettlement"],
      });
    },
  });
};

//Rejected stock transaction services
export const useGetAllRejectedStockSettlement = () => {
  const getAllRejectedStockSettlement = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/stock_transactions/list-rejected-stock-settlement/`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["getAllRejectedStockSettlement"],
    queryFn: () => getAllRejectedStockSettlement(),
    placeholderData: keepPreviousData,
  });
};

export const usePostRejectStockSettlement = () => {
  const queryClient = useQueryClient();
  const PostRejectStockSettlement = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/stock_transactions/reject-pending-stock-settlement/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PostRejectStockSettlement,
    mutationKey: ["rejectStockTransaction"],

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllPendingStockSettlement"],
      });
    },
  });
};
