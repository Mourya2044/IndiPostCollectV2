import * as React from "react"
import { Award, User, Package, ContactRound } from "lucide-react"
import {
  Sidebar, SidebarContent, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { toast } from "sonner"

const NAV_ITEMS = [
  { icon: User, label: "Profile", to: "/profile", comingSoon: false },
  { icon: Award, label: "Community Guidelines", to: "#", comingSoon: true },
  { icon: Package, label: "My Collection", to: "#", comingSoon: true },
  { icon: ContactRound, label: "Following", to: "#", comingSoon: true },
]

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="mt-16 border-r border-border bg-background">
      <SidebarHeader className="px-4 py-4 border-b border-border">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-IPCprimary">Community</p>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarMenu className="gap-1">
          {NAV_ITEMS.map(({ icon: Icon, label, to, comingSoon }) => (
            <SidebarMenuItem key={label}>
              <SidebarMenuButton
                asChild
                className="w-full group/item"
                onClick={comingSoon ? () => toast.info("Coming soon!", { description: "This feature is under development." }) : undefined}
              >
                <Link
                  to={to}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-IPCprimary hover:bg-IPCprimary/5 transition-all border border-transparent hover:border-IPCprimary/20"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="font-medium">{label}</span>
                  {comingSoon && (
                    <span className="ml-auto text-[9px] px-1.5 py-0.5 border border-border text-muted-foreground uppercase tracking-widest">
                      Soon
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
