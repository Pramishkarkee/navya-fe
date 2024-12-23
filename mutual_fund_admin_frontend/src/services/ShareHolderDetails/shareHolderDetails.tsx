import { keepPreviousData, skipToken, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

// For Share Holder List
const getShareHolderList = async () => {
  const response = await axiosInstance.get(
    "/sip-up/api/v1/sip/share-holder-list/"
  );
  return response.data;
};
export const useGetShareHolderList = () => {
  return useQuery({
    queryKey: ["ShareHolderListTable"],
    queryFn: getShareHolderList,
    placeholderData: keepPreviousData,
  });
};

// For Share Holder List Pagination
const getShareHolderListPaination = async (offsetNo) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/share-holder-list/?limit=10&offset=${offsetNo}`
  );
  return response.data;
};
export const useGetShareHolderListPaination = (offset_number) => {
  return useQuery({
    queryKey: ["ShareHolderListPagination", offset_number],
    queryFn: () => getShareHolderListPaination(offset_number),
    placeholderData: keepPreviousData,
  });
};

// For Share Holder Detail Filter Search List
const getBOIDSearchResult = async (detail: string, page_no: number) => {
  const response = await axiosInstance.get(
    // `/sip-up/api/v1/sip/share-holder-list/?search=${boid_no}`
    // `/sip-up/api/v1/sip/share-holder-list/?limit=10&offset=${offsetNo}&search=${boid_no}`
    `/sip-up/api/v1/sip/share-holder-list/?page=${page_no}&search=${detail}`
  );
  return response.data;
};
export const useGetBOIDSearchResult = (
  holder_details: string,
  page_number: number
) => {
  return useQuery({
    queryKey: ["BOIDSearchResult", holder_details, page_number],
    queryFn: () => getBOIDSearchResult(holder_details, page_number),
    placeholderData: keepPreviousData,
  });
};

// For Share Holder Date Filter Search List
export const useGetBOIDDateSearchResult = (
  fromDate: string,
  toDate: string,
  page_no: number
) => {
  const getBOIDDateSearchResult = async () => {
    const response = await axiosInstance.get(
      // `/sip-up/api/v1/sip/share-holder-list/?from_date=${fromDate}&to_date=${toDate}`
      `sip-up/api/v1/sip/share-holder-list/?from_date=${fromDate}&page=${page_no}&to_date=${toDate}`
    );
    return response.data;
  };
  return useQuery({
    queryFn:
      fromDate && toDate && page_no ? getBOIDDateSearchResult : skipToken,
    queryKey: ["BOIDDateSearchResult"],
    placeholderData: keepPreviousData,
  });
};

// For Share Holder Details
export const getShareHolderDetails = async (id: any) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/share_holder_by_id/${id}/`
  );
  return response.data;
};
export const useGetShareHolderDetails = (id_number: number) => {
  return useQuery({
    queryKey: ["ShareHolderDetails", id_number],
    queryFn: () => getShareHolderDetails(id_number),
    placeholderData: keepPreviousData,
    // enabled: false,
  });
};

// For User SIP Details
export const getSIPDetails = async (boid: any) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-list/?boid_no=${boid}`
  );
  return response.data;
};
export const useGetSIPDetails = (boid_number: number) => {
  return useQuery({
    queryKey: ["UserSIPDetails", boid_number],
    queryFn: () => getSIPDetails(boid_number),
    placeholderData: keepPreviousData,
  });
};

// For User Unit Details
export const getUnitDetails = async (boid: any) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/unit-purchase/list/?boid_number=${boid}`
  );
  return response.data;
};
export const useGetUnitDetails = (boid_number: number) => {
  return useQuery({
    queryKey: ["UserUnitDetails", boid_number],
    queryFn: () => getUnitDetails(boid_number),
    placeholderData: keepPreviousData,
  });
};

// const getSIPPurchase = async () => {
//     const response = await axiosInstance.get('/sip-up/api/v1/sip/sip-dashboard/')
//     return response.data;
// }
// export const useGetSIPPurchase = () => {
//     return useQuery({
//         queryKey: ['DashboardSIPPurchase'],
//         queryFn: getSIPPurchase,
//     })
// }

// For Dashboard SIP Registration
// export const getDashboardSIPRegister = async (timeDataReg: string , valueDataReg: string) => {
//     const response = await axiosInstance.get(`/sip-up/api/v1/sip/sip-dashboard/?weeks_days=${timeDataReg}&con=${valueDataReg}`);
//     return response.data;
// }
// export const useGetDashboardSIPRegister = (timeReg: string , valueReg: string) => {
//     return useQuery({
//         queryKey: ['DashboardSIPRegister', timeReg , valueReg],
//         queryFn: () => getDashboardSIPRegister(timeReg , valueReg),
//     })
// }
