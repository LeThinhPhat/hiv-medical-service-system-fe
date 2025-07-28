import React, { useEffect, useState } from "react";
import educationalDocumentService from "../Services/StaffService/educationalDocumentService";
import { FaFilePdf } from "react-icons/fa";

const EducationalDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await educationalDocumentService.getAllDocuments();
        setDocuments(data);
      } catch (error) {
        console.error("Lỗi khi lấy tài liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 text-lg">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-indigo-100 py-20">
      <h1 className="text-3xl font-extrabold text-center text-indigo-800 mb-10 font-sans">
        Tài liệu Giáo dục
      </h1>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl w-full">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-blue-50 border border-blue-200 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col h-full"
            >
              {/* Thumbnail */}
              {doc.fileURL?.endsWith(".pdf") ? (
                <div className="flex items-center justify-center h-32 bg-blue-100 rounded-t-2xl">
                  <FaFilePdf className="text-red-500 text-5xl" />
                </div>
              ) : (
                <img
                  src={doc.fileURL}
                  alt={doc.title}
                  className="w-full h-32 object-cover rounded-t-2xl"
                />
              )}

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-indigo-700 mb-1 line-clamp-2">
                  {doc.title}
                </h2>

                <p className="text-base text-gray-800 mb-3 line-clamp-3 whitespace-pre-line">
                  {doc.content}
                </p>

                <div className="text-sm text-gray-600 space-y-1 mb-4 mt-auto">
                  {/* <p>
                    <span className="font-semibold text-gray-700">
                      Trạng thái:
                    </span>{" "}
                    {doc.status}
                  </p> */}
                  {/* <p>
                    <span className="font-semibold text-gray-700">
                      Người tạo:
                    </span>{" "}
                    {doc.createdBy?.email}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">
                      Ngày tạo:
                    </span>{" "}
                    {new Date(doc.createdAt).toLocaleString("vi-VN")}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">
                      Cập nhật:
                    </span>{" "}
                    {new Date(doc.updatedAt).toLocaleString("vi-VN")}
                  </p> */}
                </div>

                <a
                  href={doc.fileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  📄 Xem tài liệu
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationalDocuments;
