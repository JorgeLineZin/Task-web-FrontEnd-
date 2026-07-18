import { Button } from "@/components/ui/button"
// import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IconPlaylistAdd } from "@tabler/icons-react"

export function Tasks() {
  return (
    <div className="mt-5 flex justify-center">
      <div className="flex max-w-md gap-0.5">
        <Input
          placeholder="Insira sua task aqui"
          type="text"
          className="flex-1"
        />
        <Button size="icon">
          <IconPlaylistAdd stroke={2} />
        </Button>
      </div>
    </div>
  )
}
