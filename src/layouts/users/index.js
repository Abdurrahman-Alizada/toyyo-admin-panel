// layouts/users/index.js
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
  MenuItem
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
import Data from "layouts/users/components/TableData";

// Firestore
import { auth, db, storage } from "../../firebase"
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
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

function UsersIndex() {
  const { columns, rows } = Data();
  const [usersModal, setUsersModal] = useState(false);
  const [usersNotification, setUsersNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageProgress, setImageProgress] = useState(0);
  const [imageProgressValue, setImageProgressValue] = useState(0);
  const [usersData, setUsersData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    uid: '',
    phoneNumber: "",
    address: "",
    gender: "",
    dateOfBirth: "",
    profileImageUrl: "",
    age: "",
  });
  const [file, setFile] = useState('');

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Upload Image Effect
  useEffect(() => {
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
            setUsersData((prev) => ({
              ...prev,
              profileImageUrl: downloadURL
            }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);


  const onAddUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await createUserWithEmailAndPassword(auth, usersData.email, usersData.password);
      await addDoc(collection(db, "users"), {
        name: usersData.name,
        phoneNumber: usersData.phoneNumber,
        address: usersData.address,
        gender: usersData.gender,
        dateOfBirth: usersData.dateOfBirth,
        profileImageUrl: usersData.profileImageUrl || "https://t3.ftcdn.net/jpg/05/47/85/88/360_F_547858830_cnWFvIG7SYsC2GLRDoojuZToysoUna4Y.jpg",
        age: usersData.age,
        email: usersData.email,
        password: usersData.password,
        role: usersData.role,
        uid: user.user.uid,
      });
      usersModalClose();
      usersNotificationOpen();
      setUsersData({
        name: '',
        phoneNumber: "",
        address: "",
        gender: "",
        dateOfBirth: "",
        profileImageUrl: "",
        age: "",
        email: '',
        password: '',
        role: '',
        uid: '',
      });
      setImageProgress(0);
      setImageProgressValue(0);
      setFile('');
    } catch (error) {
      setError(error.code);
      setLoading(false);
    }
  };

  const usersModalOpen = () => setUsersModal(true);
  const usersModalClose = () => {
    setUsersModal(false);
    setLoading(false);
    setError('');
    setImageProgress(0);
    setImageProgressValue(0);
    setFile('');
  };
  const usersNotificationOpen = () => setUsersNotification(true);
  const usersNotificationClose = () => setUsersNotification(false);

  // Filter rows based on search term
  const filteredRows = rows.filter(row => {
    const name = row.users.props.name.toLowerCase();
    const email = row.email.props.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || email.includes(search);
  });

  return (
    <>
      <MDSnackbar
        color="success"
        icon="check"
        title="Successfully Added"
        open={usersNotification}
        onClose={usersNotificationClose}
        close={usersNotificationClose}
      />

      {/* Add User Modal */}
      <BootstrapDialog
        onClose={usersModalClose}
        aria-labelledby="customized-dialog-title"
        open={usersModal}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={usersModalClose}>
          <Typography variant="h3" color="secondary.main" sx={{ pt: 1, textAlign: "center" }}>Add User</Typography>
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
              label="Full Name"
              type="text"
              rows={1}
              color="secondary"
              required
              value={usersData.name}
              onChange={(e) => setUsersData({
                ...usersData,
                name: e.target.value
              })}
            />
            <TextField
              label="Email"
              type="email"
              rows={1}
              color="secondary"
              required
              value={usersData.email}
              onChange={(e) => setUsersData({
                ...usersData,
                email: e.target.value
              })}
            />
            <TextField
              label="Password"
              // type="password"
              rows={1}
              color="secondary"
              required
              value={usersData.password}
              onChange={(e) => setUsersData({
                ...usersData,
                password: e.target.value
              })}
            />
            <TextField
              label="Phone number"
              type="text"
              rows={1}
              color="secondary"
              required
              value={usersData.phoneNumber}
              onChange={(e) => setUsersData({
                ...usersData,
                phoneNumber: e.target.value
              })}
            />
           

            <Box sx={{ maxWidth: "100%", m: 2 }}>

              <FormControl fullWidth >
                <InputLabel id="role-select-label" sx={{ height: "2.8rem" }} required>User role</InputLabel>
                <Select
                  sx={{ height: "2.8rem" }}
                  value={usersData.role}
                  label="User role"
                  onChange={(e) => setUsersData({
                    ...usersData,
                    role: e.target.value
                  })}
                >
                  <MenuItem value={"user"}>User</MenuItem>
                  <MenuItem value={"admin"}>Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ maxWidth: "100%", m: 2 }}>
              <FormControl fullWidth sx={{ mt: 2 }} >
                <InputLabel htmlFor="outlined-adornment-profile-image">User profile image</InputLabel>
                <OutlinedInput
                  sx={{ height: "2.8rem" }}
                  id="outlined-adornment-profile-image"
                  startAdornment={
                    <InputAdornment position="start">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </InputAdornment>
                  }
                  label="User Profile Image"
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
              onClick={onAddUser}
            >Save</MDButton>
          }
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
                        All Users
                      </MDTypography>
                      <MDButton variant="gradient" color="light"
                        onClick={usersModalOpen}
                      >
                        <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                        &nbsp;ADD User
                      </MDButton>
                    </MDBox>
                  </MDBox>

                  {/* Search Field */}
                  <MDBox px={2} pt={2}>
                    <TextField
                      // label="Search Users"
                      variant="outlined"
                      fullWidth
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Search by name or email"
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
                    {/* Render the filtered DataTable */}
                    <DataTable
                      table={{ columns, rows: filteredRows }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
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

export default UsersIndex;
