interface Task {
  id: string;
  description: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  memberIds: string[];
  createdAt: string;
  status: 'todo' | 'in-progress' | 'completed';
}

interface TaskFilters {
  status?: Task['status'];
  priority?: Task['priority'];
  assignee?: string;
  dueAfter?: Date;
  dueBefore?: Date;
}

export type { Task, TaskFilters };