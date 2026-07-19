import * as React from "react"
import { Pencil, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { TaskFormDialog } from "@/components/TaskFormDialog"
import { DeleteTaskDialog } from "@/components/DeleteTaskDialog"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/task"

interface TaskItemProps {
  task: Task
  onToggleComplete: (task: Task, completed: boolean) => Promise<void>
  onEdit: (
    task: Task,
    values: { title: string; content: string }
  ) => Promise<void>
  onDelete: (task: Task) => Promise<void>
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

export function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const completed = Boolean(task.is_completed)

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-lg border bg-card p-4 shadow-sm transition-colors",
        completed && "bg-secondary/40"
      )}
    >
      <Checkbox
        checked={completed}
        onCheckedChange={(checked) => onToggleComplete(task, checked === true)}
        className="mt-1"
        aria-label={
          completed ? "Marcar como pendente" : "Marcar como concluída"
        }
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={cn(
              "font-display leading-tight font-semibold",
              completed && "text-muted-foreground line-through"
            )}
          >
            {task.title}
          </h3>
          <Badge variant={completed ? "accent" : "secondary"}>
            {completed ? "Concluída" : "Pendente"}
          </Badge>
        </div>
        <p
          className={cn(
            "mt-1 text-sm text-muted-foreground",
            completed && "line-through"
          )}
        >
          {task.content}
        </p>
        <p className="mt-2 text-xs text-muted-foreground/70">
          Atualizada em {dateFormatter.format(new Date(task.updated_at))}
        </p>
      </div>

      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setEditOpen(true)}
          aria-label="Editar task"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeleteOpen(true)}
          aria-label="Excluir task"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <TaskFormDialog
        task={task}
        open={editOpen}
        onOpenChange={setEditOpen}
        hideTrigger
        onSubmit={(values) => onEdit(task, values)}
      />

      <DeleteTaskDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        taskTitle={task.title}
        onConfirm={() => onDelete(task)}
      />
    </div>
  )
}
