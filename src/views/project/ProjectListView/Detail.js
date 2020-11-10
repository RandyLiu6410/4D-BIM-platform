import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';
import databaseAPI from '../../../utils/databaseAPI';
import forgeAPI from '../../../utils/forgeAPI';

const fetchData = (projectId) => {
    return new Promise(async (resolve, reject) => {
      databaseAPI.get('/projectmodel', {
        params: {
            projectId: projectId
        }
      })
      .then((modelInfos) => {
        resolve(modelInfos);
      })
      .catch((err) => {
          reject(err);
      })
    })
  }

const useStyles = makeStyles((theme) => ({
    root: {},
}));

const Detail = ({project, ...rest}) => {
    const [modelInfos, setModelInfos] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
      fetchData(project.id).then((infos) => {
        setModelInfos(infos.data);
      })
    }, [modelInfos.length])

    function onUploadHandler(event) {
      console.log(event.target.files[0])
      const filename = event.target.files[0].name.split('.')[0];
      const format = '.' + event.target.files[0].name.split('.')[1];

      var formData = new FormData();
      formData.append("fileToUpload", event.target.files[0])
  
      setUploading(true);
      forgeAPI.post('/api/forge/oauth', null, {
        params: {
            FORGE_CLIENT_ID: process.env.REACT_APP_FORGE_CLIENT_ID,
            FORGE_CLIENT_SECRET: process.env.REACT_APP_FORGE_CLIENT_SECRET
        }
      })
      .then(function () {
        forgeAPI.post('/api/forge/datamanagement/bucket/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(function (responce) {
            console.log(responce);

            databaseAPI.post('/projectmodel', null, {
                params: {
                  projectId: project.id,
                  name: filename,
                  format: format,
                  urn: responce.data.urn,
                  creator: JSON.parse(window.localStorage.getItem('userInfo')).displayName,
                }
            })
            .then(function (res) {
                console.log(res)
                if(res.status){
                    var _modelInfos = modelInfos;
                    _modelInfos.push(res.data.details.message);
                    setModelInfos(_modelInfos);

                    setUploading(false);
                }
            })
            .catch(function (error) {
                setUploading(false);
                console.log(error);
            })
        })
        .catch(function (error) {
            setUploading(false);
          console.log(error);
        });
      })
      .catch(function (error) {
        setUploading(false);
        console.log(error);
      });
    }

    return(
        <DialogContent>
            <PerfectScrollbar>
                <Box >
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell>
                                Name
                            </TableCell>
                            <TableCell>
                                Format
                            </TableCell>
                            <TableCell>
                                Creator
                            </TableCell>
                            <TableCell>
                                Schedule
                            </TableCell>
                            <TableCell />
                            <TableCell />
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {modelInfos.map((model) => (
                            <TableRow
                            hover
                            key={model.id}
                            >
                            <TableCell>
                                <Box
                                alignItems="center"
                                display="flex"
                                >
                                    <Typography
                                        color="textPrimary"
                                        variant="body1"
                                    >
                                        {model.name}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    color="textPrimary"
                                    variant="body1"
                                >
                                    {model.format}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    color="textPrimary"
                                    variant="body1"
                                >
                                    {model.creator}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    color="textPrimary"
                                    variant="body1"
                                >
                                    {model.schedule}
                                </Typography>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>

                    <label htmlFor="upload-model">
                        <input
                            style={{ display: "none" }}
                            id="upload-model"
                            name="fileToUpload"
                            type="file"
                            accept=".rvt"
                            onChange={onUploadHandler}
                            disabled={uploading}
                        />
                        <Button color="primary" variant="contained" component="span" disabled={uploading}>
                            Upload Model
                        </Button>{" "}
                    </label>
                </Box>
            </PerfectScrollbar>
        </DialogContent>
    )
}

Detail.propTypes = {
    project: PropTypes.object.isRequired
};

export default Detail;