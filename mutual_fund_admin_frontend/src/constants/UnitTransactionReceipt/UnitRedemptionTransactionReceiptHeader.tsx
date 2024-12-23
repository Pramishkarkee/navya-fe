/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";

import { Box, Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { colorTokens } from "../../theme";
import { Visibility } from "@mui/icons-material";
// import Receipt from "../../assets/Receipt.svg";
// import SuccessBar from "components/Snackbar/SuccessBar";
import ViewModal from "components/Modal/ViewModal";
import DateFormatter from "utils/DateFormatter";
// import Auth from "utils/Auth";

type UnitRedemptionTransactionHeaders = {
  id: number;
  boid_number: string;
  units_sold: string;
  reqNo: number;
  boid: number;
  name: string;
  appliedUnits: number;
  nav: number;
  amount: number;
  t_id: number;
  actions: any;
  full_name: string;
  email: string;
  distribution_center: string;
  total_exit_load: string;
  applied_units: string;
  total_investment_amount: string;
  contact_number: string;
  share_holder_number: string;
  purchased_nav_value: number;
  created_at: string;
  total_current_value: number;
  total_gain_loss_status: string;
  total_net_payable_amount: number;
  total_capital_gains_amount: string;
  total_capital_gain_tax_amount: string;
  net_payable_before_tax: string;
  is_approved: string;
  redeemed_nav: number;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const UnitRedemptionTransactionReceiptHeader: ColumnDef<UnitRedemptionTransactionHeaders>[] =
  [
    {
      header: "Req No.",
      accessorKey: "reqNo",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.id}</Typography>;
      },
    },
    {
      header: "Applied Date",
      accessorKey: "appliedDate",
      cell: (data) => {
        const formattedDate = DateFormatter.format(
          data.row.original.created_at
        );
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{formattedDate}</Typography>;
      },
    },
    {
      header: "BOID",
      accessorKey: "boid",
      cell: (data) => {
        return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.boid_number}</Typography>;
      },
    },
    {
      header: "Redeemed Units",
      accessorKey: "name",
      cell: (data) => {
        return (
          <Typography
            sx={{ width: { sm: "100%", md: "100%", lg: "70%" }, fontSize: "14px", fontWeight: 400 }}
            textAlign={"right"}
          >
            {Number(data.row.original.units_sold)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
          </Typography>
        );
      },
    },
    {
      header: "Redeemed NAV",
      accessorKey: "redeemed_nav",
      cell: (data) => {
        return (
          <Typography
            sx={{ width: { sm: "100%", md: "100%", lg: "70%" }, fontSize: "14px", fontWeight: 400 }}
            textAlign={"right"}
          >
            {data.row.original.redeemed_nav}
          </Typography>
        );
      },
    },
    {
      header: "Total Amount",
      accessorKey: "total_investment_amount",
      cell: (data) => {
        return (
          <Typography
            sx={{ width: { sm: "100%", md: "100%", lg: "70%" }, fontSize: "14px", fontWeight: 400 }}
            textAlign={"right"}
          >
            {Number(data.row.original.total_investment_amount)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
          </Typography>
        );
      },
    },
    {
      header: "Exit Load",
      accessorKey: "exitload",
      cell: (data) => {
        return (
          <Typography
            sx={{ width: { sm: "100%", md: "100%", lg: "70%" }, fontSize: "14px", fontWeight: 400 }}
            textAlign={"right"}
          >
            {Number(data.row.original.total_exit_load)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
          </Typography>
        );
      },
    },
    {
      header: "Capital Gain Tax",
      accessorKey: "total_capital_gain_tax_amount",
      cell: (data) => {
        return (
          <Typography
            sx={{ width: { sm: "100%", md: "100%", lg: "70%" }, fontSize: "14px", fontWeight: 400 }}
            textAlign={"right"}
          >
            {Number(data.row.original.total_capital_gain_tax_amount)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
          </Typography>
        );
      },
    },
    {
      header: "Net Payable after Tax",
      accessorKey: "total_net_payable_amount",
      cell: (data) => {
        return (
          <Typography
            sx={{ width: { sm: "100%", md: "100%", lg: "70%" }, fontSize: "14px", fontWeight: 400 }}
            textAlign={"right"}
          >
            {Number(data.row.original.total_net_payable_amount)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
          </Typography>
        );
      },
    },

    // {
    //   header: "Applied Units",
    //   accessorKey: "appliedUnits",
    //   cell: (data) => {
    //     return (
    //       <Typography width="70%" textAlign={"right"}>
    //         {Number(data.row.original.units_sold)
    //           .toFixed(2)
    //           .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
    //       </Typography>
    //     );
    //   },
    // },

    {
      header: "Actions",
      accessorKey: "actions",
      cell: (data) => {
        const [open, setOpen] = useState(false);

        const handleView = () => {
          setOpen(true);
          // console.log(data)
        };
        const modalData: Record<string, string> = {
          // "Req id": data.row.id?.toString() ?? "N/A",
          // "Exit Load": data.row.original.total_exit_load?.toString() ?? "N/A",
          // BOID: data.row.original.boid_number ?? "N/A",
          // "Created Date": formatDate(data.row.original.created_at ?? ""),
          // "Redeemed Units": data.row.original.units_sold?.toString() ?? "N/A",

          // "Total Amount":
          //   data.row.original.total_investment_amount?.toString() ?? "N/A",
          // "Total Current Value":
          //   data.row.original.total_current_value?.toString() ?? "N/A",
          // "Total Gain Loss Status":
          //   data.row.original.total_gain_loss_status ?? "N/A",
          // "Total Net Payable Amount":
          //   data.row.original.total_net_payable_amount?.toString() ?? "N/A",
          // "Total Capital Gain Amount":
          //   data.row.original.total_capital_gains_amount?.toString() ?? "N/A",

          // "Is Approved": data.row.original.is_approved ?? "N/A",
          "Req id": data?.row?.original?.id?.toString() ?? "N/A",
          "Exit Load":
            data?.row?.original?.total_exit_load?.toString() ?? "N/A",
          BOID: data?.row?.original?.boid_number ?? null,
          "Net Payable Before CGT":
            data?.row?.original?.net_payable_before_tax?.toString() ?? "N/A",
          "Created Date": formatDate(data?.row?.original?.created_at) ?? "N/A",
          "Gain/Loss Status":
            data?.row?.original?.total_gain_loss_status?.toString() ?? "N/A",
          "Redeemed Units":
            data?.row?.original?.units_sold?.toString() ?? "N/A",
          "Total Capital Gain Amount":
            data?.row?.original?.total_capital_gains_amount?.toString() ??
            "N/A",

          "Total Investment Amount":
            data?.row?.original?.total_investment_amount?.toString() ?? "N/A",
          "Total Capital Gain Tax":
            data?.row?.original?.total_capital_gain_tax_amount?.toString() ??
            "N/A",
          "Total Current Value":
            data?.row?.original?.total_current_value?.toString() ?? "N/A",
          "Net Payable Amount After Tax":
            data?.row?.original?.total_net_payable_amount?.toString() ?? "N/A",
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
              <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>View</Typography>
            </Box>
          </>
        );
      },
    },
  ];