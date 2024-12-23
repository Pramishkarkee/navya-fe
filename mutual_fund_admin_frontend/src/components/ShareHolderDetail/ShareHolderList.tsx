// import { Typography, Box, Button } from "@mui/material";
// import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
// import { ColumnDef } from "@tanstack/react-table";
// import ViewModal from "components/Modal/ViewModal";
// import {
//   DocumentScanner,
//   DocumentScannerOutlined,
//   Visibility,
// } from "@mui/icons-material";
// import { colorTokens } from "../../theme";
// import { useState } from "react";
// import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
// import { Link } from "react-router-dom";
// import Auth from "utils/Auth";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import Receipt from "../../assets/Receipt.svg";
// import ViewShareHolderDetails from "../../pages/Holder Management/ShareHolderInformation/ShareHolderDetail"; // Import the new component

// type ShareHolderDetail = {
//   id: number;
//   full_name: string;
//   boid_no: number;
//   share_holder_number: number;
//   total_units: number;
//   phone: number;
//   total_investement: number;
//   citizen_file_path: string;
//   actions: any;
// };

// export const ShareHolderDetailHeader: ColumnDef<ShareHolderDetail>[] = [
//   {
//     header: "Name",
//     accessorKey: "full_name",
//     cell: (data) => {
//       return <Typography>{data.row.original.full_name}</Typography>;
//     },
//   },
//   {
//     header: "BOID",
//     accessorKey: "boid_no",
//     cell: (data) => {
//       return <Typography>{data.row.original.boid_no}</Typography>;
//     },
//   },
//   {
//     header: "Shareholder Number",
//     accessorKey: "share_holder_number",
//     cell: (data) => {
//       return <Typography>{data.row.original.share_holder_number}</Typography>;
//     },
//   },
//   {
//     header: "Phone Number",
//     accessorKey: "phone",
//     cell: (data) => {
//       return <Typography>{data.row.original.phone}</Typography>;
//     },
//   },
//   {
//     header: "Actions",
//     accessorKey: "actions",
//     cell: (data) => {
//     const [successBarOpen, setSuccessBarOpen] = useState(false);
//     const [showViewModal, setShowViewModal] = useState(false);
//     const [selectedShareHolder, setSelectedShareHolder] = useState(null);

//       const handleView = (data) => {
//         setSelectedShareHolder(data.row.original);
//         setShowViewModal(true);
//       };

//       const handleReceipt = () => {
//         const anchor = document.createElement("a");
//         document.body.appendChild(anchor);
//         const file = `https://api-mf.navyaadvisors.com/sip-up/api/v1/sip/generate-report-file/${data.row.original.sip_identifier}/`;


//         const headers = new Headers();
//         headers.append("Authorization", `Bearer ${Auth.getAccessToken()}`);

//         fetch(file, { headers })
//           .then((response) => {
//             return response.blob();
//           })
//           .then((blobby) => {
//             console.log("blobby", blobby);
//             const objectUrl = window.URL.createObjectURL(blobby);

//             anchor.target = "_blank";
//             anchor.href = objectUrl;
//             anchor.download = `Unit Receipt ${data?.row?.original?.id}.pdf`;
//             anchor.click();

//             window.URL.revokeObjectURL(objectUrl);
//           })
//           .then(() => setSuccessBarOpen(true));
//       };

//       return (
//         <>
//         <Box>
//           <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
//             <SuccessBar
//               snackbarOpen={successBarOpen}
//               setSnackbarOpen={setSuccessBarOpen}
//               message="Downloaded Successfully"
//             />
//             <Box
//               onClick={() => handleView(data)}
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//                 gap: 0.6,
//                 color: colorTokens.mainColor[1100],
//                 "&:hover": {
//                   textDecoration: "underline",
//                   cursor: "pointer",
//                 },
//               }}
//             >
//               <Visibility sx={{ fontSize: "0.9rem" }} />
//               <Typography sx={{ fontSize: "1rem" }}>View</Typography>
//             </Box>
//             <Box
//               onClick={handleReceipt}
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 gap: 0.5,
//                 alignItems: "center",
//                 color: colorTokens.mainColor[1100],
//                 "&:hover": {
//                   textDecoration: "underline",
//                   cursor: "pointer",
//                 },
//               }}
//             >
//               <img src={Receipt} alt="Reciept Icon" />
//               <Typography>Receipt</Typography>
//             </Box>
//           </Box>
//           <Box>
//             {selectedShareHolder && (
//               <ViewShareHolderDetails id={selectedShareHolder.id} />
//             )}
//           </Box>
//         </Box>
//         </>
//       );
//     },
//   },
// ];



// // import { Typography, Box, Button } from "@mui/material";
// // import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
// // import { ColumnDef } from "@tanstack/react-table";
// // import ViewModal from "components/Modal/ViewModal";
// // import {
// //   DocumentScanner,
// //   DocumentScannerOutlined,
// //   Visibility,
// // } from "@mui/icons-material";
// // import { colorTokens } from "../../theme";
// // import { useState } from "react";
// // import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
// // import { Link } from "react-router-dom";
// // import Auth from "utils/Auth";
// // import SuccessBar from "components/Snackbar/SuccessBar";
// // import Receipt from "../../assets/Receipt.svg";

