import axios from "axios";
import { useEffect, useState } from "react";
import RoundedButton from "components/Button/Button";
import { Controller, useForm } from "react-hook-form";
import { PaginationState } from "@tanstack/react-table";
import {
  Box,
  Typography,
  TextField,
  Stack,
  useTheme,
  Paper,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";

import ErrorBar from "components/Snackbar/ErrorBar";
import SuccessBar from "components/Snackbar/SuccessBar";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ReceiptTable from "components/Table/TanstackTable";
import ImportButton from "components/Button/ImportButton";
import ViewCitizenshipModal from "components/Modal/ViewCitizenshipModal";
import ViewRedemptionHistory from "components/Button/ViewRedemptionHistory";
import OwnerInformation from "components/OwnerInformation/OwnerInformation";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import {
  useGetShareHolderList,
  useGetUnitRedemptionHistory,
  useGetUnitRedemptionLotDetails,
  useGetUnitRedemptionLotHistory,
  usePostTotalRedemptionDetailsRemarks,
  usePostTotalUnitRedemptionDetails,
} from "services/unitRedemption/UnitRedemptionServices";
import {
  UnitRedeemptionEntryLotDetailsHeader,
  UnitRedeemptionEntryImpactedLotsHeader,
} from "constants/UnitRedeemption/UnitRedeemptionFirstTableHeader";
import { distributionCenterOptions } from "constants/Distribution Center Data/distCenterOptions";

interface IFormInput {
  distributionCenter: string;
  schemeName: string;
  boid: string;
  capGainTax: string;
  redemptionUnit: string;
}

const RedemptionEntry = ({ setBoid }) => {
  const theme = useTheme();
  const [response, setResponse] = useState(null);
  const [boids, setBoids] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [successMsgs, setSuccessMsgs] = useState<string>("");
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("wacc");
  const [tableData, setTableData] = useState([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // const [prev, setPrev] = useState<boolean>(false);
  // const [next, setNext] = useState<boolean>(false);
  const [dematView, setDematView] = useState<boolean>(false);
  const [citizenshipView, setCitizenshipView] = useState<boolean>(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] =
    useState<boolean>(false);

  const {
    data: shareHolderDetails,
    isSuccess: shareHolderDetailsSuccess,
    refetch: redemptionEntryByBoidRefetch,
  } = useGetShareHolderList(boids);

  const { data: lotsDetails } = useGetUnitRedemptionLotDetails(boids);

  const { data: redemptionHistory } = useGetUnitRedemptionHistory(boids);
  const { data: redemptionLotHistory } = useGetUnitRedemptionLotHistory(boids);
  const postTotalUnitRedemptionDetails = usePostTotalUnitRedemptionDetails();
  const postTotalUnitRedemptionDetailsRemarks =
    usePostTotalRedemptionDetailsRemarks();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      distributionCenter: distributionCenterOptions[0],
      schemeName: "Navya Large Cap Fund",
      boid: "",
      redemptionUnit: "",
    },
  });

  useEffect(() => {
    // redemptionEntryByBoidRefetch();
    if (shareHolderDetailsSuccess && loadClicked) {
      setTableData(shareHolderDetails?.responseData?.results ?? []);
      if (!shareHolderDetailsSuccess) {
        setErrorMsgs(
          "Error occured while submitting Redemption Entry Request."
        );
        setSnackbarErrorOpen(true);
      }
      if (
        !shareHolderDetails?.responseData?.results ||
        shareHolderDetails?.responseData?.results.length === 0
      ) {
        setErrorMsgs("No details available for the given BOID.");
        setSnackbarErrorOpen(true);
      }
    }
  }, [shareHolderDetailsSuccess, shareHolderDetails, loadClicked]);

  const handleSearch = () => {
    const boidNumber = getValues("boid");

    if (!boidNumber || boidNumber.length !== 16) {
      setErrorMsgs("Please enter a valid BOID number.");
      setSnackbarErrorOpen(true);
      return;
    }

    setSnackbarErrorOpen(false);
    setErrorMsgs("");
    setBoid(boidNumber);
    setBoids(boidNumber);
    setLoadClicked(true);
  };

  const handleSubmitEntry = async (remarks: string) => {
    try {
      const data = {
        remarks,
        calculation_id: response.calculation_id,
      };
      const result = await postTotalUnitRedemptionDetailsRemarks.mutateAsync(
        data
      );
      setResponse(result.responseData);
      setRemarks("");
      reset();
      setSuccessMsgs(
        "Redemption Entry Request has been submitted successfully."
      );
      setSnackbarSuccessOpen(true);
    } catch (error) {
      setErrorMsgs("Error occurred while submitting Redemption Entry Request.");
      setSnackbarErrorOpen(true);
    }
  };

  const handleResetFields = () => {
    setRemarks("");
    reset();
  };

  const calculateTotalLotUnits = (lotsDetails) => {
    let totalLotUnits = 0;
    lotsDetails.forEach((lot) => {
      totalLotUnits += lot.lot_unit;
    });
    return totalLotUnits;
  };

  const unitsSold = parseInt(watch("redemptionUnit"), 10);
  const totalLotUnits = calculateTotalLotUnits(lotsDetails?.results ?? []);

  const handleRedemptionCalculation = async () => {
    try {
      const boidNumber = getValues("boid");
      if (!boidNumber || isNaN(unitsSold)) {
        setErrorMsgs("Please enter a valid number of redemption units.");
        setSnackbarErrorOpen(true);
        return;
      }

      if (unitsSold <= 0 || unitsSold > totalLotUnits) {
        setErrorMsgs("Please enter a valid number of redemption units.");
        setSnackbarErrorOpen(true);
      } else {
        const data = {
          boid_number: boidNumber,
          units_sold: unitsSold,
          method: selectedMethod,
        };

        const result = await postTotalUnitRedemptionDetails.mutateAsync(data, {
          onError: (error) => {
            const errorMsg =
              axios.isAxiosError(error) && error.response
                ? error.response.data.detail &&
                  error.response.data.detail.length > 0
                  ? `Error: ${error.response.data.detail}`
                  : "An error occurred. Please try again."
                : "Network error occurred.";

            setErrorMsgs(errorMsg);
            setSnackbarErrorOpen(true);
          },
        });
        setResponse(result.responseData.data);
      }
    } catch (err) {
      // setErrorMsgs("Error occurred during redemption calculation.");
      // setSnackbarErrorOpen(true);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleSearch)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: { xs: "70%", sm: "80%", md: "100%", lg: "90%" },
      }}
    >
      <Box>
        <DistributionSchemeField
          control={control}
          label1="Distribution Center"
        />
      </Box>

      <Box>
        <ImportButton mode="unit_purchase" />
        <OwnerInformation
          control={control}
          errors={errors}
          header
          searchButton
          onClickSearch={handleSearch}
        />
      </Box>

      {tableData?.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box>
              <HeaderDesc title="User Details" />
            </Box>
            {tableData?.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: "repeat(4, 1fr)",
                  p: 2,
                }}
              >
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: 500 }}>Full Name</Typography>
                  <Typography sx={{ color: theme.palette.grey[500] }}>
                    {item.full_name ?? "-"}
                  </Typography>
                </Box>
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: 500 }}>Email</Typography>
                  <Typography sx={{ color: theme.palette.grey[500] }}>
                    {item.email ?? "-"}
                  </Typography>
                </Box>
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: 500 }}>
                    Contact Number
                  </Typography>
                  <Typography sx={{ color: theme.palette.grey[500] }}>
                    {item.phone ?? "-"}
                  </Typography>
                </Box>
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: 500 }}>Holder Type</Typography>
                  <Typography sx={{ color: theme.palette.grey[500] }}>
                    {item.holder_type ?? "-"}
                  </Typography>
                </Box>
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: 500 }}>
                    Citizenship Number
                  </Typography>
                  <Typography sx={{ color: theme.palette.grey[500] }}>
                    {item.citizenship_numbe ?? "-"}
                  </Typography>
                </Box>
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: 500 }}>BOID</Typography>
                  <Typography sx={{ color: theme.palette.grey[500] }}>
                    {item.boid_no ?? "-"}
                  </Typography>
                </Box>
                {/* <Box sx={{}}>
                  <Typography sx={{ fontWeight: 500 }}>PAN Number</Typography>
                  <Typography sx={{ color: theme.palette.grey[500] }}>
                    -
                  </Typography>
                </Box> */}
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: 500 }}>
                    Registration Date
                  </Typography>
                  <Typography sx={{ color: theme.palette.grey[500] }}>
                    {item.created_at.split("T")[0] ?? "-"}
                  </Typography>
                </Box>
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: 500 }}>Unit Held</Typography>
                  <Typography sx={{ color: theme.palette.grey[500] }}>
                    {item.applied_units ?? "-"}
                  </Typography>
                </Box>
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: 500 }}>Citizenship</Typography>
                  <Button
                    sx={{
                      marginLeft: "-8px",
                      color: theme.palette.primary.main,
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: 15,
                      "&:hover": {
                        backgroundColor: "transparent",
                        hover: "none",
                      },
                    }}
                    onClick={() => setCitizenshipView(true)}
                  >
                    View Citizenship
                  </Button>
                  <ViewCitizenshipModal
                    open={citizenshipView}
                    setOpen={setCitizenshipView}
                    path={item.citizen_file_path}
                  />
                </Box>
                <Box sx={{}}>
                  <Typography sx={{ fontWeight: 500 }}>
                    DEMAT Details
                  </Typography>
                  <Button
                    sx={{
                      marginLeft: "-8px",
                      color: theme.palette.primary.main,
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: 15,
                      "&:hover": {
                        backgroundColor: "transparent",
                        hover: "none",
                      },
                    }}
                    onClick={() => setDematView(true)}
                  >
                    View DEMAT Details
                  </Button>
                  <ViewCitizenshipModal
                    open={dematView}
                    setOpen={setDematView}
                    path={item.demat_file_path}
                  />
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 500 }}>
                    Redemption History
                  </Typography>
                  <ViewRedemptionHistory
                    redemptionHistory={redemptionHistory?.results ?? []}
                    redemptionLotHistory={redemptionLotHistory?.results ?? []}
                    lot_number={redemptionHistory?.results[0]?.lot_number}
                  />
                </Box>
              </Box>
            ))}
            {tableData?.length === 0 && (
              <Typography>No Owner Details Available</Typography>
            )}
          </Box>

          <HeaderDesc title="Lot Details" />
          <ReceiptTable
            columns={UnitRedeemptionEntryLotDetailsHeader}
            data={lotsDetails?.results ?? []}
            pagination={pagination}
            setPagination={setPagination}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Typography>
              Total Lot Units:{" "}
              {calculateTotalLotUnits(lotsDetails?.results ?? [])}
            </Typography>
          </Box>
          <HeaderDesc title="Redemption Detail" />
          <Box>
            <Typography>Enter Redemption Units</Typography>
            <Box sx={{ width: "30%" }}>
              <Controller
                name="redemptionUnit"
                control={control}
                defaultValue=""
                key="units_sold"
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    placeholder="200"
                    type="number"
                    error={Boolean(unitsSold <= 0 || unitsSold > totalLotUnits)}
                    helperText={
                      unitsSold <= 0 || unitsSold > totalLotUnits
                        ? "Please enter a valid number of redemption units."
                        : ""
                    }
                  />
                )}
              />
            </Box>
            <FormControl>
              <Typography id="demo-radio-buttons-group-label" sx={{ mt: 2 }}>
                Choose Redemption Method
              </Typography>
              <RadioGroup
                aria-label="method"
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  "& .MuiSvgIcon-root": {
                    color: theme.palette.primary.fullDarkmainColor,
                  },
                }}
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="wacc"
                  control={<Radio />}
                  label="WACC"
                />
                <FormControlLabel
                  value="fifo"
                  control={<Radio />}
                  label="FIFO"
                />
                <FormControlLabel
                  value="lifo"
                  control={<Radio />}
                  label="LIFO"
                />
              </RadioGroup>
            </FormControl>

            <RoundedButton
              title1="Calculate"
              disable={unitsSold <= 0 || unitsSold > totalLotUnits}
              onClick1={handleRedemptionCalculation}
            />
          </Box>
        </Box>
      ) : (
        <Box>
          <ErrorBar
            snackbarOpen={snackbarErrorOpen}
            setSnackbarOpen={setSnackbarErrorOpen}
            message={errorMsgs}
          />
        </Box>
      )}
      {response && (
        <Box component="form">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mb: "10px",
            }}
          >
            <HeaderDesc title="Impacted Lots and Summary" />
            <Box sx={{ width: { md: "100%", lg: "125%", xl: "100%" } }}>
              <ReceiptTable
                columns={UnitRedeemptionEntryImpactedLotsHeader}
                data={postTotalUnitRedemptionDetails?.data?.meta?.data ?? []}
              />
            </Box>
          </Box>
          <Box sx={{ width: { md: "100%", lg: "100%", xl: "70%" }, mt: 4 }}>
            <Stack spacing={2}>
              <Paper elevation={0} sx={{ borderRadius: "12px" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <HeaderDesc title="Redemption Entry Details" />
                </Box>

                <Box
                  sx={{
                    padding: 2,
                    display: "flex",
                    // flexWrap: "wrap",
                    rowGap: 8,
                    columnGap: { md: 6, lg: 8 },
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        Total Redemption units
                      </Typography>
                      <Typography sx={{ color: theme.palette.grey[500] }}>
                        {response?.total_redemptions_units}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        DP Charges
                      </Typography>
                      <Typography sx={{ color: theme.palette.grey[500] }}>
                        {response?.dp_charge}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        Gain/Loss Status
                      </Typography>
                      <Typography sx={{ color: theme.palette.grey[500] }}>
                        {response?.total_capital_gain_loss_status}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        Remarks
                      </Typography>
                      <TextField
                        size="medium"
                        placeholder="Remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                      />
                    </Box>

                    {/* <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        Total Capital Gain Tax Amount
                      </Typography>
                      <Typography sx={{ color: theme.palette.grey[500] }}>
                        {(response?.total_capital_gain_tax_amt ?? 0).toFixed(2)}
                      </Typography>
                    </Box> */}
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        Total Investment Amount
                      </Typography>
                      <Typography sx={{ color: theme.palette.grey[500] }}>
                        {(response?.total_investment_amount ?? 0).toFixed(2)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        SEBON Fee
                      </Typography>
                      <Typography sx={{ color: theme.palette.grey[500] }}>
                        {response?.seaborn_fee}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        Total Net Payable
                      </Typography>
                      <Typography sx={{ color: theme.palette.grey[500] }}>
                        {(response?.total_net_payable ?? 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        Total Current Value
                      </Typography>
                      <Typography sx={{ color: theme.palette.grey[500] }}>
                        {response?.total_current_value}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        Amount Payable Pre Tax
                      </Typography>
                      <Typography sx={{ color: theme.palette.grey[500] }}>
                        {(response?.amount_payable_before_tax ?? 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        Total Exit Load
                      </Typography>
                      <Typography sx={{ color: theme.palette.grey[500] }}>
                        {(response?.total_exit_load ?? 0).toFixed(2)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        Total Capital Gain
                      </Typography>
                      <Typography sx={{ color: theme.palette.grey[500] }}>
                        {(response?.total_capital_gain ?? 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Stack>
          </Box>
        </Box>
      )}
      {response && (
        <Box sx={{ display: "flex", gap: 2 }}>
          <RoundedButton
            title1="Submit Entry"
            // title2="Reset Fields"
            onClick1={() => handleSubmitEntry(remarks)}
            // onClick2={handleResetFields}
          />
          <Button
            sx={{ borderRadius: 5, height: "2rem", mt: 1 }}
            onClick={handleResetFields}
            variant="outlined"
          >
            Reset Fields
          </Button>
        </Box>
      )}
      <SuccessBar
        snackbarOpen={snackbarSuccessOpen}
        setSnackbarOpen={setSnackbarSuccessOpen}
        message={successMsgs}
      />

      <ErrorBar
        snackbarOpen={snackbarErrorOpen}
        setSnackbarOpen={setSnackbarErrorOpen}
        message={errorMsgs}
      />
    </Box>
  );
};

export default RedemptionEntry;
