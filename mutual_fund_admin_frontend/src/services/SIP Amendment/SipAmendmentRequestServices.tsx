import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

export const usePatchAmendmentRequest = (id: number) => {
  const AmendmentRequest = async (data) => {
    const response = await axiosInstance.patch(
      `sip-up/api/v1/sip/sip-amendment-entry/${id}/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: AmendmentRequest,
    mutationKey: ["amendment", id],
  });
};
