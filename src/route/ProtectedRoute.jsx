import React from 'react'
import { Navigate, useLocation} from 'react-router-dom'

const ProtectedRoute = ({children}) => {
    
    const token =localStorage.getItem("crmToken")
    const location= useLocation()
    if(!token){
      return <Navigate to="/authentication/login" state={{ from: location }} replace={true} />;   
    }
  return children
}

export default ProtectedRoute