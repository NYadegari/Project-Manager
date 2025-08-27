import type { User } from "./user";

interface TeamMember extends User { 
  role: 'admin' | 'regular';
  joinedAt: string;
}


export type { TeamMember };