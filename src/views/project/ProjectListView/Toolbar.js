import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Fab,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
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

const Toolbar = ({ className, ...rest }) => {
  const classes = useStyles();

  function onUploadHandler(event) {
    console.log(event.target.files[0])
    var formData = new FormData();
    formData.append("fileToUpload", event.target.files[0])

    axios.post('http://' + process.env.REACT_APP_Forge_API_URL + '/api/forge/oauth', {
      FORGE_CLIENT_ID: process.env.REACT_APP_FORGE_CLIENT_ID,
      FORGE_CLIENT_SECRET: process.env.REACT_APP_FORGE_CLIENT_SECRET
    })
    .then(function (response) {
      console.log(response);

      axios.post('http://' + process.env.REACT_APP_Forge_API_URL + '/api/forge/datamanagement/bucket/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
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
        <Button className={classes.importButton}>
          Import
        </Button>
        <Button className={classes.exportButton}>
          Export
        </Button>
        <label htmlFor="upload-model">
          <input
            style={{ display: "none" }}
            id="upload-model"
            name="fileToUpload"
            type="file"
            accept=".rvt"
            onChange={onUploadHandler}
          />
          <Button color="primary" variant="contained" component="span">
            Upload Model
          </Button>{" "}
        </label>
      </Box>
      <Box mt={3}>
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
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
