import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { Card, CardMedia, Modal, CircularProgress, OutlinedInput, DialogContentText, InputAdornment, IconButton, DialogActions, Dialog, DialogTitle, Button, DialogContent, Typography, Box, TextField, InputLabel, FormControl, Divider, Select, MenuItem } from '@mui/material';
import { green } from "@mui/material/colors";
import CheckIcon from '@mui/icons-material/Check';

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

import { db, storage } from "../../../firebase";
import { doc, deleteDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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

function Bill({ name, email, logo, dataId, data }) {

  const [brandsModal, setBrandsModal] = React.useState(false);
  const [bankLogoModal, setBankLogoModal] = React.useState(false);
  const [deleteAlert, setDeleteAlert] = React.useState(false);
  const [brandsNotification, setBrandsNotification] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [imageProgress, setImageProgress] = React.useState(0);
  const [imageProgressValue, setImageProgressValue] = React.useState(0);
  const [file, setFile] = React.useState('');
  const [dbBrandsData, setDbBrandsData] = React.useState({});
  const navigate = useNavigate();

  React.useEffect(() => {
    const uploadFile = () => {
      const name = file.name;
      const storageRef = ref(storage, `users/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageProgress(progress);
          setImageProgressValue(progress);
        },
        (error) => {
          console.log("ERROR == ", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setDbBrandsData((prev) => ({
              ...prev,
              logo: downloadURL,
            }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const fetchDataById = async (dataId) => {
    try {
      const getBrands = await getDoc(doc(db, "users", dataId));
      if (getBrands.exists()) {
        setDbBrandsData(getBrands.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log('error == ', error);
    }
  };

  React.useEffect(() => {
    fetchDataById(dataId);
  }, [dataId]);

  const deleteById = async (dataId) => {
    try {
      if (dataId) {
        const reference = doc(db, 'users', dataId);
        await deleteDoc(reference);
      }
      navigate("/admin/users");
    } catch (error) {
      console.log('error == ', error);
    }
  };

  const onUpdateBrand = async (e) => {
    e.preventDefault();

    const updateData = {
      name: dbBrandsData.name,
      phoneNumber: dbBrandsData.phoneNumber,
      logo: dbBrandsData.logo || "https://t3.ftcdn.net/jpg/05/47/85/88/360_F_547858830_cnWFvIG7SYsC2GLRDoojuZToysoUna4Y.jpg",

      latitude: dbBrandsData.latitude,
      longitude: dbBrandsData.longitude,
      address: dbBrandsData.address,
      gender: dbBrandsData.gender,
      dateOfBirth: dbBrandsData.dateOfBirth,
      profileImageUrl: dbBrandsData.profileImageUrl,
      age: dbBrandsData.age,
      isBlindMode: dbBrandsData.isBlindMode,
    };

    try {
      setLoading(true);
      if (dataId) {
        const brandsDocRef = doc(db, "users", dataId);
        await updateDoc(brandsDocRef, updateData);
      }
      brandsModalClose();
      brandsNotificationOpen();
      setImageProgress(0);
      setImageProgressValue(0);
    }
    catch (error) {
      setError(error.code);
      setLoading(false);
    }
  }

  const deleteAlertOpen = () => setDeleteAlert(true);
  const deleteAlertClose = () => setDeleteAlert(false);
  const brandsModalOpen = () => setBrandsModal(true);
  const brandsModalClose = () => {
    setBrandsModal(false);
    setLoading(false);
    setError('');
    setImageProgress(0);
    setImageProgressValue(0);
  };
  const brandsNotificationOpen = () => setBrandsNotification(true);
  const brandsNotificationClose = () => setBrandsNotification(false);
  // const bankLogoModalOpen = () => setBankLogoModal(true);
  const bankLogoModalClose = () => setBankLogoModal(false);


  return (
    <>
      <MDSnackbar
        color="success"
        icon="check"
        title="Successfully Update"
        // content="Hello, world! This is a brandsNotification message"
        // dateTime="11 mins ago"
        open={brandsNotification}
        onClose={brandsNotificationClose}
        close={brandsNotificationClose}
      />
      <Dialog
        open={deleteAlert}
        onClose={deleteAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Alert"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteAlertClose}>Cancel</Button>
          <Button sx={{ color: 'error.main' }} onClick={() => { deleteById(dataId) }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={bankLogoModal}
        onClose={bankLogoModalClose}
        aria-labelledby="bankLogoModal-bankLogoModal-title"
        aria-describedby="bankLogoModal-bankLogoModal-description"
      >
        <Box sx={style}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "transparent",
              boxShadow: "none",
              overflow: "visible",
            }}
          >
            <MDBox position="relative" width="100.25%" shadow="xl" borderRadius="xl">
              <CardMedia
                src={logo || "https://t3.ftcdn.net/jpg/05/47/85/88/360_F_547858830_cnWFvIG7SYsC2GLRDoojuZToysoUna4Y.jpg"}
                component="img"
                title="Profile image"
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
        onClose={brandsModalClose}
        aria-labelledby="customized-dialog-title"
        open={brandsModal}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={brandsModalClose}>
          <Typography variant="h3" color="secondary.main" sx={{ pt: 1, textAlign: "center" }}>Edit</Typography>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 2, maxWidth: "100%", display: "flex", direction: "column", justifyContent: "center" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="User Name"
              type="text"
              color="secondary"
              required
              value={dbBrandsData.name}
              onChange={(e) => setDbBrandsData({
                ...dbBrandsData,
                name: e.target.value
              })}
            />

            <TextField
              label="Phone number"
              type="text"
              rows={1}
              color="secondary"
              required
              value={dbBrandsData.phoneNumber}
              onChange={(e) => setDbBrandsData({
                ...dbBrandsData,
                phoneNumber: e.target.value
              })}
            />
            <TextField
              label="Latitude"
              type="number"
              rows={1}
              color="secondary"
              required
              value={dbBrandsData.latitude}
              onChange={(e) => setDbBrandsData({
                ...dbBrandsData,
                latitude: e.target.value
              })}
            />
            <TextField
              label="Longitude"
              type="number"
              rows={1}
              color="secondary"
              required
              value={dbBrandsData.longitude}
              onChange={(e) => setDbBrandsData({
                ...dbBrandsData,
                longitude: e.target.value
              })}
            />

            <Box sx={{ maxWidth: "100%", m: 2 }}>

              <FormControl fullWidth >
                <InputLabel id="demo-simple-select-label" sx={{ height: "2.8rem" }} required>Gender</InputLabel>
                <Select
                  sx={{ height: "2.8rem" }}
                  value={dbBrandsData.gender}
                  label="Gender"
                  onChange={(e) => setDbBrandsData({
                    ...dbBrandsData,
                    gender: e.target.value
                  })}
                >
                  <MenuItem value={"male"}>Male</MenuItem>
                  <MenuItem value={"female"}>Female</MenuItem>
                  <MenuItem value={"Other"}>Other</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Date of birth"
              type="date"
              rows={1}
              color="secondary"
              required
              value={dbBrandsData.dateOfBirth}
              onChange={(e) => setDbBrandsData({
                ...dbBrandsData,
                dateOfBirth: e.target.value
              })}
            />
            <TextField
              label="Age"
              type="number"
              rows={1}
              color="secondary"
              required
              value={dbBrandsData.age}
              onChange={(e) => setDbBrandsData({
                ...dbBrandsData,
                age: e.target.value
              })}
            />
            <TextField
              label="User email"
              type="text"
              rows={1}
              color="secondary"
              required
              value={dbBrandsData.email}
              onChange={(e) => setDbBrandsData({
                ...dbBrandsData,
                email: e.target.value
              })}
            />

            <Box sx={{ maxWidth: "100%", m: 2 }}>

              <FormControl fullWidth >
                <InputLabel id="demo-simple-select-label" sx={{ height: "2.8rem" }} required>Blind mode</InputLabel>
                <Select
                  sx={{ height: "2.8rem" }}
                  value={dbBrandsData.isBlindMode}
                  label="Blind mode"
                  onChange={(e) => setBrandsModal({
                    ...dbBrandsData,
                    isBlindMode: e.target.value
                  })}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Box>


            <Box sx={{ maxWidth: "100%", m: 2 }}>
              <FormControl fullWidth sx={{ mt: 2 }} >
                <InputLabel htmlFor="outlined-adornment-amount" >Profile image</InputLabel>
                <OutlinedInput
                  sx={{ height: "2.8rem" }}
                  id="outlined-adornment-amount"
                  startAdornment={<><InputAdornment position="start">
                    <input multiple type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </InputAdornment>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress
                        variant="determinate"
                        size={25}
                        sx={{
                          color: green[500],
                        }}
                        value={imageProgress} />
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
                    </Box></>}
                  label="Profile image"
                />
              </FormControl>
            </Box>
            {error === '' ? null :
              <MDBox mb={2} p={1}>
                <TextField
                  error
                  id="standard-error"
                  label="Error"
                  InputProps={{
                    readOnly: true,
                    sx: {
                      "& input": {
                        color: "red",
                      }
                    }
                  }}
                  // defaultValue="Invalid Data!"
                  value={error}
                  variant="standard"
                />
              </MDBox>}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          {loading ?
            <CircularProgress
              size={30}
              sx={{
                color: green[500],
              }}
            /> : <MDButton variant="contained" color="info" type="submit"
              onClick={onUpdateBrand}
            >Update</MDButton>
          }
        </DialogActions>
      </BootstrapDialog>

      <MDBox component="li" display="flex" alignItems="center" py={1} mb={1}>
        <MDBox
          component="img"
          src={data?.imageUrls?.length ? data?.imageUrls[0] : "https://t3.ftcdn.net/jpg/05/47/85/88/360_F_547858830_cnWFvIG7SYsC2GLRDoojuZToysoUna4Y.jpg"}
          alt={name}
          width="2.5rem"
          height="2.5rem"
          borderRadius="md"
          mr={2}
        />
        <MDBox display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center">
          <MDTypography variant="button" fontWeight="medium">
            {name}
          </MDTypography>
          <MDTypography variant="caption" color="text">
            {email}
          </MDTypography>
        </MDBox>
        <MDBox ml="auto">
          <MDButton variant="text" color="info" onClick={brandsModalOpen}>
            Edit
          </MDButton>
          <MDButton variant="text" color="error" onClick={deleteAlertOpen}>
            Delete
          </MDButton>
        </MDBox>
      </MDBox>

      <MDBox display="flex" flexDirection="column">
        <MDTypography variant="button" mt={3} fontWeight="medium">
          Additional info:
        </MDTypography>
        <br />
        <MDBox display="flex">
          <MDTypography variant="button" fontWeight="medium" >
            Date of Birth:&nbsp;
          </MDTypography>
          <MDTypography variant="button"  >
            {data?.dateOfBirth}
          </MDTypography>
        </MDBox>

        <MDBox display="flex" mt={1}>
          <MDTypography variant="button" fontWeight="medium" >
            Gender:&nbsp;
          </MDTypography>
          <MDTypography variant="button"  >
            {data?.gender}
          </MDTypography>
        </MDBox>



        <MDBox display="flex" mt={1}>
          <MDTypography variant="button" fontWeight="medium" >
            Address:&nbsp;
          </MDTypography>
          <MDTypography variant="button"  >
            {/* {data?.address} */}
          </MDTypography>
        </MDBox>

        <MDBox display="flex" mt={1}>
          <MDTypography variant="button" fontWeight="medium" >
            Latitude:&nbsp;
          </MDTypography>
          <MDTypography variant="button"  >
            {data?.latitude}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" mt={1}>
          <MDTypography variant="button" fontWeight="medium" >
            Longitude:&nbsp;
          </MDTypography>
          <MDTypography variant="button"  >
            {data?.longitude}
          </MDTypography>
        </MDBox>

        <MDBox display="flex" mt={1}>
          <MDTypography variant="button" fontWeight="medium" >
            Age:&nbsp;
          </MDTypography>
          <MDTypography variant="button"  >
            {data?.age}
          </MDTypography>
        </MDBox>

      </MDBox>


    </>
  );
}

Bill.defaultProps = {
  noGutter: false,
  logo: '',
  likedUserIds: [],
};

Bill.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  logo: PropTypes.string,
  noGutter: PropTypes.bool,
  dataId: PropTypes.string.isRequired,
  likedUserIds: PropTypes.arrayOf(PropTypes.string),
  currentUserId: PropTypes.string.isRequired, // Added prop for current user ID
};

export default Bill;
