import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './slices/projectSlice';
import tasksReducer from './slices/taskSlice';
import teamReducer from './slices/teamSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    tasks: tasksReducer,
    team: teamReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;