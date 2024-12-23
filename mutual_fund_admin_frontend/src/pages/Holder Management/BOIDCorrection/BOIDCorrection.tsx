import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Alert } from "@mui/material";
import BOIDCorrectionSearch from "../../../components/ShareHolderDetail/BOIDCorrectionSearch";
import { Controller, useForm } from "react-hook-form";
import { useTheme } from "@mui/material";
import RoundedButton from "components/Button/Button";
import EditIcon from "@mui/icons-material/Edit";
import {
  useGetBOIDCorrection,
  usePatchBOIDRequest,
} from "services/ShareHolderDetails/BOIDCorrectionService";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";

interface BOIDData {
  id: number;
  full_name: string;
  boid_no: string;
  responseData: any;
}

const BOIDCorrection = () => {
  const [searchKey, setSearchKey] = useState<string>("");
  const [boidValue, setBoidValue] = useState("");
  const [editBOID, setEditBOID] = useState(false);
  const [editName, setEditName] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const theme = useTheme();
  const { data: BOIDData, error: BOIDError } = useGetBOIDCorrection(boidValue);
  const {
    mutate: BOIDRequestMutate,
  } = usePatchBOIDRequest(BOIDData?.responseData?.id);

  useEffect(() => {
    if (BOIDError) {
      const errorMessage = (BOIDError as any)?.response?.data?.details || "An error occurred";
      setErrorSnackbarOpen(true);
      setErrorMessage(errorMessage);
    }
    // else if (!BOIDData && boidValue) {
    //   setErrorSnackbarOpen(true);
    //   setErrorMessage("No data for this BOID.");
    // } 
    else {
      setErrorSnackbarOpen(false);
      setErrorMessage("");
    }
  }, [BOIDData, BOIDError, boidValue]);

  const handleSearch = () => {
    if (!searchKey || searchKey.length !== 16) {
      setSubmitError("BOID number must be exactly 16 characters");
    }
    setBoidValue(searchKey);
    // console.log("search in form", searchKey);
  };

  const handleSetSearchKey = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
  };

  const schema = yup.object().shape({
    boid_no: yup
      .string()
      .required("BOID number is required")
      .length(16, "BOID number must be exactly 16 characters"),
    full_name: yup.string().required("Name is required"),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    //   boid_no: BOIDData?.responseData?.boid_no,
    //   full_name: BOIDData?.responseData?.full_name || "",

    // },
    resolver: yupResolver(schema),
  });

  const BOIDSubmit = (data: BOIDData) => {
    const tempData = {
      boid_no: data?.boid_no || BOIDData?.responseData?.boid_no || "",
      full_name: data?.full_name || BOIDData?.responseData?.full_name || "",
    };

    BOIDRequestMutate(tempData, {
      onSuccess: () => {
        setSubmitSuccess("Successfully Updated");
        setSuccessMessage("Successfully Updated");
        setSuccessSnackbarOpen(true);
        setEditBOID(false);
        setEditName(false);
      },

      onError: (BOIDRequestMutateError) => {
        setErrorSnackbarOpen(true);

        const errorMessage = axios.isAxiosError(BOIDRequestMutateError) && BOIDRequestMutateError.response
          ? Array.isArray(BOIDRequestMutateError.response.data?.details) && BOIDRequestMutateError.response.data.details.length > 0
            ? `Error: ${BOIDRequestMutateError.response.data.details.join(', ')}`
            : typeof BOIDRequestMutateError.response.data?.details === "string"
              ? `Error: ${BOIDRequestMutateError.response.data.details}`
              : BOIDRequestMutateError.response.data?.message || "An unknown error occurred."
          : "Error on Update";

        setSubmitError(errorMessage);
        setErrorMessage(errorMessage);
      },

    });
  };





  // const handleSnackbarClose = () => {
  //   setErrorSnackbarOpen(false);
  //   setSuccessSnackbarOpen(false);
  // };

  // useEffect(() => {
  //   if (!BOIDData && BOIDError) {
  //     setErrorSnackbarOpen(true);
  //     // setSubmitError("No data for this BOID.");
  //     setErrorMessage("No data for this BOID.");
  //   }
  // }, [BOIDData, BOIDError]);

  // useEffect(() => {
  //   if (BOIDRequestMutateSuccess) {
  //     setSubmitSuccess("Successfully Updated");
  //     setSuccessOpen(true);
  //   }
  // }, [BOIDRequestMutateSuccess]);

  // useEffect(() => {
  //   if (BOIDRequestMutateError) {
  //     setSubmitError("Error on Updated");
  //     setErrorSnackbarOpen(true);
  //   }
  // }, [BOIDRequestMutateError]);

  useEffect(() => {
    if (editBOID && BOIDData?.responseData) {
      setValue("boid_no", BOIDData.responseData.boid_no);
    }
    if (editName && BOIDData?.responseData) {
      setValue("full_name", BOIDData.responseData.full_name);
    }
  }, [editBOID, editName, BOIDData?.responseData, setValue]);

  // useEffect(() => {
  //   if (editName && BOIDData?.responseData) {
  //     setValue("full_name", BOIDData.responseData.full_name);
  //   }
  // }, [editName, BOIDData?.responseData, setValue]);

  useEffect(() => {
    setValue("full_name", BOIDData?.responseData?.full_name)
    setValue("boid_no", BOIDData?.responseData?.boid_no)

  }, [BOIDData?.responseData?.full_name, BOIDData?.responseData?.boid_no, setValue])

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(BOIDSubmit)}>
        <Box>
          <BOIDCorrectionSearch
            control={control}
            errors={errors}
            searchButton
            handleSetSearchKey={handleSetSearchKey}
            searchKey={searchKey}
            onClickSearch={handleSearch}
          />
        </Box>

        <SuccessBar
          snackbarOpen={successSnackbarOpen}
          setSnackbarOpen={setSuccessSnackbarOpen}
          message={successMessage}
        />
        <ErrorBar
          snackbarOpen={errorSnackbarOpen}
          setSnackbarOpen={setErrorSnackbarOpen}
          message={errorMessage}
        />
        {BOIDData?.responseData && (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                border: "0.1px solid",
                borderRadius: 2,
                mt: 5,
              }}
            >
              <Box sx={{}}>
                <Typography
                  sx={{
                    lineHeight: "17px",
                    borderBottom: 2,
                    borderColor: theme.palette.primary.dark,
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#000000",
                    padding: 1,
                  }}
                >
                  BOID Details
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: "repeat(3, 1fr)",
                  p: 2,
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography> BOID </Typography>
                    {!editBOID && (
                      <IconButton onClick={() => setEditBOID(true)}>
                        <EditIcon sx={{ fontSize: "18px", color: "#000" }} />
                      </IconButton>
                    )}
                  </Box>
                  <Controller
                    name="boid_no"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        size="small"
                        error={Boolean(errors.boid_no)}
                        disabled={!editBOID}
                        defaultValue={BOIDData?.responseData.boid_no || ""}
                        helperText={errors?.boid_no?.message}
                      />
                    )}
                  />
                </Box>

                <Box>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography> Name </Typography>
                      {!editName && (
                        <IconButton onClick={() => setEditName(true)}>
                          <EditIcon sx={{ fontSize: "18px", color: "#000" }} />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                  <Controller
                    name="full_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        size="small"
                        error={Boolean(errors.full_name)}
                        disabled={!editName}
                        defaultValue={BOIDData?.responseData.full_name || ""}
                        helperText={errors?.full_name?.message}
                      />
                    )}
                  />
                </Box>

                <Box sx={{}}>
                  <Typography sx={{ fontWeight: 500 }}>Phone Number</Typography>
                  <Typography sx={{ color: theme.palette.grey[500] }}>
                    {BOIDData?.responseData.phone}
                  </Typography>
                </Box>
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: 500 }}>Email</Typography>
                  <Typography sx={{ color: theme.palette.grey[500] }}>
                    {BOIDData?.responseData.email}
                  </Typography>
                </Box>
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: 500 }}>
                    Share Holder Number
                  </Typography>
                  <Typography sx={{ color: theme.palette.grey[500] }}>
                    {BOIDData?.responseData.share_holder_number}
                  </Typography>
                </Box>
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: 500 }}>Member Since</Typography>
                  <Typography sx={{ color: theme.palette.grey[500] }}>
                    {BOIDData?.responseData.created_at.split("T")[0]}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <RoundedButton title1="Submit Entry" onClick1={handleSubmit} />
          </>
        )}
      </Box>
    </>
  );
};

export default BOIDCorrection;


