import React, { useContext } from 'react'
import { UserContext } from '../App';
import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const [user,setUser]=useContext(UserContext);
  return (
    user ? <Outlet/> : <Navigate to={"/"}/>
  )
}

export default ProtectedRoute