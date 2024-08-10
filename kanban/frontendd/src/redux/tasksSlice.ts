import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './store';

interface Task {
  id: string;
  title: string;
  status: string;
}

interface TasksState {
  tasks: Task[];
  boards: string[];
}

const initialState: TasksState = {
  tasks: [],
  boards: ['To Do', 'In Progress', 'Done'],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    updateTaskInState: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    addBoard: (state, action: PayloadAction<string>) => {
      state.boards.push(action.payload);
    }
  },
});

export const { setTasks, addTask, updateTaskInState, deleteTask, addBoard } = tasksSlice.actions;

export const fetchTasks = (): AppThunk => dispatch => {
  const tasks = localStorage.getItem('tasks');
  if (tasks) {
    dispatch(setTasks(JSON.parse(tasks)));
  }
};

export default tasksSlice.reducer;
