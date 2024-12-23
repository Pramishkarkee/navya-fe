import { Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import { routes } from "./routes";
import Login from "pages/Login";
import { Suspense } from "react";
import SpinningLoader from "components/Loader/Loader";

export default function MainRoutes() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          {routes.map((item, index) => (
            <Route
              key={index}
              path={item.path}
              element={
                <Suspense fallback={<SpinningLoader />}>
                  {item.component}
                </Suspense>
              }
            />
          ))}
        </Route>

        <Route path="/" element={<Login />} />
      </Routes>
    </>
  );
}
