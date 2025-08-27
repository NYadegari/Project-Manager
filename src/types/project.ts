interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  deadline?: string;
  members: string[];
}

interface CreateProjectDto {
  title: string;
  description: string;
  deadline?: string;
}

type ProjectStatus = Project['status'];

export type { Project, CreateProjectDto, ProjectStatus };