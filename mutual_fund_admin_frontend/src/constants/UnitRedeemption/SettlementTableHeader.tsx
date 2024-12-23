import { Box, Button, Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { IndeterminateCheckbox } from "components/Table/PostingTable";

type SettlementTableData = {
  lot_id: number;
  lot_sequence_id: number;
  lot_number: number;
  lot_sequence_number: number;
  purchase_date: string;
  holding_days: number;
  purchased_nav_value: number;
  previous_lot_unit: number;
  investment_amt: number;
  current_lot_unit: number;
  redeemed_lot_units: number;
  base_sold_amt: number;
  exit_load_pct: number;
  exit_load_amt: number;
  gain_or_loss_status: string;
  cgt_pct: number;
  cgt_amt: number;
  final_sold_amt: number;
};

export const UnitRedemptionSettlementTableHeader: ColumnDef<SettlementTableData>[] =
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
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
    },
    {
      header: "S. No.",
      accessorKey: "sn",
      cell: ({ row }) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {row.index + 1}
          </Typography>
        );
      },
    },
    {
      header: "Date",
      accessorKey: "purchase_date",
      cell: (data) => {
        return (
          <Typography width="80px" sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.purchase_date}
          </Typography>
        );
      },
    },
    {
      header: "Redeemed Units",
      accessorKey: "redeemed_lot_units",
      cell: (data) => {
        return (
          <Typography
            textAlign="right"
            width="85%"
            sx={{ fontSize: "14px", fontWeight: 400 }}
          >
            {data?.row?.original?.redeemed_lot_units?.toLocaleString()}
          </Typography>
        );
      },
    },
    {
      header: "CGT",
      accessorKey: "cgt_amt",
      cell: (data) => {
        return (
          <Typography
            textAlign="right"
            width="85%"
            sx={{ fontSize: "14px", fontWeight: 400 }}
          >
            {Number(data.row.original.cgt_amt.toFixed(2)).toLocaleString()}(
            {data.row.original.cgt_pct * 100}%)
          </Typography>
        );
      },
    },
    {
      header: "Exit Load",
      accessorKey: "exit_load_amt",
      cell: (data) => {
        return (
          <Typography
            textAlign="right"
            width="85%"
            sx={{ fontSize: "14px", fontWeight: 400 }}
          >
            {data.row.original.exit_load_amt} (
            {data.row.original.exit_load_pct * 100}%)
          </Typography>
        );
      },
    },
    {
      header: "Total Amount",
      accessorKey: "final_sold_amt",
      cell: (data) => {
        return (
          <Typography
            textAlign="right"
            width="85%"
            sx={{ fontSize: "14px", fontWeight: 400 }}
          >
            {Number(
              data.row.original.final_sold_amt.toFixed(2)
            ).toLocaleString()}
          </Typography>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: () => {
        return (
          <Box>
            <Button sx={{ textTransform: "none" }}>Settle</Button>
          </Box>
        );
      },
    },
  ];
