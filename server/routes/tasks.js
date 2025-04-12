const express = require('express');
const fs = require('fs').promises;
const router = express.Router();
const TASKS_FILE = './data/tasks.json';

function suggestTaskSlot(task, userCalendar) {
  return {
    start: new Date(Date.now() + 3600000).toISOString(),
    end: new Date(Date.now() + 3600000 + task.duration * 60000).toISOString()
  };
}

router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read tasks' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newTask = req.body;
    newTask.id = Date.now();
    newTask.username = req.user.username; // Ajouter le username du token
    newTask.suggestedSlot = suggestTaskSlot(newTask, {});
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    const tasks = JSON.parse(data);
    tasks.push(newTask);
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    let tasks = JSON.parse(data);
    tasks = tasks.filter(task => task.id !== taskId);
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
