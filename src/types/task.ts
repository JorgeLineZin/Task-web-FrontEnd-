export interface Task {
  id: number
  title: string
  content: string
  is_completed: boolean | 0 | 1
  created_at: string
  updated_at: string
}

export interface CreateTaskPayload {
  title: string
  content: string
}

export interface UpdateTaskPayload {
  title?: string
  content?: string
  is_completed?: boolean
}
