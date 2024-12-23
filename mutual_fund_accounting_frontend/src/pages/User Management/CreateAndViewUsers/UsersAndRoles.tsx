import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Paper,
  Checkbox,
  useTheme,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { usePostUserCreation, usePatchUserCreation, useDeleteUserCreation, useGetUserRoles, useGetUserCreation } from 'services/UserManagementServices/services/UserManagemenServices';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import HeaderDesc from 'components/HeaderDesc/HeaderDesc';
import SuccessBar from 'components/Snackbar/SuccessBar';
import ErrorBar from 'components/Snackbar/ErrorBar';
import axios from 'axios';
import { colorTokens } from '../../../theme';

const UsersAndRoles: React.FC = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [roleList, setRoleList] = useState<{ id: number; name: string }[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorbarOpen, setErrorbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [validateName, setValidateName] = useState<string | null>(null);


  const { data: UserRolesList } = useGetUserRoles();
  const { data: UserCreationList } = useGetUserCreation();

  const { mutate: postUserCreation } = usePostUserCreation();
  const { mutate: patchUserCreation } = usePatchUserCreation(
    selectedUser?.id || 0
  );
    const { mutate: deleteUserCreation } = useDeleteUserCreation();


  useEffect(() => { 
    if (UserRolesList) {
      setRoleList(UserRolesList.responseData.map((role: any) => ({
        id: role.id,
        name: role.name
      })));
    }
  }, [UserRolesList]);

  // useEffect(() => {
  //   if (UserCreationList) {
  //     setUsers(UserCreationList.responseData.map((user: any) => ({
  //       id: user.id,
  //       full_name: user.full_name,
  //       username: user.username,
  //       password: user.password,
  //       email: user.email,
  //       user_type: user.user_type,
  //       roles: user.role 
  //     })));
  //     // setSelectedUser(UserCreationList?.responseData[0] || null);
  //     setUsers(usersData);
  //     const initialUser = usersData[0] || null;
  //     setSelectedUser(initialUser);
      
  //     // Set roles directly to ensure checkboxes are checked on load
  //     if (initialUser) {
  //       setRoleList(initialUser.roles);
  //     }
  //   }
  // }
  // , [UserCreationList]);

  
  useEffect(() => {
    if (UserCreationList) {
      const usersData = UserCreationList && UserCreationList?.responseData?.map((user: any) => ({
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        password: user.password,
        email: user.email,
        phone_number: user.phone_number,
        user_type: user.user_type,
        roles: user.role 
      }));
      setUsers(usersData);
      setSelectedUser(usersData[0] || null);
    }
  }, [UserCreationList]);
  
  const handleUserSelect = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setUnsavedChanges(false);
    }
  };

  const handleAddUser = () => {
    const newUser = {
      id: null,
      full_name: '',
      username: '',
      password: '',
      email: '',
      phone_number: '',
      user_type: '1',
      roles: []
    };
    setSelectedUser(newUser);
    setUnsavedChanges(false);
  };


  const handleInputChange = (field: string, value: string) => {
    if (field === 'full_name') {
      if (/\d/.test(value)) {
        setValidateName('Name cannot contain numbers.');
      } else {
        setValidateName(null);
      }
    }

    if (selectedUser) {
      setSelectedUser({ ...selectedUser, [field]: value });
      setUnsavedChanges(true);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const handleSave = () => {
    const isNewUser = !selectedUser?.id;

    const postPayload = {
      full_name: selectedUser?.full_name,
      username: selectedUser?.username,
      password: selectedUser?.password,
      email: selectedUser?.email,
      phone_number: selectedUser?.phone_number,
      user_type: selectedUser?.user_type.toString(),
      roles: selectedUser?.roles
    };
    const patchPayload = {
      full_name: selectedUser?.full_name,
      username: selectedUser?.username,
      password: selectedUser?.password, 
      email: selectedUser?.email,
      phone_number: selectedUser?.phone_number,
      user_type: selectedUser?.user_type.toString(),
      roles: selectedUser?.roles
    };
    const saveHandler = isNewUser ? postUserCreation : patchUserCreation;
    
    saveHandler(isNewUser ? postPayload : patchPayload, {
      onSuccess: (savedUser) => {
        setSnackbarOpen(true);
        if (isNewUser) {
          setUsers([...users, savedUser]);
        } else {
          setUsers(users.map(user => (user.id === savedUser.id ? savedUser : user)));
        }
        setSelectedUser(null);
        setUnsavedChanges(false);
      },
      onError: (error) => {
        console.log(error);
        if(axios.isAxiosError(error) && error.response) {
          setErrorMessage(
            error.response.data.responseData.errors.fullname
            ? `Name: ${error.response.data.responseData.errors.fullname[0]}`
            :  error.response.data.responseData.errors.username
            ? `Username: ${error.response.data.responseData.errors.username[0]}`
            : error.response.data.responseData.errors.email
            ? `Email: ${error.response.data.responseData.errors.email[0]}`
            : error.response.data.responseData.errors.phone_number
            ? `Number: ${error.response.data.responseData.errors.phone_number[0]}`
            : error.response.data.responseData.errors.password
            ? `Password: ${error.response.data.responseData.errors.password[0]}`
            : "Error Occured in Submission"
          );
          setErrorbarOpen(true);
        }
      }
    });
  };

  const handleDiscard = () => {
    if (selectedUser) {
      if (selectedUser.id) {
        const originalUser = users.find(user => user.id === selectedUser.id);
        setSelectedUser(originalUser || null);
      } else {
        setSelectedUser({
          ...selectedUser,
          full_name: '',
          username: '',
          password: '',
          email: '',
          phone_number: '',
          user_type: '',
          roles: []
        });
      }
      setUnsavedChanges(false);
    }
  };
  
  const handleDelete = () => {
    if (selectedUser) {
      deleteUserCreation(selectedUser.id, {
        onSuccess: () => {
          setUsers(users.filter(user => user.id !== selectedUser.id));
          setSelectedUser(null);
          setUnsavedChanges(false);
        },
        onError: () => {
          console.log('Error');
        }
      });
    }
  };
  console.log(selectedUser);

  // console.log(selectedUser?.username);

  return (
    <>
    <SuccessBar
    message={"Successfully Sumitted!"}
    snackbarOpen={snackbarOpen}
    setSnackbarOpen={setSnackbarOpen}
    />
    <ErrorBar
    message={errorMessage}
    snackbarOpen={errorbarOpen}
    setSnackbarOpen={setErrorbarOpen}
    />


    <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        px: 2,
        maxWidth: '1900px',
        width: { xs: '100%', md: '110%', lg: '170%', xl: '170%' },
    }}>
      
      {/* Users List */}
      <Box width={{ xs: '100%', md: '20%' }} p={2} sx={{ borderRight: '2px solid #ddd' }}>
        <HeaderDesc title="Users" />
        <Button
          startIcon={<AddIcon />}
          sx={{ color: theme.palette.primary.main, mt: 2 }}
          // fullWidth
          onClick={handleAddUser}
        >
          Add User
        </Button>
        <List sx={{
            borderRadius: '8px',
            maxHeight: '390px',
            overflow: 'auto',
            overflowY: 'auto',
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.grey[300],
              borderRadius: "10px",
            },
        }}>
          {users?.map((user) => (
            <ListItem
              button
              key={user?.id}
              selected={user?.id === selectedUser?.id}
              onClick={() => handleUserSelect(user?.id)}
              sx={{ 
                borderRadius: 1, 
                mb: 1,
                px: 1.5,
                py: 0.5,
                "& .MuiListItemText-primary": {
                  fontWeight: user?.id === selectedUser?.id ? 600 : 400,
                  color: user?.id === selectedUser?.id ? theme.palette.primary.main : theme.palette.grey[800],
                },
                "&.MuiListItem-button": {
                  backgroundColor: user?.id === selectedUser?.id ? colorTokens.mainColor[50] : 'transparent',
                }
                
               }}
            >
              <ListItemText primary={user?.full_name} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* User Details */}
      <Box width={{ xs: '100%', md: '50%' }} p={2}>
        <HeaderDesc title="User Details" />
        <Box display="grid" mt={3} gap={2} gridTemplateColumns="repeat(auto-fill, minmax(160px, 1fr))">
          <TextField
            label="Name"
            value={selectedUser?.full_name || ''}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            fullWidth
            error={!!validateName}
            helperText={validateName || ''}
          />
          <TextField
            label="Username"
            value={selectedUser?.username || ''}
            onChange={(e) => handleInputChange('username', e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type= {showPassword ? 'text' : 'password'}
            value={selectedUser?.password || ''}
            onChange={(e) => handleInputChange('password', e.target.value)}
            fullWidth
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
          <TextField
            label="Email"
            value={selectedUser?.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            fullWidth
          />
          <TextField
            label="Phone Number"
            value={selectedUser?.phone_number || ''}
            onChange={(e) => handleInputChange('phone_number', e.target.value)}
            fullWidth
          />
          
          <Select
            fullWidth
            value={selectedUser?.user_type || ''}
            onChange={(e) => handleInputChange('user_type', e.target.value)}
            disabled={selectedUser?.user_type === '2'}
          >
            <MenuItem value={1}>User</MenuItem>
            <MenuItem value={2}>Admin</MenuItem>
          </Select>
        </Box>

        <Box mt={3}>
        {/* {(selectedUser && selectedUser.id) && (
        <>
            <HeaderDesc title="Account Details" />
          <Button variant="contained" color="error" onClick={handleDelete} sx={{ mt: 2 }}>
            Disable Account
          </Button>
          <Typography sx={{ mt: 0.8, color: theme.palette.grey[600], fontSize:"13px" }}>
            The account of the user will be disabled but the entries made by the user won’t be affected in any way.
          </Typography>
        </>
        )}  */}

          {unsavedChanges && (
            <Paper elevation={0} sx={{ p: 2, mt: 2, backgroundColor: theme.palette.grey[200] }}>
              <Typography>You have unsaved changes</Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button variant="contained" sx={{
                    width:'100px',
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.common.white,
                    "&:hover": {
                        backgroundColor: theme.palette.primary.pureColor,
                    }
                }} onClick={handleSave}>Save</Button>
                <Button variant="outlined" onClick={handleDiscard}>Discard Changes</Button>
              </Box>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Role Assignment */}
      <Box width={{ xs: '100%', md: '30%' }} p={2}>
        <HeaderDesc title="Assign Roles" />
        <TextField
          variant="outlined"
          placeholder="Search for Roles"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          autoComplete='off'
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            mt: 2.5,
            bgcolor:'#f5f5f5',
            borderRadius: "50px",
            "& .MuiOutlinedInput-notchedOutline": {
              border: 'none',
            }
          }}
        />
        <List sx={{
             borderRadius: '8px', 
             maxHeight: '365px', 
             overflow: 'auto', 
             overflowY: 'auto',
             "&::-webkit-scrollbar": {
               width: "5px",
             },
             "&::-webkit-scrollbar-thumb": {
               backgroundColor: theme.palette.grey[300],
               borderRadius: "10px",
             }, 
        }}>
            {roleList.filter(role => role?.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((role) => (
            <ListItem
              key={role?.id}
              button
              sx={{ borderRadius: 1, p: 0.5 }}
              onClick={() => {
              if (selectedUser) {
                const isSelected = selectedUser?.roles?.includes(role?.id);
                const updatedRoles = isSelected
                ? selectedUser?.roles?.filter(r => r !== role?.id)
                : [...selectedUser.roles, role?.id];
                handleInputChange('roles', updatedRoles as any);
              }
              }}
            >
              <Checkbox checked={selectedUser?.roles?.includes(role?.id) || false} />
              <ListItemText primary={role.name} />
            </ListItem>
            ))}
        </List>
      </Box>
      
    </Box>
    </>

  );
};

export default UsersAndRoles;












// import React, { useState } from 'react';
// import {
//   Box,
//   Button,
// //   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   TextField,
//   Typography,
// //   IconButton,
//   useTheme,
//   Paper,
//   Checkbox,
//   InputAdornment
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import SearchIcon from '@mui/icons-material/Search';

// const UserManagement: React.FC = () => {
//   const theme = useTheme();
//   const [selectedUser, setSelectedUser] = useState('Sagar Ghimire');
//   const [unsavedChanges, setUnsavedChanges] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   const users = [
//     'Sagar Ghimire', 'Mohan Adhikari', 'Raju Sharma'
//   ];

//   const roles = [
//     'Onboarding Specialist', 'Associate', 'Accountant', 'Preparer',
//     'Training Manager', 'Admin', 'Reviewer', 'Partner', 'Virtual CFO', 'Salesperson'
//   ];

//   const handleUserSelect = (user: string) => {
//     setSelectedUser(user);
//     setUnsavedChanges(false);
//   };

//   const handleSave = () => {
//     setUnsavedChanges(false);
//   };

//   const handleCancel = () => {
//     setUnsavedChanges(false);
//   };

//   return (
//     <Box display="flex" width="150%" p={2} flexWrap="wrap">
      
//       <Box width={{ xs: '100%', md: '20%' }} p={2} sx={{ borderRight: '1px solid #ddd' }}>
//         <Typography variant="h6" gutterBottom>User</Typography>
//         <Button
//           startIcon={<AddIcon />}
//           sx={{ color: theme.palette.primary.main, mb: 2 }}
//           fullWidth
//         >
//           Add User
//         </Button>
//         <List>
//           {users.map((user) => (
//             <ListItem
//               button
//               key={user}
//               selected={user === selectedUser}
//               onClick={() => handleUserSelect(user)}
//               sx={{ borderRadius: 1, mb: 1 }}
//             >
//               <ListItemText primary={user} />
//             </ListItem>
//           ))}
//         </List>
//       </Box>

//       <Box width={{ xs: '100%', md: '50%' }} p={2}>
//         <Typography variant="h6" gutterBottom>User Details</Typography>
//         <Box display="grid" gap={2} gridTemplateColumns="repeat(auto-fill, minmax(160px, 1fr))">
//           <TextField label="Name" value={selectedUser} fullWidth />
//           <TextField label="Username" value="9843556677" fullWidth />
//           <TextField label="Set Password" type="password" fullWidth />
//           <TextField label="Phone Number" value="9843991334" fullWidth />
//           <TextField label="Branch" value="Lazimpat Branch" select fullWidth />
//         </Box>

//         <Box mt={3}>
//           <Typography variant="h6">Account Details</Typography>
//           <Button variant="contained" color="error" sx={{ mt: 1 }}>
//             Disable Account
//           </Button>
//           <Typography variant="caption" display="block" sx={{ mt: 1, color: theme.palette.text.secondary }}>
//             The account of the user will be disabled but the entries made by the user won’t be affected in any way.
//           </Typography>

//           {unsavedChanges && (
//             <Paper elevation={1} sx={{ p: 2, mt: 2, backgroundColor: theme.palette.warning.light }}>
//               <Typography>You have unsaved changes</Typography>
//               <Box mt={2} display="flex" justifyContent="space-between">
//                 <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
//                 <Button variant="outlined" color="secondary" onClick={handleCancel}>Cancel</Button>
//               </Box>
//             </Paper>
//           )}
//         </Box>
//       </Box>

//       <Box width={{ xs: '100%', md: '30%' }} p={2}>
//         <Typography variant="h6" gutterBottom>Assign Roles</Typography>
//         <TextField
//           variant="outlined"
//           placeholder="Search for Roles"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           fullWidth
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//           sx={{
//             mb: 2,
//             "& .MuiOutlinedInput-notchedOutline": {
//               border: 'none',
//             }
//           }}
//         />
//         <List>
//           {roles.filter(role => role.toLowerCase().includes(searchTerm.toLowerCase())).map((role) => (
//             <ListItem key={role} button sx={{ borderRadius: 1, mb: 1 }}>
//               <Checkbox />
//               <ListItemText primary={role} />
//             </ListItem>
//           ))}
//         </List>
//       </Box>
      
//     </Box>
//   );
// };

// export default UserManagement;
