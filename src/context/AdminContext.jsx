import React, { useState, createContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // 1. Fetch All Doctors
  const getAllDoctors = async () => {
    try {
      // Updated header key to lowercase 'atoken'
      const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, { headers: { atoken: aToken } });
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 2. Change Doctor Availability
 // admin/src/context/AdminContext.jsx
const changeAvailability = async (docId) => {
    try {
        const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } });
        if (data.success) {
            toast.success(data.message);
            getAllDoctors(); // Refresh the list to show the new status
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
};
  // 3. Fetch All Appointments
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { atoken: aToken } });
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 4. Cancel Appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { atoken: aToken } });
      if (data.success) {
        toast.success(data.message);
        getAllAppointments(); 
        getDashData(); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 5. Get Dashboard Statistics
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { atoken: aToken } });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    aToken, setAToken,
    backendUrl,
    doctors, getAllDoctors,
    changeAvailability,
    appointments, setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData, getDashData
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;