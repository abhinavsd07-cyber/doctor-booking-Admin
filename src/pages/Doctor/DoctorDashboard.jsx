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
        return `${dateArray[0]} ${months[Number(dateArray[1])]}`;
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
                <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
            </div>
        );
    }

    const chartOptions = {
        chart: { id: 'revenue-chart', toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'inherit' },
        colors: ['#2563eb'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [20, 100] } },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3, lineCap: 'round' },
        grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
        xaxis: { 
            categories: dashData.latestAppointments.map(item => slotDateFormat(item.slotDate)).reverse(),
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: '#94a3b8', fontWeight: 600, fontSize: '10px' } }
        },
        yaxis: { labels: { style: { colors: '#94a3b8', fontWeight: 600, fontSize: '10px' }, formatter: (val) => `$${val}` } }
    };

    const chartSeries = [{ name: 'Earnings', data: dashData.latestAppointments.map(item => item.amount).reverse() }];

    return (
        <div className='p-6 font-sans bg-[#fbfcfd] min-h-screen'>
            {/* --- HEADER --- */}
            <div className='mb-8'>
                <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Physician <span className='text-blue-600'>Console</span></h1>
                <p className='text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1'>Practice Management & Analytics</p>
            </div>

            {/* --- STAT CARDS --- */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                {[
                    { label: 'Total Revenue', val: `$${dashData.earnings}`, icon: "💰", bg: 'bg-emerald-50', color: 'text-emerald-600' },
                    { label: 'Active Sessions', val: dashData.appointments, icon: "📅", bg: 'bg-blue-50', color: 'text-blue-600' },
                    { label: 'Total Patients', val: dashData.patients, icon: "👥", bg: 'bg-indigo-50', color: 'text-indigo-600' },
                ].map((stat, i) => (
                    <div key={i} className='bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-center gap-5 group hover:translate-y-[-4px] transition-all duration-300'>
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>{stat.label}</p>
                            <h2 className={`text-2xl font-black tracking-tight ${stat.color}`}>{stat.val}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- CHARTS & ACTIVITY --- */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                <div className='lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm'>
                    <div className='flex items-center justify-between mb-8'>
                        <p className='text-xs font-black text-slate-400 uppercase tracking-[0.2em]'>Revenue Stream</p>
                        <span className='text-[10px] bg-slate-100 font-bold px-3 py-1 rounded-full text-slate-500 uppercase'>Per Booking</span>
                    </div>
                    <Chart options={chartOptions} series={chartSeries} type="area" height={320} />
                </div>

                <div className='bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm'>
                    <p className='text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8'>Clinic Intensity</p>
                    <div className='space-y-8'>
                        <div>
                            <div className='flex justify-between items-end mb-3'>
                                <p className='text-sm font-bold text-slate-700'>Schedule Load</p>
                                <span className='text-blue-600 font-black text-xl'>{dashData.appointments}</span>
                            </div>
                            <div className='w-full bg-slate-50 rounded-full h-3 overflow-hidden'>
                                <div className='bg-blue-600 h-full rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]' style={{ width: '65%' }}></div>
                            </div>
                        </div>
                        <div className='p-4 bg-blue-50/50 rounded-2xl border border-blue-100'>
                            <p className='text-[10px] text-blue-700 font-bold uppercase tracking-widest leading-relaxed'>
                                Notice: You have 3 pending reviews for today's completed sessions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RECENT APPOINTMENTS TABLE --- */}
            <div className='bg-white mt-8 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden'>
                <div className='px-8 py-6 border-b border-slate-50 bg-slate-50/30'>
                    <p className='text-xs font-black text-slate-900 uppercase tracking-[0.2em]'>Upcoming & Recent Sessions</p>
                </div>
                <div className='overflow-x-auto no-scrollbar'>
                    <table className='w-full text-left'>
                        <thead className='bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest'>
                            <tr>
                                <th className='px-8 py-4'>Patient</th>
                                <th className='px-8 py-4'>Schedule</th>
                                <th className='px-8 py-4 text-center'>Status</th>
                                <th className='px-8 py-4 text-right'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-50'>
                            {dashData.latestAppointments.map((item, index) => (
                                <tr key={index} className='hover:bg-slate-50/50 transition-colors group'>
                                    <td className='px-8 py-5'>
                                        <div className='flex items-center gap-3'>
                                            <img className='w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm' src={item.userData.image} alt="" />
                                            <span className='font-bold text-slate-900 text-sm tracking-tight'>{item.userData.name}</span>
                                        </div>
                                    </td>
                                    <td className='px-8 py-5'>
                                        <p className='text-slate-900 font-bold text-xs'>{slotDateFormat(item.slotDate)}</p>
                                        <p className='text-blue-600 font-bold text-[10px] uppercase tracking-widest mt-0.5'>{item.slotTime}</p>
                                    </td>
                                    <td className='px-8 py-5 text-center'>
                                        {item.cancelled ? (
                                            <span className='px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 rounded-full border border-rose-100'>Cancelled</span>
                                        ) : item.isCompleted ? (
                                            <span className='px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 rounded-full border border-emerald-100'>Completed</span>
                                        ) : (
                                            <span className='px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 rounded-full border border-blue-100'>Pending</span>
                                        )}
                                    </td>
                                    <td className='px-8 py-5'>
                                        {!item.cancelled && !item.isCompleted && (
                                            <div className='flex justify-end gap-2'>
                                                <button onClick={() => { completeAppointment(item._id); getDashData(); }} className='p-2.5 hover:bg-emerald-50 rounded-xl transition-all group/btn'>
                                                    <img className='w-5 grayscale group-hover/btn:grayscale-0 opacity-40 group-hover/btn:opacity-100' src={assets.tick_icon} alt="Complete" />
                                                </button>
                                                <button onClick={() => { cancelAppointment(item._id); getDashData(); }} className='p-2.5 hover:bg-rose-50 rounded-xl transition-all group/btn'>
                                                    <img className='w-5 grayscale group-hover/btn:grayscale-0 opacity-40 group-hover/btn:opacity-100' src={assets.cancel_icon} alt="Cancel" />
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