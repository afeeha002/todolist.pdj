import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();


  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/account/register/', {
        name,
        email,
        password,
      });

      console.log('Registration successful:', response.data);
      setSuccess('Registered successfully!');
      setTimeout(() => navigate('/login'), 1500);
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Registration failed. Try again.');
    }
  };

  return (
    <div className='container d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
      <div className='card p-4' style={{ width: '400px' }}>
        <h2 className='text-center mb-4'>Register</h2>

        {error && <p className="text-danger text-start">{error}</p>}
        {success && <p className="text-success text-start">{success}</p>}

        <form onSubmit={handleRegister}>
          <div className="mb-3 text-start">
            <label className='form-label'>Name</label>
            <input
              type="text"
              className='form-control'
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength="50"
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className='form-label'>Email</label>
            <input
              type="email"
              className='form-control'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='mb-3 text-start'>
            <label className='form-label'>Password</label>
            <input
              type='password'
              className='form-control'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type='submit' className='btn btn-success w-100'>
            Register
          </button>
        </form>
        <p className="mt-3 text-center">
          Already have an account? <a href="/login">Login here</a>
        </p>

      </div>
    </div>
  );
};

export default Register;
