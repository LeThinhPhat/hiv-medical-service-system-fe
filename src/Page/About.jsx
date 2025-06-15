import React from "react";

const aboutData = {
  title: "Trí - Đức - Chuyên tâm\nVươn tầm Thế giới",
  description:
    "Bệnh viện Bạch Mai là bệnh viện Đa khoa hoàn chỉnh hạng đặc biệt đầu tiên tại Việt Nam, với tầm nhìn trở thành bệnh viện uy tín trong khu vực và trên thế giới. Chúng tôi cam kết chăm sóc sức khỏe toàn diện cho mọi người dân bằng tài năng, y đức và sự tận tâm.",
  policies: [
    {
      title: "Sứ mệnh",
      content:
        "Là Bệnh viện công lập đa khoa hạng đặc biệt chăm sóc sức khỏe toàn diện cho mọi người dân.",
    },
    {
      title: "Tầm nhìn",
      content:
        "Trở thành một bệnh viện uy tín trong khu vực và trên thế giới, phát triển các mũi nhọn chuyên sâu, có nguồn nhân lực chất lượng cao trong môi trường làm việc an toàn, chuyên nghiệp, hiệu quả, được các tổ chức Tiêu chuẩn quốc tế công nhận.",
    },
    {
      title: "Giá trị cốt lõi",
      content: "An toàn - Tin cậy - Hiệu quả",
    },
    {
      title: "Cam kết",
      content:
        "Bệnh viện cam kết đồng hành cùng mọi người dân để bảo vệ và nâng cao sức khỏe cho mỗi người và cho cả cộng đồng.",
    },
  ],
  images: [
    "https://bachmai.gov.vn/_next/image?url=%2Fassets%2Fimages%2Fimage-pic2.jpg&w=750&q=75",
    "https://bachmai.gov.vn/_next/image?url=%2Fassets%2Fimages%2Fimage-pic2.jpg&w=750&q=75",
  ],
};

const About = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section: Title, Description, Images */}
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-blue-800 whitespace-pre-line">
            {aboutData.title}
          </h1>
          <p className="text-gray-700 text-base">{aboutData.description}</p>
          <div className="grid grid-cols-2 gap-4">
            {aboutData.images.map((img, index) => (
              <div key={index} className="shadow-lg rounded-lg overflow-hidden">
                <img
                  src={img}
                  alt={`about-image-${index}`}
                  className="w-full h-40 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Policies */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Chính sách & Cam kết
          </h2>
          <ul className="space-y-4">
            {aboutData.policies.map((policy, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {policy.title}
                  </h3>
                  <p className="text-gray-600 text-sm whitespace-pre-line">
                    {policy.content}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
