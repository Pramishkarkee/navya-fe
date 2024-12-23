import { Stack, Button, useTheme, CircularProgress } from "@mui/material";

interface RoundedButtonProps {
  title1: string;
  title2?: string;
  disable?: boolean;
  onClick1?: any;
  onClick2?: any;
  loading?: boolean;
}

export default function RoundedButton({
  title1,
  title2,
  onClick1,
  onClick2,
  disable,
  loading,
}: RoundedButtonProps) {
  const theme = useTheme();
  return (
    <div>
      <Stack mt={1} direction="row" spacing={1}>
        <Button
          disabled={!!disable || loading}
          type="submit"
          variant="contained"
          sx={{
            width: 'fit-content',
            borderRadius: "100px",
            padding: "6px 24px",
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "20px",
            backgroundColor: theme.palette.secondary.main,
            "&:hover": {
              bgcolor: theme.palette.primary.main,
            },
            "&:disabled": {
              backgroundColor:theme.palette.primary.darkColor,
              },
          }}
          onClick={onClick1}
        >
          {title1}
          {loading && (
          <CircularProgress
            size={20} 
            // color=""
            sx={{ ml: 1, color: theme.palette.primary.main }}
          />
        )}
        </Button>

        {title2 && (
          <Button
            variant="outlined"
            sx={{
              borderRadius: "100px",
              padding: "6px 24px",
              borderColor: "#616161",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "20px",
              color: theme.palette.secondary.main,
            }}
            onClick={onClick2}
          >
            {title2}
          </Button>
        )}
      </Stack>
    </div>
  );
}
