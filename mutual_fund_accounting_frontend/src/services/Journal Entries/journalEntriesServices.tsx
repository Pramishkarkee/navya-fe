import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

const postJournalEntry = async (data) => {
  const response = await axiosInstance.post(
    "/accounting/api/v1/accounting/journals/",
    data
  );

  return response.data;
};

export const useJournalEntriesMutation = () => {
  return useMutation({
    mutationFn: postJournalEntry,
    onSuccess: (data) => {},
    onError: (error) => {
      console.error(error);
    },
  });
};
