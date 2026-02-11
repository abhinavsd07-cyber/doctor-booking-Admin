import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';

const DoctorDashboard = () => {
    const { dToken, backendUrl, completeAppointment, cancelAppointment } = useContext(DoctorContext);
    const [dashData, setDashData] = useState(false);

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_');
        const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
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
            toast.error("Failed to load dashboard data");
        }
    }

    useEffect(() => {
        if (dToken) { getDashData(); }
    }, [dToken]);

    if (!dashData) {
        return (
            <div className='flex items-center justify-center min-h-[80vh]'>
                <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
            </div>
        );
    }

    // --- Chart Config: Professional Area Chart ---
    const chartOptions = {
        chart: { id: 'revenue-chart', toolbar: { show: false }, zoom: { enabled: false } },
        colors: ['#3b82f6'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3, stops: [0, 90, 100] } },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: { categories: dashData.latestAppointments.map(item => slotDateFormat(item.slotDate)).reverse() },
        yaxis: { labels: { formatter: (val) => `$${val}` } }
    };

    const chartSeries = [{
        name: 'Revenue',
        data: dashData.latestAppointments.map(item => item.amount).reverse()
    }];

    return (
        <div className='p-6 bg-gray-50 min-h-screen'>
            <div className='mb-6'>
                <h1 className='text-2xl font-bold text-gray-800'>Welcome, Doctor</h1>
                <p className='text-gray-500'>Here is what's happening with your clinic today.</p>
            </div>

            {/* --- Stats Row --- */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                {[
                    { label: 'Total Earnings', val: `$${dashData.earnings}`, icon: assets.earning_icon, color: 'text-green-600', bg: 'bg-green-100' },
                    { label: 'Appointments', val: dashData.appointments, icon: assets.appointments_icon, color: 'text-blue-600', bg: 'bg-blue-100' },
                    { label: 'Unique Patients', val: dashData.patients, icon: assets.patients_icon, color: 'text-purple-600', bg: 'bg-purple-100' },
                ].map((stat, i) => (
                    <div key={i} className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow'>
                        <div className={`p-3 rounded-lg ${stat.bg}`}>
                            <img className='w-8' src={stat.icon} alt="" />
                        </div>
                        <div>
                            <p className='text-sm text-gray-500 font-medium'>{stat.label}</p>
                            <h2 className={`text-2xl font-bold ${stat.color}`}>{stat.val}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* --- Main Chart (Spans 2 columns) --- */}
                <div className='lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
                    <div className='flex items-center justify-between mb-6'>
                        <h3 className='font-bold text-gray-800 text-lg'>Revenue Analysis</h3>
                        <span className='text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-500'>Last 5 Bookings</span>
                    </div>
                    <Chart options={chartOptions} series={chartSeries} type="area" height={300} />
                </div>

                {/* --- Side Panel: Appointment Status --- */}
                <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
                    <h3 className='font-bold text-gray-800 text-lg mb-6'>Clinic Activity</h3>
                    <div className='space-y-6'>
                        <div className='flex justify-between items-center'>
                            <p className='text-gray-600'>New Bookings</p>
                            <span className='font-bold text-blue-600'>{dashData.appointments}</span>
                        </div>
                        <div className='w-full bg-gray-100 rounded-full h-2'>
                            <div className='bg-blue-500 h-2 rounded-full' style={{ width: '70%' }}></div>
                        </div>
                        <p className='text-xs text-gray-400 mt-2 italic'>Activity is 12% higher than last week.</p>
                    </div>
                </div>
            </div>

            {/* --- Table: Recent Appointments --- */}
            <div className='bg-white mt-8 rounded-xl shadow-sm border border-gray-100'>
                <div className='p-6 border-b border-gray-50'>
                    <h3 className='font-bold text-gray-800 text-lg'>Recent Appointments</h3>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left'>
                        <thead className='bg-gray-50 text-gray-500 text-xs uppercase'>
                            <tr>
                                <th className='px-6 py-4 font-medium'>Patient</th>
                                <th className='px-6 py-4 font-medium'>Date & Time</th>
                                <th className='px-6 py-4 font-medium'>Status</th>
                                <th className='px-6 py-4 font-medium'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {dashData.latestAppointments.map((item, index) => (
                                <tr key={index} className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-6 py-4 flex items-center gap-3'>
                                        <img className='w-10 h-10 rounded-full object-cover border' src={item.userData.image} alt="" />
                                        <span className='font-medium text-gray-700'>{item.userData.name}</span>
                                    </td>
                                    <td className='px-6 py-4 text-sm'>
                                        <p className='text-gray-800'>{slotDateFormat(item.slotDate)}</p>
                                        <p className='text-gray-400'>{item.slotTime}</p>
                                    </td>
                                    <td className='px-6 py-4'>
                                        {item.cancelled ? (
                                            <span className='px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-full'>Cancelled</span>
                                        ) : item.isCompleted ? (
                                            <span className='px-3 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-full'>Completed</span>
                                        ) : (
                                            <span className='px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full'>Pending</span>
                                        )}
                                    </td>
                                    <td className='px-6 py-4'>
                                        {!item.cancelled && !item.isCompleted && (
                                            <div className='flex gap-2'>
                                                <button onClick={() => { completeAppointment(item._id); getDashData(); }} className='p-2 hover:bg-green-50 rounded-full transition-colors'>
                                                    <img className='w-5' src={assets.tick_icon} alt="" />
                                                </button>
                                                <button onClick={() => { cancelAppointment(item._id); getDashData(); }} className='p-2 hover:bg-red-50 rounded-full transition-colors'>
                                                    <img className='w-5' src={assets.cancel_icon} alt="" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;