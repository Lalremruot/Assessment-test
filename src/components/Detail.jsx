import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setContact } from '../store/detailSlice';
import { useNavigate } from 'react-router-dom';

const ContactForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Only update the phone number if it's empty or a digit
        if (name === 'phone' && (value.length > 10 || !/^\d*$/.test(value))) {
            return; // Do not update if more than 10 digits or not a number
        }
        
        setFormData({
        ...formData,
        [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate phone number
        if (formData.phone.length !== 10) {
            alert("Invalid phone number");
            return; // Prevent navigation and submission
        }
        dispatch(setContact(formData)); // Dispatch the action to store the form data
        navigate('/career-quiz'); // Redirect to the success page
        console.log('Form Data:', formData);
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300 shadow-xl">
      <div className='inline-block absolute top-12'><p className="text-red-500 text-xs mb-4 italic"><span className="font-semibold text-sm italic">( Note:</span> Do not refresh your browser after loggin)</p></div>
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded-lg shadow-xl w-96"
      >
        <h2 className="mb-4 text-2xl font-bold text-center">Please fill up</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder='Enter full name'
            value={formData.name}
            onChange={handleChange}
            required
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder='example@gmail.com'
            value={formData.email}
            onChange={handleChange}
            required
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number:
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder='8974768900'
            value={formData.phone}
            onChange={handleChange}
            required
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 font-semibold text-white transition duration-200 bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
