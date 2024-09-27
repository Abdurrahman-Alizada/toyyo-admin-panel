// @mui material components
import Grid from "@mui/material/Grid";

// Admin panel React components
import MDBox from "components/MDBox"
import MDTypography from "components/MDTypography";

import * as React from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DetailCard from "./DetailCard";
import { useParams } from "react-router-dom"

//firestore
import { db } from "../../../firebase"
import { doc, onSnapshot } from "firebase/firestore";

function Detail() {
  const [data, setData] = React.useState({})
  const { id } = useParams()

  React.useEffect(() => {
    if (!id) {
      console.error("ID is missing");
      return;
    }

    const fetchDataById = onSnapshot(
      doc(db, "users", id),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          // console.log("User details are", docSnapshot.data());
          setData(docSnapshot.data());
        } else {
          console.log("No such document!");
        }
      },
      (error) => {
        console.error("Error fetching document:", error);
      }
    );

    return () => {
      fetchDataById(); // This will unsubscribe from the snapshot listener
    };
  }, [id]);

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <MDBox>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MDBox pt={3} px={2}>
                  <MDTypography variant="h6" fontWeight="medium" sx={{ textAlign: 'center' }}>
                    User Detail
                  </MDTypography>
                </MDBox>
                <MDBox pt={1} pb={2} px={2}>
                  <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                    {data && <DetailCard
                    currentUserId={id}
                      data={data}
                      name={data.name}
                      email={data.email}
                      role={data.role}
                      logo={data.logo}
                      likedUserIds={data.likedUserIds}
                      dataId={id}
                    />}
                  </MDBox>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </DashboardLayout>
    </>
  );
}

export default Detail;
