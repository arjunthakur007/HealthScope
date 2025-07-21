  import React, { useState } from "react";
  import { useAppContext } from "../../context/AppContext";
  import { assets } from "../../assets/assets";
  import { NavLink, Outlet } from "react-router-dom";

  const ReceptionLayout = ({ children }) => {
    const { loggedInStaff, navigate, axios } = useAppContext();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const sidebarLinks = [
      {
        name: "Add New Patient",
        path: "/receptionist-dashboard",
        icon: assets.add_icon,
      },
      {
        name: "Patient List",
        path: "/receptionist-dashboard/patient-list",
        icon: assets.product_list_icon,
      },
      
    ];

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    return (
      <div className="flex h-screen bg-gray-100">
        {" "}
        <button
          onClick={toggleSidebar}
          type="button"
          className="fixed top-14 left-4 z-50 inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 "
        >
          <span className="sr-only">Open sidebar</span>
          <img src={assets.menu_icon} alt="menu" className="" />
        </button>
        {/* Sidebar */}
        <aside
          id="default-sidebar"
          className={`fixed left-0 z-40 w-64 transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0 h-[calc(100vh-80px)] top-20`}
        >
          <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
            {" "}
            {sidebarLinks.map((item) => (
              <NavLink
                to={item.path}
                key={item.name}
                end={item.path === "/receptionist-dashboard"}
                className={({ isActive }) => `flex items-center py-3 px-4 gap-3 
                              ${
                                isActive
                                  ? "border-r-4 md:border-r-[6px] hover:bg-primary-dull/30"
                                  : "hover:bg-gray-100/90 border-white text-gray-700"
                              }`}
              >
                {" "}
                <img src={item.icon} alt="" className="w-7 h-7" />
                <p className="block text-center">{item.name}</p>
              </NavLink>
            ))}
          </div>
        </aside>
        <div
          className={` p-4 pt-20 w-full h-[calc(100vh-80px)] overflow-y-auto transition-all duration-300 sm:ml-64 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          {/* <Outlet /> is here to render nested route content */}
          <Outlet />
        </div>
      </div>
    );
  };

  export default ReceptionLayout;
