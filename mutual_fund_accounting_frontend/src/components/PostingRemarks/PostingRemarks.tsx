import { Box, TextField } from "@mui/material";
import TypographyLabel from "../InputLabel/TypographyLabel";

const PostingRemarks = () => {
  return (
    <Box sx={{width:'50%'}}>
      <TypographyLabel title={"Posting Remark"} />
      <TextField fullWidth size="small" multiline  placeholder="Text Area" />
    </Box>
  );
};

export default PostingRemarks;