// // type ShareHolderDetail = {
// //   id: number;
// //   full_name: string;
// //   boid_no: number;
// //   share_holder_number: number;
// //   total_units: number;
// //   phone: number;
// //   total_investement: number;
// //   citizen_file_path: string;
// //   actions: any;
// // };

// // export const ShareHolderDetailHeader: ColumnDef<ShareHolderDetail>[] = [
// //   {
// //     header: "Name",
// //     accessorKey: "full_name",
// //     cell: (data) => {
// //       return <Typography>{data.row.original.full_name}</Typography>;
// //     },
// //   },
// //   {
// //     header: "BOID",
// //     accessorKey: "boid_no",
// //     cell: (data) => {
// //       return <Typography>{data.row.original.boid_no}</Typography>;
// //     },
// //   },
// //   {
// //     header: "Shareholder Number",
// //     accessorKey: "share_holder_number",
// //     cell: (data) => {
// //       return <Typography>{data.row.original.share_holder_number}</Typography>;
// //     },
// //   },
// //   {
// //     header: "Phone Number",
// //     accessorKey: "phone",
// //     cell: (data) => {
// //       return <Typography>{data.row.original.phone}</Typography>;
// //     },
// //   },
// //   {
// //     header: "Actions",
// //     accessorKey: "actions",
// //     cell: (data) => {
// //       const [successBarOpen, setSuccessBarOpen] = useState(false);
// //       const [selectedShareHolder, setSelectedShareHolder] = useState();

// //       // const handleView = ({ data }) => {
// //       //   return (
// //       //     <>
// //       //       {data.map((item) => (
              
// //       //       ))}
// //       //     </>
// //       //   );
// //       // };


// //       const handleView = ({ data }) => {
// //         setSelectedShareHolder(data.row.original);
// //       };


// //       const handleReceipt = () => {
// //         const anchor = document.createElement("a");
// //         document.body.appendChild(anchor);
// //         const citizenFilePath = data.row.original.citizen_file_path;
// //         const uniqueIdentifier = citizenFilePath.match(/\/([^/]+)\/$/)[1];
// //         console.log(uniqueIdentifier);
// //         const file = `https://api-mf.navyaadvisors.com/sip-up/api/v1/sip/file-path-citizen/${uniqueIdentifier}/`;

// //         const headers = new Headers();
// //         headers.append("Authorization", `Bearer ${Auth.getAccessToken()}`);

// //         fetch(file, { headers })
// //           .then((response) => {
// //             return response.blob();
// //           })
// //           .then((blobby) => {
// //             console.log("blobby", blobby);
// //             const objectUrl = window.URL.createObjectURL(blobby);

// //             anchor.target = "_blank";
// //             anchor.href = objectUrl;
// //             anchor.download = `Unit Receipt ${data?.row?.original?.id}.pdf`;
// //             anchor.click();

// //             window.URL.revokeObjectURL(objectUrl);
// //           })
// //           .then(() => setSuccessBarOpen(true));
// //       };

// //       return (
// //         <>
// //           <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
// //             <SuccessBar
// //               snackbarOpen={successBarOpen}
// //               setSnackbarOpen={setSuccessBarOpen}
// //               message="Downloaded Successfully"
// //             />
// //             <Box
// //               onClick={{handleView}}
// //               sx={{
// //                 display: "flex",
// //                 flexDirection: "row",
// //                 alignItems: "center",
// //                 gap: 0.6,
// //                 color: colorTokens.mainColor[1100],
// //                 "&:hover": {
// //                   textDecoration: "underline",
// //                   cursor: "pointer",
// //                 },
// //               }}
// //             >
// //               <Visibility sx={{ fontSize: "0.9rem" }} />
// //               <Typography sx={{ fontSize: "1rem" }}>View</Typography>
// //             </Box>
// //             <Box
// //               onClick={handleReceipt}
// //               sx={{
// //                 display: "flex",
// //                 flexDirection: "row",
// //                 gap: 0.5,
// //                 alignItems: "center",
// //                 color: colorTokens.mainColor[1100],
// //                 "&:hover": {
// //                   textDecoration: "underline",
// //                   cursor: "pointer",
// //                 },
// //               }}
// //             >
// //               <img src={Receipt} alt="Reciept Icon" />
// //               <Typography>Receipt</Typography>
// //             </Box>
// //           </Box>
// //         </>
// //       );
// //     },
// //   },
// // ];


















// // import { Typography, Box, Button } from "@mui/material";
// // import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
// // import { ColumnDef } from "@tanstack/react-table";
// // import ViewModal from "components/Modal/ViewModal";
// // import {
// //   DocumentScanner,
// //   DocumentScannerOutlined,
// //   Visibility,
// // } from "@mui/icons-material";
// // import { colorTokens } from "../../theme";
// // import { useState } from "react";
// // import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
// // import { Link } from "react-router-dom";
// // import Auth from "utils/Auth";
// // import SuccessBar from "components/Snackbar/SuccessBar";
// // import Receipt from "../../assets/Receipt.svg";

