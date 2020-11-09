import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import ProjectListView from 'src/views/project/ProjectListView/ProjectList';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import ProductListView from 'src/views/product/ProductListView';
import RegisterView from 'src/views/auth/RegisterView';
import SettingsView from 'src/views/settings/SettingsView';

require("firebase/auth");
require("firebase/firestore");

var firebase = require("firebase/app");

if(!firebase.apps.length)
{
  firebase.initializeApp({
    apiKey: process.env.REACT_APP_firebaseconfig_apiKey,
    authDomain: process.env.REACT_APP_firebaseconfig_authDomain,
    databaseURL: process.env.REACT_APP_firebaseconfig_databaseURL,
    projectId: process.env.REACT_APP_firebaseconfig_projectId,
    storageBucket: process.env.REACT_APP_firebaseconfig_storageBucket,
    messagingSenderId: process.env.REACT_APP_firebaseconfig_messagingSenderId,
    appId: process.env.REACT_APP_firebaseconfig_appId,
    measurementId: process.env.REACT_APP_firebaseconfig_measurementId
  });
}

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <AccountView /> },
      { path: 'projects', element: <ProjectListView /> },
      { path: 'dashboard', element: <DashboardView firebase={firebase}/> },
      { path: 'products', element: <ProductListView /> },
      { path: 'settings', element: <SettingsView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView firebase={firebase}/> },
      { path: 'register', element: <RegisterView firebase={firebase}/> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/login" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
