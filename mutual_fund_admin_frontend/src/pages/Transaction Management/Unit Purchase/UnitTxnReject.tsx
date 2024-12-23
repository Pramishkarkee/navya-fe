import { useEffect, useState } from "react";
import { Box, TextField, Typography, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import RoundedButton from "components/Button/Button";
import ReceiptTable from "components/Table/TanstackTable";
import { UnitTransactionReceiptHeader } from "constants/UnitTransactionReceipt/UnitTransactionReceiptHeader";
import {
  useGetUnitPurchaseReject,
  useGetUnitPurchaseRejectSearchList,
} from "services/Transaction Management/Unit Purchase/unitPurchaseRejectServices";
import { PaginationState } from "@tanstack/react-table";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ExportButton from "components/Button/ExportButton";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";

interface IFormInput {
  distributionCenter: string;
  schemeName: string;
  radioValue: string;
}

const UnitTxnReject = () => {
  const theme = useTheme();
  const [tableData, setTableData] = useState([]);
  // const [searchClicked, setSearchClicked] = useState(false);
  const [filteredListData, setFilteredListData] = useState<any[]>([]);
  const [boidNumber, setBoidNumber] = useState("");

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const { handleSubmit, control } = useForm<IFormInput>({
    defaultValues: {
      distributionCenter: "Navya Advisors",
      schemeName: "Navya Large Cap Fund",
      radioValue: "Purchase",
    },
  });

  const {
    data: unitPurchaseReceiptData,
    isSuccess: unitPurchaseRejectuccess,
    // isError: unitPurchaseRejectError,
    refetch: unitPurchaseRejectRefetch,
  } = useGetUnitPurchaseReject(pagination.pageIndex + 1);

  const {
    data: unitPurchaseRejectearchData,
    isSuccess: unitPurchaseRejectearchSuccess,
    // isError: unitPurchaseRejectError,
    refetch: unitPurchaseRejectSearchRefetch,
  } = useGetUnitPurchaseRejectSearchList(boidNumber);

  const totalPage = Math.ceil(
    unitPurchaseReceiptData?.meta?.records /
      unitPurchaseReceiptData?.meta?.per_page
  );

  useEffect(() => {
    if (unitPurchaseRejectuccess) {
      setTableData(unitPurchaseReceiptData?.responseData?.results);
    }
  }, [unitPurchaseReceiptData, unitPurchaseRejectuccess]);

  useEffect(() => {
    unitPurchaseRejectRefetch();
    if (unitPurchaseReceiptData?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (unitPurchaseReceiptData?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [
    unitPurchaseReceiptData,
    unitPurchaseRejectuccess,
    unitPurchaseRejectRefetch,
  ]);

  useEffect(() => {
    if (boidNumber) {
      handleSearch();
    } else {
      unitPurchaseRejectSearchRefetch();
    }
  }, [boidNumber]);

  useEffect(() => {
    if (unitPurchaseRejectearchSuccess) {
      setFilteredListData(
        unitPurchaseRejectearchData?.responseData?.results ?? []
      );
    } else {
      setFilteredListData(unitPurchaseReceiptData?.responseData?.results ?? []);
    }
  }, [
    unitPurchaseRejectearchData,
    unitPurchaseRejectearchSuccess,
    unitPurchaseReceiptData,
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
        await unitPurchaseRejectSearchRefetch();
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    }
  };
  const handleReset = () => {
    setBoidNumber("");
    setTableData(unitPurchaseReceiptData?.responseData?.results ?? []);
    setFilteredListData(unitPurchaseReceiptData?.responseData?.results ?? []);
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
            Search BOID
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
          <Box>
            <RoundedButton title1="Search" onClick1={handleSearch} />
          </Box>
        </Box>
        {tableData.length > 0 ? (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <HeaderDesc title="Table" />
              <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
                <ExportButton
                  boidNumber={boidNumber}
                  exportUrl={`${BASE_URL}/sip-up/api/v1/unit-purchase/list/`}
                  fileName={`Online Transaction Reject${
                    boidNumber ? ` - ${boidNumber}` : ""
                  }.csv`}
                  isRejected="True"
                />
              </Box>
            </Box>
            <ReceiptTable
              columns={UnitTransactionReceiptHeader}
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
            <ReceiptTable columns={UnitTransactionReceiptHeader} data={[]} />
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

export default UnitTxnReject;
