import React from "react";
import { useParams, Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "Cách Chăm Sóc Sức Khỏe Tim Mạch Hiệu Quả",
    excerpt:
      "Tìm hiểu các phương pháp đơn giản để duy trì sức khỏe tim mạch, từ chế độ ăn uống đến tập luyện thể dục.",
    author: "Dr. Nguyễn Văn A",
    date: "2025-05-28",
    content: `
      Để duy trì sức khỏe tim mạch, việc áp dụng lối sống lành mạnh là điều vô cùng quan trọng. Đầu tiên, chế độ ăn uống cần được chú trọng. Hãy ưu tiên thực phẩm giàu chất xơ như rau xanh, trái cây, ngũ cốc nguyên hạt và hạn chế chất béo bão hòa từ thịt đỏ hoặc thực phẩm chế biến sẵn. Omega-3 có trong cá hồi, cá thu cũng rất tốt cho tim.

      Bên cạnh đó, tập thể dục đều đặn giúp tăng cường tuần hoàn máu và giảm nguy cơ mắc bệnh tim. Mỗi tuần, bạn nên dành ít nhất 150 phút cho các bài tập aerobic như đi bộ nhanh, chạy bộ hoặc bơi lội. Tránh căng thẳng bằng cách thực hành thiền hoặc yoga cũng góp phần giảm áp lực lên tim.

      Cuối cùng, đừng quên kiểm tra sức khỏe định kỳ. Đo huyết áp, cholesterol và đường huyết thường xuyên sẽ giúp bạn phát hiện sớm các vấn đề tiềm ẩn. Hãy tham khảo ý kiến bác sĩ để có kế hoạch chăm sóc tim mạch phù hợp nhất.
    `,
  },
  {
    id: 2,
    title: "Hiểu Biết và Phòng Ngừa Bệnh Tiểu Đường",
    excerpt:
      "Bệnh tiểu đường đang gia tăng. Hãy khám phá các dấu hiệu cảnh báo và cách phòng ngừa hiệu quả.",
    author: "Dr. Trần Thị B",
    date: "2025-05-27",
    content: `
      Bệnh tiểu đường, hay đái tháo đường, là một tình trạng mãn tính ảnh hưởng đến cách cơ thể xử lý đường huyết. Có hai loại chính: tiểu đường loại 1 và loại 2. Loại 2 phổ biến hơn và thường liên quan đến lối sống. Các triệu chứng bao gồm khát nước, mệt mỏi, tiểu nhiều và sụt cân không rõ nguyên nhân.

      Để phòng ngừa, bạn cần duy trì cân nặng hợp lý, ăn uống cân bằng và tập thể dục thường xuyên. Tránh tiêu thụ quá nhiều đường và carbohydrate tinh chế. Thực phẩm giàu chất xơ như yến mạch, đậu và rau xanh có thể giúp ổn định đường huyết.

      Việc kiểm tra đường huyết định kỳ cũng rất quan trọng, đặc biệt nếu bạn có tiền sử gia đình mắc bệnh. Hãy tham khảo bác sĩ để được tư vấn về chế độ ăn uống và lối sống phù hợp nhằm giảm nguy cơ mắc bệnh tiểu đường.
    `,
  },
  {
    id: 3,
    title: "Tầm Quan Trọng Của Sức Khỏe Tâm Lý",
    excerpt:
      "Sức khỏe tâm lý ảnh hưởng lớn đến chất lượng cuộc sống. Tìm hiểu cách nhận biết và chăm sóc tâm lý.",
    author: "Dr. Lê Văn C",
    date: "2025-05-26",
    content: `
      Sức khỏe tâm lý đóng vai trò quan trọng không kém gì sức khỏe thể chất. Stress, lo âu hoặc trầm cảm có thể ảnh hưởng đến công việc, các mối quan hệ và sức khỏe tổng thể. Nhận biết các dấu hiệu như mất ngủ, khó tập trung, hoặc cảm giác chán nản kéo dài là bước đầu tiên để chăm sóc tâm lý.

      Để cải thiện, bạn có thể thử các kỹ thuật thư giãn như thiền định, hít thở sâu hoặc viết nhật ký. Kết nối với bạn bè, gia đình hoặc tham gia các hoạt động cộng đồng cũng giúp cải thiện tâm trạng. Nếu cảm thấy khó khăn, đừng ngần ngại tìm đến chuyên gia tâm lý để được hỗ trợ.

      Hãy dành thời gian cho bản thân, nghỉ ngơi hợp lý và xây dựng thói quen sống tích cực. Sức khỏe tâm lý tốt sẽ giúp bạn tận hưởng cuộc sống trọn vẹn hơn.
    `,
  },
  {
    id: 4,
    title: "Dinh Dưỡng Cho Trẻ Em: Những Điều Cần Biết",
    excerpt:
      "Hướng dẫn xây dựng chế độ ăn uống lành mạnh để hỗ trợ sự phát triển toàn diện của trẻ.",
    author: "Dr. Phạm Thị D",
    date: "2025-05-25",
    content: `
      Dinh dưỡng hợp lý là nền tảng cho sự phát triển thể chất và trí tuệ của trẻ em. Trẻ cần một chế độ ăn đa dạng, bao gồm protein từ thịt, cá, trứng; carbohydrate từ gạo, khoai; và các loại vitamin, khoáng chất từ rau củ, trái cây.

 bánh mì nguyên cám, sữa và các sản phẩm từ sữa cũng cung cấp canxi và vitamin D cần thiết cho xương và răng. Hạn chế thực phẩm chế biến sẵn, đồ ăn nhanh và đồ uống có đường để tránh nguy cơ béo phì hoặc sâu răng.

      Cha mẹ nên khuyến khích trẻ ăn uống đúng giờ và tạo thói quen ăn uống lành mạnh từ nhỏ. Nếu trẻ kén ăn, hãy thử trình bày món ăn sáng tạo hoặc tham khảo ý kiến bác sĩ dinh dưỡng để xây dựng thực đơn phù hợp.
    `,
  },
  {
    id: 5,
    title: "Lợi Ích Của Yoga Đối Với Sức Khỏe",
    excerpt:
      "Yoga không chỉ giúp thư giãn mà còn cải thiện sức khỏe thể chất và tinh thần. Khám phá ngay!",
    author: "Dr. Nguyễn Văn A",
    date: "2025-05-24",
    content: `
      Yoga là một hình thức tập luyện kết hợp giữa cơ thể, tâm trí và hơi thở, mang lại nhiều lợi ích sức khỏe. Về mặt thể chất, yoga giúp cải thiện sự linh hoạt, tăng cường cơ bắp và cải thiện tư thế. Các bài tập yoga như tư thế chiến binh hoặc cây cầu có thể giảm đau lưng và cải thiện tuần hoàn máu.

      Về mặt tinh thần, yoga giúp giảm căng thẳng và cải thiện khả năng tập trung thông qua thiền và kiểm soát hơi thở. Nhiều nghiên cứu cho thấy yoga có thể giảm các triệu chứng lo âu và trầm cảm.

      Bắt đầu với các lớp yoga cơ bản hoặc video hướng dẫn trực tuyến là cách tốt để làm quen. Hãy chọn thời gian và không gian yên tĩnh để tập luyện, và luôn lắng nghe cơ thể để tránh chấn thương.
    `,
  },
  {
    id: 6,
    title: "Cách Xử Lý Các Vấn Đề Da Liễu Thường Gặp",
    excerpt:
      "Từ mụn trứng cá đến eczema, tìm hiểu cách điều trị và chăm sóc da hiệu quả tại nhà.",
    author: "Dr. Lê Văn C",
    date: "2025-05-23",
    content: `
      Các vấn đề da liễu như mụn trứng cá, eczema hoặc khô da rất phổ biến và có thể được cải thiện với chăm sóc đúng cách. Đối với mụn, hãy giữ da sạch bằng cách rửa mặt hai lần mỗi ngày với sữa rửa mặt dịu nhẹ và sử dụng sản phẩm chứa benzoyl peroxide hoặc salicylic acid.

      Với eczema, việc dưỡng ẩm thường xuyên bằng kem không mùi là rất quan trọng. Tránh các tác nhân gây kích ứng như xà phòng mạnh hoặc vải tổng hợp. Nếu tình trạng da nghiêm trọng, hãy tham khảo ý kiến bác sĩ da liễu để được kê đơn thuốc phù hợp.

      Ngoài ra, bảo vệ da khỏi ánh nắng mặt trời bằng kem chống nắng và uống đủ nước cũng giúp duy trì làn da khỏe mạnh. Chăm sóc da là một quá trình lâu dài, vì vậy hãy kiên nhẫn!
    `,
  },
  {
    id: 7,
    title: "Hiểu Biết Về Các Loại Vắc-Xin Cho Trẻ Em",
    excerpt:
      "Vắc-xin là chìa khóa bảo vệ trẻ khỏi các bệnh nguy hiểm. Tìm hiểu lịch tiêm chủng cần thiết.",
    author: "Dr. Trần Thị B",
    date: "2025-05-22",
    content: `
      Vắc-xin là biện pháp hiệu quả nhất để bảo vệ trẻ em khỏi các bệnh truyền nhiễm nguy hiểm như sởi, quai bị, bại liệt và bạch hầu. Lịch tiêm chủng thường bắt đầu từ khi trẻ sơ sinh và kéo dài đến tuổi vị thành niên.

      Một số vắc-xin quan trọng bao gồm vắc-xin 5 trong 1 (bạch hầu, uốn ván, ho gà, viêm gan B, Hib) và vắc-xin sởi - quai bị - rubella (MMR). Cha mẹ cần tuân thủ lịch tiêm chủng do bác sĩ hoặc cơ quan y tế khuyến nghị.

      Nếu bạn lo lắng về tác dụng phụ của vắc-xin, hãy thảo luận với bác sĩ để được giải đáp. Việc tiêm phòng không chỉ bảo vệ con bạn mà còn góp phần ngăn chặn sự lây lan của bệnh trong cộng đồng.
    `,
  },
  {
    id: 8,
    title: "Phòng Ngừa Chấn Thương Trong Thể Thao",
    excerpt:
      "Học cách khởi động đúng cách và các biện pháp phòng ngừa chấn thương khi chơi thể thao.",
    author: "Dr. Phạm Thị D",
    date: "2025-05-21",
    content: `
      Chấn thương thể thao như bong gân, căng cơ hoặc gãy xương có thể xảy ra nếu không chuẩn bị kỹ. Khởi động trước khi tập luyện là bước quan trọng để làm nóng cơ bắp và tăng tính linh hoạt. Các bài tập khởi động như chạy bộ nhẹ, xoay khớp hoặc căng cơ nên kéo dài ít nhất 10 phút.

      Sử dụng thiết bị bảo hộ như giày thể thao phù hợp, nẹp đầu gối hoặc mũ bảo hiểm cũng giúp giảm nguy cơ chấn thương. Đừng quên nghỉ ngơi đầy đủ để cơ thể phục hồi sau khi tập luyện.

      Nếu xảy ra chấn thương, hãy áp dụng phương pháp RICE (Nghỉ ngơi, Chườm đá, Băng ép, Nâng cao). Trong trường hợp nghiêm trọng, hãy đến gặp bác sĩ chuyên khoa chấn thương để được điều trị kịp thời.
    `,
  },
];

const BlogDetail = () => {
  const { id } = useParams();
  const post = blogPosts.find((post) => post.id === parseInt(id));

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
