import { useState } from 'react';
import styles from './TeamManagment.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addMember } from '../../redux/slices/teamSlice';
import { useAuth } from '../../context/Authentication';

interface TeamMemberForm {
  name: string;
  familyName: string;
  role: 'admin' | 'regular';
}

const TeamManagement = () => {
  const dispatch = useAppDispatch();
  const teamMembers = useAppSelector((state) => state.team.members);
  const { auth } = useAuth();
  const [formData, setFormData] = useState<TeamMemberForm>({
    name: '',
    familyName: '',
    role: 'regular'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.familyName) return;
    
    dispatch(addMember({
      name: `${formData.name} ${formData.familyName}`,
      password: "NotImportant",
      role: formData.role,
      joinedAt: new Date().toISOString().split('T')[0] 
    }));
    
    setFormData({
      name: '',
      familyName: '',
      role: 'regular'
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Team Management</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">First Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="familyName">Family Name</label>
          <input
            type="text"
            id="familyName"
            name="familyName"
            value={formData.familyName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="regular">Regular Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className={styles.addButton} disabled={ auth ? false : true }>
          Add Team Member
        </button>
      </form>
      {/* {auth ? null : <div className={styles.NoAuth}>sign up to manage team</div>} */}
      <div className={styles.tableContainer}>
        <table className={styles.membersTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Join Date</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td className={member.role === 'admin' ? styles.adminRole : styles.regularRole}>
                  {member.role}
                </td>
                <td>{member.joinedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TeamManagement;