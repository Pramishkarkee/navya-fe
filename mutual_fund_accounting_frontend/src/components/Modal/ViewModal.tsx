import React from 'react'

import { Box, Typography, Modal, Grid, useTheme } from '@mui/material';
import HeaderDesc from 'components/HeaderDesc/HeaderDesc';

interface ViewModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    data: Record<string, string>; // Type definition for the data prop
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "60%",
    bgcolor: 'background.paper',
    borderRadius: '8px',
    p: 4,
};

const ViewModal: React.FC<ViewModalProps> = ({ open, setOpen, data }) => {

    const theme = useTheme()
    const handleClose = () => setOpen(false);



    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} >
                <HeaderDesc title='Details' />
                <Grid container sx={{ mt: 2.5, columnGap: { xs: 4, lg: 6 }, rowGap: 1.5 }}>
                    {
                        Object.entries(data).map(([key, value]) => (
                            <Grid item xs={5.5} key={key} sx={{ borderBottom: `1px solid ${theme.palette.secondary.lightGrey}` }} >
                                <Typography sx={{ display: 'flex', justifyContent: 'space-between' }} >
                                    <span style={{ fontWeight: 'bold' }}>{key} </span>
                                    <span style={{ color: theme.palette.secondary[700] }}> {value} </span>
                                </Typography>
                            </Grid>
                        ))
                    }


                </Grid>

            </Box>
        </Modal>)
}

export default ViewModal