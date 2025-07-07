import React from "react";
import Homepage from "./pages/Homepage";
import { Route, Routes } from "react-router-dom";
import { useAppContext } from "./context/AppContext.jsx";
import Login from "./componenets/Login.jsx";
import { Toaster } from "react-hot-toast";

import Registration from "./pages/admin/Registration.jsx";
import Navbar from "./componenets/Navbar.jsx";
import ReceptionLayout from "./pages/Reception/ReceptionLayout.jsx";
import PatientList from "./pages/Reception/PatientList.jsx";
import AddPatient from "./pages/Reception/AddPatient.jsx";
import DoctorLayout from "./pages/Doctor/DoctorLayout.jsx";
import Appointment from "./pages/Doctor/Appointment.jsx";
import PatientLog from "./pages/Doctor/PatientLog.jsx";
import PatientProfile from "./pages/Doctor/PatientProfile.jsx";
import PaymentsPage from "./pages/Reception/PaymentsPage.jsx";

const App = () => {
  const { showLogin, loggedInStaff, loading } = useAppContext();

  if (loading) {
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
      
        <div className="text-2xl font-semibold text-gray-700">
          Loading Application...
        </div>
      </div>
    );
  }
  return (
    <div className='text-default min-h-screen text-gray-700 bg-white"'>
      {showLogin ? <Login /> : null}
      <Navbar />
      <Toaster />
      <div>
        <Routes>
          <Route path="/registeration" element={<Registration />} />
          <Route
            path="/receptionist-dashboard"
            element={loggedInStaff ? <ReceptionLayout /> : <Homepage />}
          >
            <Route index element={loggedInStaff ? <AddPatient /> : null} />
            <Route path="patient-list" element={<PatientList />} />
            <Route path="payment/:patientId" element={<PaymentsPage />} />
          </Route>

          <Route
            path="/doctor-dashboard"
            element={loggedInStaff ? <DoctorLayout /> : <Homepage />}
          >
            <Route index element={loggedInStaff ? <Appointment /> : null} />
            <Route path="patient-log" element={<PatientLog />} />
            <Route path=":patientId" element={<PatientProfile />} />
          </Route>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
