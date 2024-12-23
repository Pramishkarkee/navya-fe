import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import HeaderDesc from 'components/HeaderDesc/HeaderDesc';
import {
  usePatchUserRoles,
  usePostUserRoles,
  useGetUserRolesList,
  useGetUserPermissions,
} from 'services/UserManagementServices/services/UserManagemenServices';
import SuccessBar from 'components/Snackbar/SuccessBar';
import ErrorBar from 'components/Snackbar/ErrorBar';
import axios from 'axios';
import { colorTokens } from '../../../theme';

// Memoized TableRow component to prevent unnecessary re-renders
interface MemoizedTableRowProps {
  perm: {
    id: number;
    name: string;
  };
  allServiceMethods: string[];
  currentRole: {
    permissions: {
      id: number;
      userpermissions: {
        service_method: string;
      }[];
    }[];
  } | null;
  AllPermissionList: {
    responseData: {
      id: number;
      userpermissions: {
        service_method: string;
      }[];
    }[];
  } | undefined;
  onPermissionChange: (permissionId: number, serviceMethod: string) => void;
  theme: any;
}

// eslint-disable-next-line react-refresh/only-export-components
const MemoizedTableRow = React.memo(({
  perm,
  allServiceMethods,
  currentRole,
  AllPermissionList,
  onPermissionChange,
  theme
}: MemoizedTableRowProps) => (
  <TableRow sx={{p:0.5}} key={perm.id}>
    <TableCell sx={{
      color: theme.palette.grey[600],
      p:1,
      fontWeight: 500,
    }}>{perm.name}</TableCell>
    {allServiceMethods.map((method) => (
      <TableCell sx={{p:1, textAlign:'center'}} key={`${perm.id}-${method}`}>
        <Checkbox
          disabled={!AllPermissionList?.responseData.some(
            (rolePerm) => rolePerm.id === perm.id && rolePerm.userpermissions.some(
              (userPerm) => userPerm.service_method === method
            )
          )}
          checked={currentRole?.permissions.some(
            (rolePerm) => rolePerm.id === perm.id && rolePerm.userpermissions.some(
              (userPerm) => userPerm.service_method === method
            )
          )}
          onChange={() => onPermissionChange(perm.id, method)}
        />
      </TableCell>
    ))}
  </TableRow>
), (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.perm.id === nextProps.perm.id &&
    JSON.stringify(prevProps.currentRole?.permissions) === JSON.stringify(nextProps.currentRole?.permissions) &&
    JSON.stringify(prevProps.allServiceMethods) === JSON.stringify(nextProps.allServiceMethods)
  );
});

// Memoized ListItem component
interface MemoizedListItemProps {
  role: {
    name: string;
  };
  index: number;
  selectedRoleIndex: number;
  onClick: (index: number) => void;
  theme: any;
}

// eslint-disable-next-line react-refresh/only-export-components
const MemoizedListItem: React.FC<MemoizedListItemProps> = React.memo(({ 
  role, 
  index, 
  selectedRoleIndex, 
  onClick, 
  theme 
}) => (
  <ListItem
    sx={{
      borderRadius: '5px',
      mb: 1,
      color: theme.palette.grey[600],
      fontWeight: 800,
      px: 1.5,
      py: 0.2,
    
      "&.MuiListItem-button": {
        backgroundColor: index === selectedRoleIndex ? colorTokens.mainColor[50] : 'transparent',
        color: index === selectedRoleIndex ? colorTokens.mainColor[800] : theme.palette.grey[600],
        // fontWeight: index === selectedRoleIndex ? 800 : 500,
      },
      "& .MuiListItemText-primary": {
        fontWeight: index === selectedRoleIndex ? 700 : 500,
      },
      "&:hover": { backgroundColor: theme.palette.grey[200] },

    }}
    button
    selected={index === selectedRoleIndex}
    onClick={() => onClick(index)}
  >
    <ListItemText primary={role.name} />
  </ListItem>
));

