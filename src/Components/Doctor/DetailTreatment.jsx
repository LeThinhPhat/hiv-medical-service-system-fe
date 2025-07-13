import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import treatmentService from "../../Services/DoctorService/treatmentService";
import DetailPersonalARV from "./DetailPersonalARV";
import moment from "moment";

const DetailTreatment = () => {
  const { id } = useParams();
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        const response = await treatmentService.getTreatmentById(id, token);
        setTreatment(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy treatment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-red-600 text-lg font-medium text-center">
          Không tìm thấy thông tin điều trị.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div
            className={
              treatment.prescribedRegimentID?._id ? "lg:w-6/10" : "w-full"
            }
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6">
                <h1 className="text-2xl font-bold text-white">
                  Chi tiết điều trị
                </h1>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 w-32">
                        Ngày điều trị:
                      </span>
                      <span className="text-gray-600">
                        {moment(treatment.treatmentDate).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 w-32">
                        Trạng thái:
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          treatment.status === "active"
                            ? "bg-green-100 text-green-800"
                            : treatment.status === "Đang xử lý"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {treatment.status}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 w-32">
                        Ghi chú:
                      </span>
                      <span className="text-gray-600">
                        {treatment.note || "Không có"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 w-32">
                        Mã hồ sơ:
                      </span>
                      <span className="text-gray-600">
                        {treatment.medicalRecordID}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 w-32">
                        Người tạo:
                      </span>
                      <span className="text-gray-600">
                        {treatment.createdBy?.email || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    Kết quả xét nghiệm
                  </h2>
                  <div className="space-y-3">
                    {treatment.testResultID.map((test, index) => (
                      <div
                        key={test._id}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <h3 className="font-medium text-gray-800">
                          Xét nghiệm {index + 1} -{" "}
                          {moment(test.test_date).format("DD/MM/YYYY HH:mm")}
                        </h3>
                        <div className="mt-2 space-y-1">
                          <p className="text-gray-600">
                            <span className="font-medium">
                              Loại xét nghiệm:
                            </span>{" "}
                            {test.test_type}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Kết quả:</span>{" "}
                            {test.test_results}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  <p>
                    Tạo lúc:{" "}
                    {moment(treatment.createdAt).format("DD/MM/YYYY HH:mm")}
                  </p>
                  <p>
                    Cập nhật lúc:{" "}
                    {moment(treatment.updatedAt).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {treatment.prescribedRegimentID?._id && (
            <div className="lg:w-4/10">
              <DetailPersonalARV
                regimenId={treatment.prescribedRegimentID._id}
                token={token}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailTreatment;
