/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Typography, useTheme } from "@mui/material";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import HolderInformation from "components/ShareHolderDetail/ShareHolderSearch";
import ReceiptTable from "components/Table/TanstackTable";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

import {
  useGetBOIDSearchResult,
  useGetBOIDDateSearchResult,
} from "../../../services/ShareHolderDetails/shareHolderDetails";
// import Receipt from "../../../assets/Receipt.svg";

import ShareHolderDetail from "./ShareHolderDetail";
import { ColumnDef } from "@tanstack/react-table";
import Auth from "utils/Auth";
import SuccessBar from "components/Snackbar/SuccessBar";
import { colorTokens } from "../../../theme";
import { PaginationState } from "@tanstack/react-table";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ShareHolderEmpty from "../../../assets/shareHolderEmpty.svg";

import DateField from "components/DateField/DateField";
import RoundedButton from "components/Button/Button";
import dayjs from "dayjs";
import DateFormatter from "utils/DateFormatter";
interface IFormInput {
  boid: string;
  shareHolderNumber: string;
}
type ShareHolderDetail = {
  id: number;
  full_name: string;
  boid_no: string;
  share_holder_number: string;
  total_units: string;
  phone: string;
  total_investement: string;
  citizen_file_path: string;
  actions: any;
  sip_identifier: string;
  created_at: string;
};

const DateFormatterAmendment = {
  format: (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  },
};

