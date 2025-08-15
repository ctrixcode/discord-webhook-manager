import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface NotificationToggleProps {
  title: string
  description: string
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function NotificationToggle({
  title,
  description,
  defaultChecked = false,
  onCheckedChange,
}: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label className="text-base text-white">{title}</Label>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
      <Switch
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-purple-600"
      />
    </div>
  )
}