// eslint-disable-next-line react-refresh/only-export-components
const RoleAssignment = () => {
  const theme = useTheme();
  const [roles, setRoles] = useState([]);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [currentRole, setCurrentRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataUpdated, setDataUpdated] = useState(false);
  const [successBarOpen, setSuccessBarOpen] = useState(false);
  const [errorBarOpen, setErrorBarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { data: AllPermissionList } = useGetUserPermissions();
  const { data: userRolesList } = useGetUserRolesList();
  const { mutate: postUserRoles, isPending: postPending } = usePostUserRoles();
  const { mutate: patchUserRoles, isPending: patchPending } = usePatchUserRoles(
    roles[selectedRoleIndex]?.id
  );

  // Debounced search term update
  const debouncedSetSearchTerm = useCallback((value) => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(value);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Memoized service methods calculation
  const allServiceMethods: string[] = useMemo(() => {
      if (!roles.length) return [];
      const methods = new Set<string>();
      roles.forEach(role =>
        role?.permissions?.forEach(perm =>
          perm?.userpermissions?.forEach(userPerm => 
            methods.add(userPerm.service_method)
          )
        )
      );
      return Array.from(methods);
    }, [roles]);

  // Memoized filtered permissions
  const filteredPermissions = useMemo(() => {
    if (!searchTerm || !AllPermissionList?.responseData) return AllPermissionList?.responseData;
    return AllPermissionList.responseData.filter(permission =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [AllPermissionList, searchTerm]);

  // Optimized permission change handler
  const handlePermissionChange = useCallback((permissionId, serviceMethod) => {
    setDataUpdated(true);
    setCurrentRole(prevRole => {
      if (!prevRole) return null;

      const matchingPermission = AllPermissionList?.responseData.find(
        perm => perm.id === permissionId
      );
      const matchingUserPermission = matchingPermission?.userpermissions.find(
        userPerm => userPerm.service_method === serviceMethod
      );

      const existingPermission = prevRole.permissions.find(
        perm => perm.id === permissionId
      );

      if (!existingPermission) {
        return {
          ...prevRole,
          permissions: [
            ...prevRole.permissions,
            {
              id: permissionId,
              name: matchingPermission?.name || '',
              service_type: matchingPermission?.service_type || '',
              userpermissions: [{
                id: matchingUserPermission?.id || null,
                service_method: serviceMethod,
              }],
            },
          ],
        };
      }

      return {
        ...prevRole,
        permissions: prevRole.permissions.map(perm => {
          if (perm.id !== permissionId) return perm;

          const isChecked = perm.userpermissions.some(
            userPerm => userPerm.service_method === serviceMethod
          );

          return {
            ...perm,
            userpermissions: isChecked
              ? perm.userpermissions.filter(
                  userPerm => userPerm.service_method !== serviceMethod
                )
              : [
                  ...perm.userpermissions,
                  {
                    id: matchingUserPermission?.id || null,
                    service_method: serviceMethod,
                  },
                ],
          };
        }),
      };
    });
  }, [AllPermissionList]);

  // Optimized role name/description update
  const handleRoleUpdate = useCallback((field, value) => {
    setDataUpdated(true);
    setCurrentRole(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  useEffect(() => {
    if (userRolesList?.responseData) {
      setRoles(userRolesList.responseData);
      setCurrentRole(userRolesList.responseData[0] || null);
    }
  }, [userRolesList]);

  const handleAddRole = useCallback(() => {
    setDataUpdated(true);
    const newRole = {
      name: `New Role ${roles.length + 1}`,
      description: '',
      permissions: [],
    };
    setRoles(prevRoles => [...prevRoles, newRole]);
    setSelectedRoleIndex(roles.length);
    setCurrentRole(newRole);
  }, [roles]);

  const handleRoleClick = useCallback(index => {
    setSelectedRoleIndex(index);
    setCurrentRole(roles[index]);
    setDataUpdated(false);
  }, [roles]);

  const handleSave = useCallback(() => {
    const roleExists = currentRole?.id !== undefined;
    const permissionList = currentRole.permissions.flatMap(perm =>
      perm.userpermissions.map(userPerm => userPerm.id)
    );

    const patchPayload = {
      name: currentRole.name,
      description: currentRole.description,
      permission_ids: permissionList,
    };
    const postPayload = {
      name: currentRole.name,
      description: currentRole.description,
      permission_ids: permissionList,
    };

    const saveHandler = roleExists ? patchUserRoles : postUserRoles;

    saveHandler(roleExists ? patchPayload : postPayload, {
      onSuccess: () => {
        setSuccessBarOpen(true);
        setDataUpdated(false);
        setRoles(prevRoles =>
          prevRoles.map((role, index) =>
            index === selectedRoleIndex ? currentRole : role
          )
        );
      },
      onError: error => {
        console.log(error);
        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage(
             error?.response?.data?.responseData?.errors?.name 
              ? `Role: ${error?.response?.data?.responseData?.errors?.name[0]}`
              :  error?.response?.data?.responseData?.errors?.permission_ids
              ? error?.response?.data?.responseData?.errors?.permission_ids[0]
              : error?.response?.data?.message
              ? error?.response?.data?.message
              : 'Error in submitting data!'
          );
          setErrorBarOpen(true);
        }
      }
    });
  }, [currentRole, patchUserRoles, postUserRoles, selectedRoleIndex]);

  const handleDiscard = useCallback(() => {
    setDataUpdated(false);
    setCurrentRole(roles[selectedRoleIndex]);
  }, [roles, selectedRoleIndex]);

  return (
    <>
      <SuccessBar
        message={'Successfully Submitted!'}
        snackbarOpen={successBarOpen}
        setSnackbarOpen={setSuccessBarOpen}
      />
      <ErrorBar
        message={errorMessage}
        snackbarOpen={errorBarOpen}
        setSnackbarOpen={setErrorBarOpen}
      />
      <Box sx={{ width: { xs: '100%', md: '110%', lg: '160%', xl: '170%' }, maxWidth: '1900px', display: 'flex' }}>
        {/* Sidebar with Roles */}
        <Box borderRight="2px solid #ddd" p={2} minWidth="200px">
          <HeaderDesc title="Roles" />
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddRole}
            sx={{ color: theme.palette.primary.main, mt: 1 }}
          >
            Add Role
          </Button>
          <List sx={{
            maxHeight: '580px',
            overflow: 'auto',
            "&::-webkit-scrollbar": { width: '4px' },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.grey[300],
              borderRadius: '10px',
            },
          }}>
            {roles?.map((role, index) => (
              <MemoizedListItem
                key={role.name}
                role={role}
                index={index}
                selectedRoleIndex={selectedRoleIndex}
                onClick={handleRoleClick}
                theme={theme}
              />
            ))}
          </List>
        </Box>

        {/* Role Assignment Table */}
        <Box flex={2} px={2} mt={2}>
          <HeaderDesc title="Role Assignment" />
          <Paper variant="outlined" sx={{ mb: 2, p: 1, mt: 2, bgcolor: '#f5f5f5', borderRadius: '5px', border: '1px solid #f5f5f5' }}>
            <Typography variant="body2" sx={{color:theme.palette.grey[600],fontWeight:500}}>Role</Typography>
            <TextField
              variant="standard"
              value={currentRole?.name || ''}
              onChange={(e) => handleRoleUpdate('name', e.target.value)}
              fullWidth
              sx={{ 
                bgcolor: '#f5f5f5', 
                // fontWeight:800,
                "& .MuiInputBase-input": { fontWeight: 600, color: colorTokens.mainColor[800] },

               }}
            />
          </Paper>
          <Paper variant="outlined" sx={{ mb: 2, p: 1, mt: 2, bgcolor: '#f5f5f5', borderRadius: '5px', border: '1px solid #f5f5f5' }}>
            <Typography variant="body2" sx={{color:theme.palette.grey[600],fontWeight:500}}>Description</Typography>
            <TextField
              variant="standard"
              multiline
              minRows={1}
              value={currentRole?.description || ''}
              onChange={(e) => handleRoleUpdate('description', e.target.value)}
              fullWidth
              sx={{ bgcolor: '#f5f5f5', wordBreak: 'break-all' }}
            />
          </Paper>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for Permission"
            onChange={(e) => debouncedSetSearchTerm(e.target.value)}
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              bgcolor: '#f5f5f5',
              borderRadius: '50px',
              "& .MuiOutlinedInput-notchedOutline": { border: 'none' },
            }}
          />
          <TableContainer elevation={0} component={Paper} sx={{
            borderRadius: '8px',
            border: `2px solid ${theme.palette.grey[300]}`,
            maxHeight: '340px',
            overflow: 'auto',
            "&::-webkit-scrollbar": { width: '5px' },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.grey[300],
              borderRadius: '10px',
            },
          }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{p:1}}>Permission</TableCell>
                  {allServiceMethods.map((method) => (
                    <TableCell sx={{p:1, textAlign:'center'}} key={String(method)}>{String(method)}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPermissions?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={allServiceMethods.length + 1} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (allServiceMethods && filteredPermissions && currentRole && AllPermissionList) ? (
                  filteredPermissions.map((perm) => (
                    <MemoizedTableRow
                      key={perm.id}
                      perm={perm}
                      allServiceMethods={allServiceMethods}
                      currentRole={currentRole}
                      AllPermissionList={AllPermissionList}
                      onPermissionChange={handlePermissionChange}
                      theme={theme}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={allServiceMethods.length + 1} align="center">
                      Loading Data...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Action Buttons */}


          <Box display="flex" justifyContent="space-between">
            <Box sx={{mt:2}}>
              <Button
                variant="outlined"
                onClick = {() => {
                  setDataUpdated(true);
                  setCurrentRole(prevRole => {
                    if (!prevRole) return null;
                    return {
                      ...prevRole,
                      permissions: []
                    };
                  });
                }
                }
                sx={{ textTransform: 'capitalize', color: theme.palette.secondary.main }}
                // disabled={!dataUpdated}
              >
                Remove All Permissions
              </Button>
            </Box>

          <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
            <Button
              variant="outlined"
              onClick={handleDiscard}
              sx={{ textTransform: 'capitalize', color: theme.palette.secondary.main }}
              disabled={!dataUpdated}
            >
              Discard Changes
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ 
                textTransform: 'capitalize', 
                width: '100px', 
                bgcolor: theme.palette.primary.main,
                "&:hover": { bgcolor: theme.palette.primary.pureColor},
              }}
              disabled={!dataUpdated}
            >
              Save {" "} 
              {(patchPending || postPending) && <CircularProgress size={20} sx={{color:'#fff', ml:1}} />}
            </Button>
          </Box>
          </Box>

        </Box>
      </Box>
    </>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(RoleAssignment);










// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { useTheme } from '@mui/material';
// import CircularProgress from '@mui/material/CircularProgress';
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Checkbox,
//   Paper,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import SearchIcon from '@mui/icons-material/Search';
// import InputAdornment from '@mui/material/InputAdornment';
// import HeaderDesc from 'components/HeaderDesc/HeaderDesc';
// import {
//   usePatchUserRoles,
//   usePostUserRoles,
//   useGetUserRolesList,
//   useGetUserPermissions,
// } from 'services/UserManagementServices/services/UserManagemenServices';
// import SuccessBar from 'components/Snackbar/SuccessBar';
// import ErrorBar from 'components/Snackbar/ErrorBar';
// import axios from 'axios';

// interface UserPermission {
//   id: number;
//   service_method: string;
// }

// interface Permission {
//   id: number;
//   name: string;
//   service_type: string;
//   userpermissions: UserPermission[];
// }

// interface RoleData {
//   id?: number;
//   name: string;
//   description: string;
//   permissions: Permission[];
// }

// const RoleAssignment = () => {
//   const theme = useTheme();
//   const [roles, setRoles] = useState<RoleData[]>([]);
//   const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
//   const [currentRole, setCurrentRole] = useState<RoleData | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [dataUpdated, setDataUpdated] = useState(false);
//   const [successBarOpen, setSuccessBarOpen] = useState(false);
//   const [errorBarOpen, setErrorBarOpen] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   const { data: AllPermissionList } = useGetUserPermissions();
//   const { data: userRolesList } = useGetUserRolesList();

//   const { mutate: postUserRoles, isPending:postPending } = usePostUserRoles();
//   const { mutate: patchUserRoles, isPending:patchPending } = usePatchUserRoles(
//     roles[selectedRoleIndex]?.id
//   );

//   useEffect(() => {
//     if (userRolesList?.responseData) {
//       setRoles(userRolesList.responseData);
//       setCurrentRole(userRolesList.responseData[0] || null);
//     }
//   }, [userRolesList]);

//   useEffect(() => {
//     if (userRolesList?.responseData) {
//       setRoles(userRolesList.responseData);
//       setCurrentRole(userRolesList.responseData[0] || null);
//     }
//   }, [userRolesList]);

//   const handleAddRole = useCallback(() => {
//     setDataUpdated(true);
//     const newRole: RoleData = {
//       name: `New Role ${roles.length + 1}`,
//       description: '',
//       permissions: [],
//     };
//     setRoles((prevRoles) => [...prevRoles, newRole]);
//     setSelectedRoleIndex(roles.length);
//     setCurrentRole(newRole);
//   }, [roles.length]);

//   const handleRoleClick = useCallback((index: number) => {
//     setSelectedRoleIndex(index);
//     setCurrentRole(roles[index]);
//     setDataUpdated(false);
//   }, [roles]);


//   // const handlePermissionChange = useCallback((permissionId: number, serviceMethod: string) => {
//   //   setDataUpdated(true);
//   //   setCurrentRole((prevRole) => ({
//   //     ...prevRole!,
//   //     permissions: prevRole!.permissions.map((perm) => {
//   //       if (perm.id !== permissionId) return perm;

//   //       const isChecked = perm.userpermissions.some(
//   //         (userPerm) => userPerm.service_method === serviceMethod
//   //       );

//   //       return {
//   //         ...perm,
//   //         userpermissions: isChecked
//   //           ? perm.userpermissions.filter(
//   //               (userPerm) => userPerm.service_method !== serviceMethod
//   //             )
//   //           :  
//   //           [...perm.userpermissions, { id: Date.now(), service_method: serviceMethod }],
           
//   //       };
//   //     }),
//   //   }));
//   // }, []);

//   // const handlePermissionChange = useCallback((permissionId: number, serviceMethod: string) => {
//   //   setDataUpdated(true);
  
//   //   const matchingPermission = AllPermissionList?.responseData.find((perm) => perm.id === permissionId);
//   //   const matchingUserPermission = matchingPermission?.userpermissions.find(
//   //     (userPerm) => userPerm.service_method === serviceMethod
//   //   );
  
//   //   setCurrentRole((prevRole) => ({
//   //     ...prevRole!,
//   //     permissions: prevRole!.permissions.map((perm) => {
//   //       if (perm.id !== permissionId) return perm;
  
//   //       const isChecked = perm.userpermissions.some(
//   //         (userPerm) => userPerm.service_method === serviceMethod
//   //       );
  
//   //       return {
//   //         ...perm,
//   //         userpermissions: isChecked
//   //           ? perm.userpermissions.filter((userPerm) => userPerm.service_method !== serviceMethod)
//   //           : [
//   //               ...perm.userpermissions,
//   //               {
//   //                 id: matchingUserPermission ? matchingUserPermission.id : null
//   //                 ,
//   //                 service_method: serviceMethod,
//   //               },
//   //             ],
//   //       };
//   //     }),
//   //   }));
//   // }, [AllPermissionList]);



//   const handlePermissionChange = useCallback((permissionId: number, serviceMethod: string) => {
//     setDataUpdated(true);

//     const matchingPermission = AllPermissionList?.responseData.find((perm) => perm.id === permissionId);
//     const matchingUserPermission = matchingPermission?.userpermissions.find(
//         (userPerm) => userPerm.service_method === serviceMethod
//     );

//     setCurrentRole((prevRole) => {
//         const existingPermission = prevRole!.permissions.find((perm) => perm.id === permissionId);

//         if (!existingPermission) {
//             return {
//                 ...prevRole!,
//                 permissions: [
//                     ...prevRole!.permissions,
//                     {
//                         id: permissionId,
//                         name: matchingPermission?.name || '',
//                         service_type: matchingPermission?.service_type || '',
//                         userpermissions: [
//                             {
//                                 id: matchingUserPermission ? matchingUserPermission.id : null,
//                                 service_method: serviceMethod,
//                             },
//                         ],
//                     },
//                 ],
//             };
//         }

//         return {
//             ...prevRole!,
//             permissions: prevRole!.permissions.map((perm) => {
//                 if (perm.id !== permissionId) return perm;

//                 const isChecked = perm.userpermissions.some(
//                     (userPerm) => userPerm.service_method === serviceMethod
//                 );

//                 return {
//                     ...perm,
//                     userpermissions: isChecked
//                         ? perm.userpermissions.filter((userPerm) => userPerm.service_method !== serviceMethod)
//                         : [
//                             ...perm.userpermissions,
//                             {
//                                 id: matchingUserPermission ? matchingUserPermission.id : null,
//                                 service_method: serviceMethod,
//                             },
//                           ],
//                 };
//             }),
//         };
//     });
// }, [AllPermissionList]);

  
//   const allServiceMethods = useMemo(() => {
//     const methods = new Set<string>();
//     roles?.forEach((role) =>
//       role?.permissions?.forEach((perm) =>
//         perm?.userpermissions?.forEach((userPerm) => methods.add(userPerm.service_method))
//       )
//     );
//     return Array.from(methods);
//   }, [roles]);

//   // const filteredPermissions = useMemo(() => {
//   //   return currentRole?.permissions.filter((permission) =>
//   //     permission.name.toLowerCase().includes(searchTerm.toLowerCase())
//   //   );
//   // }, [currentRole?.permissions, searchTerm]);

//   const filteredPermissions = useMemo(() => {
//     if (!searchTerm) return AllPermissionList?.responseData;
//     return AllPermissionList?.responseData.filter((permission) =>
//         permission.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
// }, [AllPermissionList, searchTerm]);

//   const handleSave = useCallback(() => {
//     const roleExists = currentRole?.id !== undefined;
  
//     const permissionList = currentRole!.permissions.flatMap((perm) =>
//       perm.userpermissions.map((userPerm) => userPerm.id)
//     );
  
//     const patchPayload = {
//       name: currentRole!.name,
//       description: currentRole!.description,
//       permission_ids: permissionList,
//     };
//     const postPayload = {
//       name: currentRole!.name,
//       description: currentRole!.description,
//       permission_ids: permissionList,
//     };
  
//     const saveHandler = roleExists ? patchUserRoles : postUserRoles;
  
//     saveHandler( roleExists ? patchPayload : postPayload, {
//       onSuccess: () => {
//         setSuccessBarOpen(true);
//         setDataUpdated(false);
//         setRoles((prevRoles) =>
//           prevRoles.map((role, index) =>
//             index === selectedRoleIndex ? currentRole : role
//           ) as RoleData[]
//         );
//       },
//       onError: (error) => {
//         console.log(error);
//         if(axios.isAxiosError(error) && error.response){ 
//           setErrorMessage(
//             error.response.data.message ?
//             error.response.data.message :
//             'Error in submitting data!'
//           );
//           setErrorBarOpen(true);
//         }
//       }
          
//     });
//   }, [currentRole, patchUserRoles, postUserRoles, selectedRoleIndex]);

  
//   const handleDiscard = useCallback(() => {
//     setDataUpdated(false);
//     setCurrentRole(roles[selectedRoleIndex]);
//   }, [roles, selectedRoleIndex]);

//   return (
//     <>
//     <SuccessBar
//     message={'Successfully Submitted!'}
//     snackbarOpen={successBarOpen}
//     setSnackbarOpen={setSuccessBarOpen}
//     />

//     <ErrorBar
//     message={errorMessage}
//     snackbarOpen={errorBarOpen}
//     setSnackbarOpen={setErrorBarOpen}
//     />

//     <Box sx={{ width: { xs: '100%', md: '110%', lg: '160%', xl: '170%' }, maxWidth: '1900px', display: 'flex' }}>
//       {/* Sidebar with Roles */}
//       <Box borderRight="2px solid #ddd" p={2} minWidth="200px">
//         <HeaderDesc title="Roles" />
//         <Button
//           startIcon={<AddIcon />}
//           onClick={handleAddRole}
//           sx={{ color: theme.palette.primary.main, mt: 1 }}
//         >
//           Add Role
//         </Button>
//         <List sx={{
//           maxHeight: '580px',
//           overflow: 'auto',
//           "&::-webkit-scrollbar": { width: '4px' },
//           "&::-webkit-scrollbar-thumb": {
//             backgroundColor: theme.palette.grey[300],
//             borderRadius: '10px',
//           },
//         }}>
//           {roles?.map((role, index) => (
//             <ListItem
//               sx={{
//                 // height: '40px',
//                 borderRadius: '5px',
//                 mb: 1,
//                 // bgcolor: theme.palette.grey[100],
//                 color: theme.palette.grey[600],
//                 fontWeight: 500,
//                 px: 0.5,
//                 // textAlign: 'center',
//                 py: 0.2,
//                 // bgcolor: theme.palette.grey[100],
//               }}
//               button
//               key={role.name}
//               selected={index === selectedRoleIndex}
//               onClick={() => handleRoleClick(index)}
//             >
//               <ListItemText primary={role.name} />
//             </ListItem>
//           ))}
//         </List>
//       </Box>

//       {/* Role Assignment Table */}
//       <Box flex={2} px={2} mt={2}>
//         <HeaderDesc title="Role Assignment" />
//         <Paper variant="outlined" sx={{ mb: 2, p: 1, mt: 2, bgcolor: '#f5f5f5', borderRadius: '5px', border: '1px solid #f5f5f5' }}>
//           <Typography variant="body1">Role</Typography>
//           <TextField
//             variant="standard"
//             value={currentRole?.name}
//             onChange={(e) => {
//               setDataUpdated(true);
//               setCurrentRole((prev) => ({ ...prev!, name: e.target.value }));
//             }}
//             fullWidth
//             sx={{ bgcolor: '#f5f5f5' }}
//           />
//         </Paper>
//         <Paper variant="outlined" sx={{ mb: 2, p: 1, mt: 2, bgcolor: '#f5f5f5', borderRadius: '5px', border: '1px solid #f5f5f5' }}>
//           <Typography variant="body1">Description</Typography>
//           <TextField
//             variant="standard"
//             multiline
//             minRows={1}
//             value={currentRole?.description}
//             onChange={(e) => {
//               setDataUpdated(true);
//               setCurrentRole((prev) => ({ ...prev!, description: e.target.value }));
//             }}
//             fullWidth
//             sx={{ bgcolor: '#f5f5f5', wordBreak: 'break-all' }}
//           />
//         </Paper>
//         <TextField
//           fullWidth
//           variant="outlined"
//           placeholder="Search for Permissions"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           autoComplete="off"
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//           sx={{
//             mb: 2,
//             bgcolor: '#f5f5f5',
//             borderRadius: '50px',
//             "& .MuiOutlinedInput-notchedOutline": { border: 'none' },
//           }}
//         />
//         {/* <TableContainer component={Paper} variant="outlined" sx={{
//           borderRadius: '8px',
//           maxHeight: '450px',
//           overflow: 'auto',
//           "&::-webkit-scrollbar": { width: '5px' },
//           "&::-webkit-scrollbar-thumb": {
//             backgroundColor: theme.palette.grey[300],
//             borderRadius: '10px',
//           },
//         }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Permission</TableCell>
//                 {allServiceMethods.map((method) => (
//                   <TableCell key={method} align="center">
//                     {method}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredPermissions?.map((permission) => (
//                 <TableRow key={permission.id}>
//                   <TableCell>{permission.name}</TableCell>
//                   {allServiceMethods.map((method) => (
//                     <TableCell key={method} align="center">
//                       <Checkbox
//                         checked={permission.userpermissions.some(
//                           (userPerm) => userPerm.service_method === method
//                         )}
//                         onChange={() => handlePermissionChange(permission.id, method)}
//                       />
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer> */}

//         <TableContainer elevation={0} component={Paper} sx={{
//           borderRadius: '8px',
//           border : `2px solid ${theme.palette.grey[300]}`,
//           maxHeight: '340px',
//           overflow: 'auto',
//           "&::-webkit-scrollbar": { width: '5px' },
//           "&::-webkit-scrollbar-thumb": {
//             backgroundColor: theme.palette.grey[300],
//             borderRadius: '10px',
//           },
//         }}>
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow sx={{}}>
//                 <TableCell sx={{p:1}}>Permission</TableCell>
//                 {allServiceMethods.map((method) => (
//                   <TableCell sx={{p:1}} key={method}>{method}</TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>


//             {/* {currentRole?.permissions.map((permission) => (
//                 <TableRow key={permission.id}>
//                   <TableCell>{permission.name}</TableCell>
//                   {allServiceMethods.map((method) => (
//                     <TableCell key={method} align="center">
//                       <Checkbox
//                         checked={permission.userpermissions.some(
//                           (userPerm) => userPerm.service_method === method
//                         )}
//                         onChange={() => handlePermissionChange(permission.id, method)}
//                       />
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))} */}

//               { 
//                 filteredPermissions?.length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={allServiceMethods.length + 1} align="center">
//                       No data found
//                     </TableCell>
//                   </TableRow>
//                 )
//               }
              
//               {/* {AllPermissionList?.responseData.map((perm) => (
//                 <TableRow key={perm.id}>
//                   <TableCell>{perm.name}</TableCell>
//                   {allServiceMethods.map((method) => (
//                     <TableCell key={`${perm.id}-${method}`}>
//                       <Checkbox
//                       disabled= {!(AllPermissionList?.responseData.some(
//                         (rolePerm) => rolePerm.id === perm.id && rolePerm.userpermissions.some(
//                           (userPerm) => userPerm.service_method === method
//                         )
//                       )
//                   )}

//                     checked={currentRole?.permissions.some(
//                       (rolePerm) => rolePerm.id === perm.id && rolePerm.userpermissions.some(
//                         (userPerm) => userPerm.service_method === method
//                       )
//                     )}
//                     onChange={() => handlePermissionChange(perm.id, method)}
                    

//                         // checked={
//                         //   currentRole?.permissions
//                         //     .find((p) => p.id === perm.id)
//                         //     ?.userpermissions.some((p) => p.service_method === method)
//                         // }
//                         // onChange={() => handlePermissionChange(perm.id, method)}
//                       />
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))} */}
//               {(allServiceMethods && filteredPermissions && currentRole && AllPermissionList) ? (

              
//               filteredPermissions?.map((perm) => ( 
//               <TableRow sx={{p:0.5}} key={perm.id}>
//                   <TableCell sx={{
//                     color: theme.palette.grey[600],
//                     p:1,
//                     fontWeight: 500,
//                   }}>{perm.name}</TableCell>
//                   {allServiceMethods.map((method) => (
//                       <TableCell sx={{p:1}} key={`${perm.id}-${method}`}>
//                           <Checkbox
//                               disabled={!AllPermissionList?.responseData.some(
//                                   (rolePerm) => rolePerm.id === perm.id && rolePerm.userpermissions.some(
//                                       (userPerm) => userPerm.service_method === method
//                                   )
//                               )}
//                               checked={currentRole?.permissions.some(
//                                   (rolePerm) => rolePerm.id === perm.id && rolePerm.userpermissions.some(
//                                       (userPerm) => userPerm.service_method === method
//                                   )
//                               )}
//                               onChange={() => handlePermissionChange(perm.id, method)}
//                           />
//                       </TableCell>
//                   ))}
//               </TableRow>
//             ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={allServiceMethods.length + 1} align="center">
//                     Loading Data...
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>


