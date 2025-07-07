import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

const Appointment = () => {
  const { axios, navigate } = useAppContext();


  const [todaysAppointments, setTodaysAppointments] = useState([]);


  const fetchTodaysAppointments = async () => {
    try {

      const { data } = await axios.get("/api/patient/list", {
        params: {
          recentAppointment: true, 
        },
      });

      if (data.success) {
        setTodaysAppointments(data.patients);
      } else {
       
        toast.error(data.message || "Failed to fetch today's appointments.");
        setTodaysAppointments([]); 
      }
    } catch (error) {
      console.error("Error fetching today's appointments:", error);
     
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error loading today's appointments."
      );
      setTodaysAppointments([]); 
    }

  };

  // --- useEffect to trigger initial data fetch ---
  useEffect(() => {
    fetchTodaysAppointments();
  }, [axios]);

  // --- toggleAppointment: Now triggers re-fetch of today's appointments ---
  const toggleAppointment = async (id, recentAppointment) => {
    try {
      const { data } = await axios.post("/api/patient/appointment", {
        id,
        recentAppointment,
      });

      if (data.success) {
        toast.success(data.message);
        fetchTodaysAppointments();
      } else {
        toast.error(data.message);
        fetchTodaysAppointments();
      }
    } catch (error) {
      toast.error(error.message);
      fetchTodaysAppointments();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-grow">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Token no.
              </th>
              <th scope="col" className="px-6 py-3">
                Patient name
              </th>
              <th scope="col" className="px-6 py-3">
                Profile
              </th>
              <th scope="col" className="px-6 py-3">
                Today's appointment
              </th>
            </tr>
          </thead>
          <tbody>
            {todaysAppointments.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-4 text-center text-gray-600 italic"
                >
                  No appointments for today.
                </td>
              </tr>
            ) : (
              todaysAppointments.map((patient) => (
                <tr
                  key={patient._id}
                  className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {patient.tokenNumber}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {patient.name}
                  </th>

                  <td
                    onClick={() => {
                      navigate(`/doctor-dashboard/${patient._id}`);
                    }}
                    className="px-6 py-4 flex gap-2 cursor-pointer"
                  >
                    <img
                      src={assets.profile_icon}
                      className="size-8"
                      alt="profile_icon"
                    />
                    <button className="relative inline-flex items-center text-gray-900 gap-3 hover:underline bg-transparent border-none p-0">
                      View Profile
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                      <input
                        onClick={() =>
                          toggleAppointment(
                            patient._id,
                            !patient.recentAppointment
                          )
                        }
                        type="checkbox"
                        checked={patient.recentAppointment}
                        className="sr-only peer "
                      />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                      <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                    </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointment;
