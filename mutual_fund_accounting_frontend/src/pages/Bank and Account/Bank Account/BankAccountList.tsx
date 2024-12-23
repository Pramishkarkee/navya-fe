import { Box, useTheme } from "@mui/material";
import DateField from "components/DateFilter/DateField";
import SearchText from "components/Button/Search";
import ReceiptTable from "components/Table/TanstackTable";

import React, { useCallback, useEffect, useState } from "react";
import { BankAccountTableList } from "constants/Bank Account/BankAccountTableHeader";
import { useGetBankAccontCreatedList } from "services/BankAccount/BankAccountServices";
import { PaginationState } from "@tanstack/react-table";
import { Empty } from "antd";
import { useForm } from "react-hook-form";
import RoundedButton from "components/Button/Button";
import DateFormatter from "utils/DateFormatter";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
const DateFormatterAmendment = {
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

const BankAccountList = () => {
  const [id, setId] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    //   startDate: dayjs(),
    //   endDate: dayjs(),
    // },
    // resolver: yupResolver(schema),
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [searchData, setSearchData] = useState({
    from_date: "",
    to_date: "",
  });

  const [searchNext, setSearchNext] = useState<boolean>(false);
  const [searchPrev, setSearchPrev] = useState<boolean>(false);

  const { data: BankAccountData } = useGetBankAccontCreatedList();

  // const [selectedValue, setSelectedValue] = useState('Debenture');

  // const options = [
  //     { value: 'Ongoing Debentures', label: 'Ongoing Debentures' },
  //     { value: 'List', label: 'List' },
  // ];

  // const totalPageCount = DebentureData?.count;
  const totalPageCount = Math.ceil(BankAccountData?.count / 10 || 1);

  // const handleChange = (event) => {
  //     setSelectedValue(event.target.value);
  // };

  // const handleSearch = () => {
  // };

  useEffect(() => {
    if (BankAccountData?.next === null) {
      setSearchNext(false);
    } else {
      setSearchNext(true);
    }
    if (BankAccountData?.previous === null) {
      setSearchPrev(false);
    } else {
      setSearchPrev(true);
    }
  }, [BankAccountData]);

  useEffect(() => {
    if (id) {
      setDisplayData(BankAccountData ? BankAccountData?.results : []);
    } else {
      setDisplayData(BankAccountData?.results || []);
    }
  }, [id, BankAccountData]);

  const handleLoad = (data) => {
    setId(data.id || "");
    if (data.startDate && data.endDate) {
      const fromDate = new Date(data.startDate);
      const toDate = new Date(data.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatterAmendment.format(
        toDate.toISOString()
      );

      setSearchData({
        from_date: formattedFromDate,
        to_date: formattedToDate,
      });

      //   setLoadClicked(true);
      //   setDatePag({ pageIndex: 0, pageSize: 10 });
    } else {
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
    <Box onSubmit={handleSubmit(handleLoad)} component="form">
      {/* <Box sx={{ width: "100%", display: "flex", gap: 3, marginTop: 5, ml: -1, mb: 3 }}
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

                    // {...{ control }}
                    // dateLabel1="Date (From)"
                    // dateLabel2="Date (To)"
                    />
                </Box>


                <RoundedButton title1="Load" />
            </Box> */}

      {BankAccountData?.responseData?.length === 0 ? (
        <Box sx={{ mt: 3 }}>
          <ReceiptTable
            columns={BankAccountTableList}
            data={[]}
            // pagination={pagination}
            // setPagination={setPagination}
            // next={next}
            // prev={prev}
            // pageCount={totalPageCount}
          />
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
            {/* <CloudRoundedIcon sx={{ color: "#E0E0E0", fontSize: "12rem" }} /> */}
            <Empty
              imageStyle={{ height: 150, width: 150 }}
              description="No Data Available"
            />
            {/* <Typography>No Data Available</Typography> */}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            mt: 3,
            maxWidth: "1500px",
            width: { md: "110%", lg: "120%", xl: "130%" },
          }}
        >
          <ReceiptTable
            columns={BankAccountTableList}
            data={BankAccountData?.responseData ?? []}
            pagination={pagination}
            setPagination={setPagination}
            next={searchNext}
            prev={searchPrev}
            pageCount={totalPageCount}
          />
        </Box>
      )}
    </Box>
  );
};

export default BankAccountList;
