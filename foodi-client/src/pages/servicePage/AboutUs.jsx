import React from 'react';
import { FaUtensils, FaUsers, FaStar, FaTruck } from 'react-icons/fa';

const AboutUs = () => {
  const coreValues = [
    {
      icon: <FaUtensils className="text-4xl text-green-600" />,
      title: "High-Quality Cuisine",
      description: "We take pride in using the freshest ingredients to create delicious dishes."
    },
    {
      icon: <FaUsers className="text-4xl text-green-600" />,
      title: "Professional Team",
      description: "Our experienced chefs and staff are dedicated to providing excellent service."
    },
    {
      icon: <FaStar className="text-4xl text-green-600" />,
      title: "Dedicated Service",
      description: "We are committed to delivering the best culinary experience for every customer."
    },
    {
      icon: <FaTruck className="text-4xl text-green-600" />,
      title: "Fast Delivery",
      description: "Our reliable and fast delivery ensures your food arrives in the best condition."
    }
  ];

  const teamMembers = [
    {
      name: "Nguyễn Văn An",
      role: "Head Chef",
      image: "https://i.ibb.co/qJCmcpC/img2.png"
    },
    {
      name: "Trần Thị Bình",
      role: "Pastry Chef",
      image: "https://i.ibb.co/W5T6Gmj/img3.png"
    },
    {
      name: "Lê Văn Cường",
      role: "Sous Chef",
      image: "https://i.ibb.co/HCrDdk6/img1.png"
    }
  ];

  return (
    <div className="max-w-screen-2xl mx-auto">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-black">
        <img 
          src="https://i.ibb.co/hfzf6CJ/banner2.jpg" 
          alt="Restaurant" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">About Foodi</h1>
            <p className="text-xl">Bringing Happiness to Every Meal Since 2023</p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Founded in 2023, Foodi has been striving to provide the best culinary experiences for our customers. 
            Starting as a small restaurant, we have grown into a beloved culinary brand known for our high-quality dishes, 
            cozy atmosphere, and professional service. Our passion for food and commitment to quality constantly drive us 
            to innovate and improve, ensuring that every meal becomes a memorable experience.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-gray-50 py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
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
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
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
          <h2 className="text-3xl font-bold mb-6">Visit Our Restaurant</h2>
          <p className="text-gray-600 mb-8">
            We look forward to serving you. Come and enjoy a great dining experience with our delicious dishes.
          </p>
          <div className="space-y-4">
            <p className="text-lg">
              <strong>Address:</strong> 123 Culinary Street, District 1, Ho Chi Minh City
            </p>
            <p className="text-lg">
              <strong>Opening Hours:</strong> Monday - Sunday: 10:00 AM - 10:00 PM
            </p>
            <p className="text-lg">
              <strong>Phone:</strong> (028) 1234-5678
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
