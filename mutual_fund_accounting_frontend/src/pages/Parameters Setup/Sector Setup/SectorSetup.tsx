import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Collapse,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { usePatchSectorData } from "services/SectorData/SectorDataServices";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import {
  Add,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Edit,
  Save,
} from "@mui/icons-material";
import axios from "axios";
import TuneIcon from "@mui/icons-material/Tune";
import RoundedButton from "components/Button/Button";
import DownloadButton from "components/Button/DownloadExcel";
import {
  useGetInvestmentStatusData,
  usePostInvestmentStatus,
} from "services/InvestmentStatus/InvestmentStatusServices";

interface Category {
  id: number;
  thresh_name: string;
  key: string;
  min_value: number;
  max_value: number;
  code: string;
  subData: SubData[];
}

interface SubData {
  sector_name: string;
  min_value: number;
  max_value: number;
  code?: string;
}

export default function ThresholdSetup() {
  const theme = useTheme();
  const [expandedRows, setExpandedRows] = useState({});
  const [view, setView] = useState("Summary View");
  const [editMode, setEditMode] = useState({});
  const [editingIndex, setEditingIndex] = useState<{
    categoryKey: string;
    subIndex: number;
  } | null>(null);
  const [editedData, setEditedData] = useState<SubData>({
    sector_name: "",
    min_value: 0,
    max_value: 0,
    code: "",
  });

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorBarOpen, setErrorBarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const categorie = [
    { name: "Equity Investment", key: "equity_investment", min: "", max: "" },
    { name: "Mutual Fund", key: "mutual_fund", min: "", max: "" },
    { name: "Fixed Income", key: "fixed_income", min: "", max: "" },
    {
      name: "Cash and Cash Equivalents",
      key: "cash_and_cash_equivalents",
      min: "",
      max: "",
    },
  ];

  const {
    // control,
    // setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      code: "",
      min_threshold: "",
      max_threshold: "",
      // min: "",
      // max: "",
    },
  });

  const { mutate: investmentStatusEntryData } = usePostInvestmentStatus();
  const { data: investmentStatusDataList } = useGetInvestmentStatusData();

  useEffect(() => {
    if (investmentStatusDataList?.responseData) {
      const parsedData = investmentStatusDataList?.responseData?.map(
        (category) => ({
          name: category?.thresh_name,
          key: category?.code ? category.code.trim() : "",
          min: category?.min_value ?? 0,
          max: category?.max_value ?? 0,
          subData: Array.isArray(category.sectors)
            ? category?.sectors?.map((sector) => ({
                sector: sector?.sector_name,
                min_threshold: sector?.min_value ?? 0,
                max_threshold: sector?.max_value ?? 0,
                code: sector.code ? sector.code.trim() : "",
              }))
            : [],
        })
      );
      setThresholdData(parsedData);
    }
  }, [investmentStatusDataList]);

  // const [thresholdData, setThresholdData] = useState<Category[]>([]);

  const handleViewChange = (e) => {
    const newView = e.target.value;
    setView(newView);

    if (newView === "Summary View") {
      setExpandedRows({});
    } else if (newView === "Detailed View") {
      const allExpanded = categorie.reduce((acc, category) => {
        acc[category.key] = true;
        return acc;
      }, {});
      setExpandedRows(allExpanded);
    }
  };

  const handleToggleExpand = (categoryKey) => {
    setExpandedRows((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  };

  const handleDownloadExcel = () => {
    console.log("Implement logic to download Excel file");
  };

  const [thresholdData, setThresholdData] = useState(
    categorie.map((category) => ({
      ...category,
      subData: [],
    }))
  );

  const handleEditToggle = (categoryKey) => {
    setEditMode((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  };

  const handleThresholdChange = (
    categoryKey: string,
    field: "min_value" | "max_value" | "min" | "max",
    value: string
  ) => {
    setThresholdData((prev) =>
      prev.map((category) =>
        category.key === categoryKey
          ? { ...category, [field]: Number(value) }
          : category
      )
    );
  };

  const handleSubThresholdChange = (categoryKey, index, field, value) => {
    setThresholdData((prev) =>
      prev.map((category) =>
        category.key === categoryKey
          ? {
              ...category,
              subData: category.subData.map((subItem, subIndex) =>
                subIndex === index ? { ...subItem, [field]: value } : subItem
              ),
            }
          : category
      )
    );
  };

  const handleAddSubData = (categoryKey: string) => {
    setThresholdData((prev) =>
      prev.map((category) =>
        category.key === categoryKey
          ? {
              ...category,
              subData: [
                ...category.subData,
                {
                  sector: "",
                  min_threshold: 0,
                  max_threshold: 0,
                  code: "",
                },
              ],
            }
          : category
      )
    );
  };
  // const handleSubmit = () => {
  //   const formattedPayload = thresholdData.map((category) => {
  //     return category.subData.map((subItem) => ({
  //       investment_sec: {
  //         thresh_name: category.name,
  //         min_value: category.min,
  //         max_value: category.max,
  //       },
  //       sector_name: subItem.sector,
  //       min_value: subItem.min_threshold,
  //       max_value: subItem.max_threshold,
  //     }));
  //   }).flat();

  //   investmentStatusEntryData(formattedPayload, {
  //     onSuccess: () => {
  //       setSnackbarOpen(true);
  //       reset();
  //     },
  //     onError: (error) => {
  //       setErrorBarOpen(true);
  //       setErrorMessage(
  //         axios.isAxiosError(error) && error.response
  //           ? error.response.data.code[0] || "Error in submitting data!"
  //           : "Error in submitting data!"
  //       );
  //     }
  //   });
  // };
  const handleSubmit = () => {
    const formattedPayload = thresholdData.map((category) => ({
      thresh_name: category.name,
      min_value: category.min,
      max_value: category.max,
      code: category.key,
      sectors: category.subData.map((sector) => ({
        sector_name: sector.sector,
        min_value: sector.min_threshold,
        max_value: sector.max_threshold,
        // code: category.key,
        // code: sector.code ? sector.code : "",
        code: sector.code,
      })),
    }));

    investmentStatusEntryData(formattedPayload, {
      onSuccess: () => {
        setSnackbarOpen(true);
        reset();
      },
      onError: (error) => {
        console.log("Error:", error);
        setErrorBarOpen(true);
        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage(
            error.response.data[0].details
              ? error.response.data[0].details[0]
              : error.response.data[0].sectors
              ? "Error in Cash and Cash Equivalents"
              : error.response.data[1].details
              ? error.response.data[1].details[0]
              : error.response.data[1].sectors
              ? "Error in Fixed Income"
              : error.response.data[2].details
              ? error.response.data[2].details[0]
              : error.response.data[2].sectors
              ? "Error in Mutal Fund"
              : error.response.data[3].details
              ? error.response.data[3].details[0]
              : error.response.data[3].sectors
              ? "Error in Equity Investment"
              : "Error in submitting data!"
          );
        } else {
          setErrorMessage("Error in submitting data!");
        }
      },

      // onError: (error) => {
      //   setErrorBarOpen(true);
      //   setErrorMessage(
      //     axios.isAxiosError(error) && error.response
      //       ? error.response.data.code[0] || "Error in submitting data!"
      //       : "Error in submitting data!"
      //   );
      // }
    });
  };

  const handleSaveClick = () => {
    if (editingIndex) {
      handleSubThresholdChange(
        editingIndex.categoryKey,
        editingIndex.subIndex,
        "sector_name",
        editedData.sector_name
      );
      handleSubThresholdChange(
        editingIndex.categoryKey,
        editingIndex.subIndex,
        "min_value",
        editedData.min_value
      );
      handleSubThresholdChange(
        editingIndex.categoryKey,
        editingIndex.subIndex,
        "max_value",
        editedData.max_value
      );
      setEditingIndex(null);
    }
  };

  // const handleSaveClick = () => {
  //   if (editingIndex) {
  //     handleSubThresholdChange(
  //       editingIndex.categoryKey,
  //       editingIndex.subIndex,
  //       "sector",
  //       editedData.sector
  //     );
  //     handleSubThresholdChange(
  //       editingIndex.categoryKey,
  //       editingIndex.subIndex,
  //       "min_threshold",
  //       editedData.min_threshold
  //     );
  //     handleSubThresholdChange(
  //       editingIndex.categoryKey,
  //       editingIndex.subIndex,
  //       "max_threshold",
  //       editedData.max_threshold
  //     );
  //     setEditingIndex(null);
  //   }
  // };

  // const handleSubmit = () => {
  //   const formattedPayload = thresholdData.map((category) => ({
  //     investment_sec: {
  //       thresh_name: category.name,
  //       min_value: category.min,
  //       max_value: category.max,
  //     },
  //     sector_name: category.subData[0].sector,
  //     min_value: category.subData[0].min_threshold,
  //     max_value: category.subData[0].max_threshold,
  //   }));

  //   console.log("Payload Data:", formattedPayload);

  //   investmentStatusEntryData(formattedPayload, {
  //     onSuccess: () => {
  //       setSnackbarOpen(true);
  //       reset();
  //     },
  //     onError: (error) => {
  //       setErrorBarOpen(true);
  //       // console.log("Error:", error);
  //       if (axios.isAxiosError(error) && error.response) {
  //         setErrorMessage(
  //           error.response.data.code
  //             ? error.response.data.code[0]
  //             : "Error in submitting data!"
  //         );
  //       } else {
  //         setErrorMessage("Error in submitting data!");
  //         console.error(error);
  //       }
  //     },
  //   });
  // };

  const handleEditClick = (categoryKey, subIndex, subData) => {
    setEditingIndex({ categoryKey, subIndex });
    setEditedData(subData);
  };

  // const handleSaveClick = () => {
  //   // Save logic for editedData
  //   handleSubThresholdChange(editingIndex.categoryKey, editingIndex.subIndex, "sector", editedData.sector);
  //   handleSubThresholdChange(editingIndex.categoryKey, editingIndex.subIndex, "min_threshold", editedData.min_threshold);
  //   handleSubThresholdChange(editingIndex.categoryKey, editingIndex.subIndex, "max_threshold", editedData.max_threshold);
  //   setEditingIndex(null);
  // };

  return (
    <Box>
      <SuccessBar
        snackbarOpen={snackbarOpen}
        message={"Threshold  Setup Successfully!"}
        setSnackbarOpen={setSnackbarOpen}
      />
      <ErrorBar
        snackbarOpen={errorBarOpen}
        message={errorMessage}
        setSnackbarOpen={setErrorBarOpen}
      />
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          lineHeight: "19px",
          color: "#212121",
          textAlign: "center",
          width: "max-content",
          borderBottom: `1px solid ${theme.palette.secondary.main}`,
          mb: 2,
        }}
      >
        Threshold Setup
      </Typography>

      <FormControl size="small" sx={{ width: "30%" }}>
        <Select
          labelId="securities-select-label"
          id="securities-select"
          value={view}
          onChange={handleViewChange}
          open={isDropdownOpen}
          onClose={() => setDropdownOpen(false)}
          onOpen={() => setDropdownOpen(true)}
          startAdornment={<TuneIcon />}
          variant="outlined"
          sx={{
            mt: 1,
            borderBlockColor: "white",
            borderRadius: "24px",
            backgroundColor: theme.palette.primary.light,
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiOutlinedInput-input": {
              ml: "6px",
            },
          }}
        >
          <MenuItem value="Summary View">Summary View</MenuItem>
          <MenuItem value="Detailed View">Detailed View</MenuItem>
        </Select>
      </FormControl>

      <Box
        sx={{
          width: { xs: "100%", sm: "100%", md: "110%", lg: "150%", xl: "160%" },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row-reverse", mb: 2 }}>
          <DownloadButton
            sx={{ justifyContent: "flex-end" }}
            onClick={handleDownloadExcel}
          />
        </Box>
        <Table
          sx={{
            minWidth: 650,
            borderRadius: 2,
            border: "1px solid rgba(224, 224, 224, 1)",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  // padding: "4px 8px",
                  width: "3%",

                  border: "none",
                }}
              >
                S.No
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  width: "17%",
                  fontSize: "0.9rem",
                  textAlign: "left",
                  // border: "none",
                  padding: "8px",
                }}
              >
                Sector
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  width: "13.33%",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  // border: "none",
                  padding: "8px",
                }}
              >
                Investment Threshold (Min)
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  width: "13.33%",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  // border: "none",
                  padding: "8px",
                }}
              >
                Investment Threshold (Max)
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  width: "13.33%",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  // border: "none",
                  padding: "8px",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {thresholdData.map((category, catIndex) => (
              <React.Fragment key={category.key}>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      // padding: "4px 8px",
                      width: "3%",

                      border: "none",
                    }}
                  >{`${catIndex + 1}`}</TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "4px 8px",
                      border: "none",
                    }}
                    align="left"
                  >
                    {category.name}
                    <IconButton
                      size="small"
                      onClick={() => handleToggleExpand(category.key)}
                      sx={{ ml: 1 }}
                    >
                      {expandedRows[category.key] ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell align="center" sx={{ border: "none" }}>
                    <TextField
                      size="small"
                      type="number"
                      value={category.min}
                      // onChange={(e) =>
                      //   handleThresholdChange(
                      //     category.key,
                      //     "min",
                      //     e.target.value
                      //   )
                      // }
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 0 && value <= 100) {
                          handleThresholdChange(
                            category.key,
                            "min",
                            e.target.value
                          );
                        }
                      }}
                      disabled={!editMode[category.key]}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ border: "none" }}>
                    <TextField
                      size="small"
                      type="number"
                      value={category.max}
                      // onChange={(e) =>
                      //   handleThresholdChange(
                      //     category.key,
                      //     "max",
                      //     e.target.value
                      //   )
                      // }
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 0 && value <= 100) {
                          handleThresholdChange(
                            category.key,
                            "max",
                            e.target.value
                          );
                        }
                      }}
                      disabled={!editMode[category.key]}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ border: "none" }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditToggle(category.key)}
                    >
                      {editMode[category.key] ? <Save /> : <Edit />}
                    </IconButton>
                  </TableCell>
                </TableRow>
                {expandedRows[category.key] && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ p: 0 }}>
                      <Collapse in={expandedRows[category.key]}>
                        <Table>
                          <TableBody>
                            {category.subData.map((subData, subIndex) => (
                              <TableRow
                                key={subIndex}
                                sx={{
                                  backgroundColor:
                                    subIndex % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                                  // borderBottom: "none",
                                  border: "none",
                                }}
                              >
                                <TableCell
                                  sx={{
                                    border: "none",
                                    textAlign: "center",
                                    padding: "8px 8px",
                                    width: "3%",
                                  }}
                                >
                                  {`${catIndex + 1}.${subIndex + 1}`}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "none",
                                    textAlign: "left",
                                    padding: "8px 16px",
                                    width: "18%",
                                  }}
                                >
                                  <TextField
                                    label="Sector"
                                    size="small"
                                    value={subData.sector}
                                    onChange={(e) =>
                                      handleSubThresholdChange(
                                        category.key,
                                        subIndex,
                                        "sector",
                                        e.target.value
                                      )
                                    }
                                    disabled={!editMode[category.key]}
                                  />
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "none",
                                    textAlign: "center",
                                    padding: "8px 16px",
                                    width: "13.33%",
                                  }}
                                >
                                  <TextField
                                    label="Min Threshold"
                                    type="number"
                                    size="small"
                                    value={subData.min_threshold}
                                    // onChange={(e) =>
                                    //   handleSubThresholdChange(
                                    //     category.key,
                                    //     subIndex,
                                    //     "min_threshold",
                                    //     Number(e.target.value)
                                    //   )
                                    // }
                                    onChange={(e) => {
                                      const value = Number(e.target.value);
                                      if (value >= 0 && value <= 100) {
                                        handleSubThresholdChange(
                                          category.key,
                                          subIndex,
                                          "min_threshold",
                                          e.target.value
                                        );
                                      }
                                    }}
                                    disabled={!editMode[category.key]}
                                    inputProps={{ min: 0, max: 100 }}
                                  />
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "none",
                                    textAlign: "center",
                                    padding: "8px 16px",
                                    width: "13.33%",
                                  }}
                                >
                                  <TextField
                                    label="Max Threshold"
                                    type="number"
                                    size="small"
                                    value={subData.max_threshold}
                                    // onChange={(e) =>
                                    //   handleSubThresholdChange(
                                    //     category.key,
                                    //     subIndex,
                                    //     "max_threshold",
                                    //     Number(e.target.value)
                                    //   )
                                    // }
                                    onChange={(e) => {
                                      const value = Number(e.target.value);
                                      if (value >= 0 && value <= 100) {
                                        handleSubThresholdChange(
                                          category.key,
                                          subIndex,
                                          "max_threshold",
                                          e.target.value
                                        );
                                      }
                                    }}
                                    disabled={!editMode[category.key]}
                                    inputProps={{ min: 0, max: 100 }}
                                  />
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "none",
                                    textAlign: "center",
                                    padding: "8px 16px",
                                    width: "13.33%",
                                  }}
                                ></TableCell>
                                {/* <TableCell
                                  sx={{
                                    border: "none",
                                    textAlign: "center",
                                    padding: "8px 16px",
                                    width: "13.33%",
                                  }}
                                >
                                  {editingIndex?.subIndex === subIndex ? (
                                    <Button
                                      // variant="contained"
                                      onClick={handleSaveClick}
                                      sx={{
                                        bgcolor: theme.palette.primary.main,
                                        color: "#fff",
                                        '&:hover': {
                                          bgcolor: theme.palette.primary.dark,
                                        },
                                      }}
                                    >
                                      <  Save />
                                    </Button>
                                  ) : (
                                    <IconButton
                                      onClick={() => handleEditClick(category.key, subIndex, subData)}
                                      disabled={!editMode[category.key]}
                                      sx={{
                                        color: theme.palette.primary.main,
                                      }}
                                    >
                                      <Edit />
                                    </IconButton>
                                  )}
                                </TableCell> */}
                              </TableRow>
                            ))}
                            {/* <TableRow>
                              <Button
                                variant="outlined"
                                onClick={() => handleAddSubData(category.key)}
                                disabled={!editMode[category.key]}
                                sx={{
                                  border: "none",
                                  // borderRadius: "100%",
                                  mt: 1,
                                  mb: 1,
                                  textAlign: "center",
                                  padding: "8px 16px",
                                  width: "5%",
                                  bgcolor: theme.palette.secondary.main,
                                  color: "#fff",
                                  p: 0,
                                  "&:hover": {
                                    bgcolor: theme.palette.primary[1100],
                                  },
                                }}                          >
                                {/* <Add sx={{ fontSize: "1.2rem", color: "#fff", }} /> */}
                            {/* </Button> */}
                            {/* </TableRow> */}
                          </TableBody>
                        </Table>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box sx={{ mt: 2 }}>
        <RoundedButton title1="Setup Thresholds" onClick1={handleSubmit} />
      </Box>
    </Box>
  );
}

