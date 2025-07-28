import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import blogService from "../../Services/StaffService/blogService";

const BlogList = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [authorFilter, setAuthorFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getAllBlogPosts();
        console.log("Blog posts loaded:", data);
        setBlogPosts(data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const authors = [...new Set(blogPosts.map((post) => post.author))];

  const filteredPosts = blogPosts
    .filter((post) => (authorFilter ? post.author === authorFilter : true))
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Blog Y Tế
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <label className="text-gray-700">Lọc theo tác giả:</label>
          <select
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">Tất cả</option>
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-700">Sắp xếp theo ngày:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="desc">Mới nhất</option>
            <option value="asc">Cũ nhất</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {post.content.length > 100
                    ? post.content.substring(0, 100) + "..."
                    : post.content}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  {/* <span>{post.createdBy.email}</span> */}
                  <span>{post.date}</span>
                </div>
                <Link
                  to={`/blogs/${post._id}`}
                  className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                >
                  Đọc thêm
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              Không tìm thấy bài viết nào!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogList;
