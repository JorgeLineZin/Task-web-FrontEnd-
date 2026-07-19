import * as React from "react"
import { Loader2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Task } from "@/types/task"

interface TaskFormDialogProps {
  /** Quando presente, o diálogo edita esta task. Caso contrário, cria uma nova. */
  task?: Task
  onSubmit: (values: { title: string; content: string }) => Promise<void>
  /** Usado no modo de edição para controlar o diálogo a partir de fora (menu de ações). */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Esconde o botão de disparo padrão (usado quando o diálogo é aberto externamente). */
  hideTrigger?: boolean
}

export function TaskFormDialog({
  task,
  onSubmit,
  open: openProp,
  onOpenChange,
  hideTrigger,
}: TaskFormDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = openProp ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen
  const isEditing = Boolean(task)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger>
          <Button>
            <Plus />
            Nova task
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar task" : "Nova task"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize o título e a descrição da task."
              : "Descreva o que precisa ser feito."}
          </DialogDescription>
        </DialogHeader>

        {/*
          A key força o React a montar uma instância nova de TaskFormFields
          sempre que o diálogo abre ou a task muda, então os campos já
          nascem com os valores certos (via useState(() => ...)) sem
          precisar de um useEffect para "sincronizar" esse estado depois.
          É o padrão recomendado pelo React para resetar estado quando uma
          prop muda: https://react.dev/learn/you-might-not-need-an-effect
        */}
        <TaskFormFields
          key={open ? (task?.id ?? "new") : "closed"}
          task={task}
          isEditing={isEditing}
          onCancel={() => setOpen(false)}
          onSubmit={async (values) => {
            await onSubmit(values)
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

interface TaskFormFieldsProps {
  task?: Task
  isEditing: boolean
  onCancel: () => void
  onSubmit: (values: { title: string; content: string }) => Promise<void>
}

function TaskFormFields({
  task,
  isEditing,
  onCancel,
  onSubmit,
}: TaskFormFieldsProps) {
  const [title, setTitle] = React.useState(task?.title ?? "")
  const [content, setContent] = React.useState(task?.content ?? "")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!trimmedTitle || !trimmedContent) {
      setError("Preencha o título e a descrição.")
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({ title: trimmedTitle, content: trimmedContent })
    } catch {
      setError("Não foi possível salvar a task. Tente novamente.")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Revisar proposta do cliente"
            autoFocus
            maxLength={255}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="content">Descrição</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Detalhes sobre a task"
            rows={4}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          {isEditing ? "Salvar alterações" : "Criar task"}
        </Button>
      </DialogFooter>
    </form>
  )
}
