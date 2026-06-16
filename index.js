const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
require('./models/Todo');
const todoRouter = require('./routers/todos');

const app = express();
const PORT = 5000;
const FRONTEND_ORIGIN = 'http://localhost:3000';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/backend';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use('/todos', todoRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'Todo Backend API',
    frontend: FRONTEND_ORIGIN,
    endpoints: {
      todos: `http://localhost:${PORT}/todos`,
    },
  });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('연결 성공');

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB 연결 실패:', error.message);
    process.exit(1);
  });
