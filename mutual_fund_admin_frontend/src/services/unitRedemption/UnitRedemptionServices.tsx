import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

//Unit Redemption entry Services

export const useGetUnitRedemptionEntryList = (boid) => {
  const getUnitRedemptionEntryList = async (data) => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/unit-purchase/get_total_information_view/?boid_number=${data}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: () => getUnitRedemptionEntryList(boid),
    queryKey: ["unitredemption", boid],
    enabled: !!boid,
    placeholderData: keepPreviousData,
  });
};

//Unit Redemption Posting Services
export const usePatchUnitRedemptionPosting = () => {
  const queryClient = useQueryClient();
  const PatchUnitRedemptionPosting = async (data) => {
    const response = await axiosInstance.patch(
      `/sip-up/api/v1/unit-purchase/redemption-posting/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: PatchUnitRedemptionPosting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unitredemption"] });
    },
  });
};

//total-unit-redemption-details
export const usePostTotalUnitRedemptionDetails = () => {
  const postTotalUnitRedemptionDetails = async (data) => {
    const response = await axiosInstance.post(
      `/sip-up/api/v1/unit-purchase/total-redemption-details/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: postTotalUnitRedemptionDetails,
    mutationKey: ["unitredemptiondetails"],
    // senabled: !!boid,
  });
};

// total-redemption-details-remarks
export const usePostTotalRedemptionDetailsRemarks = () => {
  const postTotalUnitRedemptionDetailsRemarks = async (data) => {
    const response = await axiosInstance.post(
      `/sip-up/api/v1/unit-purchase/total-redemption-details-remarks/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: postTotalUnitRedemptionDetailsRemarks,
    mutationKey: ["totalredemptiondetailsremarks"],
  });
};

// Redemption List Approve
// const redemptionListApprove = async (boid) => {
//   const response = await axiosInstance.put(
//     `/sip-up/api/v1/unit-purchase/total-redemption-details-list-approve/?method=fifo`,
//     { boid, updated_data: {} }
//   );
//   return response.data;
// };

// export const usePutRedemptionListApprove = (boid) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: () => redemptionListApprove(boid),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["redemptionListApprove"] });
//     },
//   });
// };

// Redemption List Rejections
// const redemptionListReject = async (boid) => {
//   const response = await axiosInstance.put(
//     `/sip-up/api/v1/unit-purchase/total-redemption-details-list-reject/`,
//     { boid, updated_data: {} }
//   );
//   return response.data;
// };

// export const usePutRedemptionListReject = (boid) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: () => redemptionListReject(boid),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["redemptionListApprove"] });
//     },
//   });
// };

export const usePutUnitRedemptionPostingApprove = () => {
  const queryClient = useQueryClient();

  const authorizeUnitRedemptionPosting = async (data) => {
    const response = await axiosInstance.put(
      `/sip-up/api/v1/unit-purchase/total-redemption-details-list-approve/?method=fifo`,
      data
    );
    return response.data;
  };

  return useMutation({
    mutationFn: authorizeUnitRedemptionPosting,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["unitredemptionapproved"] });
    },
    onError: (error) => {
      // console.log("Error", error);
    },
  });
};
export const usePutUnitRedemptionPostingReject = () => {
  const queryClient = useQueryClient();

  const rejectUnitRedemptionPosting = async (data) => {
    const response = await axiosInstance.put(
      `/sip-up/api/v1/unit-purchase/total-redemption-details-list-reject/`,
      data
    );
    return response.data;
  };

  return useMutation({
    mutationFn: rejectUnitRedemptionPosting,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["unitredemptionapproved"] });
    },
    onError: (error) => {
      // console.log("Error", error);
    },
  });
};

// For Share Holder List

export const useGetShareHolderList = (boid) => {
  const getShareHolderList = async (boid) => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/sip/share-holder-list/?boid_no=${boid}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["ShareHolderList", boid],
    queryFn: () => getShareHolderList(boid),
    placeholderData: keepPreviousData,
  });
};

//View Redemption History
const getUnitRedemptionHistory = async (data) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/unit-purchase/redemption-history/?boid_number=${data}`
  );
  return response.data;
};

export const useGetUnitRedemptionHistory = (boid) => {
  return useQuery({
    queryFn: () => getUnitRedemptionHistory(boid),
    queryKey: ["unitredemptionHistory", boid],
    enabled: !!boid,
    placeholderData: keepPreviousData,
  });
};

//View Redemption lot History

export const useGetUnitRedemptionLotHistory = (boid) => {
  const getUnitRedemptionLotHistory = async (data) => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/unit-purchase/redemption-lot-history/?boid_number=${data}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: () => getUnitRedemptionLotHistory(boid),
    queryKey: ["unitredemptionLotHistory", boid],
    enabled: !!boid,
    placeholderData: keepPreviousData,
  });
};
//Unit Redemption Lot Details

export const useGetUnitRedemptionLotDetails = (boid) => {
  const getUnitRedemptionLotDetails = async (data) => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/unit-purchase/lot-details/?boid_number=${data}`
    );
    return response.data;
  };
  return useQuery({
    queryFn: () => getUnitRedemptionLotDetails(boid),
    queryKey: ["unitredemptionlotdetsils", boid],
    enabled: !!boid,
    placeholderData: keepPreviousData,
  });
};
//Unit Redemption Detail List Services

export const useGetTotalUnitRedemptionDetailList = ({
  boid_number,
  pageIndex,
}) => {
  const getUnitRedemptionDetailList = async () => {
    const response = await axiosInstance.get(
      `/sip-up/api/v1/unit-purchase/total-redemption-details-list/?boid_number=${boid_number}&page=${pageIndex}`
    );
    return response.data;
  };

  return useQuery({
    queryFn: getUnitRedemptionDetailList,
    queryKey: ["unitredemptionapproved", boid_number, pageIndex],
    enabled: !!boid_number,
    placeholderData: keepPreviousData,
  });
};
