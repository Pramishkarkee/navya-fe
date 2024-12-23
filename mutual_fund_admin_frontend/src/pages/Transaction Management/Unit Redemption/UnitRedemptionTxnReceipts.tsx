import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PaginationState } from "@tanstack/react-table";
import { Box, TextField, Typography, useTheme } from "@mui/material";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import RoundedButton from "components/Button/Button";
import RedemptionReceiptTable from "components/Table/RedemptionReceiptTable";
import ExportButton from "components/Button/ExportButton";
import { UnitRedemptionTransactionReceiptHeader } from "constants/UnitTransactionReceipt/UnitRedemptionTransactionReceiptHeader";
import {
  useGetUnitRedemptionReceipts,
  useGetUnitRedemptionReceiptsSearch,
} from "services/Transaction Management/Unit Purchase/unitRedemptionReceiptsServices";
import DateField from "components/DateField/DateField";
import TypographyLabel from "components/InputLabel/TypographyLabel";

interface IFormInput {
  distributionCenter: string;
  schemeName: string;
  startDate: string;
  endDate: string;
}

const UnitRedemptionTxnReceipts = () => {
  const theme = useTheme();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [tableData, setTableData] = useState([]);
  const [boidNumber, setBoidNumber] = useState<string>("");
  const [filteredListData, setFilteredListData] = useState<any[]>([]);

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: unitRedemptionTxnReceiptData,
    isSuccess: unitPurchaseReceiptSuccess,
  } = useGetUnitRedemptionReceipts(pagination.pageIndex + 1);

  const {
    data: unitRedemptionReceiptsSearchData,
    isSuccess: unitRedemptionReceiptsSearchSuccess,
    refetch: refetchUnitRedemptionReceiptsSearch,
  } = useGetUnitRedemptionReceiptsSearch(boidNumber);

  const totalPage = Math.ceil(unitRedemptionTxnReceiptData?.count / 10);

  const { handleSubmit, control } = useForm<IFormInput>({
    defaultValues: {
      distributionCenter: "Navya Advisors",
      schemeName: "Navya Large Cap Fund",
      startDate: "",
      endDate: "",
    },
  });

  // useEffect(() => {
  //   if (unitPurchaseReceiptSuccess) {
  //     setSnackbarOpen(true);
  //     setMessage("Unit Purchase Authorized Successfully");
  //   }
  //   if (unitPurchaseReceiptsError) {
  //     setSnackbarErrorOpen(true);
  //     setErrorMsg("Error in authorizing unit purchase.");
  //   }
  // }, [unitPurchaseReceiptSuccess, unitPurchaseReceiptsError, unitPurchaseReceiptData]);

  useEffect(() => {
    if (unitRedemptionTxnReceiptData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (unitRedemptionTxnReceiptData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [unitRedemptionTxnReceiptData, unitPurchaseReceiptSuccess]);

  useEffect(() => {
    if (unitPurchaseReceiptSuccess) {
      setTableData(unitRedemptionTxnReceiptData?.results);
      setNext(unitRedemptionTxnReceiptData?.next === null);
      setPrev(unitRedemptionTxnReceiptData?.previous === null);
    }
  }, [unitRedemptionTxnReceiptData, unitPurchaseReceiptSuccess]);

  useEffect(() => {
    refetchUnitRedemptionReceiptsSearch();
  }, [boidNumber]);

  useEffect(() => {
    if (unitRedemptionReceiptsSearchSuccess) {
      setFilteredListData(unitRedemptionReceiptsSearchData?.results ?? []);
    } else {
      setFilteredListData(unitRedemptionTxnReceiptData?.results ?? []);
    }
  }, [
    unitRedemptionReceiptsSearchData,
    unitRedemptionReceiptsSearchSuccess,
    unitRedemptionTxnReceiptData,
  ]);

  useEffect(() => {
    const filteredData = boidNumber
      ? filteredListData.filter((row) => row.boid_number === boidNumber)
      : filteredListData;

    setTableData(filteredData);
  }, [filteredListData, boidNumber]);

  const handleSearch = async (data: IFormInput) => {
    console.log("object", data);
    if (boidNumber) {
      try {
        await refetchUnitRedemptionReceiptsSearch();
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    }
  };
  const handleReset = () => {
    setBoidNumber("");
    setFilteredListData(unitRedemptionReceiptsSearchData?.results ?? []);
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleSearch)}
      sx={{ width: { xs: "100%", sm: "100%", md: "100%", lg: "90%" } }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>
          <DistributionSchemeField
            control={control}
            label1="Distribution Center"
          />
        </Box>

        <Box sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box>
              <TypographyLabel title="BOID" />
              <TextField
                size="small"
                placeholder="BOID Number"
                value={boidNumber}
                onChange={(e) => {
                  setBoidNumber(e.target.value);
                }}
              />
            </Box>
            <DateField
              dateLabel1="From Date"
              dateLabel2="To Date"
              control={control}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <RoundedButton title1="Search" />
            <Box sx={{ display: "flex" }}>
              <ExportButton
                boidNumber={boidNumber}
                exportUrl={`${BASE_URL}/sip-up/api/v1/unit-purchase/reedm-list/`}
                fileName={`Unit Redemption Transaction Receipts${
                  boidNumber ? ` - ${boidNumber}` : ""
                }.csv`}
              />
            </Box>
          </Box>
        </Box>
        {tableData.length > 0 || filteredListData.length > 0 ? (
          <Box
            sx={{ width: { xs: "100%", sm: "100%", md: "110%", lg: "120%" } }}
          >
            <RedemptionReceiptTable
              columns={UnitRedemptionTransactionReceiptHeader}
              data={tableData}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
              pageCount={totalPage}
            />
          </Box>
        ) : (
          <>
            <RedemptionReceiptTable
              columns={UnitRedemptionTransactionReceiptHeader}
              data={[]}
            />
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "19px",
                color: "#212121",
                textAlign: "center",
                marginTop: "30px",
                marginLeft: "40px",
              }}
            >
              <CloudRoundedIcon sx={{ color: "#E0E0E0", fontSize: "12rem" }} />
              <Typography>No Details available.</Typography>
              <Typography
                onClick={handleReset}
                sx={{
                  color: theme.palette.primary[700],
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
  );
};

export default UnitRedemptionTxnReceipts;
