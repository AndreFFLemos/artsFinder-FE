export interface Specialty {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  location: string;
  created_at: string;
  role: 'user' | 'admin';
  specialties: Specialty[];
  // Só presente em /user/me
  email?: string;
}

export interface Ad {
  id: number;
  title: string;
  body: string;
  created_at: string;
  user: User;
  specialties: Specialty[];
}

export interface Message {
  id: number;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  threadId: number;
  sender: User;
  receiver: User;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export type FormState = { error?: string; success?: string } | undefined;