//         {/* Action Buttons */}
//         <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
//           {/* <Button
//             onClick={handleDiscard}
//             sx={{
//               px: 4,
//               py: 1.2,
//               color: theme.palette.grey[500],
//               bgcolor: theme.palette.grey[100],
//             }}
//             disabled={!dataUpdated}
//           >
//             Discard
//           </Button>
//           <Button
//             onClick={handleSave}
//             sx={{
//               px: 4,
//               py: 1.2,
//               bgcolor: theme.palette.primary.main,
//               color: 'white',
//               "&:hover": { bgcolor: theme.palette.primary.dark },
//             }}
//             disabled={!dataUpdated}
//           >
//             Save
//           </Button> */}
//           <Button
//             variant="outlined"
//             onClick={handleDiscard}
//             sx={{ textTransform: 'capitalize', color: theme.palette.secondary.main }}
//             disabled={!dataUpdated}
//           >
//             Discard Changes
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleSave}
//             sx={{ 
//               textTransform: 'capitalize', 
//               width: '100px', 
//               bgcolor: theme.palette.primary.main,
//               "&:hover": { bgcolor: theme.palette.primary.pureColor},
//              }}
//             disabled={!dataUpdated}
//           >
//             {(patchPending || postPending) && <CircularProgress size={20} sx={{color:'#fff'}} />}
//             {" "}Save 
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//     </>
//   );
// };

