import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Project } from '../../types/project';
import type { Task } from '../../types/task';

const loadProjects = (): Project[] => {
  const data = localStorage.getItem('projects');
  return data ? JSON.parse(data) : [];
};

const saveProjects = (projects: Project[]) => {
  localStorage.setItem('projects', JSON.stringify(projects));
};

interface ProjectsState {
  items: Project[];
  currentProject: Project | null;
  status: 'idle' | 'loading';
}

const initialState: ProjectsState = {
  items: loadProjects(),
  currentProject: null,
  status: 'idle'
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject(state, action: PayloadAction<{
      title: string;
      description: string;
      deadline: string;
      members: string[];
    }>) {
      const newProject: Project = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      state.items.push(newProject);
      saveProjects(state.items);
    },

    updateProject(state, action: PayloadAction<Project>) {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index >= 0) {
        state.items[index] = action.payload;
        saveProjects(state.items);
      }
    },

    updateProjectStatus(state, action: PayloadAction<{
      projectId: string;
      tasks: Task[];
    }>) {
      const project = state.items.find(p => p.id === action.payload.projectId);
      if (!project) return;

      const projectTasks = action.payload.tasks.filter(
        task => task.projectId === action.payload.projectId
      );

      const allTasksCompleted = projectTasks.length > 0 && 
        projectTasks.every(task => task.status === 'completed');

      if (allTasksCompleted && project.status !== 'completed') {
        project.status = 'completed';
        saveProjects(state.items);
      } else if (!allTasksCompleted && project.status === 'completed') {
        project.status = 'active';
        saveProjects(state.items);
      }
    },

    deleteProject(state, action: PayloadAction<string>) {
      state.items = state.items.filter(p => p.id !== action.payload);
      saveProjects(state.items);
    },

    setCurrentProject(state, action: PayloadAction<string>) {
      state.currentProject = state.items.find(p => p.id === action.payload) || null;
    },

    initializeProjects(state) {
      state.items = loadProjects();
      state.status = 'idle';
    }
  }
});

export const { 
  addProject, 
  updateProject,
  updateProjectStatus,
  deleteProject, 
  setCurrentProject,
  initializeProjects
} = projectsSlice.actions;

export default projectsSlice.reducer;