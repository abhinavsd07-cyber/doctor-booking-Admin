import React, { useContext, useEffect, useMemo } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) getDashData();
  }, [aToken]);

  const slotDateFormat = (slotDate) => {
    if (!slotDate) return "";
    const dateArray = slotDate.split("_");
    const months = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  /* ===========================
     SAFE CHART DATA (Memoized)
  ============================ */

  const lineChartData = useMemo(() => {
    const labels = dashData?.appointmentTrends
      ? Object.keys(dashData.appointmentTrends)
      : [];

    const values = dashData?.appointmentTrends
      ? Object.values(dashData.appointmentTrends)
      : [];

    return {
      labels,
      datasets: [
        {
          label: "Monthly Bookings",
          data: values,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 4
        }
      ]
    };
  }, [dashData]);

  const specialtyChartData = useMemo(() => {
    const labels = dashData?.specialtyData
      ? Object.keys(dashData.specialtyData)
      : [];

    const values = dashData?.specialtyData
      ? Object.values(dashData.specialtyData)
      : [];

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "#2563eb",
            "#f43f5e",
            "#10b981",
            "#f59e0b",
            "#8b5cf6",
            "#06b6d4"
          ],
          borderWidth: 0
        }
      ]
    };
  }, [dashData]);

  /* ===========================
     LOADING STATE
  ============================ */

  if (!dashData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-800">
            Admin <span className="text-blue-600">Dashboard</span>
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Real-time system analytics & performance overview
          </p>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Revenue",
              value: `$${dashData.totalEarnings || 0}`,
              color: "text-orange-600",
              bg: "bg-orange-50"
            },
            {
              label: "Doctors",
              value: dashData.doctors || 0,
              color: "text-blue-600",
              bg: "bg-blue-50"
            },
            {
              label: "Appointments",
              value: dashData.appointments || 0,
              color: "text-indigo-600",
              bg: "bg-indigo-50"
            },
            {
              label: "Patients",
              value: dashData.patients || 0,
              color: "text-emerald-600",
              bg: "bg-emerald-50"
            }
          ].map((card, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                  {card.label}
                </p>
                <p className={`text-3xl font-bold ${card.color}`}>
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CHART SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-md border border-slate-100">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-6">
              Appointment Trends
            </p>
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, grid: { display: false } },
                  x: { grid: { display: false } }
                }
              }}
            />
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-6">
              Specialty Distribution
            </p>
            <Doughnut
              data={specialtyChartData}
              options={{
                cutout: "70%",
                plugins: { legend: { position: "bottom" } }
              }}
            />
          </div>
        </div>

        {/* RECENT BOOKINGS */}
        <div className="bg-white mt-10 rounded-3xl shadow-md border border-slate-100 overflow-hidden">
          <div className="px-8 py-5 border-b bg-slate-50 text-xs uppercase tracking-widest text-slate-500 font-semibold">
            Recent Bookings
          </div>

          <div className="divide-y">
            {dashData.latestAppointments?.map((item, index) => (
              <div
                key={index}
                className="flex items-center px-8 py-5 gap-4 hover:bg-slate-50 transition"
              >
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={item.docData?.image}
                  alt=""
                />

                <div className="flex-1">
                  <p className="font-semibold text-slate-800 whitespace-nowrap">
                    {item.docData?.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {slotDateFormat(item.slotDate)} • {item.slotTime}
                  </p>
                </div>

                {item.cancelled ? (
                  <span className="px-4 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                    Cancelled
                  </span>
                ) : item.isCompleted ? (
                  <span className="px-4 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                    Completed
                  </span>
                ) : (
                  <button
                    onClick={async () => {
                      await cancelAppointment(item._id);
                      getDashData();
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
