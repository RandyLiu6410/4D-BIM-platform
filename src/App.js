import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import { Navigate } from 'react-router-dom';

import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import ProjectListView from 'src/views/project/ProjectListView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import ProductListView from 'src/views/product/ProductListView';
import RegisterView from 'src/views/auth/RegisterView';
import SettingsView from 'src/views/settings/SettingsView';

// services
import AuthService from './services/AuthService';
import { result } from 'lodash';

const App = () => {
  // const [token, setToken] = useState(null)
  // const [userInfo, setUserInfo] = useState(null);

  // console.log(router);

  // useEffect(() => {
  //   AuthService.signInWithCustomToken()
  //   .then((success) => {
  //     console.log(success)

  //     setToken(success.token);
  //     setUserInfo({
  //       name: success.user.displayName,
  //       email: success.user.email,
  //       emailVerified: success.user.emailVerified,
  //       phoneNumber: success.user.phoneNumber,
  //       photoURL: success.user.photoURL,
  //       refreshToken: success.user.refreshToken,
  //       uid: success.user.uid
  //     })
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   })
  // }, [token])

  const routing = useRoutes([
    {
      path: 'app',
      element: <DashboardLayout />,
      children: [
        { path: 'account', element: <AccountView /> },
        { path: 'projects', element: <ProjectListView /> },
        { path: 'dashboard/:projectId', element: <DashboardView /> },
        { path: 'products', element: <ProductListView /> },
        { path: 'settings', element: <SettingsView /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: 'login', element: <LoginView /> },
        { path: 'register', element: <RegisterView /> },
        { path: '404', element: <NotFoundView /> },
        { path: '/', element: <Navigate to="/app/projects" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    }
  ]);

  const guestrouting = useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: 'login', element: <LoginView /> },
        { path: 'register', element: <RegisterView /> },
        { path: '404', element: <NotFoundView /> },
        { path: '/', element: <Navigate to="/login" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    }
  ]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {AuthService.verifyToken() ? routing : guestrouting}
    </ThemeProvider>
  );
};

export default App;
