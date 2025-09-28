import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [alertsData, setAlertsData] = useState(null);
  const [dataProcessing, setDataProcessing] = useState(null);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';  // For local; update for AWS
  const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET || '<your-client-secret>';  // Secure this

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${API_URL}/login`, new URLSearchParams({
        grant_type: 'password',
        client_id: 'aerowise-gateway',
        client_secret: CLIENT_SECRET,
        username,
        password,
      }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      setToken(response.data.access_token);
      alert('Login successful! JWT received.');
    } catch (err) {
      setError('Login failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const fetchAlerts = async () => {
    if (!token) return setError('Please login first.');
    setError('');
    try {
      const response = await axios.get(`${API_URL}/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlertsData(response.data);
    } catch (err) {
      setError('Alerts fetch failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const fetchData = async () => {
    if (!token) return setError('Please login first.');
    setError('');
    try {
      const response = await axios.get(`${API_URL}/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDataProcessing(response.data);
    } catch (err) {
      setError('Data fetch failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Aerowise App Demo</h1>
      
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username (demo-user)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {token && <p>JWT: {token.substring(0, 50)}...</p>}
      
      <h2>Access Backend Services</h2>
      <button onClick={fetchAlerts}>Fetch Alerts</button>
      {alertsData && <pre>{JSON.stringify(alertsData, null, 2)}</pre>}
      
      <button onClick={fetchData}>Fetch Data</button>
      {dataProcessing && <pre>{JSON.stringify(dataProcessing, null, 2)}</pre>}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;