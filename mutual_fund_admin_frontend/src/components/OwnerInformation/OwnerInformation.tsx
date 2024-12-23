import { Box, TextField, useTheme, Button, Typography } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import TypographyLabel from "../InputLabel/TypographyLabel";
import { Controller } from "react-hook-form";
import { useState, useEffect, useRef } from "react";

interface OwnerInformationProps {
  header?: boolean;
  control?: any;
  errors?: any;
  searchButton?: boolean;
  onClickSearch?: any;
  onBoidChange?: (boid: string) => any;
}

export default function OwnerInformation({
  header = false,
  control,
  errors,
  searchButton = false,
  onClickSearch,
  onBoidChange,
}: OwnerInformationProps) {
  const theme = useTheme();

  const [boid, setBoid] = useState("13700");
  // const [dp, setDp] = useState("NIC ASIA BANK LIMITED (13700)");
  // const [dpID, setDpID] = useState("13700");

  // const { data: dpListData } = useGetDPList();
  // const dpOptions = dpListData?.data?.map(
  //   (list) => `${list.dp_name} (${list.dp_id})`
  // );

  const debounceTimeoutRef = useRef<number | null>(null);

  // const handleDpChange = (event, value) => {
  //   setDp(value);
  //   const dpIdMatch = value?.match(/\((\d+)\)$/);
  //   const dpId = dpIdMatch ? dpIdMatch[1] : "";
  //   setDpID(dpId);
  //   setBoid(dpId);
  // };

  const handleBoidChange = (e) => {
    const value = e.target.value;
    setBoid(value);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      onBoidChange(value);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      {header && (
        <Box sx={{ width: "max-content" }}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "19px",
              color: "#212121",
              textAlign: "center",
              width: "max-content",
              borderBottom: `1px solid ${theme.palette.primary[1100]}`,
            }}
          >
            Owner Information
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        {/* <Box sx={{ flexBasis: "50%" }}>
          <TypographyLabel title="Depository Participants" />
          <Controller
            name="dp"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                value={dp}
                size="small"
                id="controllable-states-demo"
                sx={{ "& .MuiSvgIcon-root": { width: "20px", height: "20px" } }}
                options={dpOptions ?? []}
                onChange={(event, value) => {
                  field.onChange(value);
                  handleDpChange(event, value);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            )}
          />
        </Box> */}
        <Box sx={{ flexBasis: "30%" }}>
          <TypographyLabel title="BOID" />
          <Controller
            name="boid"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                size="small"
                placeholder="BOID Number"
                {...field}
                value={boid}
                onChange={(e) => {
                  field.onChange(e);
                  handleBoidChange(e);
                }}
                error={Boolean(errors?.boid)}
              />
            )}
          />
        </Box>

        {searchButton && (
          <Box mt={3.5}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderRadius: "24px",
                width: "max-content",
                height: "auto",
                padding: "6px 24px",
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.secondary[50],
                textTransform: "none",
                ":hover": { backgroundColor: theme.palette.secondary.main },
              }}
              startIcon={<SearchOutlinedIcon />}
              onClick={onClickSearch}
              type="submit"
            >
              Search for User
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
