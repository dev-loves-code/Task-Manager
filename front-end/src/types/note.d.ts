export interface NoteDto {
  title: string;
  content: string; // match backend
}

export interface GetNoteDto {
  id: number;
  title: string;
  content: string; // match backend
  createdAt: Date;
}
