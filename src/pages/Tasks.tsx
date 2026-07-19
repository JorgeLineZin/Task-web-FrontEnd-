import * as React from "react"
import { Toaster, toast } from "sonner"
import { ListChecks } from "lucide-react"

import { TaskFormDialog } from "@/components/TaskFormDialog"
import { TaskList } from "@/components/TaskList"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { tasksApi } from "@/api/tasks"
import type { Task } from "@/types/task"

type Filter = "all" | "pending" | "completed"

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendentes" },
  { value: "completed", label: "Concluídas" },
]

export function Tasks() {
  const [tasks, setTasks] = React.useState<Task[]>([])
  // Começa como true (não via setState dentro do effect) porque já sabemos
  // que vamos carregar os dados assim que o componente montar.
  const [loading, setLoading] = React.useState(true)
  const [filter, setFilter] = React.useState<Filter>("all")

  // Busca de dados é um dos dois casos em que um Effect é realmente
  // necessário (sincronizar com um sistema externo - a API). Para evitar
  // o aviso de "setState síncrono dentro do effect", as atualizações de
  // estado só acontecem dentro do callback assíncrono, depois do await -
  // nunca como a primeira instrução síncrona do corpo do effect.
  React.useEffect(() => {
    let active = true

    tasksApi
      .list()
      .then((data) => {
        if (active) setTasks(data)
      })
      .catch(() => {
        if (active) {
          toast.error(
            "Não foi possível carregar as tasks. Verifique se a API está no ar."
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const handleCreate = async (values: { title: string; content: string }) => {
    const created = await tasksApi.create(values)
    setTasks((prev) => [created, ...prev])
    toast.success("Task criada.")
  }

  const handleEdit = async (
    task: Task,
    values: { title: string; content: string }
  ) => {
    const updated = await tasksApi.update(task.id, values)
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
    toast.success("Task atualizada.")
  }

  const handleToggleComplete = async (task: Task, completed: boolean) => {
    const previous = tasks
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, is_completed: completed } : t
      )
    )
    try {
      await tasksApi.update(task.id, { is_completed: completed })
    } catch {
      setTasks(previous)
      toast.error("Não foi possível atualizar a task.")
    }
  }

  const handleDelete = async (task: Task) => {
    const previous = tasks
    setTasks((prev) => prev.filter((t) => t.id !== task.id))
    try {
      await tasksApi.remove(task.id)
      toast.success("Task excluída.")
    } catch {
      setTasks(previous)
      toast.error("Não foi possível excluir a task.")
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.is_completed
    if (filter === "completed") return Boolean(task.is_completed)
    return true
  })

  const completedCount = tasks.filter((t) => t.is_completed).length
  const progress =
    tasks.length === 0 ? 0 : (completedCount / tasks.length) * 100

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" richColors />
      <div className="container max-w-2xl py-12">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ListChecks className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight">
                Tasks
              </h1>
              <p className="text-sm text-muted-foreground">
                {tasks.length === 0
                  ? "Sua lista está vazia"
                  : `${completedCount} de ${tasks.length} concluídas`}
              </p>
            </div>
          </div>
          <TaskFormDialog onSubmit={handleCreate} />
        </header>

        {tasks.length > 0 && (
          <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="mb-4 flex gap-1">
          {FILTERS.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant="ghost"
              onClick={() => setFilter(f.value)}
              className={cn(
                "text-muted-foreground",
                filter === f.value && "bg-secondary text-secondary-foreground"
              )}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <TaskList
          tasks={filteredTasks}
          loading={loading}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}

export default Tasks