// import React, { useState } from "react";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Typography,
//   Collapse,
//   IconButton,
//   Select,
//   MenuItem,
//   FormControl,
//   debounce,
//   Divider,
//   TableCellProps,
//   TextField,
//   Button,
// } from "@mui/material";
// import { useTheme, styled } from "@mui/material/styles";
// import { useForm } from "react-hook-form";
// import { useGetAllSectorData, usePatchSectorData } from "services/SectorData/SectorDataServices";
// import { useGetInvestmentStatusSummarized } from "services/Reporting/InvestmentStatus/InvestmentStatusServices";
// import RoundedButton from "components/Button/Button";
// import DownloadButton from "components/Button/DownloadExcel";
// import TuneIcon from "@mui/icons-material/Tune";
// import { Add, KeyboardArrowDown, KeyboardArrowUp, Edit, Save } from "@mui/icons-material";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import ErrorBar from "components/Snackbar/ErrorBar";
// import axios from "axios";

// interface Category {
//   name: string;
//   key: string;
//   min: number;
//   max: number;
//   subData: SubData[];
// }

// interface SubData {
//   sector: string;
//   min_threshold: number;
//   max_threshold: number;
// }

// export default function ThresholdSetup() {
//   const theme = useTheme();
//   const [expandedRows, setExpandedRows] = useState({});
//   const [view, setView] = useState("Summary View");
//   const [editMode, setEditMode] = useState({});
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [errorBarOpen, setErrorBarOpen] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string>("");

