import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "config/axiosInstance";
interface LoginData {
  username: string;
  password: string;
}

export const useLoginMutation = () => {
  const navigate = useNavigate();

  const userLogin = async (data: LoginData) => {
    const response = await axiosInstance.post(
      // `/auth/api/v1/user-service/login/`,
      `/api/v1/auth/admin/login`,
      data
    );

    return response.data.responseData;
  };

  // const logOut = () => {
  //   localStorage.removeItem("access_token");
  //   queryClient.clear();
  //   navigate("/", { replace: true });
  // };

  // type decodedJWt = {
  //   iat: number;
  //   exp: number;
  // };

  // const setLogoutTimer = (accessToken) => {
  //   const decodedToken: decodedJWt = jwtDecode(accessToken);
  //   console.log("JWT", decodedToken);
  //   const currentTime = Date.now();
  //   const timeUntillExpiration = decodedToken?.exp * 1000 - currentTime;
  //   console.log("JWT time", timeUntillExpiration);

  //   setTimeout(() => {
  //     logOut();
  //   }, timeUntillExpiration);
  // };

  // useEffect(() => {

  //   const token = localStorage.getItem("access_token");
  //   if (token) {
  //     setLogoutTimer(token);
  //   }
  // }, []);

  return useMutation({
    mutationFn: userLogin,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      // setLogoutTimer(data.access);
      navigate("/dashboard", { replace: true });
    },
  });
};

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { axiosInstance } from "config/axiosInstance";
// import { jwtDecode } from "jwt-decode";
// import { useEffect } from "react";
// import { LoginData } from "pages/Login";
// //  interface LoginData  {
// //  email: string;
// //  password: string;
// // }

// export const useLoginMutation = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const userLogin = async (data: LoginData) => {
//     const response = await axiosInstance.post(
//       `/auth/api/v1/user-service/login/`,
//       data
//     );

//     console.log(response);
//     return response.data.responseData;
//   };

//   const logOut = () => {
//     localStorage.removeItem("access_token");
//     queryClient.clear();
//     navigate("/", { replace: true });
//   };

//   type decodedJWt = {
//     iat: number;
//     exp: number;
//   };

//     const setLogoutTimer = (accessToken: string) => {
//     const decodedToken: decodedJWt = jwtDecode(accessToken);
//     console.log("JWT", decodedToken);
//     const currentTime = Date.now();
//     const timeUntillExpiration = decodedToken?.exp * 1000 - currentTime;
//     console.log("JWT time", timeUntillExpiration);

//     const intervalId = setInterval(() => {
//       const now = Date.now();
//       const remainingTime = decodedToken.exp * 1000 - now;
//       console.log("Remaining Time : ", (Math.floor(remainingTime / 1000)));

//       if (remainingTime <= 100) {
//         clearInterval(intervalId);
//         logOut();
//       }
//     }, 1000); // For  second
//     return intervalId;
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     let intervalId: ReturnType<typeof setInterval> | null = null;

//     if (token) {
//       intervalId = setLogoutTimer(token);
//     }

//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//       }
//     };
//   }, []);

//   return useMutation({
//     mutationFn: userLogin,
//     onSuccess: (data) => {
//       localStorage.setItem("access_token", data.access);
//       setLogoutTimer(data.access);
//       navigate("/dashboard", { replace: true });
//     },
//     onError: (error) => {
//       console.log("error", error);
//     },
//   });
// };
