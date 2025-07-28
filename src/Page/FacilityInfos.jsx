import React, { useEffect, useState } from "react";
import facilityInfoService from "../Services/StaffService/facilityInfoService";

const FacilityInfos = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await facilityInfoService.getAll();
        setFacilities(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách cơ sở:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 font-sans">
        Danh sách Cơ sở Y tế
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {facilities.map((facility) => (
          <div
            key={facility._id}
            className="bg-white shadow-md rounded-2xl p-6 transition-transform transform hover:scale-[1.02] flex flex-col justify-between min-h-[320px]"
          >
            <div className="flex flex-col flex-grow">
              <h3 className="text-lg font-semibold text-blue-600 mb-2 font-sans">
                {facility.name}
              </h3>

              <p className="text-sm text-gray-800 mb-4 whitespace-pre-line line-clamp-4 font-sans">
                {facility.description}
              </p>

              <div className="border-t border-gray-200 mt-auto pt-3">
                <p className="text-xs text-gray-500 font-sans">
                  {facility.contactInfo}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacilityInfos;
