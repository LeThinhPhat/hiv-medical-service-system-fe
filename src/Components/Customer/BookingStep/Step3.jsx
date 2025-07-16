import React, { useState, useEffect } from 'react';
import doctorSlotService from '../../../Services/doctorSlotService';// Adjust the import path as needed

const Step3 = ({ open, onClose, onNext, onBack, data }) => {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [error, setError] = useState(null);
  const [doctorSlots, setDoctorSlots] = useState(null);
  const [loadingDoctorSlot, setLoadingDoctorSlot] = useState(false);
  const [slotError, setSlotError] = useState(null);

  function combineDateAndTime(dateObj, timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const d = new Date(dateObj);
    d.setHours(hours, minutes, 0, 0);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
  }

  const Starttime = combineDateAndTime(data.date, data.time);

  useEffect(() => {
    if (!open) return;
    setSelectedDoctor(null);
    setDoctorSlots(null);
    setSlotError(null);
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      setDoctors([]);
      try {
        const res = await doctorSlotService.getDoctorSlots({ startTime: Starttime });
        console.log("Fetched doctors:", res);
        setDoctors(res?.filter(Boolean));
      } catch (err) {
        setError('Không thể tải danh sách bác sĩ.',err);
      }
      setLoading(false);
    };
    fetchDoctors();
  }, [open, data.date, data.time]);

  const handleSelectDoctor = async (doctor) => {
    setSelectedDoctor(doctor);
    setLoadingDoctorSlot(true);
    setSlotError(null);
    setDoctorSlots(null);
    try {
      const slots = await doctorSlotService.getDoctorSlotByDoctor(doctor._id, Starttime);
      setDoctorSlots(slots);
      if (!slots || slots.length === 0) {
        setSlotError('Bác sĩ này không có slot trống ở thời điểm này.');
      }
    } catch (err) {
      setSlotError('Bác sĩ này không có slot trống ở thời điểm này.',err);
    }
    setLoadingDoctorSlot(false);
  };

  const handleNext = () => {
    if (!selectedDoctor || (doctorSlots && doctorSlots.length === 0)) {
      setError('Vui lòng chọn bác sĩ có slot trống.');
      return;
    }
    setError(null);
    onNext({ ...data, slot: doctorSlots, doctor: selectedDoctor });
    onClose();
  };
  
  const getAvatar = (doctor) => {
    const initials = doctor.userID?.name?.[0]?.toUpperCase() || 'D';
    return (
      <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center text-2xl font-bold text-sky-800 shadow-md mr-4">
        {initials}
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden">
        {/* Dialog Title */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Chọn bác sĩ khám</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Dialog Content */}
        <div className="p-6 bg-white">
          {loading && (
            <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Đang tải danh sách bác sĩ...</p>
            </div>
          )}

          {error && (
            <div className="mt-6 mb-4 bg-red-50 text-red-700 p-4 rounded-lg text-lg font-medium">
              {error}
            </div>
          )}

          {!loading && doctors.length === 0 && !error && (
            <div className="mt-6 mb-4 bg-yellow-50 text-yellow-700 p-4 rounded-lg text-lg font-medium">
              Không có bác sĩ nào khả dụng ở khung giờ này.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                onClick={() => handleSelectDoctor(doctor)}
                className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
                  selectedDoctor?._id === doctor._id ? 'border-blue-500 border-2' : 'border-gray-200'
                } bg-white relative flex flex-col justify-between h-full`}
              >
                {selectedDoctor?._id === doctor._id && (
                  <span className="absolute top-4 right-4 bg-blue-500 text-white text-sm font-semibold px-2 py-1 rounded flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5-1H5a2 2 0 01-2 2v9a2 2 0 002 2h14a2 2 0 002-2v-9a2 2 0 01-2-2z" />
                    </svg>
                    Đã chọn
                  </span>
                )}
                <div className="flex items-center mb-4">
                  {getAvatar(doctor.avatarURL)}
                  <div>
                    <h3 className="text-lg font-bold text-blue-900">{doctor.userID?.name || 'Bác sĩ'}</h3>
                    <p className="text-sm text-gray-500">{doctor.specializations || 'Chuyên môn chưa cập nhật'}</p>
                    <p className="text-sm text-gray-500 mt-1">Số phòng: <span className="font-semibold">{doctor.room || 'N/A'}</span></p>
                  </div>
                </div>
                <div className="mt-2">
                  {doctor.userID?.email && (
                    <p className="text-sm text-gray-500 mb-1">📧 {doctor.userID.email}</p>
                  )}
                  {doctor.userID?.phone && (
                    <p className="text-sm text-gray-500">☎️ {doctor.userID.phone}</p>
                  )}
                </div>
                {selectedDoctor?._id === doctor._id && (
                  <div className="mt-4">
                    {loadingDoctorSlot ? (
                      <p className="text-blue-600 font-medium">Đang kiểm tra slot trống...</p>
                    ) : slotError ? (
                      <p className="text-red-600 font-medium">{slotError}</p>
                    ) : doctorSlots?.length > 0 ? (
                      <p className="text-green-600 font-medium">{doctorSlots.length} slot khả dụng</p>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dialog Actions */}
        <div className="p-4 bg-gray-100 border-t border-gray-200 flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-2 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Quay lại
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedDoctor || loadingDoctorSlot || (doctorSlots && doctorSlots.length === 0)}
            className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3;