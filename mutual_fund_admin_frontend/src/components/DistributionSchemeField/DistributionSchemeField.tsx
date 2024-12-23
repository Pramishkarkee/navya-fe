import { Box, Select, MenuItem } from "@mui/material";
import TypographyLabel from "../InputLabel/TypographyLabel";
import { Controller } from "react-hook-form";

interface DistributionSchemeFieldProps {
  label1: string;
  control?: any;
  distribution?: boolean;
}

export default function DistributionSchemeField({
  control,
  label1,
  distribution = true,
}: DistributionSchemeFieldProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "60%" }}>
      {distribution && (
        <Box sx={{ width: "50%" }}>
          <TypographyLabel title={label1} />
          <Controller
            defaultValue="Navya Advisors"
            name="distributionCenter"
            control={control}
            render={({ field }) => (
              <Select {...field} fullWidth size="small">
                <MenuItem value="Navya Advisors">Navya Advisors</MenuItem>
                <MenuItem value="Mahalaxmi">Mahalaxmi</MenuItem>
              </Select>
            )}
          />
        </Box>
      )}
      {/* <Box sx={{ width: "50%" }}>
        <TypographyLabel title={"Distribution Center "} />
        <Controller
          defaultValue="NAVYA LARGE CAP FUND"
          name="schemeName"
          control={control}
          render={({ field }) => (
            <Select fullWidth {...field} size="small" disabled>
              <MenuItem value="NAVYA LARGE CAP FUND">
                NAVYA LARGE CAP FUND
              </MenuItem>
            </Select>
          )}
        />
      </Box> */}

      <Box sx={{ width: "50%" }}>
        <TypographyLabel title={"Scheme Name"} />
        <Controller
          defaultValue="Navya Large Cap Fund"
          name="schemeName"
          control={control}
          render={({ field }) => (
            <Select fullWidth {...field} size="small" disabled>
              <MenuItem value="Navya Large Cap Fund">
                NAVYA LARGE CAP FUND
              </MenuItem>
            </Select>
          )}
        />
      </Box>
    </Box>
  );
}
