// import React, { useState } from 'react';
// import { Button } from '@mui/material';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';
// import Auth from 'utils/Auth';
// import SuccessBar from 'components/Snackbar/SuccessBar';
// import ErrorBar from 'components/Snackbar/ErrorBar';

// interface ExportButtonProps {
//     boidNumber?: string;
//     exportUrl: string;
//     fileName: string;
//     fromDate?: string;
//     toDate?: string;
// }

// const ExportButtonByDate: React.FC<ExportButtonProps> = ({ boidNumber, exportUrl, fileName, fromDate, toDate }) => {
//     const [successBarOpen, setSuccessBarOpen] = useState<boolean>(false);
//     const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);
//     const [errorMsg, setErrorMsg] = useState<string>('');

//     const handleExport = () => {
//         let anchor = document.createElement('a');
//         document.body.appendChild(anchor);

//         // Determine the URL based on the presence of boidNumber and date filters
//         let queryParameters = [];
//         if (boidNumber) {
//             queryParameters.push(`boid_no=${boidNumber}`);
//         }
//         if (fromDate) {
//             queryParameters.push(`from_date=${fromDate}`);
//         }
//         if (toDate) {
//             queryParameters.push(`to_date=${toDate}`);
//         }
//         queryParameters.push('export=true');
//         let file = `${exportUrl}?${queryParameters.join('&')}`;

//         let headers = new Headers();
//         headers.append('Authorization', `Bearer ${Auth.getAccessToken()}`);

//         fetch(file, { headers })
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.blob();
//             })
//             .then((blobby) => {
//                 let objectUrl = window.URL.createObjectURL(blobby);
//                 anchor.target = '_blank';
//                 anchor.href = objectUrl;
//                 anchor.download = fileName;
//                 anchor.click();
//                 window.URL.revokeObjectURL(objectUrl);
//             })
//             .then(() => setSuccessBarOpen(true))
//             .catch((error) => {
//                 console.error('There has been a problem with your fetch operation:', error);
//                 setErrorMsg('There was an error exporting the file.');
//                 setSnackbarErrorOpen(true);
//             });
//     };

//     return (
//         <>
//             <Button
//                 onClick={handleExport}
//                 variant="outlined"
//                 startIcon={<ExitToAppIcon />}
//                 style={{
//                     borderColor: '#F5F5F5',
//                     borderRadius: '15px',
//                     height: '33px',
//                     color: '#741212',
//                     backgroundColor: 'white',
//                     transition: 'background-color 0.3s, color 0.3s',
//                 }}
//             >
//                 Export
//             </Button>
//             <SuccessBar
//                 snackbarOpen={successBarOpen}
//                 setSnackbarOpen={setSuccessBarOpen}
//                 message="File exported successfully"
//             />
//             <ErrorBar
//                 snackbarOpen={snackbarErrorOpen}
//                 setSnackbarOpen={setSnackbarErrorOpen}
//                 message={errorMsg}
//             />
//         </>
//     );
// };

// export default ExportButtonByDate;
