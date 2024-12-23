// import React, { useState, useEffect } from 'react';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import { Box, TextField, Typography, Snackbar, Alert } from '@mui/material';
// import { usePatchStockDetails } from 'services/Stock Mapping/StockMappingService';

// interface StockEditDetailsModalProps {
//     open: boolean;
//     setOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     data: {
//         isSuccess: boolean;
//         message: null | string;
//         responseData: {
//             id: number;
//             stock_code: string;
//             txn_type: string;
//             broker_code: number;
//             txn_id: string;
//             units: number;

//             rate: string;
//             base_price: string;
//             commission_rate: string;
//             capital_gain_tax: string;
//             effective_rate: string;
//             total_amount: string;

//             created_at: string;
//             updated_at: string;

//         }[];
//     };
// }

// const style = {
//     position: 'absolute' as 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: "60%",
//     bgcolor: 'background.paper',
//     borderRadius: '8px',
//     p: 4,
// };

// const EditDetails: React.FC<StockEditDetailsModalProps> = ({ open, setOpen, data }) => {
//     const [openEdit, setOpenEdit] = useState(false);
//     const [modalData, setModalData] = useState<any>(null);

//     const [rate, setRate] = useState<string>('');
//     const [basePrice, setBasePrice] = useState<string>('');
//     const [commissionRate, setCommissionRate] = useState<string>('');
//     const [capitalGainTax, setCapitalGainTax] = useState<string>('');
//     const [effectiveRate, setEffectiveRate] = useState<string>('');
//     const [totalAmount, setTotalAmount] = useState<string>('');

//     const [successMsgs, setSuccessMsgs] = useState<string>('');
//     const [errorMsgs, setErrorMsgs] = useState<string>('');
//     const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState<boolean>(false);
//     const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);

//     const { mutate: patchStockDetails, isSuccess: stockDetailSuccess, isError: stockDetailError } = usePatchStockDetails(id);

//     useEffect(() => {
//         if (modalData) {
//             setRate(modalData.rate);
//             setBasePrice(modalData.base_price);
//             setCommissionRate(modalData.commission_rate);
//             setCapitalGainTax(modalData.capital_gain_tax);
//             setEffectiveRate(modalData.effective_rate);
//             setTotalAmount(modalData.total_amount);
//         }
//     }, [modalData]);

//     const handleEditDetails = (data) => {
//         setOpenEdit(true);
//         setModalData(data);
//     };

//     const handleClose = () => {
//         setOpenEdit(false);
//     };

//     const handleEditSave = async () => {
//         try {
//             // Replace with your actual API call
//             const updatedData = {
//                 ...modalData,
//                 rate,
//                 base_price: basePrice,
//                 commission_rate: commissionRate,
//                 capital_gain_tax: capitalGainTax,
//                 effective_rate: effectiveRate,
//                 total_amount: totalAmount,
//             };

//             await patchStockDetails(updatedData); // This should be your actual API call
//             setSuccessMsgs("Stock Transaction updated successfully.");
//             setSnackbarSuccessOpen(true);
//             setOpenEdit(false);
//         } catch (error) {
//             setErrorMsgs("Error updating Stock Transaction.");
//             setSnackbarErrorOpen(true);
//         }
//     };

//     return (
//         <>
//             <Dialog open={openEdit} onClose={handleClose}>
//                 <DialogTitle>Edit Stock Details</DialogTitle>
//                 <DialogContent>
//                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px", flexDirection: "row", gap: 2 }}>
//                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
//                             <Typography>Rate</Typography>
//                             <TextField value={rate} onChange={(e) => setRate(e.target.value)} />
//                         </Box>
//                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
//                             <Typography>Base Price</Typography>
//                             <TextField value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
//                         </Box>
//                     </Box>

//                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px", flexDirection: "row", gap: 2 }}>
//                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
//                             <Typography>Commission Rate</Typography>
//                             <TextField value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)} />
//                         </Box>
//                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
//                             <Typography>Capital Gain Tax</Typography>
//                             <TextField value={capitalGainTax} onChange={(e) => setCapitalGainTax(e.target.value)} />
//                         </Box>
//                     </Box>

//                     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px", flexDirection: "row", gap: 2 }}>
//                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
//                             <Typography>WACC Rate</Typography>
//                             <TextField value={effectiveRate} onChange={(e) => setEffectiveRate(e.target.value)} />
//                         </Box>
//                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
//                             <Typography>Total Amount</Typography>
//                             <TextField value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
//                         </Box>
//                     </Box>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} color="primary">Cancel</Button>
//                     <Button onClick={handleEditSave} color="primary">Save</Button>
//                 </DialogActions>
//             </Dialog>
//             <Button
//                 sx={{
//                     marginLeft: "450px",
//                     color: 'darkColor',
//                     '&:hover': {
//                         backgroundColor: 'transparent',
//                         hover: 'none',
//                     },
//                 }}
//                 onClick={() => handleEditDetails(data)}
//             >
//                 Edit Details
//             </Button>

//             <Snackbar open={snackbarSuccessOpen} autoHideDuration={6000} onClose={() => setSnackbarSuccessOpen(false)}>
//                 <Alert onClose={() => setSnackbarSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
//                     {successMsgs}
//                 </Alert>
//             </Snackbar>
//             <Snackbar open={snackbarErrorOpen} autoHideDuration={6000} onClose={() => setSnackbarErrorOpen(false)}>
//                 <Alert onClose={() => setSnackbarErrorOpen(false)} severity="error" sx={{ width: '100%' }}>
//                     {errorMsgs}
//                 </Alert>
//             </Snackbar>
//         </>
//     );
// }

// export default EditDetails;
