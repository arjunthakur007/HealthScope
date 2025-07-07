import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

const PatientLog = ({ patient }) => {
  const { navigate, axios, patients, fetchPatients } = useAppContext();

  const [openDropdownPatientId, setOpenDropdownPatientId] = useState(null);
  const dropdownRef = useRef(null);

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
  }, [openDropdownPatientId]); // ADDED openDropdownPatientId to dependency array

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
                User ID
              </th>
              <th scope="col" className="px-6 py-3">
                Profile
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
                <td className="px-6 py-4">{patient._id}</td>

                <td
                  onClick={() => {
                    navigate(`/doctor-dashboard/${patient._id}`);
                    scrollTo(0, 0);
                  }}
                  className="px-6 py-4 flex gap-2"
                >
                  <img
                    src={assets.profile_icon}
                    className="size-8"
                    alt="profile_icon"
                  />
                  <button className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3 hover:underline">
                    View Profile
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

export default PatientLog;
