import React, { useState } from 'react';
import Dashboard from './Dashboard';
import { useNavigate, useParams } from 'react-router-dom';
import AuthService from '../../../services/AuthService';

const DashboardView = (props) => {
  const navigate = useNavigate();
  let { projectId } = useParams();

  if(!AuthService.verifyToken())
  {
    navigate('/login');
  }

  return(
    <Dashboard userInfo={JSON.parse(window.localStorage.getItem('userInfo'))} projectId={projectId}/>
  )
};

export default DashboardView;
