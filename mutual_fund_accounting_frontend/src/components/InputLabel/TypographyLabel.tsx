import { Typography } from "@mui/material";

const TypographyLabel = ({ title }) => {
  return (
    <Typography sx={{ fontSize: "14px", mb: "2px", width: "max-content" }}>
      {" "}
      {title}{" "}
    </Typography>
  );
};

export default TypographyLabel;

export const TypographyLabelEdit = ({ titles }) => {
  return (
    <div>
      {titles.map((title, index) => (
        <Typography
          key={index}
          sx={{
            fontSize: "14px",
            mb: "4px",
            width: "max-content",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          {title}
        </Typography>
      ))}
    </div>
  );
};
