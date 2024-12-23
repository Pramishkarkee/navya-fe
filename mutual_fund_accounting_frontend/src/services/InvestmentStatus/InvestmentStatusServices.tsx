import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// For Creating Investment Status Data
export const usePostInvestmentStatus = () => {
    const queryClient = useQueryClient();
    const InvestmentStatusDataRequest = async (data: any) => {
        const response = await axiosInstance.post(
            '/accounting/api/v1/parameters/investment-thresh-hold/',
            data
        );
        return response.data;
    };
    return useMutation({
        mutationFn: InvestmentStatusDataRequest,
        mutationKey: ["GetAllInvestmentStatusData"],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["UpdateInvestmentStatus"] });
        }
    });
};



export const useGetInvestmentStatusData = () => {
    const InvestStatusDataList = async () => {
        const response = await axiosInstance.get('/accounting/api/v1/parameters/investment-thresh-hold/');
        return response.data;
    };
    return useQuery({
        queryKey: ['GetAllInvestmentStatusData'],
        queryFn: () => InvestStatusDataList(),
        // retry: false,
    });
};