// export default RoleAssignment;














// import React, { useState, useEffect, useMemo } from 'react';
// import { useTheme } from '@mui/material';
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Checkbox,
//   Paper,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import SearchIcon from '@mui/icons-material/Search';
// import InputAdornment from '@mui/material/InputAdornment';
// import HeaderDesc from 'components/HeaderDesc/HeaderDesc';
// import { usePatchUserRoles, usePostUserRoles, useGetUserRolesList, useGetUserPermissions } from 'services/UserManagementServices/services/UserManagemenServices';

// interface UserPermission {
//   id: number;
//   service_method: string;
// }

// interface Permission {
//   id: number;
//   name: string;
//   service_type: string;
//   userpermissions: UserPermission[];
// }

// interface RoleData {
//   id?: number;
//   name: string;
//   description: string;
//   permissions: Permission[];
// }

// const RoleAssignment = () => {
//   const theme = useTheme();
//   const [roles, setRoles] = useState<RoleData[]>([]);
//   const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
//   const [currentRole, setCurrentRole] = useState<RoleData | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [dataUpdated, setDataUpdated] = useState(false);
  
//   const { data: AllPermissionList } = useGetUserPermissions();
//   const { data: userRolesList } = useGetUserRolesList();
  
//   const { mutate: postUserRoles } = usePostUserRoles();
//   const { mutate: patchUserRoles } = usePatchUserRoles(
//     roles[selectedRoleIndex]?.id
//   );

//   console.log(AllPermissionList);

//   useEffect(() => {
//     if (userRolesList?.responseData) {
//       setRoles(userRolesList.responseData);
//       setCurrentRole(userRolesList.responseData[0] || null);
//     }
//   }, [userRolesList]);


//   const handleAddRole = () => {
//     setDataUpdated(true);
//     const newRole: RoleData = {
//       name: `New Role ${roles.length + 1}`,
//       description: '',
//       permissions: [],
//     };
//     setRoles([...roles, newRole]);
//     setSelectedRoleIndex(roles.length);
//     setCurrentRole(newRole);
//   };

//   const handleRoleClick = (index: number) => {
//     setSelectedRoleIndex(index);
//     setCurrentRole(roles[index]);
//     setDataUpdated(false);
//   };

//   const handlePermissionChange = (permissionId: number, serviceMethod: string) => {
//     setDataUpdated(true);
//     setCurrentRole((prevRole) => ({
//       ...prevRole!,
//       permissions: prevRole!.permissions.map((perm) => {
//         if (perm.id !== permissionId) return perm;

//         const isChecked = perm.userpermissions.some(
//           (userPerm) => userPerm.service_method === serviceMethod
//         );

//         return {
//           ...perm,
//           userpermissions: isChecked
//             ? perm.userpermissions.filter(
//                 (userPerm) => userPerm.service_method !== serviceMethod
//               )
//             : [...perm.userpermissions, { id: Date.now(), service_method: serviceMethod }],
//         };
//       }),
//     }));
//   };

//   const allServiceMethods = useMemo(() => {
//     const methods = new Set<string>();
//     roles?.forEach((role) =>
//       role?.permissions?.forEach((perm) =>
//         perm?.userpermissions?.forEach((userPerm) => methods.add(userPerm.service_method))
//       )
//     );
//     return Array.from(methods);
//   }, [roles]);

//   const filteredPermissions = useMemo(() => {
//     return currentRole?.permissions.filter((permission) =>
//       permission.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [currentRole?.permissions, searchTerm]);

//   const handleSave = () => {
//     const roleExists = currentRole?.id !== undefined;

//     const permissionList = currentRole!.permissions
//       .flatMap((perm) => perm.userpermissions.map((userPerm) => userPerm.id))
//       .filter((id) => id !== undefined);

//     const payload = {
//       name: currentRole!.name,
//       description: currentRole!.description,
//       permissions: permissionList,
//     };

//     const saveHandler = roleExists ? patchUserRoles : postUserRoles;

//     saveHandler(payload, {
//       onSuccess: () => {
//         setDataUpdated(false);
//         const updatedRoles = roles.map((role, index) =>
//           index === selectedRoleIndex ? currentRole : role
//         );
//         setRoles(updatedRoles as RoleData[]);
//       },
//       onError: (error) => {
//         console.log(error);
//       },
//     });
//   };

//   const handleDiscard = () => {
//     setDataUpdated(false);
//     setCurrentRole(roles[selectedRoleIndex]);
//   };

//   return (
//     <Box sx={{ width: { xs: '100%', md: '110%', lg: '160%', xl: '170%' }, maxWidth: '1900px', display: 'flex' }}>
//       {/* Sidebar with Roles */}
//       <Box borderRight="2px solid #ddd" p={2} minWidth="200px">
//         <HeaderDesc title="Roles" />
//         <Button
//           startIcon={<AddIcon />}
//           onClick={handleAddRole}
//           sx={{ color: theme.palette.primary.main, mt: 1 }}
//         >
//           Add Role
//         </Button>
//         <List>
//           {roles?.map((role, index) => (
//             <ListItem
//               sx={{
//                 height: '40px',
//                 borderRadius: '5px',
//                 mb: 1,
//                 color: theme.palette.grey[600],
//                 fontWeight: 500,
//               }}
//               button
//               key={role.name}
//               selected={index === selectedRoleIndex}
//               onClick={() => handleRoleClick(index)}
//             >
//               <ListItemText primary={role.name} />
//             </ListItem>
//           ))}
//         </List>
//       </Box>

//       {/* Role Assignment Table */}
//       <Box flex={2} px={2} mt={2}>
//         <HeaderDesc title="Role Assignment" />
//         <Paper variant="outlined" sx={{ mb: 2, p: 1, mt: 2, bgcolor: '#f5f5f5', borderRadius: '5px', border: '1px solid #f5f5f5' }}>
//           <Typography variant="body1">Role</Typography>
//           <TextField
//             variant="standard"
//             value={currentRole?.name}
//             onChange={(e) => {
//               setDataUpdated(true);
//               setCurrentRole((prev) => ({ ...prev!, name: e.target.value }));
//             }}
//             fullWidth
//             sx={{ bgcolor: '#f5f5f5' }}
//           />
//         </Paper>
//         <Paper variant="outlined" sx={{ mb: 2, p: 1, mt: 2, bgcolor: '#f5f5f5', borderRadius: '5px', border: '1px solid #f5f5f5' }}>
//           <Typography variant="body1">Description</Typography>
//           <TextField
//             variant="standard"
//             multiline
//             minRows={1}
//             value={currentRole?.description}
//             onChange={(e) => {
//               setDataUpdated(true);
//               setCurrentRole((prev) => ({ ...prev!, description: e.target.value }));
//             }}
//             fullWidth
//             sx={{ bgcolor: '#f5f5f5', wordBreak: 'break-all' }}
//           />
//         </Paper>
//         <TextField
//           fullWidth
//           variant="outlined"
//           placeholder="Search for Permissions"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           autoComplete="off"
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//           sx={{
//             mb: 2,
//             bgcolor: '#f5f5f5',
//             borderRadius: '50px',
//             "& .MuiOutlinedInput-notchedOutline": { border: 'none' },
//           }}
//         />
//         <TableContainer component={Paper} variant="outlined" sx={{
//           borderRadius: '8px',
//           maxHeight: '450px',
//           overflow: 'auto',
//           "&::-webkit-scrollbar": { width: '5px' },
//           "&::-webkit-scrollbar-thumb": {
//             backgroundColor: theme.palette.grey[300],
//             borderRadius: '10px',
//           },
//         }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Permission</TableCell>
//                 {allServiceMethods.map((method) => (
//                   <TableCell key={method} align="center">{method}</TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredPermissions?.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={allServiceMethods.length + 1} align="center">
//                     No data found
//                   </TableCell>
//                 </TableRow>
//               )}
//               {filteredPermissions?.map((permission) => (
//                 <TableRow key={permission.id}>
//                   <TableCell>{permission.name}</TableCell>
//                   {allServiceMethods.map((method) => (
//                     <TableCell key={method} align="center">
//                       <Checkbox
//                         checked={permission.userpermissions.some(
//                           (userPerm) => userPerm.service_method === method
//                         )}
//                         onChange={() => handlePermissionChange(permission.id, method)}
//                       />
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
        
//         <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          // <Button
          //   color="secondary"
          //   variant="outlined"
          //   onClick={handleDiscard}
          //   sx={{ textTransform: 'capitalize', color: theme.palette.secondary.main }}
          //   disabled={!dataUpdated}
          // >
          //   Discard Changes
          // </Button>
          // <Button
          //   color="primary"
          //   variant="contained"
          //   onClick={handleSave}
          //   sx={{ textTransform: 'capitalize' }}
          //   disabled={!dataUpdated}
          // >
          //   Save
          // </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default RoleAssignment;










