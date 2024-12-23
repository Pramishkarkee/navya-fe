import { useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import RoundedButton from "components/Button/Button";
import RedemptionReceiptTable from "components/Table/RedemptionReceiptTable";
import { UnitRedemptionTransactionReceiptHeader } from "constants/UnitTransactionReceipt/UnitRedemptionTransactionReceiptHeader";
import {
  useGetUnitRedemptionReceipts,
  useGetUnitRedemptionReceiptsSearch,
} from "services/Transaction Management/Unit Purchase/unitRedemptionReceiptsServices";
import { PaginationState } from "@tanstack/react-table";
import ExportButton from "components/Button/ExportButton";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";

interface IFormInput {
  distributionCenter: string;
  schemeName: string;
  radioValue: string;
}

const UnitRedemptionTxnReceipts = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredListData, setFilteredListData] = useState<any[]>([]);
  const [boidNumber, setBoidNumber] = useState("");

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const {
    data: unitRedemptionTxnReceiptData,
    isSuccess: unitPurchaseReceiptSuccess,
    isError: unitPurchaseReceiptsError,
    // refetch: unitPurchaseReceiptsRefetch,
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
      schemeName: "NAVYA LARGE CAP FUND",
      radioValue: "Purchase",
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
    // unitPurchaseReceiptsRefetch();
  }, [pagination]);

  useEffect(() => {
    if (unitPurchaseReceiptSuccess) {
      setTableData(unitRedemptionTxnReceiptData?.results);
      setNext(unitRedemptionTxnReceiptData?.next === null);
      setPrev(unitRedemptionTxnReceiptData?.previous === null);
    }
  }, [unitRedemptionTxnReceiptData, unitPurchaseReceiptSuccess]);

  useEffect(() => {
    if (boidNumber) {
      handleSearch();
    } else {
      refetchUnitRedemptionReceiptsSearch();
    }
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

  const handleSearch = async () => {
    if (boidNumber) {
      try {
        await refetchUnitRedemptionReceiptsSearch();
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(() => {})}
      sx={{ width: { xs: "100%", sm: "100%", md: "100%", lg: "90%" } }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>
          <DistributionSchemeField
            control={control}
            label1="Distribution Center"
          />
        </Box>
        {/* <Box>
          <OwnerInformation dpOptions={BankOptions} control={control} />
        </Box> */}
        {/* <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 500 }}>Request Type</Typography>
          </Box>
          <Box>
            <RadioButtons control={control} />
          </Box>
        </Box> */}

        <Box sx={{ width: "100%" }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            Enter BOID to search
          </Typography>
          <TextField
            size="small"
            placeholder="BOID Number"
            value={boidNumber}
            // onClick={handleSearch}
            onChange={(e) => {
              setBoidNumber(e.target.value);
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <RoundedButton title1="Search" onClick1={handleSearch} />
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
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default UnitRedemptionTxnReceipts;
