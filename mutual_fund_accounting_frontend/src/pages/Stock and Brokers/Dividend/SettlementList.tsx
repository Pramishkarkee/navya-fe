import { useCallback, useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";

import ReceiptTable from "components/Table/TanstackTable";
import RoundedButton from "components/Button/Button";
import { DividentSettlementTableList } from "constants/Dividends/DividentSettlementTableList";
import { useGetDividendSettlementList } from "services/Dividend/DividendService";
import { useForm } from "react-hook-form";
import { PaginationState } from "@tanstack/react-table";
import dayjs from "dayjs";
import DateField from "components/DateFilter/DateField";
import DateFormatter from "utils/DateFormatter";
import { Empty } from "antd";
import SearchText from "components/Button/Search";
import debounce from "utils/Debounce";

const SettlementList = () => {
  const theme = useTheme();
  const [schemaN, setSchemaN] = useState<string>("");

  const [paginationSettlement, setPaginationSettlement] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const [searchSettlementData, setSearchSettlementData] = useState({
    from_date: "",
    to_date: "",
  });

  const { data: dividendSettlementData, refetch: dividendRefetch } =
    useGetDividendSettlementList(
      paginationSettlement.pageIndex + 1,
      searchSettlementData.from_date,
      searchSettlementData.to_date,
      schemaN
    );

  const [nextSettlement, setNextSettlement] = useState<boolean>();
  const [prevSettlement, setPrevSettlement] = useState<boolean>();

  const totalPagesSettlement = Math.ceil(dividendSettlementData?.count / 10);

  useEffect(() => {
    if (dividendSettlementData?.next === null) {
      setNextSettlement(true);
    } else {
      setNextSettlement(false);
    }
    if (dividendSettlementData?.previous === null) {
      setPrevSettlement(true);
    } else {
      setPrevSettlement(false);
    }
  }, [dividendSettlementData]);

  const { handleSubmit, control, register, setValue } = useForm({
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
      schemaN: "",
    },
  });

  const handleLoadSettlement = (data) => {
    setSchemaN(data.schemaN || "");
    if (data.startDate && data.endDate) {
      const fromDate = new Date(data.startDate);
      const toDate = new Date(data.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatter.format(toDate.toISOString());

      setSearchSettlementData({
        from_date: formattedFromDate,
        to_date: formattedToDate,
      });
    } else {
    }
  };

  const handleReset = () => {
    setSchemaN("");
    setSearchSettlementData({
      from_date: "",
      to_date: "",
    });
    dividendRefetch();
  };

  const debouncedSetId = useCallback(
    debounce((value) => {
      setSchemaN(value);
      setValue("schemaN", value);
    }, 500),
    [setValue]
  );

  useEffect(() => {
    if (searchSettlementData || schemaN) {
      paginationSettlement.pageIndex = 0;
    }
  }, [searchSettlementData, schemaN]);

  return (
    <>
      <Box>
        <Typography
          sx={{
            fontSize: "16px",
            mb: 2,
            fontWeight: 600,
            lineHeight: "19px",
            color: "#212121",
            textAlign: "center",
            width: "max-content",
            borderBottom: `1px solid ${theme.palette.secondary.main}`,
          }}
        >
          Search Filters
        </Typography>
        <Box sx={{ mt: 2, width: "100%" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: 3,
              marginTop: 3,
              ml: -1,
              mb: 3,
            }}
            onSubmit={handleSubmit(handleLoadSettlement)}
            component="form"
          >
            <SearchText
              title="Search for Dividends"
              {...register("schemaN")}
              onChange={(e) => debouncedSetId(e.target.value)}
              onClick={handleSubmit(handleLoadSettlement)}
            />
            <Box sx={{ mt: -2 }}>
              <DateField
                control={control}
                dateLabel1="Date (From)"
                dateLabel2="Date (To)"
              />
            </Box>
            <RoundedButton
              title1="Load"
              onClick1={handleSubmit(handleLoadSettlement)}
            />
          </Box>
          {dividendSettlementData?.results?.length === 0 ? (
            <Box
              sx={{
                maxWidth: "1500px",
                width: { md: "110%", lg: "120%", xl: "130%" },
              }}
            >
              <ReceiptTable columns={DividentSettlementTableList} data={[]} />
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
            </Box>
          ) : (
            <Box
              sx={{
                maxWidth: "1500px",
                width: { md: "110%", lg: "125%", xl: "130%" },
              }}
            >
              <ReceiptTable
                columns={DividentSettlementTableList}
                data={dividendSettlementData?.results ?? []}
                pagination={paginationSettlement}
                setPagination={setPaginationSettlement}
                next={nextSettlement}
                prev={prevSettlement}
                pageCount={totalPagesSettlement}
              />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default SettlementList;
