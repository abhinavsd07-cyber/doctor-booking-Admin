import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);

  // Helper to format the slot date (e.g., 20_02_2026 to 20 Feb 2026)
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  return (
    <div className='m-5 w-full max-w-6xl'>
      <div className='mb-5'>
        <h1 className='text-2xl font-bold text-slate-900'>
          Appointment <span className='text-blue-600'>Scheduler</span>
        </h1>
        <p className='text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1'>
          Full history and upcoming patient sessions
        </p>
      </div>

      <div className='bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden'>
        {/* Table Header */}
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-4 px-6 border-b bg-slate-50 font-bold text-slate-500 text-xs uppercase'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* List Items */}
        {appointments.slice().reverse().map((item, index) => (
          <div 
            key={index}
            className='flex flex-wrap justify-between sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] items-center gap-1 py-4 px-6 border-b hover:bg-slate-50 transition-all'
          >
            <p className='max-sm:hidden text-slate-500'>{index + 1}</p>
            
            <div className='flex items-center gap-2'>
              <img className='w-8 h-8 rounded-full object-cover' src={item.userData.image} alt="" />
              <p className='font-medium text-slate-800'>{item.userData.name}</p>
            </div>

            <div>
              <p className={`text-[10px] inline-block px-2 py-0.5 rounded-full border ${item.payment ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                {item.payment ? 'ONLINE' : 'CASH'}
              </p>
            </div>

            <p className='max-sm:hidden text-slate-600'>
               {item.userData.dob ? (new Date().getFullYear() - item.userData.dob.split('-')[0]) : '—'}
            </p>

            <div className='text-xs'>
              <p className='font-semibold text-slate-800'>{slotDateFormat(item.slotDate)}</p>
              <p className='text-blue-500 font-bold'>{item.slotTime}</p>
            </div>

            <p className='font-bold text-slate-900'>${item.amount}</p>

            {/* ACTION BUTTONS: FIXED VISIBILITY */}
            <div className='flex items-center gap-2'>
              {item.cancelled ? (
                <p className='text-red-400 text-xs font-bold uppercase'>Cancelled</p>
              ) : item.isCompleted ? (
                <p className='text-green-500 text-xs font-bold uppercase'>Completed</p>
              ) : (
                <div className='flex gap-2'>
                  {/* Tick/Complete Button */}
                  <img 
                    onClick={() => completeAppointment(item._id)} 
                    className='w-8 h-8 cursor-pointer hover:scale-110 transition-all p-1.5 bg-green-50 rounded-full border border-green-100' 
                    src={assets.tick_icon} 
                    alt="Complete" 
                  />
                  {/* Cross/Cancel Button */}
                  <img 
                    onClick={() => cancelAppointment(item._id)} 
                    className='w-8 h-8 cursor-pointer hover:scale-110 transition-all p-1.5 bg-red-50 rounded-full border border-red-100' 
                    src={assets.cancel_icon} 
                    alt="Cancel" 
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;