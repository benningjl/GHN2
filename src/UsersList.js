import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Register from './Register';
import Login from './Login';
import axios from 'axios';
import ErrorBoundary from './ErrorBoundary';

const UsersList = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        const response = await axios.get('http://127.0.0.1:5000/api/users', config);
        setUsers(response.data);
      } catch (error) {
        setError('Error fetching users: ' + error.response.data.message);
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <div>
      <h2>Users List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // If there's no token in localStorage, redirect to login
    if (!token) {
      window.location.href = '/login';
    } else {
      // Fetch backend response
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
          {!token ? (
            <>
              <Login setToken={setToken} />
              <Register />
            </>
          ) : (
            <UsersList token={token} />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
