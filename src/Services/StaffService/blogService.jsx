import axiosClient from "../api.config";
const blogService = {
  // Lấy tất cả bài viết
  getAllBlogPosts: async () => {
    try {
      const res = await axiosClient.get("/blogPosts");
      return res.data.data;
    } catch (err) {
      console.error("Lỗi khi lấy danh sách BlogPosts:", err);
      throw err;
    }
  },

  // Lấy chi tiết bài viết theo ID
  getBlogPostById: async (id) => {
    try {
      const res = await axiosClient.get(`/blogPosts/${id}`);
      return res.data.data;
    } catch (err) {
      console.error(`Lỗi khi lấy BlogPost ID ${id}:`, err);
      throw err;
    }
  },

  // Tạo bài viết mới
  createBlogPost: async (data) => {
    try {
      const res = await axiosClient.post("/blogPosts", data);
      return res.data.data;
    } catch (err) {
      console.error("Lỗi khi tạo BlogPost:", err);
      throw err;
    }
  },

  // Cập nhật bài viết (PATCH)
  updateBlogPost: async (id, data) => {
    try {
      const res = await axiosClient.patch(`/blogPosts/${id}`, data);
      return res.data.data;
    } catch (err) {
      console.error(`Lỗi khi cập nhật BlogPost ID ${id}:`, err);
      throw err;
    }
  },

  // Xoá bài viết
  deleteBlogPost: async (id) => {
    try {
      const res = await axiosClient.delete(`/blogPosts/${id}`);
      return res.data.message || "Xóa thành công";
    } catch (err) {
      console.error(`Lỗi khi xoá BlogPost ID ${id}:`, err);
      throw err;
    }
  },
};

export default blogService;
