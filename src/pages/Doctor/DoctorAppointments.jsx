import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);

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
    <div className='m-6 font-sans'>
      {/* --- Section Header --- */}
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>
          Appointment <span className='text-blue-600'>Scheduler</span>
        </h1>
        <p className='text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1'>
          Full history and upcoming patient sessions
        </p>
      </div>

      {/* --- Main Table Container --- */}
      <div className='bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden'>
        <div className='max-h-[80vh] overflow-y-auto no-scrollbar'>
          
          {/* Table Header - Sticky */}
          <div className='hidden sm:grid grid-cols-[0.5fr_2.5fr_1fr_1fr_3fr_1fr_1.5fr] items-center py-5 px-8 border-b bg-slate-50/50 sticky top-0 backdrop-blur-md z-10'>
            {['#', 'Patient', 'Method', 'Age', 'Date & Time', 'Fee', 'Actions'].map((label) => (
              <p key={label} className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>{label}</p>
            ))}
          </div>

          {/* List Rendering */}
          {appointments.reverse().map((item, index) => (
            <div 
              className='flex flex-wrap justify-between sm:grid grid-cols-1 sm:grid-cols-[0.5fr_2.5fr_1fr_1fr_3fr_1fr_1.5fr] items-center py-5 px-8 border-b border-slate-50 hover:bg-slate-50/50 transition-colors group' 
              key={index}
            >
              {/* Index */}
              <p className='text-slate-400 font-bold text-xs max-sm:hidden'>{index + 1}</p>
              
              {/* Patient Info */}
              <div className='flex items-center gap-3'>
                <img className='w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover' src={item.userData.image} alt="" />
                <p className='text-slate-900 font-bold text-sm tracking-tight'>{item.userData.name}</p>
              </div>

              {/* Payment Method */}
              <div>
                <p className={`text-[9px] font-black uppercase tracking-widest inline-block px-3 py-1 rounded-full border ${item.payment ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                  {item.payment ? 'Online' : 'Cash'}
                </p>
              </div>

              {/* Age */}
              <p className='text-slate-500 font-medium text-sm max-sm:hidden'>
                {item.userData.dob ? (new Date().getFullYear() - item.userData.dob.split('-')[0]) : '—'}
              </p>

              {/* Date & Time */}
              <div>
                <p className='text-slate-900 font-bold text-xs'>{slotDateFormat(item.slotDate)}</p>
                <p className='text-blue-600 font-bold text-[10px] uppercase tracking-widest mt-0.5'>{item.slotTime}</p>
              </div>

              {/* Fee */}
              <p className='text-slate-900 font-black text-sm'>${item.amount}</p>

              {/* Actions Logic */}
              <div className='flex items-center gap-2 justify-end sm:justify-start'>
                {item.cancelled ? (
                  <span className='px-4 py-1.5 bg-rose-50 text-rose-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-rose-100'>Cancelled</span>
                ) : item.isCompleted ? (
                  <span className='px-4 py-1.5 bg-emerald-50 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100'>Completed</span>
                ) : (
                  <div className='flex gap-2'>
                     {/* Complete Button */}
                    <button 
                      onClick={() => completeAppointment(item._id)} 
                      className='p-2.5 hover:bg-emerald-50 rounded-xl transition-all group/btn'
                      title="Mark as Completed"
                    >
                      <img className='w-5 grayscale group-hover/btn:grayscale-0 opacity-40 group-hover/btn:opacity-100 transition-all' src={assets.tick_icon} alt="" />
                    </button>
                    {/* Cancel Button */}
                    <button 
                      onClick={() => cancelAppointment(item._id)} 
                      className='p-2.5 hover:bg-rose-50 rounded-xl transition-all group/btn'
                      title="Cancel Appointment"
                    >
                      <img className='w-5 grayscale group-hover/btn:grayscale-0 opacity-40 group-hover/btn:opacity-100 transition-all' src={assets.cancel_icon} alt="" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Empty State */}
          {appointments.length === 0 && (
            <div className='py-20 text-center'>
              <img className='w-20 mx-auto opacity-20 mb-4' src={assets.appointments_icon} alt="" />
              <p className='text-slate-300 font-bold uppercase tracking-widest text-xs'>No appointments scheduled</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;