//   const categorie = [
//     { name: "Equity Investment", key: "equity_investment", min: 0, max: 0 },
//     { name: "Mutual Fund", key: "mutual_fund", min: 0, max: 0 },
//     { name: "Fixed Income", key: "fixed_income", min: 0, max: 0 },
//     { name: "Cash and Cash Equivalents", key: "cash_and_cash_equivalents", min: 0, max: 0 },
//   ];

//   const {
//     control,
//     setValue,
//     formState: { errors },
//     reset,
//   } = useForm({
//     // resolver: yupResolver(schema),
//     defaultValues: {
//       name: "",
//       code: "",
//       min_threshold: "",
//       max_threshold: "",
//     }
//   });
//   const {
//     data: summarizedInfodata,
//     isLoading,
//     isError,
//   } = useGetInvestmentStatusSummarized(view === "all" ? "" : view);

//   const { mutate: SectorDataAdded } = usePatchSectorData();

//   const handleViewChange = (e) => {
//     const newView = e.target.value;
//     setView(newView);

//     if (newView === "Summary View") {
//       setExpandedRows({});
//     } else if (newView === "Detailed View") {
//       const allExpanded = categorie.reduce((acc, category) => {
//         acc[category.key] = true;
//         return acc;
//       }, {});
//       setExpandedRows(allExpanded);
//     }
//   };
//   const handleToggleExpand = (categoryKey) => {
//     setExpandedRows((prev) => ({
//       ...prev,
//       [categoryKey]: !prev[categoryKey],
//     }));
//   };
//   const handleDownloadExcel = () => {
//     console.log("Implement logic to download Excel file");
//   };

