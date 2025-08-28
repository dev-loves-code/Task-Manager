import type { GetNoteDto } from "./note";

export interface TaskDto {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  createdAt: string;
  notes: GetNoteDto[];
}

export interface CreateTaskDto {
  title: string;
  description: string;
  dueDate: string;
}

export interface UpdateTaskDto {
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}