// // type ShareHolderDetail = {
// //   id: number;
// //   full_name: string;
// //   boid_no: number;
// //   share_holder_number: number;
// //   total_units: number;
// //   phone: number;
// //   total_investement: number;
// //   citizen_file_path: string;
// //   actions: any;
// // };

// // export const ShareHolderDetailHeader: ColumnDef<ShareHolderDetail>[] = [
// //   {
// //     header: "Name",
// //     accessorKey: "full_name",
// //     cell: (data) => {
// //       return <Typography>{data.row.original.full_name}</Typography>;
// //     },
// //   },
// //   {
// //     header: "BOID",
// //     accessorKey: "boid_no",
// //     cell: (data) => {
// //       return <Typography>{data.row.original.boid_no}</Typography>;
// //     },
// //   },
// //   {
// //     header: "Shareholder Number",
// //     accessorKey: "share_holder_number",
// //     cell: (data) => {
// //       return <Typography>{data.row.original.share_holder_number}</Typography>;
// //     },
// //   },
// //   {
// //     header: "Phone Number",
// //     accessorKey: "phone",
// //     cell: (data) => {
// //       return <Typography>{data.row.original.phone}</Typography>;
// //     },
// //   },
// //   {
// //     header: "Actions",
// //     accessorKey: "actions",
// //     cell: (data) => {
// //       const [open, setOpen] = useState(false);
// //       const [successBarOpen, setSuccessBarOpen] = useState(false);
// //       // const handleView = () => {
// //       //   setOpen(true);
// //       //   console.log(data);
// //       // };

// //       const handleView = ({ data }) => {
// //         return (
// //           <>
// //             {data.map((item) => (
// //               <Typography key={item.id}>
// //                 <button onClick={() => handleView(data)}>View</button>
// //               </Typography>
// //             ))}
// //           </>
// //         );
// //       };

// //       // const modalData: Record<string, string> = {
// //       //   //  BOID: data.row.original.boid_number,   example
// //       //   "Lot No": "1",
// //       //   "Total Amount": "100",
// //       //   "Lot Sequence No": "11",
// //       //   "Lot Date": "2021-10-10",
// //       //   "Lot Units": "100",
// //       //   "Holding Days": "10",
// //       //   "Capital Gain Tax Amount": "10",
// //       //   "Capital Gain Amount": "654650",
// //       // };

// //       const handleReceipt = () => {
// //         const anchor = document.createElement("a");
// //         document.body.appendChild(anchor);
// //         const citizenFilePath = data.row.original.citizen_file_path;
// //         const uniqueIdentifier = citizenFilePath.match(/\/([^/]+)\/$/)[1];
// //         console.log(uniqueIdentifier);
// //         const file = `https://api-mf.navyaadvisors.com/sip-up/api/v1/sip/file-path-citizen/${uniqueIdentifier}/`;

// //         const headers = new Headers();
// //         headers.append("Authorization", `Bearer ${Auth.getAccessToken()}`);

// //         fetch(file, { headers })
// //           .then((response) => {
// //             return response.blob();
// //           })
// //           .then((blobby) => {
// //             console.log("blobby", blobby);
// //             const objectUrl = window.URL.createObjectURL(blobby);

// //             anchor.target = "_blank";
// //             anchor.href = objectUrl;
// //             anchor.download = `Unit Receipt ${data?.row?.original?.id}.pdf`;
// //             anchor.click();

// //             window.URL.revokeObjectURL(objectUrl);
// //           })
// //           .then(() => setSuccessBarOpen(true));
// //       };

// //       return (
// //         <>
// //           <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
// //             <SuccessBar
// //               snackbarOpen={successBarOpen}
// //               setSnackbarOpen={setSuccessBarOpen}
// //               message="Downloaded Successfully"
// //             />
// //             {/* <ViewModal open={open} setOpen={setOpen} data={modalData} /> */}
// //             <Box
// //               // onClick={() => handleView(item)}
// //               onClick={handleView(data)}
// //               sx={{
// //                 display: "flex",
// //                 flexDirection: "row",
// //                 alignItems: "center",
// //                 gap: 0.6,
// //                 color: colorTokens.mainColor[1100],
// //                 "&:hover": {
// //                   textDecoration: "underline",
// //                   cursor: "pointer",
// //                 },
// //               }}
// //             >
// //               <Visibility sx={{ fontSize: "0.9rem" }} />
// //               <Typography sx={{ fontSize: "1rem" }}>View</Typography>
// //             </Box>
// //             <Box
// //               onClick={handleReceipt}
// //               sx={{
// //                 display: "flex",
// //                 flexDirection: "row",
// //                 gap: 0.5,
// //                 alignItems: "center",
// //                 color: colorTokens.mainColor[1100],
// //                 "&:hover": {
// //                   textDecoration: "underline",
// //                   cursor: "pointer",
// //                 },
// //               }}
// //             >
// //               <img src={Receipt} alt="Reciept Icon" />
// //               <Typography>Receipt</Typography>
// //             </Box>
// //           </Box>
// //         </>
// //       );
// //     },
// //   },
// // ];
