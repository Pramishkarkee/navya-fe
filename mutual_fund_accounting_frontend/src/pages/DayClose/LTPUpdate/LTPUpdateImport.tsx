/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, Typography, styled, useTheme } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import RoundedButton from "components/Button/Button";
import {
  useGetLTPUpdate,
  usePostLTPUpload,
} from "services/LTPUpdate/LTPUpdateServices";
import { PaginationState } from "@tanstack/react-table";
import ReceiptTable from "components/Table/TanstackTable";
import { LTPUpdateTableHeader } from "constants/LTPUpdate/LTPUpdateTableHeader";
import SearchText from "components/Button/Search";
import { Empty } from "antd";
import debounce from "utils/Debounce";
import { useGlobalStore } from "store/GlobalStore";

interface FileInput {
  lastModified?: number;
  lastModifiedDate?: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath?: string;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const LTPUpdateImport = () => {
  const allotmentDate = useGlobalStore((state) => state.allotmentDate);
  const theme = useTheme();
  const todayDate = dayjs();

  const hiddenFileInput = useRef(null);
  const [date, setDate] = useState(todayDate);
  const [successSnackbarOpen, setSuccessSnackbarOpen] =
    useState<boolean>(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState<boolean>(false);

  const [successMsgs, setSuccessMsgs] = useState<string>("");
  const [errorMsgs, setErrorMsgs] = useState<string>("");

  const [fileUpload, setFileUpload] = useState<FileInput>(null);
  const [file, setFile] = useState<File | null>(null);

  const [searchFilter, setSearchFilter] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [pageSize, setPageSize] = useState<string>("10");

  const { data: ltpUpdateData, refetch: ltpUpdateDataRefetch } =
    useGetLTPUpdate(
      pagination?.pageIndex + 1,
      searchFilter ? searchFilter : "",
      pageSize
    );

  const { mutate: postLTPUpload, isPending } = usePostLTPUpload();

  const toalPageCount = Math.ceil(ltpUpdateData?.count / Number(pageSize));

  useEffect(() => {
    setPagination({ ...pagination, pageIndex: 0 });
  }, [searchFilter]);

  useEffect(() => {
    if (ltpUpdateData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (ltpUpdateData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [ltpUpdateData]);

  const handleCSVUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    console.log(uploadedFile, "uploadedFile");
    setFile(uploadedFile);
    setFileUpload(uploadedFile);
  };

  console.log(file, "file");

  const handleFileUpload = async () => {
    const payload = new FormData();
    payload.append("file", file);
    payload.append("date", date.format("YYYY-MM-DD"));

    //   payload.forEach((value, key) => {
    //   console.log(`${key}:`, value);
    // });

    postLTPUpload(payload, {
      onSuccess: (response) => {
        if (response.isSuccess) {
          setSuccessMsgs(response?.message);
          setSuccessSnackbarOpen(true);
        }
      },
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response) {
          setErrorMsgs(
            error?.response?.data?.file
              ? error?.response?.data?.file
              : "Error occured while uploading file."
          );
          setErrorSnackbarOpen(true);
        }
      },
    });
  };

  // const handleFileUpload = async (e) => {
  //   try {
  //     const formData = new FormData();

  //     formData.append("file", file ? file : null);
  //     const headers = {
  //       "Content-Type": "multipart/form-data",
  //       Authorization: `Bearer ${Auth.getAccessToken()}`,
  //     };
  //     const response = await axios.post(
  //       `${BASE_URL}/accounting/api/v1/parameters/file-upload/`,
  //       formData,
  //       {
  //         headers: headers,
  //       }
  //     );
  //     if (response.data.isSuccess) {
  //       setSuccessMsgs(response?.data?.message);
  //       setSuccessSnackbarOpen(true);
  //     } else {
  //       setErrorMsgs("Error occured while uploading file.");
  //       setErrorSnackbarOpen(true);
  //     }
  //   } catch (error) {
  //     if (axios.isAxiosError(error) && error.response) {
  //       setErrorMsgs(
  //         error?.response?.data?.file
  //           ? error?.response?.data?.file
  //           : "Error occured while uploading file."
  //       );
  //       setErrorSnackbarOpen(true);
  //     }
  //   }
  // };

  const handleFileUploadClick = () => {
    hiddenFileInput.current.click();
  };

  // const handleSearchClick = () => {

  // }

  const debouncedSetValue = useCallback(
    debounce((value) => {
      setSearchFilter(value);
    }, 500),
    [searchFilter]
  );

  useEffect(() => {
    ltpUpdateDataRefetch();
  }, [searchFilter]);

  const handleReset = () => {
    setSearchFilter("");
    ltpUpdateDataRefetch();
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12} lg={8}>
        <SuccessBar
          snackbarOpen={successSnackbarOpen}
          setSnackbarOpen={setSuccessSnackbarOpen}
          message={successMsgs}
        />
        <ErrorBar
          snackbarOpen={errorSnackbarOpen}
          setSnackbarOpen={setErrorSnackbarOpen}
          message={errorMsgs}
        />
        <Box sx={{ mt: 1 }}>
          <HeaderDesc title="Upload Details" />
          <Box sx={{ mt: 2 }}>
            <TypographyLabel title="Date of Imported Data" />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ width: "50%" }}>
                <DatePicker
                  format="YYYY-MM-DD"
                  maxDate={todayDate}
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        borderRadius: 2,
                        "& .MuiInputBase-root": {
                          borderRadius: 2,
                        },
                        "& fieldset": {
                          borderRadius: 2,
                        },
                      },
                    },
                  }}
                  minDate={dayjs(allotmentDate)}
                  sx={{
                    // width: "100%",
                    "& .MuiSvgIcon-root": {
                      width: "16px",
                      height: "16px",
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>

          <Box sx={{ mt: 2 }}>
            <TypographyLabel title="Upload the LTP CSV File" />
            <Button
              variant="outlined"
              startIcon={<AttachFileIcon />}
              onClick={handleFileUploadClick}
              sx={{
                borderRadius: 2,
                borderColor: theme.palette.secondary[700],
                color: theme.palette.primary[1100],
                textTransform: "none",
              }}
            >
              {fileUpload ? fileUpload.name : "Select a File"}

              <VisuallyHiddenInput
                type="file"
                // value={field.value?.name}
                hidden
                ref={hiddenFileInput}
                sx={{ display: "none" }}
                accept=".csv"
                onChange={handleCSVUpload}
              />
            </Button>
            <Box mt={2}>
              {" "}
              <RoundedButton
                title1="Create LTP"
                onClick1={handleFileUpload}
                loading={isPending}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <HeaderDesc title="LTP Imported Data" />
            <Box>
              <SearchText
                title="Search"
                onChange={(e) => debouncedSetValue(e.target.value)}
                // onClick={handleSearchClick}
              />
            </Box>
            <Box>
              {ltpUpdateData?.results.length > 0 ? (
                <ReceiptTable
                  columns={LTPUpdateTableHeader}
                  data={ltpUpdateData?.results ?? []}
                  pagination={pagination}
                  setPagination={setPagination}
                  pageCount={toalPageCount}
                  next={next}
                  prev={prev}
                  setPageSize={setPageSize}
                />
              ) : (
                <>
                  <ReceiptTable columns={LTPUpdateTableHeader} data={[]} />
                  <Box
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      lineHeight: "19px",
                      color: "#212121",
                      textAlign: "center",
                      marginTop: "50px",
                      marginLeft: "100px",
                    }}
                  >
                    <Empty
                      // imageStyle={{ height: 150, width: 150 }}
                      description="No Data Available"
                    />

                    {/* <Typography>No data available</Typography> */}
                    <Typography
                      onClick={handleReset}
                      sx={{
                        color: theme.palette.primary[1100],
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Reset Filters
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LTPUpdateImport;
