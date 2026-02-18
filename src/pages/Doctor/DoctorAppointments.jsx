import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);

  // Helper to format the slot date (e.g., 20_02_2026 to 20 Feb 2026)
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
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
    <div className="max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            Appointment <span className="text-blue-600">Manager</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View, manage and track all patient sessions
          </p>
        </div>

        <button
          onClick={getAppointments}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          🔄 Refresh
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* TABLE HEADER */}
        <div className="hidden md:grid grid-cols-7 gap-4 px-6 py-4 bg-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <span>#</span>
          <span>Patient</span>
          <span>Payment</span>
          <span>Age</span>
          <span>Date & Time</span>
          <span>Fees</span>
          <span className="text-right">Action</span>
        </div>

        {/* APPOINTMENTS */}
        {appointments.slice().reverse().map((item, index) => (
          <div
            key={index}
            className="grid md:grid-cols-7 gap-4 items-center px-6 py-5 border-b hover:bg-blue-50 transition-all duration-300"
          >
            <span className="hidden md:block text-slate-500">
              {index + 1}
            </span>

          {/* PATIENT */}
<div className="flex items-center gap-3">
  <img
    src={item.userData.image}
    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100 flex-shrink-0"
    alt=""
  />

  <div>
    <p className="font-semibold text-slate-800 whitespace-nowrap">
      {item.userData.name}
    </p>
    <p className="text-xs text-slate-500">
      #{item._id.slice(-6).toUpperCase()}
    </p>
  </div>
</div>


            {/* PAYMENT */}
            <div>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  item.payment
                    ? "bg-green-100 text-green-600"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                {item.payment ? "ONLINE" : "CASH"}
              </span>
            </div>

            {/* AGE */}
            <span className="hidden md:block text-slate-600">
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

            {/* FEES */}
            <span className="font-bold text-slate-900">
              ${item.amount}
            </span>

            {/* ACTION */}
            <div className="flex justify-end gap-3">
              {item.cancelled ? (
                <span className="text-red-500 text-sm font-semibold">
                  Cancelled
                </span>
              ) : item.isCompleted ? (
                <span className="text-green-600 text-sm font-semibold">
                  Completed
                </span>
              ) : (
                <>
                  <button
                    onClick={() => completeAppointment(item._id)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    ✅ Complete
                  </button>

                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    ❌ Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

      </div>
    </div>
  </div>
);

};

export default DoctorAppointments;