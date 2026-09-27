require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const weatherRoutes = require('./routes/weather');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/weather', weatherRoutes);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