//   const [thresholdData, setThresholdData] = useState(
//     categorie.map((category) => ({
//       ...category,
//       subData: [],
//     }))
//   );

//   const handleEditToggle = (categoryKey) => {
//     setEditMode((prev) => ({
//       ...prev,
//       [categoryKey]: !prev[categoryKey],
//     }));
//   };

//   // const handleThresholdChange = (categoryKey, field, value) => {
//   //   setThresholdData((prev) =>
//   //     prev.map((category) =>
//   //       category.key === categoryKey ? { ...category, [field]: value } : category
//   //     )
//   //   );
//   // };
//   const handleThresholdChange = (categoryKey: string, field: keyof Category, value: string) => {
//     setThresholdData((prev) =>
//       prev.map((category) =>
//         category.key === categoryKey ? { ...category, [field]: Number(value) } : category
//       )
//     );
//   };
//   const handleSubThresholdChange = (categoryKey, index, field, value) => {
//     setThresholdData((prev) =>
//       prev.map((category) =>
//         category.key === categoryKey
//           ? {
//             ...category,
//             subData: category.subData.map((subItem, subIndex) =>
//               subIndex === index ? { ...subItem, [field]: value } : subItem
//             ),
//           }
//           : category
//       )
//     );
//   };

//   // const handleAddSubData = (categoryKey) => {
//   //   setThresholdData((prev) =>
//   //     prev.map((category) =>
//   //       category.key === categoryKey
//   //         ? {
//   //           ...category,
//   //           subData: [
//   //             ...category.subData,
//   //             {
//   //               sector: `New Sub Sector ${category.subData.length + 1}`,
//   //               min_threshold: 0,
//   //               max_threshold: 0,
//   //             },
//   //           ],
//   //         }
//   //         : category
//   //     )
//   //   );
//   // };
//   const handleAddSubData = (categoryKey: string) => {
//     setThresholdData((prev) =>
//       prev.map((category) =>
//         category.key === categoryKey
//           ? {
//             ...category,
//             subData: [
//               ...category.subData,
//               {
//                 sector: "",
//                 min_threshold: 0,
//                 max_threshold: 0,
//               },
//             ],
//           }
//           : category
//       )
//     );
//   };

