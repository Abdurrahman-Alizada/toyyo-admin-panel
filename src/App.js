import { useState, useEffect, useContext } from "react";
import * as React from 'react'

// react-router components
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";

// Amdin panel React example components
import Sidenav from "examples/Sidenav";

// Amdin panel React themes
import theme from "assets/theme";

// Amdin panel React Dark Mode themes

// Routes
import { AuthContext } from "context/AuthContext";
import routes, { authRoutes } from "routes";
import Login from "layouts/authentication/users/Login"

// Images
// Amdin panel React contexts
import { useMaterialUIController, setMiniSidenav } from "context";

function App() {
  const { role } = useContext(AuthContext)
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    layout,
    sidenavColor,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };


  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });
  const getAuthRoutes = (allAuthRoutes) =>
    allAuthRoutes.map((route) => {
      if (route.route && route.routeRole === role) {
        return <Route exact path={route.route} element={route.component} />;
      }
      return null;
    });

  return (
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      {layout === "/admin/dashboard" && (
        <>
          {role && <Sidenav
            color={sidenavColor}
            brandName={"Toyyo Admin Panel"}
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />}
        </>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        {getRoutes(routes)}
        {getAuthRoutes(authRoutes)}
        {role === null ? <Route path="*" element={<Navigate to={`/login`} />} /> : <Route path="*" element={<Navigate to={`/${role}/dashboard`} />} />}
      </Routes>
    </ThemeProvider>
  );
}
export default App