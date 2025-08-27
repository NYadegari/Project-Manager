import { useAuth } from "../../context/Authentication";
import styles from "./Dashboard.module.scss";
import { useAppSelector } from "../../redux/hooks";
import { selectAllTasks } from "../../redux/slices/taskSlice";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { Project } from '../../types/project'; 

const Dashboard = () => {
  const { auth } = useAuth();
  
  const tasks = useAppSelector(selectAllTasks);
  const projects = useAppSelector((state) => state.projects.items);
  const teamMembers = useAppSelector((state) => state.team.members);

  const tasksPerMemberData = teamMembers.map((member: { id: string; name: string }) => {
    return {
      name: member.name,
      tasks: tasks.filter(task => task.memberIds.includes(member.id)).length
    };
  });

  const projectProgressData = projects.map((project: { id: string; title: string }) => {
    const projectTasks = tasks.filter(task => task.projectId === project.id);
    const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
    const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;
    
    return {
      name: project.title,
      progress
    };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Welcome to Trellis{auth ? `, ${auth.user.name}!` : "!"}</h1>
      
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3>Total Projects</h3>
          <p className={styles.statValue}>{projects.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Tasks</h3>
          <p className={styles.statValue}>{tasks.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Team Members</h3>
          <p className={styles.statValue}>{teamMembers.length}</p>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Projects</h2>
      {projects.length == 0 ? <div className={styles.NoActiveProject}>No active project</div> :
        <div className={styles.projectsGrid}>
          {projects.map((project: Project) => (
            <div key={project.id} className={styles.projectCard}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <div className={styles.projectDetails}>
                <p><strong>Deadline:</strong> {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set'}</p>
                <p><strong>Status:</strong> {project.status}</p>
                <p><strong>Members:</strong> {project.members.length}</p>
              </div>
            </div>
          ))}
        </div>
      }
      

      <h2 className={styles.sectionTitle}>Diagrams</h2>
      <div className={styles.chartsContainer}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Tasks per Team Member</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={tasksPerMemberData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" fill="#8884d8" name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Project Progress</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectProgressData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="progress"
                  nameKey="name"
                  label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {projectProgressData.map((entry: unknown, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;