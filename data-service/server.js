const express = require('express');
const app = express();
app.use(express.json());

app.get('/data', (req, res) => {
  res.json({ message: 'Data processed', predictions: [0.85, 0.72] });
});

app.listen(3002, () => console.log('Data Service on port 3002'));