//   // const handleAddSubData = (categoryKey: string) => {
//   //   setThresholdData((prev) =>
//   //     prev.map((category) => {
//   //       if (category.key === categoryKey) {
//   //         if (!Array.isArray(category.subData)) {
//   //           console.error("subData is not an array or is undefined");
//   //         }

//   //         return {
//   //           ...category,
//   //           subData: [
//   //             ...category.subData,
//   //             {
//   //               sector: `New Sub Sector ${category.subData.length + 1}`,
//   //               min_threshold: 0,
//   //               max_threshold: 0,
//   //             },
//   //           ],
//   //         };
//   //       }
//   //       return category;
//   //     })
//   //   );
//   // };

//   // const handleSubmit = (data) => {
//   //   console.log("Threshold Data:", thresholdData);

//   //   const tempData = {
//   //     name: data?.name,
//   //     code: data?.code,
//   //     min_threshold: data?.min_threshold,
//   //     max_threshold: data?.max_threshold,
//   //   };

//   //   SectorDataAdded(tempData, {
//   //     onSuccess: () => {
//   //       // setTableData((prevData) => [...prevData, newData]);
//   //       // setValue("name", "");
//   //       // setValue("code", "");
//   //       setSnackbarOpen(true);
//   //       reset();
//   //       // setValue("name", "");
//   //       // setValue("min_threshold", "");
//   //       // setValue("max_threshold", "");
//   //     },
//   //     onError: (error) => {
//   //       setErrorBarOpen(true);
//   //       console.log("Error:", error);
//   //       if (axios.isAxiosError(error) && error.response) {
//   //         setErrorMessage(
//   //           error.response.data.code
//   //             ? error.response.data.code[0]
//   //             : "Error in submitting data!"
//   //         );
//   //       } else {
//   //         setErrorMessage("Error in submitting data!");
//   //         console.error(error);
//   //       }
//   //     },
//   //   });
//   // };

