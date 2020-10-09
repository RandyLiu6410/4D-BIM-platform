import React from 'react';
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

const Dashboard = () => {
  const [project, setProject] = React.useState('');

  const classes = useStyles();

  const handleChange = (event) => {
    setProject(event.target.value);
  };

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={true}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Project</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={project}
              onChange={handleChange}
            >
              <MenuItem value={'CERB'}>CERB</MenuItem>
              <MenuItem value={'Taipei 101'}>Taipei 101</MenuItem>
              <MenuItem value={'NCREE'}>NCREE</MenuItem>
              <MenuItem value={'NTU Dorm'}>NTU Dorm</MenuItem>
            </Select>
          </FormControl>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <img style={{width:"80vw"}} src="/static/images/demo/forge.png"></img>
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
    
    </Page>
  );
};

export default Dashboard;