const ShareHolderInformation = () => {
  const theme = useTheme();
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedShareHolder, setSelectedShareHolder] = useState({
    id: 0,
    boid: "",
  });

  const [searchNext, setSearchNext] = useState<boolean>();
  const [searchPrev, setSearchPrev] = useState<boolean>();
  const [searchDateNext, setSearchDateNext] = useState<boolean>();
  const [searchDatePrev, setSearchDatePrev] = useState<boolean>();
  const [boid_no, setBoid_no] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showDateSearch, setShowDateSearch] = useState(false);
  const [showEmptySearch, setShowEmptySearch] = useState(false);
  const [loadClicked, setLoadClicked] = useState(false);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [Datepag, setDatePag] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [searchData, setSearchData] = useState({
    from_date: "",
    to_date: "",
  });

  const {
    data: BOIDSearchResult,
    isLoading,
    refetch: BOIDSearchResultRefetch,
  } = useGetBOIDSearchResult(boid_no, pagination.pageIndex + 1);

  const {
    data: DateSearchResult,
    isSuccess: DateSearchResultSuccess,
    refetch: DateSearchResultRefetch,
  } = useGetBOIDDateSearchResult(
    searchData?.from_date,
    searchData?.to_date,
    Datepag.pageIndex + 1
  );

  // const totalPages = Math.ceil(ShareHoldersData?.meta?.records /ShareHoldersData?.meta?.per_page );
  const totalSearchPages = Math.ceil(
    BOIDSearchResult?.meta?.records / BOIDSearchResult?.meta?.per_page
  );
  const totalDateSearchPages = Math.ceil(
    DateSearchResult?.meta?.records / DateSearchResult?.meta?.per_page
  );

  const schema = yup.object().shape({
    boid: yup.string(),
    startDate: yup.object().required(),
    endDate: yup.object().required(),
    // .length(16, "BOID number must be exactly 16 characters"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      boid: "",
      startDate: dayjs(),
      endDate: dayjs(),
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: IFormInput) => {
    setBoid_no(data.boid);
    setShowSearch(true);
    pagination.pageIndex = 0;
    setShowEmptySearch(false);
    setShowDateSearch(false);
  };

  const handleReset = () => {
    reset({ boid: "" });
    setBoid_no("");
    setShowSearch(false);
    setShowEmptySearch(false);
    setShowDateSearch(false);
    pagination.pageIndex = 0;
  };
  // const handleReload = () => {
  //   // setLoadClicked(false);
  //   setBoid_no("");
  //   setSearchData({
  //     from_date: "",
  //     to_date: "",
  //   })
  //   BOIDSearchResultRefetch();
  // };
  const handleReload = () => {
    setBoid_no("");
    setSearchData({
      from_date: "",
      to_date: "",
    });
    setShowSearch(false);
    setShowDateSearch(false);
    setShowEmptySearch(false);
    setLoadClicked(false);
    BOIDSearchResultRefetch();
  };

  const handleLoad = (data) => {
    if (data.startDate && data.endDate) {
      const fromDate = new Date(data.startDate);
      const toDate = new Date(data.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatterAmendment.format(
        toDate.toISOString()
      );

      setSearchData({
        from_date: formattedFromDate,
        to_date: formattedToDate,
      });

      setLoadClicked(true);
      setDatePag({ pageIndex: 0, pageSize: 10 });
    } else {
      console.log("Both start and end dates must be selected.");
    }
  };

  useEffect(() => {
    if (loadClicked) {
      setPagination({ pageIndex: 0, pageSize: 10 });
      DateSearchResultRefetch().then(() => {
        setShowDateSearch(true);
        setShowSearch(false);
        if (DateSearchResult?.responseData?.results.length === 0) {
          setShowEmptySearch(true);
        }
      });
    }
  }, [
    searchData,
    Datepag.pageIndex,
    loadClicked,
    DateSearchResultRefetch,
    DateSearchResult?.responseData?.results,
  ]);

  useEffect(() => {
    if (DateSearchResultSuccess && loadClicked) {
      setShowDateSearch(true);
      setShowSearch(false);
      if (
        !DateSearchResult?.responseData?.results ||
        DateSearchResult?.responseData?.results.length === 0
      ) {
        setShowEmptySearch(true);
      }
    }
  }, [
    DateSearchResultSuccess,
    loadClicked,
    DateSearchResult,
    searchData,
    DateSearchResultRefetch,
  ]);

  useEffect(() => {
    if (BOIDSearchResult?.responseData?.results.length === 0) {
      setShowEmptySearch(true);
    } else {
      setShowEmptySearch(false);
    }
  }, [BOIDSearchResult]);

  useEffect(() => {
    if (BOIDSearchResult?.responseData?.next === null) {
      setSearchNext(true);
    } else {
      setSearchNext(false);
    }
    if (BOIDSearchResult?.responseData?.previous === null) {
      setSearchPrev(true);
    } else {
      setSearchPrev(false);
    }
  }, [BOIDSearchResult]);

  useEffect(() => {
    if (DateSearchResult?.responseData?.next === null) {
      setSearchDateNext(true);
    } else {
      setSearchDateNext(false);
    }
    if (DateSearchResult?.responseData?.previous === null) {
      setSearchDatePrev(true);
    } else {
      setSearchDatePrev(false);
    }
  }, [DateSearchResult]);
  useEffect(() => {
    if (DateSearchResult?.responseData?.results?.length > 0) {
      setShowDateSearch(true);
      setShowSearch(false);
      setShowEmptySearch(false);
    }
  }, [DateSearchResult?.responseData?.results]);

  // useEffect(() => {
  //   if (showDateSearch) {
  //     DateSearchResultRefetch();
  //   }
  // }, [Datepag.pageIndex, DateSearchResultRefetch, showDateSearch]);

  const ShareHolderDetailHeader: ColumnDef<ShareHolderDetail>[] = [
    {
      header: () => (
        <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
          Full Name
        </Typography>
      ),
      accessorKey: "full_name",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.full_name}
          </Typography>
        );
      },
    },
    {
      header: () => (
        <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>BOID</Typography>
      ),
      accessorKey: "boid_no",
      // enableClickToCopy: true,

      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.boid_no}
          </Typography>
        );
      },
    },
    {
      header: () => (
        <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
          Share Holder Number
        </Typography>
      ),
      accessorKey: "share_holder_number",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.share_holder_number}
          </Typography>
        );
      },
    },
    {
      header: () => (
        <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
          Phone Number
        </Typography>
      ),
      accessorKey: "phone",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.phone}
          </Typography>
        );
      },
    },
    {
      header: () => (
        <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
          Created At
        </Typography>
      ),
      accessorKey: "created_at",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.created_at.split("T")[0]}
          </Typography>
        );
      },
    },
    {
      header: () => (
        <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
          Actions
        </Typography>
      ),
      accessorKey: "actions",
      cell: (data) => {
        const [successBarOpen, setSuccessBarOpen] = useState(false);
        const BASE_URL = import.meta.env.VITE_BASE_URL;
        const handleView = () => {
          if (
            selectedShareHolder.id === data.row.original.id &&
            showViewModal
          ) {
            setShowViewModal(false);
          } else {
            setSelectedShareHolder({
              id: data.row.original.id,
              boid: data.row.original.boid_no,
            });
            setShowViewModal(true);
          }
        };

        const handleReceipt = () => {
          const anchor = document.createElement("a");
          document.body.appendChild(anchor);
          const file = `${BASE_URL}/sip-up/api/v1/sip/generate-report-file/${data.row.original.sip_identifier}/`;

          const headers = new Headers();
          headers.append("Authorization", `Bearer ${Auth.getAccessToken()}`);

          fetch(file, { headers })
            .then((response) => response.blob())
            .then((blobby) => {
              const objectUrl = window.URL.createObjectURL(blobby);

              anchor.target = "_blank";
              anchor.href = objectUrl;
              anchor.download = `Unit Receipt ${data?.row?.original?.id}.pdf`;
              anchor.click();

              window.URL.revokeObjectURL(objectUrl);
            })
            .then(() => setSuccessBarOpen(true));
        };

        return (
          <>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1.5,
                  justifyContent: "center",
                }}
              >
                <SuccessBar
                  snackbarOpen={successBarOpen}
                  setSnackbarOpen={setSuccessBarOpen}
                  message="Downloaded Successfully"
                />
                <Box
                  onClick={() => handleView()}
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
                  {selectedShareHolder.id === data.row.original.id &&
                  showViewModal ? (
                    <VisibilityOff sx={{ fontSize: "14px", fontWeight: 400 }} />
                  ) : (
                    <Visibility sx={{ fontSize: "14px", fontWeight: 400 }} />
                  )}
                  <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
                    {selectedShareHolder.id === data.row.original.id &&
                    showViewModal
                      ? "Hide"
                      : "View"}
                  </Typography>
                </Box>

                <Box
                  onClick={handleReceipt}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 0.5,
                    alignItems: "center",
                    color: colorTokens.mainColor[1100],
                    "&:hover": {
                      textDecoration: "underline",
                      cursor: "pointer",
                    },
                  }}
                >
                  {/* <img src={Receipt} alt="Reciept Icon" /> */}
                  <ArticleOutlinedIcon
                    sx={{ fontSize: "14px", fontWeight: 400 }}
                  />

                  <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
                    Receipt
                  </Typography>
                </Box>
              </Box>
            </Box>
          </>
        );
      },
    },
  ];

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HolderInformation
          control={control}
          errors={errors}
          searchButton={true}
          resetButton={true}
          onClickSearch={handleSubmit(onSubmit)}
          onClickReset={handleReset}
        />
      </form>

      <Box sx={{ mt: 2 }} onSubmit={handleSubmit(handleLoad)} component="form">
        <DateField
          control={control}
          dateLabel1="Date (From)"
          dateLabel2="Date (To)"
        />

        <RoundedButton title1="Load" />
      </Box>

      <Box sx={{ mt: 5 }}>
        <HeaderDesc title="Table" />
      </Box>

      {showEmptySearch ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <img src={ShareHolderEmpty} alt="No Data Found" />
          <Typography>No Data Found</Typography>
          <Typography
            onClick={handleReload}
            sx={{
              color: theme.palette.primary[700],
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reset Filters
          </Typography>
        </Box>
      ) : (
        <>
          {showSearch && (
            <ReceiptTable
              columns={ShareHolderDetailHeader}
              data={BOIDSearchResult?.responseData?.results ?? []}
              // data={searchTableData ?? []}
              pagination={pagination}
              setPagination={setPagination}
              next={searchNext}
              prev={searchPrev}
              pageCount={totalSearchPages}
              loading={isLoading}
            />
          )}
          {!showSearch && !showDateSearch && (
            <ReceiptTable
              columns={ShareHolderDetailHeader}
              data={BOIDSearchResult?.responseData?.results ?? []}
              pagination={pagination}
              setPagination={setPagination}
              next={searchNext}
              prev={searchPrev}
              pageCount={totalSearchPages}
              loading={isLoading}
            />
          )}
          {showDateSearch && (
            <ReceiptTable
              columns={ShareHolderDetailHeader}
              data={DateSearchResult?.responseData?.results ?? []}
              // data={searchDataData}
              pagination={Datepag}
              setPagination={setDatePag}
              next={searchDateNext}
              prev={searchDatePrev}
              pageCount={totalDateSearchPages}
              loading={isLoading}
            />
          )}

          {selectedShareHolder && showViewModal && (
            <ShareHolderDetail
              id={selectedShareHolder.id}
              boid={selectedShareHolder.boid}
            />
          )}
        </>
      )}
    </>
  );
};