//   const handleSubmit = () => {
//     const payload = {
//       equity_investment: {
//         min_threshold: thresholdData[0].min,
//         max_threshold: thresholdData[0].max,
//         sectors: thresholdData[0].subData.map((sub) => ({
//           sector: sub.sector,
//           min_threshold: sub.min_threshold,
//           max_threshold: sub.max_threshold,
//         })),
//       },
//       mutual_fund: {
//         min_threshold: thresholdData[1].min,
//         max_threshold: thresholdData[1].max,
//         sectors: thresholdData[1].subData.map((sub) => ({
//           sector: sub.sector,
//           min_threshold: sub.min_threshold,
//           max_threshold: sub.max_threshold,
//         })),
//       },
//       fixed_income: {
//         min_threshold: thresholdData[2].min,
//         max_threshold: thresholdData[2].max,
//         sectors: thresholdData[2].subData.map((sub) => ({
//           sector: sub.sector,
//           min_threshold: sub.min_threshold,
//           max_threshold: sub.max_threshold,
//         })),
//       },
//       cash_and_cash_equivalents: {
//         min_threshold: thresholdData[3].min,
//         max_threshold: thresholdData[3].max,
//         sectors: thresholdData[3].subData.map((sub) => ({
//           sector: sub.sector,
//           min_threshold: sub.min_threshold,
//           max_threshold: sub.max_threshold,
//         })),
//       },
//     };

//     console.log("Payload Data:", payload);

//     SectorDataAdded(payload, {
//       onSuccess: () => {
//         setSnackbarOpen(true);
//         reset();
//       },
//       onError: (error) => {
//         setErrorBarOpen(true);
//         console.log("Error:", error);
//         if (axios.isAxiosError(error) && error.response) {
//           setErrorMessage(
//             error.response.data.code
//               ? error.response.data.code[0]
//               : "Error in submitting data!"
//           );
//         } else {
//           setErrorMessage("Error in submitting data!");
//           console.error(error);
//         }
//       },
//     });
//   };

//   return (
//     <Box>
//       <SuccessBar
//         snackbarOpen={snackbarOpen}
//         message={"Sector Created Successfully!"}
//         setSnackbarOpen={setSnackbarOpen}
//       />

//       <ErrorBar
//         snackbarOpen={errorBarOpen}
//         message={errorMessage}
//         setSnackbarOpen={setErrorBarOpen}
//       />
//       <Typography
//         sx={{
//           fontSize: "16px",
//           fontWeight: 600,
//           lineHeight: "19px",
//           color: "#212121",
//           textAlign: "center",
//           width: "max-content",
//           borderBottom: `1px solid ${theme.palette.secondary.main}`,
//           mb: 2
//         }}
//       >
//         Threshold Setup
//       </Typography>

