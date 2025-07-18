import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from '../ui/sidebar';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore.js';
import NewPostDialog from './NewPostDialog';

const CommunityHeader = () => {
  const { user } = useAuthStore();

  return (
    <header className="flex shrink-0 items-center gap-2 border-b ">
        <div className="flex w-full items-center gap-5 p-3 justify-between">
          <SidebarTrigger className="ml-1 size-10" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <Avatar className={"shrink-0 size-15"}>
            <AvatarImage src={user?.profilePic} alt={user?.name} className="object-cover rounded-full" />
            <AvatarFallback>{user?.fullName.split(" ").map((word) => word[0]).join("")}</AvatarFallback>
          </Avatar>
          <div className="flex w-full justify-between items-center gap-2">
          <div className="flex w-full max-w-sm items-center gap-2 border rounded-2xl bg-transparent px-2 py-1.5 shadow-sm focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]">
            <Input type="search" placeholder="Search" className={"border-none shadow-none focus-visible:ring-0 w-full"}/>
            <Button type="submit" variant="ghost">
              <Search className="size-4" />
            </Button>
          </div>
          <NewPostDialog />
          </div>
        </div>
      </header>
  )
}

export default CommunityHeader