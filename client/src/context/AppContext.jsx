import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loggedInStaff, setLoggedInStaff] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);

  //Fetch staff Auth Status, Staff Data
  const fetchStaff = async () => {
    try {
      const { data } = await axios.get("/api/staff/is-auth");
      if (data.success) {
        setLoggedInStaff(data.staff);
      } else {
        setLoggedInStaff(null);
      }
    } catch (error) {
      setLoggedInStaff(null);
    } finally {
      setLoading(false);
    }
  };

  //Logout
  const logout = async () => {
    try {
      const { data } = await axios.get("/api/staff/logout");
      if (data.success) {
        toast.success(data.message);
        setLoggedInStaff(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //Fetch all patients
  const fetchPatients = async () => {
    try {
      const { data } = await axios.get("/api/patient/list");
      if (data.success) {
        setPatients(data.patients);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchPatients();
  }, []);

  const value = {
    axios,
    navigate,
    loggedInStaff,
    setLoggedInStaff,
    showLogin,
    setShowLogin,
    fetchStaff,
    loading,
    logout,
    patients,
    fetchPatients,
    patient,
    setPatient,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
