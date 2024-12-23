/* eslint-disable react-hooks/rules-of-hooks */
import {
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { colorTokens } from "../../../theme";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import RoundedButton from "components/Button/Button";

type StockDataHeaders = {
  code: number;
  name: string;
  max_threshold: string;
  min_threshold: string
};

export const SectorTable: ColumnDef<StockDataHeaders>[] = [
  // {
  //   header: "S.No",
  //   accessorKey: "SN",
  //   cell: (data) => {
  //     return (
  //       <Box>
  //         <Typography >{data.row.index +  1}</Typography>
  //       </Box>
  //     )
  //   },
  // },
  {
    header: "Sector Id",
    accessorKey: "code",
    cell: (data) => {
      return <Typography sx={{ fontSize: "14px", fontWeight: 400, ml: 2 }} >
        {data.row.original.code}
      </Typography>;
    },
  },
  {
    header: "Sector Name",
    accessorKey: "name",
    cell: (data) => {
      return (
        <Typography sx={{ fontSize: "14px", fontWeight: 400, textAlign: "center" }}>
          {data.row.original.name}
        </Typography>
      );
    },
  },
  // {
  //   header: "Minimum Investment Threshold",
  //   accessorKey: "min_threshold",
  //   cell: (data) => {
  //     return <Typography sx={{ fontSize: "14px", fontWeight: 400, ml: 2 }} >
  //       {data.row.original.min_threshold || "-"}
  //     </Typography>;
  //   },
  // },
  // {
  //   header: "Maximum Investment Threshold",
  //   accessorKey: "max_threshold",
  //   cell: (data) => {
  //     return <Typography sx={{ fontSize: "14px", fontWeight: 400, ml: 2 }} >
  //       {data.row.original.max_threshold || "-"}
  //     </Typography>;
  //   },
  // },
  // {
  //   header: "Actions",
  //   accessorKey: "actions",
  //   cell: (data) => {
  //     const [open, setOpen] = useState<boolean>(false);

  //     const theme = useTheme();

  //     const [sector, setSector] = useState(`${data?.row?.original?.name}`);
  //     const [sectorId, setSectorId] = useState(`${data?.row?.original?.code}`);

  //     const [editSector, setEditSector] = useState<boolean>(false);
  //     const [editSectorId, setEditSectorId] = useState<boolean>(false);

  //     const ModalData = {
  //       "Sector Name": data?.row?.original?.name,
  //       "Sector ID": data?.row?.original?.code,
  //     };

  //     return (
  //       <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
  //         <Button
  //           variant="text"
  //           sx={{
  //             display: "flex",
  //             flexDirection: "row",
  //             justifyContent: "center",
  //             alignItems: "center",
  //             gap: 1,
  //             color: colorTokens.mainColor[1100],
  //             fontSize: "14px",
  //           }}
  //           onClick={() => {
  //             setOpen(true);
  //           }}
  //         >
  //           <EditIcon sx={{ fontSize: "1rem" }} />
  //           Edit
  //         </Button>

  //         {open && (
  //           <Modal
  //             open={open}
  //             onClose={() => {
  //               setOpen(false);
  //               setEditSector(false);
  //               setEditSectorId(false);
  //             }}
  //             aria-labelledby="modal-modal-title"
  //             aria-describedby="modal-modal-description"
  //           >
  //             <Box
  //               sx={{
  //                 position: "absolute" as "absolute",
  //                 top: "50%",
  //                 left: "50%",
  //                 transform: "translate(-50%, -50%)",
  //                 width: "60%",
  //                 bgcolor: "background.paper",
  //                 borderRadius: "8px",
  //                 p: 4,
  //               }}
  //             >
  //               <HeaderDesc title="Update Sector Detail" />
  //               <Grid
  //                 container
  //                 sx={{ mt: 2.5, columnGap: { xs: 4, lg: 6 }, rowGap: 1.5 }}
  //               >
  //                 {Object.entries(ModalData).map(([key, value]) => (
  //                   <Grid item xs={5.5} key={key}>
  //                     {key === "Sector Name" ? (
  //                       <Typography
  //                         sx={{
  //                           display: "flex",
  //                           justifyContent: "space-between",
  //                           alignItems: "center",
  //                         }}
  //                       >
  //                         <span style={{ fontWeight: "bold" }}>{key} </span>
  //                         {!editSector ? (
  //                           <Box sx={{ display: "flex" }}>
  //                             <Typography
  //                               sx={{
  //                                 display: "flex",
  //                                 alignItems: "center",
  //                                 gap: 1,
  //                                 color: theme.palette.secondary[700],
  //                               }}
  //                             >
  //                               {" "}
  //                               {value}
  //                             </Typography>
  //                             <Button
  //                               onClick={() => setEditSector(true)}
  //                               sx={{
  //                                 padding: "6px 0",
  //                                 minWidth: "0",
  //                                 color: theme.palette.secondary[700],
  //                               }}
  //                             >
  //                               <EditIcon sx={{ fontSize: "16px" }} />
  //                             </Button>
  //                           </Box>
  //                         ) : (
  //                           <TextField
  //                             size="small"
  //                             value={sector}
  //                             onChange={(
  //                               event: React.ChangeEvent<HTMLInputElement>
  //                             ) => setSector(event.target.value)}
  //                           />
  //                         )}
  //                       </Typography>
  //                     ) : key === "Sector ID" ? (
  //                       <Typography
  //                         sx={{
  //                           display: "flex",
  //                           justifyContent: "space-between",
  //                           alignItems: "center",
  //                         }}
  //                       >
  //                         <span style={{ fontWeight: "bold" }}>{key} </span>
  //                         {!editSectorId ? (
  //                           <Box sx={{ display: "flex" }}>
  //                             <Typography
  //                               sx={{
  //                                 display: "flex",
  //                                 alignItems: "center",
  //                                 gap: 1,
  //                                 color: theme.palette.secondary[700],
  //                               }}
  //                             >
  //                               {" "}
  //                               {value}
  //                             </Typography>
  //                             <Button
  //                               onClick={() => setEditSectorId(true)}
  //                               sx={{
  //                                 padding: "6px 0",
  //                                 minWidth: "0",
  //                                 color: theme.palette.secondary[700],
  //                               }}
  //                             >
  //                               <EditIcon sx={{ fontSize: "16px" }} />
  //                             </Button>
  //                           </Box>
  //                         ) : (
  //                           <TextField
  //                             size="small"
  //                             value={sectorId}
  //                             onChange={(
  //                               event: React.ChangeEvent<HTMLInputElement>
  //                             ) => setSectorId(event.target.value)}
  //                           />
  //                         )}
  //                       </Typography>
  //                     ) : (
  //                       <Typography
  //                         sx={{
  //                           display: "flex",
  //                           justifyContent: "space-between",
  //                         }}
  //                       >
  //                         <span style={{ fontWeight: "bold" }}>{key} </span>
  //                         <span style={{ color: theme.palette.secondary[700] }}>
  //                           {" "}
  //                           {value}{" "}
  //                         </span>
  //                       </Typography>
  //                     )}
  //                   </Grid>
  //                 ))}
  //               </Grid>
  //               <Box mt={1}>
  //                 <RoundedButton
  //                   title1="Update Sector"
  //                   onClick1={() => console.log("sector update")}
  //                 />
  //               </Box>
  //             </Box>
  //           </Modal>
  //         )}
  //       </Box>
  //     );
  //   },
  // },
];
