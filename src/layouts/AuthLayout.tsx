import React from 'react'
import MainBackground from '../components/shared/MainBackground'
import { Outlet } from 'react-router-dom'

const AuthLayout: React.FC = () => {
  return (
    <MainBackground>
        <Outlet />
    </MainBackground>
  )
}

export default AuthLayout