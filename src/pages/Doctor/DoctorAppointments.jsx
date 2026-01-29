// doctor/src/pages/Doctor/DoctorAppointments.jsx
import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>My Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        
        {/* Table Header */}
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b font-semibold'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full' src={item.userData.image} alt="" />
              <p>{item.userData.name}</p>
            </div>
            <div>
              <p className={`text-xs inline border px-2 rounded-full ${item.payment ? 'border-green-500 text-green-500' : 'border-red-400 text-red-400'}`}>
                {item.payment ? 'Online' : 'Cash'}
              </p>
            </div>
            <p className='max-sm:hidden'>{new Date().getFullYear() - item.userData.dob.split('-')[0]}</p>
            <p>{item.slotDate}, {item.slotTime}</p>
            <p>${item.amount}</p>

            {item.cancelled 
              ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              : item.isCompleted 
                ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                : <div className='flex items-center gap-2'>
                    <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="Complete" />
                  </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;