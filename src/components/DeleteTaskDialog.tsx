import * as React from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface DeleteTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskTitle: string
  onConfirm: () => Promise<void>
}

export function DeleteTaskDialog({
  open,
  onOpenChange,
  taskTitle,
  onConfirm,
}: DeleteTaskDialogProps) {
  const [deleting, setDeleting] = React.useState(false)

  const handleConfirm = async () => {
    setDeleting(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir task</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir "{taskTitle}"? Essa ação não pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting && <Loader2 className="animate-spin" />}
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
