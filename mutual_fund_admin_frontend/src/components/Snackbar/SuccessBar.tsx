import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';


export default function SuccessBar({ snackbarOpen, message, setSnackbarOpen }) {


    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    }

    return (
        <div>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}

            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                >
                    {message}
                </Alert>
            </Snackbar>
        </div >
    );
}
