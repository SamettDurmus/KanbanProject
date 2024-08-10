import { Router } from 'express';

const router = Router();

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

let tasks: Task[] = [
    { id: '1', title: 'Görev 1', description: 'İlk görev', status: 'Yapılacak' },

];

router.get('/tasks', (req, res) => {
  res.json(tasks);
});

router.post('/tasks', (req, res) => {
  const newTask: Task = req.body;
  tasks.push(newTask);
  res.status(201).json(newTask);
});

router.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const updatedTask = req.body;

  tasks = tasks.map(task => (task.id === id ? updatedTask : task));
  res.json(updatedTask);
});

router.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  tasks = tasks.filter(task => task.id !== id);
  res.status(204).send();
});

export default router;