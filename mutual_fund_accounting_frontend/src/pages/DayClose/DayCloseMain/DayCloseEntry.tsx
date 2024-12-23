import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { PaginationState } from "@tanstack/react-table";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { Empty } from "antd";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import debounce from "utils/Debounce";
import DateFormatter from "utils/DateFormatter";
import SearchText from "components/Button/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useGlobalStore } from "store/GlobalStore";
import ErrorBar from "components/Snackbar/ErrorBar";
import RoundedButton from "components/Button/Button";
import SuccessBar from "components/Snackbar/SuccessBar";
import DateField from "components/DateFilter/DateField";
import ExportButton from "components/Button/ExportButton";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ReceiptTable from "components/Table/TanstackTable";
import ConfirmationModalConfirm from "components/Modal/DayClose";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import {
  usePatchDayCloseData,
  usePatchDayClose,
  useGetDayCloseData,
  usePostNonTradingDay,
} from "services/DayClose/DayCloseServices";
import { useGetNavValue } from "services/NAVValue/NAVValueService";
import {
  DayCloseData,
  DayCloseListEntryHeader,
} from "constants/DayCloseTable/DayCloseEntryTableHeaders";

const validationSchema = yup.object().shape({
  navDate: yup.object().required("This field is required"),
  startDate: yup.object().required(),
  endDate: yup.object().required(),
  id: yup.number(),
  include_admin: yup.boolean(),
});

