import React, { useState } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Profile from './Profile';
import ProfileDetails from './ProfileDetails';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/AuthService';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Account = () => {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState(JSON.parse(window.localStorage.getItem('userInfo')));
  const navigate = useNavigate();
  if(!AuthService.verifyToken())
  {
    navigate('/login');
  }

  return (
    <Page
      className={classes.root}
      title="Account"
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={4}
            md={6}
            xs={12}
          >
            <Profile userInfo={userInfo}/>
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <ProfileDetails userInfo={userInfo}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Account;
