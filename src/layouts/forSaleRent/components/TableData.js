import { Link } from "react-router-dom";
import React from "react";

// Admin panel React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";

// Firestore
import { db } from "../../../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

function Data() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    // Create a query to filter properties that are for sale
    const q = query(
      collection(db, "properties"),
      where("isSale", "==", true),
      where("isRent", "==", true)
    );

    // Subscribe to the query using onSnapshot
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const forSaleList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(forSaleList);
      },
      (error) => {
        console.error("Error fetching properties:", error);
      }
    );

    // Cleanup the subscription on unmount
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

  const PROPPERTYNAME = ({ name }) => (
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
      { Header: "Title", accessor: "name", align: "left" },
      { Header: "Address", accessor: "address", align: "left" },
      { Header: "Action", accessor: "action", align: "right" }
    ],
    rows: data.map((property, index) => ({
      srNo: <SR_NO srNo={index + 1} />,
      name: <PROPPERTYNAME name={property.title} />,
      address: <PROPPERTYNAME name={property.address} />,
      action: (
        <Link to={`/admin/property/detail/${property.id}`}>
          <MDButton variant="gradient" color="info" size="small">
            Detail
          </MDButton>
        </Link>
      ),
    }))
  };
}

export default Data;
