export interface PredefinedAvatar {
  id: string
  name: string
  username: string
  avatarUrl: string
  createdAt: string
}

const STORAGE_KEY = "discord-webhook-avatars"

export function getAvatars(): PredefinedAvatar[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading avatars:", error)
    return []
  }
}

export function saveAvatar(avatar: Omit<PredefinedAvatar, "id" | "createdAt">): PredefinedAvatar {
  const newAvatar: PredefinedAvatar = {
    ...avatar,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  const avatars = getAvatars()
  avatars.push(newAvatar)

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(avatars))
  }

  return newAvatar
}

export function updateAvatar(id: string, updates: Partial<Omit<PredefinedAvatar, "id" | "createdAt">>): void {
  const avatars = getAvatars()
  const index = avatars.findIndex((a) => a.id === id)

  if (index !== -1) {
    avatars[index] = { ...avatars[index], ...updates }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(avatars))
    }
  }
}

export function deleteAvatar(id: string): void {
  const avatars = getAvatars().filter((a) => a.id !== id)

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(avatars))
  }
}
