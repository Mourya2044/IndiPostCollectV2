"use client"

import * as React from "react"
import { Menu, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"


export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="mt-14 h-[100%-14]">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/profile">
                <User className="!size-5" />
                <span className="text-base font-semibold">Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        content
      </SidebarContent>
      <SidebarFooter>
        footer
      </SidebarFooter>
    </Sidebar>
  )
}
