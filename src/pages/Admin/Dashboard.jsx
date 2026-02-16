import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  };

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  const lineChartData = {
    labels: dashData?.appointmentTrends ? Object.keys(dashData.appointmentTrends) : ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Monthly Bookings',
      data: dashData?.appointmentTrends ? Object.values(dashData.appointmentTrends) : [0, 0, 0],
      borderColor: '#2563eb', // Blue-600
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#fff',
      pointBorderWidth: 2
    }]
  };

  const specialtyChartData = {
    labels: dashData?.specialtyData ? Object.keys(dashData.specialtyData) : ['None'],
    datasets: [{
      data: dashData?.specialtyData ? Object.values(dashData.specialtyData) : [1],
      backgroundColor: ['#2563eb', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'],
      borderWidth: 0,
      hoverOffset: 15
    }]
  };

  return dashData && (
    <div className="m-6 font-sans">
      {/* --- HEADER --- */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System <span className="text-blue-600">Overview</span></h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Real-time administrative analytics</p>
      </div>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", val: `$${dashData.totalEarnings || 0}`, icon: "💰", bg: "bg-orange-50", text: "text-orange-600" },
          { label: "Total Doctors", val: dashData.doctors, img: assets.doctor_icon, bg: "bg-blue-50" },
          { label: "Appointments", val: dashData.appointments, img: assets.appointments_icon, bg: "bg-indigo-50" },
          { label: "Total Patients", val: dashData.patients, img: assets.patients_icon, bg: "bg-emerald-50" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className={`p-4 ${stat.bg} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon ? <span className="text-xl">{stat.icon}</span> : <img className="w-6" src={stat.img} alt="" />}
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.val}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Appointment Trends</p>
          <Line data={lineChartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } } }} />
        </div>
        
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center">
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-10 self-start">Specialty Split</p>
          <div className="w-full max-w-[220px]">
            <Doughnut data={specialtyChartData} options={{ cutout: '75%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, font: { size: 10, weight: 'bold' } } } } }} />
          </div>
        </div>
      </div>

      {/* --- RECENT ACTIVITY --- */}
      <div className="bg-white mt-8 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <img className="w-5" src={assets.list_icon} alt="" />
            <p className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Latest Bookings</p>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {dashData.latestAppointments.map((item, index) => (
            <div className="flex items-center px-8 py-5 gap-4 hover:bg-slate-50/50 transition-colors group" key={index}>
              <img className="rounded-full w-12 h-12 object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform" src={item.docData.image} alt="" />
              <div className="flex-1">
                <p className="text-slate-900 font-bold text-sm tracking-tight">{item.docData.name}</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                  {slotDateFormat(item.slotDate)} • <span className="text-blue-600">{item.slotTime}</span>
                </p>
              </div>
              
              <div className="flex items-center">
                {item.cancelled ? (
                  <span className="px-4 py-1.5 bg-rose-50 text-rose-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-rose-100">Cancelled</span>
                ) : item.isCompleted ? (
                  <span className="px-4 py-1.5 bg-emerald-50 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Completed</span>
                ) : (
                  <button 
                    onClick={async () => {
                      await cancelAppointment(item._id);
                      getDashData();
                    }}
                    className="p-3 hover:bg-rose-50 rounded-xl transition-all group/btn"
                  >
                    <img className="w-5 grayscale group-hover/btn:grayscale-0 opacity-40 group-hover/btn:opacity-100 transition-all" src={assets.cancel_icon} alt="Cancel" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;