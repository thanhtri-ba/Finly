"use client"
import { ThemeToggle } from "./theme-toggle"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import GoBack from "./go-back"
import { usePathname } from "next/navigation"
import CommandMenu from "./command-menu"

const NAVIGATION = [
  { title: "Markets", href: "/" },
  { title: "Screener", href: "/screener" },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <div className="flex w-full flex-row justify-between py-4 items-center">
          <div className="flex items-center gap-4">
             {pathname !== "/" && <GoBack />}
             <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Finly
             </Link>
          </div>
          <div className="flex flex-row items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                {NAVIGATION.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <CommandMenu />

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
