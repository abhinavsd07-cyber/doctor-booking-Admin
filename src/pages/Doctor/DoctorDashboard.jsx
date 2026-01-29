// doctor/src/pages/Doctor/DoctorDashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorDashboard = () => {
    const { dToken, backendUrl, completeAppointment } = useContext(DoctorContext);
    const [dashData, setDashData] = useState(false);

    // --- Helper to convert "22_08_2024" to "22 Aug 2024" ---
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_'); 
        const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
    };

    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } });
            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (dToken) {
            getDashData();
        }
    }, [dToken]);

    if (!dashData) {
        return (
            <div className='flex items-center justify-center min-h-[60vh]'>
                <div className='w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
            </div>
        )
    }

    return (
        <div className='m-5'>
            <div className='flex flex-wrap gap-3'>
                {/* Earnings Card */}
                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.earning_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>$ {dashData.earnings}</p>
                        <p className='text-gray-400'>Earnings</p>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.appointments_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
                        <p className='text-gray-400'>Appointments</p>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.patients_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
                        <p className='text-gray-400'>Patients</p>
                    </div>
                </div>
            </div>

            <div className='bg-white mt-10 shadow-sm rounded-lg overflow-hidden'>
                <div className='flex items-center gap-2.5 px-4 py-4 border-b bg-gray-50/50'>
                    <img src={assets.list_icon} alt="" />
                    <p className='font-semibold'>Latest Bookings</p>
                </div>

                <div className='divide-y divide-gray-100'>
                    {dashData.latestAppointments.length > 0 ? (
                        dashData.latestAppointments.map((item, index) => (
                            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-50 transition-colors' key={index}>
                                <img className='rounded-full w-10 h-10 object-cover' src={item.userData.image} alt="" />
                                <div className='flex-1 text-sm'>
                                    <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                                    {/* UPDATED: Applying clean date format and adding time */}
                                    <p className='text-gray-600'>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                                </div>
                                {item.cancelled 
                                    ? <p className='text-red-400 text-xs font-medium bg-red-50 px-2 py-1 rounded'>Cancelled</p> 
                                    : item.isCompleted 
                                        ? <p className='text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded'>Completed</p>
                                        : <img onClick={() => { completeAppointment(item._id); getDashData(); }} className='w-10 cursor-pointer hover:scale-110 transition-transform' src={assets.tick_icon} alt="Complete" />
                                }
                            </div>
                        ))
                    ) : (
                        <p className='p-10 text-center text-gray-400'>No recent bookings found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DoctorDashboard;