import { Box, TextField } from "@mui/material";
import TypographyLabel from "../InputLabel/TypographyLabel";
import { Controller } from "react-hook-form";

const PostingRemarks = ({ control, errors }): any => {
  return (
    <Box sx={{ width: "50%" }}>
      <TypographyLabel title={"Posting Remark"} />
      <Controller
        name="postingRemark"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            // ref={null}
            // inputRef={field.ref}
            // value={field.value}
            // onChange={(e) => field.onChange(e.target.value)}
            fullWidth
            size="small"
            multiline
            placeholder="Text Area"
            error={Boolean(errors?.postingRemark)}
            helperText={errors?.postingRemark?.message}
          />
        )}
      />
    </Box>
  );
};

export default PostingRemarks;
