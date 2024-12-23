import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  useTheme,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  Checkbox,
} from "@mui/material";

import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import RoundedButton from "components/Button/Button";
import ReceiptTable from "components/Table/TanstackTable";
import ConfirmationModal from "components/ConfirmationModal/ConfirmationModal";
import DateFormatter from "utils/DateFormatter";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import DeleteIcon from "@mui/icons-material/Delete";

import { RolesOptions } from "constants/RolesOptions/RolesOptions";
import {
  useDeleteUserDetail,
  useGetUserDetail,
  useGetUserList,
  // usePatchEditUser,
  usePutChangeUserPass,
} from "services/UserManagementServices/services/UserManagemenServices";

import { ColumnDef } from "@tanstack/react-table";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// import { Empty } from "antd";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import { Empty } from "antd";

type PasswordData = {
  password: string;
  confirm_password: string;
};

const schema = yup
  .object({
    password: yup
      .string()
      .required()
      .min(8, "Password must be atleast 8 characters")
      .max(32, "Password must be less than 32 characters")
      .label(""),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password")], "Both Passwords must match")
      .label(""),
  })
  .required();

const ViewUsersIndex = () => {
  const theme = useTheme();
  const [showEditUserPanel, setShowEditUserPanel] = useState(false);
  const [view, setView] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [checked, setChecked] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [viewedUser, setViewedUser] = useState(null);

  const [successBarOpen, setSuccessBarOpen] = useState(false);
  const [errorBarOpen, setErrorBarOpen] = useState(false);

  // const [filteredRoles, setFilteredRoles] = useState(RolesOptions);
  // const [searchRoles, setSearchRoles] = useState("");

  const { data: userListData } = useGetUserList();
  const { mutate: mutateDelete } = useDeleteUserDetail();
  // const { mutate: editUser } = usePatchEditUser();
  const { mutate: changePass } = usePutChangeUserPass();

  const { data: userDetailData, refetch: userDetailRefetch } =
    useGetUserDetail(userId);

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<PasswordData>({
    resolver: yupResolver<any>(schema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleConfirmShowPassword = () => {
    setConfirmShowPassword((show) => !show);
  };

  const handleSearch = () => {
    // if (!searchRoles) {
    //   setFilteredRoles(RolesOptions);
    // }
    // const searchResult = RolesOptions.filter((role) =>
    //   role.label.toLowerCase().includes(searchRoles.toLowerCase())
    // );
    // setFilteredRoles(searchResult);
  };

  const handleSaveUser = async (data: PasswordData) => {
    // const data: PasswordData = {
    //   password: password,
    //   confirm_password: confirmPassword,
    // };
    changePass({ id: userId, data });
  };

  useEffect(() => {
    if (!isSubmitSuccessful) {
      return;
    }
    reset({
      password: "",
      confirm_password: "",
    });
  }, [reset, isSubmitSuccessful]);

  const handleReset = () => {
    reset();
  };

  const handleEditUser = () => {
    setShowEditUserPanel(true);
    // setView(false);
  };

  const handleEditHide = () => {
    setShowEditUserPanel(false);
    setView(true);
  };

  const handleCheckboxChange = (roles) => {
    const index = selectedRoles.findIndex(
      (selectedRole) => selectedRole.id === roles.id
    );
    if (index !== -1) {
      setSelectedRoles(
        selectedRoles.filter((selectedRole) => selectedRole.id !== roles.id)
      );
      setChecked(checked.filter((id) => id !== roles.id));
    } else {
      setSelectedRoles([...selectedRoles, roles]);
      setChecked([...checked, roles.id]);
    }
  };

  type ViewUsersTable = {
    username: string;
    date_joined: string;
    last_login: string;
    id: number;
    actions: any;
  };

  const handleView = (rowId: number) => {
    // const strRowId = String(rowId);

    // if (rowId !== viewedUser) {
    // }
    // if (rowId === viewedUser) {

    if (rowId === viewedUser) {
      setViewedUser(null);
      setView(!view);
    } else {
      setViewedUser(rowId);
      setUserId(rowId);
      setView(true);
    }
    // }

    // if (!view) {

    //   setView(true);
    //   setUserId(data.row.original.id);

    // } else {

    //   setView(false);
    //   setShowEditUserPanel(false);
    // }
  };

  useEffect(() => {
    if (viewedUser) {
      userDetailRefetch();
    }
  }, [viewedUser]);

  const ViewUsersTableHeaders: ColumnDef<ViewUsersTable>[] = [
    {
      header: "Username",
      accessorKey: "username",
      cell: (data) => {
        return <Typography>{data.row.original.username}</Typography>;
      },
    },
    {
      header: () => {
        return (
          <Typography sx={{ textAlign: "center" }}>Created Date</Typography>
        );
      },
      accessorKey: "date_joined",
      cell: (data) => {
        return (
          <Typography sx={{ textAlign: "center" }}>
            {DateFormatter.format(data.row.original.date_joined)}
          </Typography>
        );
      },
    },
    {
      header: () => {
        return <Typography sx={{ textAlign: "center" }}>Last Login</Typography>;
      },
      accessorKey: "last_Login",
      cell: (data) => {
        const lastLoginDate =
          data.row.original.last_login !== null
            ? DateFormatter.format(data.row.original.last_login)
            : "-";
        return (
          <Typography sx={{ textAlign: "center" }}>{lastLoginDate}</Typography>
        );
      },
    },
    {
      header: () => {
        return <Typography sx={{ textAlign: "center" }}>Actions</Typography>;
      },
      accessorKey: "actions",
      cell: (data) => {
        // const [activeRow, setActiveRow] = useState(null);

        // const handleDeleteRow = () => {
        // };
        const [open, setOpen] = useState<boolean>(false);

        return (
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Button
                sx={{
                  color: theme.palette.primary[1100],
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                }}
                startIcon={
                  data.row.original.id === viewedUser && view ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )
                }
                onClick={() => handleView(data.row.original.id)}
              >
                {data.row.original.id === viewedUser && view ? "Hide" : "View"}
              </Button>
              <Button
                color="error"
                sx={{
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                }}
                startIcon={<DeleteIcon />}
                onClick={() => setOpen(true)}
              >
                Delete
              </Button>
              <ConfirmationModal
                open={open}
                setOpen={setOpen}
                title="Confirmation"
                bTitle1="Cancel"
                bTitle2="Confirm"
                message={`Are you sure you want to Delete ${data.row.original.username} ?`}
                onClick={() =>
                  mutateDelete(data.row.original.id, {
                    onSuccess: () => {
                      setSuccessBarOpen(true);
                    },
                    onError: (error) => {
                      setErrorBarOpen(true);
                      console.error(error);
                    },
                  })
                }
              />
            </Box>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <SuccessBar
        snackbarOpen={successBarOpen}
        setSnackbarOpen={setSuccessBarOpen}
        message="Deleted Successfully!"
      />
      <ErrorBar
        snackbarOpen={errorBarOpen}
        setSnackbarOpen={setErrorBarOpen}
        message="Failed to Delete!"
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: { xs: "100%", sm: "80%", md: "90%", lg: "70%" },
        }}
      >
        <Box>
          <HeaderDesc title="User Information" />
        </Box>
        <Box sx={{ width: { xs: "100%", sm: "160%", md: "100%", lg: "150%" } }}>
          {userListData?.responseData.length !== 0 ? (
            <ReceiptTable
              data={userListData?.responseData ?? []}
              columns={ViewUsersTableHeaders}
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <ReceiptTable data={[]} columns={ViewUsersTableHeaders} />
              <Box
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "19px",
                  color: "#212121",
                  textAlign: "center",
                  marginTop: "40px",
                  // width: "inherit",
                  marginLeft: { md: "0%", lg: "25%" },
                }}
              >
                {/* <CloudRoundedIcon sx={{ color: "#E0E0E0", fontSize: "12rem" }} /> */}
                <Empty
                  // imageStyle={{ height: 150, width: 150 }}
                  description="No Data Available"
                />
                {/* <Typography>No Users list available.</Typography> */}
              </Box>
            </Box>
          )}
        </Box>
        {view && !showEditUserPanel && (
          <Box>
            <Stack spacing={2}>
              <Paper
                elevation={0}
                sx={{
                  width: "100%",
                  borderRadius: "12px",
                  border: `1px solid ${theme.palette.primary.dark}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${theme.palette.primary.dark}`,
                  }}
                >
                  <Typography
                    sx={{
                      lineHeight: "17px",
                      fontSize: "16px",
                      fontWeight: 500,
                      color: theme.palette.secondary[1000],
                      padding: 1,
                    }}
                  >
                    User Details
                  </Typography>
                  <Button
                    sx={{ color: theme.palette.primary[1100] }}
                    onClick={handleEditUser}
                  >
                    Edit User
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 2,
                    padding: 1,
                  }}
                >
                  <Box sx={{ width: "50%" }}>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        lineHeight: "16px",
                        color: theme.palette.secondary[1000],
                      }}
                    >
                      {/* {`Username : ${userDetailData?.responseData?.username}`} */}
                      Username{" "}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "16px",
                        color: theme.palette.secondary[700],
                      }}
                    >
                      {userDetailData?.responseData?.username}
                    </Typography>
                  </Box>
                  <Box sx={{ width: "50%" }}>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        lineHeight: "16px",
                        color: theme.palette.secondary[1000],
                      }}
                    >
                      Roles{" "}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Stack>
          </Box>
        )}
        {showEditUserPanel && view && (
          <Box
            component="form"
            onSubmit={handleSubmit(handleSaveUser)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              // width: { xs: "100%", sm: "80%", md: "100%", lg: "70%" },
            }}
          >
            <Box
              sx={{ width: { sm: "130%", md: "100%", lg: "200%", xl: "150%" } }}
            >
              <Stack spacing={2}>
                <Paper
                  elevation={0}
                  sx={{
                    width: "100%",
                    borderRadius: "12px",
                    border: `1px solid ${theme.palette.primary.dark}`,
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderBottom: `1px solid ${theme.palette.primary.dark}`,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            lineHeight: "17px",
                            fontSize: "16px",
                            fontWeight: 500,
                            color: theme.palette.secondary[1000],
                            padding: 1,
                          }}
                        >
                          Edit User Details
                        </Typography>
                      </Box>
                      <Box>
                        <Button
                          sx={{
                            color: theme.palette.primary[1100],
                            textTransform: "none",
                          }}
                          onClick={handleEditHide}
                        >
                          Hide
                        </Button>
                      </Box>
                    </Box>
                    <Box sx={{ p: "8px 0 0 16px" }}>
                      <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                        Username
                      </Typography>
                      <Typography
                        sx={{
                          mt: 1,
                          fontSize: "14px",
                          fontWeight: 400,
                          lineHeight: "16px",
                          color: theme.palette.secondary[700],
                        }}
                      >
                        {userDetailData?.responseData?.username}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "50%",
                        display: "flex",
                        flexDirection: "row",
                        padding: 2,
                        gap: 2,
                      }}
                    >
                      {/* <Box>
                      <TypographyLabel title="Change Username" />
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Username"
                      />
                    </Box> */}
                      <Box>
                        <TypographyLabel title="Create New Password" />
                        <Controller
                          name="password"
                          control={control}
                          render={({ field }) => {
                            return (
                              <TextField
                                {...field}
                                fullWidth
                                type={showPassword ? "text" : "password"}
                                size="small"
                                placeholder="********"
                                // value={password}
                                // onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton onClick={handleShowPassword}>
                                        {showPassword ? (
                                          <VisibilityOff
                                            sx={{
                                              "&.MuiSvgIcon-root": {
                                                width: "20px",
                                                height: "20px",
                                              },
                                            }}
                                          />
                                        ) : (
                                          <Visibility
                                            sx={{
                                              "&.MuiSvgIcon-root": {
                                                width: "20px",
                                                height: "20px",
                                              },
                                            }}
                                          />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            );
                          }}
                        />
                      </Box>
                      <Box>
                        <TypographyLabel title="Confirm New Password" />
                        <Controller
                          name="confirm_password"
                          control={control}
                          render={({ field }) => {
                            return (
                              <TextField
                                fullWidth
                                {...field}
                                type={confirmShowPassword ? "text" : "password"}
                                size="small"
                                placeholder="********"
                                // value={confirmPassword}
                                // onChange={(e) =>
                                //   setConfirmPassword(e.target.value)
                                // }
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        onClick={handleConfirmShowPassword}
                                      >
                                        {confirmShowPassword ? (
                                          <VisibilityOff
                                            sx={{
                                              "&.MuiSvgIcon-root": {
                                                width: "20px",
                                                height: "20px",
                                              },
                                            }}
                                          />
                                        ) : (
                                          <Visibility
                                            sx={{
                                              "&.MuiSvgIcon-root": {
                                                width: "20px",
                                                height: "20px",
                                              },
                                            }}
                                          />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            );
                          }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
                      <Box sx={{ width: "50%" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                            p: "8px  16px",
                            width: "100%",
                          }}
                        >
                          <HeaderDesc title="Assign Roles" />
                          <TextField
                            size="small"
                            placeholder="Search"
                            sx={{
                              "& .MuiInputBase-root": {
                                borderRadius: "28px",
                              },
                            }}
                            // onChange={(e) => setSearchRoles(e.target.value)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="search"
                                    size="small"
                                    onClick={handleSearch}
                                  >
                                    <SearchOutlinedIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            maxHeight: 340,
                            overflow: "auto",
                          }}
                        >
                          <List>
                            {RolesOptions.map((roles, index) => (
                              <Box key={roles.id}>
                                <ListItem
                                  id={roles.label}
                                  sx={{ padding: "8px 0 0 16px" }}
                                >
                                  <ListItemText
                                    sx={{
                                      color: theme.palette.secondary[1000],
                                    }}
                                    primary={roles.label}
                                  />
                                  <ListItemIcon>
                                    <Checkbox
                                      edge="end"
                                      // checked={checked.indexOf(roles.id) !== -1}
                                      checked={selectedRoles.some(
                                        (selectedRole) =>
                                          selectedRole.id === roles.id
                                      )}
                                      sx={{ padding: "0" }}
                                      onChange={() =>
                                        handleCheckboxChange(roles)
                                      }
                                    />
                                  </ListItemIcon>
                                </ListItem>
                                {index !== RolesOptions.length - 1 && (
                                  <Divider sx={{ margin: "0 24px 0 16px" }} />
                                )}
                              </Box>
                            ))}
                          </List>
                        </Box>
                      </Box>

                      <Box>
                        <Divider
                          orientation="vertical"
                          sx={{ my: 2, height: "25rem" }}
                        />
                      </Box>
                      <Box sx={{ width: "50%" }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: 1,
                            mt: 1,
                            padding: 1,
                          }}
                        >
                          <HeaderDesc title="Current Roles" />
                          <Box>
                            {selectedRoles.length === 0 ? (
                              <Box mt={1}>
                                <Typography>No Roles Selected</Typography>
                              </Box>
                            ) : (
                              <List>
                                {checked.map((id) => (
                                  <ListItem id={id} sx={{ padding: "0" }}>
                                    <ListItemText
                                      sx={{
                                        color: theme.palette.secondary[1000],
                                      }}
                                      primary={
                                        RolesOptions.find(
                                          (roles) => roles.id === id
                                        ).label
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Stack>
            </Box>
            <Box>
              <RoundedButton
                title1="Save User"
                title2="Reset"
                onClick1={handleSaveUser}
                onClick2={handleReset}
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ViewUsersIndex;
