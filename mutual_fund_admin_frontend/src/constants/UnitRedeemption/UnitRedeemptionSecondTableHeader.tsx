import { ColumnDef } from "@tanstack/react-table";
import { Typography, Box } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";

type UnitRedeemptionEntry2 = {
  SN: number;
  lotNo: number;
  lotUnit: number;
  purchaseDate: string;
  redeemUnit: number;
  holdingDate: string;
  actions: any;
};
export const UnitRedeemptionEntryHeader2: ColumnDef<UnitRedeemptionEntry2>[] = [
  {
    header: "S.No.",
    accessorKey: "SN",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.SN}</Typography>;
    },
  },
  {
    header: "Lot Number",
    accessorKey: "lotNo",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.lotNo}</Typography>;
    },
  },
  {
    header: "Lot Unit",
    accessorKey: "lotUnit",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.lotUnit}</Typography>;
    },
  },
  {
    header: "Purchase Date",
    accessorKey: "purchaseDate",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.purchaseDate}</Typography>;
    },
  },
  {
    header: "Redeem Unit",
    accessorKey: "redeemUnit",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.redeemUnit}</Typography>;
    },
  },
  {
    header: "Holding Date",
    accessorKey: "holdingDate",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>{data.row.original.holdingDate}</Typography>;
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: () => {
      return (
        <Box>
          <Box>
            <VisibilityIcon
              sx={{
                fontSize: "14px",
                // color: theme.palette.primary.fullDarkmainColor,
              }}
            />
            <EditIcon
              sx={{
                fontSize: "14px",
                // color: theme.palette.secondary.baseGray,
              }}
            />
            <DeleteOutlineSharpIcon
              sx={{
                fontSize: "14px",
                // color: theme.palette.secondary.main
              }}
            />
          </Box>
        </Box>
      );
    },
  },
];
