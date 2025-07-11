import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import BlogPostManager from "./content/BlogPostManager";
import EducationalDocumentManager from "./content/EducationalDocumentManager";
import FacilityInfoManager from "./content/FacilityInfoManager";

const ContentManagement = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý Nội dung
      </Typography>

      {/* Facility Info Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Thông tin cơ sở
        </Typography>
        <FacilityInfoManager />
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Blog Post Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Bài viết Blog
        </Typography>
        <BlogPostManager />
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Educational Document Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Tài liệu hướng dẫn
        </Typography>
        <EducationalDocumentManager />
      </Box>
    </Box>
  );
};

export default ContentManagement;
