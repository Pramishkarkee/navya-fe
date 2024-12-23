import React from 'react';
import {
    Box,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    useTheme,
} from '@mui/material';
import TypographyLabel from '../InputLabel/TypographyLabel';

interface RadioYesNoProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioYesNo = ({ value, onChange }: RadioYesNoProps) => {
    const theme = useTheme();

    return (
        <Box>
            <TypographyLabel title="Let the shareholders pick their preferred redemption method" />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <FormControl>
                    <RadioGroup
                        row
                        aria-labelledby="demo-controlled-radio-yes-no-group"
                        value={value}
                        onChange={onChange}
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="Yes"
                            sx={{
                                '& .MuiSvgIcon-root': {
                                    color: theme.palette.primary[1100],
                                },
                            }}
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label="No"
                            sx={{
                                '& .MuiSvgIcon-root': {
                                    color: theme.palette.primary[1100],
                                },
                            }}
                        />
                    </RadioGroup>
                </FormControl>
            </Box>
        </Box>
    );
};

export default RadioYesNo;
