import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';

const DoctorDashboard = () => {
    const { dToken, backendUrl, completeAppointment, cancelAppointment } = useContext(DoctorContext);
    const [dashData, setDashData] = useState(false);

    // Format: 20_02_2026 -> 20 Feb
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

    // --- Chart Configurations ---
    const chartOptions = {
        chart: { id: 'revenue-chart', toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'Plus Jakarta Sans, sans-serif' },
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
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 font-sans">

    {/* HEADER */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Doctor <span className="text-blue-600">Dashboard</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage appointments, revenue & analytics
        </p>
      </div>

      <button
        onClick={getDashData}
        className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
      >
        🔄 Refresh Data
      </button>
    </div>

    {/* STAT CARDS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {[
        { label: "Total Revenue", value: `$${dashData.earnings}`, icon: "💰" },
        { label: "Appointments", value: dashData.appointments, icon: "📅" },
        { label: "Patients", value: dashData.patients, icon: "👥" },
      ].map((card, index) => (
        <div
          key={index}
          className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">
                {card.label}
              </p>
              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {card.value}
              </h2>
            </div>
            <div className="text-4xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>

    {/* RECENT APPOINTMENTS */}
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-700">
          Recent Appointments
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-600 text-sm">
            <tr>
              <th className="px-6 py-3">Patient</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {dashData.latestAppointments.map((item, index) => (
              <tr
                key={index}
                className="border-b hover:bg-blue-50 transition-all duration-200"
              >
                {/* PATIENT */}
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={item.userData.image}
                    className="w-10 h-10 rounded-full object-cover"
                    alt=""
                  />
                  <div>
                    <p className="font-semibold text-slate-800">
                      {item.userData.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      #{item._id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                </td>

                {/* DATE */}
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-700">
                    {slotDateFormat(item.slotDate)}
                  </p>
                  <p className="text-xs text-blue-600">
                    {item.slotTime}
                  </p>
                </td>

                {/* STATUS */}
                <td className="px-6 py-4 text-center">
                  {item.cancelled ? (
                    <span className="px-4 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full">
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="px-4 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded-full">
                      Completed
                    </span>
                  ) : (
                    <span className="px-4 py-1 text-xs font-semibold bg-blue-100 text-blue-600 rounded-full">
                      Scheduled
                    </span>
                  )}
                </td>

                {/* ACTION BUTTONS */}
                <td className="px-6 py-4 text-right">
                  {!item.cancelled && !item.isCompleted && (
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={async () => {
                          await completeAppointment(item._id);
                          getDashData();
                        }}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        ✅ Complete
                      </button>

                      <button
                        onClick={async () => {
                          await cancelAppointment(item._id);
                          getDashData();
                        }}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        ❌ Cancel
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