import React, { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { PaginationState } from "@tanstack/react-table";
import { Empty } from "antd";
import { Box, Typography, useTheme } from "@mui/material";

import debounce from "utils/Debounce";
import DateFormatter from "utils/DateFormatter";
import SearchText from "components/Button/Search";
import RoundedButton from "components/Button/Button";
import DateField from "components/DateFilter/DateField";
import ReceiptTable from "components/Table/TanstackTable";

import { useGetBondAndDebentureData } from "services/BondAndDebenture/BondAndDebenture";

const BondAndDebentureSellPosting = () => {
  const theme = useTheme();
  const { control, handleSubmit, register, setValue } = useForm({
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
      id: "",
    },
  });

  const [id, setId] = useState<string>("");
  const [searchNext, setSearchNext] = useState<boolean>(false);
  const [searchPrev, setSearchPrev] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });

  const { data: DebentureData } = useGetBondAndDebentureData(
    pagination.pageIndex + 1,
    searchData.from_date,
    searchData.to_date,
    id
  );

  const totalPageCount = Math.ceil(DebentureData?.meta?.count / 10);

  useEffect(() => {
    if (DebentureData?.meta?.next === null) {
      setSearchNext(true);
    } else {
      setSearchNext(false);
    }
    if (DebentureData?.meta?.previous === null) {
      setSearchPrev(true);
    } else {
      setSearchPrev(false);
    }
  }, [DebentureData]);

  const handleLoad = (data) => {
    setId(data.id || "");
    if (data.startDate && data.endDate) {
      const fromDate = new Date(data.startDate);
      const toDate = new Date(data.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatter.format(toDate.toISOString());

      setSearchData({
        from_date: formattedFromDate,
        to_date: formattedToDate,
      });
    }
  };
  const handleReset = () => {
    setId("");
    setSearchData({
      from_date: "",
      to_date: "",
    });
  };
  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
      setValue("id", value);
    }, 500),
    [setValue]
  );

  useEffect(() => {
    if (id) {
      setPagination({ ...pagination, pageIndex: 0 });
    }
  }, [id, pagination]);

  const BondDebentureTableColumns = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        cell: (data) => {
          return (
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
              {data.row.original.id}
            </Typography>
          );
        },
      },
      {
        header: "Issue Date",
        accessorKey: "issue_date",
        cell: (data) => {
          return (
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
              {data.row.original.issue_date || "N/A"}
            </Typography>
          );
        },
      },
      {
        header: "Name",
        accessorKey: "bond_name",
        cell: (data) => {
          return (
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
              {data.row.original.bond_name || "N/A"}
            </Typography>
          );
        },
      },
      {
        header: "Coupon Rate",
        accessorKey: "coupon_rate",
        cell: (data) => {
          return (
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
              {parseInt(data.row.original.coupon_rate || "N/A")}
            </Typography>
          );
        },
      },
      {
        header: "Coupon Frequency",
        accessorKey: "coupon_frequency",
        cell: (data) => {
          const couponFrequency =
            Number(data.row.original.coupon_frequency) === 12
              ? "Monthly"
              : Number(data.row.original.coupon_frequency) === 3
              ? "Quarterly"
              : Number(data.row.original.coupon_frequency) === 2
              ? "Semi Annually"
              : "Annually";
          return (
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
              {couponFrequency}
            </Typography>
          );
        },
      },
      {
        header: "Units",
        accessorKey: "cumm_units",
        cell: (data) => {
          return (
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
              {parseInt(data.row.original.cumm_units || "N/A")}
            </Typography>
          );
        },
      },
      {
        header: "WACC Rate",
        accessorKey: "effective_rate",
        cell: (data) => {
          return (
            <Typography
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "65px",
                fontSize: "14px",
                fontWeight: 400,
              }}
            >
              {Number(
                data.row.original.effective_rate
                  ? data.row.original.effective_rate
                  : "N/A"
              ).toLocaleString()}
            </Typography>
          );
        },
      },
      {
        header: "Invested Amount",
        accessorKey: "invested_amount",
        cell: (data) => {
          return (
            <Typography
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "95px",
                fontSize: "14px",
                fontWeight: 400,
              }}
            >
              {Number(
                data.row.original.invested_amount || "N/A"
              ).toLocaleString()}
            </Typography>
          );
        },
      },
      {
        header: "Maturity Date",
        accessorKey: "maturity_date",
        cell: (data) => {
          return (
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
              {data.row.original.maturity_date || "N/A"}
            </Typography>
          );
        },
      },
      {
        header: "Days To Maturity",
        accessorKey: "days_until_maturity",
        cell: (data) => {
          return (
            <Typography
              sx={{ fontSize: "14px", fontWeight: 400, textAlign: "center" }}
            >
              {data.row.original.days_until_maturity
                ? data.row.original.days_until_maturity
                : "-"}
            </Typography>
          );
        },
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <Box onSubmit={handleSubmit(handleLoad)} component="form">
        <Box
          sx={{
            width: "100%",
            display: "flex",
            gap: 3,
            marginTop: 5,
            ml: -1,
            mb: 3,
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
              maxDateValue={dayjs()}
            />
          </Box>

          <RoundedButton title1="Load" />
        </Box>

        {DebentureData?.responseData?.length === 0 ? (
          <Box
            sx={{
              maxWidth: "1500px",
              width: { md: "110%", xl: "120%", lg: "125%" },
            }}
          >
            <ReceiptTable columns={BondDebentureTableColumns} data={[]} />
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
              width: { md: "110%", lg: "128%", xl: "133%" },
            }}
          >
            <ReceiptTable
              columns={BondDebentureTableColumns}
              data={DebentureData?.responseData ?? []}
              pagination={pagination}
              setPagination={setPagination}
              next={searchNext}
              prev={searchPrev}
              pageCount={totalPageCount}
            />
          </Box>
        )}
      </Box>
    </React.Fragment>
  );
};

export default BondAndDebentureSellPosting;
