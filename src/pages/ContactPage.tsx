import React from 'react';
import { FormInput } from '../components/ui/FormInput';
import { Button } from '../components/ui/Button';

export const ContactPage: React.FC = () => {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-secondary-600 mb-4">Contact Us</h1>
      <p className="text-gray-700 mb-6">Have a question or feedback? Send us a message and we'll get back to you.</p>

      <form className="space-y-4">
        <FormInput label="Your Name" name="name" />
        <FormInput label="Email" name="email" type="email" />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea name="message" className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={6} />
        </div>
        <div>
          <Button className="bg-secondary-500 text-white dark:text-gray-100 hover:bg-secondary-600 dark:hover:bg-secondary-700">Send Message</Button>
        </div>
      </form>
    </main>
  );
};

export default ContactPage;
