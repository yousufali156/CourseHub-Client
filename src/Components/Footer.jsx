import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-6">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-3 gap-4">
        <div>
          <h3 className="font-bold text-lg">CourseHub</h3>
          <p>Empowering learning anywhere</p>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Help</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Connect</h4>
          <ul>
            <li>Facebook</li>
            <li>Twitter</li>
            <li>LinkedIn</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;