import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import patientService from "../../Services/DoctorService/patientService"; // Adjust the path to your patientService file

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await patientService.getAllPatients();
        setPatients(response.data); // Assuming response.data is the array of patients
        setTotalPages(Math.ceil(response.data.length / recordsPerPage));
      } catch (err) {
        setError("Failed to load patients. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [recordsPerPage]);

  // Filter patients based on search
  const filteredPatients = patients.filter((p) =>
    p.userID?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate patients
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedPatients = filteredPatients.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle records per page change
  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Placeholder for action buttons
  const handleView = (id) => {
    console.log("View patient:", id);
    // Implement view logic (e.g., navigate to patient details page)
  };

  const handleEdit = (id) => {
    console.log("Edit patient:", id);
    // Implement edit logic
  };

  const handleDelete = (id) => {
    console.log("Delete patient:", id);
    // Implement delete logic (e.g., call API to delete patient)
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Patients List</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Patient
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <label htmlFor="recordsPerPage">Display</label>
          <select
            id="recordsPerPage"
            className="border px-2 py-1 rounded"
            value={recordsPerPage}
            onChange={handleRecordsPerPageChange}
          >
            <option value={12}>12</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>Records Per Page</span>
        </div>

        <div>
          <label className="mr-2">Search:</label>
          <input
            type="text"
            placeholder="Search by name..."
            className="border border-gray-300 rounded px-3 py-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && <p className="text-center py-4">Loading...</p>}
      {error && <p className="text-center py-4 text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">No.</th>
                <th className="px-4 py-2 text-left">Patient Name</th>
                <th className="px-4 py-2 text-left">Gender</th>
                <th className="px-4 py-2 text-left">Age</th>
                <th className="px-4 py-2 text-left">Blood Group</th>
                <th className="px-4 py-2 text-left">Treatment</th>
                <th className="px-4 py-2 text-left">Mobile</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.map((p, index) => {
                // Calculate age from dob
                const dob = new Date(p.dob);
                const age = Math.floor(
                  (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365)
                );

                return (
                  <tr
                    key={p._id}
                    className="border-t hover:bg-gray-50 transition-all"
                  >
                    <td className="px-4 py-2">{p.personalID || "N/A"}</td>
                    <td className="px-4 py-2 flex items-center gap-2">
                      <img
                        src={`https://randomuser.me/api/portraits/${
                          p.gender === "Male" ? "men" : "women"
                        }/${index + 1}.jpg`} // Placeholder avatar
                        alt={p.userID?.name || "N/A"}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{p.userID?.name || "N/A"}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.gender === "Male"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {p.gender || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-2">{age || "N/A"}</td>
                    <td className="px-4 py-2">N/A</td>{" "}
                    {/* Blood group not in API */}
                    <td className="px-4 py-2">N/A</td>{" "}
                    {/* Treatment not in API */}
                    <td className="px-4 py-2">{p.contactPhones[0] || "N/A"}</td>
                    <td className="px-4 py-2">{p.contactEmails[0] || "N/A"}</td>
                    <td className="px-4 py-2">N/A</td>{" "}
                    {/* Address not in API */}
                    <td className="px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1 border border-red-500 text-red-500 rounded hover:bg-red-100"
                        title="Delete"
                      >
                        <FaTrash size={12} />
                      </button>
                      <button
                        onClick={() => handleEdit(p._id)}
                        className="p-1 border border-green-500 text-green-500 rounded hover:bg-green-100"
                        title="Edit"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleView(p._id)}
                        className="p-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-100"
                        title="View"
                      >
                        <FaEye size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginatedPatients.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-gray-500">
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && filteredPatients.length > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <p>
            Showing Page <strong>{currentPage}</strong> of{" "}
            <strong>{totalPages}</strong>
          </p>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
