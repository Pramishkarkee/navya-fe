import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { colorTokens } from "../../theme";

const Loader = styled(Box)`
  width: 100px;
  height: 100px;
  aspect-ratio: 1;
  display: grid;
  align: center;
  border: 4px solid #0000;
  border-radius: 50%;
  border-color: ${colorTokens.mainColor[1100]} #0000;
  animation: l16 1s infinite linear;

  &::before,
  &::after {
    content: "";
    grid-area: 1/1;
    margin: 2px;
    border: inherit;
    border-radius: 50%;
  }

  &::before {
    border-color: ${colorTokens.mainColor[900]} #0000;
    animation: inherit;
    animation-duration: 0.5s;
    animation-direction: reverse;
  }

  &::after {
    margin: 8px;
  }

  @keyframes l16 {
    100% {
      transform: rotate(1turn);
    }
  }
`;

const SpinningLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        width: { sm: "100%", md: "100%", lg: "100%" },
      }}
    >
      <Loader />
    </Box>
  );
};

export default SpinningLoader;
