import React, { useState, createContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(null); // Changed false to null for better logical checking

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Professional Header Configuration
  const authHeader = { headers: { atoken: aToken } };

  // 1. Fetch All Doctors
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/all-doctors`, {}, authHeader);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // 2. Change Doctor Availability
  const changeAvailability = async (docId) => {
    try {
      // FIX: Changed 'aToken' to 'atoken' to match other requests
      const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`, { docId }, authHeader);
      if (data.success) {
        toast.success(data.message);
        getAllDoctors(); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // 3. Fetch All Appointments
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, authHeader);
      if (data.success) {
        setAppointments(data.appointments.reverse()); // Reverse to show latest first
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // 4. Cancel Appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/cancel-appointment`, { appointmentId }, authHeader);
      if (data.success) {
        toast.success(data.message);
        getAllAppointments(); 
        getDashData(); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // 5. Get Dashboard Statistics
  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, authHeader);
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
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