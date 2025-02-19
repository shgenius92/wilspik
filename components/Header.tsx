"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  UserIcon,
  Bars3Icon,
  HomeIcon,
  LanguageIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useState } from "react"

export function Header() {
  const pathname = usePathname()
  const [currentLanguage, setCurrentLanguage] = useState("fr") // Default to French

  const menuItems = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/profile", label: "Profile", icon: UserCircleIcon },
    { href: "/settings", label: "Settings", icon: Cog6ToothIcon },
    { href: "/help", label: "Help", icon: QuestionMarkCircleIcon },
  ]

  const languages = [
    { code: "fr", label: "French", flag: "/flags/fr.png" },
    { code: "es", label: "Spanish", flag: "/flags/es.png" },
  ]

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode)
    // Here you would typically update the app's language context or state
    console.log(`Language changed to ${langCode}`)
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-1 flex justify-between items-center">
        <Link href="/" className="text-l font-bold text-gray-900">
          WilSpik v1.0
        </Link>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" aria-label="Login">
            <UserIcon className="h-6 w-6" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Bars3Icon className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {menuItems.map((item) => (
                <DropdownMenuItem key={item.href} disabled={pathname === item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center w-full ${pathname === item.href ? "text-gray-500" : "text-gray-900"}`}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.label}
                    {pathname === item.href && <span className="ml-auto">•</span>}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem>
                <div className="flex items-center w-full">
                  <LanguageIcon className="h-5 w-5 mr-2" />
                  <span>Language</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        <Image
                          src={languages.find((lang) => lang.code === currentLanguage)?.flag || ""}
                          alt={currentLanguage}
                          width={20}
                          height={15}
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {languages.map((lang) => (
                        <DropdownMenuItem key={lang.code} onSelect={() => handleLanguageChange(lang.code)}>
                          <Image
                            src={lang.flag || "/placeholder.svg"}
                            alt={lang.label}
                            width={20}
                            height={15}
                            className="mr-2"
                          />
                          {lang.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

