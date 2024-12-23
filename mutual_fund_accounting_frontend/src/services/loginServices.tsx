import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "config/axiosInstance";

type LoginData = {
  username: string;
  password: string;
};

const loginUser = async (data: LoginData) => {
  const response = await axiosInstance.post(`/api/v1/auth/admin/login`, data);
  return response.data;
};

export const useLoginMutation = () => {
  const navigate = useNavigate();

  // const logOut = () => {
  //   localStorage.removeItem("access_token");
  //   queryClient.clear();
  //   navigate("/", { replace: true });
  // };

  // type decodeJWT = {
  //   exp: number;
  //   iat: number;
  // };

  // const setLogoutTimer = (accessToken) => {
  //   const decodedToken: decodeJWT = jwtDecode(accessToken);
  //   const currentTime = Date.now();
  //   const timeUntillExpiry = decodedToken?.exp * 1000 - currentTime;

  //   setTimeout(() => {
  //     logOut();
  //   }, timeUntillExpiry);
  // };

  // useEffect(() => {
  //   const token = localStorage.getItem("access_token");
  //   if (token) {
  //     setLogoutTimer(token);
  //   }
  // }, []);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.responseData.access_token);
      localStorage.setItem("refresh_token", data.responseData.refresh_token);
      localStorage.setItem("UserName", data.meta.user.full_name);
      // setLogoutTimer(data.access_token);
      navigate("/dashboard", { replace: true });
    },
  });
};
