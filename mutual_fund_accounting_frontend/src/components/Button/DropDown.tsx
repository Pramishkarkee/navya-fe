import React from 'react';
import { Select, MenuItem, FormControl,   useTheme } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';

const DropdownWithIcon = ({ options, value, onChange  }) => {
    const theme = useTheme();
    return (
        <FormControl size="small" sx={{ margin: 0, padding: 0 , maxHeight: "40px" }}>
            <Select
                autoWidth 
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: '250px',
                            maxWidth: 'auto',
                            overflowY: 'auto',
                        },
                    },
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                // label="Options"
                onChange={onChange}
                size="small"
                IconComponent={() => null}
               startAdornment={ 
               <TuneIcon sx={{ color: '#616161', cursor: 'pointer', }} />
               }
                // renderValue={(selected) => {
                //     return(
                //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
                //         {selected} 
                //     </Box>
                //     )
                // }
                // }
                
                    
                variant="outlined"
                sx={{
                  mt: 1,
                  borderBlockColor: "white",
                  borderRadius: "24px",
                  backgroundColor: theme.palette.primary.light,
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiOutlinedInput-input": {
                    ml: "6px",
                  },
                }}
            >
                {options.map((option) => (
                    <MenuItem sx={{maxHeight:'40px'}} key={option.value} value={option.value}>
                       {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default DropdownWithIcon;
