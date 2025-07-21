import { DOCTOR_SPECIALTIES, Gender } from "../../assets/assets";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";

const AddPatient = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState(Gender[0]);
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [speciality, setSpeciality] = useState(DOCTOR_SPECIALTIES[0]);

  const { axios, fetchPatients } = useAppContext();

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const patientData = {
        name,
        description: description,
        gender,
        age: parseInt(age),
        email,
        phoneNumber: number,
        speciality,
      };

      const { data } = await axios.post("/api/patient/add", patientData);

      if (data.success) {
        toast.success(data.message);
        fetchPatients();

        setName("");
        setDescription("");
        setGender(Gender[0]);
        setAge("");
        setEmail("");
        setNumber("");
        setSpeciality(DOCTOR_SPECIALTIES[0]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div>
      {/* <!-- Main modal --> */}
      <div className="overflow-y-auto overflow-x-hidden flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* <!-- Modal content --> */}
          <div className="p-4 relative bg-white rounded-lg shadow-sm">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t  border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 ">
                Add New Patient
              </h3>
            </div>
            {/* <!-- Modal body --> */}
            <form onSubmit={handleSubmit} className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Add patient name"
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="gender"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    id="gender"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                    required
                  >
                    {Gender.map((gen, index) => (
                      <option key={index} value={gen}>
                        {gen}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="age"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Age
                  </label>
                  <input
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    type="number"
                    name="age"
                    id="age"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    placeholder="Patient's age"
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Type patient's email"
                  />
                </div>{" "}
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="number"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Phone Number
                  </label>
                  <input
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    type="text"
                    name="number"
                    id="number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Type patient's Phone Number"
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="speciality"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Speciality
                  </label>
                  <select
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    id="speciality"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                  >
                    {DOCTOR_SPECIALTIES.map((special, index) => (
                      <option key={index} value={special}>
                        {special}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Description of issue
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="description"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write problem description here"
                    required
                  ></textarea>
                </div>
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center bg-primary hover:bg-primary-dull focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                Add new patient
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;
