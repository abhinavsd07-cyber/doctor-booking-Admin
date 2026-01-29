// admin/src/pages/Admin/AllAppointments.jsx
import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../Context/AdminContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);

  // --- Helper to convert "22_08_2024" to "22 Aug 2024" ---
  const slotDateFormat = (slotDate) => {
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
      "Dec",
    ];

    // Returns format: 22 Aug 2024
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5">

      {/* You can add this right below the "All Appointments" title */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-lg font-medium">All Appointments</p>
        <p className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
          Total: {appointments.length}
        </p>
      </div>

      {/* Inside your map, if appointments is empty */}
      {appointments.length === 0 && (
        <div className="py-10 text-center text-gray-400">
          No appointments found.
        </div>
      )}

      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b bg-gray-50">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.map((item, index) => (
          <div
            className="flex flex-wrap justify-between sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>

            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full"
                src={item.userData.image}
                alt=""
              />
              <p>{item.userData.name}</p>
            </div>

            <p>
              {item.userData.dob
                ? new Date().getFullYear() - item.userData.dob.split("-")[0]
                : "N/A"}
            </p>

            {/* UPDATED: Applying the clean date format here */}
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>

            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full bg-gray-200"
                src={item.docData.image}
                alt=""
              />
              <p>{item.docData.name}</p>
            </div>

            <p>${item.amount}</p>

            {/* Action Logic */}
            <div className="flex justify-center">
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">Completed</p>
              ) : (
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className="w-10 cursor-pointer hover:scale-110 transition-all"
                  src={assets.cancel_icon}
                  alt="Cancel"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
