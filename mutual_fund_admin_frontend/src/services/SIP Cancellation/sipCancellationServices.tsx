import {
  useMutation,
  useQueryClient,
  useQuery,
  skipToken,
  keepPreviousData,
} from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

interface searchDataInterface {
  dp?: string;
  distributionCenter?: string;
  schemeName?: string;
  boid?: string;
}

const getFilteredSipList = async (
  searchData: searchDataInterface,
  page: number
) => {
  // const response = await axiosInstance.get(`/sip-up/api/v1/sip/sip-list/?boid_no=${searchData.boid}&db_center=${searchData.distributionCenter}&scheme_name=${searchData.schemeName}`)
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-list/?page=${page}&boid_no=${searchData.boid}&scheme_name=${searchData.schemeName}&sip_status=success`
  );

  return response.data;
};

export const useGetFilteredSipList = (searchData, page: number) => {
  return useQuery({
    queryKey: ["FilteredSip"],
    queryFn:
      searchData.boid && searchData.schemeName
        ? () => getFilteredSipList(searchData, page)
        : skipToken,
    placeholderData: keepPreviousData,
  });
};

//sip cancel entry
const cancelSipEntry = async (id: number) => {
  const response = await axiosInstance.put(
    `/sip-up/api/v1/sip/sip-cancelled-entry/${id}/`
  );
  return response.data;
};

export const useCancelSipMutation = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cancelSipEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["FilteredSip"] });
    },
  });
};

//sip cancel posting
const cancelSipPosting = async (data) => {
  const response = await axiosInstance.put(
    `/sip-up/api/v1/sip/sip-cancelled/`,
    data
  );
  return response.data;
};

export const useCancelSipPostingMutation = (data) => {
  return useMutation({
    mutationFn: () => cancelSipPosting(data),
  });
};

const cancelSipPostingList = async (schemeName: string, page: number) => {
  const response = await axiosInstance.get(
    `/sip-up/api/v1/sip/sip-list/?&scheme_name=${schemeName}&${page}&sip_status=cancelled-entry`
  );
  return response.data;
};

export const useGetSipPostingList = (schemeName: string, page: number) => {
  return useQuery({
    queryKey: ["CancelSipPostingList"],
    queryFn: () => cancelSipPostingList(schemeName, page),
    placeholderData: keepPreviousData,
  });
};

export const useGetCancellationPostingDetail = (
  fromDate: string,
  toDate: string
) => {
  const cancellationPostingDetail = async () => {
    const response = await axiosInstance.get(
      // `/sip-up/api/v1/sip/sip-amendment-list/?from_date=${fromDate}&to_date=${toDate}`
      `/sip-up/api/v1/sip/sip-list/?sip_status=cancelled-entry&from_date=${fromDate}&to_date=${toDate}&scheme_name=NIC%20ASIA%20Dynamic%20Debt%20Fund`
    );
    return response.data;
  };
  return useQuery({
    queryFn: fromDate && toDate ? cancellationPostingDetail : skipToken,
    // queryFn: amendmentPostingDetail,
    queryKey: ["CancelSipPostingList"],
    placeholderData: keepPreviousData,
  });
};

const authorizeCancelSip = async (data) => {
  const response = await axiosInstance.patch(
    `/sip-up/api/v1/sip/sip-cancelled/`,
    data
  );
  return response.data;
};

export const useAuthorizeCancelSipMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authorizeCancelSip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CancelSipPostingList"] });
    },
  });
};

// export const useGetSipCancelPostingDetail = (
//   fromDate: string,
//   toDate: string,
//   boid_no: string,
//   enableBetweenDates:boolean
// ) => {
//   const SipCancelPostingDetail = async () => {
//     const response = await axiosInstance.get(
//       `/sip-up/api/v1/sip/sip-list/?sip_status=cancelled-entry&from_date=${fromDate}&to_date=${toDate}&scheme_name=NIC%20ASIA%20Dynamic%20Debt%20Fund&boid_no=${boid_no}`
//     );
//     return response.data;
//   };
//   return useQuery({
//     queryFn: fromDate && toDate  ? SipCancelPostingDetail : skipToken,
//     // queryFn: amendmentPostingDetail,
//     queryKey: ["SIPCancellationPosting"],
//     enabled: enableBetweenDates,
//   });
// };

// export const useGetSipCancelPostingDetail = (
//   fromDate: string,
//   toDate: string,
//   boid_no: string | null,
//   enableBetweenDates:boolean
// ) => {
//   const SipCancelPostingDetail = async () => {
//     const response = await axiosInstance.get(
//       `/sip-up/api/v1/sip/sip-list/?sip_status=cancelled-entry&from_date=${fromDate}&to_date=${toDate}&scheme_name=NIC%20ASIA%20Dynamic%20Debt%20Fund`
//     );
//     return response.data;
//   };
//   const {data,isLoading,isSuccess,refetch}= useQuery({
//     queryFn: fromDate && toDate  ? SipCancelPostingDetail : skipToken,
//     // queryFn: amendmentPostingDetail,
//     queryKey: ["SIPCancellationPosting"],
//     enabled: enableBetweenDates,
//   });

//   return {
//     amendmentPostingdata:data?.responseData?.results ?? [],
//     amendmentPostingDatasuccess:isSuccess,
//     refetch,
//     isFetchingData:isLoading
//   }
// };
