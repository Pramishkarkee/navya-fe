import { Box, Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { IndeterminateCheckbox } from "components/Table/PostingTable";

type UnrealizedTableData = {
  stock_symbol: string;
  units: number;
  effective_rate: string;
  investment_amount: string;
  close_price: string;
  market_value: string;
  unrealized_gain_loss: string;
  business_date: string;
  stock_type: string;
  stock_name: string;
};

export const UnrealizedGainLossTableHeader: ColumnDef<UnrealizedTableData>[] = [
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
    header: "Business Date",
    accessorKey: "business_date",
    cell: (data) => {
      return <Typography sx={{ }} >{data.row.original.business_date || 'N/A'}</Typography>;
    },
    footer: () => {
      return (
        <Box
          sx={{
            fontWeight: 600,
            fontSize: "0.85rem",
            display: "flex",
            // justifyContent: "flex-end",
            // width: "117px",
          }}
        >
          Total
        </Box>
      );
    },
  },
  {
    header: "Stock Type",
    accessorKey: "stock_type",
    cell: (data) => {
      return <Typography sx={{fontSize:"14px" , fontWeight:400 , textTransform:'capitalize'}}>{data.row.original.stock_type || 'N/A'}</Typography>;
    },
  },
  {
    header: "Symbol",
    accessorKey: "stock_symbol",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight:400 }}>{data.row.original.stock_symbol || 'N/A'}</Typography>;
    },
  },
  // {
  //   header:"Name",
  //   accessorKey:"stock_name",
  //   cell:(data)=>{
  //     return <Typography sx={{ textAlign: "left", fontSize:"14px" , fontWeight:400  }}>
  //       {data.row.original.stock_name || 'N/A'}
  //     </Typography>
  //   }
  // },
  {
    header: "Units",
    accessorKey: "units",
    cell: (data) => {
      return (

        <Typography sx={{fontSize:"14px" , fontWeight:400  }}>

          {Number(data?.row?.original?.units)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,") || 'N/A'}
        </Typography>
      );
    },
  },
  {
    header: "Market Price",
    accessorKey: "close_price",
    cell: (data) => {
      return (
        <Typography sx={{ textAlign: "right", width:"75px",fontSize:"14px" , fontWeight:400 }}>
          {Number(data?.row?.original?.close_price)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,") || 'N/A'}
        </Typography>
      );
    },
  },
  {
    header: "Market Value",
    accessorKey: "market_value",
    cell: (data) => {
      return (
        <Typography sx={{ textAlign: "right", width: "75px", fontSize: "14px", fontWeight: 400 }}>
          {Number(data?.row?.original?.market_value)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,") || 'N/A'}
        </Typography>
      );
    },
    footer : ({table})=>{
      const totalMarketValue = table.getRowModel().rows.reduce((sum, row) => (sum + (parseFloat(row.original.market_value) || 0)), 0);
      return (
        <Typography
          sx={{
            fontSize: "0.85rem",
            textAlign: "right",
            fontWeight: "bold",
            width: "75px",
          }}
        >
          {totalMarketValue.toLocaleString(undefined,{
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      );
    }
  },
  {
    header: "Cost Price",
    accessorKey: "effective_rate",
    cell: (data) => {
      return (

        <Typography sx={{ textAlign: "right" ,fontSize:"14px" , fontWeight:400, mx:3, maxWidth:"0px" }}>

          {Number(data?.row?.original?.effective_rate)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,") || 'N/A'}
        </Typography>
      );
    },
  },
  {
    header: "Investment",
    accessorKey: "investment_amount",
    cell: (data) => {
      return (
        <Typography sx={{ textAlign: "right",fontSize:"14px" ,fontWeight:400, maxWidth:"80px" }}>
          {Number(data?.row?.original?.investment_amount)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,") || 'N/A'}
        </Typography>
      );
    },
    footer: ({ table }) => {
      const totalUnits = table.getRowModel().rows.reduce((sum, row) => (sum + (parseFloat(row.original.investment_amount) || 0)), 0);
      return (
        <Typography
          sx={{
            fontSize: "0.85rem",
            // textAlign: "right",
            fontWeight: "bold",
            ml:2.5 ,
            // width: "63px",
          }}
        >
        {totalUnits.toLocaleString(undefined,{
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        </Typography>
      );
    },
  },
  {
    header: "Unrealized Gain/(Loss)",
    accessorKey: "unrealized_gain_loss",
    cell: (data) => {
      const gainLossAmount =
        Number(data?.row?.original?.market_value) -
        Number(data?.row?.original?.investment_amount);
      return (
        <Typography sx={{ textAlign: "right", fontSize:"14px" , fontWeight:400, maxWidth:'130px' }}>
          {gainLossAmount > 0
            ? `${gainLossAmount
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`

            : gainLossAmount < 0
               ? `(${Math.abs(gainLossAmount)
                 .toFixed(2)
                 .replace(/\d(?=(\d{3})+\.)/g, "$&,")})`
              : gainLossAmount}
          {/* ({data.row.original.unrealized_gain_loss}) */}
        </Typography>
      );
    },
    footer: ({ table }) => {
      const totalGainLoss = table.getRowModel().rows.reduce((sum, row) => {
        const gainLossAmount =
          Number(row.original.market_value) - Number(row.original.investment_amount);
        return sum + gainLossAmount;
      }, 0);
      return (
        <Typography
          sx={{
            fontSize: "0.85rem",
            textAlign: "right",
            fontWeight: "bold",
            width: "130px",
          }}
        >
          {totalGainLoss.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      );
    },
  },
];
