import { useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import RoundedButton from "components/Button/Button";
import ReceiptTable from "components/Table/TanstackTable";
import { UnitTransactionReceiptHeader } from "constants/UnitTransactionReceipt/UnitTransactionReceiptHeader";
import {
  useGetUnitPurchaseReceipts,
  useGetUnitPurchaseReceiptsSearchList,
} from "services/Transaction Management/Unit Purchase/unitPurchaseReceiptsServices";
import { PaginationState } from "@tanstack/react-table";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ExportButton from "components/Button/ExportButton";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";

interface IFormInput {
  distributionCenter: string;
  schemeName: string;
  radioValue: string;
}

const UnitTxnReceipts = () => {
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
      schemeName: "NAVYA LARGE CAP FUND",
      radioValue: "Purchase",
    },
  });

  const {
    data: unitPurchaseReceiptData,
    isSuccess: unitPurchaseReceiptSuccess,
    // isError: unitPurchaseReceiptsError,
    refetch: unitPurchaseReceiptsRefetch,
  } = useGetUnitPurchaseReceipts(pagination.pageIndex + 1);

  const {
    data: unitPurchaseReceiptSearchData,
    isSuccess: unitPurchaseReceiptSearchSuccess,
    // isError: unitPurchaseReceiptsError,
    refetch: unitPurchaseReceiptsSearchRefetch,
  } = useGetUnitPurchaseReceiptsSearchList(boidNumber);

  const totalPage = Math.ceil(
    unitPurchaseReceiptData?.meta?.records /
      unitPurchaseReceiptData?.meta?.per_page
  );

  useEffect(() => {
    if (unitPurchaseReceiptSuccess) {
      setTableData(unitPurchaseReceiptData?.responseData?.results);
    }
  }, [unitPurchaseReceiptData, unitPurchaseReceiptSuccess]);

  useEffect(() => {
    unitPurchaseReceiptsRefetch();
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
    unitPurchaseReceiptSuccess,
    unitPurchaseReceiptsRefetch,
  ]);

  useEffect(() => {
    if (boidNumber) {
      handleSearch();
    } else {
      unitPurchaseReceiptsSearchRefetch();
    }
  }, [boidNumber]);

  useEffect(() => {
    if (unitPurchaseReceiptSearchSuccess) {
      setFilteredListData(
        unitPurchaseReceiptSearchData?.responseData?.results ?? []
      );
    } else {
      setFilteredListData(unitPurchaseReceiptData?.responseData?.results ?? []);
    }
  }, [
    unitPurchaseReceiptSearchData,
    unitPurchaseReceiptSearchSuccess,
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
        await unitPurchaseReceiptsSearchRefetch();
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
                  fileName={`Online Transaction Receipts${
                    boidNumber ? ` - ${boidNumber}` : ""
                  }.csv`}
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
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default UnitTxnReceipts;
