import React from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import { Search } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore.js'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import NewPostDialog from './NewPostDialog'

const CommunityHeader = () => {
  const { user } = useAuthStore()

  return (
    <header className="flex shrink-0 items-center border-b border-border bg-background sticky top-16 z-20">
      <div className="flex w-full items-center gap-3 px-4 py-2.5">
        {/* Sidebar toggle */}
        <SidebarTrigger className="text-muted-foreground hover:text-IPCprimary transition-colors" />

        <div className="w-px h-5 bg-border" />

        {/* User avatar */}
        <Avatar className="shrink-0 size-8 border border-border overflow-hidden rounded-full">
          <AvatarImage src={user?.profilePic} alt={user?.fullName} className="object-cover" />
          <AvatarFallback className="text-xs bg-IPCprimary/10 text-IPCprimary font-semibold">
            {user?.fullName?.split(" ").map((w) => w[0]).join("")}
          </AvatarFallback>
        </Avatar>

        {/* Search */}
        <div className="flex flex-1 items-center border border-border bg-background focus-within:border-IPCprimary focus-within:ring-1 focus-within:ring-IPCprimary transition-all max-w-sm">
          <input
            type="search"
            placeholder="Search community…"
            className="flex-1 px-3 py-2 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
          />
          <button className="px-3 h-full text-muted-foreground hover:text-IPCprimary transition-colors border-l border-border py-2">
            <Search className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="ml-auto">
          <NewPostDialog />
        </div>
      </div>
    </header>
  )
}

export default CommunityHeader