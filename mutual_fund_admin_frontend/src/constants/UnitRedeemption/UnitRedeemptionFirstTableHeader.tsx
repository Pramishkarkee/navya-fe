/* eslint-disable react-hooks/rules-of-hooks */
import { Typography, Box } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import ViewModal from "components/Modal/ViewModal";
import { Visibility } from "@mui/icons-material";
import { colorTokens } from "../../theme";
import { useState } from "react";
import DateFormatter from "utils/DateFormatter";

type UnitRedeemptionEntryLot = {
  boid_number: string;
  id: number;
  lot_number: number;
  lotSeqNo: number;
  lot_unit: number;
  nav_value: number;
  created_at: string;
  holding_days: string;
  exit_load: string;
  exit_Load_Percentage: string;
  cgt_amount: string;
  cgt_Percentage: string;
  actions: any;
  lot_sequence_number: number;
};

type UnitRedeemptionEntryLotSummary = {
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
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
export const UnitRedeemptionEntryLotDetailsHeader: ColumnDef<UnitRedeemptionEntryLot>[] =
  [
    {
      header: "Lot No.",
      accessorKey: "lotNo",
      cell: (data) => {
        return (
          <Typography align="left" sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.lot_number}
          </Typography>
        );
      },
    },
    {
      header: "Lot Sequence No.",
      accessorKey: "lot_sequence_number",
      cell: (data) => {
        return (
          <Typography align="left" sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.lot_sequence_number}
          </Typography>
        );
      },
    },
    {
      header: "Lot Unit",
      accessorKey: "lotUnit",
      cell: (data) => {
        return (
          <Typography
            align="right"
            width="50%"
            sx={{ fontSize: "14px", fontWeight: 400 }}
          >
            {data.row.original.lot_unit.toLocaleString()}
          </Typography>
        );
      },
    },
    {
      header: "Purchased NAV",
      accessorKey: "nav_value",
      cell: (data) => {
        return (
          <Typography
            align="right"
            width="50%"
            sx={{ fontSize: "14px", fontWeight: 400 }}
          >
            {data.row.original.nav_value}
          </Typography>
        );
      },
    },
    {
      header: "Purchase Date",
      accessorKey: "created_at",
      cell: (data) => {
        const formattedDate = DateFormatter.format(
          data.row.original.created_at
        );
        return (
          <Typography align="left" sx={{ fontSize: "14px", fontWeight: 400 }}>
            {formattedDate}
          </Typography>
        );
      },
    },
    {
      header: "Holding Days",
      accessorKey: "holding_days",
      cell: (data) => {
        return (
          <Typography align="left" sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.holding_days}
          </Typography>
        );
      },
    },
    {
      header: "Exit Load",
      accessorKey: "exit_load",
      cell: (data) => {
        return (
          <Typography align="right" sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.exit_load}
          </Typography>
        );
      },
    },
    {
      header: "Capital Gain Tax",
      accessorKey: "cgt_amount",
      cell: (data) => {
        return (
          <Typography align="right" sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.cgt_amount}
          </Typography>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (data) => {
        const [open, setOpen] = useState(false);
        const handleView = () => {
          setOpen(true);
        };
        const modalData: Record<string, string> = {
          BOID: data.row.original.boid_number ?? "N/A",
          "Lot No": data.row.original.lot_number?.toString() ?? "N/A",
          // "Exit Load": data.row.original.exit_load ?? "N/A",
          "Lot Sequence No":
            data.row.original.lot_sequence_number?.toString() ?? "N/A",
          "Lot Date": formatDate(data.row.original.created_at ?? ""),
          "Lot Units": data.row.original.lot_unit?.toString() ?? "N/A",
          "Purchased NAV": data.row.original.nav_value?.toString() ?? "N/A",
          "Holding Days": data.row.original.holding_days ?? "N/A",
          // "Capital Gain Tax Amount": data.row.original.cgt_Percentage ?? "N/A",
          // "Capital Gain Amount": data.row.original.cgt_amount ?? "N/A",
        };

        return (
          <>
            <ViewModal open={open} setOpen={setOpen} data={modalData} />
            <Box
              onClick={handleView}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.6,
                color: colorTokens.mainColor[1100],
                "&:hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
            >
              <Visibility sx={{ fontSize: "14px", fontWeight: 400 }} />
              <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
                View
              </Typography>
            </Box>
          </>
        );
      },
    },
  ];

