import { Box, Grid, Typography, useTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useGetLTPUpdate } from "services/LTPUpdate/LTPUpdateServices";
import { PaginationState } from "@tanstack/react-table";
import ReceiptTable from "components/Table/TanstackTable";
import SearchText from "components/Button/Search";
import { Empty } from "antd";
import debounce from "utils/Debounce";
import { LTPApprovalTableEntryHeader } from "constants/LTPUpdate/LTPUpdateApprovalTable";

const LTPUpdateList = () => {
  const theme = useTheme();
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [pageSize, setPageSize] = useState<string>("10");

  const { data: ltpUpdateData, refetch: ltpUpdateDataRefetch } =
    useGetLTPUpdate(
      pagination?.pageIndex + 1,
      searchFilter ? searchFilter : "",
      pageSize
    );

  const toalPageCount = Math.ceil(ltpUpdateData?.count / Number(pageSize));

  useEffect(() => {
    setPagination({ ...pagination, pageIndex: 0 });
  }, [searchFilter]);

  useEffect(() => {
    if (ltpUpdateData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (ltpUpdateData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [ltpUpdateData]);

  const debouncedSetValue = useCallback(
    debounce((value) => {
      setSearchFilter(value);
    }, 500),
    [searchFilter]
  );

  useEffect(() => {
    ltpUpdateDataRefetch();
  }, [searchFilter]);

  const handleReset = () => {
    setSearchFilter("");
    ltpUpdateDataRefetch();
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12} lg={8}>
        <Box sx={{ mt: 1 }}>
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
              LTP Imported Data
            </Typography>
          </Box>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <SearchText
                title="Search"
                onChange={(e) => debouncedSetValue(e.target.value)}
                // onClick={handleSearchClick}
              />
            </Box>
            <Box>
              {ltpUpdateData?.results.length > 0 ? (
                <ReceiptTable
                  columns={LTPApprovalTableEntryHeader}
                  data={ltpUpdateData?.results ?? []}
                  pagination={pagination}
                  setPagination={setPagination}
                  pageCount={toalPageCount}
                  next={next}
                  prev={prev}
                  setPageSize={setPageSize}
                />
              ) : (
                <>
                  <ReceiptTable
                    columns={LTPApprovalTableEntryHeader}
                    data={[]}
                  />
                  <Box
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      lineHeight: "19px",
                      color: "#212121",
                      textAlign: "center",
                      marginTop: "50px",
                      marginLeft: "100px",
                    }}
                  >
                    <Empty
                      // imageStyle={{ height: 150, width: 150 }}
                      description="No Data Available"
                    />

                    {/* <Typography>No data available</Typography> */}
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
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LTPUpdateList;
