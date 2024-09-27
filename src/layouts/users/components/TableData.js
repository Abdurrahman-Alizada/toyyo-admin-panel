// layouts/users/data/Data.js
import { Link } from "react-router-dom";
import React from "react";

// Admin panel React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";

// Firestore
import { db } from "../../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

function Data() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const userList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(userList);
      },
      (error) => {
        console.error("Error fetching users:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const SR_NO = ({ srNo }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography variant="body2" fontWeight="small">
          {srNo}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  const EMAIL = ({ email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography variant="body2" fontWeight="small">
          {email}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  const ProfileImage = ({ image }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar
        src={image || "https://t3.ftcdn.net/jpg/05/47/85/88/360_F_547858830_cnWFvIG7SYsC2GLRDoojuZToysoUna4Y.jpg"}
        size="sm"
      />
    </MDBox>
  );

  const USERNAME = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography
          display="block"
          variant="button"
          fontWeight="medium"
          sx={{ textTransform: 'capitalize' }}
        >
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  return {
    columns: [
      { Header: "SR NO#", accessor: "srNo", width: '5%', align: "left" },
      { Header: "Profile", accessor: "profile", width: '10%', align: "left" },
      { Header: "Name", accessor: "users", align: "left" },
      { Header: "Email", accessor: "email", align: "left" },
      { Header: "Action", accessor: "action", align: "right" }
    ],
    rows: data.map((user, index) => ({
      srNo: <SR_NO srNo={index + 1} />,
      profile: <ProfileImage image={user.profileImageUrl} />, // Adjust the field name as per your data
      users: <USERNAME name={user.name} />,
      email: <EMAIL email={user.email} />,
      action: (
        <Link to={`/admin/user/detail/${user.id}`}>
          <MDButton variant="gradient" color="info" size="small">
            Detail
          </MDButton>
        </Link>
      ),
    }))
  };
}

export default Data;
