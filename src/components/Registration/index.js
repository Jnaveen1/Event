import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css'

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false) ;
  const [otp, setOtp] = useState('') ;
  const [otpVerified , setOtpVerified] = useState(false) ;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    // Simple frontend validation
    console.log(formData)
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }
  
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    };
  
    try {
      const response = await fetch('http://localhost:3000/register', options);
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Registration failed');
        return;
      }
      console.log("success")
      const successData = await response.json();
      setSuccess(successData); 
      setFormData({ name: '', email: '', password: '', role: 'user' }); 
    } catch (err) {
      setError('Something went wrong, please try again later.');
      console.error('Error during registration:', err);
    }
  };
  

  return (
    <div className='main-container' style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Register</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          >
            <option value="user">User</option>
            <option value="organizer">Organizer</option>
          </select>
        </div>

        <button type="submit" style={{ padding: '10px', width: '100%' }}>
          Register
        </button>
      </form>
      <Link to = "/login">
            <p>Already registered? Login</p>
      </Link>
    </div>
  );
};

export default RegistrationForm;