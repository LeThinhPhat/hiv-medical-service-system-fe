import axios from "axios";

const API_URL = "http://localhost:3000/blogPosts";

const blogService = {
  // Lấy tất cả bài viết
  getAllBlogPosts: async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data; // hoặc res.data tùy theo API trả về
  } catch (err) {
    console.error("Lỗi khi lấy danh sách BlogPosts:", err);
    throw err;
  }
}
,
  // Lấy chi tiết bài viết theo ID
  getBlogPostById: async (id) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data.data;
    } catch (err) {
      console.error(`Lỗi khi lấy BlogPost ID ${id}:`, err);
      throw err;
    }
  },

  // Tạo bài viết mới
  createBlogPost: async (data, token) => {
    try {
      const res = await axios.post(API_URL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    } catch (err) {
      console.error("Lỗi khi tạo BlogPost:", err);
      throw err;
    }
  },

  // Cập nhật bài viết (PATCH)
  updateBlogPost: async (id, data, token) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    } catch (err) {
      console.error(`Lỗi khi cập nhật BlogPost ID ${id}:`, err);
      throw err;
    }
  },

  // Xoá bài viết
  deleteBlogPost: async (id, token) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.message || "Xóa thành công";
    } catch (err) {
      console.error(`Lỗi khi xoá BlogPost ID ${id}:`, err);
      throw err;
    }
  },
};

export default blogService;
