require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const commentRoutes = require('./src/routes/commentRoutes');

const app = express();

var corsOptions = {
  //origin: "http://localhost:3000"
};

app.use(express.json());
app.use(cors(corsOptions));

app.use('/auth', authRoutes); 
app.use('/users', userRoutes);
app.use('/profile', profileRoutes);
app.use('/comments', commentRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}`);
});

module.exports = app;
