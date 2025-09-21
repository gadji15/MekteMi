"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Bell,
  MapPin,
  Settings,
  BarChart3,
  FileText,
  UserCheck,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react"
import { MosqueIcon } from "@/components/custom-icons"

const adminMenuItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/pilgrims", label: "Gestion pèlerins", icon: Users },
  { href: "/admin/users", label: "Utilisateurs", icon: UserCheck },
  { href: "/admin/events", label: "Événements", icon: Calendar },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/points-interest", label: "Points d'intérêt", icon: MapPin },
  { href: "/admin/content", label: "Contenu", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/statistics", label: "Statistiques", icon: BarChart3 },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
]

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <MosqueIcon className="w-6 h-6 text-sidebar-primary" />
              <span className="font-bold text-sidebar-foreground">Admin Panel</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="cursor-pointer hover:bg-sidebar-accent/10"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Return to site */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/10 transition-colors cursor-pointer",
            isCollapsed && "justify-center",
          )}
        >
          <Home className="w-5 h-5" />
          {!isCollapsed && <span>Retour au site</span>}
        </Link>

        <div className="border-t border-sidebar-border pt-4 mt-4">
          {adminMenuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/10",
                  isCollapsed && "justify-center",
                )}
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                {!isCollapsed && isActive && (
                  <Badge className="ml-auto bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground">
                    Actif
                  </Badge>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {!isCollapsed && <div className="text-xs text-sidebar-foreground/60 text-center">Admin Panel v1.0</div>}
      </div>
    </div>
  )
}
