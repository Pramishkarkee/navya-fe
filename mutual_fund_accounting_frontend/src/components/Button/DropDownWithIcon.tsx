import { useState } from "react";
import { MenuItem, Select, InputLabel, FormControl, Box } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";

const DropdownWithIconSector = ({ options, value, onChange }) => {
    return (
        <FormControl
            size="small"
        >
            <InputLabel id="sector-select-label">Select Sector</InputLabel>
            <Select
                labelId="sector-select-label"
                id="sector-select"
                value={value}
                label="Select Sector"
                onChange={onChange}
                startAdornment={<TuneIcon />}
            >
                <MenuItem value="Select Sector" disabled>Select Sector</MenuItem>
                {options.map((option) => (
                    <MenuItem key={option.sector_id} value={option.sector_name}>
                        {option.sector_name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default DropdownWithIconSector;
