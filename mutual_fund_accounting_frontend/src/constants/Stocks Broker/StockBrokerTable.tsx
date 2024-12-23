import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { ColumnDef } from "@tanstack/react-table";
import ViewModal from "components/Modal/ViewModal";
import { Visibility } from "@mui/icons-material";
import { colorTokens } from "../../theme";
import { useState } from "react";
import DateFormatter from "utils/DateFormatter";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

type StockBrokerEntry1 = {
  schema_name: string;
  ledger_head_payable: string;
  ledger_head_receiveable: string;
  actions: any;
};

export const StockBrokerTableEntryHeader1: ColumnDef<StockBrokerEntry1>[] = [
  {
    header: "Schema Name",
    accessorKey: "schema_name",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
          {data.row.original.schema_name || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Ledger Head Payable",
    accessorKey: "ledger_head_payable",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
          {data.row.original.ledger_head_payable || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Ledger Head Receiveable",
    accessorKey: "ledger_head_receiveable",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
          {data.row.original.ledger_head_receiveable || "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: (data) => {
      const [openView, setOpenView] = useState(false);
      const [openEdit, setOpenEdit] = useState(false);
      const [openDelete, setOpenDelete] = useState(false);
      const [selectedItem, setSelectedItem] = useState(null);

      const handleEdit = (item) => {
        setSelectedItem(item);
        setOpenEdit(true);
      };

      const handleDelete = (item) => {
        setSelectedItem(item);
        setOpenDelete(true);
      };

      const handleClose = () => {
        setOpenEdit(false);
        setOpenDelete(false);
      };

      const handleEditSave = () => {
        handleClose();
      };

      const handleDeleteConfirm = () => {
        handleClose();
      };

      const modalData: Record<string, string> = {
        // "Schema Name": itemSchemaName,
      };

      return (
        <>
          <ViewModal open={openView} setOpen={setOpenView} data={modalData} />
          <Dialog open={openEdit} onClose={handleClose}>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogContent></DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleEditSave} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openDelete} onClose={handleClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this item?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirm} color="primary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 0.6 }}>
            <Button
              onClick={() => handleEdit(data.row.original)}
              variant="text"
              color="primary"
            >
              <EditOutlinedIcon sx={{ color: "#3E2723" }} />
            </Button>
            <Button
              onClick={() => handleDelete(data.row.original)}
              variant="text"
              color="primary"
            >
              <DeleteOutlineOutlinedIcon />
            </Button>
          </Box>
        </>
      );
    },
  },
];
