import { Box, Typography, useTheme } from "@mui/material";
import SearchText from "components/Button/Search";

import { useForm } from "react-hook-form";
import { useState, useCallback, useEffect } from "react";
import { useGetStockInfoReport } from "services/Reporting/Stock Information/StockInformationServices";
import { Empty } from "antd";
import ReceiptTable from "components/Table/TanstackTable";
import RoundedButton from "components/Button/Button";
import DateField from "components/DateFilter/DateField";
import DateFormatter from "utils/DateFormatter";
import { PayablesAndReceivablesTableHeader } from "constants/Payables and Receiables/PayablesAndReceivables";
import DropdownWithIcon from "components/Button/DropDown";
import { useGetPayablesAndReceivablesList } from "services/Reporting/Payables And Receivable/PayablesAndReceivableServices";
import debounce from "utils/Debounce";

const DateFormatterUnit = {
  format: (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  },
};

const PayableAndReceivablesData = [
  {
    id: 1,
    date: "2021-01-01",
    day: "5 days",
    type: "payable",
    description: "SIP Redemption Payable",
    amount: 10000,
  },
  {
    id: 2,
    date: "2021-01-01",
    day: "365 days",
    type: "receivable",
    description: "SIP Redemption Payable",
    amount: 10000,
  },
  {
    id: 3,
    date: "2021-01-01",
    day: "75 days",
    type: "payable",
    description: "SIP Redemption Payable",
    amount: 10000,
  },
];

export default function PayablesAndReceivables() {
  const { control, handleSubmit, setValue, reset } = useForm({});
  const theme = useTheme();
  const [id, setId] = useState("");
  const [loadClicked, setLoadClicked] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [selectedValue, setSelectedValue] = useState("all");
  //   const [displayData, setDisplayData] = useState([]);
  const [displayData, setDisplayData] = useState(PayableAndReceivablesData);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);

  const [searchData, setSearchData] = useState({
    from_date: "",
    to_date: "",
  });

  const options = [
    { value: "payable", label: "Payable" },
    { value: "receivable", label: "Receivable" },
    { value: "all", label: "All " },
  ];

  const { data: stockInfoData } = useGetPayablesAndReceivablesList(
    selectedValue,
    id,
    searchData.from_date,
    searchData.to_date,
    pagination.pageIndex + 1
  );
  const totalPageCount = Math.ceil(stockInfoData?.meta?.count / pageSize);

  //   const filterDataByStatus = useCallback(
  //     (data) => {
  //       switch (selectedValue) {
  //         case "payable":
  //           return data.filter((item) => item.status === "payable");
  //         case "receivable":
  //           return data.filter((item) => item.status === "receivable");
  //         case "all":
  //           return data;
  //         default:
  //           return data;
  //       }
  //     },
  //     [selectedValue]
  //   );
  const filterData = useCallback(
    (data) => {
      if (!data) return [];

      let filteredData = data;

      if (selectedValue !== "all") {
        filteredData = filteredData.filter(
          (item) => item.type === selectedValue
        );
      }

      if (id) {
        filteredData = filteredData.filter((item) => {
          const dayNumber = parseInt(item.day);
          const searchNumber = parseInt(id);

          if (!isNaN(dayNumber) && !isNaN(searchNumber)) {
            return dayNumber === searchNumber;
          }

          return item.day.toLowerCase().includes(id.toLowerCase());
        });
      }

      return filteredData;
    },
    [selectedValue, id]
  );

  //   useEffect(() => {
  //     if (id) {
  //       const filteredData = filterDataByStatus(PayableAndReceivablesData || []);
  //       setDisplayData(filteredData);
  //     } else {
  //       const filteredData = filterDataByStatus(PayableAndReceivablesData || []);
  //       setDisplayData(filteredData);
  //     }
  //   }, [PayableAndReceivablesData, id, selectedValue, filterDataByStatus]);
  useEffect(() => {
    const filteredData = filterData(PayableAndReceivablesData);
    setDisplayData(filteredData);
  }, [PayableAndReceivablesData, selectedValue, id, filterData]);

  const handleLoad = (data) => {
    setId(data.id || "");
    if (data?.startDate && data?.endDate) {
      const fromDate = new Date(data?.startDate);
      const toDate = new Date(data?.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatterUnit.format(toDate.toISOString());

      if (formattedFromDate && formattedToDate) {
        setSearchData({
          from_date: formattedFromDate,
          to_date: formattedToDate,
        });
      }
      setLoadClicked(true);
    } else {
      setErrorMsgs("Both start and end dates must be selected.");
      setSnackbarErrorOpen(true);
    }
  };
  const handleReset = () => {
    reset();
    setId("");
    setSearchData({
      from_date: "",
      to_date: "",
    });
    // setLoadClicked(false);
    // setSnackbarErrorOpen(false);
    // setErrorMsgs("");
  };

  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
    }, 500),
    [setValue]
  );

  useEffect(() => {
    if (stockInfoData?.meta?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (stockInfoData?.meta?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [stockInfoData]);
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  return (
    <Box>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 1 }}
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
            Payables and Receivables
          </Typography>
        </Box>
        <Box
          component="form"
          sx={{ width: "100%", display: "flex", gap: 3, marginTop: 1 }}
        >
          <SearchText
            title="Search for Stock"
            //   {...register("id")}

            onChange={(e) => debouncedSetId(e.target.value)}
            // onClick={handleSubmit(handleLoad)}
          />
          <Box sx={{ mt: -2.5 }}>
            <DateField
              control={control}
              dateLabel1="Date (From)"
              dateLabel2="Date (To)"
            />
          </Box>

          <RoundedButton title1="Load" onClick1={handleSubmit(handleLoad)} />
        </Box>

        <Box
          sx={{
            width: {
              xs: "95%",
              sm: "100%",
              md: "110%",
              lg: "120%",
              xl: "130%",
            },
          }}
        >
          <Box sx={{ mb: 2 }}>
            <DropdownWithIcon
              options={options}
              value={selectedValue}
              onChange={handleChange}
            />
          </Box>
          <ReceiptTable
            columns={PayablesAndReceivablesTableHeader}
            // data={stockInfoData?.responseData ?? []}
            data={displayData}
            pagination={pagination}
            setPagination={setPagination}
            next={next}
            prev={prev}
            pageCount={totalPageCount}
            setPageSize={setPageSize}
          />

          {/* {!stockInfoData?.responseData?.length && ( */}
          {!displayData.length && (
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "19px",
                color: "#212121",
                textAlign: "center",
                marginTop: "30px",
                // marginLeft: "400px",
              }}
            >
              <Empty imageStyle={{}} description="No Data Available" />
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
          )}
        </Box>
      </Box>
    </Box>
  );
}