export const UnitRedeemptionEntryImpactedLotsHeader: ColumnDef<UnitRedeemptionEntryLotSummary>[] =
  [
    {
      header: "Lot No.",
      accessorKey: "lot_number",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.lot_number}
          </Typography>
        );
      },
    },
    {
      header: "Purchase Date",
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
      header: "Days Held",
      accessorKey: "holding_days",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.holding_days}
          </Typography>
        );
      },
    },
    {
      header: "Purchase NAV",
      accessorKey: "purchased_nav_value",
      cell: (data) => {
        return (
          <Typography
            textAlign="right"
            width="85%"
            sx={{ fontSize: "14px", fontWeight: 400 }}
          >
            {data.row.original.purchased_nav_value}
          </Typography>
        );
      },
    },
    {
      header: "Previous Units",
      accessorKey: "previous_lot_unit",
      cell: (data) => {
        return (
          <Typography
            textAlign="right"
            width="85%"
            sx={{ fontSize: "14px", fontWeight: 400 }}
          >
            {data.row.original.previous_lot_unit.toLocaleString()}
          </Typography>
        );
      },
    },
    // {
    //   header: "Investment Amt",
    //   accessorKey: "investment_amt",
    //   cell: (data) => {
    //     return <Typography>{data.row.original.investment_amt}</Typography>;
    //   },
    // },
    // {
    //   header: "Current Units",
    //   accessorKey: "current_lot_unit",
    //   cell: (data) => {
    //     return <Typography align="center">{data.row.original.current_lot_unit}</Typography>;
    //   },
    // },
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
    // {
    //   header: "Base Sold Amt",
    //   accessorKey: "base_sold_amt",
    //   cell: (data) => {
    //     return <Typography>{data.row.original.base_sold_amt}</Typography>;
    //   },
    // },
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
    // {
    //   header: "Exit Load Amount",
    //   accessorKey: "exit_load_amt",
    //   cell: (data) => {
    //     return (
    //       <Typography
    //         textAlign="right"
    //         width="85%"
    //         sx={{ fontSize: "14px", fontWeight: 400 }}
    //       >
    //         {Number(
    //           data.row.original.exit_load_amt.toFixed(2)
    //         ).toLocaleString()}
    //       </Typography>
    //     );
    //   },
    // },
    {
      header: "Status",
      accessorKey: "gain_or_loss_status",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.gain_or_loss_status}
          </Typography>
        );
      },
    },
    // {
    //   header: "CGT",
    //   accessorKey: "cgt_pct",
    //   cell: (data) => {
    //     return (
    //       <Typography
    //         textAlign="right"
    //         width="85%"
    //         sx={{ fontSize: "14px", fontWeight: 400 }}
    //       >
    //         {data.row.original.cgt_pct * 100}
    //       </Typography>
    //     );
    //   },
    // },
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
      header: "Sold Amt",
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
      cell: (data) => {
        const [open, setOpen] = useState(false);
        const handleView = () => {
          setOpen(true);
        };
        const modalData: Record<string, string> = {
          "Lot ID": data.row.original.lot_id?.toString() ?? "N/A",
          "Lot Sequence ID":
            data.row.original.lot_sequence_id?.toString() ?? "N/A",
          "Lot Number": data.row.original.lot_number?.toString() ?? "N/A",
          "Lot Sequence Number":
            data.row.original.lot_sequence_number?.toString() ?? "N/A",

          "Purchase Date": data.row.original.purchase_date ?? "N/A",
          "Holding Days": data.row.original.holding_days?.toString() ?? "N/A",
          "Purchased NAV Value":
            data.row.original.purchased_nav_value?.toFixed(2).toString() ??
            "N/A",
          "Previous Lot Units":
            data.row.original.previous_lot_unit?.toString() ?? "N/A",

          "Investment Amount":
            data.row.original.investment_amt?.toFixed(2).toString() ?? "N/A",
          "Current Lot Units":
            data.row.original.current_lot_unit?.toString() ?? "N/A",

          "Redeemed Lot Units":
            data.row.original.redeemed_lot_units?.toString() ?? "N/A",

          "Base Sold Amt":
            data.row.original.base_sold_amt?.toFixed(2).toString() ?? "N/A",
          "Exit Load %":
            (data.row.original.exit_load_pct * 100).toString() ?? "N/A",
          "Exit Load Amount":
            data.row.original.exit_load_amt?.toFixed(2).toString() ?? "N/A",
          "Gain/Loss Status":
            data.row.original.gain_or_loss_status?.toString() ?? "N/A",
          "CGT Percentage":
            (data.row.original.cgt_pct * 100).toString() ?? "N/A",
          "CGT Amount":
            data.row.original.cgt_amt?.toFixed(2).toString() ?? "N/A",
          "Final Sold Amount":
            data.row.original.final_sold_amt?.toFixed(2).toString() ?? "N/A",
        };

        return (
          <>
            <ViewModal open={open} setOpen={setOpen} data={modalData} />
            <Box
              onClick={handleView}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.6,
                color: colorTokens.mainColor[1100],
                "&:hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
            >
              <Visibility sx={{ fontSize: "14px", fontWeight: 400 }} />
              <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
                View
              </Typography>
            </Box>
          </>
        );
      },
    },
  ];
