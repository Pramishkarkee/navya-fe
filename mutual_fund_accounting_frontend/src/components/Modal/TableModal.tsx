import React from "react";
import { Box, Modal, Typography, useTheme } from "@mui/material";
import ModalTable from "components/Table/ModalTable";
import ExportPDFButton from "components/Button/ExportPDFButton";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { sm: "90%", md: "90%", lg: "90%", xl: "80%" },
  bgcolor: "background.paper",
  borderRadius: "8px",
  p: 4,
};

interface ModalDataProps {
  open: boolean;
  data: any[];
  handleClose: any;
  id?: number;
  isExport?: boolean;
}

const TableModal = ({
  open,
  data,
  handleClose,
  id,
  isExport = false,
}: ModalDataProps) => {
  const theme = useTheme();
  const BASEURL = import.meta.env.VITE_BASE_URL;

  const totalDebit = data.reduce(
    (sum, row) => sum + (parseFloat(row.drAmt) || 0),
    0
  );
  const totalCredit = data.reduce(
    (sum, row) => sum + (parseFloat(row.crAmt) || 0),
    0
  );

  const ModalHeaders = [
    {
      header: "S. No",
      accessorKey: "sn",
    },
    {
      header: "Ledger Head",
      accessorKey: "ledgerHead",
      cell: (data) => {
        return (
          <Typography sx={{ mr: 2 }}>{data.row.original.ledgerHead}</Typography>
        );
      },
      footer: () => <Typography sx={{ fontWeight: 800 }}>Total</Typography>,
    },
    {
      header: "Debit",
      accessorKey: "drAmt",
      cell: (data) => (
        <Typography
          sx={{ display: "flex", justifyContent: "flex-end", width: "55px" }}
        >
          {data.row.original.drAmt
            ? Number(data.row.original.drAmt)
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, "$&,")
            : data.row.original.drAmt === 0
            ? "0.00"
            : ""}
        </Typography>
      ),
      footer: () => (
        <Typography
          sx={{
            fontWeight: 800,
            display: "flex",
            justifyContent: "flex-end",
            width: "56px",
            mr: 5,
          }}
        >
          {totalDebit
            ? totalDebit.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
            : totalDebit === 0
            ? "0.00"
            : ""}
        </Typography>
      ),
    },
    {
      header: "Credit",
      accessorKey: "crAmt",
      cell: (data) => (
        <Typography
          sx={{ display: "flex", justifyContent: "flex-end", width: "52px" }}
        >
          {data.row.original.crAmt
            ? Number(data.row.original.crAmt)
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, "$&,")
            : data.row.original.crAmt === 0
            ? "0.00"
            : ""}
        </Typography>
      ),
      footer: () => (
        <Typography
          sx={{
            fontWeight: 800,
            display: "flex",
            justifyContent: "flex-end",
            width: "52px",
            mr: 5,
          }}
        >
          {totalCredit
            ? totalCredit.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
            : totalCredit === 0
            ? "0.00"
            : ""}
        </Typography>
      ),
    },
    {
      header: "Description",
      accessorKey: "desc",
    },
  ];

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography
              id="export-modal-title"
              variant="h6"
              sx={{
                fontSize: "18px",
                fontWeight: 600,
                lineHeight: "19px",
                color: "#212121",
                textAlign: "center",
                width: "max-content",
                borderBottom: `1px solid ${theme.palette.secondary.main}`,
                mb: 2,
              }}
            >
              Journal Entries
            </Typography>
            {isExport && (
              <ExportPDFButton
                baseURL={`${BASEURL}/accounting/api/v1/accounting/journals/${id}/formatted/export/?export_format=pdf`}
              />
            )}
          </Box>
          <ModalTable columns={ModalHeaders} data={data} />
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default TableModal;
