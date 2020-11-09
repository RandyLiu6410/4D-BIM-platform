import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Fab,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  InputLabel,
  SvgIcon,
  Select,
  MenuItem,
  makeStyles
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { v4 as uuid } from 'uuid';
const axios = require('axios');

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

const Toolbar = ({ className, userInfo, ...rest }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [projectInfo, setProjectInfo] = useState({
    name: '',
    country: '',
    city: '',
    street: '',
    manager: ''
  });
  const [users, setUsers] = useState([]);
  const [userItems, setUserIems] = useState(null);

  useEffect(() => {
    axios.get('http://' + process.env.REACT_APP_Database_API_URL + '/users')
    .then(res => {
      console.log(res);
      setUsers(res.data);
      const items = res.data.map(user => {
        const name = user.name.firstName + ' ' + user.name.lastName;
        return <MenuItem value={user.id}>{name}</MenuItem>
      });
      setUserIems(items);
    })
    .catch(err => {
      console.log(err);
    })
  }, [])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChange = (event) => {
    const { id, value } = event.target;
    setProjectInfo(prevState => ({
      ...prevState,
      [id]: value
    }));
  }

  const handleSelectChange = (event) => {
    setProjectInfo(prevState => ({
      ...prevState,
      manager: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://' + process.env.REACT_APP_Database_API_URL + '/project', null, {
      params: projectInfo
    })
    .then(function (response) {
      console.log(response);

      const projectId = response.data.details.projectId;

      axios.post('http://' + process.env.REACT_APP_Database_API_URL + '/adduserproject', null, {
        params: {
          uid: userInfo.uid,
          projectId: projectId
        }
      })
      .then(function (response) {
        console.log(response);

        axios.post('http://' + process.env.REACT_APP_Database_API_URL + '/adduserproject', null, {
          params: {
            uid: projectInfo.manager,
            projectId: projectId
          }
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      })
      .catch(function (error) {
        console.log(error);
      });

      setOpen(false);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        {/* <Button className={classes.importButton}>
          Import
        </Button>
        <Button className={classes.exportButton}>
          Export
        </Button> */}
        <label htmlFor="create-project">
          <Button color="primary" variant="contained" component="span" onClick={handleClickOpen}>
            Create Project
          </Button>{" "}
        </label>
      </Box>
      {/* <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Search project"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box> */}
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">Create A Project</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please ensure all information is correct.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Project Name"
              type="text"
              fullWidth
              required={true}
              onChange={onChange}
              value={projectInfo.name}
            />
            <InputLabel id="manager-select-label">Manager</InputLabel>
            <Select
              id="manager"
              value={projectInfo.manager}
              onChange={handleSelectChange}
              required={true}
              fullWidth
            >
              {userItems}
            </Select>
            <TextField
              margin="dense"
              id="country"
              label="Country"
              type="text"
              onChange={onChange}
              value={projectInfo.country}
            />
            <TextField
              margin="dense"
              id="city"
              label="City"
              type="text"
              onChange={onChange}
              value={projectInfo.city}
            />
            <TextField
              margin="dense"
              id="street"
              label="Street"
              type="text"
              onChange={onChange}
              value={projectInfo.street}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
