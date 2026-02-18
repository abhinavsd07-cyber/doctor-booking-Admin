// doctor/src/context/DoctorContext.jsx

import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
    const [appointments, setAppointments] = useState([]);

    const getAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/doctor/appointments", { headers: { dToken } });
            if (data.success) {
                // FORCE RE-RENDER: Create a new array reference
                setAppointments([...data.appointments].reverse());
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/doctor/complete-appointment",
                { appointmentId },
                { headers: { dToken } }
            );

            if (data.success) {
                toast.success(data.message); // Toast pops up instantly!
                await getAppointments();    // UI list updates instantly!
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const value = {
        dToken, setDToken, backendUrl,
        appointments, setAppointments, getAppointments,
        completeAppointment
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;