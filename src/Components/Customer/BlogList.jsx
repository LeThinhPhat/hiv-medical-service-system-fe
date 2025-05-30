import React, { useState } from "react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "Cách Chăm Sóc Sức Khỏe Tim Mạch Hiệu Quả",
    excerpt:
      "Tìm hiểu các phương pháp đơn giản để duy trì sức khỏe tim mạch, từ chế độ ăn uống đến tập luyện thể dục.",
    author: "Dr. Nguyễn Văn A",
    date: "2025-05-28",
  },
  {
    id: 2,
    title: "Hiểu Biết và Phòng Ngừa Bệnh Tiểu Đường",
    excerpt:
      "Bệnh tiểu đường đang gia tăng. Hãy khám phá các dấu hiệu cảnh báo và cách phòng ngừa hiệu quả.",
    author: "Dr. Trần Thị B",
    date: "2025-05-27",
  },
  {
    id: 3,
    title: "Tầm Quan Trọng Của Sức Khỏe Tâm Lý",
    excerpt:
      "Sức khỏe tâm lý ảnh hưởng lớn đến chất lượng cuộc sống. Tìm hiểu cách nhận biết và chăm sóc tâm lý.",
    author: "Dr. Lê Văn C",
    date: "2025-05-26",
  },
  {
    id: 4,
    title: "Dinh Dưỡng Cho Trẻ Em: Những Điều Cần Biết",
    excerpt:
      "Hướng dẫn xây dựng chế độ ăn uống lành mạnh để hỗ trợ sự phát triển toàn diện của trẻ.",
    author: "Dr. Phạm Thị D",
    date: "2025-05-25",
  },
  {
    id: 5,
    title: "Lợi Ích Của Yoga Đối Với Sức Khỏe",
    excerpt:
      "Yoga không chỉ giúp thư giãn mà còn cải thiện sức khỏe thể chất và tinh thần. Khám phá ngay!",
    author: "Dr. Nguyễn Văn A",
    date: "2025-05-24",
  },
  {
    id: 6,
    title: "Cách Xử Lý Các Vấn Đề Da Liễu Thường Gặp",
    excerpt:
      "Từ mụn trứng cá đến eczema, tìm hiểu cách điều trị và chăm sóc da hiệu quả tại nhà.",
    author: "Dr. Lê Văn C",
    date: "2025-05-23",
  },
  {
    id: 7,
    title: "Hiểu Biết Về Các Loại Vắc-Xin Cho Trẻ Em",
    excerpt:
      "Vắc-xin là chìa khóa bảo vệ trẻ khỏi các bệnh nguy hiểm. Tìm hiểu lịch tiêm chủng cần thiết.",
    author: "Dr. Trần Thị B",
    date: "2025-05-22",
  },
  {
    id: 8,
    title: "Phòng Ngừa Chấn Thương Trong Thể Thao",
    excerpt:
      "Học cách khởi động đúng cách và các biện pháp phòng ngừa chấn thương khi chơi thể thao.",
    author: "Dr. Phạm Thị D",
    date: "2025-05-21",
  },
];

const BlogList = () => {
  const [authorFilter, setAuthorFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // Get unique authors for filter dropdown
  const authors = [...new Set(blogPosts.map((post) => post.author))];

  // Filter and sort posts
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
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>{post.author}</span>
                <span>{post.date}</span>
              </div>
              <Link
                to={`/blogs/${post.id}`}
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
    </div>
  );
};

export default BlogList;
