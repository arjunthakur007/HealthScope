import React, { useState } from "react";
import { DOCTOR_SPECIALTIES } from "../../assets/assets";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const Registration = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const { axios } = useAppContext();

  const [selectedRole, setSelectedRole] = useState("receptionist");

  const [selectedspeciality, setSelectedspeciality] = useState("");

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    if (event.target.value !== "doctor") {
      setSelectedspeciality("");
    }
  };

  // Generic handle input change function for text/number/email/password inputs
  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  // Handle speciality dropdown change
  const handlespecialityChange = (event) => {
    setSelectedspeciality(event.target.value);
  };

  // Handle checkbox change
  const handleTermsChange = (event) => {
    setAgreeToTerms(event.target.checked);
  };

  // Form submission handler
  const handleSubmit = async (event) => {
    try {
      event.preventDefault(); // Prevent default form submission

      // Basic client-side validation
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      if (!agreeToTerms) {
        toast.error("You must agree to the terms and conditions!");
        return;
      }
      if (selectedRole === "doctor" && !selectedspeciality) {
        toast.error("Please select a speciality for the doctor role.");
        return;
      }

      // Prepare form data according to your backend Staff model
      const registrationData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        role: selectedRole,
        speciality: selectedRole === "doctor" ? selectedspeciality : null, // Only send speciality if role is doctor
        password,
      };

      // Send the data to your backend API using Axios
      const { data } = await axios.post(
        "/api/admin/register",
        registrationData
      );

      if (data.success) {
        toast.success(data.message || "Registration successful!");
        // Clear all form fields on successful registration
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
        setPassword("");
        setConfirmPassword("");
        setSelectedRole("receptionist"); // Reset role to default
        setSelectedspeciality(""); // Clear speciality
        setAgreeToTerms(false);
      } else {
        toast.error(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration submission error:", error); // Log full error for debugging
      toast.error(
        error.response?.data?.message ||
          "An error occurred during registration. Please try again."
      );
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-neutral-100">
      {" "}
      <div className="w-full max-w-4xl mx-auto">
        {" "}
        <div className="mt-2 ml-1 sm:mt-4 sm:ml-2 md:mt-5 md:ml-3 lg:mt-5 lg:ml-3">
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-primary-dull text-center mb-6">
            {" "}
            Staff Registration
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg w-full max-w-2xl mx-auto"
        >
          {" "}
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            {/* First Name */}
            <div>
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-neutral-900 "
              >
                First name
              </label>
              <input
                type="text"
                id="first_name"
                className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg block w-full p-2.5 "
                placeholder="Enter"
                value={firstName}
                onChange={handleInputChange(setFirstName)}
                required
              />
            </div>
            {/* Last Name */}
            <div>
              <label
                htmlFor="last_name"
                className="block mb-2 text-sm font-medium text-neutral-900 "
              >
                Last name
              </label>
              <input
                type="text"
                id="last_name"
                className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg block w-full p-2.5"
                placeholder="Enter"
                value={lastName}
                onChange={handleInputChange(setLastName)}
                required
              />
            </div>

            {/* Email Address */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-neutral-900 "
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg  block w-full p-2.5 "
                placeholder="john.doe@company.com"
                value={email}
                onChange={handleInputChange(setEmail)}
                required
              />
            </div>
            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-neutral-900 "
              >
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg  block w-full p-2.5"
                placeholder="123-45-678"
                value={phoneNumber}
                onChange={handleInputChange(setPhoneNumber)}
                required
              />
            </div>
            {/* Role*/}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 ">
                Role
              </label>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Receptionist Radio Button */}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="role-receptionist"
                    name="staff-role" // Important: Same name for radio group
                    value="receptionist"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    required
                    checked={selectedRole === "receptionist"} // Controlled component
                    onChange={handleRoleChange}
                  />
                  <label
                    htmlFor="role-receptionist"
                    className="ml-2 text-sm font-medium text-gray-700 "
                  >
                    Receptionist
                  </label>
                </div>
                {/* Doctor Radio Button */}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="role-doctor"
                    name="staff-role" // Important: Same name for radio group
                    value="doctor"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    required
                    checked={selectedRole === "doctor"} // Controlled component
                    onChange={handleRoleChange}
                  />
                  <label
                    htmlFor="role-doctor"
                    className="ml-2 text-sm font-medium text-gray-700 "
                  >
                    Doctor
                  </label>
                </div>
              </div>
            </div>
            {/* Speciality  */}
            <div>
              <label
                htmlFor="visitors"
                className="block mb-2 text-sm font-medium text-neutral-900 "
              >
                Speciality: For doctors only
              </label>
              <select
                id="speciality"
                name="speciality"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                disabled={selectedRole !== "doctor"} // Disable if not a doctor
                required={selectedRole === "doctor"}
                value={selectedspeciality}
                onChange={handlespecialityChange}
              >
                <option value="">Select speciality</option>{" "}
                {DOCTOR_SPECIALTIES.map((speciality, index) => (
                  <option key={index} value={speciality}>
                    {speciality}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-neutral-900 "
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg  block w-full p-2.5 "
              placeholder="•••••••••"
              value={password}
              onChange={handleInputChange(setPassword)}
              required
            />
          </div>
          {/* Confirm Password */}
          <div className="mb-6">
            <label
              htmlFor="confirm_password"
              className="block mb-2 text-sm font-medium text-neutral-900 "
            >
              Confirm password
            </label>
            <input
              type="password"
              id="confirm_password"
              className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:focus:border-blue-500 block w-full p-2.5 "
              placeholder="•••••••••"
              value={confirmPassword}
              onChange={handleInputChange(setConfirmPassword)}
              required
            />
          </div>
          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                value=""
                className="w-4 h-4 "
                checked={agreeToTerms}
                onChange={handleTermsChange}
                required
              />
            </div>
            <label
              htmlFor="remember"
              className="ms-2 text-sm font-medium text-neutral-900"
            >
              I agree with the{" "}
              <a href="#" className="text-primary-dull hover:underline ">
                terms and conditions
              </a>
              .
            </label>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className=" w-full text-white bg-primary hover:bg-primary-dull focus:ring-4 focus:outline-none p-2.5 rounded-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
