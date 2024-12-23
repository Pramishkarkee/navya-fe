import { Box, Typography, useTheme } from "@mui/material";

interface HeaderProps {
  title: string
}
const HeaderDesc = ({ title }: HeaderProps) => {
  const theme = useTheme();
  return (
    <Box>
      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: 600,
          lineHeight: "19px",
          color: theme.palette.secondary.darkGrey,
          textAlign: "center",
          width: "max-content",
          borderBottom: `1px solid ${theme.palette.primary[1100]}`,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default HeaderDesc;
