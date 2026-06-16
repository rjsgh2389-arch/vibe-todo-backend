const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
require('./models/Todo');
const todoRouter = require('./routers/todos');

const app = express();
const PORT = process.env.PORT || 5000;
const DEFAULT_ORIGINS =
  'http://localhost:3000,https://vibe-todo-frontend-omega-rosy.vercel.app';
const ALLOWED_ORIGINS = (process.env.FRONTEND_ORIGINS || DEFAULT_ORIGINS)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/backend';

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

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
    allowedOrigins: ALLOWED_ORIGINS,
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
