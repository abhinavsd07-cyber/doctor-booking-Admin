import React, { useContext } from 'react'
import { AdminContext } from '../Context/AdminContext'
import { DoctorContext } from '../Context/DoctorContext' // 1. Import DoctorContext
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext) // 2. Get dToken

  // Professional active/inactive styling
  const navLinkClass = ({ isActive }) => 
    `flex items-center gap-4 py-4 px-6 md:px-10 md:min-w-64 cursor-pointer transition-all duration-300 group ${
      isActive 
      ? 'bg-blue-50 border-r-4 border-primary text-primary font-semibold' 
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`

  return (
    <div className='min-h-screen bg-white border-r border-gray-100 pt-5'>
      
      {/* ADMIN SIDEBAR LINKS */}
      {aToken && (
        <ul className='mt-6 flex flex-col'>
          <NavLink className={navLinkClass} to='/admin-dashboard' style={{textDecoration:"none"}}>
            <img className='w-5 group-hover:scale-110 transition-transform' src={assets.home_icon} alt="" />
            <p className='hidden md:block tracking-wide text-black'>Dashboard</p>
          </NavLink>

          <NavLink className={navLinkClass} to='/all-appointments' style={{textDecoration:"none"}}>
            <img className='w-5 group-hover:scale-110 transition-transform' src={assets.appointment_icon} alt="" />
            <p className='hidden md:block tracking-wide text-black'>Appointments</p>
          </NavLink>

          <NavLink className={navLinkClass} to='/add-doctor' style={{textDecoration:"none"}}>
            <img className='w-5 group-hover:scale-110 transition-transform' src={assets.add_icon} alt="" />
            <p className='hidden md:block tracking-wide text-black'>Add Doctor</p>
          </NavLink>

          <NavLink className={navLinkClass} to='/doctor-list' style={{textDecoration:"none"}}>
            <img className='w-5 group-hover:scale-110 transition-transform' src={assets.people_icon} alt="" />
            <p className='hidden md:block tracking-wide text-black'>Doctors List</p>
          </NavLink>
        </ul>
      )}

      {/* DOCTOR SIDEBAR LINKS */}
      {dToken && (
        <ul className='mt-6 flex flex-col'>
          <NavLink className={navLinkClass} to='/doctor-dashboard' style={{textDecoration:"none"}}>
            <img className='w-5 group-hover:scale-110 transition-transform' src={assets.home_icon} alt="" />
            <p className='hidden md:block tracking-wide text-black'>Dashboard</p>
          </NavLink>

          <NavLink className={navLinkClass} to='/doctor-appointments' style={{textDecoration:"none"}}>
            <img className='w-5 group-hover:scale-110 transition-transform' src={assets.appointment_icon} alt="" />
            <p className='hidden md:block tracking-wide text-black'>Appointments</p>
          </NavLink>

          <NavLink className={navLinkClass} to='/doctor-profile' style={{textDecoration:"none"}}>
            <img className='w-5 group-hover:scale-110 transition-transform' src={assets.people_icon} alt="" />
            <p className='hidden md:block tracking-wide text-black'>Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  )
}

export default Sidebar