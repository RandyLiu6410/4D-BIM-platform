import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import FacebookIcon from 'src/icons/Facebook';
import GoogleIcon from 'src/icons/Google';
import Page from 'src/components/Page';
import { any } from 'prop-types';
import CookieService from '../../services/CookieService.js';
import AuthService from '../../services/AuthService.js';
import Firebase from '../../Firebase';
import { useCookies } from 'react-cookie';
import databaseAPI from '../../utils/databaseAPI';

const cookieService = new CookieService();

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  failed: {
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold'
  }
}));

const LoginView = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [loginSuccess, setLoginSuccess] = useState()
  const [failedMessage, setFailedMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cookies, setCookie] = useCookies(['access_token']);

  AuthService.signInWithCustomToken()
  .then((success) => {
    console.log(success)

    navigate('/app/dashboard', { replace: true });
  })
  .catch((error) => {
    console.log(error);
  })

  function handleSubmitWithGoogle() {
    var provider = new Firebase.auth.GoogleAuthProvider();

    Firebase.auth().signInWithPopup(provider).then(async (result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
      console.log(user.displayName)

      const query = await Firebase.firestore().collection('users').where('email', '==', user.email)
      .get()
      .then(async (querySnapshot) => {
          console.log(querySnapshot)
          if(querySnapshot.size === 0)
          {
            await Firebase.firestore().collection('users').doc(user.uid).set({
              id: result.user.uid,
              name: {
                  firstName: user.displayName,
                  lastName: ''
              },
              email: user.email,
              projects: []
            });
          }
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });

      if(result.credential.accessToken)
      {
        databaseAPI.get('/getUserToken', {
          params: {
            uid: result.user.uid
          }
        })
        .then(function (responce) {
          window.localStorage.setItem('userInfo', JSON.stringify({
            displayName: result.user.displayName,
            email: result.user.email,
            emailVerified: result.user.emailVerified,
            phoneNumber: result.user.phoneNumber,
            photoURL: result.user.photoURL,
            refreshToken: result.user.refreshToken,
            uid: result.user.uid
          }));
          cookieService.set('access_token', responce.data.data, { path: '/' });

          navigate('/', { replace: true });
        })
        .catch(function (error) {
          console.log(error);
        });
      }

    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...

      setFailedMessage(errorMessage);
    });
  }

  return (
    <Page
      className={classes.root}
      title="Login"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={async (values) => {
              setIsSubmitting(true);

              await Firebase.auth().signInWithEmailAndPassword(values.email, values.password)
              .then((result) => {
                  setLoginSuccess(true)

                  databaseAPI.get('/getUserToken', {
                    params: {
                      uid: result.user.uid
                    }
                  })
                  .then(function (responce) {
                    window.localStorage.setItem('userInfo', JSON.stringify({
                      displayName: result.user.displayName,
                      email: result.user.email,
                      emailVerified: result.user.emailVerified,
                      phoneNumber: result.user.phoneNumber,
                      photoURL: result.user.photoURL,
                      refreshToken: result.user.refreshToken,
                      uid: result.user.uid
                    }));
                    cookieService.set('access_token', responce.data.data, { path: '/' });
                    navigate('/', { replace: true });
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              })
              .catch(function(error) {
                  console.log(error)
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  // ...
                  setLoginSuccess(false)
                  setIsSubmitting(false);
                  setFailedMessage(errorMessage);
              });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Sign in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Sign in on the internal platform
                  </Typography>
                </Box>
                <Grid
                  container
                  spacing={3}
                >
                  {/* <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <Button
                      color="primary"
                      fullWidth
                      startIcon={<FacebookIcon />}
                      onClick={handleSubmit}
                      size="large"
                      variant="contained"
                    >
                      Login with Facebook
                    </Button>
                  </Grid> */}
                  <Grid
                    item
                    xs={12}
                    md={12}
                  >
                    <Button
                      fullWidth
                      startIcon={<GoogleIcon />}
                      onClick={handleSubmitWithGoogle}
                      size="large"
                      variant="contained"
                    >
                      Login with Google
                    </Button>
                  </Grid>
                </Grid>
                <Box
                  mt={3}
                  mb={1}
                >
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="body1"
                  >
                    or login with email address
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <div className={classes.failed}>{failedMessage}</div>
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Don&apos;t have an account?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="h6"
                  >
                    Sign up
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
