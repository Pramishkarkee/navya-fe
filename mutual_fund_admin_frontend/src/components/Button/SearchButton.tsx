import React from 'react'
import { Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import SearchIcon from '@mui/icons-material/Search';

interface SearchButtonProps {
    title: string,
    onClick?: void
}

const SearchButton = ({ title }) => {

    const theme = useTheme()

    return (

        <Button
            type="submit"
            variant="contained"
            sx={{
                borderRadius: "100px",
                padding: "6px 12px",
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: "20px",
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary[1100],
                textTransform: 'none',
                "&:hover": {
                    bgcolor: theme.palette.secondary.lightGrey,
                },
                '& .MuiButton-startIcon': {
                    marginRight:'4px'
                }
            }}
            // onClick={onClick}
            startIcon={

                <SearchIcon sx={{
                    color: theme.palette.primary[1100],
                }} />
            }
        >
            {title}
        </Button>)
}

export default SearchButton