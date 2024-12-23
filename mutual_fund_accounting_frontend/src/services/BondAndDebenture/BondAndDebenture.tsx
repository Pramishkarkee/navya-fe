import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";
import { useMutation } from "@tanstack/react-query";

// For Getting Bond And Debenture Data List
const getBondAndDebentureData = async (
  pageNo: number,
  start_date: string,
  end_date: string,
  id: any
) => {
  // const response = await axiosInstance.get(`/accounting/api/v1/debentures/list/?from_date=${start_date}&page=${pageNo}&to_date=${end_date}&search=${id}`);
  const response = await axiosInstance.get(
    `/accounting/api/v1/bonds?from_date=${start_date}&page=${pageNo}&to_date=${end_date}&search=${id}`
  );
  return response.data;
};
export const useGetBondAndDebentureData = (
  page_number: number,
  start_date: string,
  end_date: string,
  id: any
) => {
  return useQuery({
    queryKey: [
      "GetBondAndDebentureData",
      page_number,
      start_date,
      end_date,
      id,
    ],
    queryFn: () =>
      getBondAndDebentureData(page_number, start_date, end_date, id),
    placeholderData: keepPreviousData,
    // retry: false,
  });
};

// For Creating Bond And Debenture Data
export const usePatchBondAndDebentureData = () => {
  const createBondAndDebentureData = async (data: any) => {
    const response = await axiosInstance.post(
      "/accounting/api/v1/bonds/purchase",
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: createBondAndDebentureData,
    mutationKey: ["createBondAndDebenture"],
  });
};

// For Creating Bond And Debenture Sales Data
export const usePatchBondAndDebentureSalesData = () => {
  const queryClient = useQueryClient();
  const createBondAndDebentureSalesData = async (data: any) => {
    const response = await axiosInstance.post(
      "/accounting/api/v1/bonds/sell",
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: createBondAndDebentureSalesData,
    mutationKey: ["createBondAndDebentureSales"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetBondAndDebentureData"] });
    },
  });
};

// For Getting Bond And Debenture Sales Data List
const getBondAndDebentureSalesData = async (
  pageNo: number,
  start_date: string,
  end_date: string,
  id: any
) => {
  const response = await axiosInstance.get(
    `/accounting/api/v1/bonds/transactions?is_settled=True&txn_type=sell&from_date=${start_date}&page=${pageNo}&to_date=${end_date}&search=${id}`
  );
  return response.data;
};
export const useGetBondAndDebentureSalesData = (
  page_number: number,
  start_date: string,
  end_date: string,
  id: any
) => {
  return useQuery({
    queryKey: [
      "GetBondAndDebentureSalesData",
      page_number,
      start_date,
      end_date,
      id,
    ],
    queryFn: () =>
      getBondAndDebentureSalesData(page_number, start_date, end_date, id),
    placeholderData: keepPreviousData,
    // retry: false,
  });
};

// For Getting List of Bonds and to create a New Bond also
const getBondListData = async (data: string) => {
  const response = await axiosInstance.get(
    `/accounting/api/v1/bonds/dropdown?search=${data}`
  );
  return response.data;
};
export const useGetBondListData = (search_data: string) => {
  return useQuery({
    queryKey: ["GetBondSalesData", search_data],
    queryFn: () => getBondListData(search_data),
    retry: false,
  });
};

// For Getting Bond List data with pagination
const getBondDataList = async (pageNo, id, pageSize) => {
  const response = await axiosInstance.get(
    `/accounting/api/v1/bonds/bond-list/?page=${pageNo}&search=${id}&per_page=${pageSize}`
  );
  return response.data;
};
export const useGetBondDataList = (page_number, id, pageSize) => {
  return useQuery({
    queryKey: ["GetBondDataList", page_number, id, pageSize],
    queryFn: () => getBondDataList(page_number, id, pageSize),
    placeholderData: keepPreviousData,
    // retry: false,
  });
};

// For Getting List of Amortization Methods
const getAmortizationMethodData = async () => {
  const response = await axiosInstance.get(
    `accounting/api/v1/bonds/amortization-methods`
  );
  return response.data;
};
export const useGetAmortizationMethodData = () => {
  return useQuery({
    queryKey: ["GetAmortizationMethodData"],
    queryFn: getAmortizationMethodData,
    retry: false,
  });
};

