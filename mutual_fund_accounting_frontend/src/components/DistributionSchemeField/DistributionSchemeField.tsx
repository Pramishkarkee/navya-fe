import { Autocomplete, Box, TextField } from "@mui/material";
import TypographyLabel from "../InputLabel/TypographyLabel";

//data field imports
import { schemeOptions } from "../../constants/Scheme Data/SchemeNameData";
import { distributionCenterOptions } from "../../constants/Distribution Center Data/distCenterOptions";

interface DistributionSchemeFieldProps {
  label1: string;
}

export default function DistributionSchemeField({
  label1,
}: DistributionSchemeFieldProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
      <Box sx={{ width: "50%" }}>
        <TypographyLabel title={label1} />
        <Autocomplete
          id="controllable-states-demo"
          size="small"
          options={distributionCenterOptions}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>

      <Box sx={{ width: "50%" }}>
        <TypographyLabel title={"Scheme Name"} />
        <Autocomplete
          id="controllable-states-demo"
          size="small"
          options={schemeOptions}
          value={"Navya Large Cap Fund"}
          disabled
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
    </Box>
  );
}
