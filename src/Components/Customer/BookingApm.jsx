import React from "react";

const BookingApm = () => {
  return (
    <div className="bg-white py-16 px-4 md:px-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-teal-500 mb-2">
          Book Appointment
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Our management and help workforce all have super humans competencies
          and are skilled to help you with all clinical enquiries.
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-10 max-w-7xl mx-auto">
        {/* Image */}
        <div className="flex-1">
          <img
            src="/images/doctor.jpg" // đặt đúng tên ảnh bạn muốn dùng
            alt="Doctor with stethoscope"
            className="w-full rounded-lg object-cover shadow-md"
          />
        </div>

        {/* Form */}
        <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-teal-500 mb-4">
            Call us or fill the form
          </h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Row 1 */}
            <input
              type="text"
              placeholder="First Name"
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="border p-2 rounded"
            />
            {/* Row 2 */}
            <input
              type="text"
              placeholder="Your phone number"
              className="border p-2 rounded"
            />
            <input
              type="email"
              placeholder="Your email"
              className="border p-2 rounded"
            />
            {/* Row 3 */}
            <input type="date" className="border p-2 rounded" />
            <input type="time" className="border p-2 rounded" />
            {/* Row 4 */}
            <select className="border p-2 rounded">
              <option>-- Select Department --</option>
              <option>Dental</option>
              <option>Neurology</option>
              <option>Cardiology</option>
            </select>
            <select className="border p-2 rounded">
              <option>-- Choose Your Doctor --</option>
              <option>Dr. John</option>
              <option>Dr. Smith</option>
              <option>Dr. Anna</option>
            </select>
            {/* File Upload */}
            <div className="col-span-2">
              <input type="file" className="w-full border p-2 rounded" />
              <small className="text-gray-500 text-sm">
                All files allowed. Max size 10MB.
              </small>
            </div>
            {/* Message */}
            <textarea
              placeholder="Message"
              rows={3}
              className="col-span-2 border p-2 rounded"
            ></textarea>
            {/* Captcha */}
            <input
              type="text"
              placeholder="Type the below word"
              className="col-span-2 border p-2 rounded"
            />
            <div className="col-span-2 text-left font-mono px-2 py-1 bg-gray-100 rounded w-fit">
              catch
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="col-span-2 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded font-semibold mt-4"
            >
              SUBMIT NOW
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingApm;
