import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { Card, CardMedia, Modal, Dialog, DialogTitle, Button, DialogContent, DialogContentText, DialogActions, Typography, Box, TextField, InputLabel, FormControl, Select, MenuItem, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Assuming you have these Firebase imports set up
import { db } from "../../../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import {Checkbox} from '@mui/material';

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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '1px solid #000',
  borderRadius: '1rem',
  boxShadow: 24,
};

function DetailCard({ propertyId, propertyData }) {
  const [editModal, setEditModal] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [notification, setNotification] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [editedPropertyData, setEditedPropertyData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize editedPropertyData with propertyData when the component mounts or propertyData changes
    setEditedPropertyData({
      title: propertyData?.title || '',
      description: propertyData?.description || '',
      price: propertyData?.price || '',
      rooms: propertyData?.rooms || '',
      address: propertyData?.address || '',
      type: propertyData?.type || '',
      isSale: propertyData?.isSale || false,
      isRent: propertyData?.isRent || false,
    });
  }, [propertyData]);

  const handleEditOpen = () => setEditModal(true);
  const handleEditClose = () => setEditModal(false);
  const handleDeleteAlertOpen = () => setDeleteAlert(true);
  const handleDeleteAlertClose = () => setDeleteAlert(false);
  const handleNotificationOpen = () => setNotification(true);
  const handleNotificationClose = () => setNotification(false);
  const handleImageModalOpen = () => setImageModal(true);
  const handleImageModalClose = () => setImageModal(false);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'properties', propertyId));
      handleDeleteAlertClose();
      handleNotificationOpen();
      navigate("/admin/properties");
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const propertyRef = doc(db, "properties", propertyId);
      await updateDoc(propertyRef, editedPropertyData);
      handleEditClose();
      handleNotificationOpen();
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedPropertyData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Fallback image URL
  const fallbackImageUrl = "https://via.placeholder.com/100x100";

  // Safe access to image URL
  const imageUrl = propertyData?.imageUrls && propertyData.imageUrls.length > 0
    ? propertyData.imageUrls[0]
    : fallbackImageUrl;

  return (
    <>
      <MDSnackbar
        color="success"
        icon="check"
        title="Successfully Updated"
        open={notification}
        onClose={handleNotificationClose}
        close={handleNotificationClose}
      />

      <Dialog
        open={deleteAlert}
        onClose={handleDeleteAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this property?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAlertClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={imageModal}
        onClose={handleImageModalClose}
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
      >
        <Box sx={style}>
          <Card sx={{ display: "flex", flexDirection: "column", backgroundColor: "transparent", boxShadow: "none", overflow: "visible" }}>
            <MDBox position="relative" width="100.25%" shadow="xl" borderRadius="xl">
              <CardMedia
                src={imageUrl}
                component="img"
                title="Property image"
                sx={{
                  maxWidth: "100%",
                  margin: 0,
                  boxShadow: ({ boxShadows: { md } }) => md,
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </MDBox>
          </Card>
        </Box>
      </Modal>

      <BootstrapDialog
        onClose={handleEditClose}
        aria-labelledby="customized-dialog-title"
        open={editModal}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleEditClose}>
          <Typography variant="h3" color="secondary.main" sx={{ pt: 1, textAlign: "center" }}>Edit Property</Typography>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box component="form"
            sx={{
              "& .MuiTextField-root": { m: 2, width: '100%' },
              "& .MuiFormControl-root": { m: 2, width: '100%' },
            }}
            noValidate autoComplete="off"
          >
            <TextField
              label="Title"
              type="text"
              color="secondary"
              required
              value={editedPropertyData.title}
              onChange={(e) => setEditedPropertyData({ ...editedPropertyData, title: e.target.value })}
            />
            <TextField
              label="Description"
              type="text"
              multiline
              rows={3}
              color="secondary"
              required
              value={editedPropertyData.description}
              onChange={(e) => setEditedPropertyData({ ...editedPropertyData, description: e.target.value })}
            />
            <TextField
              label="Price"
              type="number"
              color="secondary"
              required
              value={editedPropertyData.price}
              onChange={(e) => setEditedPropertyData({ ...editedPropertyData, price: e.target.value })}
            />
            <TextField
              label="Rooms"
              type="number"
              color="secondary"
              required
              value={editedPropertyData.rooms}
              onChange={(e) => setEditedPropertyData({ ...editedPropertyData, rooms: e.target.value })}
            />
            <TextField
              label="Address"
              type="text"
              color="secondary"
              required
              value={editedPropertyData.address}
              onChange={(e) => setEditedPropertyData({ ...editedPropertyData, address: e.target.value })}
            />
            <FormControl fullWidth sx={{ m: 2 }}>
              <InputLabel id="property-type-label">Property Type</InputLabel>
              <Select
                labelId="property-type-label"
                value={editedPropertyData.type}
                label="Property Type"
                onChange={(e) => setEditedPropertyData({ ...editedPropertyData, type: e.target.value })}
              >
                <MenuItem value="apartment">Apartment</MenuItem>
                <MenuItem value="house">House</MenuItem>
                <MenuItem value="condo">Condo</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ maxWidth: "100%", paddingLeft: "5%" }}>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={editedPropertyData.isSale}
                    onChange={handleInputChange}
                    name="isSale"
                  />
                }
                label="For Sale"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editedPropertyData.isRent}
                    onChange={handleInputChange}
                    name="isRent"
                  />
                }
                label="For Rent"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editedPropertyData.boostProperty}
                    onChange={handleInputChange}
                    name="boostProperty"
                  />
                }
                label="Boost Property"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editedPropertyData.isShowOff}
                    onChange={handleInputChange}
                    name="isShowOff"
                  />
                }
                label="Show Off"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editedPropertyData.renewMonth}
                    onChange={handleInputChange}
                    name="renewMonth"
                  />
                }
                label="Renew Monthly"
              />
            </Box>
          
        
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <MDButton variant="contained" color="info" onClick={handleUpdate}>Update</MDButton>
        </DialogActions>
      </BootstrapDialog>

      <MDBox component="li" display="flex" alignItems="center" py={1} mb={1}>
        <MDBox
          component="img"
          src={imageUrl}
          alt={propertyData?.title || 'Property'}
          width="2.5rem"
          height="2.5rem"
          borderRadius="md"
          mr={2}
          onClick={handleImageModalOpen}
          style={{ cursor: 'pointer' }}
        />
        <MDBox display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center">
          <MDTypography variant="button" fontWeight="medium">
            {propertyData?.title || 'Untitled Property'}
          </MDTypography>
          <MDTypography variant="caption" color="text">
            {propertyData?.address || 'No address provided'}
          </MDTypography>
        </MDBox>
        <MDBox ml="auto">
          <MDButton variant="text" color="info" onClick={handleEditOpen}>
            Edit
          </MDButton>
          <MDButton variant="text" color="error" onClick={handleDeleteAlertOpen}>
            Delete
          </MDButton>
        </MDBox>
      </MDBox>

      <MDBox display="flex" flexDirection="column">
        <MDTypography variant="button" mt={3} fontWeight="medium">
          Property Details:
        </MDTypography>
        <MDBox display="flex" mt={1}>
          <MDTypography variant="button" fontWeight="medium">
            Type:&nbsp;
          </MDTypography>
          <MDTypography variant="button">
            {propertyData?.type || 'Not specified'}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" mt={1}>
          <MDTypography variant="button" fontWeight="medium">
            Price:&nbsp;
          </MDTypography>
          <MDTypography variant="button">
            ${propertyData?.price || 'Not specified'}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" mt={1}>
          <MDTypography variant="button" fontWeight="medium">
            Rooms:&nbsp;
          </MDTypography>
          <MDTypography variant="button">
            {propertyData?.rooms || 'Not specified'}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" mt={1}>
          <MDTypography variant="button" fontWeight="medium">
            For Sale:&nbsp;
          </MDTypography>
          <MDTypography variant="button">
            {propertyData?.isSale ? 'Yes' : 'No'}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" mt={1}>
          <MDTypography variant="button" fontWeight="medium">
            For Rent:&nbsp;
          </MDTypography>
          <MDTypography variant="button">
            {propertyData?.isRent ? 'Yes' : 'No'}
          </MDTypography>
        </MDBox>
       
        <MDBox display="flex" mt={1}>
          <MDTypography variant="button" fontWeight="medium">
            Show off:&nbsp;
          </MDTypography>
          <MDTypography variant="button">
            {propertyData?.isShowOff ? 'Yes' : 'No'}
          </MDTypography>
        </MDBox>
       
      </MDBox>
    </>
  );
}

export default DetailCard;