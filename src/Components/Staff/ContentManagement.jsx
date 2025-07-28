import React from "react";
import BlogPostManager from "./content/BlogPostManager";
import EducationalDocumentManager from "./content/EducationalDocumentManager";
import FacilityInfoManager from "./content/FacilityInfoManager";

const ContentManagement = () => {
  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1
          className="text-3xl font-extrabold text-gray-900 tracking-tight mb-10 text-center"
          role="heading"
          aria-level="1"
        >
          Quản lý Nội dung
        </h1>

        <div className="space-y-12">
          {/* Facility Info Section */}
          <section
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-200/50 transition-all duration-300 animate-in fade-in"
            aria-labelledby="facility-info-heading"
          >
            <h2
              id="facility-info-heading"
              className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
            >
              Thông tin cơ sở
            </h2>
            <div className="pt-2">
              <FacilityInfoManager />
            </div>
          </section>

          {/* Blog Post Section - Enlarged */}
          <section
            className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-12 border border-gray-200/50 transition-all duration-300 animate-in fade-in scale-105"
            aria-labelledby="blog-post-heading"
          >
            <h2
              id="blog-post-heading"
              className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3"
            >
              Bài viết Blog
            </h2>
            <div className="pt-4">
              <BlogPostManager />
            </div>
          </section>

          {/* Educational Document Section */}
          <section
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-200/50 transition-all duration-300 animate-in fade-in"
            aria-labelledby="educational-document-heading"
          >
            <h2
              id="educational-document-heading"
              className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
            >
              Tài liệu hướng dẫn
            </h2>
            <div className="pt-2">
              <EducationalDocumentManager />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
