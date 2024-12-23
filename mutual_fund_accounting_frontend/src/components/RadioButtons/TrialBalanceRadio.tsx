import React from 'react';
import { RadioGroup, FormControlLabel, Radio, useTheme, Box, FormControl } from '@mui/material';
import TypographyLabel from 'components/InputLabel/TypographyLabel';

const TrialBalanceRadio = ({ value, onChange }) => {
    const theme = useTheme();

    return (
        <>
            <Box>
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
                                value="with_market_valuation"
                                control={<Radio />}
                                label="With Market Valuation"
                                sx={{
                                    '& .MuiSvgIcon-root': {
                                        color: theme.palette.primary[1100],
                                    },
                                }}
                            />
                            <FormControlLabel
                                value="without_market_valuation"
                                control={<Radio />}
                                label="Without Market Valuation"
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

        </>
    );
};

export default TrialBalanceRadio;
