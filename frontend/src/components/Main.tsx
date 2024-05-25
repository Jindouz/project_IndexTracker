import React from 'react'
import { Outlet } from 'react-router-dom'
import RightSideNav from './LeftSideNav'
import LeftSideNav from './RightSideNav'
// import Footer from './Footer'
import './Main.css'

const Main = () => {
  return (
    <div className="main-container dark-mode">
      <div className="right-side">
        <RightSideNav />
      </div>
      <div className="main-content">
        <Outlet />
      </div>
      <div className="left-side">
        <LeftSideNav />
    </div>
    {/* <div className="col-sm-12"><Footer /> </div> */}
  </div>
  )
}

export default Main