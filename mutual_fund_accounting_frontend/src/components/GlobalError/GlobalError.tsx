import { useError } from "../../context/ErrorContext";
import ErrorBar from "../Snackbar/ErrorBar";

const GlobalError = () => {
  const { error, clearError } = useError();

  return (
    <ErrorBar
      snackbarOpen={!!error}
      setSnackbarOpen={clearError}
      message={error}
    />
  );
};

export default GlobalError;
