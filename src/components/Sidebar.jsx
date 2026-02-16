import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  // Refined Active/Inactive Styling
  const navLinkClass = ({ isActive }) => 
    `flex items-center gap-4 py-4 px-6 md:px-10 md:min-w-64 cursor-pointer transition-all duration-300 group ${
      isActive 
      ? 'bg-blue-50/80 border-r-4 border-blue-600 text-blue-600 shadow-[inset_-10px_0_20px_-15px_rgba(37,99,235,0.2)]' 
      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`

  return (
    <div className='min-h-screen bg-white border-r border-slate-100 pt-5 font-sans'>
      
      {/* --- ADMIN SIDEBAR --- */}
      {aToken && (
        <ul className='mt-4 flex flex-col'>
          <NavLink className={navLinkClass} to='/admin-dashboard' style={{textDecoration:"none"}}>
            <img className='w-5 group-hover:scale-110 transition-transform duration-300' src={assets.home_icon} alt="" />
            <p className='hidden md:block text-[11px] font-bold uppercase tracking-[0.15em]'>Dashboard</p>
          </NavLink>

          <NavLink className={navLinkClass} to='/all-appointments' style={{textDecoration:"none"}}>
            <img className='w-5 group-hover:scale-110 transition-transform duration-300' src={assets.appointment_icon} alt="" />
            <p className='hidden md:block text-[11px] font-bold uppercase tracking-[0.15em]'>Appointments</p>
          </NavLink>

          <NavLink className={navLinkClass} to='/add-doctor' style={{textDecoration:"none"}}>
            <img className='w-5 group-hover:scale-110 transition-transform duration-300' src={assets.add_icon} alt="" />
            <p className='hidden md:block text-[11px] font-bold uppercase tracking-[0.15em]'>Add Doctor</p>
          </NavLink>

          <NavLink className={navLinkClass} to='/doctor-list' style={{textDecoration:"none"}}>
            <img className='w-5 group-hover:scale-110 transition-transform duration-300' src={assets.people_icon} alt="" />
            <p className='hidden md:block text-[11px] font-bold uppercase tracking-[0.15em]'>Doctors List</p>
          </NavLink>
        </ul>
      )}

      {/* --- DOCTOR SIDEBAR --- */}
      {dToken && (
        <ul className='mt-4 flex flex-col'>
          <NavLink className={navLinkClass} to='/doctor-dashboard' style={{textDecoration:"none"}}>
            <img className='w-5 group-hover:scale-110 transition-transform duration-300' src={assets.home_icon} alt="" />
            <p className='hidden md:block text-[11px] font-bold uppercase tracking-[0.15em]'>Dashboard</p>
          </NavLink>

          <NavLink className={navLinkClass} to='/doctor-appointments' style={{textDecoration:"none"}}>
            <img className='w-5 group-hover:scale-110 transition-transform duration-300' src={assets.appointment_icon} alt="" />
            <p className='hidden md:block text-[11px] font-bold uppercase tracking-[0.15em]'>Appointments</p>
          </NavLink>

          <NavLink className={navLinkClass} to='/doctor-profile' style={{textDecoration:"none"}}>
            <img className='w-5 group-hover:scale-110 transition-transform duration-300' src={assets.people_icon} alt="" />
            <p className='hidden md:block text-[11px] font-bold uppercase tracking-[0.15em]'>Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  )
}

export default Sidebar