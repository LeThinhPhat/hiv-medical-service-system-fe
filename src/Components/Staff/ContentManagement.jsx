import React from "react";
import BlogPostManager from "./content/BlogPostManager";
import EducationalDocumentManager from "./content/EducationalDocumentManager";
import FacilityInfoManager from "./content/FacilityInfoManager";

const ContentManagement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b  px-4 py-8 sm:px-6 lg:px-8">
      <div className="Container mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
          Quản lý Nội dung
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Facility Info Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-200/50 animate-in fade-in">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-blue-500">🏢</span> Thông tin cơ sở
            </h2>
            <div className="border-t border-gray-200/30 pt-4">
              <FacilityInfoManager />
            </div>
          </div>

          {/* Blog Post Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-200/50 animate-in fade-in">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-blue-500">📝</span> Bài viết Blog
            </h2>
            <div className="border-t border-gray-200/30 pt-4">
              <BlogPostManager />
            </div>
          </div>

          {/* Educational Document Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-200/50 animate-in fade-in">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-blue-500">📚</span> Tài liệu hướng dẫn
            </h2>
            <div className="border-t border-gray-200/30 pt-4">
              <EducationalDocumentManager />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
