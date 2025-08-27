import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TeamMember } from '../../types/team';

const loadTeamMembers = (): TeamMember[] => {
  const data = localStorage.getItem('teamMembers');
  return data ? JSON.parse(data) : [];
};

const saveTeamMembers = (members: TeamMember[]) => {
  localStorage.setItem('teamMembers', JSON.stringify(members));
};

interface TeamState {
  members: TeamMember[];
}

const initialState: TeamState = {
  members: loadTeamMembers(), 
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    addMember(state, action: PayloadAction<Omit<TeamMember, 'id'>>) {
      const newMember: TeamMember = {
        ...action.payload,
        id: Date.now().toString(), 
      };
      state.members.push(newMember);
      saveTeamMembers(state.members);
    },

    updateMember(state, action: PayloadAction<TeamMember>) {
      const index = state.members.findIndex(m => m.id === action.payload.id);
      if (index >= 0) {
        state.members[index] = action.payload;
        saveTeamMembers(state.members);
      }
    },

    removeMember(state, action: PayloadAction<string>) {
      state.members = state.members.filter(m => m.id !== action.payload);
      saveTeamMembers(state.members);
    },

    initializeTeam(state) {
      state.members = loadTeamMembers();
    },
  },
});

export const { addMember, updateMember, removeMember, initializeTeam } = teamSlice.actions;
export default teamSlice.reducer;