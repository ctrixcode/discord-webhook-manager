"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { addWebhook, validateWebhookUrl } from "@/lib/webhook-storage"
import { Plus, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AddWebhookDialogProps {
  onWebhookAdded: () => void
}

export function AddWebhookDialog({ onWebhookAdded }: AddWebhookDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError("")
    setIsLoading(true)

    // Validation
    if (!name.trim()) {
      setError("Webhook name is required")
      setIsLoading(false)
      return
    }

    if (!url.trim()) {
      setError("Webhook URL is required")
      setIsLoading(false)
      return
    }

    if (!validateWebhookUrl(url)) {
      setError("Invalid Discord webhook URL format")
      setIsLoading(false)
      return
    }

    try {
      addWebhook({
        name: name.trim(),
        url: url.trim(),
        userId: user.id,
        isActive: true,
      })

      // Reset form
      setName("")
      setUrl("")
      setDescription("")
      setOpen(false)
      onWebhookAdded()
    } catch (err) {
      setError("Failed to add webhook")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Webhook
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-900/95 backdrop-blur-xl border-slate-700/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Webhook</DialogTitle>
          <DialogDescription className="text-slate-300">
            Add a Discord webhook to start sending messages. You can find webhook URLs in your Discord server settings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-200">
                Webhook Name
              </Label>
              <Input
                id="name"
                placeholder="My Discord Webhook"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url" className="text-slate-200">
                Webhook URL
              </Label>
              <Input
                id="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-200">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="What is this webhook used for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20 resize-none"
              />
            </div>
            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-500/50 text-red-200">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-slate-800/50 border-slate-600/50 text-slate-200 hover:bg-slate-700/50 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              {isLoading ? "Adding..." : "Add Webhook"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