export const useGetPendingSettlementList = (
  type: string,
  status: string,
  broker_code: string,
  bond_name: string,
  pageNo: number
) => {
  const getPendingSettlementList = async (
    type: string,
    status: string,
    broker_code: string,
    bond_name: string,
    pageNo: number
  ) => {
    // let apiUrl = `/accounting/api/v1/debentures/pending-settlement/?broker_code=${broker_code}&search=${bond_name}`;
    let apiUrl = `/accounting/api/v1/bonds/transactions/list-for-settlements?broker_code=${broker_code}&search=${bond_name}&page=${pageNo}`;

    if (type !== "all") {
      apiUrl += `&txn_type=${type}`;
    }
    if (status !== "all") {
      apiUrl += `&bond_status=${status}`;
    }

    const response = await axiosInstance.get(apiUrl);
    return response.data;
  };

  return useQuery({
    queryKey: [
      "PendingSettlementList",
      type,
      status,
      broker_code,
      bond_name,
      pageNo,
    ],
    queryFn: () =>
      getPendingSettlementList(type, status, broker_code, bond_name, pageNo),
    placeholderData: keepPreviousData,
  });
};

// Bond and Debenture Settlement Transaction Submission
export const useBondSettlementTransaction = () => {
  const queryClient = useQueryClient();

  const postBondSettlementTransaction = async (data) => {
    // console.log("data", data);
    // const response = await axiosInstance.post(`/accounting/api/v1/debentures/debenture-settlement/`, data);
    const response = await axiosInstance.post(
      `/accounting/api/v1/bonds/transactions/settle`,
      data
    );
    return response.data;
  };

  return useMutation({
    mutationKey: ["BondSettlementTransaction"],
    mutationFn: postBondSettlementTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PandingSettlementList"] });
    },
    // onSettled: (data, error) => {
    //     // console.log("User Created data", data);
    //     // console.log("Error", error);
    // },
  });
};

// Searchnig Bond and Debenture Data
// export const useGetBondListBySearch = (id: any) => {
//   const getBondListBySearch = async (id: any) => {
//       const response = await axiosInstance.get(`/accounting/api/v1/debentures/debenture-settlement/?search=${id}`,);
//       return response.data;
//   }
//   return useQuery({
//       queryKey: ['BondListBySearch', id],
//       queryFn: () => getBondListBySearch(id),

//   })
// }

// DELETE Bond Data
export const useDeletebondDetails = (id: number) => {
  const queryClient = useQueryClient();
  const deletebondDetails = async (data: any) => {
    const response = await axiosInstance.delete(
      `/accounting/api/v1/parameters/bonds/${id}/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: deletebondDetails,
    mutationKey: ["GetBondSalesData", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetBondSalesData"] });
    },
  });
};

// Edit Bond Data
export const usePatchBondDetails = (id: number) => {
  const queryClient = useQueryClient();
  const PatchPatchBondDetails = async (data: any) => {
    const response = await axiosInstance.patch(
      `/accounting/api/v1/bonds/${id}/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: PatchPatchBondDetails,
    mutationKey: ["GetBondSalesData", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetBondDataList"] });
    },
  });
};

export const usePatchBondAndDebentureDetails = (id: number) => {
  const queryClient = useQueryClient();
  const PatchPatchStockDetails = async (data: any) => {
    const response = await axiosInstance.patch(
      `/accounting/api/v1/bonds/transactions/${id}/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: PatchPatchStockDetails,
    mutationKey: ["PendingSettlementList", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PendingSettlementList"] });
    },
  });
};

//For Undo bond and debenture transaction list
export const useDeleteBondAndDebentureTransactionDetails = (id: number) => {
  const queryClient = useQueryClient();
  const deleteStockTransactionDetails = async (data: any) => {
    const response = await axiosInstance.delete(
      `/accounting/api/v1/bonds/transactions/${id}/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: deleteStockTransactionDetails,
    mutationKey: ["PendingSettlementList", id],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["PendingSettlementList"],
      });
    },
  });
};

export const useGetBondAndDebenturePostingList = () => {
  const getBondAndDebenturePostingList = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/bonds/transactions?is_settled=False`
    );
    return response.data;
  };
  return useQuery({
    queryFn: () => getBondAndDebenturePostingList(),
    queryKey: ["BondAndDebenturePostingList"],
    placeholderData: keepPreviousData,
  });
};

// Bond and debenture posting related services

export const useGetPendingBondAndDebentureList = (
  searchValue: string,
  type: string,
  status: string,
  broker_code: string,
  pageNo: number
) => {
  const PendingBondAndDebentureList = async () => {
    let apiUrl = `/accounting/api/v1/bonds/transactions/list-pending?broker_code=${broker_code}&search=${searchValue}&page=${pageNo}`;

    if (type !== "all") {
      apiUrl += `&txn_type=${type}`;
    }
    if (status !== "all") {
      apiUrl += `&bond_status=${status}`;
    }

    const response = await axiosInstance.get(apiUrl);
    return response.data;
  };
  return useQuery({
    queryFn: PendingBondAndDebentureList,
    queryKey: [
      "PendingBondAndDebentureList",
      searchValue,
      type,
      status,
      broker_code,
      pageNo,
    ],
    placeholderData: keepPreviousData,
  });
};

export const usePostBondAndDebenturePostingApprove = () => {
  const queryClient = useQueryClient();
  const postBondAndDebenturePostingList = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/bonds/transactions/approve-pending`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: postBondAndDebenturePostingList,
    mutationKey: ["PendingBondAndDebenturePosting"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["PendingBondAndDebentureList"],
      });
    },
  });
};

