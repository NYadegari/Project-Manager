import { createEntityAdapter, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '../../types/task';
import type { RootState } from '../store';

type TaskStatus = 'todo' | 'in-progress' | 'completed';
type FilterStatus = 'all' | TaskStatus;
type Priority = 'low' | 'medium' | 'high';
type LoadingStatus = 'idle' | 'loading';

const loadTasks = (): Task[] => {
  const data = localStorage.getItem('tasks');
  return data ? JSON.parse(data) : [];
};

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const tasksAdapter = createEntityAdapter<Task>({
  sortComparer: (a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    const dateA = a.deadline ? new Date(a.deadline).getTime() : 0;
    const dateB = b.deadline ? new Date(b.deadline).getTime() : 0;
    return dateA - dateB;
  }
});

interface TaskFilters {
  status: FilterStatus;
  priority: 'all' | Priority;
}

interface TasksState {
  ids: string[];
  entities: Record<string, Task>;
  filters: TaskFilters;
  currentTask: Task | null;
  status: LoadingStatus;
}

const initialState: TasksState = {
  ...tasksAdapter.getInitialState(),
  filters: {
    status: 'all',
    priority: 'all'
  },
  currentTask: null,
  status: 'idle'
};

const preloadedState = {
  ...initialState,
  ...tasksAdapter.setAll(initialState, loadTasks())
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: preloadedState,
  reducers: {
    addTask: {
      reducer: (state, action: PayloadAction<Task>) => {
        tasksAdapter.addOne(state, action.payload);
        saveTasks(tasksAdapter.getSelectors().selectAll(state));
      },
      prepare: (taskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => ({
        payload: {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          status: 'todo' as const
        }
      })
    },

    updateTask: {
      reducer: (state, action: PayloadAction<Task>) => {
        tasksAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload
        });
        saveTasks(tasksAdapter.getSelectors().selectAll(state));
      },
      prepare: (task: Task) => ({ payload: task })
    },

    deleteTask(state, action: PayloadAction<string>) {
      tasksAdapter.removeOne(state, action.payload);
      saveTasks(tasksAdapter.getSelectors().selectAll(state));
    },

    setCurrentTask(state, action: PayloadAction<string | null>) {
      state.currentTask = action.payload 
        ? tasksAdapter.getSelectors().selectById(state, action.payload)
        : null;
    },

    initializeTasks(state) {
      tasksAdapter.setAll(state, loadTasks());
      state.status = 'idle';
    },

    setTaskFilter(state, action: PayloadAction<{ 
      field: keyof TaskFilters; 
      value: string 
    }>) {
      const { field, value } = action.payload;
      if (field in state.filters) {
        (state.filters[field] as any) = value;
      }
    },

    markTaskAsComplete(state, action: PayloadAction<string>) {
      tasksAdapter.updateOne(state, {
        id: action.payload,
        changes: { status: 'completed' }
      });
      saveTasks(tasksAdapter.getSelectors().selectAll(state));
    },

    markTaskAsInProgress(state, action: PayloadAction<string>) {
      tasksAdapter.updateOne(state, {
        id: action.payload,
        changes: { status: 'in-progress' }
      });
      saveTasks(tasksAdapter.getSelectors().selectAll(state));
    }
  }
});

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectTaskIds
} = tasksAdapter.getSelectors((state: RootState) => state.tasks);

export const { 
  addTask,
  updateTask,
  deleteTask,
  setCurrentTask,
  initializeTasks,
  setTaskFilter,
  markTaskAsComplete,
  markTaskAsInProgress
} = tasksSlice.actions;



export default tasksSlice.reducer;