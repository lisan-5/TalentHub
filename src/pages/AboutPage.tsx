import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-secondary-600 mb-4">About Us</h1>
      <p className="text-gray-700 mb-3">
        TalentHub is a simple job portal built for demo purposes. We connect talented
        applicants with great employers. Our mission is to make the hiring process
        fast, fair, and human-centered.
      </p>
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Our Values</h2>
      <ul className="list-disc list-inside text-gray-700">
        <li>Transparency in hiring</li>
        <li>Equal opportunity for all applicants</li>
        <li>Empowering employers with useful tools</li>
      </ul>
    </main>
  );
};

export default AboutPage;
