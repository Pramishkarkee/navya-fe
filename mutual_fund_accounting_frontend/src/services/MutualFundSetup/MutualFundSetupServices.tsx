import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

// Get all Mutual Fund Face Value details end points
export const useGetMutalFundFaceValue = () => {
    const useMutalFundFaceValue = async () => {
        const response = await axiosInstance.get('/accounting/api/v1/parameters/par-values/')
        return response.data;
    }
    return useQuery({
        queryKey: ['getMutalFundFaceValue'],
        queryFn: useMutalFundFaceValue,
    })
}

// Get all Mutual Fund Setup details end points
export const useGetMutualFundSetupList = (page_no: number) => {
    const getMutualFundSetupList = async (PageNo: number) => {
        const response = await axiosInstance.get(`/accounting/api/v1/accounting/scheme-details/?page=${PageNo}`)
        return response.data;
    }
    return useQuery({
        queryKey: ['getMutualFundSetup' , page_no],
        queryFn: () => getMutualFundSetupList(page_no),
    })
}

// Post Mutual Fund shareholders file end points
export const usePostMutualFundShareholders = () => {
    const postMutualFundShareholders = async (data) => {
      const response = await axiosInstance.post(
        `/accounting/api/v1/accounting/allotment-excel-json-calculator/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    };
    return useMutation({
      mutationKey: ["getMutualFundFileSetup"],
      mutationFn: postMutualFundShareholders,
    });
  };

// Create Mutual Fund Setup end points
// export const usePostCreateMutualFundSetup = () => {
//     const queryClient = useQueryClient();

//     const postCreateMutualFundSetup = async (data) => {
//         const response = await axiosInstance.post(`/accounting/api/v1/accounting/scheme-details/`, data);
//         return response.data;
//     };

//     return useMutation({
//         mutationKey: ["getMutualFundSetup"],
//         mutationFn: postCreateMutualFundSetup,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["getMutualFundSetup"] });
//         },
       
//     });
// };


// Create New Mutual Fund Setup end points
export const usePostCreateMutualFundSetup = () => {
    const queryClient = useQueryClient();

    const postCreateMutualFundSetup = async (data) => {
     // const response = await axiosInstance.post(`/accounting/api/v1/accounting/scheme-details/`, data,
        const response = await axiosInstance.post(`/accounting/api/v1/accounting/initial-scheme-allotted`, data,
        {
            headers :{
                "Content-Type": "multipart/form-data",
            }
        }
        );
        return response.data;
    };

    return useMutation({
        mutationKey: ["getMutualFundSetup"],
        mutationFn: postCreateMutualFundSetup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getMutualFundSetup"] });
        },
       
    });
};

// Update Mutual Fund Setup end points
export const usePatchMutualSetup = (id: number) => {
    const queryClient = useQueryClient();
    const getPatchMutualSetup = async (data: any) => {
        const response = await axiosInstance.patch(
            `/accounting/api/v1/accounting/scheme-details/${id}/`,
            data
        );
        return response.data.responseData
    };
    return useMutation({
        mutationFn: getPatchMutualSetup,
        mutationKey: ["getMutualFundSetup", id],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getMutualFundSetup"] });
        },
    });
};

// Delete Mutual Fund Setup end points
export const useDeleteMutualSetup = (id_no : number) => {
    const queryClient = useQueryClient();
    const MutualSetupDelete = async (id: number) => {
      const response = await axiosInstance.delete(
        `/accounting/api/v1/accounting/scheme-details/${id}/`
      );
      return response.data;
    };
    return useMutation({
      mutationFn: () => MutualSetupDelete(id_no),
      mutationKey: ["getMutualFundSetup" , id_no],
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["getMutualFundSetup"]});
      }
    });
  };

// Additional Authorized Capital end points
  export const usePostAddAuthCapital = () => {
    const queryClient = useQueryClient();

    const postPostAddAuthCapital = async (data) => {
        const response = await axiosInstance.post(`/accounting/api/v1/accounting/add-seed-capital/`, data);
        return response.data;
    };

    return useMutation({
        mutationKey: ["getMutualFundSetup"],
        mutationFn: postPostAddAuthCapital,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getMutualFundSetup"] });
        },
       
    });
};

// post primary scheme details end points
export const usePostPrimarySchemeDetails = () => {
    const queryClient = useQueryClient();

    const postPrimarySchemeDetails = async (data) => {
        const response = await axiosInstance.post(`/accounting/api/v1/accounting/primary-scheme-details/`, data);
        return response.data;
    };

    return useMutation({
        mutationKey: ["getMutualFundSetup"],
        mutationFn: postPrimarySchemeDetails,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getMutualFundSetup"] });
        },
       
    });
};


// scheme Finalization summary data end points
export const useGetSchemeFinalizationSummary = (page_no) => {
    const getSchemeFinalizationSummary = async (page_no) => {
        const response = await axiosInstance.get(`/accounting/api/v1/accounting/scheme-finalization-summary/?page=${page_no}`)
        return response.data;
    }
    return useQuery({
        queryKey: ['getSchemeFinalizationSummary', page_no],
        queryFn: () => getSchemeFinalizationSummary(page_no),
    })
}
