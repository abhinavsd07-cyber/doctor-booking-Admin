import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)
  const navigate = useNavigate()

  const logout = () => {
    // Clear everything and send to home/login
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    navigate('/')
  }

  return (
    /* ADJUSTED: Added sticky positioning and backdrop blur for that premium feel */
    <nav className='sticky top-0 z-[100] flex justify-between items-center px-6 md:px-12 py-4 border-b border-slate-100 bg-white/90 backdrop-blur-md'>
      
      <div className='flex items-center gap-4'>
        <img 
          onClick={() => navigate('/')}
          className='w-32 md:w-40 cursor-pointer hover:opacity-80 transition-opacity' 
          src={assets.admin_logo} 
          alt="Logo" 
        />
        
        {/* Dynamic Role Badge: Matches the 'Pill' style from your Frontend Nav */}
        <p className='hidden sm:block border border-slate-200 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 bg-slate-50'>
          {aToken ? 'Admin' : 'Doctor'} <span className='text-blue-600 ml-1'>Portal</span>
        </p>
      </div>

      <button 
        onClick={logout}
        className='bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest px-8 py-3 rounded-full hover:bg-rose-500 transition-all duration-300 active:scale-95 shadow-lg shadow-slate-200'
      >
        Logout
      </button>
    </nav>
  )
}

export default Navbar