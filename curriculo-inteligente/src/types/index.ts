export interface PersonalData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Básico' | 'Intermediário' | 'Avançado';
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrentJob: boolean;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface Resume {
  id?: string;
  userId?: string;
  personalData: PersonalData;
  skills: Skill[];
  experiences: Experience[];
  createdAt?: string;
  updatedAt?: string;
}
