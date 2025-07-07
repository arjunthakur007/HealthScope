import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const PatientList = () => {
  const { axios, patients, navigate, fetchPatients } = useAppContext();

  const [openDropdownPatientId, setOpenDropdownPatientId] = useState(null);
  const dropdownRef = useRef(null);

  const toggleAppointment = async (id, recentAppointment) => {
    try {
      const { data } = await axios.post("/api/patient/appointment", {
        id,
        recentAppointment,
      });

      if (data.success) {
        fetchPatients();
        toast.success(data.message);
      } else {
        toast.error(data.message);
        fetchPatients();
      }
    } catch (error) {
      toast.error(error.message);
      fetchPatients();
    }
  };

  const handleDeletePatient = async (patientId) => {
    try {
      const { data } = await axios.delete(`/api/patient/remove/${patientId}`);

      if (data.success) {
        toast.success(data.message);
        fetchPatients(); // Re-fetch the list to update the UI
      } else {
        toast.error(data.message || "Failed to remove patient.");
      }
      setOpenDropdownPatientId(null); // Close the dropdown after action
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditClick = (e, patientId) => {
    e.preventDefault();
    setOpenDropdownPatientId(
      patientId === openDropdownPatientId ? null : patientId
    );
  };

  // Function to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdownPatientId &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdownPatientId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownPatientId]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-grow">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Patient name
              </th>
              <th scope="col" className="px-6 py-3">
                Department
              </th>
              <th scope="col" className="px-6 py-3">
                Token
              </th>
              <th scope="col" className="px-6 py-3">
                Today's appointment {/* Corrected apostrophe */}
              </th>
              <th scope="col" className="px-6 py-3">
                Bill Payment
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient._id}
                className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {patient.name}
                </th>
                <td className="px-6 py-4">{patient.speciality}</td>
                <td className="px-6 py-4">{patient.tokenNumber}</td>
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

                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      navigate(
                        `/receptionist-dashboard/payment/${patient._id}`
                      );
                    }}
                    onChange={() => {}}
                    className="hover:underline"
                  >
                    {" "}
                    View Bill
                  </button>
                </td>

                <td className="px-6 py-4 relative">
                  <a
                    href="#"
                    className="font-medium text-primary hover:underline"
                    onClick={(e) => handleEditClick(e, patient._id)}
                  >
                    Edit
                  </a>
                  {openDropdownPatientId === patient._id && (
                    <div
                      id={`dropdown-${patient._id}`}
                      ref={dropdownRef}
                      className="z-10 absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-sm"
                    >
                      <ul
                        className="p-3 space-y-1 text-sm text-gray-700"
                        aria-labelledby={`dropdownButton-${patient._id}`}
                      >
                        <li>
                          <div className="flex items-center p-2 rounded-sm">
                            <button
                              onClick={() => {
                                handleDeletePatient(patient._id);
                              }}
                              className="text-sm text-gray-900 font-medium rounded-sm hover:bg-red-300 p-2.5 w-full text-left" // Added w-full text-left for consistency
                            >
                              Remove from Patient list
                            </button>
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;
