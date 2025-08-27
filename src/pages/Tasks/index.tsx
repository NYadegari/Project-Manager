import { useState } from 'react';
import styles from './Tasks.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  addTask, 
  updateTask, 
  deleteTask, 
  selectAllTasks,
  markTaskAsComplete 
} from '../../redux/slices/taskSlice';
import { useAuth } from '../../context/Authentication';
import type { Task } from '../../types';

const Tasks = () => {
  const dispatch = useAppDispatch();
  const { auth } = useAuth();
  
  const tasks = useAppSelector(selectAllTasks);
  const projects = useAppSelector((state) => state.projects.items);
  const teamMembers = useAppSelector((state) => state.team.members);

  const [formData, setFormData] = useState({
    description: '',
    deadline: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    projectId: '',
    memberIds: [] as string[],
  });

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all' as 'all' | 'completed' | 'in-progress' | 'todo',
    priority: 'all' as 'all' | 'low' | 'medium' | 'high',
    member: 'all',
    dateRange: {
      start: '',
      end: ''
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberSelect = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      memberIds: prev.memberIds.includes(memberId)
        ? prev.memberIds.filter(id => id !== memberId)
        : [...prev.memberIds, memberId]
    }));
  };

  const handleProjectSelect = (projectId: string) => {
    setFormData(prev => ({ ...prev, projectId }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.projectId) return;

    if (editingTaskId) {
    const existingTask = tasks.find(t => t.id === editingTaskId);
    if (!existingTask) return;
    
    dispatch(updateTask({
      ...existingTask, 
      ...formData,    
      id: editingTaskId
    }));
  } else {
    dispatch(addTask({
      description: formData.description,
      deadline: formData.deadline,
      priority: formData.priority,
      projectId: formData.projectId,
      memberIds: formData.memberIds
    }));
  }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      description: '',
      deadline: '',
      priority: 'medium',
      projectId: '',
      memberIds: [],
    });
    setEditingTaskId(null);
  };

  const handleEdit = (task: Task) => {
    setFormData({
      description: task.description,
      deadline: task.deadline || '',
      priority: task.priority,
      projectId: task.projectId,
      memberIds: task.memberIds,
    });
    setEditingTaskId(task.id);
  };

  const handleCompleteTask = (taskId: string) => {
    dispatch(markTaskAsComplete(taskId));
  };

  const handleStartTask = (taskId: string) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (taskToUpdate) {
      dispatch(updateTask({
        ...taskToUpdate,
        status: 'in-progress'
      }));
    }
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const matchesSearch = task.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || task.status === filters.status;
      
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
      
      const matchesMember = filters.member === 'all' || 
        task.memberIds.includes(filters.member);
      
      let matchesDate = true;
      if (filters.dateRange.start && task.deadline) {
        matchesDate = matchesDate && new Date(task.deadline) >= new Date(filters.dateRange.start);
      }
      if (filters.dateRange.end && task.deadline) {
        matchesDate = matchesDate && new Date(task.deadline) <= new Date(filters.dateRange.end);
      }
      
      return matchesSearch && matchesStatus && matchesPriority && matchesMember && matchesDate;
    });
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Task Management</h1>

        <form onSubmit={handleSubmit} className={styles.taskForm}>
          <div className={styles.formGroup}>
            <label>Task Description *</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Enter task description"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Priority *</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Project *</label>
              <div className={styles.radioGroup}>
                {projects.map(project => (
                  <div key={project.id} className={styles.radioOption}>
                    <input
                      type="radio"
                      id={`project-${project.id}`}
                      name="project"
                      checked={formData.projectId === project.id}
                      onChange={() => handleProjectSelect(project.id)}
                      required
                    />
                    <label htmlFor={`project-${project.id}`}>
                      {project.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Assign Team Members</label>
              <div className={styles.checkboxGroup}>
                {teamMembers.map(member => (
                  <div key={member.id} className={styles.checkboxOption}>
                    <input
                      type="checkbox"
                      id={`member-${member.id}`}
                      checked={formData.memberIds.includes(member.id)}
                      onChange={() => handleMemberSelect(member.id)}
                    />
                    <label htmlFor={`member-${member.id}`}>
                      {member.name} ({member.role})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton} disabled={ auth ? false : true }>
              {editingTaskId ? 'Update Task' : 'Add Task'}
            </button>
            {editingTaskId && (
              <button 
                type="button" 
                onClick={resetForm}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      {/* {auth ? null : <div className={styles.NoAuth}>sign up to manage tasks</div>} */}
      <div className={styles.filterControls}>
        {/* Search Input */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Status Filter */}
        <div className={styles.filterGroup}>
          <label>Status:</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value as any})}
          >
            <option value="all">All</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Priority:</label>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({...filters, priority: e.target.value as any})}
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Assigned To:</label>
          <select
            value={filters.member}
            onChange={(e) => setFilters({...filters, member: e.target.value})}
          >
            <option value="all">All Members</option>
            {teamMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div className={styles.filterGroup}>
          <label>Date Range:</label>
          <div className={styles.dateRangeContainer}>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters({
                ...filters, 
                dateRange: {...filters.dateRange, start: e.target.value}
              })}
              placeholder="Start date"
            />
            <span>to</span>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters({
                ...filters, 
                dateRange: {...filters.dateRange, end: e.target.value}
              })}
              placeholder="End date"
            />
          </div>
        </div>
      </div>
      <div className={styles.tasksTableContainer}>
        <table className={styles.tasksTable}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Assigned To</th>
              <th>Deadline</th>
              <th>Project</th>
              <th>Priority</th>
              <th>Status</th>
              {auth && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => {
              const project = projects.find(p => p.id === task.projectId);
              return (
                <tr key={task.id} className={styles[task.status]}>
                  <td>{task.description}</td>
                  <td>
                    {task.memberIds.length > 0 ? (
                      <div className={styles.memberList}>
                        {task.memberIds.map(memberId => {
                          const member = teamMembers.find(m => m.id === memberId);
                          return member ? (
                            <span key={memberId} className={styles.memberBadge}>
                              {member.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <span className={styles.unassigned}>Unassigned</span>
                    )}
                  </td>
                  <td>
                    {task.deadline ? (
                      new Date(task.deadline).toLocaleDateString()
                    ) : (
                      <span className={styles.noDeadline}>No deadline</span>
                    )}
                  </td>
                  <td>{project?.title || 'Unknown Project'}</td>
                  <td>
                    <span className={`${styles.priorityBadge} ${styles[task.priority]}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[task.status]}`}>
                      {task.status}
                    </span>
                  </td>
                  {auth && (
                    <td className={styles.actionsCell}>
                      {task.status !== 'completed' && (
                        <div className={styles.EditComplete}>
                          <button 
                            onClick={() => handleEdit(task)} 
                            className={styles.editButton}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            className={styles.completeButton}
                          >
                            Complete
                          </button>
                          { task.status === 'todo' && (<button
                            onClick={() => handleStartTask(task.id)}
                            className={styles.startButton}
                          >
                            Start
                          </button>)}
                        </div>
                      )}
                      <button
                        onClick={() => dispatch(deleteTask(task.id))}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;