export default function DayCloseEntry() {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      navDate: dayjs(),
      startDate: dayjs(),
      endDate: dayjs(),
      include_admin: true,
    },
    resolver: yupResolver(validationSchema),
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [id, setId] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [navDates, setNavDates] = useState<string>("");
  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [closingDate, setClosingDate] = useState<string>("");
  const [includeAdmin, setIncludeAdmin] = useState<string>("");
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [errorsbarOpen, setErrorbarOpen] = useState<boolean>(false);
  const [displayData, setDisplayData] = useState<DayCloseData[]>([]);
  const [successabarOpen, setSuccessbarOpen] = useState<boolean>(false);
  const [schemaName, setSchemaName] = useState<string>("Navya Large Cap Fund");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });

  const handleSchemaChange = (event) => {
    setSchemaName(event.target.value);
  };

  const {
    mutate: DayCloseData,
    data: dayCloseData,
    isPending,
  } = usePatchDayCloseData();
  const { mutate: DayCloseSubmit } = usePatchDayClose();
  const { mutate: postCreateNonTradingData } = usePostNonTradingDay();
  const { refetch: refetchNAVValue } = useGetNavValue();

  const { data: DayCloseListData, isSuccess: DayCloseListDataSuccess } =
    useGetDayCloseData(
      searchData.from_date,
      searchData.to_date,
      pagination.pageIndex + 1,
      id
    );

  const totalPageCount = Math.ceil(DayCloseListData?.meta?.count / 10);

  const allotmentDate = useGlobalStore((state) => state.allotmentDate);

  const daySummary = dayCloseData?.responseData;

  const TotalFees =
    (daySummary?.fees?.fund_management_fee || 0) +
    (daySummary?.fees?.depository_fee || 0) +
    (daySummary?.fees?.fund_supervisor_fee || 0);

  const handleLoad = (data) => {
    setId(data.id || "");
    if (data?.startDate && data?.endDate) {
      const fromDate = new Date(data?.startDate);
      const toDate = new Date(data?.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatter.format(toDate.toISOString());

      if (formattedFromDate && formattedToDate) {
        setSearchData({
          from_date: formattedFromDate,
          to_date: formattedToDate,
        });
      }
      setLoadClicked(true);
    }
  };

  useEffect(() => {
    const responseData = DayCloseListData?.meta;
    setNext(responseData?.next === null);
    setPrev(responseData?.previous === null);
  }, [DayCloseListData]);

  useEffect(() => {
    if (DayCloseListDataSuccess || loadClicked) {
      const results = DayCloseListData?.responseData ?? [];
      setDisplayData(results);
    }
  }, [DayCloseListDataSuccess, loadClicked, DayCloseListData]);

  const handleAdd = (data) => {
    const tempDate = {
      closing_date: dayjs(data.navDate).format("YYYY-MM-DD"),
      include_admin: data.include_admin,
    };
    setClosingDate(tempDate.closing_date);
    setIncludeAdmin(data.include_admin);
    setNavDates(data.navDate);

    DayCloseData(tempDate, {
      onSuccess: () => {
        setOpen(true);
      },
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response) {
          const errorData = error?.response?.data;
          if (errorData?.ltp_error === "No LTP For this date.") {
            setConfirmOpen(true);
            return;
          }
          setErrorbarOpen(true);
          if (errorData?.message) {
            setErrorMsgs(errorData?.message);
          }
          if (errorData?.closing_date) {
            setErrorMsgs("Closing Date is required");
          }
          if (errorData?.details) {
            setErrorMsgs(errorData?.details);
          } else {
            setErrorMsgs("Unknown error occurred.");
          }
        } else {
          setErrorMsgs("Network error occurred.");
        }
      },
    });
  };

  const handleNonTradingDayClose = () => {
    const payload = {
      business_date: closingDate,
    };

    postCreateNonTradingData(payload, {
      onSuccess: () => {
        setConfirmOpen(false);
        handleAdd({ navDate: navDates, include_admin: includeAdmin });
      },
      onError: () => {
        setErrorbarOpen(true);
      },
    });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClosed = () => {
    setConfirmOpen(false);
  };

  const handleSave = (data) => {
    const payload = {
      closing_date: dayjs(data.navDate).format("YYYY-MM-DD"),
      include_admin: data.include_admin,
    };

    DayCloseSubmit(payload, {
      onSuccess: () => {
        refetchNAVValue();
        setSuccessbarOpen(true);
        setOpen(false);
      },
      onError: (error) => {
        setErrorbarOpen(true);
        if (axios.isAxiosError(error) && error.response) {
          setErrorMsgs(
            error?.response?.data?.closing_date
              ? "Closing Date is required"
              : error?.response?.data?.details
              ? error?.response?.data?.details
              : "Error while saving data"
          );
        }
      },
    });
  };

  const handleReset = () => {
    setSearchData({
      from_date: "",
      to_date: "",
    });
    setId("");
    reset();
    setDisplayData(DayCloseListData);
  };

  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
      setValue("id", value);
    }, 500),
    [setValue]
  );

  useEffect(() => {
    setPagination({ ...pagination, pageIndex: 0 });
  }, [searchData, id]);

  return (
    <React.Fragment>
      <SuccessBar
        snackbarOpen={successabarOpen}
        message={"Day Close Successfully Created"}
        setSnackbarOpen={setSuccessbarOpen}
      />
      <ErrorBar
        snackbarOpen={errorsbarOpen}
        message={errorMsgs}
        setSnackbarOpen={setErrorbarOpen}
      />
      <Box>
        <ConfirmationModalConfirm
          open={confirmOpen}
          setOpen={handleClosed}
          title="Confirmation"
          bTitle1="Cancel"
          bTitle2="Confirm"
          message={
            <>
              <Typography sx={{ textAlign: "center" }}>
                Are you sure you want to proceed with Day Close without
                uploading the LTP files?{" "}
              </Typography>
              <Typography sx={{ textAlign: "center" }}>
                Once Day Close is performed, this action cannot be undone.
              </Typography>
            </>
          }
          onClick={handleNonTradingDayClose}
        />

        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              maxHeight: "90vh",
              bgcolor: "background.paper",
              border: "2px solid #fff",
              borderRadius: 8,
              boxShadow: 24,
              p: 3,
              overflowY: "auto",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "18px",
                  color: theme.palette.primary.pureColor,
                }}
              >
                Day Close Summary
              </Typography>
              <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit(handleSave)}
              sx={{ mt: 2 }}
            >
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1.5px solid ${theme.palette.grey[300]}`,
                    mb: 2.5,
                  }}
                >
                  <Typography
                    sx={{ color: theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Total Subscribed Units
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                    {daySummary?.units_total !== undefined &&
                    daySummary?.units_total !== null
                      ? Number(
                          daySummary.units_total.toFixed(2)
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "-"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1.5px solid ${theme.palette.grey[300]}`,
                    mb: 1.5,
                  }}
                >
                  <Typography sx={{ color: theme.palette.grey[600] }}>
                    Total Assets
                  </Typography>
                  <Typography>
                    {daySummary?.asset_total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) ?? "-"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1.5px solid ${theme.palette.grey[300]}`,
                    mb: 1.5,
                  }}
                >
                  <Typography sx={{ color: theme.palette.grey[600] }}>
                    Total Liabilities
                  </Typography>
                  <Typography>
                    {daySummary?.liability_total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) ?? "-"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1.5px solid ${theme.palette.grey[300]}`,
                    mb: 2.5,
                  }}
                >
                  <Typography
                    sx={{ color: theme.palette.grey[600], fontWeight: 600 }}
                  >
                    Net Assets Value
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                    {daySummary?.net_assets_value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) ?? "-"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1.5px solid ${theme.palette.grey[300]}`,
                    mb: 1.5,
                  }}
                >
                  <Typography sx={{ color: theme.palette.grey[600] }}>
                    NAV as of{" "}
                    {daySummary?.pre_nav[1]?.created_at.split("T")[0] ?? "-"}
                  </Typography>
                  <Typography>
                    {daySummary?.pre_nav[1]?.nav_value.toFixed(2) ?? "-"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1.5px solid ${theme.palette.grey[300]}`,
                    mb: 1.5,
                  }}
                >
                  <Typography
                    sx={{ color: theme.palette.grey[600], fontWeight: 600 }}
                  >
                    Today's NAV
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                    {daySummary?.next_nav_value.toFixed(2) ?? "-"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1.5px solid ${theme.palette.grey[300]}`,
                    mb: 2.5,
                  }}
                >
                  <Typography sx={{ color: theme.palette.grey[600] }}>
                    % Change in NAV{" "}
                  </Typography>
                  <Typography
                    sx={{
                      color:
                        daySummary?.percentage_nav > 0
                          ? "green"
                          : daySummary?.percentage_nav < 0
                          ? "red"
                          : "black",
                    }}
                  >
                    {daySummary?.percentage_nav.toFixed(2) ?? "-"}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: `1.5px solid ${theme.palette.grey[300]}`,
                  mb: 1.5,
                }}
              >
                <Typography sx={{ color: theme.palette.grey[600] }}>
                  Fund Management Fee
                </Typography>
                <Typography>
                  {daySummary?.fees?.fund_management_fee.toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  ) ?? "-"}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: `1.5px solid ${theme.palette.grey[300]}`,
                  mb: 1.5,
                }}
              >
                <Typography sx={{ color: theme.palette.grey[600] }}>
                  Depository Fee
                </Typography>
                <Typography>
                  {" "}
                  {daySummary?.fees?.depository_fee.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) ?? "-"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: `1.5px solid ${theme.palette.grey[300]}`,
                  mb: 1.5,
                }}
              >
                <Typography sx={{ color: theme.palette.grey[600] }}>
                  Fund Supervisor Fee
                </Typography>
                <Typography>
                  {" "}
                  {daySummary?.fees?.fund_supervisor_fee.toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  ) ?? "-"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: `1.5px solid ${theme.palette.grey[300]}`,
                  mb: 1.5,
                }}
              >
                <Typography
                  sx={{ color: theme.palette.grey[600], fontWeight: 600 }}
                >
                  Total Fees
                </Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {TotalFees.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "end", gap: 1, mt: 1 }}
              >
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: "100px",
                    backgroundColor: theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: theme.palette.primary.pureColor,
                    },
                  }}
                  type="submit"
                >
                  Save
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleClose}
                  sx={{
                    borderRadius: "100px",
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>

      <Box component="form" onSubmit={handleSubmit(handleAdd)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ width: "50px" }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "19px",
                color: "#212121",
                textAlign: "center",
                width: "max-content",
                borderBottom: `1px solid ${theme.palette.secondary.main}`,
              }}
            >
              Day Close
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "50%",
            }}
          >
            <Box sx={{ width: "100%", flex: "calc(50%-1rem)" }}>
              <TypographyLabel title={"Schema Name"} />
              <Select
                value={schemaName}
                onChange={handleSchemaChange}
                size="small"
                fullWidth
                placeholder="Please Select Schema"
              >
                <MenuItem value="Navya Large Cap Fund">
                  NAVYA LARGE CAP FUND
                </MenuItem>
              </Select>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ width: "50%" }} mb={1}>
                <TypographyLabel title={"Ending Day"} />
                <Controller
                  name="navDate"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value, ref } }) => {
                    return (
                      <DatePicker
                        value={value ? value : null}
                        onChange={onChange}
                        inputRef={ref}
                        maxDate={dayjs()}
                        minDate={dayjs(allotmentDate)}
                        sx={{
                          width: "100%",
                          "& .MuiSvgIcon-root": {
                            width: "16px",
                            height: "16px",
                          },
                        }}
                        slotProps={{
                          textField: { size: "small" },
                        }}
                      />
                    );
                  }}
                />
              </Box>
            </LocalizationProvider>
            {errors.navDate && (
              <Typography color="error" sx={{ fontSize: "12px" }}>
                {errors.navDate.message}
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            width: "max-content",
          }}
        >
          <FormControl sx={{ height: "25px" }}>
            <Controller
              name="include_admin"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  sx={{}}
                  control={
                    <Checkbox
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 18 } }}
                      {...field}
                      checked={field.value}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      Include Customer Transactions
                    </Typography>
                  }
                  labelPlacement="end"
                />
              )}
            />
          </FormControl>
        </Box>

        <Box sx={{ mt: 2 }}>
          <RoundedButton title1="Submit" loading={isPending} />
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: "1500px",
          width: { md: "110%", lg: "120%", xl: "125%" },
        }}
      >
        <Box sx={{ mt: 5 }}>
          <HeaderDesc title="Day Close Summary" />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            width: { sm: "100%", md: "100%", lg: "130%" },
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit(handleLoad)}
            sx={{
              width: "100%",
              display: "flex",
              gap: 3,
              marginTop: 1,
              ml: -1,
            }}
          >
            <SearchText
              title="Search"
              {...register("id")}
              onChange={(e) => debouncedSetId(e.target.value)}
              onClick={handleSubmit(handleLoad)}
            />
            <Box sx={{ mt: -2 }}>
              <DateField
                control={control}
                dateLabel1="Date (From)"
                dateLabel2="Date (To)"
              />
            </Box>
            <RoundedButton title1="Load" onClick1={handleSubmit(handleLoad)} />
          </Box>

          <Box>
            <ExportButton
              filename="DayCloseSummary.csv"
              search={id}
              startDate={searchData.from_date}
              endDate={searchData.to_date}
              baseURL={`${BASE_URL}/accounting/api/v1/accounting/day-close/export/?export=True`}
            />
          </Box>
        </Box>
        <Box sx={{ mt: 3 }}>
          {displayData?.length > 0 ? (
            <ReceiptTable
              columns={DayCloseListEntryHeader}
              data={displayData}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
              pageCount={totalPageCount}
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                ml: { md: 5, lg: 20 },
                mt: 5,
              }}
            >
              <Empty
                imageStyle={{ height: 150, width: 150 }}
                description="No Data Available"
              />
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
          )}
        </Box>
      </Box>
    </React.Fragment>
  );
}
