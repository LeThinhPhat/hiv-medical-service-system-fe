import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import blogService from "../../Services/StaffService/blogService";

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await blogService.getBlogPostById(id);
        setPost(data);
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <h2 className="text-center text-gray-500 mt-10">Đang tải bài viết...</h2>
    );
  }

  if (!post) {
    return (
      <h2 className="text-center text-red-500 mt-10">
        Không tìm thấy bài viết!
      </h2>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-10">
      <Link
        to="/blogs"
        className="inline-block mb-6 text-green-500 hover:text-green-600"
      >
        &larr; Quay lại danh sách bài viết
      </Link>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h2>
      <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
        <span>{post.author}</span>
        <span>{post.date}</span>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>
    </div>
  );
};

export default BlogDetail;
