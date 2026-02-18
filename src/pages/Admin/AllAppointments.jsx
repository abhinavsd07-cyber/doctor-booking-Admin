import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

 return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 font-sans">
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Appointment <span className="text-blue-600">Overview</span>
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Manage all patient bookings across the platform
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl px-6 py-4 border border-slate-100">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            Total Appointments
          </p>
          <p className="text-2xl font-bold text-blue-600">
            {appointments.length}
          </p>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

        {/* TABLE HEADER */}
        <div className="hidden md:grid grid-cols-[0.5fr_2.5fr_1fr_2fr_2.5fr_1fr_1.5fr] px-8 py-5 bg-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <span>#</span>
          <span>Patient</span>
          <span>Age</span>
          <span>Schedule</span>
          <span>Doctor</span>
          <span>Fee</span>
          <span className="text-right">Status</span>
        </div>

        {appointments.length === 0 ? (
          <div className="py-24 text-center text-slate-400 font-semibold">
            No appointments available
          </div>
        ) : (
          appointments.map((item, index) => (
            <div
              key={index}
              className="grid md:grid-cols-[0.5fr_2.5fr_1fr_2fr_2.5fr_1fr_1.5fr] items-center px-8 py-6 border-t hover:bg-blue-50 transition-all duration-300"
            >
              {/* INDEX */}
              <span className="hidden md:block text-slate-400 font-medium">
                {index + 1}
              </span>

              {/* PATIENT */}
              <div className="flex items-center gap-4">
                <img
                  src={item.userData.image}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100"
                  alt=""
                />
                <div>
                  <p className="font-semibold text-slate-800 whitespace-nowrap">
                    {item.userData.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    ID: #{item._id.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* AGE */}
              <span className="text-slate-600">
                {item.userData.dob
                  ? new Date().getFullYear() -
                    item.userData.dob.split("-")[0]
                  : "—"}
              </span>

              {/* DATE */}
              <div>
                <p className="font-semibold text-slate-800">
                  {slotDateFormat(item.slotDate)}
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  {item.slotTime}
                </p>
              </div>

              {/* DOCTOR */}
              <div className="flex items-center gap-3">
                <img
                  src={item.docData.image}
                  className="w-9 h-9 rounded-full object-cover bg-slate-100"
                  alt=""
                />
                <p className="text-slate-700 font-medium whitespace-nowrap">
                  {item.docData.name}
                </p>
              </div>

              {/* FEE */}
              <span className="font-bold text-slate-900">
                ${item.amount}
              </span>

              {/* STATUS / ACTION */}
              <div className="flex justify-end">
                {item.cancelled ? (
                  <span className="px-4 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full">
                    Cancelled
                  </span>
                ) : item.isCompleted ? (
                  <span className="px-4 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded-full">
                    Completed
                  </span>
                ) : (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

};

export default AllAppointments;