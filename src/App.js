import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Register from './Register';
import Login from './Login';
import UsersList from './UsersList';
import Dashboard from './Dashboard';
import PrivateRoute from './PrivateRoute';
import ErrorBoundary from './ErrorBoundary';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Validate token on page load
    if (token) {
      fetch('http://localhost:5000')
        .then((response) => response.text())
        .then((data) => {
          setMessage(data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    window.location.href = '/login';
  };

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
            <div>
              <h2>Backend Response:</h2>
              <p>{message}</p> {/* Display the backend response here */}
            </div>
            {token && <button onClick={handleLogout}>Logout</button>}
          </header>
          <div>
            <Routes>
              <Route path="/login" element={<Login setToken={setToken} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
              <Route path="/users" element={<PrivateRoute component={UsersList} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
