import { apiRequest } from "./config";

export interface Note {
  id: number
  title: string
  content: string
  color: "blue" | "yellow" | "green" | "red" | "purple"
  archived: boolean
  createdAt: string
  updatedAt: string
}

export interface SpringPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  first: boolean;
  empty: boolean;
}

export interface NoteCreateRequest extends Omit<Note, "id" | "createdAt" | "updatedAt" | "archived"> {}

export async function getNotes(): Promise<Note[]> {
  try {
    const result = await apiRequest<SpringPage<Note>>(`/notes`, {
      method: "GET",
    })

    return result.content ? result.content : []
    
  } catch (error) {
    console.error("Error fetching notes:", error)
    return []
  }
}

export async function createNote(dto: NoteCreateRequest): Promise<Note> {
  return apiRequest<Note>(`/notes`, {
    method: "POST",
    body: JSON.stringify(dto),
  })
}

export async function deleteNote(noteId: number): Promise<void> {
  return apiRequest<void>(`/notes/${noteId}`, {
    method: "DELETE",
  })
}

export async function editNote(noteId: number, dto: Partial<Omit<Note, "id" | "createdAt" | "updatedAt" | "archived">>): Promise<Note> {
  return apiRequest<Note>(`/notes/${noteId}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  })
}

export async function toggleArchiveNote(noteId: number): Promise<void> {
  return apiRequest<void>(`/notes/${noteId}/archive`, {
    method: "PATCH",
  })
}