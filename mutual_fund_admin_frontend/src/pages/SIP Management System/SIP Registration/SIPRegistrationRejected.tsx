import { useEffect, useState } from "react";

import {
  Box,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { useForm, Controller } from "react-hook-form";
import ReceiptTable from "components/Table/TanstackTable";
import { SIPRegistrationReceiptTableHeaders } from "constants/SIPRegistrationTable/SIPRegistrationReceiptTableHeader";
import {
  useGetSipReject,
  useGetSipRejectByBoid,
} from "services/SIP/sipRejectedServices";
import { PaginationState } from "@tanstack/react-table";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ExportButtonSip from "components/Button/ExportSipButton";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import DateField from "components/DateField/DateField";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DateFormatter from "utils/DateFormatter";

const SIPRegistrationReceipt = () => {
  const theme = useTheme();
  const schema = yup.object().shape({
    distributionCenter: yup.string().required(),
    boid: yup.string(),
    startDate: yup.object().required(),
    endDate: yup.object().required(),
    // .length(16, "BOID number must be exactly 16 characters"),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      // boid: null,
      distributionCenter: "Navya Advisors",
      startDate: dayjs(),
      endDate: dayjs(),
    },
    resolver: yupResolver(schema),
  });

  const [searchClicked, setSearchClicked] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [prevPage, setPrevPage] = useState<boolean>();
  const [nextPage, setNextPage] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [searchData, setSearchData] = useState({
    from_date: "",
    to_date: "",
  });

  const [boid, setBoid] = useState<string>("");
  const [filteredTableData, setFilteredTableData] = useState([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const {
    data: sipRejectData,
    isSuccess: sipRejectSuccess,
    refetch: sipReceiptDataRefetch,
  } = useGetSipReject(
    pagination.pageIndex + 1,
    searchData.from_date,
    searchData.to_date
  );

  const { data: sipRejectDataByBoid } = useGetSipRejectByBoid(boid);

  const totalPage = Math.ceil(sipRejectData?.meta?.records / 10);

  useEffect(() => {
    sipReceiptDataRefetch();
    if (sipRejectData?.responseData?.next === null) {
      setNextPage(true);
    } else {
      setNextPage(false);
    }
    if (sipRejectData?.responseData?.previous === null) {
      setPrevPage(true);
    } else {
      setPrevPage(false);
    }
  }, [sipRejectData, sipRejectSuccess, sipReceiptDataRefetch]);

  useEffect(() => {
    if (sipRejectSuccess) {
      setTableData(sipRejectData?.responseData?.results);
    }
  }, [sipRejectData, sipRejectSuccess]);

  const handleLoad = () => {
    if (boid) {
      setFilteredTableData(sipRejectDataByBoid?.responseData?.results || []);
      setSearchClicked(true);
      setSearchData({
        from_date: "",
        to_date: "",
      });
    } else {
      sipReceiptDataRefetch();
      setSearchClicked(true);
    }
  };

  useEffect(() => {
    if (!boid) {
      setFilteredTableData([]);
      setSearchClicked(false);
    }
  }, [boid]);

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

  const handleLoadDate = (data, e) => {
    e.preventDefault();
    // console.log(data)
    if (data.startDate && data.endDate) {
      const fromDate = new Date(data.startDate);
      const toDate = new Date(data.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatterUnit.format(toDate.toISOString());

      setSearchClicked(false);
      setBoid("");
      setSearchData({
        from_date: formattedFromDate,
        to_date: formattedToDate,
      });

      // setLoadDate(true);
    } else {
      console.log("Both start and end dates must be selected.");
    }
  };
  const handleReset = () => {
    setBoid("");
    setSearchData({
      from_date: "",
      to_date: "",
    });
    sipReceiptDataRefetch();
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* <Box>
        <OwnerInformation dpOptions={BankOptions} control={control} />
      </Box> */}
        <Box
          component="form"
          onSubmit={handleSubmit(handleLoad)}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box sx={{ width: { lg: "30%", md: "50%" } }}>
            <TypographyLabel title="Distribution Center" />
            <Controller
              name="distributionCenter"
              control={control}
              render={({ field }) => (
                <Select {...field} fullWidth size="small">
                  <MenuItem value="Navya Advisors">Navya Advisors</MenuItem>
                  <MenuItem value="Mahalaxmi">Mahalaxmi</MenuItem>
                </Select>
              )}
            />
          </Box>
          <Box sx={{ width: { lg: "30%", md: "50%" } }}>
            <TypographyLabel title="BOID" />
            <TextField
              size="small"
              placeholder="Enter boid"
              fullWidth
              value={boid}
              onChange={(e) => setBoid(e.target.value)}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <RoundedButton title1="Search" />
          </Box>
        </Box>

        <Box
          sx={{ mt: 0, mb: 2 }}
          onSubmit={handleSubmit(handleLoadDate)}
          component="form"
        >
          <DateField
            control={control}
            dateLabel1="Date (From)"
            dateLabel2="Date (To)"
          />
          <RoundedButton title1="Load" />
        </Box>

        {tableData.length > 0 ? (
          <>
            <Box
              sx={{
                maxWidth: "1500px",
                width: { md: "110%", lg: "115%", xl: "120%" },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <HeaderDesc title="Table" />
                <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
                  <ExportButtonSip
                    boidNumber={boid}
                    exportUrl={`${BASE_URL}/sip-up/api/v1/sip/sip-list/`}
                    fileName={`SIP Registration Receipt${
                      boid ? ` - ${boid}` : ""
                    }.csv`}
                    fromDate={searchData.from_date}
                    toDate={searchData.to_date}
                    sipStatus="rejected"
                  />
                </Box>
              </Box>

              {boid && searchClicked && searchData ? (
                <>
                  <ReceiptTable
                    columns={SIPRegistrationReceiptTableHeaders}
                    data={filteredTableData || []}
                  />
                  {filteredTableData.length === 0 && (
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
                      <CloudRoundedIcon
                        sx={{ color: "#E0E0E0", fontSize: "12rem" }}
                      />
                      <Typography>
                        No data available for the given BOID
                      </Typography>
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
                </>
              ) : (
                <ReceiptTable
                  columns={SIPRegistrationReceiptTableHeaders}
                  data={tableData || []}
                  pagination={pagination}
                  setPagination={setPagination}
                  next={nextPage}
                  prev={prevPage}
                  pageCount={totalPage}
                />
              )}
            </Box>
          </>
        ) : (
          <>
            <ReceiptTable
              columns={SIPRegistrationReceiptTableHeaders}
              data={filteredTableData || []}
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
              <Typography>No data available for the given BOID</Typography>
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
    </>
  );
};

export default SIPRegistrationReceipt;
