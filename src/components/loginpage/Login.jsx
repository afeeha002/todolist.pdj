import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/account/login/', {
        email,
        password,
      });

      console.log('Login successful:', response.data);
      setSuccess('Login successful!');

      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
  
      // ✅ Redirect to main page
      navigate('/main');
      
    } catch (error) {
      console.error('Login failed:', error.response?.data?.error || error.message);
      // setError(error.response?.data?.error || 'Login failed. Please try again.');
      setError(
        error.response?.data?.detail ||  // standard JWT error
        error.response?.data?.error ||   // custom error
        'Login failed. Please try again.'
      );
    }
  };

  return (
    <div className='container d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
      <div className='card p-4' style={{ width: '400px' }}>
        <h2 className='text-center mb-4'>Login</h2>

        {error && <p className="text-danger text-start">{error}</p>}
        {success && <p className="text-success text-start">{success}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-3 text-start">
            <label className='form-label'>Email</label>
            <input
              type="email"
              className='form-control'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength="50"
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

          <button type='submit' className='btn btn-primary w-100'>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
