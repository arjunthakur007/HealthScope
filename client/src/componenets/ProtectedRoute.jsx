// // components/ProtectedRoute.jsx
// import { useAppContext } from "../context/AppContext";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { loggedInStaff } = useAppContext();

//   if (loggedInStaff === null) {
//     // Still checking auth - don't render anything yet (no flicker)
//     return null;
//   }

//   if (!loggedInStaff || (allowedRoles && !allowedRoles.includes(loggedInStaff.role))) {
//     return <Navigate to="/" />;
//   }

//   return children;
// };

// export default ProtectedRoute;
