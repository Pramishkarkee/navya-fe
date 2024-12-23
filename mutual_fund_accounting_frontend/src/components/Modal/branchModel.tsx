import React from 'react';
import { Modal, Box, Typography, Grid, useTheme } from '@mui/material';
import HeaderDesc from 'components/HeaderDesc/HeaderDesc';
import CloseIcon from "@mui/icons-material/Close";



interface BankDetailsModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    data: {
        isSuccess: boolean;
        message: null | string;
        responseData: {
            id: number;
            bank_name: string;
            bank_code: string;
            bank_address: string;
            swift_code: string;
            bank_type: string;
            nrb_symbol: string;
            cpi_code: string;
            is_main_branch: boolean;
            created_at: string;
            updated_at: string;
            branches: {
                id: number;
                branch_name: string;
                branch_code: string;
                branch_address: string;
                branch_type: string;
                created_at: string;
                updated_at: string;
                cpi_code: string;
                tel_no: string;
            }[];
        }[];
    };
}

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "86vh",
    overflowY: "auto",
    // width: 754,
    bgcolor: "background.paper",
    border: "2px solid #fff",
    borderRadius: 8,
    boxShadow: 24,
    p: 4,
};

const BranchDetailsModal: React.FC<BankDetailsModalProps> = ({
    open, setOpen, data,
}) => {
    const theme = useTheme();
    const handleClose = () => setOpen(false);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "5px",
                    }}
                >
                    <HeaderDesc title="Branches" />

                    <CloseIcon
                        sx={{ marginRight: "5px", cursor: "pointer" }}
                        onClick={handleClose}
                    />
                </Box>

                {data?.isSuccess ? (
                    <Grid
                        container
                        sx={{ columnGap: { xs: 4, lg: 6 }, rowGap: 1.5 }}
                    >
                        {data?.responseData?.map((bank) => (
                            <Grid item xs={12} key={bank?.id}>
                                <Box sx={{ marginTop: "15px" }}>
                                    <Grid container spacing={2}>
                                        {bank?.branches?.map((branch, index) => (
                                            <Grid item xs={6} key={branch?.id}>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: theme.palette.primary.fullDarkColor,
                                                        fontWeight: 600,
                                                        marginTop: "10px",
                                                        fontSize: "16px",
                                                    }}
                                                >
                                                    Branch {index + 1}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        borderBottom: `1px solid ${theme.palette.secondary.lightGrey}`,
                                                        padding: "8px 0",
                                                        marginTop: "5px",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body1"
                                                        sx={{ color: "#616161" }}
                                                    >{`Branch ID `}</Typography>
                                                    <Typography>{branch?.branch_code || 'N/A'}</Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        borderBottom: `1px solid ${theme.palette.secondary.lightGrey}`,
                                                        padding: "8px 0",
                                                        marginTop: "5px",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body1"
                                                        sx={{ color: "#616161" }}
                                                    >{`Branch Address `}</Typography>
                                                    <Typography>{branch?.branch_address || 'N/A'}</Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        borderBottom: `1px solid ${theme.palette.secondary.lightGrey}`,
                                                        padding: "8px 0",
                                                        marginTop: "5px",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body1"
                                                        sx={{ color: "#616161" }}
                                                    >{`CPI Code `}</Typography>
                                                    <Typography>{branch?.cpi_code || 'N/A'}</Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        borderBottom: `1px solid ${theme.palette.secondary.lightGrey}`,
                                                        padding: "8px 0",
                                                        marginTop: "5px",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body1"
                                                        sx={{ color: "#616161" }}
                                                    >{`Telephone Number `}</Typography>
                                                    <Typography>{branch?.tel_no || 'N/A'}</Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body1">Error: {data.message}</Typography>
                )}
            </Box>
        </Modal>
    );
};

export default BranchDetailsModal;
