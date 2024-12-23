import { Box, Typography, useTheme } from "@mui/material";
import { PaginationState } from "@tanstack/react-table";
import ReceiptTable from "components/Table/TanstackTable";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import { LTPUpdateHistoryTableEntryHeader } from "constants/LTPUpdate/LTPUpdateHistoryTable";
import { useCallback, useState } from "react";
import SearchText from "components/Button/Search";
import RoundedButton from "components/Button/Button";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import DateFormatter from "utils/DateFormatter";
import DateField from "components/DateFilter/DateField";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import debounce from "utils/Debounce";

const schema = yup
  .object({
    startDate: yup.object().required(),
    endDate: yup.object().required(),
    id: yup.string(),
  })
  .required();

const Data = [
  {
    id: 1,
    symbol: "ACLBSL",
    ltp: "1060.00",
    open_price: "1060.00",
    high_price: "1060.00",
    low_price: "1000",
    total_trades: "112",
  },
  {
    id: 2,
    symbol: "ACLBSL",
    ltp: "1060.00",
    open_price: "1060.00",
    high_price: "1060.00",
    low_price: "1000",
    total_trades: "112",
  },
  {
    id: 3,
    symbol: "ACLBSL",
    ltp: "1060.00",
    open_price: "1060.00",
    high_price: "1060.00",
    low_price: "1000",
    total_trades: "112",
  },
  {
    id: 4,
    symbol: "ACLBSL",
    ltp: "1060.00",
    open_price: "1060.00",
    high_price: "1060.00",
    low_price: "1000",
    total_trades: "112",
  },
];

const LTPUpdateHistory = () => {
  const theme = useTheme();
  const [id, setId] = useState<string>("");
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);

  const { control, handleSubmit, register, setValue } = useForm({
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
    },
    resolver: yupResolver(schema),
  });

  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [displayData, setDisplayData] = useState([]);
  // const totalPageCount = Math.ceil(settlementListDataByDate?.responseData?.count / 10);

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
    } else {
      setErrorMsgs("Both start and end dates must be selected.");
      setSnackbarErrorOpen(true);
    }
  };

  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
      setValue("id", value);
    }, 500),
    [setValue]
  );

  return (
    <>
      <Box>
        <Box width="100px" sx={{ mt: 2, mb: 2 }}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              borderBottom: `1px solid ${theme.palette.secondary.main}`,
              lineHeight: "19px",
              color: "#212121",
              textAlign: "center",
            }}
          >
            Upload Preview
          </Typography>
        </Box>
        <Box sx={{ width: "100%", display: "flex", gap: 3, ml: 0 }}>
          <SearchText
            title="Search"
            {...register("id")}
            onChange={(e) => debouncedSetId(e.target.value)}
            onClick={handleSubmit(handleLoad)}
          />
          <Box sx={{ mt: -2.5 }}>
            <DateField
              control={control}
              dateLabel1="Date (From)"
              dateLabel2="Date (To)"
            />
          </Box>
          {/* <Box sx={{ mt: 4.5 }}> */}
          <RoundedButton title1="Load" onClick1={handleSubmit(handleLoad)} />
          {/* </Box> */}
        </Box>

        <Box
          sx={{
            mt: 2,
            maxWidth: "1500px",
            width: { xl: "130%", lg: "125%", md: "110%" },
          }}
        >
          {Data?.length > 0 ? (
            <ReceiptTable
              columns={LTPUpdateHistoryTableEntryHeader}
              data={Data}
              pagination={pagination}
              setPagination={setPagination}
              //   pageCount={toalPageCount}
              next={next}
              prev={prev}
            />
          ) : (
            <>
              <ReceiptTable
                columns={LTPUpdateHistoryTableEntryHeader}
                data={[]}
              />
              <Box
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "19px",
                  color: "#212121",
                  textAlign: "center",
                  marginTop: "20px",
                  marginLeft: "100px",
                }}
              >
                <CloudRoundedIcon
                  sx={{ color: "#E0E0E0", fontSize: "12rem" }}
                />
                <Typography>No data available</Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default LTPUpdateHistory;
