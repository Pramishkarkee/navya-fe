/* eslint-disable react-hooks/rules-of-hooks */
import { Box, IconButton, Typography } from "@mui/material";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { colorTokens } from "../../theme";
import { Link } from "react-router-dom";

type TrialBalanceData = {
  acc_code: string;
  ledger_name: string;
  code: string;
  opening_balance_dr: number;
  opening_balance_cr: number;
  debit_sum: number;
  credit_sum: number;
  closing_balance_dr: number;
  closing_balance_cr: number;
  transactions: any;
};

const columnHelper = createColumnHelper<TrialBalanceData>();

export const TrialBalanceColumns: ColumnDef<TrialBalanceData>[] = [
  columnHelper.group({
    id: "desc",
    header: "",
    columns: [
      columnHelper.accessor("code", {
        header: "Account Code",
        // accessorKey: "code",
        cell: ({ row }) => {
          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: row.getCanExpand() ? 500 : 400,
                  color: row.original.code ? colorTokens.grey[700] : "",
                }}
              >
                {row.original.code ? row.original.code : "-"}
              </Typography>
            </Box>
          );
        },
        footer: () => null,
      }),
      columnHelper.accessor("ledger_name", {
        header: "Description",
        // accessorKey: "ledger_name",
        cell: ({ row }) => {
          return (
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: row.original.acc_code
                    ? 600
                    : row.getCanExpand()
                    ? 500
                    : 400,
                  color: row.original.ledger_name ? colorTokens.grey[700] : "",
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {row.original.acc_code ? (
                  row.original.acc_code
                ) : (
                  <Link
                    to={
                      row.getCanExpand()
                        ? `/ledger/${row.original.code}/transaction`
                        : `/sub-ledger/${row.original.code}/transaction`
                    }
                    style={{
                      textDecoration: "none",
                      color: "#2f84d3",
                    }}
                  >
                    {row.original.ledger_name}
                  </Link>
                )}
                {row.getCanExpand() && (
                  <IconButton
                    {...{
                      onClick: row.getToggleExpandedHandler(),
                      sx: {
                        cursor: "pointer",
                        color: row.original.acc_code
                          ? colorTokens.grey[1000]
                          : "",
                        padding: "2px",
                      },
                    }}
                  >
                    {row.getIsExpanded() ? (
                      <KeyboardArrowUpIcon
                      // sx={{ height: "16px", width: "16px" }}
                      />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                )}{" "}
              </Typography>
            </Box>
          );
        },
        footer: () => {
          return (
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: colorTokens.grey[1000],
                  padding: "4px",
                }}
              >
                Total
              </Typography>
            </Box>
          );
        },
      }),
    ],
  }),
  columnHelper.group({
    id: "Opening Balance",
    header: () => (
      <Typography
        sx={{ fontSize: "14px", fontWeight: 500, textAlign: "center" }}
      >
        Opening Balance (NPR)
      </Typography>
    ),
    columns: [
      columnHelper.accessor("opening_balance_dr", {
        header: "Debit",
        // accessorKey: "opening_balance_dr",
        cell: (data) => {
          const allOpeningDRData = data.row.original.transactions;
          const totalOpeningBalanceDR =
            allOpeningDRData &&
            allOpeningDRData.reduce((acc, row) => {
              return acc + row.opening_balance_dr;
            }, 0);

          return (
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: data.row.original.acc_code
                    ? 600
                    : data.row.getCanExpand()
                    ? 500
                    : 400,
                  textAlign: "end",
                  color: data.row.original.acc_code
                    ? ""
                    : colorTokens.grey[700],
                }}
              >
                {data.row.original.opening_balance_dr !== null &&
                data.row.original.opening_balance_dr !== undefined
                  ? Number(
                      data?.row?.original?.opening_balance_dr?.toFixed(2)
                    ).toLocaleString()
                  : Number(totalOpeningBalanceDR?.toFixed(2)).toLocaleString()}
              </Typography>
            </Box>
          );
        },
        footer: ({ table }) => {
          const totalOpeningBalanceDR = table.options.data.reduce(
            (total, item) => {
              return (
                total +
                item?.transactions?.reduce(
                  (acc, value) => acc + value.opening_balance_dr,
                  0
                )
              );
            },
            0
          );
          return (
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  textAlign: "end",
                  color: colorTokens.grey[1000],
                  padding: "4px 8px ",
                }}
              >
                {Number(totalOpeningBalanceDR.toFixed(2)).toLocaleString()}
              </Typography>
            </Box>
          );
        },
      }),
      columnHelper.accessor("opening_balance_cr", {
        header: "Credit",
        // accessorKey: "opening_balance_cr",
        cell: (data) => {
          const allOpeningCRData = data.row.original.transactions;
          const totalOpeningbalanceCR =
            allOpeningCRData &&
            allOpeningCRData.reduce((acc, row) => {
              return acc + row.opening_balance_cr;
            }, 0);

          return (
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  textAlign: "end",
                  fontWeight: data.row.original.acc_code
                    ? 600
                    : data.row.getCanExpand()
                    ? 500
                    : 400,
                  color: data.row.original.acc_code
                    ? ""
                    : colorTokens.grey[700],
                }}
              >
                {data.row.original.opening_balance_cr !== null &&
                data.row.original.opening_balance_cr !== undefined
                  ? Number(
                      data.row.original.opening_balance_cr.toFixed(2)
                    ).toLocaleString()
                  : Number(totalOpeningbalanceCR?.toFixed(2)).toLocaleString()}
              </Typography>
            </Box>
          );
        },
        footer: ({ table }) => {
          const totalOpeningBalanceCR = table.options.data.reduce(
            (total, item) => {
              return (
                total +
                item?.transactions?.reduce(
                  (acc, value) => acc + value.opening_balance_cr,
                  0
                )
              );
            },
            0
          );
          return (
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  textAlign: "end",
                  color: colorTokens.grey[1000],
                  padding: "4px 8px",
                }}
              >
                {Number(totalOpeningBalanceCR.toFixed(2)).toLocaleString()}
              </Typography>
            </Box>
          );
        },
      }),
    ],
  }),
  columnHelper.group({
    id: "Transaction",
    header: () => (
      <Typography
        sx={{ fontSize: "14px", fontWeight: 500, textAlign: "center" }}
      >
        Transaction (NPR)
      </Typography>
    ),
    columns: [
      columnHelper.accessor("debit_sum", {
        header: "Debit",
        // accessorKey: "debit_sum",
        cell: (data) => {
          const allDebitData = data.row.original.transactions;
          const totalDebitSum =
            allDebitData &&
            allDebitData.reduce((acc, row) => {
              return acc + row.debit_sum;
            }, 0);

          return (
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  textAlign: "end",
                  fontWeight: data.row.original.acc_code
                    ? 600
                    : data.row.getCanExpand()
                    ? 500
                    : 400,
                  color: data.row.original.acc_code
                    ? ""
                    : colorTokens.grey[700],
                }}
              >
                {data.row.original.debit_sum !== null &&
                data.row.original.debit_sum !== undefined
                  ? Number(
                      data.row.original.debit_sum.toFixed(2)
                    ).toLocaleString()
                  : Number(totalDebitSum?.toFixed(2)).toLocaleString()}
              </Typography>
            </Box>
          );
        },
        footer: ({ table }) => {
          const totalDebitSum = table.options.data.reduce((total, item) => {
            return (
              total +
              item?.transactions?.reduce(
                (acc, value) => acc + value.debit_sum,
                0
              )
            );
          }, 0);
          return (
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  textAlign: "end",
                  color: colorTokens.grey[1000],
                  padding: "4px 8px ",
                }}
              >
                {Number(totalDebitSum.toFixed(2)).toLocaleString()}
              </Typography>
            </Box>
          );
        },
      }),
      columnHelper.accessor("credit_sum", {
        header: "Credit",
        // accessorKey: "credit_sum",
        cell: (data) => {
          const allCreditData = data.row.original.transactions;
          const totalCreditSum =
            allCreditData &&
            allCreditData.reduce((acc, row) => {
              return acc + row.credit_sum;
            }, 0);
          return (
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  textAlign: "end",
                  fontWeight: data.row.original.acc_code
                    ? 600
                    : data.row.getCanExpand()
                    ? 500
                    : 400,
                  color: data.row.original.acc_code
                    ? ""
                    : colorTokens.grey[700],
                }}
              >
                {data.row.original.credit_sum !== null &&
                data.row.original.credit_sum !== undefined
                  ? Number(
                      data.row.original.credit_sum.toFixed(2)
                    ).toLocaleString()
                  : Number(totalCreditSum?.toFixed(2)).toLocaleString()}
              </Typography>
            </Box>
          );
        },
        footer: ({ table }) => {
          const totalCreditSum = table.options.data.reduce((total, item) => {
            return (
              total +
              item?.transactions?.reduce(
                (acc, value) => acc + value.credit_sum,
                0
              )
            );
          }, 0);
          return (
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  textAlign: "end",
                  color: colorTokens.grey[1000],
                  padding: "4px 8px ",
                }}
              >
                {Number(totalCreditSum.toFixed(2)).toLocaleString()}
              </Typography>
            </Box>
          );
        },
      }),
    ],
  }),
  columnHelper.group({
    id: "Closing Balance",
    header: () => (
      <Typography
        sx={{ fontSize: "14px", fontWeight: 500, textAlign: "center" }}
      >
        Closing Balance (NPR)
      </Typography>
    ),
    columns: [
      columnHelper.accessor("closing_balance_dr", {
        header: "Debit",
        // accessorKey: "closing_balance_dr",
        cell: (data) => {
          const allClosingDRData = data.row.original.transactions;
          const totalClosingDRData =
            allClosingDRData &&
            allClosingDRData.reduce((acc, row) => {
              return acc + row.closing_balance_dr;
            }, 0);
          return (
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  textAlign: "right",
                  fontWeight: data.row.original.acc_code
                    ? 600
                    : data.row.getCanExpand()
                    ? 500
                    : 400,
                  color: data.row.original.acc_code
                    ? ""
                    : colorTokens.grey[700],
                }}
              >
                {data.row.original.closing_balance_dr !== null &&
                data.row.original.closing_balance_dr !== undefined
                  ? Number(
                      data.row.original.closing_balance_dr?.toFixed(2)
                    ).toLocaleString()
                  : Number(totalClosingDRData?.toFixed(2)).toLocaleString()}
              </Typography>
            </Box>
          );
        },
        footer: ({ table }) => {
          const totalClosingBalanceDR = table.options.data.reduce(
            (total, item) => {
              return (
                total +
                item?.transactions?.reduce(
                  (acc, value) => acc + value.closing_balance_dr,
                  0
                )
              );
            },
            0
          );
          return (
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  textAlign: "end",
                  color: colorTokens.grey[1000],
                  padding: "4px 8px ",
                }}
              >
                {Number(totalClosingBalanceDR.toFixed(2)).toLocaleString()}
              </Typography>
            </Box>
          );
        },
      }),
      columnHelper.accessor("closing_balance_cr", {
        header: " Credit",
        // accessorKey: "closing_balance_cr",
        cell: (data) => {
          const allClosingCRData = data.row.original.transactions;
          const totalClosingCRData =
            allClosingCRData &&
            allClosingCRData.reduce((acc, row) => {
              return acc + row.closing_balance_cr;
            }, 0);
          return (
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  textAlign: "right",
                  fontWeight: data.row.original.acc_code
                    ? 600
                    : data.row.getCanExpand()
                    ? 500
                    : 400,
                  color: data.row.original.acc_code
                    ? ""
                    : colorTokens.grey[700],
                }}
              >
                {data.row.original.closing_balance_cr !== null &&
                data.row.original.closing_balance_cr !== undefined
                  ? Number(
                      data.row.original.closing_balance_cr.toFixed(2)
                    ).toLocaleString()
                  : Number(totalClosingCRData?.toFixed(2)).toLocaleString()}
              </Typography>
            </Box>
          );
        },
        footer: ({ table }) => {
          const totalClosingBalanceCR = table.options.data.reduce(
            (total, item) => {
              return (
                total +
                item?.transactions?.reduce(
                  (acc, value) => acc + value.closing_balance_cr,
                  0
                )
              );
            },
            0
          );
          return (
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  textAlign: "end",
                  color: colorTokens.grey[1000],
                  padding: "4px 8px ",
                }}
              >
                {Number(totalClosingBalanceCR.toFixed(2)).toLocaleString()}
              </Typography>
            </Box>
          );
        },
      }),
    ],
  }),
];
