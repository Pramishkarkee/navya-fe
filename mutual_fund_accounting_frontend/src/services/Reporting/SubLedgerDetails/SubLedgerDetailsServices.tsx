import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

//Individual transaction details for ledger head
export const useGetLedgerTransactionDetails = (code: string, pageNo, pageSize,fromDate, toDate) => {
  const getLedgerTransactionDetails = async (code: string, pageNo, pageSize,fromDate, toDate) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/reporting/ledger-transactions/?ledger_code=${code}&page=${pageNo}&per_page=${pageSize}&from_date=${fromDate}&to_date=${toDate}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["ledgerheadtransaction", code, pageNo, pageSize,fromDate, toDate],
    queryFn: () => getLedgerTransactionDetails(code, pageNo, pageSize,fromDate, toDate),
    placeholderData: keepPreviousData,
  });
};

// Individual transaction details for sub ledger head
export const useGetSubLedgerTransactionDetails = (code: string, pageNo, pageSize,fromDate, toDate) => {
  const getSubLedgerTransactionDetails = async (code: string, pageNo, pageSize,fromDate, toDate) => {
    const response = await axiosInstance.get(
      `/accounting/api/v1/reporting/sub-ledger-transactions/?sub_ledger_code=${code}&page=${pageNo}&per_page=${pageSize}&from_date=${fromDate}&to_date=${toDate}`
    );
    return response.data;
  };
  return useQuery({
    queryKey: ["subledgerheadtransaction", code, pageNo, pageSize,fromDate, toDate],
    queryFn: () => getSubLedgerTransactionDetails(code, pageNo, pageSize,fromDate, toDate),
    placeholderData: keepPreviousData,
  });
};

//List Of Ledger Head
export const useGetLedgerList = () => {
  const subLedgerList = async () => {
    const response = await axiosInstance.get(`/accounting/api/v1/reporting/ledger-list/`);
    return response.data;
  };
  return useQuery({
    queryKey: ["ledgerhead"],
    queryFn: () => subLedgerList(),
  });
};

//List Of Sub Ledger Head
export const useGetSubLedgerList = () => {
  const ledgerList = async () => {
    const response = await axiosInstance.get(`/accounting/api/v1/reporting/sub-ledger-list/`);
    return response.data;
  };
  return useQuery({
    queryKey: ["subledgerhead"],
    queryFn: () => ledgerList(),
  });
};
