import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

const getLedgerHeadList = async () => {
    const response = await axiosInstance.get('/accounting/api/v1/accounting/ledger_heads/')
    return response.data
}


export const useLedgerHeadList = () => {
    return useQuery({
        queryKey: ['Lea']
    })
}