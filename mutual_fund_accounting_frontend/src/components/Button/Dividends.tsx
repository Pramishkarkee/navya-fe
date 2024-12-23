import { Button, InputAdornment, OutlinedInput, useTheme } from "@mui/material";
import TuneIcon from '@mui/icons-material/Tune';
import React from "react";

interface SearchButtonProps {
    title: string;
    onClick: () => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    sx?: React.CSSProperties;
}

const Dividend: React.FC<SearchButtonProps> = ({ title, onChange, value, onClick, sx }) => {
    const theme = useTheme();
    return (
        <div style={{ display: 'flex', alignItems: 'center', ...sx }}>
            <OutlinedInput
                size="small"
                placeholder={title}
                startAdornment={(
                    <InputAdornment position="start">
                        <TuneIcon sx={{ color: '#616161', cursor: 'pointer' }} />
                    </InputAdornment>
                )}
                onChange={onChange}
                value={value}
                sx={{
                    borderRadius: "100px",
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                    },
                    '&::placeholder': {
                        color: theme.palette.text.primary,
                    },
                    marginRight: theme.spacing(1),
                }}
            />
            <Button

                onClick={onClick}
                sx={{
                    width: "150px",
                    borderRadius: "100px",
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "20px",
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary[1300],
                    textTransform: 'none',
                }}
            >
                {title}
                <TuneIcon sx={{ color: '#616161', cursor: 'pointer' }} />

            </Button>
        </div>
    );
};

export default Dividend;
