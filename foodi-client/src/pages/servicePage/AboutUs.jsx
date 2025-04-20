import React from 'react';
import { FaUtensils, FaUsers, FaStar, FaTruck } from 'react-icons/fa';

const AboutUs = () => {
  const coreValues = [
    {
      icon: <FaUtensils className="text-4xl text-green-600" />,
      title: "Ẩm Thực Chất Lượng",
      description: "Chúng tôi tự hào sử dụng những nguyên liệu tươi ngon nhất để tạo ra những món ăn tuyệt vời."
    },
    {
      icon: <FaUsers className="text-4xl text-green-600" />,
      title: "Đội Ngũ Chuyên Nghiệp",
      description: "Đội ngũ đầu bếp và nhân viên giàu kinh nghiệm, luôn tận tâm phục vụ khách hàng."
    },
    {
      icon: <FaStar className="text-4xl text-green-600" />,
      title: "Dịch Vụ Tận Tâm",
      description: "Chúng tôi cam kết mang đến trải nghiệm ẩm thực tuyệt vời nhất cho mọi khách hàng."
    },
    {
      icon: <FaTruck className="text-4xl text-green-600" />,
      title: "Giao Hàng Nhanh Chóng",
      description: "Dịch vụ giao hàng nhanh chóng và tin cậy, đảm bảo món ăn đến tay bạn trong tình trạng tốt nhất."
    }
  ];

  const teamMembers = [
    {
      name: "Nguyễn Văn An",
      role: "Bếp Trưởng",
      image: "https://i.ibb.co/qJCmcpC/img2.png"
    },
    {
      name: "Trần Thị Bình",
      role: "Bếp Trưởng Bánh",
      image: "https://i.ibb.co/W5T6Gmj/img3.png"
    },
    {
      name: "Lê Văn Cường",
      role: "Bếp Phó",
      image: "https://i.ibb.co/HCrDdk6/img1.png"
    }
  ];

  return (
    <div className="max-w-screen-2xl mx-auto">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-black">
        <img 
          src="https://i.ibb.co/hfzf6CJ/banner2.jpg" 
          alt="Nhà hàng" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Về Foodi</h1>
            <p className="text-xl">Mang Hạnh Phúc Đến Từng Bữa Ăn Từ 2023</p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Câu Chuyện Của Chúng Tôi</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Được thành lập vào năm 2023, Foodi đã và đang không ngừng nỗ lực mang đến những trải nghiệm ẩm thực tuyệt vời nhất cho khách hàng. 
            Từ một nhà hàng nhỏ, chúng tôi đã phát triển thành một thương hiệu ẩm thực được yêu thích, nổi tiếng với chất lượng món ăn, 
            không gian ấm cúng và dịch vụ chuyên nghiệp. Niềm đam mê ẩm thực và cam kết về chất lượng luôn thúc đẩy chúng tôi 
            không ngừng đổi mới và hoàn thiện, đảm bảo mỗi bữa ăn đều là một kỷ niệm đáng nhớ.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-gray-50 py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Giá Trị Cốt Lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center transform hover:-translate-y-1 transition-transform duration-300 ease-in-out"
              >
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Đội Ngũ Của Chúng Tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                <div className="mb-4 relative group">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <div className="text-white">
                      <h3 className="text-xl font-semibold">{member.name}</h3>
                      <p>{member.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-50 py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ghé Thăm Nhà Hàng</h2>
          <p className="text-gray-600 mb-8">
            Chúng tôi rất mong được phục vụ quý khách. Hãy đến và trải nghiệm không gian ẩm thực 
            tuyệt vời cùng những món ăn đặc sắc của chúng tôi.
          </p>
          <div className="space-y-4">
            <p className="text-lg">
              <strong>Địa chỉ:</strong> 123 Đường Ẩm Thực, Quận 1, TP.HCM
            </p>
            <p className="text-lg">
              <strong>Giờ mở cửa:</strong> Thứ 2 - Chủ nhật: 10:00 - 22:00
            </p>
            <p className="text-lg">
              <strong>Điện thoại:</strong> (028) 1234-5678
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs; 