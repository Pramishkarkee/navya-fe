import { yupResolver } from "@hookform/resolvers/yup";
import { Box, FormLabel, TextField } from "@mui/material";
import RoundedButton from "components/Button/Button";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import {
  useGetIPORightshareParameterList,
  usePatchIPORightshareParameter,
} from "services/GeneralParameters/IPORightshareParameterService";
import { useEffect, useState } from "react";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";

const IPORightshareParameter = () => {
  const schema = yup.object().shape({
    ipo_lock_in_period: yup
      .number()
      .required("IPO Lock In Period is required")
      .typeError("IPO Lock In Period must be a number")
      .positive("IPO Lock In Period must be a positive number")
      .integer("IPO Lock In Period must be an integer"),
    fpo_lock_in_period: yup
      .number()
      .required("FPO Lock In Period is required")
      .typeError("FPO Lock In Period must be a number")
      .positive("FPO Lock In Period must be a positive number")
      .integer("FPO Lock In Period must be an integer"),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ipo_lock_in_period: 180,
      fpo_lock_in_period: 180,
    },
  });

  const [successbarOpen, setSuccessbarOpen] = useState(false);
  const [errorbarOpen, setErrorbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: generalParameterData } = useGetIPORightshareParameterList();

  const { mutate: patchGeneralParameter } = usePatchIPORightshareParameter();

  useEffect(() => {
    if (generalParameterData) {
      const responseData = generalParameterData.responseData;

      const entryLoadMap = {
        ipo_lock: "ipo_lock_in_period",
        fpo_lock: "fpo_lock_in_period",
      };
      responseData?.forEach((period) => {
        const fieldName = entryLoadMap[period.name];
        if (fieldName) {
          setValue(fieldName, period.value ?? "");
        }
      });
    }
  }, [generalParameterData, setValue]);

  const onSubmit = (data: any) => {
    const payload = {
      locked_in_period: [
        {
          ipo_lock: data.ipo_lock_in_period,
          fpo_lock: data.fpo_lock_in_period,
        },
      ],
    };
    patchGeneralParameter(payload, {
      onSuccess: () => {
        setSuccessbarOpen(true);
      },
      onError: (error: any) => {
        setErrorMessage(error.message);
        setErrorbarOpen(true);
      },
    });
  };

  return (
    <>
      <SuccessBar
        setSnackbarOpen={setSuccessbarOpen}
        snackbarOpen={successbarOpen}
        message="Parameters Updated Successfully"
      />

      <ErrorBar
        setSnackbarOpen={setErrorbarOpen}
        snackbarOpen={errorbarOpen}
        message={errorMessage}
      />

      <Box sx={{ mt: 2 }}>
        <HeaderDesc title="IPO/FPO Parameters" />
        <Box component="form">
          <Box>
            <FormLabel sx={{ display: "flex", mt: 2 }}>
              IPO Lock In Period (Days)
            </FormLabel>
            <Controller
              name="ipo_lock_in_period"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="180"
                  error={errors.ipo_lock_in_period ? true : false}
                  helperText={
                    errors.ipo_lock_in_period
                      ? errors.ipo_lock_in_period.message
                      : null
                  }
                  variant="outlined"
                  size="small"
                  // label="IPO Lock In Period"
                />
              )}
            />
          </Box>
          <Box>
            <FormLabel sx={{ display: "flex", mt: 2 }}>
              FPO Lock In Period (Days)
            </FormLabel>
            <Controller
              name="fpo_lock_in_period"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="180"
                  error={errors.fpo_lock_in_period ? true : false}
                  helperText={
                    errors.fpo_lock_in_period
                      ? errors.fpo_lock_in_period.message
                      : null
                  }
                  variant="outlined"
                  size="small"
                  // label="IPO Lock In Period"
                />
              )}
            />
          </Box>
          <RoundedButton
            title1="Set Parameter"
            onClick1={handleSubmit(onSubmit)}
          />
        </Box>
      </Box>
    </>
  );
};

export default IPORightshareParameter;