// import React, { useState, useMemo } from 'react';
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Checkbox,
//   Paper,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   useTheme,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import SearchIcon from '@mui/icons-material/Search';
// import InputAdornment from '@mui/material/InputAdornment';
// import HeaderDesc from 'components/HeaderDesc/HeaderDesc';
// import { usePatchUserRoles, usePostUserRoles, useGetUserRolesList } from 'services/UserManagementServices/services/UserManagemenServices';

// interface UserPermission {
//   id: number;
//   service_method: string;
// }

// interface Permission {
//   id: number;
//   name: string;
//   service_type: string;
//   userpermissions: UserPermission[];
// }

// interface RoleData {
//   id?: number;
//   name: string;
//   description: string;
//   permissions: Permission[];
// }

// const initialRoles: RoleData[] = 
//   [

//   {
//     "name": "Account Head",
//     "description": "ddddd",
//     "permissions": [
//       {
//         "id": 1,
//         "name": "Account day close",
//         "service_type": "ACCOUNTING_DAY_CLOSE",
//         "userpermissions": [
//           {
//             "id": 13,
//             "service_method": "CHECKER"
//           },
//           {
//             "id": 11,
//             "service_method": "POST"
//           },
//           {
//             "id": 12,
//             "service_method": "DELETE"
//           },
//         ]
//       },
//       {
//         "id": 3,
//         "name": "day close export",
//         "service_type": "ACCOUNTING_DAY_CLOSE_EXPORT",
//         "userpermissions": [
//           {
//             "id": 8,
//             "service_method": "LIST"
//           },
//           {
//             "id": 9,
//             "service_method": "MAKER"
//           }
//         ]
//       },
//       {
//         "id": 4,
//         "name": "Excel Download",
//         "service_type": "ACCOUNTING_FEES_EXCEL_DOWNLOAD",
//         "userpermissions": [
//           {
//             "id": 10,
//             "service_method": "CHECKER"
//           },
//           {
//             "id": 14,
//             "service_method": "GET_ONLY"
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "name": "Back Officer",
//     "description": "This is back officer desk",
//     "permissions": [
//       {
//         "id": 1,
//         "name": "Account day close",
//         "service_type": "ACCOUNTING_DAY_CLOSE",
//         "userpermissions": [
//           {
//             "id": 11,
//             "service_method": "POST"
//           },
//           {
//             "id": 12,
//             "service_method": "DELETE"
//           }
//         ]
//       },
//       {
//         "id": 3,
//         "name": "day close export",
//         "service_type": "ACCOUNTING_DAY_CLOSE_EXPORT",
//         "userpermissions": [
//           {
//             "id": 8,
//             "service_method": "LIST"
//           }
//         ]
//       },
//       {
//         "id": 4,
//         "name": "Excel Download",
//         "service_type": "ACCOUNTING_FEES_EXCEL_DOWNLOAD",
//         "userpermissions": [
//           {
//             "id": 14,
//             "service_method": "GET_ONLY"
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "name": "Front Desk Officer",
//     "description": "this is very good function",
//     "permissions": [
//       {
//         "id": 1,
//         "name": "Account day close",
//         "service_type": "ACCOUNTING_DAY_CLOSE",
//         "userpermissions": [
//           {
//             "id": 12,
//             "service_method": "DELETE"
//           },
//           {
//             "id": 15,
//             "service_method": "UPDATE"
//           }
//         ]
//       },
//       {
//         "id": 4,
//         "name": "Excel Download",
//         "service_type": "ACCOUNTING_FEES_EXCEL_DOWNLOAD",
//         "userpermissions": [
//           {
//             "id": 10,
//             "service_method": "CHECKER"
//           }
//         ]
//       }
//     ]
//   }

// ];

// const RoleAssignment = () => {
//   const theme = useTheme();
//   const [roles, setRoles] = useState<RoleData[]>(initialRoles); 
//   const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
//   const [currentRole, setCurrentRole] = useState<RoleData>(initialRoles[0]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [dataUpdated, setDataUpdated] = useState(false);

//   const { data: userRolesList } = useGetUserRolesList();
//   const { mutate: postUserRoles } = usePostUserRoles();    
//   const { mutate: patchUserRoles } = usePatchUserRoles(
//     roles[selectedRoleIndex].id
//   );

//   const handleAddRole = () => {
//     setDataUpdated(true);
//     const newRole: RoleData = {
//       name: `New Role ${roles.length + 1}`,
//       description: "",
//       permissions: [
       
//       ]
//     };
//     setRoles([...roles, newRole]);
//     setSelectedRoleIndex(roles.length);
//     setCurrentRole(newRole);
//   };

//   const handleRoleClick = (index: number) => {
//     setSelectedRoleIndex(index);
//     setCurrentRole(roles[index]);
//     setDataUpdated(false);
//   };

//   const handlePermissionChange = (permissionId: number, serviceMethod: string) => {
//     setDataUpdated(true);
//     setCurrentRole((prevRole) => ({
//       ...prevRole,
//       permissions: prevRole.permissions.map((perm) => {
//         if (perm.id !== permissionId) return perm;
  
//         const isChecked = perm.userpermissions.some(
//           (userPerm) => userPerm.service_method === serviceMethod
//         );
  
//         return {
//           ...perm,
//           userpermissions: isChecked
//             ? perm.userpermissions.filter(
//                 (userPerm) => userPerm.service_method !== serviceMethod
//               )
//             : [...perm.userpermissions, { id: Date.now(), service_method: serviceMethod }],
//         };
//       }),
//     }));
//   };

//   const allServiceMethods = useMemo(() => {
//     const methods = new Set<string>();
//     roles?.forEach((role) =>
//       role?.permissions?.forEach((perm) =>
//         perm?.userpermissions?.forEach((userPerm) => methods.add(userPerm.service_method))
//       )
//     );
//     return Array.from(methods);
//   }, [roles]);

  // const filteredPermissions = useMemo(() => {
  //   return currentRole?.permissions.filter((permission) =>
  //     permission.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }, [currentRole?.permissions, searchTerm]);

//   const handleSave = () => {
//     const roleExists = currentRole.id !== undefined;
  
//     const permissionList = currentRole.permissions
//       .flatMap((perm) => perm.userpermissions.map((userPerm) => userPerm.id))
//       .filter((id) => id !== undefined); 
  
//     const payload = {
//       name: currentRole.name,
//       description: currentRole.description,
//       permissions: permissionList,
//     };
  
//     const saveHandler = roleExists ? patchUserRoles : postUserRoles;
  
//     saveHandler(payload, {
//       onSuccess: () => {
//         setDataUpdated(false);
//         const updatedRoles = roles.map((role, index) =>
//           index === selectedRoleIndex ? currentRole : role
//         );
//         setRoles(updatedRoles);
//       },
//       onError: (error) => {
//         console.log(error);
//       },
//     });
//   };

//   const handleDiscard = () => {
//     setDataUpdated(false);
//     setCurrentRole(roles[selectedRoleIndex]);
//   };

//   return (
//     <Box sx={{
//       width: { xs: '100%', md: '110%', lg: '160%', xl: '170%' },
//       maxWidth: '1900px',
//       display: 'flex',
//     }}>
//       {/* Sidebar with Roles */}
//       <Box borderRight="2px solid #ddd" p={2} minWidth="200px">
//         <HeaderDesc title="Roles" />
//         <Button
//           startIcon={<AddIcon />}
//           onClick={handleAddRole}
//           sx={{ color: theme.palette.primary.main, mt: 1 }}
//         >
//           Add Role
//         </Button>
//         <List>
//           {roles?.map((role, index) => (
//             <ListItem
//               sx={{
//                 height: '40px',
//                 borderRadius: '5px',
//                 mb: 1,
//                 color: theme.palette.grey[600],
//                 fontWeight: 500,
//               }}
//               button
//               key={role.name}
//               selected={index === selectedRoleIndex}
//               onClick={() => handleRoleClick(index)}
//             >
//               <ListItemText primary={role.name} />
//             </ListItem>
//           ))}
//         </List>
//       </Box>

//       {/* Role Assignment Table */}
//       <Box flex={2} px={2} mt={2}>
//         <HeaderDesc title="Role Assignment" />
//         <Paper variant="outlined" sx={{ mb: 2, p: 1, mt: 2, bgcolor: '#f5f5f5', borderRadius: '5px', border: '1px solid #f5f5f5' }}>
//           <Typography variant="body1">Role</Typography>
//           <TextField
//             variant="standard"
//             value={currentRole?.name}
//             onChange={(e) => {
//               setDataUpdated(true);
//               setCurrentRole((prev) => ({ ...prev, name: e.target.value }));
//             }}
           
//             fullWidth
//             sx={{ bgcolor: '#f5f5f5' }}
//           />
//         </Paper>
//         <Paper variant="outlined" sx={{ mb: 2, p: 1, mt: 2, bgcolor: '#f5f5f5', borderRadius: '5px', border: '1px solid #f5f5f5' }}>
//           <Typography variant="body1">Description</Typography>
//           <TextField
//             variant="standard"
//             multiline 
//             minRows={1}
//             value={currentRole?.description}
//             onChange={(e) => {
//               setDataUpdated(true);
//               setCurrentRole((prev) => ({ ...prev, description: e.target.value }));
//             }}
//             fullWidth
//             sx={{ bgcolor: '#f5f5f5', wordBreak:'break-all' }}
//           />
//         </Paper>
//         <TextField
//           fullWidth
//           variant="outlined"
//           placeholder="Search for Permissions"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           autoComplete='off'
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//           sx={{
//             mb: 2, bgcolor: '#f5f5f5', borderRadius: '50px',
//             "& .MuiOutlinedInput-notchedOutline": { border: 'none' },
//           }}
//         />
//         <TableContainer component={Paper} variant="outlined" sx={{
//           borderRadius: '8px',
          // maxHeight: '450px',
          // overflow: 'auto',
          // "&::-webkit-scrollbar": {
          //   width: "5px",
          // },
          // "&::-webkit-scrollbar-thumb": {
          //   backgroundColor: theme.palette.grey[300],
          //   borderRadius: "10px",
          // },
//         }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Permission</TableCell>
//                 {allServiceMethods.map((method) => (
//                   <TableCell key={method} align="center">{method}</TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredPermissions?.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={allServiceMethods.length + 1} align="center">
//                     No data found
//                   </TableCell>
//                 </TableRow>
//               )}
              
//               {filteredPermissions?.map((permission) => (
//               <TableRow key={permission.id}>
//                 <TableCell>{permission.name}</TableCell>
//                 {allServiceMethods.map((method) => (
//                   <TableCell key={method} align="center">
//                     <Checkbox
//                       disabled={!permission.userpermissions.some(
//                         (userPerm) => userPerm.service_method === method
//                       )}
//                       checked={permission.userpermissions.some(
//                         (userPerm) => userPerm.service_method === method
//                       )}
//                       onChange={() => handlePermissionChange(permission.id, method)}
//                     />
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}

