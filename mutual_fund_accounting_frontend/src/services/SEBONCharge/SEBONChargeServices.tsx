import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";

//Get all stock transaction details end points
const getSEBONCharges = async () => {
  const response = await axiosInstance.get("/accounting/api/v1/parameters/sebon-charge/");
  return response.data;
};
export const useGetSEBONCharges = () => {
  return useQuery({
    queryKey: ["SEBONCharge"],
    queryFn: getSEBONCharges,
  });
};

// For Updating SEBON Charge Data
export const usePatchSEBONCharge = (id: number) => {
  const queryClient = useQueryClient();
  const patchSEBONCharge = async (data: any) => {
    const response = await axiosInstance.patch(
      `/accounting/api/v1/parameters/sebon-charge/${id}/`,
      data
    );
    return response.data.responseData;
  };
  return useMutation({
    mutationFn: patchSEBONCharge,
    mutationKey: ["SEBONCharge", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SEBONCharge"] });
    },
  });
};

// For Creating SEBON Charge Data
const createSEBONCharge = async (data) => {
  const response = await axiosInstance.post(
    "/accounting/api/v1/parameters/sebon-charge/",
    data
  );
  return response.data.responseData;
};

export const useCreateSEBONCharge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSEBONCharge,
    mutationKey: ["SEBONCharge"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SEBONCharge"] });
    },
  });
};

// For Deleting SEBON Charge Data
export const useDeleteSEBONCharge = (id: number) => {
  const queryClient = useQueryClient();
  const SEBONChargeDelete = async (data: any) => {
    const response = await axiosInstance.delete(
      `/accounting/api/v1/parameters/sebon-charge/${id}/`,
      data
    );
    return response.data;
  };
  return useMutation({
    mutationFn: SEBONChargeDelete,
    mutationKey: ["SEBONCharge", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SEBONCharge"] });
    },
  });
};
