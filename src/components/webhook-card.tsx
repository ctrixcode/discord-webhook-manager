"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { type Webhook, deleteWebhook, sendTestMessage, updateWebhook } from "@/lib/webhook-storage"
import { MoreHorizontal, Send, Trash2, Copy, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WebhookCardProps {
  webhook: Webhook
  onWebhookUpdated: () => void
}

export function WebhookCard({ webhook, onWebhookUpdated }: WebhookCardProps) {
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isTestingWebhook, setIsTestingWebhook] = useState(false)

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhook.url)
    toast({
      title: "Copied!",
      description: "Webhook URL copied to clipboard",
    })
  }

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true)
    try {
      const success = await sendTestMessage(webhook.url, "🎉 Test message from Webhook Manager!")

      if (success) {
        // Update last used timestamp and message count
        updateWebhook(webhook.id, {
          lastUsed: new Date().toISOString(),
          messageCount: webhook.messageCount + 1,
        })
        onWebhookUpdated()

        toast({
          title: "Test successful!",
          description: "Test message sent to Discord",
        })
      } else {
        toast({
          title: "Test failed",
          description: "Could not send test message. Check your webhook URL.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Test failed",
        description: "An error occurred while testing the webhook",
        variant: "destructive",
      })
    } finally {
      setIsTestingWebhook(false)
    }
  }

  const handleDelete = () => {
    deleteWebhook(webhook.id)
    onWebhookUpdated()
    toast({
      title: "Webhook deleted",
      description: "The webhook has been removed from your account",
    })
  }

  const toggleActive = () => {
    updateWebhook(webhook.id, { isActive: !webhook.isActive })
    onWebhookUpdated()
  }

  return (
    <>
      <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-700/50 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-white">{webhook.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant={webhook.isActive ? "default" : "secondary"}
              className={
                webhook.isActive
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-slate-500/20 text-slate-400 border-slate-500/30"
              }
            >
              {webhook.isActive ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  Inactive
                </>
              )}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-slate-800/95 backdrop-blur-sm border-slate-700/50 text-white"
              >
                <DropdownMenuItem
                  onClick={handleTestWebhook}
                  disabled={isTestingWebhook}
                  className="hover:bg-slate-700/50 focus:bg-slate-700/50"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isTestingWebhook ? "Testing..." : "Test Webhook"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyUrl} className="hover:bg-slate-700/50 focus:bg-slate-700/50">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleActive} className="hover:bg-slate-700/50 focus:bg-slate-700/50">
                  {webhook.isActive ? <XCircle className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                  {webhook.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm text-slate-300">
              <span className="font-medium">URL:</span>
              <div className="mt-1 p-2 bg-slate-800/50 rounded border border-slate-700/50 font-mono text-xs break-all">
                {webhook.url}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Messages sent: {webhook.messageCount}</span>
              <span>Created: {new Date(webhook.createdAt).toLocaleDateString()}</span>
            </div>
            {webhook.lastUsed && (
              <div className="text-sm text-slate-400">Last used: {new Date(webhook.lastUsed).toLocaleString()}</div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              This action cannot be undone. This will permanently delete the webhook "{webhook.name}" from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700/50 text-white border-slate-600/50 hover:bg-slate-600/50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600/80 text-white hover:bg-red-600 border-red-500/50"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
