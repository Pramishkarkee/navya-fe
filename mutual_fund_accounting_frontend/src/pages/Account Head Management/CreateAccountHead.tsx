import { Box, CssBaseline, Button, TextField, Typography, Select, MenuItem, Menu, useTheme, ThemeProvider } from '@mui/material'
import React, { useState } from 'react'

export default function AccountHead() {

    const [accType, setAccType] = useState('')
    const [accSubType, setAccSubType] = useState('')
    const theme = useTheme()

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 2,
                width: '100%',
                flex: 1
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, width: '100%', }}>
                    <Typography sx={{ minWidth: "150px" }}>Account Head</Typography>
                    <TextField

                        size='small'
                        placeholder='Enter Account Head'
                        sx={{ width: '50%' }}

                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, width: '100%', }}>
                    <Typography sx={{ minWidth: "150px" }}>Account Type</Typography>
                    <Select
                        size='small'
                        placeholder='Enter Ledger Head'
                        sx={{ width: '50%' }}
                        value={accType}
                        onChange={(e) => setAccType(e.target.value)}
                        displayEmpty
                        renderValue={(type) => {
                            if (!type) {
                                return <p style={{ padding: 0, margin: 0, }}>Select Account Type</p>
                            }

                            return type
                        }}
                    >
                        <MenuItem value='Assets' >Assets</MenuItem>
                        <MenuItem value='Liabilities'>Liablities</MenuItem>
                        <MenuItem value='Income'>Income</MenuItem>
                        <MenuItem value='Expenses'>Expenses</MenuItem>


                    </Select>
                </Box>

                <Box sx={{
                    mt: 2,
                    display: 'flex',
                    gap: 2
                }}>
                    <Button variant='contained' sx={{ backgroundColor: theme.palette.primary.main}}>
                        Create
                    </Button>

                </Box>

            </Box>
        </ThemeProvider>
    )
}
