const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const userRouter = require('../routes/userRoutes');
const postRouter = require('../routes/postRoutes');
const assignmentRouter = require('../routes/assignmentRoutes');
const fileRouter = require('../routes/fileRoutes');

const app = express();

// Middleware
//Express body parser
app.use(express.json());
app.use(cookieParser());

app.use(cors());

// Routes
app.use('/api/v1/users/', userRouter);
app.use('/api/v1/posts/', postRouter);
app.use('/api/v1/assignments/', assignmentRouter);
app.use('/api/v1/files/', fileRouter);

//Error Handling
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Page not found',
  });
});

module.exports = app;