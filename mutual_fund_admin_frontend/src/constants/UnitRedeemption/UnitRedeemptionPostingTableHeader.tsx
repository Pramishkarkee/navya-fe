import { ColumnDef } from "@tanstack/react-table";
import { Box, Typography } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { IndeterminateCheckbox } from "components/Table/PostingTable";
import { useState } from "react";
import ViewModal from "components/Modal/ViewModal";
import { colorTokens } from "../../theme";
import DateFormatter from "utils/DateFormatter";

type UnitRedeemptionPosting = {
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
  total_investment_amount: number;
  contact_number: string;
  share_holder_number: string;
  created_at: string;
  total_current_value: number;
  total_gain_loss_status: string;
  total_net_payable_amount: string;
  total_capital_gains_amount: number;
  total_capital_gain_tax_amount: number;
  net_payable_before_tax: number;
  is_approved: string;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const UnitRedeemptionPostingHeader: ColumnDef<UnitRedeemptionPosting>[] =
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
      header: "Req No.",
      accessorKey: "reqNo",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.id}
          </Typography>
        );
      },
    },
    {
      header: "Applied Date",
      accessorKey: "appliedDate",
      cell: (data) => {
        const formattedDate = DateFormatter.format(
          data.row.original.created_at
        );
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {formattedDate}
          </Typography>
        );
      },
    },
    {
      header: "BOID",
      accessorKey: "boid",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.boid_number}
          </Typography>
        );
      },
    },
    {
      header: "Redeemed Units",
      accessorKey: "name",
      cell: (data) => {
        return (
          <Typography
            textAlign="right"
            width="55%"
            sx={{ fontSize: "14px", fontWeight: 400 }}
          >
            {Number(data.row.original.units_sold)
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
            textAlign="right"
            width="55%"
            sx={{ fontSize: "14px", fontWeight: 400 }}
          >
            {Number(data.row.original.total_capital_gain_tax_amount)
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
            textAlign="right"
            width="55%"
            sx={{ fontSize: "14px", fontWeight: 400 }}
          >
            {Number(data.row.original.total_exit_load)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
          </Typography>
        );
      },
    },
    {
      header: "Total Amount",
      accessorKey: "total_net_payable_amount",
      cell: (data) => {
        return (
          <Typography
            textAlign="right"
            width="55%"
            sx={{ fontSize: "14px", fontWeight: 400 }}
          >
            {Number(data?.row?.original?.total_net_payable_amount)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
          </Typography>
        );
      },
    },
    // {
    //   header: "Entry By",
    //   accessorKey: "entry_by",
    //   cell: (data) => {
    //     return (
    //       <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
    //         {data.row.original.entry_by}
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
        };
        const modalData: Record<string, string> = {
          "Req id": data?.row?.original?.id?.toString() ?? "N/A",
          "Exit Load":
            data?.row?.original?.total_exit_load?.toString() ?? "N/A",
          BOID: data?.row?.original?.boid_number,
          "Net Payable Before CGT":
            data?.row?.original?.net_payable_before_tax?.toString() ?? "N/A",
          "Created Date": formatDate(data?.row?.original?.created_at),
          "Gain/Loss Status":
            data?.row?.original?.total_gain_loss_status.toString() ?? "N/A",
          "Redeemed Units": data?.row?.original?.units_sold.toString() ?? "N/A",
          "Total Capital Gain Amount":
            data?.row?.original?.total_capital_gains_amount.toString() ?? "N/A",

          "Total Investment Amount":
            data?.row?.original?.total_investment_amount.toString() ?? "N/A",
          "Total Capital Gain Tax":
            data?.row?.original?.total_capital_gain_tax_amount.toString() ??
            "N/A",
          "Total Current Value":
            data?.row?.original?.total_current_value.toString() ?? "N/A",
          "Net Payable Amount After Tax":
            data?.row?.original?.total_net_payable_amount.toString() ?? "N/A",
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