export default ShareHolderInformation;

// import { Box, Typography } from "@mui/material";
// import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import HolderInformation from "components/ShareHolderDetail/ShareHolderSearch";
// import ReceiptTable from "components/Table/TanstackTable";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { Visibility, VisibilityOff } from "@mui/icons-material";

// import { useGetShareHolderListPaination , useGetBOIDSearchResult } from "../../../services/ShareHolderDetails/shareHolderDetails";
// import Receipt from "../../../assets/Receipt.svg";

// import ShareHolderDetail from "./ShareHolderDetail";
// import { ColumnDef } from "@tanstack/react-table";
// import Auth from "utils/Auth";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import { colorTokens } from "../../../theme";
// import { PaginationState } from "@tanstack/react-table";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import ShareHolderEmpty from "../../../assets/shareHolderEmpty.svg";
// // import axios from "axios";

// interface IFormInput {
//   boid: string;
//   shareHolderNumber: string;
// }
// type ShareHolderDetail = {
//   id: number;
//   full_name: string;
//   boid_no: string;
//   share_holder_number: string;
//   total_units: string;
//   phone: string;
//   total_investement: string;
//   citizen_file_path: string;
//   actions: any;
//   sip_identifier: string;
// };

// const ShareHolderInformation = () => {
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedShareHolder, setSelectedShareHolder] = useState({
//     id: 0,
//     boid: "",
//   });

//   const [next, setNext] = useState<boolean>();
//   const [prev, setPrev] = useState<boolean>();
//   const [boid_no, setBoid_no] = useState("")
//   const [searchTableData, setSearchTableData] = useState("");
//   const [showSearch, setShowSearch] = useState(false);
//   const [showEmptySearch, setShowEmptySearch] = useState(false);

//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   const { data: ShareHoldersData  , isLoading} = useGetShareHolderListPaination(
//     `${pagination.pageIndex * pagination.pageSize}`
//   );

//   const {data : BOIDSearchResult , isLoading : searchLoading } = useGetBOIDSearchResult(boid_no)

//   const totalPages = Math.ceil(ShareHoldersData?.meta?.records / 10);
//   // const totalSearchPages = Math.ceil(BOIDSearchResult?.meta?.records / 10);

//   const schema = yup.object().shape({
//     boid: yup
//       .string()
//       .required("BOID is required")
//       .length(16, "BOID number must be exactly 16 characters"),
//   });

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     defaultValues: {
//       boid: "",
//     },
//     resolver: yupResolver(schema),
//   });

//   const onSubmit = (data: IFormInput) => {
//     setShowSearch(true);
//     setSearchTableData(BOIDSearchResult?.responseData?.results ?? []);
//     setBoid_no(data.boid)
//     // fetchShareHolders(data.boid);
//     // console.log("Submitted data:", data)
//   };

//   const handleReset = () => {
//     reset({ boid: "" });
//     setShowEmptySearch(false)
//     setShowSearch(false);
//   };

//   useEffect(() => {
//     setSearchTableData(BOIDSearchResult?.responseData?.results ?? []);
//   }
//   , [BOIDSearchResult])

//   // const fetchShareHolders = async (boid_no: string) => {
//   //   try {
//   //     const response = await axios.get(
//   //       `https://api-mf.navyaadvisors.com/sip-up/api/v1/sip/share-holder-list/`,
//   //       {
//   //         params: {
//   //           boid_no,
//   //         },
//   //         headers: {
//   //           Authorization: `Bearer ${Auth.getAccessToken()}`,
//   //         },
//   //       }
//   //     );
//   //     const data = response.data;
//   //     setShowSearch(true);
//   //     setSearchTableData(data?.responseData?.results ?? []);
//   //   } catch (error) {
//   //     console.error("Error fetching shareholders data:", error);
//   //   }
//   // };

//   useEffect(() => {
//     if (ShareHoldersData?.responseData?.next === null ) {
//       setNext(true);
//     } else {
//       setNext(false);
//     }
//     if (ShareHoldersData?.responseData?.previous === null ) {
//       setPrev(true);
//     } else {
//       setPrev(false);
//     }
//   }, [ShareHoldersData ]);

//   const ShareHolderDetailHeader: ColumnDef<ShareHolderDetail>[] = [
//     {
//       header: "Name",
//       accessorKey: "full_name",
//       cell: (data) => {
//         return <Typography>{data.row.original.full_name}</Typography>;
//       },
//     },
//     {
//       header: "BOID",
//       accessorKey: "boid_no",
//       cell: (data) => {
//         return <Typography>{data.row.original.boid_no}</Typography>;
//       },
//     },
//     {
//       header: "Shareholder Number",
//       accessorKey: "share_holder_number",
//       cell: (data) => {
//         return <Typography>{data.row.original.share_holder_number}</Typography>;
//       },
//     },
//     {
//       header: "Phone Number",
//       accessorKey: "phone",
//       cell: (data) => {
//         return <Typography>{data.row.original.phone}</Typography>;
//       },
//     },
//     {
//       header: "Actions",
//       accessorKey: "actions",
//       cell: (data) => {
//         const [successBarOpen, setSuccessBarOpen] = useState(false);

//         const handleView = () => {
//           if (
//             selectedShareHolder.id === data.row.original.id &&
//             showViewModal
//           ) {
//             setShowViewModal(false);
//           } else {
//             setSelectedShareHolder({
//               id: data.row.original.id,
//               boid: data.row.original.boid_no,
//             });
//             setShowViewModal(true);
//           }
//         };

//         const handleReceipt = () => {
//           const anchor = document.createElement("a");
//           document.body.appendChild(anchor);
//           const file = `https://api-mf.navyaadvisors.com/sip-up/api/v1/sip/generate-report-file/${data.row.original.sip_identifier}/`;

//           const headers = new Headers();
//           headers.append("Authorization", `Bearer ${Auth.getAccessToken()}`);

//           fetch(file, { headers })
//             .then((response) => {
//               return response.blob();
//             })
//             .then((blobby) => {
//               const objectUrl = window.URL.createObjectURL(blobby);

//               anchor.target = "_blank";
//               anchor.href = objectUrl;
//               anchor.download = `Unit Receipt ${data?.row?.original?.id}.pdf`;
//               anchor.click();

//               window.URL.revokeObjectURL(objectUrl);
//             })
//             .then(() => setSuccessBarOpen(true));
//         };

//         return (
//           <>
//             <Box>
//               <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
//                 <SuccessBar
//                   snackbarOpen={successBarOpen}
//                   setSnackbarOpen={setSuccessBarOpen}
//                   message="Downloaded Successfully"
//                 />
//                 <Box
//                   onClick={() => handleView()}
//                   sx={{
//                     display: "flex",
//                     flexDirection: "row",
//                     alignItems: "center",
//                     gap: 0.6,
//                     color: colorTokens.mainColor[1100],
//                     "&:hover": {
//                       textDecoration: "underline",
//                       cursor: "pointer",
//                     },
//                   }}
//                 >

//                   {selectedShareHolder.id === data.row.original.id && showViewModal
//                       ? (<VisibilityOff sx={{ fontSize: "0.9rem" }} />)
//                       : (<Visibility sx={{ fontSize: "0.9rem" }} />)}
//                   <Typography sx={{ fontSize: "1rem" }}>
//                     {selectedShareHolder.id === data.row.original.id && showViewModal
//                       ? "Hide"
//                       : "View"}
//                   </Typography>
//                 </Box>

//                 <Box
//                   onClick={handleReceipt}
//                   sx={{
//                     display: "flex",
//                     flexDirection: "row",
//                     gap: 0.5,
//                     alignItems: "center",
//                     color: colorTokens.mainColor[1100],
//                     "&:hover": {
//                       textDecoration: "underline",
//                       cursor: "pointer",
//                     },
//                   }}
//                 >
//                   <img src={Receipt} alt="Reciept Icon" />
//                   <Typography>Receipt</Typography>
//                 </Box>
//               </Box>
//             </Box>
//           </>
//         );
//       },
//     },
//   ];
//   return (
//     <>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <HolderInformation
//           control={control}
//           errors={errors}
//           searchButton={true}
//           resetButton={true}
//           onClickSearch={handleSubmit(onSubmit)}
//           onClickReset={handleReset}
//         />
//       </form>

//       <Box sx={{ mt: 5 }}>
//         <HeaderDesc title="Table" />
//       </Box>

//       { (BOIDSearchResult?.responseData?.results.length === 0 && !showEmptySearch ) ? (
//          <>
//             <Box sx={{display:'flex', alignItems:'center' , justifyContent:'center' , flexDirection:'column'}}>
//             <img src={ShareHolderEmpty} alt="No Data Found" />
//             <Typography>No Data Found</Typography>
//             </Box>
//          </>
//       ) : (
//       <>
//       {showSearch && (
//         <ReceiptTable
//           columns={ShareHolderDetailHeader}
//           data={searchTableData ?? []}
//           pagination={pagination}
//           // setPagination={setPagination}
//           // next={next}
//           // prev={prev}
//           // pageCount={totalSearchPages}
//           // loading={isLoading}

//         />
//       )}
//       {!showSearch && (
//         <ReceiptTable
//           columns={ShareHolderDetailHeader}
//           data={ShareHoldersData?.responseData?.results ?? []}
//           pagination={pagination}
//           setPagination={setPagination}
//           next={next}
//           prev={prev}
//           pageCount={totalPages}
//           loading={isLoading}

//         />
//       )}

//       {selectedShareHolder && showViewModal && (
//         <ShareHolderDetail
//           id={selectedShareHolder.id}
//           boid={selectedShareHolder.boid}
//         />
//       )}
//       </>
//       )}
//     </>

//   );
// };

// export default ShareHolderInformation;

// import { Box, TextField, Typography } from "@mui/material";
// import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import HolderInformation from "components/ShareHolderDetail/ShareHolderSearch";
// import ReceiptTable from "components/Table/TanstackTable";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// // import { yupResolver } from "@hookform/resolvers/yup";
// // import * as yup from "yup";
// import { Visibility } from "@mui/icons-material";

// import { useGetShareHolderListPaination } from "../../../services/ShareHolderDetails/shareHolderDetails";
// import Receipt from "../../../assets/Receipt.svg";

// import ShareHolderDetail from "./ShareHolderDetail";
// import { ColumnDef } from "@tanstack/react-table";
// import Auth from "utils/Auth";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import { colorTokens } from "../../../theme";
// import { PaginationState } from "@tanstack/react-table";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import axios from "axios";

// interface IFormInput {
//   boid: string;
//   shareHolderNumber: string;
// }
// type ShareHolderDetail = {
//   id: number;
//   full_name: string;
//   boid_no: string;
//   share_holder_number: string;
//   total_units: string;
//   phone: string;
//   total_investement: string;
//   citizen_file_path: string;
//   actions: any;
//   sip_identifier: string;
// };

// const ShareHolderInformation = () => {
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedShareHolder, setSelectedShareHolder] = useState({
//     id: 0,
//     boid: "",
//   });

//   const [next, setNext] = useState<boolean>();
//   const [prev, setPrev] = useState<boolean>();
//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });
//   const { data: ShareHoldersData } = useGetShareHolderListPaination(
//     `${pagination.pageIndex * pagination.pageSize}`
//   );
//   // console.log('ShareHoldersData', ShareHoldersData)

//   const [tableData, setTableData] = useState("");
//   const [showSearch, setShowSearch] = useState(false);

//   const fetchShareHolders = async (boid_no: string) => {
//     try {
//       const response = await axios.get(
//         `https://api-mf.navyaadvisors.com/sip-up/api/v1/sip/share-holder-list/`,
//         {
//           params: {
//             boid_no,
//           },
//           headers: {
//             Authorization: `Bearer ${Auth.getAccessToken()}`,
//           },
//         }
//       );
//       const data = response.data;
//       setShowSearch(true);
//       setTableData(data?.responseData?.results ?? []);
//       // setNext(data.next === null);
//       // setPrev(data.previous === null);
//     } catch (error) {
//       console.error("Error fetching shareholders data:", error);
//     }
//   };

//   // const onSubmit = (data: IFormInput) => {
//   //   fetchShareHolders(data.boid);
//   // };

//   useEffect(() => {
//     // setTableData(PendingSipListData?.responseData?.results || []);
//     setTableData(ShareHoldersData?.responseData?.results || []);

//     if (ShareHoldersData?.responseData?.next === null) {
//       setNext(true);
//     } else {
//       setNext(false);
//     }
//     if (ShareHoldersData?.responseData?.previous === null) {
//       setPrev(true);
//     } else {
//       setPrev(false);
//     }
//   }, [ShareHoldersData]);

//   const schema = yup.object().shape({
//     boid: yup
//       .string()
//       .required("BOID is required")
//       .length(16, "BOID number must be exactly 16 characters")
//   });

//   const { control, handleSubmit, formState: { errors } } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const onSubmit = (data: IFormInput) => {
//     // console.log("Submitted data:", data)
//     fetchShareHolders(data.boid);
//   };

//   const [searchQuery, setSearchQuery] = useState("");

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const ShareHolderDetailHeader: ColumnDef<ShareHolderDetail>[] = [
//     {
//       header: "Name",
//       accessorKey: "full_name",
//       cell: (data) => {
//         return <Typography>{data.row.original.full_name}</Typography>;
//       },
//     },
//     {
//       header: "BOID",
//       accessorKey: "boid_no",
//       cell: (data) => {
//         return <Typography>{data.row.original.boid_no}</Typography>;
//       },
//     },
//     {
//       header: "Shareholder Number",
//       accessorKey: "share_holder_number",
//       cell: (data) => {
//         return <Typography>{data.row.original.share_holder_number}</Typography>;
//       },
//     },
//     {
//       header: "Phone Number",
//       accessorKey: "phone",
//       cell: (data) => {
//         return <Typography>{data.row.original.phone}</Typography>;
//       },
//     },
//     {
//       header: "Actions",
//       accessorKey: "actions",
//       cell: (data) => {
//         const [successBarOpen, setSuccessBarOpen] = useState(false);

//         const handleView = (data) => {
//           setSelectedShareHolder({
//             id: data.row.original.id,
//             boid: data.row.original.boid_no,
//           });
//           setShowViewModal(true);
//         };

//         const handleReceipt = () => {
//           const anchor = document.createElement("a");
//           document.body.appendChild(anchor);
//           const file = `https://api-mf.navyaadvisors.com/sip-up/api/v1/sip/generate-report-file/${data.row.original.sip_identifier}/`;

//           const headers = new Headers();
//           headers.append("Authorization", `Bearer ${Auth.getAccessToken()}`);

//           fetch(file, { headers })
//             .then((response) => {
//               return response.blob();
//             })
//             .then((blobby) => {
//               // console.log("blobby", blobby);
//               const objectUrl = window.URL.createObjectURL(blobby);

//               anchor.target = "_blank";
//               anchor.href = objectUrl;
//               anchor.download = `Unit Receipt ${data?.row?.original?.id}.pdf`;
//               anchor.click();

//               window.URL.revokeObjectURL(objectUrl);
//             })
//             .then(() => setSuccessBarOpen(true));
//         };

//         return (
//           <>
//             <Box>
//               <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
//                 <SuccessBar
//                   snackbarOpen={successBarOpen}
//                   setSnackbarOpen={setSuccessBarOpen}
//                   message="Downloaded Successfully"
//                 />
//                 <Box
//                   onClick={() => handleView(data)}
//                   sx={{
//                     display: "flex",
//                     flexDirection: "row",
//                     alignItems: "center",
//                     gap: 0.6,
//                     color: colorTokens.mainColor[1100],
//                     "&:hover": {
//                       textDecoration: "underline",
//                       cursor: "pointer",
//                     },
//                   }}
//                 >
//                   <Visibility sx={{ fontSize: "0.9rem" }} />
//                   <Typography sx={{ fontSize: "1rem" }}>View</Typography>
//                 </Box>
//                 <Box
//                   onClick={handleReceipt}
//                   sx={{
//                     display: "flex",
//                     flexDirection: "row",
//                     gap: 0.5,
//                     alignItems: "center",
//                     color: colorTokens.mainColor[1100],
//                     "&:hover": {
//                       textDecoration: "underline",
//                       cursor: "pointer",
//                     },
//                   }}
//                 >
//                   <img src={Receipt} alt="Reciept Icon" />
//                   <Typography>Receipt</Typography>
//                 </Box>
//               </Box>
//             </Box>
//           </>
//         );
//       },
//     },
//   ];
//   return (
//     <>
//      <TextField
//   label="Search"
//   value={searchQuery}
//   onChange={handleSearchChange}
//   sx={{ mb: 2 }}
// />

//       <Box sx={{ mt: 5 }}>
//         <HeaderDesc title="Table" />
//       </Box>

//       {/* {showSearch ? (
//         <ReceiptTable
//           columns={ShareHolderDetailHeader}
//           data={tableData ?? []}
//         />
//       ) : (
//         <ReceiptTable
//           columns={ShareHolderDetailHeader}
//           data={ShareHoldersData?.responseData?.results ?? []}
//           pagination={pagination}
//           setPagination={setPagination}
//           next={next}
//           prev={prev}
//         />
//       )} */}

//         {/* {showSearch && (
//         <ReceiptTable
//           columns={ShareHolderDetailHeader}
//           data={tableData ?? []}
//         />
//       )}
//       {!showSearch && (
//         <ReceiptTable
//           columns={ShareHolderDetailHeader}
//           data={ShareHoldersData?.responseData?.results ?? []}
//           pagination={pagination}
//           setPagination={setPagination}
//           next={next}
//           prev={prev}
//         />
//       )} */}

// {showSearch ? (
//   <ReceiptTable
//     columns={ShareHolderDetailHeader}
//     data={Array.isArray(tableData) ? tableData.filter(
//       (item) =>
//         item.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.boid_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.phone.toString().includes(searchQuery)
//     ) : []}
//   />
// ) : (
//   <ReceiptTable
//     columns={ShareHolderDetailHeader}
//     data={
//       ShareHoldersData?.responseData?.results.filter(
//         (item) =>
//           item.full_name.includes(searchQuery) ||
//           item.boid_no.includes(searchQuery) ||
//           item.phone.toString().includes(searchQuery)
//       ) ?? []
//     }
//     pagination={pagination}
//     setPagination={setPagination}
//     next={next}
//     prev={prev}
//   />
// )}

//       {selectedShareHolder && showViewModal && (
//         <ShareHolderDetail
//           id={selectedShareHolder.id}
//           boid={selectedShareHolder.boid}
//         />
//       )}
//     </>
//   );
// };

// export default ShareHolderInformation;
