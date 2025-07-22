import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Job Portal",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "My Profile",
      url: "/dashboard/profile",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Create Job",
      url: "/dashboard/jobs/create",
      icon: SquareTerminal,
    },
    {
      title: "My Jobs",
      url: "/dashboard/jobs/created",
      icon: Bot,
    },
    {
      title: "Home",
      url: "/",
      icon: Bot,
    },
    
  ],
  studentsNavMain: [
    {
      title: "My Profile",
      url: "/dashboard/profile",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Applied Jobs",
      url: "/dashboard/jobs/appliedJobs",
      icon: BookOpen,
    },
    {
      title: "Browse Jobs",
      url: "/jobs",
      icon: Bot,
    },
    {
      title: "Home",
      url: "/",
      icon: Bot,
    },
  ],
}

export function AppSidebar({
  ...props
}) {

  const user = useSelector((state) => state.auth.user)
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={user?.role === "Recruiter" ? data.navMain : data.studentsNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
