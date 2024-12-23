import { Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { IndeterminateCheckbox } from "components/Table/PostingTable";

export interface DividendsSettlementTableHeaders {
  id: number;
  scheme_name: string;
  stock_name: string;
  eligible_share_units: string;
  bonus_percentage: string;
  cash_percentage: string;
  book_closure_date: string;
  dividend_timing: string;
  created_at: string;
  updated_at: string;
  tax_amount: number;
  total_percentage: number;
  stock_symbol: string;
  cash_amount: number;
  bonus_units: number;
  receivable_amount: number;
}
export const DividentSettlementTableColumns: ColumnDef<DividendsSettlementTableHeaders>[] =
  [
    {
      id: "select",
      header: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row, table }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: () => {
                const currentRowSelected = row.getIsSelected();
                table.toggleAllRowsSelected(false);
                row.toggleSelected(!currentRowSelected);
              },
            }}
          />
        </div>
      ),
    },

    {
      header: "Stock Symbol",
      accessorKey: "stock_symbol",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {data.row.original.stock_symbol || "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "Eligible Units",
      accessorKey: "eligible_share_units",
      cell: (data) => {
        const formattedUnits = Number(
          data.row.original.eligible_share_units
        ).toLocaleString();
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {formattedUnits || "N/A"}
          </Typography>
        );
      },
    },

    {
      header: "Bonus %",
      accessorKey: "bonus_percentage",
      cell: (data) => {
        const formattedPercentage = Number(
          data.row.original.bonus_percentage
        ).toFixed(2);
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {formattedPercentage || "N/A"}
          </Typography>
        );
      },
    },

    {
      header: "Cash %",
      accessorKey: "cash_percentage",
      cell: (data) => {
        const formattedCashPercentage = Number(
          data.row.original.cash_percentage
        ).toFixed(2);

        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {formattedCashPercentage || "N/A"}
          </Typography>
        );
      },
    },
    {
      header: "Book Closure Date",
      accessorKey: "book_closure_date",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {data.row.original.book_closure_date || "N/A"}
          </Typography>
        );
      },
    },
  ];