//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>

//       {/* Role Description */}
//       <Box p={2} borderLeft="1px solid #fff" flex={1}>
//         <HeaderDesc title="Info" />
//         <Typography variant="body1" sx={{ mt: 1 }}>
//           {currentRole?.description}
//         </Typography>
//         <Box display="flex" justifyContent="start" mt={2}>
//           <Button variant="contained" sx={{ width: '100px', mr: 2 }} onClick={handleSave} disabled={!dataUpdated}>
//             Save
//           </Button>
//           <Button variant="outlined" sx={{ width: '100px' }} onClick={handleDiscard}>
//             Discard
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default RoleAssignment;








// import React, { useState, useMemo } from 'react';
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Checkbox,
//   Paper,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   useTheme,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import SearchIcon from '@mui/icons-material/Search';
// import InputAdornment from '@mui/material/InputAdornment';
// import HeaderDesc from 'components/HeaderDesc/HeaderDesc';
// import { usePatchUserRoles, usePostUserRoles } from 'services/UserManagementServices/services/UserManagemenServices';

// interface Permission {
//   name: string;
//   maker?: boolean;
//   checker?: boolean;

//   id: number;
//   service_type: string;
//   service_method: string;
// }

// interface RoleData {
//   id?: number;
//   roleName?: string;
//   desc?: string
//   permissions: Permission[];

//   name: string;
//   description: string;
// }

// const initialRoles: RoleData[] = [

//     {
//       "id": 3,
//       "name": "admin",
//       "description": "admin",
//       "permissions": []
//     },
//     {
//       "id": 4,
//       "name": "admin",
//       "description": "admin",
//       "permissions": [
//         {
//           "id": 2,
//           "service_type": "account_heads",
//           "service_method": "maker",
//           "name": "create user",
//         },
//         {
//           "id": 3,
//           "service_type": "account_heads",
//           "service_method": "checker",
//           "name": "create user",
//         },
//         {
//           "id": 4,
//           "service_type": "account_heads",
//           "service_method": "delete",
//           "name": "create user",
//         },
       
//       ],
//     },
//     {
//       "id": 8,
//       "name": "Back Office",
//       "description": "This is the Back Office Role.",
//       "permissions": [
//         {
//           "id": 2,
//           "service_type": "account_heads",
//           "service_method": "maker",
//           "name": "view user",
//         },
//         {
//           "id": 3,
//           "service_type": "account_heads",
//           "service_method": "checker",
//           "name": "create user"
//         },
//         {
//           "id": 5,
//           "service_type": "account_heads",
//           "service_method": "list",
//           "name": "view user"
//         }
//       ]
//     },
//     {
//       "id": 9,
//       "name": "Back Office",
//       "description": "This is the Back Office Role.",
//       "permissions": [
//         {
//           "id": 2,
//           "service_type": "account_heads",
//           "service_method": "checker",
//           "name": "create user"
//         }
//       ]
//     },
//     {
//       "id": 5,
//       "name": "Front Office",
//       "description": "This is the Front Office Role.",
//       "permissions": [
//         {
//           "id": 3,
//           "service_type": "create_user",
//           "service_method": "maker",
//           "name": "create user"
//         }
//       ]
//     } 
// ];

// const RoleAssignment = () => {
//   const theme = useTheme();
//   const [roles, setRoles] = useState<RoleData[]>(initialRoles);
//   const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
//   const [currentRole, setCurrentRole] = useState<RoleData>(initialRoles[0]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [dataUpdated, setDataUpdated] = useState(false);

//   const { mutate: postUserRoles } = usePostUserRoles();
//   const { mutate: patchUserRoles } = usePatchUserRoles(
//     roles[selectedRoleIndex].id
//   );

//   const handleAddRole = () => {
//     setDataUpdated(true);
//     const newRole: RoleData = {
//       name: `New Role ${roles.length + 1}`,
//       description: "",
//       permissions: initialRoles[0].permissions.map((perm) => ({
//         ...perm,
//         maker: false,
//         checker: false,
//         list : false,
//       })),
//     };
//     setRoles([...roles, newRole]);
//     setSelectedRoleIndex(roles.length);
//     setCurrentRole(newRole);
//   };

//   const handleRoleClick = (index: number) => {
//     setSelectedRoleIndex(index);
//     setCurrentRole(roles[index]);
//     setDataUpdated(false);
//   };

//   const handlePermissionChange = (permissionName: string, method: 'maker' | 'checker') => {
//     setDataUpdated(true);
//     setCurrentRole((prevRole) => ({
//       ...prevRole,
//       permissions: prevRole.permissions.map((perm) =>
//         perm.name === permissionName && perm.service_method === method
//           ? { ...perm, service_method: method }
//           : perm
//       ),
//     }));
//   };

//   const groupedPermissions = useMemo(() => {
//     const grouped = currentRole.permissions.reduce((acc, perm) => {
//       if (!acc[perm.name]) {
//         acc[perm.name] = { maker: false, checker: false };
//       }
//       acc[perm.name][perm.service_method] = true;
//       return acc;
//     }, {} as Record<string, { maker: boolean; checker: boolean }>);
//     return grouped;
//   }, [currentRole.permissions]);
 
//   const handleSave = () => {
//     const roleExists = currentRole.id !== undefined;
//     const payload = {
//       role: currentRole.roleName,
//       desc: currentRole.desc,
//       permissions: currentRole.permissions,
//     };

//     const saveHandler = roleExists
//       ? patchUserRoles
//       : postUserRoles;

//     saveHandler(payload, {
//       onSuccess: () => {
//         setDataUpdated(false);
//         const updatedRoles = roles.map((role, index) =>
//           index === selectedRoleIndex ? currentRole : role
//         );
//         setRoles(updatedRoles);
//       },
//       onError: (error) => {
//         console.log(error);
//       },
//     });
//   };

//   const handleDiscard = () => {
//     setDataUpdated(false);
//     setCurrentRole(roles[selectedRoleIndex]);
//   };

//   const filteredPermissions = useMemo(
//     () =>
//       Object.keys(groupedPermissions)
//         .filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()))
//         .map((name) => ({
//           name,
//           maker: groupedPermissions[name].maker,
//           checker: groupedPermissions[name].checker,
//         })),
//     [groupedPermissions, searchTerm]
//   );
  
//   return (
//     <Box sx={{
//         width: { xs: '100%', md: '110%', lg: '160%', xl: '170%' },
//         maxWidth: '1900px',
//         display: 'flex',
//       }}
//     >
//       {/* Sidebar with Roles */}
//       <Box borderRight="2px solid #ddd" p={2} minWidth="200px">
//         <HeaderDesc title="Roles" />
//         <Button
//           startIcon={<AddIcon />}
//           onClick={handleAddRole}
//           sx={{ color: theme.palette.primary.main, mt: 1 }}
//         >
//           Add Role
//         </Button>
//         <List>
//           {roles.map((role, index) => (
//             <ListItem sx={{
//               height: '40px',
//               borderRadius: '5px',
//               mb: 1,
//               color: theme.palette.grey[600],
//               fontWeight: 500,
//             }}
//               button
//               key={role.roleName}
//               selected={index === selectedRoleIndex}
//               onClick={() => handleRoleClick(index)}
//             >
//               <ListItemText primary={role.name} />
//             </ListItem>
//           ))}
//         </List>
//       </Box>

//       {/* Role Assignment Table */}
//       <Box flex={2} px={2} mt={2}>
//         <HeaderDesc title="Role Assignment" />
        // <Paper variant="outlined" sx={{ mb: 2, p: 1, mt: 2, bgcolor: '#f5f5f5', borderRadius: '5px', border: '1px solid #f5f5f5' }}>
        //   <Typography variant="body1">Role</Typography>
        //   <TextField
        //     variant="standard"
        //     value={currentRole.name}
        //     onChange={(e) => {
        //       setDataUpdated(true);
        //       setCurrentRole((prev) => ({ ...prev, name: e.target.value }));
        //     }}
           
        //     fullWidth
        //     sx={{ bgcolor: '#f5f5f5' }}
        //   />
        // </Paper>
        // <Paper variant="outlined" sx={{ mb: 2, p: 1, mt: 2, bgcolor: '#f5f5f5', borderRadius: '5px', border: '1px solid #f5f5f5' }}>
        //   <Typography variant="body1">Description</Typography>
        //   <TextField
        //     variant="standard"
        //     multiline 
        //     minRows={1}
        //     value={currentRole.description}
        //     onChange={(e) => {
        //       setDataUpdated(true);
        //       setCurrentRole((prev) => ({ ...prev, description: e.target.value }));
        //     }}
        //     fullWidth
        //     sx={{ bgcolor: '#f5f5f5', wordBreak:'break-all' }}
        //   />
        // </Paper>
//         <TextField
//           fullWidth
//           variant="outlined"
//           placeholder="Search for Permissions"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           autoComplete='off'
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//           sx={{
//             mb: 2, bgcolor: '#f5f5f5', borderRadius: '50px',
//             "& .MuiOutlinedInput-notchedOutline": { border: 'none' },
//           }}
//         />
//         <TableContainer component={Paper} variant="outlined" sx={{ 
//           borderRadius: '8px', 
//           maxHeight: '450px', 
//           overflow: 'auto', 
//           overflowY: 'auto',
//           "&::-webkit-scrollbar": {
//             width: "5px",
//           },
//           "&::-webkit-scrollbar-thumb": {
//             backgroundColor: theme.palette.grey[300],
//             borderRadius: "10px",
//           }, 
//           }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Permission</TableCell>
//                 {currentRole.permissions.map((perm) => (
//                   <TableCell sx={{textTransform:'capitalize'}} key={perm.id} align="center">{perm.service_method}</TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {currentRole.permissions.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={3} align="center">
//                     No data found
//                   </TableCell>
//                 </TableRow>
//               )}
//               {filteredPermissions.map((permission) => (
//               // For Dynamic Checkboxes accroding to response data

//                 <TableRow key={permission.name}>
//                 <TableCell>{permission.name}</TableCell>
//                 {currentRole.permissions.map((perm) => (
//                   <TableCell key={perm.id} align="center">
//                     <Checkbox
//                       checked={groupedPermissions[permission.name][perm.service_method]}
//                       onChange={() => handlePermissionChange(permission.name, perm.service_method as 'maker' | 'checker')}
//                     />
//                   </TableCell>
//                 ))}
//               </TableRow>

