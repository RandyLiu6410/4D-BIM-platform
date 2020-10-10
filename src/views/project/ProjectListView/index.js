import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import data from './data';
var Axios = require('axios');

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ProjectListView = () => {
  const classes = useStyles();
  const [projects] = useState(data);

  return (
    <Page
      className={classes.root}
      title="Projects"
    >
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
          <Results projects={projects} />
        </Box>
      </Container>
    </Page>
  );
};

export default ProjectListView;
