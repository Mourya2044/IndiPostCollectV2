import { AppSidebar } from "@/components/community/app-sidebar"
import CommunityMain from "@/components/community/CommunityMain";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/useAuthStore.js"
import { useEffect } from "react"

// import data from "./data.json"

export default function CommunityPage() {
  const { hideFooter, unhideFooter } = useAuthStore();

  useEffect(() => {
    hideFooter();
    return () => {
      unhideFooter();
    };
  }, [hideFooter, unhideFooter]);

  return (
    <SidebarProvider className="h-full w-full"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        }
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <CommunityMain />
      </SidebarInset>
    </SidebarProvider>
  )
}
