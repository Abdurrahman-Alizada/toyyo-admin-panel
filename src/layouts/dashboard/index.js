import React, { useState, useEffect } from 'react';
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import CircularProgress from '@mui/material/CircularProgress';

// Firebase
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import MDTypography from 'components/MDTypography';

function Dashboard() {
  const [deviceTokenId, setDeviceTokenId] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);

  const [totalProperties, setTotalProperties] = useState(0);
  const [totalForSale, setTotalForSale] = useState(0);
  const [totalForRent, setTotalForRent] = useState(0);
  const [totalShowOff, setTotalShowOff] = useState(0);

  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const getAllTokens = await getDocs(collection(db, "deviceTokens"));
        const dbTokenData = getAllTokens.docs.map((items) => ({ id: items.id, ...items.data() }));
        let tokenData = {};
        for (let i = 0; i < dbTokenData.length; i++) {
          Object.assign(tokenData, dbTokenData[i]);
        }
        setDeviceTokenId(tokenData.id);

        // Fetch total users
        const usersSnapshot = await getDocs(collection(db, "users"));
        setTotalUsers(usersSnapshot.size);

        // Fetch total properties
        const propertiesSnapshot = await getDocs(collection(db, "properties"));
        setTotalProperties(propertiesSnapshot.size);

        // Fetch properties for sale
        const saleQuery = query(collection(db, "properties"), where("isSale", "==", true));
        const saleSnapshot = await getDocs(saleQuery);
        setTotalForSale(saleSnapshot.size);

        // Fetch properties for rent
        const rentQuery = query(collection(db, "properties"), where("isRent", "==", true));
        const rentSnapshot = await getDocs(rentQuery);
        setTotalForRent(rentSnapshot.size);

        // Fetch properties for show off
        const showOffQuery = query(collection(db, "properties"), where("isShowOff", "==", true));
        const showOffSnapshot = await getDocs(showOffQuery);
        setTotalShowOff(showOffSnapshot.size);

      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [deviceTokenId]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {loading ? (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="primary"
                    icon="person_add"
                    title="Total Users"
                    count={totalUsers}
                    percentage={{
                      color: "success",
                      amount: "",
                      label: "Just updated",
                    }}
                  />
                </MDBox>
              </Grid>
            </Grid>

            <MDTypography variant="button" fontWeight="bold" color="text" marginBottom="30px" marginTop="30px">
              Properties
            </MDTypography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="dark"
                    icon="weekend"
                    title="All"
                    count={totalProperties}
                    percentage={{
                      color: "success",
                      amount: "+55%",
                      label: "than last week",
                    }}
                  />
                </MDBox>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    icon="leaderboard"
                    title="For Sale"
                    count={totalForSale}
                    percentage={{
                      color: "success",
                      amount: "+3%",
                      label: "than last month",
                    }}
                  />
                </MDBox>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    icon="leaderboard"
                    title="For Rent"
                    count={totalForRent}
                    percentage={{
                      color: "success",
                      amount: "+3%",
                      label: "than last month",
                    }}
                  />
                </MDBox>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    icon="leaderboard"
                    title="For Sale/Rent"
                    count={totalForRent + totalForSale}
                    percentage={{
                      color: "success",
                      amount: "+3%",
                      label: "than last month",
                    }}
                  />
                </MDBox>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    icon="leaderboard"
                    title="Show Off (Free)"
                    count={totalShowOff}
                    percentage={{
                      color: "success",
                      amount: "+3%",
                      label: "than last month",
                    }}
                  />
                </MDBox>
              </Grid>

            </Grid>
          </Grid>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
