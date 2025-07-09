"use client"

import * as React from "react"
import { Award, User, Package, ContactRound } from "lucide-react"

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
import { Separator } from "../ui/separator"
import { toast } from "sonner"


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
      <Separator className="my-2" />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
              onClick={() => {
                toast.success("Coming soon!", {duration: 2000, description: "This feature is under development."})
              }}
            >
              <Link to="#">
                <Award className="!size-5" />
                <span className="text-base font-semibold">Community Guidelines</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
              onClick={() => {
                toast.success("Coming soon!", {duration: 2000, description: "This feature is under development."})
              }}
            >
              <Link to="#">
                <Package className="!size-5" />
                <span className="text-base font-semibold">My Collection</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
              onClick={() => {
                toast.success("Coming soon!", {duration: 2000, description: "This feature is under development."})
              }}
            >
              <Link to="#">
                <ContactRound className="!size-5"/>
                <span className="text-base font-semibold">Followings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      {/* <SidebarFooter>
        footer
      </SidebarFooter> */}
    </Sidebar>
  )
}
