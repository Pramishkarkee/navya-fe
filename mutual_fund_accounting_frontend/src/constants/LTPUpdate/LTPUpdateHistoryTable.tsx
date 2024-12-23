/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Typography, } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";


type LTPUpdateHistory = {
    id: any;
    symbol: string;
    ltp: string;
    open_price: string;
    high_price: string;
    low_price: string;
    total_trades: string;

};

export const LTPUpdateHistoryTableEntryHeader: ColumnDef<LTPUpdateHistory>[] = [
    // {
    //     header: "ID",
    //     accessorKey: "id",
    //     cell: (data) => {
    //         return (
    //             <Typography sx={{ fontSize: "0.85rem", textAlign: "left" }}>
    //                 {data.row.original.id}
    //             </Typography>
    //         );
    //     },
    // },

    {
        header: "Symbol",
        accessorKey: "symbol",
        cell: (data) => {
            return (
                <Typography sx={{ fontSize: "14px", textAlign: "left", fontWeight: "400" }}>
                    {data.row.original.symbol || 'N/A'}
                </Typography>
            );
        },
    },
    {
        header: "LTP",
        accessorKey: "ltp",
        cell: (data) => {
            return (
                <Typography sx={
                    {
                        textAlign: "right",
                        fontWeight: "400px",
                        fontSize: "14px",
                        //  width: "max-content"
                        width: "30px"
                    }}>
                    {Number(data.row.original.ltp).toLocaleString() || 'N/A'}
                </Typography>
            );
        },
    },

    {
        header: "Open Price",
        accessorKey: "open_price",
        cell: (data) => {
            return (
                <Typography
                    sx={{
                        fontSize: "14px",
                        fontWeight: "400px",
                        // width: "100px",
                        textAlign: "right",
                        width: "68px"
                    }}
                >
                    {Number(data.row.original.open_price).toLocaleString() || 'N/A'}
                </Typography>
            );
        },
    },

    {
        header: "High Price",
        accessorKey: "high_price",
        cell: (data) => {
            return (
                <Typography
                    sx={{
                        fontSize: "14px",
                        fontWeight: "400px",
                        // display: "flex",
                        textAlign: "right",
                        width: "68px"
                    }}
                >
                    {Number(data.row.original.high_price).toLocaleString() || 'N/A'}
                </Typography>
            );
        },
    },

    {
        header: "Low Price",
        accessorKey: "low_price",
        cell: (data) => {
            return (
                <Typography
                    sx={{
                        fontSize: "14px",
                        fontWeight: "400px",
                        // display: "flex",
                        textAlign: "right",
                        width: "64px"
                    }}
                >
                    {/* {Number(data.row.original.effective_rate).toLocaleString()} */}
                    {data.row.original.low_price
                        ? data.row.original.low_price.toLocaleString()
                        : 0}
                </Typography>
            );
        },
    },

    {
        header: "Total Trades",
        accessorKey: "total_trades",
        cell: (data) => {
            return (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "65%",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: "400px",
                            textAlign: "right",
                            width: "50px",
                        }}
                    >
                        {Number(data.row.original.total_trades).toLocaleString() || 'N/A'}
                    </Typography>
                </Box>
            );
        },
    },


];
