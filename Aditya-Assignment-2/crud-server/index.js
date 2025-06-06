const express = require('express');
const userRoutes = require('./routes/users');
require('dotenv').config();

const app = express();
app.use(express.json()); // Parse JSON body
app.use('/users', userRoutes); // Mount user routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
