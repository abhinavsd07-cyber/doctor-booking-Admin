import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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

ChartJS.register(
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
);

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

  // 📈 1. Trend Chart Data (Using real backend growth data)
  const lineChartData = {
    labels: dashData?.appointmentTrends ? Object.keys(dashData.appointmentTrends) : ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Monthly Bookings',
      data: dashData?.appointmentTrends ? Object.values(dashData.appointmentTrends) : [0, 0, 0],
      borderColor: '#5f6FFF',
      backgroundColor: 'rgba(95, 111, 255, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  // 🍩 2. Specialty Chart Data (Using real doctor categories)
  const specialtyChartData = {
    labels: dashData?.specialtyData ? Object.keys(dashData.specialtyData) : ['None'],
    datasets: [{
      data: dashData?.specialtyData ? Object.values(dashData.specialtyData) : [1],
      backgroundColor: ['#5f6FFF', '#FF5F5F', '#5FFF8F', '#FFD55F', '#AD5FFF'],
      hoverOffset: 4
    }]
  };

  return dashData && (
    <div className="m-5">
      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Earnings Card */}
        <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:scale-105 transition-all">
            <div className="p-3 bg-orange-50 rounded-lg text-2xl">💰</div>
            <div>
                <p className="text-2xl font-bold text-gray-700">{dashData.totalEarnings || 0}</p>
                <p className="text-gray-500 font-medium text-sm">Total Revenue</p>
            </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:scale-105 transition-all">
          <div className="p-3 bg-blue-50 rounded-lg"><img className="w-8" src={assets.doctor_icon} alt="" /></div>
          <div>
            <p className="text-2xl font-bold text-gray-700">{dashData.doctors}</p>
            <p className="text-gray-500 font-medium text-sm">Total Doctors</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:scale-105 transition-all">
          <div className="p-3 bg-indigo-50 rounded-lg"><img className="w-8" src={assets.appointments_icon} alt="" /></div>
          <div>
            <p className="text-2xl font-bold text-gray-700">{dashData.appointments}</p>
            <p className="text-gray-500 font-medium text-sm">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:scale-105 transition-all">
          <div className="p-3 bg-green-50 rounded-lg"><img className="w-8" src={assets.patients_icon} alt="" /></div>
          <div>
            <p className="text-2xl font-bold text-gray-700">{dashData.patients}</p>
            <p className="text-gray-500 font-medium text-sm">Total Patients</p>
          </div>
        </div>
      </div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Appointment Trends (Monthly)</h3>
          <Line data={lineChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Doctor Specialties</h3>
          <div className="max-w-[250px] mx-auto">
            <Doughnut data={specialtyChartData} options={{ maintainAspectRatio: true }} />
          </div>
        </div>
      </div>

      {/* --- Latest Activity Table --- */}
      <div className="bg-white mt-8 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-5 border-b bg-gray-50/50">
          <img src={assets.list_icon} alt="" />
          <p className="font-bold text-gray-700">Recent Bookings</p>
        </div>

        <div className="divide-y divide-gray-100">
          {dashData.latestAppointments.map((item, index) => (
            <div className="flex items-center px-6 py-4 gap-4 hover:bg-gray-50 transition-colors" key={index}>
              <img className="rounded-full w-12 h-12 border-2 border-white shadow-sm" src={item.docData.image} alt="" />
              <div className="flex-1">
                <p className="text-gray-800 font-bold">{item.docData.name}</p>
                <p className="text-gray-500 text-sm">{slotDateFormat(item.slotDate)} • <span className="text-blue-600 font-medium">{item.slotTime}</span></p>
              </div>
              
              <div className="flex items-center">
                {item.cancelled ? (
                  <span className="px-3 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-full border border-red-100">Cancelled</span>
                ) : item.isCompleted ? (
                  <span className="px-3 py-1 bg-green-50 text-green-500 text-xs font-bold rounded-full border border-green-100">Completed</span>
                ) : (
                  <button 
                    onClick={async () => {
                      await cancelAppointment(item._id);
                      getDashData();
                    }}
                    className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                  >
                    <img className="w-6 group-hover:opacity-80" src={assets.cancel_icon} alt="" />
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