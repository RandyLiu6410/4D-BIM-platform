import React, { useState, useEffect } from 'react';
import ProjectList from './ProjectList';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/AuthService';
import databaseAPI from '../../../utils/databaseAPI';

const fetchData = (userInfo) => {
  return new Promise(async (resolve, reject) => {
    const userprojects = await databaseAPI.get('/getuserprojects', {
      params: {
        uid: userInfo.uid
      }
    })
    const infos = await Promise.all(userprojects.data.data.map(async (id) => {
      const info = await databaseAPI.get('/getprojectinfo', {
        params: {
          projectId: id
        }
      })
      return info;
    }))
    console.log(infos)
    const _infos = await Promise.all(infos.map(async (info) => {
      var data = info.data.data;
      const userinfo = await databaseAPI.get('/getuserinfo', {
        params: {
          uid: data.manager
        }
      });
      data.managerName = userinfo.data.data.name.firstName + ' ' + userinfo.data.data.name.lastName;
      return data;
    }))
    resolve(_infos);
  })
}

const ProjectListView = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(JSON.parse(window.localStorage.getItem('userInfo')))
  const [projects, setProjects] = useState([]);

  if(!AuthService.verifyToken())
  {
    navigate('/login');
  }

  useEffect(() => {
    fetchData(userInfo).then((infos) => {
      setProjects(infos);
    })
  }, [projects.length])

  return(
    <ProjectList userInfo={userInfo} projects={projects}/>
  )
};

export default ProjectListView;