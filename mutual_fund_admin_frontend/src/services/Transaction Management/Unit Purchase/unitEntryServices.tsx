import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "config/axiosInstance";
// import { IUserEntryFormInputs } from "pages/Transaction Management/Unit Purchase/UnitPurchaseEntry";

export const useUnitEntryMutation = () => {
  const queryClient = useQueryClient();

  const unitEntry = async (data) => {
    const response = await axiosInstance.post(
      `/sip-up/api/v1/unit-purchase/admin_create/`,
      data
    );
    // console.log(response);
    return response.data.responseData;
  };

  return useMutation({
    mutationFn: unitEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unitpurchase"] });
    },
    // onError: (error) => {
    //   console.log("Unit Entry Error", error);
    // },
    onSettled: (data, error) => {
      // console.log("Unit Entry Error", error);
      // console.log("Unit Entry data", data);
    },
  });
};
