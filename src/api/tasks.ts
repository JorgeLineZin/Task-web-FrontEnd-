import { api } from "./client"
import type { Task, CreateTaskPayload, UpdateTaskPayload } from "@/types/task"

export const tasksApi = {
  async list(): Promise<Task[]> {
    const { data } = await api.get<Task[]>("/tasks")
    return data
  },

  async get(id: number): Promise<Task> {
    const { data } = await api.get<Task>(`/tasks/${id}`)
    return data
  },

  async create(payload: CreateTaskPayload): Promise<Task> {
    const { data } = await api.post<Task>("/tasks", payload)
    return data
  },

  async update(id: number, payload: UpdateTaskPayload): Promise<Task> {
    const { data } = await api.put<Task>(`/tasks/${id}`, payload)
    return data
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`)
  },
}
