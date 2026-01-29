import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../Context/AdminContext'
import { DoctorContext } from '../Context/DoctorContext' // 1. Import DoctorContext
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext) // 2. Consume Doctor state
  const navigate = useNavigate()

  /**
   * Handles session termination for both Admin and Doctor.
   */
  const logout = () => {
    navigate('/') 
    if (aToken) {
      setAToken('')
      localStorage.removeItem('aToken')
    }
    if (dToken) {
      setDToken('')
      localStorage.removeItem('dToken')
    }
  }

  return (
    <nav className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img 
          className='w-36 sm:w-40 cursor-pointer' 
          src={assets.admin_logo} 
          alt="Branding Logo" 
        />
        {/* Dynamic Role Badge */}
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 font-medium'>
          {aToken ? 'Admin Dashboard' : 'Doctor Dashboard'}
        </p>
      </div>

      <button 
        onClick={logout}
        className='bg-primary text-white text-sm px-10 py-2 rounded-full hover:bg-opacity-90 transition-all'
      >
        Logout
      </button>
    </nav>
  )
}

export default Navbar