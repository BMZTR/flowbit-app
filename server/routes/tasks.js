const express = require('express');
const fs = require('fs').promises;
const moment = require('moment');
const router = express.Router();

const TASKS_FILE = './data/tasks.json';

const userCalendar = [
  { start: '2025-04-12T09:00:00Z', end: '2025-04-12T10:00:00Z', title: 'Réunion' },
  { start: '2025-04-12T14:00:00Z', end: '2025-04-12T15:00:00Z', title: 'Call client' }
];

function suggestTaskSlot(task, calendar) {
  const today = moment().startOf('day');
  const endOfDay = moment(task.deadline).endOf('day');
  let current = moment(today).set({ hour: 8, minute: 0 });
  const workEnd = moment(today).set({ hour: 18, minute: 0 });

  while (current.isBefore(workEnd) && current.isBefore(endOfDay)) {
    const slotEnd = moment(current).add(task.duration, 'minutes');
    const isFree = !calendar.some(event => {
      const eventStart = moment(event.start);
      const eventEnd = moment(event.end);
      return current.isBetween(eventStart, eventEnd, null, '[]') ||
             slotEnd.isBetween(eventStart, eventEnd, null, '[]') ||
             eventStart.isBetween(current, slotEnd, null, '[]');
    });

    if (isFree) {
      return { start: current.toISOString(), end: slotEnd.toISOString() };
    }
    current.add(30, 'minutes');
  }
  return null;
}

router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read tasks' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newTask = req.body;
    newTask.id = Date.now();
    newTask.suggestedSlot = suggestTaskSlot(newTask, userCalendar);

    const data = await fs.readFile(TASKS_FILE, 'utf8');
    const tasks = JSON.parse(data);
    tasks.push(newTask);

    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

module.exports = router;