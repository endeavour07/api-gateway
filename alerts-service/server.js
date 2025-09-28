const express = require('express');
const app = express();
app.use(express.json());

app.get('/alerts', (req, res) => {
  res.json({ message: 'Alerts fetched successfully', data: [{ id: 1, type: 'high-priority' }] });
});

app.post('/alerts', (req, res) => {
  res.json({ message: 'Alert created', alert: req.body });
});

app.listen(3001, () => console.log('Alerts Service on port 3001'));