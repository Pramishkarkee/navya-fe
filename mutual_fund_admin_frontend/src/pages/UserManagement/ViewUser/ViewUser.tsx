import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import DeleteIcon from "@mui/icons-material/Delete";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import RoundedButton from "components/Button/Button";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PostingTable from "components/Table/PostingTable";

import {
  useDeleteUserDetail,
  useGetUserDetailData,
  useGetUserList,
  usePostChangeUserPass,
} from "services/UserManagement/ViewUserServices";
import ConfirmationModal from "components/ConfirmationModal/ConfirmationModal";
import {
  useGetUserRoleDetails,
  useGetUserRoles,
} from "services/Roles/RolesServices";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import axios from "axios";

export interface ViewUserInput {
  new_password: string;
  confirm_new_password: string;
}

type ViewUsersTable = {
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  branch: string;
  id: number;
  actions: any;
};

const ViewUsersIndex = () => {
  const theme = useTheme();
  const [showEditUserPanel, setShowEditUserPanel] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [checked, setChecked] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [view, setView] = useState(false);
  const [userId, setUserId] = useState<any>(null);
  const [viewedUser, setViewedUser] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [checkedRoles, setCheckedRoles] = useState(null);

  const [successMsgs, setSuccessMsgs] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const {
    data: userDataList,
    isSuccess: userListSuccess,
    refetch: userDataListRefetch,
  } = useGetUserList(pagination.pageIndex + 1);

  const {
    mutate: changePassword,
    isSuccess: changePasswordSuccess,
    error: changePasswordError,
  } = usePostChangeUserPass();

  const { data: userDetailData, refetch: userDetailDataRefetch } =
    useGetUserDetailData(userId);

  const userRoleId = userDetailData && userDetailData?.role_id;

  const { mutate: deleteUser, isSuccess: userDeleteSuccess } =
    useDeleteUserDetail();
  const { data: userRolesData } = useGetUserRoles();
  const { data: userRoleDetails } = useGetUserRoleDetails();

  const email = userDetailData?.email;
  const totalPage = Math.ceil(userDataList?.responseData?.data?.count / 10);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<ViewUserInput>({
    defaultValues: {
      new_password: "",
      confirm_new_password: "",
    },
  });

  useEffect(() => {
    if (userDataList?.responseData?.data?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (userDataList?.responseData?.data?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [userDataList, userListSuccess]);

  const handleConfirmShowPassword = () => {
    setConfirmShowPassword((show) => !show);
  };

  // const handleSearch = () => {
  //   console.log("Search Clicked!!!");
  // };

  useEffect(() => {
    userRoleDetails?.responseData?.data?.results?.map((roles) => {
      if (userRoleId === roles.id) {
        setSelectedRoles([roles]);
      }
    });
  }, [userRoleId, userRoleDetails]);

  const handleCheckboxChange = (roles) => {
    const index = selectedRoles.findIndex(
      (selectedRole) => selectedRole.id === roles.id
    );
    if (index !== -1) {
      // setSelectedRoles(
      //   selectedRoles.filter((selectedRole) => selectedRole.id !== roles.id)
      // );
      // setChecked(checked.filter((id) => id !== roles.id));
      setSelectedRoles([]);
      setChecked([]);
      setCheckedRoles(null);
    } else {
      setSelectedRoles([roles]);
      setChecked([roles.id]);
      setCheckedRoles(roles.id);
    }
  };

  const handleSaveUser = (data: ViewUserInput) => {
    const emailObj = { email: email };
    const allData =
      data.new_password && data.confirm_new_password
        ? { ...data, ...emailObj, role_id: checkedRoles }
        : { ...emailObj, role_id: checkedRoles };

    changePassword(allData, {
      onSuccess: () => {
        setSuccessMsgs("User Information Changed Successfully");
        setSnackbarOpen(true);
        reset();
        userDataListRefetch();
        setSelectedRoles([]);
        setChecked([]);
        setCheckedRoles(null);
        setView(false);
      },
      // onError: (error) => {
      //   // setErrorMessage("Something went wrong. Please try again.");
      //   setErrorSnackbarOpen(true);
      //   // setErrorMessage(error.message);
      //   if (axios.isAxiosError(changePasswordError) && changePasswordError?.response) {
      //     const errorData = changePasswordError.response.data;

      //     const errorMessages = [];
      //     if (errorData?.new_password) {
      //       errorMessages.push(`New Password: ${errorData.new_password.join(", ")}`);
      //     }
      //     else if (errorData?.confirm_new_password) {
      //       errorMessages.push(`Confirm New Password: ${errorData.confirm_new_password.join(", ")}`);
      //     }
      //     else if (errorData?.role_id) {
      //       errorMessages.push(`Role: ${errorData.role_id.join(", ")}`);

      //     }
      //     setErrorMessage(errorMessages.length > 0 ? errorMessages.join(" | ") : "An unknown error occurred.");
      //   } else {
      //     setErrorMessage("Something went wrong. Please try again.");
      //   }
      //   setErrorSnackbarOpen(true);

      // },
      onError: (changePasswordError) => {
        setErrorSnackbarOpen(true);

        const errorMessage =
          axios.isAxiosError(changePasswordError) &&
          changePasswordError?.response
            ? (() => {
                const errorData = changePasswordError.response.data;
                const errorMessages = [];

                errorData?.new_password
                  ? errorMessages.push(
                      `New Password: ${errorData.new_password.join(", ")}`
                    )
                  : null;

                errorData?.confirm_new_password
                  ? errorMessages.push(
                      `Confirm New Password: ${errorData.confirm_new_password.join(
                        ", "
                      )}`
                    )
                  : null;

                errorData?.role_id
                  ? errorMessages.push(`Role: ${errorData.role_id.join(", ")}`)
                  : null;

                return errorMessages.length > 0
                  ? errorMessages.join(" | ")
                  : "An unknown error occurred.";
              })()
            : "Something went wrong. Please try again.";

        setErrorMessage(errorMessage);
        setErrorSnackbarOpen(true);
      },
    });
  };

  // useEffect(() => {
  //   if (isSubmitSuccessful && changePasswordSuccess) {
  //     setSuccessMsgs("User Information Changed Successfully");
  //     setSnackbarOpen(true);
  //     reset();
  //     userDataListRefetch();
  //     setSelectedRoles([]);
  //     setChecked([]);
  //     setCheckedRoles(null);
  //     setView(false);
  //   }
  // }, [isSubmitSuccessful, reset, changePasswordSuccess, userDataListRefetch]);

  useEffect(() => {
    if (userDeleteSuccess) {
      setSuccessMsgs("User Deleted Successfully");
      setSnackbarOpen(true);
    }
  }, [userDeleteSuccess]);

  const handleReset = () => {
    reset();
    setSelectedRoles([]);
    setChecked([]);
    setCheckedRoles(null);
  };

  const handleEditUser = () => {
    setShowEditUserPanel(true);
  };

  const handleEditHide = () => {
    setShowEditUserPanel(false);
    setView(true);
  };

  const handleView = (rowId: number) => {
    // const strRowId = String(rowId);
    // if (rowId !== viewedUser) {
    // }
    // console.log("id", rowId);
    if (rowId === viewedUser) {
      setViewedUser(null);
      setView(!view);
    } else {
      setViewedUser(rowId);
      setUserId(rowId);
      setView(true);
    }
  };

  useEffect(() => {
    if (viewedUser) {
      userDetailDataRefetch();
    }
  }, [viewedUser, userDetailDataRefetch]);

  const ViewUsersTableHeaders: ColumnDef<ViewUsersTable>[] = [
    {
      header: "Username",
      accessorKey: "username",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {data.row.original.username}
          </Typography>
        );
      },
    },
    {
      header: "FullName",
      accessorKey: "fullName",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {data.row.original.full_name}
          </Typography>
        );
      },
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {data.row.original.email}
          </Typography>
        );
      },
    },
    {
      header: "Phone Number",
      accessorKey: "phoneNumber",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {data.row.original.phone_number}
          </Typography>
        );
      },
    },
    {
      header: "Branch",
      accessorKey: "branch",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {" "}
            {data.row.original.branch}
          </Typography>
        );
      },
    },
    {
      header: () => {
        return (
          <Typography
            sx={{ fontSize: "14px", textAlign: "center", fontWeight: "600" }}
          >
            Actions
          </Typography>
        );
      },
      accessorKey: "actions",
      cell: (data) => {
        // const handleDeleteRow = () => {
        //   console.log("Delete row clicked");
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
                  fontSize: "14px",
                  fontWeight: "400",
                }}
                startIcon={
                  data.row.original.id === viewedUser && view ? (
                    <VisibilityOff sx={{ fontSize: "14px" }} />
                  ) : (
                    <Visibility sx={{ fontSize: "14px" }} />
                  )
                }
                onClick={() => handleView(data.row.original.id)}
              >
                {data.row.original.id === viewedUser && view ? "Hide" : "View"}
              </Button>
              <Button
                color="error"
                sx={{ fontSize: "14px", fontWeight: "400" }}
                startIcon={<DeleteIcon sx={{ fontSize: "14px" }} />}
                onClick={() => setOpen(true)}
                disabled={
                  userRolesData && userRolesData?.responseData?.user
                    ? !userRolesData?.responseData?.user?.admin_user_delete
                    : false
                }
                // onClick={() => mutateDelete(data.row.original.id)}
              >
                Delete
              </Button>
              <ConfirmationModal
                open={open}
                setOpen={setOpen}
                title="Delete the User"
                message={`Are you sure you want to Delete ${data.row.original.username} ?`}
                onClick={() => {
                  deleteUser(data.row.original.id);
                  setView(false);
                }}
              />
            </Box>
          </Box>
        );
      },
    },
  ];

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleSaveUser)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: { xs: "100%", sm: "100%", md: "100%", lg: "90%" },
      }}
    >
      <SuccessBar
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        message={successMsgs}
      />
      <ErrorBar
        snackbarOpen={errorSnackbarOpen}
        setSnackbarOpen={setErrorSnackbarOpen}
        message={errorMessage}
      />
      <Box>
        <HeaderDesc title="User Information" />
      </Box>
      {userDataList?.responseData?.data?.results && (
        <Box>
          <PostingTable
            columns={ViewUsersTableHeaders}
            data={userDataList?.responseData?.data?.results ?? []}
            setSelectedRows={setSelectedRows}
            pagination={pagination}
            setPagination={setPagination}
            next={next}
            prev={prev}
            pageCount={totalPage}
          />
        </Box>
      )}

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
                    fontSize: "14px",
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
                <Box
                  sx={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        lineHeight: "16px",
                        color: theme.palette.secondary[1000],
                      }}
                    >
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
                      {userDetailData?.username
                        ? userDetailData?.username
                        : "-"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        lineHeight: "16px",
                        color: theme.palette.secondary[1000],
                      }}
                    >
                      Branch Name{" "}
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
                      {userDetailData?.branch}
                    </Typography>
                  </Box>
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

                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "16px",
                      color: theme.palette.secondary[700],
                    }}
                  >
                    {userDetailData?.role_description}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Stack>
        </Box>
      )}
      {showEditUserPanel && view && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{ width: { sm: "130%", md: "100%", lg: "125%", xl: "100%" } }}
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
                          fontSize: "14px",
                          fontWeight: 500,
                          color: theme.palette.secondary[1000],
                          padding: 1,
                        }}
                      >
                        Edit User
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
                  <Box
                    sx={{
                      width: "100%",
                      padding: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        gap: 4,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            lineHeight: "16px",
                            color: theme.palette.secondary[1000],
                          }}
                        >
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
                          {userDetailData?.username
                            ? userDetailData?.username
                            : "-"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            lineHeight: "16px",
                            color: theme.palette.secondary[1000],
                          }}
                        >
                          Email{" "}
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
                          {email}
                        </Typography>
                      </Box>
                    </Box>

                    {/* <Box>
                      <TypographyLabel title="Change Username" />
                      <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            placeholder="Username"
                          />
                        )}
                      />
                    </Box> */}
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                      {/* <Box>
                        <TypographyLabel title="Email" />
                        <Controller
                          name="email"
                          // defaultValue={`${userDetailData.email}`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              disabled
                              value={userDetailData.email}
                              fullWidth
                              size="small"
                              type="email"
                              placeholder="Email"
                            />
                          )}
                        />
                      </Box> */}

                      {/* <Box>
                        <TypographyLabel title="Old Password" />
                        <Controller
                          name="old_password"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type={showPassword ? "text" : "password"}
                              size="small"
                              placeholder="********"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton onClick={handleShowPassword}>
                                      {showPassword ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                      </Box> */}
                      <Box>
                        <TypographyLabel title="Create New Password" />
                        <Controller
                          name="new_password"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type={showNewPassword ? "text" : "password"}
                              size="small"
                              placeholder="********"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() =>
                                        setShowNewPassword((show) => !show)
                                      }
                                    >
                                      {showNewPassword ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                      </Box>
                      <Box>
                        <TypographyLabel title="Confirm New Password" />
                        <Controller
                          name="confirm_new_password"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type={confirmShowPassword ? "text" : "password"}
                              size="small"
                              placeholder="********"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={handleConfirmShowPassword}
                                    >
                                      {confirmShowPassword ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                      </Box>
                      {/* <Box sx={{ width: 300 }}>
                        <TypographyLabel title="Branch" />
                        <Controller
                          name="branch"
                          control={control}
                          render={({ field }) => (
                            <Select {...field} size="small" fullWidth>
                              <MenuItem value="Thapathali Branch">
                                Thapathali Branch
                              </MenuItem>
                              <MenuItem value="Durbarmarg Branch">
                                Durbarmarg Branch
                              </MenuItem>
                              <MenuItem value="Naxal Branch">
                                Naxal Branch
                              </MenuItem>
                            </Select>
                          )}
                        />
                      </Box> */}
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
                          padding: 1,
                          width: "100%",
                        }}
                      >
                        <HeaderDesc title="Assign Roles" />
                      </Box>
                      <Box
                        sx={{
                          mb: 2,
                          maxHeight: 350,
                          overflow: "auto",
                        }}
                      >
                        <List>
                          {userRoleDetails?.responseData?.data?.results?.map(
                            (roles, index) => (
                              <Box key={index}>
                                <ListItem
                                  id={roles.id}
                                  sx={{ padding: "0 0 0 16px" }}
                                >
                                  <ListItemText
                                    sx={{
                                      color: theme.palette.secondary[1000],
                                    }}
                                    primary={roles.role_description}
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
                                {index !==
                                  userRoleDetails?.responseData?.data?.results
                                    .length -
                                    1 && (
                                  <Divider sx={{ margin: "0 24px 0 16px" }} />
                                )}
                              </Box>
                            )
                          )}
                        </List>
                      </Box>
                    </Box>

                    <Box>
                      <Divider orientation="vertical" sx={{}} />
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
                        <HeaderDesc title="Role Functions" />
                        <Box>
                          {selectedRoles.length === 0 ? (
                            <Box mt={1}>
                              <Typography>No Roles Selected</Typography>
                            </Box>
                          ) : (
                            <>
                              {selectedRoles[0]?.role_functions.length === 0 ? (
                                <Typography>
                                  No Roles function for General Staff
                                </Typography>
                              ) : (
                                <List>
                                  {selectedRoles[0]?.role_functions.map(
                                    (functionName) => (
                                      <Typography
                                        key={functionName}
                                        sx={{
                                          fontSize: "16px",
                                          fontWeight: 500,
                                        }}
                                      >
                                        {functionName.charAt(0).toUpperCase() +
                                          functionName.slice(1)}
                                      </Typography>
                                    )
                                  )}
                                </List>
                              )}
                            </>
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
              onClick2={handleReset}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ViewUsersIndex;
