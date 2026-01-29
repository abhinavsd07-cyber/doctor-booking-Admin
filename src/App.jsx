import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { AdminContext } from "./Context/AdminContext";
import { DoctorContext } from "./Context/DoctorContext"; // Import DoctorContext
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components & Pages
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";

// Doctor Pages (Make sure these paths match your folder structure)
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

function App() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext); // Get dToken

  return (
    <div className="min-h-screen bg-[#F8F9FD]">
      <ToastContainer />
      
      {/* 1. Check if EITHER Admin or Doctor is logged in */}
      {(aToken || dToken) ? (
        <>
          <Navbar />
          <div className="flex items-start">
            <Sidebar /> {/* Sidebar handles logic to show different icons internally */}
            <main className="flex-1 overflow-y-auto">
              <Routes>
                {/* Admin Routes */}
                {aToken && (
                  <>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/admin-dashboard" element={<Dashboard />} />
                    <Route path="/all-appointments" element={<AllAppointments />} />
                    <Route path="/add-doctor" element={<AddDoctor />} />
                    <Route path="/doctor-list" element={<DoctorsList />} />
                  </>
                )}

                {/* Doctor Routes */}
                {dToken && (
                  <>
                    <Route path="/" element={<DoctorDashboard />} />
                    <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                    <Route path="/doctor-appointments" element={<DoctorAppointments />} />
                    <Route path="/doctor-profile" element={<DoctorProfile />} />
                  </>
                )}
              </Routes>
            </main>
          </div>
        </>
      ) : (
        /* 2. If no token, show login page */
        <Login />
      )}
    </div>
  );
}

export default App;