import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Link,
  Grid,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import GoogleIcon from 'src/icons/Google';
import Firebase from '../../Firebase';

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
  },
  redirect: {
    textAlign: 'center',
    fontWeight: 'bold'
  }
}));

const RegisterView = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [failedMessage, setFailedMessage] = useState('')
  const [redirectMessage, setRedirectMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateConfirmPassword = (pass, value) => {
    console.log(pass)
    let error = "";
    if (pass && value) {
      if (pass !== value) {
        error = "Password not matched";
      }
    }
    return error;
  };

  function handleSubmitWithGoogle() {
    var provider = new Firebase.auth.GoogleAuthProvider();

    Firebase.auth().signInWithPopup(provider).then(async (result) => {
      // The signed-in user info.
      var user = result.user;
      // ...
      console.log(user.displayName)
      if(result.credential.accessToken)
      {
        const userdocRef = await Firebase.firestore().collection('users').doc(result.user.uid).set({
          id: result.user.uid,
          name: {
              firstName: user.displayName,
              lastName: ''
          },
          email: user.email,
          projects: []
        });

        // navigate('/app/login', { replace: true });
        setFailedMessage('')
        setRedirectMessage('Redirecting...')
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000)
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
      title="Register"
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
              firstName: '',
              lastName: '',
              password: '',
              repeatPassword: '',
              policy: false
            }}
            validationSchema={
              Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                firstName: Yup.string().max(255).required('First name is required'),
                lastName: Yup.string().max(255).required('Last name is required'),
                password: Yup.string().max(255).required('password is required'),
                confirmPassword: Yup.string().max(255).required('confirmPassword is required').test('confirmPassword', 'Password not matched', function(value) {
                  return this.parent.password === value;
                }),
                policy: Yup.boolean().oneOf([true], 'This field must be checked')
              })
            }
            onSubmit={async (values) => {
              setIsSubmitting(true);

              await Firebase.auth().createUserWithEmailAndPassword(values.email, values.password)
              .then(async (result) => {// Add model doc
                const userdocRef = await Firebase.firestore().collection('users').doc(result.user.uid).set({
                    id: result.user.uid,
                    name: {
                        firstName: values.firstName,
                        lastName: values.lastName
                    },
                    email: values.email,
                    projects: []
                });

                result.user.updateProfile({
                    displayName: values.firstName + " " + values.lastName
                }).then(function(res) {
                    console.log(res)
                }, function(error) {
                    // An error happened.
                }); 

                setFailedMessage('')
                setRedirectMessage('Redirecting...')
                setTimeout(() => {
                  navigate('/login', { replace: true });
                }, 3000)
              })
              .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
                setFailedMessage(error.message)
                setIsSubmitting(false);
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
                    Create new account
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Use your email to create new account
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.firstName && errors.firstName)}
                  fullWidth
                  helperText={touched.firstName && errors.firstName}
                  label="First name"
                  margin="normal"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.lastName && errors.lastName)}
                  fullWidth
                  helperText={touched.lastName && errors.lastName}
                  label="Last name"
                  margin="normal"
                  name="lastName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  variant="outlined"
                />
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
                <TextField
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  fullWidth
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  label="Confirm Password"
                  margin="normal"
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.confirmPassword}
                  variant="outlined"
                />
                <Box
                  alignItems="center"
                  display="flex"
                  ml={-1}
                >
                  <Checkbox
                    checked={values.policy}
                    name="policy"
                    onChange={handleChange}
                  />
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    I have read the
                    {' '}
                    <Link
                      color="primary"
                      component={RouterLink}
                      to="#"
                      underline="always"
                      variant="h6"
                    >
                      Terms and Conditions
                    </Link>
                  </Typography>
                </Box>
                {Boolean(touched.policy && errors.policy) && (
                  <FormHelperText error>
                    {errors.policy}
                  </FormHelperText>
                )}
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
                    Sign up now
                  </Button>
                </Box>
                <div className={classes.redirect}>{redirectMessage}</div>
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
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Have an account?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="h6"
                  >
                    Sign in
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

export default RegisterView;
