import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className='m-5 font-sans'>
      {/* --- Section Header --- */}
      <div className='mb-6'>
        <h1 className='text-xl font-bold text-slate-900 tracking-tight'>
          Medical <span className='text-blue-600'>Staff Directory</span>
        </h1>
        <p className='text-xs text-slate-500 font-medium uppercase tracking-widest mt-1'>
          Manage doctor profiles and availability status
        </p>
      </div>
      
      {/* --- Grid Container --- */}
      <div className='w-full flex flex-wrap gap-6 max-h-[80vh] overflow-y-auto no-scrollbar pb-10'>
        {doctors.map((item, index) => (
          <div 
            key={index}
            className='bg-white border border-slate-100 rounded-[2rem] w-full sm:w-[220px] overflow-hidden group hover:shadow-[0_20px_40px_rgba(37,99,235,0.1)] transition-all duration-500 hover:-translate-y-2' 
          >
            {/* Image Section */}
            <div className='relative bg-slate-50 overflow-hidden'>
              <img 
                className='w-full h-56 object-cover object-top group-hover:scale-105 transition-transform duration-500' 
                src={item.image} 
                alt={item.name} 
              />
              {/* Overlay for better image-to-text transition if needed */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
            </div>
            
            {/* Info Section */}
            <div className='p-5'>
              <p className='text-slate-900 text-lg font-bold tracking-tight leading-tight group-hover:text-blue-600 transition-colors'>
                {item.name}
              </p>
              <p className='text-blue-600 text-[10px] font-bold uppercase tracking-[0.15em] mt-1'>
                {item.speciality}
              </p>
              
              {/* Modern Toggle Control */}
              <div className='mt-5 pt-4 border-t border-slate-50 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <input 
                    className='w-4 h-4 cursor-pointer accent-blue-600'
                    onChange={() => changeAvailability(item._id)} 
                    type="checkbox" 
                    checked={item.available} 
                    id={`available-${item._id}`}
                  />
                  <label 
                    htmlFor={`available-${item._id}`}
                    className={`text-[10px] font-bold uppercase tracking-widest cursor-pointer ${item.available ? 'text-emerald-500' : 'text-slate-400'}`}
                  >
                    {item.available ? 'Active' : 'Inactive'}
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;