//       <FormControl size="small" sx={{ width: "30%" }}>
//         <Select
//           labelId="securities-select-label"
//           id="securities-select"
//           value={view}
//           onChange={handleViewChange}
//           open={isDropdownOpen}
//           onClose={() => setDropdownOpen(false)}
//           onOpen={() => setDropdownOpen(true)}
//           startAdornment={<TuneIcon />}
//           variant="outlined"
//           sx={{
//             mt: 1,
//             borderBlockColor: "white",
//             borderRadius: "24px",
//             backgroundColor: theme.palette.primary.light,
//             "& .MuiOutlinedInput-notchedOutline": {
//               border: "none",
//             },
//             "& .MuiOutlinedInput-input": {
//               ml: "6px",
//             },
//           }}
//         >
//           <MenuItem value="Summary View">Summary View</MenuItem>
//           <MenuItem value="Detailed View">Detailed View</MenuItem>
//         </Select>
//       </FormControl>

//       <Box
//         sx={{
//           width: { xs: "100%", sm: "100%", md: "110%", lg: "150%", xl: "160%" },
//           // overflowX: "auto",
//         }}
//       >
//         <Box sx={{ display: "flex", flexDirection: "row-reverse", mb: 2 }}>
//           <DownloadButton
//             sx={{ justifyContent: "flex-end" }}
//             onClick={handleDownloadExcel}
//           />
//         </Box>
//         <Table
//           sx={{
//             width: "100%",
//             borderCollapse: "collapse",

//           }}
//         >
//           <TableHead
//             sx={{

//             }}
//           >
//             <TableRow>
//               <TableCell
//                 sx={{
//                   fontWeight: "bold",
//                   width: "3%",
//                   fontSize: "0.9rem",
//                   textAlign: "center",
//                   // border: "none",
//                   padding: "8px",
//                 }}
//               >
//                 S.No
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontWeight: "bold",
//                   width: "17%",
//                   fontSize: "0.9rem",
//                   textAlign: "left",
//                   // border: "none",
//                   padding: "8px",
//                 }}
//               >
//                 Sector
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontWeight: "bold",
//                   width: "13.33%",
//                   fontSize: "0.9rem",
//                   textAlign: "right",
//                   // border: "none",
//                   padding: "8px",
//                 }}
//               >
//                 Investment Threshold (Min)
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontWeight: "bold",
//                   width: "13.33%",
//                   fontSize: "0.9rem",
//                   textAlign: "right",
//                   // border: "none",
//                   wordWrap: "break-word",
//                   whiteSpace: "normal",
//                   padding: "8px",
//                 }}
//               >
//                 Investment Threshold (Max)
//               </TableCell>
//               <TableCell
//                 sx={{
//                   fontWeight: "bold",
//                   width: "13.33%",
//                   fontSize: "0.9rem",
//                   textAlign: "right",
//                   // border: "none",
//                   wordWrap: "break-word",
//                   whiteSpace: "normal",
//                   padding: "8px",
//                 }}
//               >
//                 Action
//               </TableCell>

//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {thresholdData.map((category, catIndex) => (
//               <React.Fragment key={category.key}>
//                 <TableRow sx={{ borderBottom: "none" }}>
//                   <TableCell
//                     sx={{
//                       fontWeight: "bold",
//                       textAlign: "center",
//                       // padding: "4px 8px",
//                       width: "3%",

//                       border: "none",
//                     }}
//                   >{`${catIndex + 1}`}</TableCell>
//                   <TableCell
//                     sx={{
//                       fontWeight: "bold",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       padding: "4px 8px",
//                       border: "none",
//                     }}
//                   >
//                     {category.name}
//                     <IconButton
//                       size="small"
//                       onClick={() => handleToggleExpand(category.key)}
//                     >
//                       {expandedRows[category.key] ? (
//                         <KeyboardArrowUp />
//                       ) : (
//                         <KeyboardArrowDown />
//                       )}
//                     </IconButton>
//                   </TableCell>
//                   <TableCell
//                     sx={{
//                       fontWeight: "bold",
//                       textAlign: "right",
//                       width: "13.33%",
//                       border: "none",
//                     }}
//                   >
//                     <TextField
//                       size="small"
//                       type="number"
//                       value={category.min}
//                       onChange={(e) => handleThresholdChange(category.key, "min", e.target.value)}
//                       disabled={!editMode[category.key]}
//                     />

//                   </TableCell>
//                   <TableCell
//                     sx={{
//                       fontWeight: "bold",
//                       textAlign: "right",
//                       width: "13.33%",
//                       border: "none",
//                     }}
//                   >
//                     <TextField
//                       size="small"
//                       type="number"
//                       value={category.max}
//                       onChange={(e) => handleThresholdChange(category.key, "max", e.target.value)}
//                       disabled={!editMode[category.key]}
//                     />
//                   </TableCell>

