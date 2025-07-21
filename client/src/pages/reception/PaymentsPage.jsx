import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const PaymentsPage = () => {
  const { patientId } = useParams();
  const { patient, setPatient, axios, navigate } = useAppContext();
  const [payments, setPayments] = useState([]);

  // States for "Add New Charge" form
  const [newAmount, setNewAmount] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [addingCharge, setAddingCharge] = useState(false);

  // States for "Update Payment Status" functionality
  const [updatingPaymentId, setUpdatingPaymentId] = useState(null);


  const fetchPatientAndPaymentsData = async () => {
    try {
      
      const patientRes = await axios.get(`/api/patient/${patientId}`);
      setPatient(patientRes.data.patient);

     
      const paymentsRes = await axios.get(`/api/payments/patient/${patientId}`);
      setPayments(paymentsRes.data.payments);

    } catch (err) {
      console.error("Failed to fetch patient or payment data:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to load patient or payment data.");
      setPatient(null);
      setPayments([]);
    }
  };

  // --- UseEffect Hook to Trigger Data Fetch on Component Mount/patientId Change ---
  useEffect(() => {
    if (patientId) {
      fetchPatientAndPaymentsData();
    }
  }, [patientId, setPatient, axios]);


  // --- Function to Handle Adding a New Charge (Reusable) ---
  const handleAddCharge = async (e) => {
    e.preventDefault();
    setAddingCharge(true);

    // Basic client-side validation
    if (!newAmount || isNaN(parseFloat(newAmount)) || parseFloat(newAmount) <= 0) {
      toast.error("Amount must be a positive number.");
      setAddingCharge(false);
      return;
    }
    if (!newDescription.trim()) {
      toast.error("Description cannot be empty.");
      setAddingCharge(false);
      return;
    }

    try {
      const response = await axios.post(`/api/payments`, {
          patientId: patientId,
          amount: parseFloat(newAmount),
          description: newDescription.trim(),
          status: 'pending',
          paymentMethod: 'unpaid'
      });

      setNewAmount('');
      setNewDescription('');
      toast.success(response.data.message || "Charge added successfully!");

      await fetchPatientAndPaymentsData();

    } catch (err) {
      console.error("Error adding charge:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to add charge.");
    } finally {
      setAddingCharge(false);
    }
  };


  // --- Function to Handle Updating Payment Status/Method (Reusable) ---
  const handleUpdatePayment = async (paymentIdToUpdate, newStatus, newPaymentMethod) => {
    setUpdatingPaymentId(paymentIdToUpdate);

    const updatePayload = {};
    if (newStatus) updatePayload.status = newStatus;
    if (newPaymentMethod) updatePayload.paymentMethod = newPaymentMethod;

    if (Object.keys(updatePayload).length === 0) {
      toast.error("No fields provided for update.");
      setUpdatingPaymentId(null);
      return;
    }

    try {
      const response = await axios.patch(`/api/payments/${paymentIdToUpdate}`, updatePayload);

      toast.success(response.data.message || "Payment updated successfully!");
      await fetchPatientAndPaymentsData();

    } catch (err) {
      console.error("Error updating payment:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to update payment.");
    } finally {
      setUpdatingPaymentId(null);
    }
  };


  // --- Conditional Rendering for Not Found State (Crucial) ---
  if (!patient) {
    return (
      <div className="p-6 text-center rounded-lg shadow-md my-8 bg-orange-50 text-orange-800 border border-orange-300 max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-2">Patient Not Found</h3>
        <p className="mb-4">No patient data could be loaded for ID: {patientId}.</p>
        <button
          onClick={() => navigate("/receptionist-dashboard/patient-list")} 
          className="text-blue-600 hover:underline font-medium bg-transparent border-none cursor-pointer p-0"
        >
          Go back to Patient List
        </button>
      </div>
    );
  }


  // --- Main Render for Payment Page ---
  return (
    <div className="min-h-screen flex flex-col p-4"> 
      <div className="max-w-5xl mx-auto w-full"> 
        <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-6">
          Payment Section for {patient.name}
        </h1>
        <p className="text-lg mb-2 text-gray-700">
          <strong className="font-semibold">Token:</strong> {patient.tokenNumber}
        </p>
        <p className="text-lg mb-6 text-gray-700">
          <strong className="font-semibold">Age:</strong> {patient.age}, <strong className="font-semibold">Gender:</strong> {patient.gender}
        </p>
        
        <button
          onClick={() => navigate(`/receptionist-dashboard/patient-list`)}
          className="mb-8 inline-block text-blue-600 hover:underline font-medium bg-transparent border-none cursor-pointer p-0"
        >
          Back to Patient List
        </button>

        {/* --- Payment History Section --- */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Payment History</h2>
        {payments.length === 0 ? (
          <p className="italic text-gray-600">No payments recorded for this patient yet.</p>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-grow"> 
            <table className="w-full text-sm text-left rtl:text-right text-gray-500"> 
              <thead className="text-xs text-gray-700 uppercase bg-gray-50"> 
                <tr>
                  <th scope="col" className="px-6 py-3">Date</th> 
                  <th scope="col" className="px-6 py-3">Description</th>
                  <th scope="col" className="px-6 py-3">Amount (INR)</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Method</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={payment._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}> 
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{new Date(payment.createdAt).toLocaleDateString()}</td> 
                    <td className="px-6 py-4">{payment.description}</td>
                    <td className="px-6 py-4">{payment.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        payment.status === "paid" ? "bg-green-100 text-green-800" :
                        (payment.status === "refunded" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800")
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{payment.paymentMethod}</td>
                    <td className="px-6 py-4">
                      {payment.status === 'pending' && (
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleUpdatePayment(payment._id, 'paid', 'Cash')}
                            disabled={updatingPaymentId === payment._id}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                              updatingPaymentId === payment._id ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {updatingPaymentId === payment._id ? 'Paying...' : 'Mark Paid (Cash)'}
                          </button>
                          <button
                            onClick={() => handleUpdatePayment(payment._id, 'refunded', payment.paymentMethod)}
                            disabled={updatingPaymentId === payment._id}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                              updatingPaymentId === payment._id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            {updatingPaymentId === payment._id ? 'Refunding...' : 'Refund'}
                          </button>
                        </div>
                      )}
                      {(payment.status === 'paid' || payment.status === 'refunded') && (
                        <span className="text-gray-500 text-sm italic">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <hr className="my-10 border-t border-gray-300" />

        {/* --- Add New Charge Section --- */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Charge</h2>
        <form onSubmit={handleAddCharge} className="flex flex-col gap-4 p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
          <div>
            <label htmlFor="newAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (INR):
            </label>
            <input
              type="number"
              id="newAmount"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              required
              min="1"
              step="0.01" // Allow decimal amounts
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={addingCharge}
              placeholder="e.g., 500.00"
            />
          </div>
          <div>
            <label htmlFor="newDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description:
            </label>
            <input
              type="text"
              id="newDescription"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={addingCharge}
              placeholder="e.g., Blood Test, Medication"
            />
          </div>
          <button
            type="submit"
            disabled={addingCharge}
            className={`px-5 py-2 rounded-md text-white font-semibold transition-colors duration-200 self-start ${
              addingCharge ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {addingCharge ? 'Adding Charge...' : 'Add Charge'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentsPage;
