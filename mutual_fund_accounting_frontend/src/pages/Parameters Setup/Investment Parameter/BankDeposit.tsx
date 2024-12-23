import { Box, Grid, TextField, Autocomplete } from '@mui/material'
import { SectorOptions } from '../../../constants/SectorData/SectorData'
import { BankOptions } from '../../../constants/Bank Data/BankData'
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";

export default function BankDeposit() {

  const handleAdd = () => {
    console.log("clicked add")
  }

  const handleReset = () => {
    console.log("clicked reset")
  }

  return (
    <Box sx={{ p: 0.5 }}>
      <Grid container spacing={1} sx={{ width: { xs: '70%', lg: '50%' } }}>

        <Grid item xs={6}>
          <TypographyLabel title={"Scheme Name"} />
          <TextField
            fullWidth
            size='small'
          />
        </Grid>

        <Grid item xs={6}>
          <TypographyLabel title={"External Limit (%)"} />
          <TextField
            fullWidth
            size='small'
          />
        </Grid>
        <Grid item xs={6}>
          <TypographyLabel title={"Bank Name"} />
          <Autocomplete
            size='small'
            options={BankOptions}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>

        <Grid item xs={6}>
          <TypographyLabel title={"Scheme Limit (%)"} />
          <TextField
            fullWidth
            size='small'
          />
        </Grid>

        <Grid item xs={6}>
          <TypographyLabel title={"Sector"} />
          <Autocomplete
            size='small'
            options={SectorOptions}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>

        <Grid item xs={6}>
          <TypographyLabel title={"Internal Limit (%)"} />
          <TextField
            fullWidth
            size='small'
          />
        </Grid>

      </Grid>

      <Box>
        <RoundedButton title1='Add' title2='Reset' onClick1={handleAdd} onClick2={handleReset} />
      </Box>
    </Box>
  )
}
