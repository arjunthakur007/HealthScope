import React from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import { assets } from "../assets/assets.js";

const Navbar = () => {
  const { loggedInStaff, logout, setShowLogin } = useAppContext();

  return (
    <div className="fixed top-0 left-0 right-0 w-full z-20 ">
      <nav className="bg-white border border-primary-dull/20 py-2 px-4 sm:px-6 md:px-8 lg:px-10">
        {" "}
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <NavLink to="/" className="flex items-center">
            <img className="h-9" src={assets.logo} alt="Clinic Logo" />
          </NavLink>

          <div className="flex items-center space-x-4 sm:space-x-6">
            {" "}
            {loggedInStaff ? (
              // If staff is logged in, show their profile info and a logout button
              <>
                <div className="hidden sm:flex items-center space-x-2 text-gray-800 font-medium">
                  {" "}
                  {/* Hidden on small screens */}
                  {/* Profile Icon (simplified for now) */}
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>
                    {loggedInStaff.firstName} ({loggedInStaff.role})
                  </span>
                </div>
                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="bg-primary hover:bg-primary-dull text-white font-semibold py-2 px-3 rounded-lg text-sm transition duration-300 ease-in-out"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
