import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import doctorService from "../../Services/ManagerService/doctorService";

const ManagerDoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view' or 'update'
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getAllDoctors();
        console.log("Doctors data:", data);
        const validDoctors = Array.isArray(data)
          ? data.filter(
              (doctor) => doctor && typeof doctor === "object" && doctor._id
            )
          : [];
        setDoctors(validDoctors);
        setFilteredDoctors(validDoctors);
      } catch (error) {
        console.error(
          "Error fetching doctors:",
          error.response?.data || error.message
        );
        setError("Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.");
        toast.error("Không thể tải danh sách bác sĩ.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Search functionality
  useEffect(() => {
    const results = doctors.filter((doctor) =>
      doctor?.userID?.name && typeof doctor.userID.name === "string"
        ? doctor.userID.name.toLowerCase().includes(searchTerm.toLowerCase())
        : false
    );
    setFilteredDoctors(results);
  }, [searchTerm, doctors]);

  // Fetch doctor details
  const handleViewDetails = async (id) => {
    console.log("Clicked View Details for doctor ID:", id);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setModalError("Vui lòng đăng nhập để xem chi tiết.");
        setModalMode("view");
        toast.error("Vui lòng đăng nhập để xem chi tiết.");
        return;
      }
      const response = await doctorService.getDoctorById(id, token); // Include token
      console.log("Doctor details response:", response);
      const doctorData = response.data; // Extract the 'data' field
      if (!doctorData || !doctorData.userID) {
        throw new Error("Dữ liệu bác sĩ không hợp lệ hoặc không tồn tại.");
      }
      setSelectedDoctor(doctorData);
      setModalMode("view");
      setModalError("");
      toast.success("Đã tải chi tiết bác sĩ!");
    } catch (error) {
      console.error(
        "Error fetching doctor details:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.status === 404
          ? "Bác sĩ không tồn tại."
          : error.response?.status === 401
          ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          : "Không thể tải chi tiết bác sĩ. Vui lòng thử lại.";
      setModalError(errorMessage);
      setModalMode("view"); // Open modal to show error
      setSelectedDoctor(null);
      toast.error(errorMessage);
    }
  };

  // Open update modal
  const handleUpdate = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.userID?.name || "",
      email: doctor.userID?.email || "",
      phone: doctor.userID?.phone || "",
      room: doctor.room || "",
      specializations: doctor.specializations || "",
      degrees: doctor.degrees || "",
      experiences: Array.isArray(doctor.experiences) ? doctor.experiences : [],
    });
    setModalMode("update");
    setModalError("");
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle experiences input (comma-separated)
  const handleExperiencesChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      experiences: value
        ? value
            .split(",")
            .map((exp) => exp.trim())
            .filter((exp) => exp)
        : [],
    }));
  };

  // Submit update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setModalError("Vui lòng đăng nhập để cập nhật.");
        toast.error("Vui lòng đăng nhập để cập nhật.");
        return;
      }
      const updateData = {
        userID: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        room: formData.room,
        specializations: formData.specializations,
        degrees: formData.degrees,
        experiences: formData.experiences,
      };
      await doctorService.updateDoctorById(
        selectedDoctor._id,
        updateData,
        token
      );
      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === selectedDoctor._id ? { ...doc, ...updateData } : doc
        )
      );
      setFilteredDoctors((prev) =>
        prev.map((doc) =>
          doc._id === selectedDoctor._id ? { ...doc, ...updateData } : doc
        )
      );
      setModalMode(null);
      setSelectedDoctor(null);
      toast.success("Cập nhật bác sĩ thành công!");
    } catch (error) {
      console.error(
        "Error updating doctor:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.status === 401
          ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          : "Không thể cập nhật bác sĩ. Vui lòng thử lại.";
      setModalError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Close modal
  const closeModal = () => {
    setModalMode(null);
    setSelectedDoctor(null);
    setModalError("");
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    room: "",
    specializations: "",
    degrees: "",
    experiences: [],
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4 text-lg font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-6 bg-gray-50">
      <div className="container mx-auto">
        <div className="bg-white rounded-2xl shadow-xl">
          <div className="bg-gradient-to-r from-teal-700 to-teal-500 p-6 rounded-t-2xl">
            <h2 className="text-3xl font-bold text-white">Danh sách Bác sĩ</h2>
          </div>
          <div className="p-6">
            {/* Search Bar */}
            <div className="relative max-w-md mb-6">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên bác sĩ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Doctor List */}
            {filteredDoctors.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg shadow-sm text-gray-500 text-lg">
                Không tìm thấy bác sĩ nào.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors
                  .filter((doctor) => doctor.userID)
                  .map((doctor) => (
                    <div
                      key={doctor._id}
                      className="bg-white p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      <h3 className="text-xl font-semibold text-teal-600 mb-2">
                        {doctor.userID?.name || "Không rõ tên"}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p>
                          <span className="font-medium text-gray-900">
                            Email:
                          </span>{" "}
                          {doctor.userID?.email || "Không có email"}
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">
                            Điện thoại:
                          </span>{" "}
                          {doctor.userID?.phone || "Không có số"}
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">
                            Phòng:
                          </span>{" "}
                          {doctor.room || "Không rõ"}
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">
                            Chuyên môn:
                          </span>{" "}
                          {doctor.specializations || "Không rõ"}
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">
                            Bằng cấp:
                          </span>{" "}
                          {doctor.degrees || "Không rõ"}
                        </p>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-800 mb-1">
                          Kinh nghiệm:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(doctor.experiences) &&
                          doctor.experiences.length > 0 ? (
                            doctor.experiences.map((exp, index) => (
                              <span
                                key={index}
                                className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-1 rounded-full"
                              >
                                {exp}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">
                              Không có
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 border-t pt-3 text-xs text-gray-500">
                        Tạo bởi: {doctor.createdBy?.email || "Không rõ"}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleViewDetails(doctor._id)}
                          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors cursor-pointer"
                        >
                          Xem chi tiết
                        </button>
                        {/* <button
                          onClick={() => handleUpdate(doctor)}
                          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors cursor-pointer"
                        >
                          Cập nhật
                        </button> */}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for View Details and Update */}
      {modalMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-teal-600 mb-4">
              {modalMode === "view" ? "Chi tiết Bác sĩ" : "Cập nhật Bác sĩ"}
            </h3>
            {modalError && (
              <div className="text-red-600 mb-4">{modalError}</div>
            )}
            {modalMode === "view" && selectedDoctor ? (
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium text-gray-900">Tên:</span>{" "}
                  {selectedDoctor.userID?.name || "Không rõ"}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Email:</span>{" "}
                  {selectedDoctor.userID?.email || "Không rõ"}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Điện thoại:</span>{" "}
                  {selectedDoctor.userID?.phone || "Không rõ"}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Phòng:</span>{" "}
                  {selectedDoctor.room || "Không rõ"}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Chuyên môn:</span>{" "}
                  {selectedDoctor.specializations || "Không rõ"}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Bằng cấp:</span>{" "}
                  {selectedDoctor.degrees || "Không rõ"}
                </p>
                <p>
                  <span className="font-medium text-gray-900">
                    Kinh nghiệm:
                  </span>{" "}
                  {Array.isArray(selectedDoctor.experiences) &&
                  selectedDoctor.experiences.length > 0
                    ? selectedDoctor.experiences.join(", ")
                    : "Không có"}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Tạo bởi:</span>{" "}
                  {selectedDoctor.createdBy?.email || "Không rõ"}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Avatar:</span>{" "}
                  {selectedDoctor.avatarURL ? (
                    <img
                      src={selectedDoctor.avatarURL}
                      alt="Doctor Avatar"
                      className="w-16 h-16 rounded-full mt-2"
                    />
                  ) : (
                    "Không có"
                  )}
                </p>
              </div>
            ) : modalMode === "update" ? (
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Điện thoại
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phòng
                  </label>
                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Chuyên môn
                  </label>
                  <input
                    type="text"
                    name="specializations"
                    value={formData.specializations}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bằng cấp
                  </label>
                  <input
                    type="text"
                    name="degrees"
                    value={formData.degrees}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kinh nghiệm (phân cách bằng dấu phẩy)
                  </label>
                  <textarea
                    name="experiences"
                    value={formData.experiences.join(", ")}
                    onChange={handleExperiencesChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-gray-700">Không có dữ liệu để hiển thị.</div>
            )}
            {modalMode === "view" && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDoctorList;
