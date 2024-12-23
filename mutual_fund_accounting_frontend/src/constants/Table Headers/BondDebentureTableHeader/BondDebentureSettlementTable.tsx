import { Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { IndeterminateCheckbox } from "components/Table/PostingTable";

export type SettlementData = {
  id: number;
  base_amt: string;
  broker_charge: string;
  sebon_charge: string;
  dp_charge: string;
  cgt_pct: string;
  cgt_amt: string;
  total_amt: string;
  cumm_units: string;
  cumm_amt: string;
  wacc: string;
  is_settled: boolean;
  remaining_units: string;
  amortization_amt: string;
  total_prev_amortized_amt: string;
  wacc_with_amortization: string;
  txn_type: string;
  txn_date: string;
  txn_units: string;
  txn_price: string;
  gain_or_loss: string;
  net_gain_loss: string;
  pending_settlement: boolean;
  approved_settlement: boolean;
  rejected_settlement: boolean;
  amortization_amt_per_unit: string;
  cumm_amt_with_amortization: string;
  immediate_wacc_before_txn: string;
  created_at: string;
  updated_at: string;
  bond_and_debenture: number;
  broker: number;
  bond_name: string;
  bond_status: string;
  broker_name: string;
  broker_code: number;
  actions: any;
};
export const TransactionSettlementTableList: ColumnDef<SettlementData>[] = [
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
    header: "Symbol",
    accessorKey: "bond_name",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
          {data.row.original.bond_name}
        </Typography>
      );
    },
    footer: () => {
      return (
        <Typography
          sx={{
            fontWeight: 600,
            display: "flex",
            justifyContent: "flex-end",
            width: "124px",
            fontSize: "0.80rem",
          }}
        >
          Total (Selected Items)
        </Typography>
      );
    },
  },
  {
    header: "Transaction Type",
    accessorKey: "txn_type",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            display: "flex",
            justifyContent: "flex-start",
            width: "55px",
            textTransform: "capitalize",
          }}
        >
          {data.row.original.txn_type || "-"}
        </Typography>
      );
    },
  },
  {
    header: "Broker",
    accessorKey: "broker_code",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
          {data.row.original.broker_code ? data.row.original.broker_code : "-"}
        </Typography>
      );
    },
  },
  {
    header: "Transaction Date",
    accessorKey: "created_at",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            display: "flex",
            justifyContent: "flex-end",
            width: "65px",
          }}
        >
          {data.row.original.created_at.split("T")[0]}
        </Typography>
      );
    },
  },

  {
    header: "Units ",
    accessorKey: "txn_units",
    cell: (data) => {
      return (
        <Typography
          sx={{ fontSize: "14px", fontWeight: 400, textAlign: "right" }}
        >
          {data.row.original.txn_units.toLocaleString()}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return sum + Number(row.original.txn_units);
        }, 0);

      return (
        <Typography
          sx={{
            fontWeight: 800,
            display: "flex",
            justifyContent: "flex-end",
            // width: "36px",
            fontSize: "0.80rem",
          }}
        >
          {total.toLocaleString()}
        </Typography>
      );
    },
  },
  {
    header: "Rate",
    accessorKey: "txn_price",
    cell: (data) => {
      return (
        <Typography
          sx={{ fontSize: "14px", fontWeight: 400, textAlign: "right" }}
        >
          {Number(data.row.original.txn_price).toLocaleString()}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return sum + Number(row.original.txn_price);
        }, 0);

      return (
        <Typography
          sx={{
            fontWeight: 800,
            display: "flex",
            justifyContent: "flex-end",
            // width: "30px",
            fontSize: "0.80rem",
          }}
        >
          {total.toLocaleString()}
        </Typography>
      );
    },
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: (data) => {
      const amount =
        Number(data.row.original.txn_units) *
        Number(data.row.original.txn_price);
      return (
        <Typography
          sx={{ fontSize: "14px", fontWeight: 400, textAlign: "right" }}
        >
          {Number(amount).toLocaleString()}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return (
            sum +
            Number(row.original.txn_price) * Number(row.original.txn_units)
          );
        }, 0);

      return (
        <Typography
          sx={{
            fontWeight: 800,
            display: "flex",
            justifyContent: "flex-end",
            // width: "43px",
            fontSize: "0.80rem",
          }}
        >
          {total.toLocaleString()}
        </Typography>
      );
    },
  },

  {
    header: "Broker Charge",
    accessorKey: "broker_charge",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            display: "flex",
            justifyContent: "flex-end",
            width: "80px",
          }}
        >
          {Number(data.row.original.broker_charge).toLocaleString()}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return sum + Number(row.original.broker_charge);
        }, 0);

      return (
        <Typography
          sx={{
            fontWeight: 800,
            display: "flex",
            justifyContent: "flex-end",
            width: "78px",
            fontSize: "0.80rem",
          }}
        >
          {total.toLocaleString()}
        </Typography>
      );
    },
  },
  {
    header: "SEBON Charge",
    accessorKey: "sebon_charge",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            display: "flex",
            justifyContent: "flex-end",
            width: "83px",
          }}
        >
          {Number(data.row.original.sebon_charge).toLocaleString()}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return sum + Number(row.original.sebon_charge);
        }, 0);

      return (
        <Typography
          sx={{
            fontWeight: 800,
            display: "flex",
            justifyContent: "flex-end",
            width: "81px",
            fontSize: "0.80rem",
          }}
        >
          {total.toLocaleString()}
        </Typography>
      );
    },
  },
  {
    header: "DP Fee",
    accessorKey: "dp_charge",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            display: "flex",
            justifyContent: "flex-end",
            width: "40px",
          }}
        >
          {Number(data.row.original.dp_charge).toLocaleString()}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return sum + Number(row.original.dp_charge);
        }, 0);

      return (
        <Typography
          sx={{
            fontWeight: 800,
            display: "flex",
            justifyContent: "flex-end",
            width: "38px",
            fontSize: "0.80rem",
          }}
        >
          {total.toLocaleString()}
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
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            display: "flex",
            justifyContent: "flex-end",
            width: "25px",
          }}
        >
          {data.row.original.cgt_amt
            ? data.row.original.cgt_amt.toLocaleString()
            : "-"}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return sum + Number(row.original.cgt_amt ? row.original.cgt_amt : 0);
        }, 0);

      return (
        <Typography
          sx={{
            fontWeight: 800,
            display: "flex",
            justifyContent: "flex-end",
            width: "23px",
            fontSize: "0.80rem",
          }}
        >
          {total.toLocaleString()}
        </Typography>
      );
    },
  },
  {
    header: "Net Amount",
    accessorKey: "total_amt",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            display: "flex",
            justifyContent: "flex-end",
            width: "68px",
          }}
        >
          {Number(data.row.original.total_amt).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return sum + Number(row.original.total_amt);
        }, 0);

      return (
        <Typography
          sx={{
            fontWeight: 800,
            display: "flex",
            justifyContent: "flex-end",
            width: "66px",
            fontSize: "0.80rem",
          }}
        >
          {total.toLocaleString()}
        </Typography>
      );
    },
  },
  {
    header: "WACC Rate",
    accessorKey: "wacc",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            display: "flex",
            justifyContent: "flex-end",
            width: "65px",
          }}
        >
          {Number(data.row.original.wacc).toLocaleString()}
        </Typography>
      );
    },
    footer: (info) => {
      const total = info.table
        .getFilteredSelectedRowModel()
        .rows.reduce((sum, row) => {
          return sum + Number(row.original.wacc);
        }, 0);

      return (
        <Typography
          sx={{
            fontWeight: 800,
            display: "flex",
            justifyContent: "flex-end",
            width: "63px",
            fontSize: "0.80rem",
          }}
        >
          {total.toLocaleString()}
        </Typography>
      );
    },
  },
];
