import React, { useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import { useEffect } from "react";

const Login = () => {
  const {
   
    axios,
    setShowLogin,
    navigate,
    fetchStaff,
    setLoggedInStaff,
  } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // Handle form submission for login
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const { data } = await axios.post("/api/staff/login", {
        email,
        password,
      });

      if (data.success) {
        setTimeout(async () => {
          const actualUserRole = data.staff.role;

          // await setLoggedInStaff(data.staff);
          await fetchStaff();

          if (actualUserRole === "receptionist") {
            navigate("/receptionist-dashboard");
          } else if (actualUserRole === "doctor") {
            navigate("/doctor-dashboard");
          } else {
            console.warn(
              "Logged in user has an unhandled role:",
              actualUserRole
            );
          }

          toast.success(data.message || "Logged in successfully!");

          setShowLogin(false);
        }, 100);
      } else {
        toast.error(data.message);
        setPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setPassword("");
    }
  };

  return (
    // This div takes up the full screen
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4 sm:p-6 md:p-8"
    >
      <div
        onClick={handleModalContentClick}
        className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto bg-neutral-50 rounded-lg shadow-xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-neutral-200 ">
          <h3 className="flex text-xl font-semibold text-neutral-500">
            Please Sign in{" "}
            <div className="text-primary ml-1"> (for Staff only!)</div>
          </h3>
          <button
            type="button"
            className="text-neutral-400 bg-transparent hover:bg-neutral-200 hover:text-neutral-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
            onClick={() => setShowLogin(false)}
            aria-label="Close modal"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {/* Modal Body with form */}
        <div className="p-4 md:p-5 overflow-y-auto max-h-[80vh]">
          {" "}
          <form onSubmit={handleSubmit} className="space-y-4" action="#">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-neutral-900"
              >
                Your Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-neutral-900"
              >
                Your password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember Me & Lost Password */}
            <div className="flex justify-between items-center">
              {" "}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 border border-neutral-300 rounded-sm bg-neutral-50 "
                    required
                  />
                </div>
                <label
                  htmlFor="remember"
                  className="ms-2 text-sm font-medium text-neutral-900 "
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-primary-dull hover:underline "
              >
                Lost Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full text-white bg-primary hover:bg-primary-dull font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Login to your account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
