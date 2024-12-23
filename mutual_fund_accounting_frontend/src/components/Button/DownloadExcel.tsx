import { Button, useTheme } from "@mui/material";
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import React from "react";

interface DownloadButtonProps {
    onClick: () => void;
    sx?: React.CSSProperties;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick, sx }) => {
    const theme = useTheme();
    return (
        <Button
            color="primary"
            startIcon={<SimCardDownloadIcon />}
            onClick={onClick}
            sx={{
                width: "180px",
                borderRadius: "20px",
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary[1100],
                textTransform: 'none',
                '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                    hover: 'none',
                },
                ...sx,
            }}
        >
            Download Excel File
        </Button>
    );
};

export default DownloadButton;