//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>

//       {/* Role Description */}
//       <Box p={2} borderLeft="1px solid #fff" flex={1}>
//         <HeaderDesc title="Info" />
//         <Typography variant="body1" sx={{ mt: 1 }}>
//           {currentRole.description}
//         </Typography>
//         <Box display="flex" justifyContent="start" mt={2}>
//           <Button variant="contained" sx={{ width: '100px', mr: 2 }} onClick={handleSave} disabled={!dataUpdated}>
//             Save
//           </Button>
//           <Button variant="outlined" sx={{ width: '100px' }} onClick={handleDiscard}>
//             Discard
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// };
// export default RoleAssignment;








// // import React, { useState } from 'react';
// // import {
// //   Box,
// //   Typography,
// //   List,
// //   ListItem,
// //   ListItemText,
// //   Checkbox,
// //   Paper,
// //   TextField,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Button,
// //   useTheme,
// // } from '@mui/material';
// // import AddIcon from '@mui/icons-material/Add';
// // import SearchIcon from '@mui/icons-material/Search';
// // import InputAdornment from '@mui/material/InputAdornment';
// // import HeaderDesc from 'components/HeaderDesc/HeaderDesc';
// // import { usePostUserRoles, useGetUserRoles, useGetPermissionTypes, useGetPermissionList } from 'services/UserManagementServices/services/UserManagemenServices';

// // // interface Permission {
// // //   name: string;
// // //   maker?: boolean;
// // //   checker?: boolean;

// // //   id: number;
// // //   service_type: string;
// // //   service_method: string;
  
// // // }

// // interface RoleData {
// //   id?: number;
// //   // roleName?: string;
// //   // desc?: string
// //   // permissions?: Permission[];

// //   name?: string;
// //   description?: string;
// //   service_type?: {
// //     id: any;
// //     name: any;

// //   };
// //   service_method?: string;

// // }

// // const initialRoles: RoleData[] = [];

// // const RoleAssignment = () => {
// //   const theme = useTheme();
// //   const [roles, setRoles] = useState(initialRoles);
// //   const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
// //   const [currentRole, setCurrentRole] = useState<RoleData>(initialRoles[0]);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [dataUpdated, setDataUpdated] = useState(false);
  

// //   const { data: getPermissionTypesList} = useGetPermissionTypes();
// //   const { data: getPermissionList} = useGetPermissionList();
// //   const { data: getUserRoleList} = useGetUserRoles();
// //   const { mutate: postUserRoles } = usePostUserRoles();
// //   // const { mutate: patchUserRoles } = usePatchUserRoles(
// //   //   roles[selectedRoleIndex].id
// //   // );

// //   console.log("getUserRoleList", getUserRoleList);  
// //   console.log("getPermissionTypesList", getPermissionTypesList);

// //   const handleAddRole = () => {
// //     setDataUpdated(true);
// //     const newRole: RoleData = {
// //       name: `New Role ${roles?.length + 1}`,
// //       description: "",
// //       // permissions: initialRoles[0]?.permissions?.map((perm) => ({
// //       //   ...perm,
// //       //   maker: false,
// //       //   checker: false,
// //       // })),
// //     };
// //     setRoles([...roles, newRole]);
// //     setSelectedRoleIndex(roles.length);
// //     setCurrentRole(newRole);
// //   };

// //   const handleRoleClick = (index: number) => {
// //     setSelectedRoleIndex(index);
// //     setCurrentRole(roles[index]);
// //     setDataUpdated(false);
// //   };

// //   // const handlePermissionChange = (permissionName: string, method: 'maker' | 'checker') => {
// //   //   setDataUpdated(true);
// //   //   // setCurrentRole((prevRole) => ({
// //   //     // ...prevRole,
// //   //     // permissions: prevRole?.permissions?.map((perm) =>
// //   //       // perm.name === permissionName && perm.service_method === method
// //   //         // ? { ...perm, service_method: method }
// //   //         // : perm
// //   //     // ),
// //   //   // }));
// //   // };

// //   const handlePermissionChange = (type: any, method: string) => {
// //     setDataUpdated(true);
// //     setCurrentRole((prevRole) => ({
// //       ...prevRole,
// //       service_method: method,
// //       service_type: {
// //         id: type.id,
// //         name: type.service_type,
// //       }
      
// //     }));
// //   };

// //   console.log(currentRole, "currentRole");

// //   const handleSave = () => {
// //     const payload = {
// //       name:  currentRole?.name,
// //       description: currentRole?.description, 
// //       service_type: currentRole?.service_type.name,
// //       service_method: currentRole?.service_method, 
// //     };
// //     console.log(payload, "payload");
// //       postUserRoles(payload, {
// //       onSuccess: () => {
// //         setDataUpdated(false);
// //         // const updatedRoles = roles.map((role, index) =>
// //           // index === selectedRoleIndex ? currentRole : role
// //         // );
// //         // setRoles(updatedRoles);
// //       },
// //       onError: (error) => {
// //         console.log(error);
// //       },
// //     });
// //   };

// //   const handleDiscard = () => {
// //     setDataUpdated(false);
// //     setCurrentRole(roles[selectedRoleIndex]);
// //   };
  
// //   return (
// //     <Box sx={{
// //         width: { xs: '100%', md: '110%', lg: '160%', xl: '170%' },
// //         maxWidth: '1900px',
// //         display: 'flex',
// //       }}
// //     >
// //       {/* Sidebar with Roles */}
// //       <Box borderRight="2px solid #ddd" p={2} minWidth="200px">
// //         <HeaderDesc title="Roles" />
// //         <Button
// //           startIcon={<AddIcon />}
// //           onClick={handleAddRole}
// //           sx={{ color: theme.palette.primary.main, mt: 1 }}
// //         >
// //           Add Role
// //         </Button>
// //         <List>
// //           {roles.map((role, index) => (
// //             <ListItem sx={{
// //               height: '40px',
// //               borderRadius: '5px',
// //               mb: 1,
// //               color: theme.palette.grey[600],
// //               fontWeight: 500,
// //             }}
// //               button
// //               key={role.name}
// //               selected={index === selectedRoleIndex}
// //               onClick={() => handleRoleClick(index)}
// //             >
// //               <ListItemText primary={role.name} />
// //             </ListItem>
// //           ))}
// //         </List>
// //       </Box>

// //       {/* Role Assignment Table */}
// //       <Box flex={2} px={2} mt={2}>
// //         <HeaderDesc title="Role Assignment" />
// //         <Paper variant="outlined" sx={{ mb: 2, p: 1, mt: 2, bgcolor: '#f5f5f5', borderRadius: '5px', border: '1px solid #f5f5f5' }}>
// //           <Typography variant="body1">Role</Typography>
// //           <TextField
// //             variant="standard"
// //             value={currentRole?.name}
// //             // onChange={(e) => {
// //               // setDataUpdated(true);
// //               // setCurrentRole((prev) => ({ ...prev, name: e.target.value }));
// //                 //  setCurrentRole((prev) => ({ ...prev, name: e.target.value }));
              
// //             // }}

// //             onChange={(e) => {
// //               setDataUpdated(true);
// //               setCurrentRole((prev) => ({ ...prev, name: e.target.value }));
// //               // setCurrentRole((prev) => ({ ...prev, name: e.target.value }));
// //             }}
            
           
// //             fullWidth
// //             sx={{ bgcolor: '#f5f5f5' }}
// //           />
// //         </Paper>

// //         <Paper variant="outlined" sx={{ mb: 2, p: 1, mt: 2, bgcolor: '#f5f5f5', borderRadius: '5px', border: '1px solid #f5f5f5' }}>
// //           <Typography variant="body1">Description</Typography>
// //           <TextField
// //             variant="standard"
// //             multiline 
// //             minRows={1}
// //             value={currentRole?.description}
// //             onChange={(e) => {
// //               setDataUpdated(true);
// //               setCurrentRole((prev) => ({ ...prev, description: e.target.value }));
// //             }}
// //             fullWidth
// //             sx={{ bgcolor: '#f5f5f5', wordBreak:'break-all' }}
// //           />
// //         </Paper>
// //         <TextField
// //           fullWidth
// //           variant="outlined"
// //           placeholder="Search for Permissions"
// //           value={searchTerm}
// //           onChange={(e) => setSearchTerm(e.target.value)}
// //           autoComplete='off'
// //           InputProps={{
// //             startAdornment: (
// //               <InputAdornment position="start">
// //                 <SearchIcon />
// //               </InputAdornment>
// //             ),
// //           }}
// //           sx={{
// //             mb: 2, bgcolor: '#f5f5f5', borderRadius: '50px',
// //             "& .MuiOutlinedInput-notchedOutline": { border: 'none' },
// //           }}
// //         />

// //         <TableContainer component={Paper} variant="outlined" sx={{ 
// //           borderRadius: '8px', 
// //           maxHeight: '450px', 
// //           overflow: 'auto', 
// //           overflowY: 'auto',
// //           "&::-webkit-scrollbar": {
// //             width: "5px",
// //           },
// //           "&::-webkit-scrollbar-thumb": {
// //             backgroundColor: theme.palette.grey[300],
// //             borderRadius: "10px",
// //           }, 
// //           }}>
// //           <Table>
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell>Permission</TableCell>
// //                 {getPermissionTypesList?.responseData?.service_method?.map((perm) => (
// //                   <TableCell sx={{textTransform:'capitalize'}} key={perm} align="center">{perm}</TableCell>
// //                 ))}
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
             
// //               {/* {getPermissionTypesList?.responseData?.service_type.map((permission) => ( */}
// //               {getPermissionList?.responseData?.map((permission) => (
// //                 <TableRow sx={{textTransform:'capitalize'}} key={permission.id}>
// //                   <TableCell sx={{
// //                     fontSize: '15px',
// //                     fontWeight: 500,
// //                     color: theme.palette.grey[600],
// //                   }}>{permission.service_type}</TableCell>

// //                   {getPermissionTypesList?.responseData?.service_method.map((perm) => (
// //                     <TableCell align="center">
// //                       <Checkbox
// //                         // checked={currentRole?.permissions?.some((p) => p.service_type === permission && p.service_method === perm)}
// //                         onChange={() => handlePermissionChange(permission, perm)}
// //                       />
// //                     </TableCell>
// //                   ))}
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       </Box>

