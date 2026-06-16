const express = require('express');
const Todo = require('../models/Todo');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });

    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: '할 일 목록 조회에 실패했습니다.', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: '할 일 내용을 입력해주세요.' });
    }

    const todo = await Todo.create({ title: title.trim() });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: '할 일 생성에 실패했습니다.', error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { title, completed } = req.body;
    const update = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: '할 일 내용을 입력해주세요.' });
      }
      update.title = title.trim();
    }

    if (completed !== undefined) {
      update.completed = completed;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: '수정할 내용을 입력해주세요.' });
    }

    const todo = await Todo.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({ message: '할 일을 찾을 수 없습니다.' });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: '할 일 수정에 실패했습니다.', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: '할 일을 찾을 수 없습니다.' });
    }

    res.json({ message: '할 일이 삭제되었습니다.', todo });
  } catch (error) {
    res.status(500).json({ message: '할 일 삭제에 실패했습니다.', error: error.message });
  }
});

module.exports = router;
