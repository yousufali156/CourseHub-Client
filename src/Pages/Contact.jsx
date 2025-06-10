import React from 'react';
import { Mail, Phone, MapPin } from 'react-feather'; 

const Contact = () => {
  return (
    <div className="container mx-auto p-6 my-8 bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-3xl">
      <h2 className="text-4xl font-bold text-center text-blue-700 mb-8">Contact Us</h2>
      <p className="text-center text-gray-700 mb-8">
        We'd love to hear from you! Please reach out to us using the information below or fill out the contact form.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Contact Info */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-md flex flex-col space-y-4">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Get in Touch</h3>
          <div className="flex items-center space-x-3 text-gray-700">
            <Mail size={24} className="text-blue-600" />
            <a href="mailto:info@coursesphere.com" className="hover:underline">info@CourseHub.com</a>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <Phone size={24} className="text-blue-600" />
            <a href="tel:+1234567890" className="hover:underline">+880 1 (234) 567-890</a>
          </div>
          <div className="flex items-start space-x-3 text-gray-700">
            <MapPin size={24} className="text-blue-600 mt-1" />
            <span>5800 Bogura 7 Matha, Bogura Sadar, Rajshahi, Bangladesh</span>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Send Us a Message</h3>
          <form className="space-y-4">
            <div>
              <label htmlFor="contactName" className="block text-gray-700 text-sm font-semibold mb-2">Your Name</label>
              <input
                type="text"
                id="contactName"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-gray-700 text-sm font-semibold mb-2">Your Email</label>
              <input
                type="email"
                id="contactEmail"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="john.doe@example.com"
              />
            </div>
            <div>
              <label htmlFor="contactMessage" className="block text-gray-700 text-sm font-semibold mb-2">Message</label>
              <textarea
                id="contactMessage"
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
