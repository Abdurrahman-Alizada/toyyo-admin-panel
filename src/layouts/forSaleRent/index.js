import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  Icon,
  CircularProgress,
  OutlinedInput,
  InputAdornment,
  IconButton,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { green } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

// Admin panel React components
import MDBox from "components/MDBox"
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Admin panel React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MDSnackbar from "components/MDSnackbar";

// Data
import Data from "./components/TableData";

// Firestore
import { auth, db, storage } from "../../firebase"
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

// Modal Styles
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

function PropertiesIndex() {
  const { columns, rows } = Data();
  const [propertyModal, setPropertyModal] = useState(false);
  const [propertyNotification, setPropertyNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageProgress, setImageProgress] = useState(0);
  const [imageProgressValue, setImageProgressValue] = useState(0);
  const [propertyData, setPropertyData] = useState({
    address: '',
    boostProperty: false,
    description: '',
    giftAmount: '',
    isRent: false,
    isSale: true,
    isShowOff: false,
    phoneNumber: '',
    price: '',
    renewMonth: true,
    rooms: '',
    title: '',
    type: '',
  });
  const [files, setFiles] = useState([]);

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPropertyData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Upload Image Effect
  useEffect(() => {
    const uploadFiles = async () => {
      const uploadPromises = files.map(file => {
        const name = `${Date.now()}-${file.name}`;
        const storageRef = ref(storage, `properties/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setImageProgress(progress);
              setImageProgressValue(progress);
            },
            (error) => {
              console.log("ERROR == ", error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      });

      try {
        const imageUrls = await Promise.all(uploadPromises);
        setPropertyData(prev => ({
          ...prev,
          images: imageUrls
        }));
      } catch (error) {
        console.error("Error uploading files:", error);
        setError("Error uploading files");
      }
    };

    if (files.length > 0) {
      uploadFiles();
    }
  }, [files]);

  const onAddProperty = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addDoc(collection(db, "properties"), {
        ...propertyData,
        createdAt: new Date(),
        userId: auth.currentUser.uid, // Assuming the user is authenticated
      });
      propertyModalClose();
      propertyNotificationOpen();
      setPropertyData({
        address: '',
        boostProperty: false,
        description: '',
        giftAmount: '',
        isRent: false,
        isSale: true,
        isShowOff: false,
        phoneNumber: '',
        price: '',
        renewMonth: true,
        rooms: '',
        title: '',
        type: '',
      });
      setImageProgress(0);
      setImageProgressValue(0);
      setFiles([]);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const propertyModalOpen = () => setPropertyModal(true);
  const propertyModalClose = () => {
    setPropertyModal(false);
    setLoading(false);
    setError('');
    setImageProgress(0);
    setImageProgressValue(0);
    setFiles([]);
  };
  const propertyNotificationOpen = () => setPropertyNotification(true);
  const propertyNotificationClose = () => setPropertyNotification(false);

  // Filter rows based on search term
  const filteredRows = rows.filter(row => {
    const title = row?.name?.props?.name?.toLowerCase();
    const address = row?.address?.props?.name?.toLowerCase();
    const search = searchTerm?.toLowerCase();
    return title?.includes(search) || address?.includes(search);
  });

  return (
    <>
      <MDSnackbar
        color="success"
        icon="check"
        title="Successfully Added"
        content="Property has been added successfully"
        open={propertyNotification}
        onClose={propertyNotificationClose}
        close={propertyNotificationClose}
      />

      {/* Add Property Modal */}
      <BootstrapDialog
        onClose={propertyModalClose}
        aria-labelledby="customized-dialog-title"
        open={propertyModal}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={propertyModalClose}>
          <Typography variant="h3" color="secondary.main" sx={{ pt: 1, textAlign: "center" }}>Add Property</Typography>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 2, width: '100%' },
              "& .MuiFormControl-root": { m: 2, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="Title"
              name="title"
              value={propertyData.title}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Address"
              name="address"
              value={propertyData.address}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Description"
              name="description"
              value={propertyData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={propertyData.price}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Gift Amount"
              name="giftAmount"
              type="number"
              value={propertyData.giftAmount}
              onChange={handleInputChange}
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={propertyData.phoneNumber}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Number of Rooms"
              name="rooms"
              type="number"
              value={propertyData.rooms}
              onChange={handleInputChange}
            />
            <Box sx={{ maxWidth: "100%", }}>
              <FormControl fullWidth>
                <InputLabel id="property-type-select-label" sx={{ height: "2.8rem" }} required>Property Type</InputLabel>
                <Select
                  labelId="property-type-select-label"
                  id="property-type-select"
                  name="type"
                  value={propertyData.type}
                  label="Property Type"
                  onChange={handleInputChange}
                  sx={{ height: "2.8rem" }}
                >
                  <MenuItem value="house">House</MenuItem>
                  <MenuItem value="apartment">Apartment</MenuItem>
                  <MenuItem value="commercial">Commercial</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ maxWidth: "100%", paddingLeft: "5%" }}>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={propertyData.isSale}
                    onChange={handleInputChange}
                    name="isSale"
                  />
                }
                label="For Sale"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={propertyData.isRent}
                    onChange={handleInputChange}
                    name="isRent"
                  />
                }
                label="For Rent"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={propertyData.boostProperty}
                    onChange={handleInputChange}
                    name="boostProperty"
                  />
                }
                label="Boost Property"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={propertyData.isShowOff}
                    onChange={handleInputChange}
                    name="isShowOff"
                  />
                }
                label="Show Off"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={propertyData.renewMonth}
                    onChange={handleInputChange}
                    name="renewMonth"
                  />
                }
                label="Renew Monthly"
              />
            </Box>

            {/* Image upload field */}


            <Box sx={{ maxWidth: "100%", marginTop:2 }}>
              <FormControl fullWidth sx={{ mt: 2 }} >
                <InputLabel htmlFor="outlined-adornment-profile-image">Property image</InputLabel>
                <OutlinedInput
                  sx={{ height: "2.8rem" }}
                  id="outlined-adornment-profile-image"
                  startAdornment={
                    <InputAdornment position="start">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFiles(Array.from(e.target.files))}
                      />
                    </InputAdornment>
                  }
                  label="Property Image"
                />
                <Box sx={{ position: 'relative', display: 'inline-flex', marginLeft: 2, marginTop: 1 }}>
                  <CircularProgress
                    variant="determinate"
                    size={25}
                    sx={{
                      color: green[500],
                    }}
                    value={imageProgress}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {imageProgressValue === 100 ? <CheckIcon /> : null}
                  </Box>
                </Box>
              </FormControl>
            </Box>
            {/* Location picker placeholder */}
            {/* <TextField
              label="Location"
              name="location"
              value="Use a map component to select location"
              InputProps={{
                readOnly: true,
              }}
            /> */}

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          {loading ? (
            <CircularProgress
              size={30}
              sx={{
                color: green[500],
              }}
            />
          ) : (
            <MDButton variant="contained" color="info" type="submit" onClick={onAddProperty}>
              Save Property
            </MDButton>
          )}
        </DialogActions>
      </BootstrapDialog>

      {/* Dashboard Layout */}
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <MDBox>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={3}
                    px={2}
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                  >
                    <MDBox pt={2} pb={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
                      <MDTypography variant="h6" fontWeight="medium" color="white">
                        Properties For Sale And Rent
                      </MDTypography>
                      <MDButton variant="gradient" color="light" onClick={propertyModalOpen}>
                        <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                        &nbsp;ADD Property
                      </MDButton>
                    </MDBox>
                  </MDBox>

                  {/* Search Field */}
                  <MDBox px={2} pt={2}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Search by title or address"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon>search</Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </MDBox>

                  <MDBox pt={3}>
                    {
                      filteredRows.length ?
                        <DataTable
                          table={{ columns, rows: filteredRows }}
                          isSorted={false}
                          entriesPerPage={false}
                          showTotalEntries={false}
                          noEndBorder
                        />
                        :
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 2,        
                          }}
                        >
                          <MDTypography variant="h6" textAlign="center" color="textSecondary">
                            No record found
                          </MDTypography>
                        </Box>
                    }

                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </DashboardLayout>
    </>
  );
}

export default PropertiesIndex;