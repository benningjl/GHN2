import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
 
  // Logging function to capture and display different log types
  const logData = (type, data) => {
    console.log(`[${new Date().toISOString()}] [${type}]`, data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Log the start of the login process with input data
    logData('Login Request', { email, password });

    try {
      // Log request data before sending the request
      logData('Sending Request', { email });

      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      // Log the full response data (headers, status, etc.)
      logData('Response', {
        status: response.status,
        headers: response.headers,
        data: response.data,
      });

      const { token } = response.data;

      // Log token received
      logData('Received Token', token);

      // Store token in localStorage or set it to state
      localStorage.setItem('token', token);
      setToken(token);

      // Log successful login and redirection
      logData('Login Success', { email });
      
      // Redirect to dashboard or home page after successful login
      navigate('/Dashboard');
    } catch (err) {
      // Log error details if the login attempt fails
      if (err.response) {
        logData('Error Response', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers,
        });
      } else {
        logData('Error', err.message);
      }

      // Handle error (e.g., invalid credentials)
      setError('Invalid email or password');

      // Log error displayed to user
      logData('Error Display', 'Invalid email or password');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
