import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
} from "context";

import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar,  darkMode } = controller;

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("static");
    } else {
      setNavbarType("sticky");
    }
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });
  const navigate = useNavigate()

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            {/* <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox> */}
           
           <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>

            <MDBox display="flex" justifyContent="space-between">
              <MDBox
              onClick={()=>navigate("/admin/store/products")}
              sx={{cursor:"pointer"}}  
              variant="gradient"
                bgColor={"warning"}
                borderRadius="xl"
                color={"white"}
                display="flex"
                flexDirection="column"
                padding={2}
                justifyContent="center"
                alignItems="center"
                marginRight={1}
              >
                <Icon fontSize="medium" color="inherit" >
                inventory
                </Icon>
                <MDTypography color={"white"}>Products</MDTypography>
              </MDBox>

              <MDBox
              onClick={()=>navigate("/admin/store/orders")}
              sx={{cursor:"pointer"}}  
                variant="gradient"
                bgColor={"error"}
                borderRadius="xl"
                color={"white"}
                display="flex"
                flexDirection="column"
                padding={2}
                justifyContent="center"
                alignItems="center"
              >
                <Icon fontSize="medium" color="inherit" >
                analytics
                </Icon>
                <MDTypography color={"white"}>Orders</MDTypography>
              </MDBox>



            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;