//                   <TableCell
//                     sx={{
//                       fontWeight: "bold",
//                       textAlign: "right",
//                       width: "13.33%",
//                       border: "none",
//                     }}>
//                     <IconButton
//                       size="small"
//                       onClick={() => handleEditToggle(category.key)}
//                     >
//                       {editMode[category.key] ? <Save /> : <Edit />}
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//                 {expandedRows[category.key] &&
//                   (view === "Summary View" || view === "Detailed View") && (
//                     <TableRow
//                       sx={{
//                         borderBottom: "none",
//                       }}
//                     >
//                       <TableCell
//                         colSpan={8}
//                         style={{
//                           paddingBottom: 0,
//                           paddingTop: 0,
//                           border: "none",
//                         }}
//                       >
//                         <Collapse
//                           in={expandedRows[category.key]}
//                           timeout="auto"
//                           unmountOnExit
//                         >
//                           <Box margin={1}>
//                             <Table
//                               // size=""
//                               sx={{
//                                 borderCollapse: "collapse",
//                                 borderSpacing: 0,
//                                 width: "102%",
//                                 // fontFamily: "Roboto Condensed, sans-serif",
//                               }}
//                             >
//                               <TableBody>
//                                 {(
//                                   summarizedInfodata?.responseData[
//                                   category.key
//                                   ] || []
//                                 ).map((item, index) => (

//                                   <TableRow
//                                     key={index}
//                                     sx={{
//                                       backgroundColor:
//                                         index % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
//                                       borderBottom: "none",
//                                     }}
//                                   >

//                                     <TableCell
//                                       sx={{
//                                         border: "none",
//                                         textAlign: "center",
//                                         padding: "8px 8px",
//                                         width: "3%",
//                                       }}
//                                     >
//                                       <Box component="span">
//                                         {`${catIndex + 1}.${index + 1}`}
//                                       </Box>
//                                     </TableCell>
//                                     <TableCell
//                                       sx={{
//                                         border: "none",
//                                         textAlign: "left",
//                                         padding: "8px 8px",
//                                         width: "17%",
//                                       }}
//                                     >
//                                       <TextField
//                                         disabled={!editMode[category.key]}
//                                         value={item.sector}
//                                         onChange={(e) =>
//                                           handleSubThresholdChange(
//                                             category.key,
//                                             index,
//                                             "sector",
//                                             e.target.value
//                                           )
//                                         }
//                                         size="small"
//                                       />
//                                     </TableCell>
//                                     <TableCell
//                                       sx={{
//                                         border: "none",
//                                         textAlign: "right",
//                                         padding: "8px 16px",
//                                         width: "13.33%",
//                                       }}
//                                     >
//                                       <TextField
//                                         disabled={!editMode[category.key]}
//                                         value={item.min_threshold || "-"}
//                                         onChange={(e) =>
//                                           handleSubThresholdChange(
//                                             category.key,
//                                             index,
//                                             "min_threshold",
//                                             e.target.value
//                                           )
//                                         }
//                                         size="small"
//                                       />
//                                     </TableCell>

//                                     <TableCell
//                                       sx={{
//                                         border: "none",
//                                         textAlign: "right",
//                                         padding: "8px 16px",
//                                         width: "13.33%",
//                                       }}
//                                     >
//                                       <TextField
//                                         disabled={!editMode[category.key]}
//                                         value={item.max_threshold || "-"}
//                                         onChange={(e) =>
//                                           handleSubThresholdChange(
//                                             category.key,
//                                             index,
//                                             "max_threshold",
//                                             e.target.value
//                                           )
//                                         }
//                                         size="small"
//                                       />
//                                     </TableCell>
//                                     <TableCell
//                                       sx={{
//                                         fontWeight: "bold",
//                                         textAlign: "right",
//                                         width: "13.33%",
//                                         border: "none",
//                                       }}>
//                                       <IconButton onClick={() => handleEditToggle(category.key)}>
//                                         {editMode[category.key] ? <Save /> : <Edit />}
//                                       </IconButton>
//                                     </TableCell>
//                                   </TableRow>
//                                 ))}
//                                 <TableRow>
//                                   <TableCell colSpan={4}>
//                                     <Button
//                                       variant="outlined"
//                                       onClick={() => handleAddSubData(category.key)}
//                                       disabled={!editMode[category.key]}
//                                     >
//                                       Add Sector
//                                     </Button>
//                                   </TableCell>
//                                 </TableRow>
//                               </TableBody>
//                             </Table>
//                           </Box>
//                         </Collapse>
//                       </TableCell>
//                     </TableRow>
//                   )}
//               </React.Fragment>
//             ))}
//           </TableBody>
//         </Table>
//         <Divider />
//       </Box>

//       <Box sx={{ mt: 2, ml: 3 }}>
//         <RoundedButton
//           title1="Threshold Setup"
//           onClick1={handleSubmit}
//         />
//       </Box>

//     </Box>
//   );
// }
