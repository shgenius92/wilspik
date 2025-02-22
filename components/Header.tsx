"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  UserIcon,
  Bars3Icon,
  HomeIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/revision", label: "Revision", icon: ArrowPathIcon },
    { href: "/parameters", label: "Parameters", icon: Cog6ToothIcon },
    { href: "/help", label: "Help", icon: QuestionMarkCircleIcon, disabled: true },
  ]

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Wilspik
        </Link>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" aria-label="Login">
            <UserIcon className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Bars3Icon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {menuItems.map((item) => (
                <DropdownMenuItem key={item.href} disabled={item.disabled || pathname === item.href}>
                  <Link href={item.href} className="flex items-center w-full">
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