export const usePostBondAndDebentureReject = () => {
  const queryClient = useQueryClient();
  const BondAndDebenturePostingReject = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/bonds/transactions/reject-pending`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: BondAndDebenturePostingReject,
    mutationKey: ["PendingBondAndDebenturePostingReject"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["PendingBondAndDebentureList"],
      });
    },
  });
};

//Bond and debenture settlement posting related services

export const useGetPendingBondAndDebentureSettlementList = (
  searchValue: string,
  pageNo: number,
  startDate: string,
  endDate: string
  // broker_code: string,
) => {
  const PendingBondAndDebentureSettlementList = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/bonds/list-pending-settlements?search=${searchValue}&from_date=${startDate}&to_date=${endDate}&page=${pageNo}`
    );
    return response.data;

    // if (type !== "all") {
    //   apiUrl += `&txn_type=${type}`;
    // }
    // if (status !== "all") {
    //   apiUrl += `&bond_status=${status}`;
    // }
  };
  return useQuery({
    queryFn: PendingBondAndDebentureSettlementList,
    queryKey: [
      "PendingBondAndDebentureSettlementList",
      searchValue,
      pageNo,
      startDate,
      endDate,
    ],
    placeholderData: keepPreviousData,
  });
};

export const usePostBondAndDebentureSettlementApprove = () => {
  const queryClient = useQueryClient();
  const approveBondAndDebentureSettlement = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/bonds/approve-pending-settlements`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: approveBondAndDebentureSettlement,
    mutationKey: ["PendingBondAndDebentureSettlementPosting"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["PendingBondAndDebentureSettlementList"],
      });
    },
  });
};

export const usePostBondAndDebentureSettlementReject = () => {
  const queryClient = useQueryClient();
  const BondAndDebentureSettlementReject = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/bonds/reject-pending-settlements`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: BondAndDebentureSettlementReject,
    mutationKey: ["PendingBondAndDebentureSettlementReject"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["PendingBondAndDebentureSettlementList"],
      });
    },
  });
};

// export const useGetRejectedBondAndDebentureSettlementList = () => {
//   const RejectedBondAndDebentureSettlementList = async () => {
//     const response = await axiosInstance.get(
//       `/accounting/api/v1/bonds/list-rejected-settlements`
//     );
//     return response.data;
//   };
//   return useQuery({
//     queryFn: RejectedBondAndDebentureSettlementList,
//     queryKey: ["RejectedBondAndDebentureSettlementList"],
//     placeholderData: keepPreviousData,
//   });
// };

// Bond and Debenture Sells posting module
//Bond and debenture settlement posting related services

export const useGetPendingBondAndDebentureSellsList = (
  searchValue: string,
  pageNo: number,
  startDate: string,
  endDate: string
) => {
  const PendingBondAndDebentureSelltList = async () => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/bonds/list-pending-settlements?search=${searchValue}&from_date=${startDate}&to_date=${endDate}&page=${pageNo}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: PendingBondAndDebentureSelltList,
    queryKey: [
      "PendingBondAndDebentureSellList",
      searchValue,
      pageNo,
      startDate,
      endDate,
    ],
    placeholderData: keepPreviousData,
  });
};

export const usePostBondAndDebentureSellApprove = () => {
  const queryClient = useQueryClient();
  const approveBondAndDebentureSell = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/bonds/approve-pending-settlements`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: approveBondAndDebentureSell,
    mutationKey: ["PendingBondAndDebentureSellPosting"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["PendingBondAndDebentureSellList"],
      });
    },
  });
};

export const usePostBondAndDebentureSellReject = () => {
  const queryClient = useQueryClient();
  const BondAndDebentureSellReject = async (data: any) => {
    const response = await axiosInstance.post(
      `/accounting/api/v1/bonds/reject-pending-settlements`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: BondAndDebentureSellReject,
    mutationKey: ["PendingBondAndDebentureSellReject"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["PendingBondAndDebentureSellList"],
      });
    },
  });
};
