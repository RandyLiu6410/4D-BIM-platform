import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import Page from 'src/components/Page';
import Budget from './Budget';
import LatestOrders from './LatestOrders';
import LatestProducts from './LatestProducts';
import Sales from './Sales';
import TasksProgress from './TasksProgress';
import TotalCustomers from './TotalCustomers';
import TotalProfit from './TotalProfit';
import TrafficByDevice from './TrafficByDevice';
import ModelViewer from '../../modelviewer/index';
import CookieService from '../../../services/CookieService';

const axios = require('axios');

const fetchData = (projectId) => {
  return new Promise(async (resolve, reject) => {
    const modelInfos = await axios.get('http://' + process.env.REACT_APP_Database_API_URL + '/projectmodel', {
      params: {
          projectId: projectId
      }
    })
    resolve(modelInfos);
  })
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  }
}));

const Dashboard = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [model, setModel] = useState(null);
  const [modelInfos, setModelInfos] = useState([]);

  useEffect(() => {
    fetchData(props.projectId).then((infos) => {
      if(infos.data.length > 0)
      {
        setModelInfos(infos.data);
        setModel(infos.data[0]);
      }
    })
  }, [modelInfos.length])

  const handleChange = (event) => {
    setModel(modelInfos.find(model => model.id == event.target.value));
  };

  return(
    <Page
      className={classes.root}
      title="Dashboard"
    >
      {
        model ? 
        <Container maxWidth={false}>
          <FormControl className={classes.formControl}>
            <InputLabel id="model-select-label">Model</InputLabel>
            <Select
              labelId="model-select-label"
              id="model-select"
              value={model.id}
              onChange={handleChange}
            >
              {
                modelInfos.map((_model, index) => {
                  return <MenuItem value={_model.id}>{_model.name}</MenuItem>
                })
              }
            </Select>
          </FormControl>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <ModelViewer model={model}/>
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <img style={{width:"80vw"}} src="/static/images/demo/ganttchart.png"></img>
          </Grid>
          {/* <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <Budget />
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <TotalCustomers />
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <TasksProgress />
            </Grid>
            <Grid
              item
              lg={3}
              sm={6}
              xl={3}
              xs={12}
            >
              <TotalProfit />
            </Grid>
            <Grid
              item
              lg={8}
              md={12}
              xl={9}
              xs={12}
            >
              <Sales />
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
            >
              <TrafficByDevice />
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
            >
              <LatestProducts />
            </Grid>
            <Grid
              item
              lg={8}
              md={12}
              xl={9}
              xs={12}
            >
              <LatestOrders />
            </Grid>
          </Grid> */}
        </Container>
        :
        <div />
      }
    </Page>
  )
};

export default Dashboard;
