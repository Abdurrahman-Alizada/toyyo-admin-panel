import Dashboard from "layouts/dashboard";

import Users from "layouts/users";
import UsersDetail from "layouts/users/components/Detail"

import ForSale from "layouts/forSale";
import ForRent from "layouts/forRent";
import ForSaleRent from "layouts/forSaleRent";
import ShowOff from "layouts/showOff";

import ForSaleDetail from "layouts/forSale/components/Detail"

import * as React from 'react'
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "context/AuthContext";
import { Group, HouseboatOutlined, HouseSiding, HouseSidingTwoTone, SmartDisplayTwoTone } from "@mui/icons-material";
import DashboardIcon from '@mui/icons-material/Dashboard';


const AdminAuthRoutes = ({ children }) => {
  const { role } = useContext(AuthContext)
  return role === "admin" ? children : <Navigate to="/login" />
}


const routes = [
  {
    routeRole: "admin",
    type: "collapse",
    name: "Dashboard",
    key: "admin/dashboard",
    icon: <DashboardIcon />,
    route: "/admin/dashboard",
    component: <AdminAuthRoutes><Dashboard /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "collapse",
    name: "Users",
    key: "admin/users",
    icon: <Group />,
    route: "/admin/users",
    component: <AdminAuthRoutes><Users /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "collapse",
    name: "Properties for sale",
    key: "admin/for-sale",
    icon: <HouseboatOutlined />,
    route: "/admin/for-sale",
    component: <AdminAuthRoutes><ForSale /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "collapse",
    name: "Properties for rent",
    key: "admin/for-rent",
    icon: <HouseSiding />,
    route: "/admin/for-rent",
    component: <AdminAuthRoutes><ForRent /></AdminAuthRoutes>,
  },

  {
    routeRole: "admin",
    type: "collapse",
    name: "Rent & Sale both",
    key: "admin/rent-sale",
    icon: <HouseSidingTwoTone />,
    route: "/admin/rent-sale",
    component: <AdminAuthRoutes><ForSaleRent /></AdminAuthRoutes>,
  },

  {
    routeRole: "admin",
    type: "collapse",
    name: "Show off",
    key: "admin/show-off",
    icon: <SmartDisplayTwoTone />,
    route: "/admin/show-off",
    component: <AdminAuthRoutes><ShowOff /></AdminAuthRoutes>,
  },

]

const authRoutes = [
  {
    routeRole: "admin",
    type: "authRoutes",
    route: "/admin/user/detail/:id",
    component: <AdminAuthRoutes><UsersDetail /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "authRoutes",
    route: "/admin/property/detail/:id",
    component: <AdminAuthRoutes><ForSaleDetail /></AdminAuthRoutes>,
  },
  

]
export default routes;
export { authRoutes }
