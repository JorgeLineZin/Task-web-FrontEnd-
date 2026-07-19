import { ClipboardList, Loader2 } from "lucide-react"

import { TaskItem } from "@/components/TaskItem"
import type { Task } from "@/types/task"

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  onToggleComplete: (task: Task, completed: boolean) => Promise<void>
  onEdit: (
    task: Task,
    values: { title: string; content: string }
  ) => Promise<void>
  onDelete: (task: Task) => Promise<void>
}

export function TaskList({
  tasks,
  loading,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm">Carregando tasks…</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center text-muted-foreground">
        <ClipboardList className="h-8 w-8" />
        <div>
          <p className="font-medium text-foreground">Nenhuma task por aqui</p>
          <p className="text-sm">Crie a primeira task para começar.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
