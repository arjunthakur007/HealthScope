import { useAppContext } from "../context/AppContext.jsx";


const Homepage = () => {
  const { setShowLogin, loggedInStaff } = useAppContext();
  return (
    <div className="fixed top-0 left-0 right-0 h-lvh flex flex-col sm:flex-row items-center justify-center text-md text-gray-600 px-4 sm:px-0">
      <button
        onClick={() => setShowLogin(true)}
        type="button"
        className="cursor-pointer text-blue-50 focus:outline-none bg-primary rounded-lg hover:bg-primary-dull hover:text-white py-2.5 px-5 me-2 mb-2 text-md font-medium"
      >
        Login
      </button>
    </div>
  );
};

export default Homepage;