// //       <Box p={2} borderLeft="1px solid #fff" flex={1}>
// //         <HeaderDesc title="Info" />
// //         <Typography variant="body1" sx={{ mt: 1 }}>
// //           {currentRole?.description}
// //         </Typography>
// //         <Box display="flex" justifyContent="start" mt={2}>
// //           <Button variant="contained" sx={{ width: '100px', mr: 2 }}
// //            onClick={handleSave} 
// //            disabled={!dataUpdated}>
// //             Save
// //           </Button>
// //           <Button variant="outlined" sx={{ width: '100px' }} onClick={handleDiscard}>
// //             Discard
// //           </Button>
// //         </Box>
// //       </Box>

// //     </Box>
// //   );
// // };

// // export default RoleAssignment;












// // import React, { useState } from 'react';
// // import {
// //   Box,
// //   Typography,
// // //   IconButton,
// // //   Divider,
// //   List,
// //   ListItem,
// //   ListItemText,
// //   Checkbox,
// //   Paper,
// //   TextField,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Button,
// //   useTheme,
// // } from '@mui/material';
// // import AddIcon from '@mui/icons-material/Add';
// // import SearchIcon from '@mui/icons-material/Search';
// // import InputAdornment from '@mui/material/InputAdornment';
// // import HeaderDesc from 'components/HeaderDesc/HeaderDesc';
// // import {usePatchUserRoles, usePostUserRoles } from 'services/UserManagementServices/services/UserManagemenServices';

// // interface Permission {
// //   name: string;
// //   maker: boolean;
// //   checker: boolean;
// // }

// // interface RoleData {
// //   id ?: number;
// //   roleName: string;
// //   permissions: Permission[];
// // }

// // const initialRoles: RoleData[] = [
// //   {
// //     id: 1,
// //     roleName: 'Front Office',
// //     permissions: [
// //       { name: 'SIP Registration', maker: true, checker: false },
// //       { name: 'Unit Purchase', maker: false, checker: false },
// //       { name: 'SIP Cancellation', maker: true, checker: false },
// //       { name: 'Stock and Brokers', maker: true, checker: false },
// //       { name: 'Fixed Deposit', maker: true, checker: false },
// //       { name: 'User Management', maker: true, checker: false },
// //       { name: 'Banks and Account', maker: false, checker: false },
// //     ],
// //   },
// //   {
// //     id: 2,
// //     roleName: 'Back Office',
// //     permissions: [
// //       { name: 'SIP Registration', maker: false, checker: true },
// //       { name: 'Unit Purchase', maker: false, checker: true },
// //       { name: 'SIP Cancellation', maker: false, checker: true },
// //       { name: 'Stock and Brokers', maker: false, checker: true },
// //       { name: 'Fixed Deposit', maker: false, checker: true },
// //       { name: 'User Management', maker: false, checker: true },
// //       { name: 'Banks and Account', maker: false, checker: true },
// //     ],
// //   },
// // ];

// // const RoleAssignment = () => {

// //   const theme = useTheme();
// //   const [roles, setRoles] = useState<RoleData[]>(initialRoles);
// //   const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [dataUpdated, setDataUpdated] = useState(false);

// //   const {mutate: postUserRoles} = usePostUserRoles();
  
// //   const {mutate: patchUserRoles} = usePatchUserRoles(
// //     roles[selectedRoleIndex].id
// //   );

// //   const handleAddRole = () => {
// //     setDataUpdated(true);
// //     const newRole: RoleData = {
// //       roleName: `New Role ${roles.length + 1}`,
// //       permissions: initialRoles[0].permissions.map((perm) => ({
// //         ...perm,
// //         maker: false,
// //         checker: false,
// //       })),
// //     };
// //     setRoles([...roles, newRole]);
// //     setSelectedRoleIndex(roles.length);
// //   };

// //   const handleRoleClick = (index: number) => {
// //     setSelectedRoleIndex(index);
// //   };

//   // const handlePermissionChange = (
//   //   permissionName: string,
//   //   type: 'maker' | 'checker'
//   // ) => {
//   //   setDataUpdated(true);
//   //   const updatedRoles = roles.map((role, roleIndex) => {
//   //     if (roleIndex === selectedRoleIndex) {
//   //       return {
//   //         ...role,
//   //         permissions: role.permissions.map((perm) =>
//   //           perm.name === permissionName
//   //             ? { ...perm, [type]: !perm[type] }
//   //             : perm
//   //         ),
//   //       };
//   //     }
//   //     return role;
//   //   });
//   //   setRoles(updatedRoles);
//   // };

// //   const handleSave = () => {

// //     const payload = {
// //       role: roles[selectedRoleIndex].roleName,
// //       permissions: roles[selectedRoleIndex].permissions,
// //     };

// //     {(selectedRoleIndex) ? (

// //     postUserRoles(payload,{
// //       onSuccess: () => {
// //         setDataUpdated(false);
// //       },
// //       onError: (error) => {
// //         console.log(error);
// //       },
// //     })

// //     ) : (
// //     patchUserRoles(payload,{
// //       onSuccess: () => {
// //         setDataUpdated(false);
// //       },
// //       onError: (error) => {
// //         console.log(error);
// //       },
// //     })
// //     )}
// //   }

// //   const handleDiscard = () => {
// //     setDataUpdated(false);
// //     setRoles(initialRoles);
// //   };

//   // const filteredPermissions = roles[selectedRoleIndex].permissions.filter((perm) =>
//   //   perm.name.toLowerCase().includes(searchTerm.toLowerCase())
//   // );

// //   return (
// //     <Box sx={{
// //         width: {
// //             xs: '100%',
// //             md: '110%',
// //             lg: '160%',
// //             xl: '170%',
// //         },
// //         maxWidth: '1900px',
// //         display: 'flex',
// //         // backgroundColor: '#e4e4e4',
// //     }}>

// //       {/* Sidebar with Roles */}
// //       <Box  borderRight="2px solid #ddd" p={2} minWidth={"200px"}>
// //         <HeaderDesc title="Roles" />
// //         <Button
// //           startIcon={<AddIcon />}
// //           onClick={handleAddRole}
// //           sx={{ color: theme.palette.primary.main, mt: 1 }}
// //         >
// //           Add Role
// //         </Button>
// //         <List sx={{}}>
// //           {roles.map((role, index) => (
// //             <ListItem sx={{ 
// //                 height: '40px',
// //                 borderRadius: '5px',
// //                 mb: 1,
// //                 color: theme.palette.grey[600],

// //              }}
// //               button
// //               key={role.roleName}
// //               selected={index === selectedRoleIndex}
// //               onClick={() => handleRoleClick(index)}
// //             >
// //               <ListItemText primary={role.roleName} />
// //             </ListItem>
// //           ))}
// //         </List>
// //       </Box>


// //       {/* Role Assignment Table */}
// //       <Box flex={2} px={2} mt={2} sx={{ }}>
       
// //         <HeaderDesc title="Role Assignment" />
// //         <Paper variant="outlined" sx={{ 
// //             mb: 2, 
// //             p: 1, 
// //             mt:2,
// //             bgcolor: '#f5f5f5',
// //             borderRadius: '5px',    
// //             border: '1px solid #f5f5f5',
// //              }}>
// //           <Typography variant="body1">Role</Typography>
        
// //           <TextField
// //             variant="standard"
// //             value={roles[selectedRoleIndex].roleName}
//             // onChange={(e) => {
//             //     setDataUpdated(true);
//             //     const updatedRoles = roles.map((role, index) => {
//             //         if (index === selectedRoleIndex) {
//             //         return {
//             //             ...role,
//             //             roleName: e.target.value,
//             //         };
//             //         }
//             //         return role;
//             //     });
//             //     setRoles(updatedRoles);
//             // }
//             // }
// //             fullWidth
// //             sx={{ bgcolor: '#f5f5f5',
// //              }}
// //             />
// //         </Paper>

// //         <TextField
// //           fullWidth
// //           variant="outlined"
// //           placeholder="Search for Permissions"
// //           value={searchTerm}
// //           onChange={(e) => setSearchTerm(e.target.value)}
// //           InputProps={{
// //             startAdornment: (
// //               <InputAdornment position="start">
// //                 <SearchIcon />
// //               </InputAdornment>
// //             ),
// //           }}
// //           sx={{ mb: 2, bgcolor: '#f5f5f5', borderRadius: '50px', 
           
// //             "& .MuiOutlinedInput-notchedOutline": {
// //                 border: 'none',
// //             },
// //            }}
// //         />

// //         <TableContainer component={Paper} variant="outlined" sx={{
// //             borderRadius: '8px',
// //             border: '1px solid #fff',
// //             maxHeight: '450px',
// //             overflow: 'auto',
// //             overflowY: 'auto',
// //             "&::-webkit-scrollbar": {
// //               width: "5px",
// //               },
// //           "&::-webkit-scrollbar-thumb": {
// //               backgroundColor: theme.palette.grey[300],
// //               borderRadius: "10px",
// //           },
// //         }}>
// //           <Table>
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell>Permission</TableCell>
// //                 <TableCell align="center">Maker</TableCell>
// //                 <TableCell align="center">Checker</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {filteredPermissions.map((permission) => (
// //                 <TableRow key={permission.name}>
// //                   <TableCell>{permission.name}</TableCell>
// //                   <TableCell align="center">
// //                     <Checkbox
// //                       checked={permission.maker}
// //                       onChange={() =>
// //                         handlePermissionChange(permission.name, 'maker')
// //                       }
// //                     />
// //                   </TableCell>
// //                   <TableCell align="center">
// //                     <Checkbox
// //                       checked={permission.checker}
// //                       onChange={() =>
// //                         handlePermissionChange(permission.name, 'checker')
// //                       }
// //                     />
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       </Box>

// //       {/* Role Description  */}
// //       <Box p={2} borderLeft="1px solid #fff" flex={1}>
// //         <HeaderDesc title="Info" />
// //         <Typography variant="body1" sx={{mt:1}}>
// //           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
// //           odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla
// //           quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent
// //           mauris. Fusce nec tellus sed augue semper porta. Mauris massa.
// //         </Typography>
// //         {dataUpdated && (
// //           <Box sx={{
// //             bgcolor: theme.palette.grey[200],
// //             borderRadius: '5px',
// //             mt: 2,
// //             p: 1,
// //             }}>
        
// //           <Typography sx={{mb:1}}>
// //             You have unsaved changes
// //           </Typography>
// //           <Box>
// //             <Button variant="contained" onClick={handleSave} sx={{mr:2}}>Save</Button>
// //             <Button variant="outlined" onClick={handleDiscard}>Discard</Button>
// //         </Box>
// //         </Box>
// //           )}
      
// //         </Box>
      
// //     </Box>
// //   );
// // };

// // export default RoleAssignment;
