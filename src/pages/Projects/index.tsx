import { useEffect, useState } from 'react';
import styles from './Projects.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addProject, updateProjectStatus } from '../../redux/slices/projectSlice';
import { useAuth } from '../../context/Authentication';
import { selectAllTasks } from '../../redux/slices/taskSlice';

const ProjectsPage = () => {
  const dispatch = useAppDispatch();
  const {auth} = useAuth();
  const tasks = useAppSelector(selectAllTasks);
  const projects = useAppSelector((state) => state.projects.items);
  const teamMembers = useAppSelector((state) => state.team.members);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    members: [] as string[]
  });
  

  useEffect(() => {
    projects.forEach(project => {
      dispatch(updateProjectStatus({ 
        projectId: project.id, 
        tasks 
      }));
    });
  }, [tasks, dispatch, projects]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberSelect = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(memberId)
        ? prev.members.filter(id => id !== memberId)
        : [...prev.members, memberId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newProject = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    dispatch(addProject(newProject));

    setFormData({
      title: '',
      description: '',
      deadline: '',
      members: []
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Projects</h1>
        <form onSubmit={handleSubmit} className={styles.projectForm}>
        <div className={styles.formGroup}>
          <label>Project Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
          <div className={styles.formGroup}>
            <label>Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Team Members</label>
            <div className={styles.memberSelection}>
              {teamMembers.map(member => (
                <div key={member.id} className={styles.memberOption}>
                  <input
                    type="checkbox"
                    id={`member-${member.id}`}
                    checked={formData.members.includes(member.id)}
                    onChange={() => handleMemberSelect(member.id)}
                  />
                  <label htmlFor={`member-${member.id}`}>
                    {member.name} ({member.role})
                  </label>
                </div>
              ))}
            </div>
          </div>
        <button type="submit" className={styles.submitButton} disabled={ auth ? false : true }>
          Create Project
        </button>
        </form>
        {/* {auth ? null : <div className={styles.NoAuth}>sign up to manage projects</div>} */}
        <div className={styles.projectsGrid}>
          {projects.map(project => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.cardHeader}>
                <h3>{project.title}</h3>
                <span className={project.status === "active" ? styles.activeBadge : styles.completedBadge}>{project.status}</span>
              </div>
              <p className={styles.description}>{project.description}</p>
              
              <div className={styles.cardDetails}>
                <div>
                  <strong>Created: </strong> 
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
                {project.deadline && (
                  <div>
                    <strong>Deadline: </strong> 
                    {new Date(project.deadline).toLocaleDateString()}
                  </div>
                )}
                <div>
                  <strong>Team: </strong>
                  {project.members.length > 0 
                    ? project.members.map(id => (
                        <span key={id} className={styles.memberTag}>
                          {teamMembers.find(m => m.id === id)?.name}
                        </span>
                      ))
                    : 'No members assigned'}
                </div>
              </div>
            </div>
          ))}
        </div>
      
    </div>
  );
};

export default ProjectsPage;