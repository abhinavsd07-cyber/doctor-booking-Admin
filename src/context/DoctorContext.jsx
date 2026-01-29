// doctor/src/Context/DoctorContext.jsx
import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '');
    const [appointments, setAppointments] = useState([]);
    // 1. Add dashData state
    const [dashData, setDashData] = useState(false);

    const getAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } });
            if (data.success) {
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // 2. Add function to fetch dashboard statistics
    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } });
            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { dToken } });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
                getDashData(); // Refresh stats after completing an appointment
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // 3. Include dashData and getDashData in the provider value
    const value = { 
        dToken, setDToken, 
        backendUrl, 
        appointments, setAppointments, 
        getAppointments, 
        completeAppointment,
        dashData, setDashData,
        getDashData
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;