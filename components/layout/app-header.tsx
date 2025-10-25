"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function AppHeader() {
  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between border-b px-6",
        "dark:gradient-card dark:border-primary/20 dark:glow-border",
      )}
    >
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects, risks..."
            className={cn("pl-9 border-primary/20", "focus-visible:ring-primary/50 focus-visible:glow-border")}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
          <Bell className="h-5 w-5" />
        </Button>
        <Avatar className="ring-2 ring-primary/30">
          <AvatarFallback className="bg-primary text-primary-foreground">DU</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
