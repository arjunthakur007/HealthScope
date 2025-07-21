import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { NavLink, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const PatientProfile = () => {
  const { patientId } = useParams();

  const { patient, setPatient, axios, navigate } = useAppContext();

  // States for the editable treatment fields
  const [isEditingTreatment, setIsEditingTreatment] = useState(false);
  const [treatmentGiven, setTreatmentGiven] = useState("");
  const [testResults, setTestResults] = useState("");
  const [medication, setMedication] = useState("");

  // Local state to hold the fetched treatments (populated via patient object)
  const [patientTreatments, setPatientTreatments] = useState([]);

  const fetchPatientDetails = async () => {
    try {
      const { data } = await axios.get(`/api/patient/${patientId}`);
      if (data.success) {
        setPatient(data.patient);

        // Get treatments from the data and sort by date
        const sortedTreatments = data.patient.treatments
          ? [...data.patient.treatments].sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            )
          : [];
        setPatientTreatments(sortedTreatments);
        setTreatmentGiven("");
        setTestResults("");
        setMedication("");
      } else {
        toast.error(data.message || "Failed to fetch patient profile.");
        setPatient(null);
        setPatientTreatments([]);
      }
    } catch (error) {
      console.error("Error fetching patient profile:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred while fetching profile."
      );
      setPatient(null);
      setPatientTreatments([]);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatientDetails();
    }
  }, [patientId, axios, setPatient]);

  // --- Handle saving the treatment details (now adds a NEW treatment record) ---
  const handleSaveTreatment = async () => {
    console.log("patientId from useParams() before API call:", patientId);
    try {
      if (!treatmentGiven.trim() && !testResults.trim() && !medication.trim()) {
        toast.error("Please enter at least one treatment detail.");
        return;
      }

      // Call the NEW backend API for adding a treatment record
      const { data } = await axios.post(
        `/api/patient/treatment/add/${patientId}`,
        {
          testGiven: treatmentGiven.trim(),
          testResults: testResults.trim(),
          medication: medication.trim(),
        }
      );

      if (data.success) {
        toast.success(data.message || "Treatment details saved successfully!");
        setIsEditingTreatment(false); // Exit edit mode

        // IMPORTANT: Re-fetch patient details to get the updated list of treatments
        fetchPatientDetails();
      } else {
        toast.error(data.message || "Failed to save treatment details.");
      }
    } catch (error) {
      console.error("Error saving treatment details:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save treatment details."
      );
    }
  };

  // --- Conditional rendering for when patient data is not yet loaded or not found ---
  if (!patient) {
    return (
      <div className="p-6 text-center rounded-lg shadow-md my-8 bg-orange-50 text-orange-800 border border-orange-300 max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-2">Patient Not Found</h3>
        <p className="mb-4">
          No patient data could be loaded for ID: {patientId}.
        </p>
        <NavLink
          to="/doctor-dashboard/patient-log"
          className="text-blue-600 hover:underline font-medium"
        >
          Back to Patient Log
        </NavLink>
      </div>
    );
  }

  return (
    <div>
      <div className="no-scrollbar flex flex-col flex-1 justify-between h-[95vh] overflow-y-scroll">
        <div className="w-full md:p-10 p-4">
          <div className="pb-4">
            <NavLink
              to={"/doctor-dashboard/patient-log"}
              className="pb-4 text-primary hover:underline"
            >
              Back to Patient Log
            </NavLink>
          </div>
          <h2 className="pb-4 text-2xl font-semibold text-gray-800">
            Patient Profile
          </h2>

          <div className="flex flex-col items-center max-w-4xl w-full mx-auto rounded-md bg-white border border-gray-500/20 shadow-md p-6 md:p-8">
            {/* Section: Personal Details (now includes Token Number and Description) */}
            <div className="w-full mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600">
                    Full Name:
                  </span>
                  <span className="truncate">{patient.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600">Age:</span>
                  <span>{patient.age} years</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600">Gender:</span>
                  <span>{patient.gender}</span>
                </div>
                {/* Token Number moved here */}
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600">
                    Token Number:
                  </span>
                  <span className="text-blue-600 text-xl font-bold">
                    {patient.tokenNumber}
                  </span>
                </div>
              </div>

              {/* Description moved here, under Personal Details */}
              <div className="flex flex-col mt-4">
                <span className="font-semibold text-gray-600">
                  Description/Reason for Visit:
                </span>
                <p className="bg-gray-50 p-3 rounded-md border border-gray-200 mt-1 whitespace-pre-wrap">
                  {patient.description}
                </p>
              </div>
            </div>

            {/* Section: Patient Treatment Details (Editable - for NEW/LATEST entry) */}
            <div className="w-full mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex justify-between items-center">
                <span>Add New Treatment / Latest Treatment</span>
                <div>
                  {!isEditingTreatment ? (
                    <button
                      onClick={() => setIsEditingTreatment(true)}
                      className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    >
                      Edit / Add New
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveTreatment}
                      className="px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Save
                    </button>
                  )}
                </div>
              </h3>
              <div className="grid grid-cols-1 gap-y-4 text-sm text-gray-700">
                {/* Test Given */}
                <div className="flex flex-col">
                  <label
                    htmlFor="treatmentGiven"
                    className="font-semibold text-gray-600 mb-1"
                  >
                    Test(s) Given:
                  </label>
                  {!isEditingTreatment ? (
                    <p className="bg-gray-50 p-3 rounded-md border border-gray-200 whitespace-pre-wrap">
                      {treatmentGiven || "N/A"}
                    </p>
                  ) : (
                    <textarea
                      id="treatmentGiven"
                      value={treatmentGiven}
                      onChange={(e) => setTreatmentGiven(e.target.value)}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter tests given..."
                    ></textarea>
                  )}
                </div>

                {/* Test Results */}
                <div className="flex flex-col">
                  <label
                    htmlFor="testResults"
                    className="font-semibold text-gray-600 mb-1"
                  >
                    Test Results:
                  </label>
                  {!isEditingTreatment ? (
                    <p className="bg-gray-50 p-3 rounded-md border border-gray-200 whitespace-pre-wrap">
                      {testResults || "N/A"}
                    </p>
                  ) : (
                    <textarea
                      id="testResults"
                      value={testResults}
                      onChange={(e) => setTestResults(e.target.value)}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter test results..."
                    ></textarea>
                  )}
                </div>

                {/* Medication */}
                <div className="flex flex-col">
                  <label
                    htmlFor="medication"
                    className="font-semibold text-gray-600 mb-1"
                  >
                    Medication:
                  </label>
                  {!isEditingTreatment ? (
                    <p className="bg-gray-50 p-3 rounded-md border border-gray-200 whitespace-pre-wrap">
                      {medication || "N/A"}
                    </p>
                  ) : (
                    <textarea
                      id="medication"
                      value={medication}
                      onChange={(e) => setMedication(e.target.value)}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter medication prescribed..."
                    ></textarea>
                  )}
                </div>
              </div>
            </div>

            {/* Section: Appointment & Medical Details */}
            <div className="w-full mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Appointment Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600">
                    Speciality/Department:
                  </span>
                  <span>{patient.speciality}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600">
                    Scheduled for Today:
                  </span>
                  <span
                    className={`font-semibold ${
                      patient.recentAppointment
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {patient.recentAppointment ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* --- Display History of Treatments (Last 3 entries) --- */}
            {patientTreatments.length > 0 && (
              <div className="w-full mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Treatment History (Latest 3)
                </h3>
                <div className="space-y-4">
                  {/* Use slice(-3) to get the last 3 elements, then map */}
                  {patientTreatments.slice(0, 3).map(
                    (
                      entry,
                      index // Changed to slice(0,3) as treatments are already sorted latest first
                    ) => (
                      <div
                        key={entry._id || index} // Use _id for key if available, fallback to index
                        className="bg-gray-50 p-4 rounded-md border border-gray-200 shadow-sm"
                      >
                        <p className="text-gray-800 font-medium">
                          Treatment Date:{" "}
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                        {entry.testGiven && (
                          <p className="mt-2 text-gray-700">
                            <strong>Tests:</strong> {entry.testGiven}
                          </p>
                        )}
                        {entry.testResults && (
                          <p className="text-gray-700">
                            <strong>Results:</strong> {entry.testResults}
                          </p>
                        )}
                        {entry.medication && (
                          <p className="text-gray-700">
                            <strong>Medication:</strong> {entry.medication}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
            {/* --- END Display History of Treatments --- */}

            {/* Action Buttons */}
            <div className="w-full mt-8 flex justify-end space-x-4">
              <button
                className="px-6 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                // onClick={() => handleEditProfile(patient._id)} // Example action
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
