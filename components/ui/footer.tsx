"use client"

import Link from "next/link"
import { Github, Twitter, Facebook, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 md:px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Finly
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted source for real-time stock market data, financial news, and portfolio analysis tools.
            </p>
            <div className="flex gap-4">
              <Link href="https://twitter.com/PhamThanhTri1403" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://github.com/PhamThanhTri1403/stocks" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-foreground">Market</h3>
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
            <Link href="/screener" className="text-sm text-muted-foreground hover:text-primary transition-colors">Screener</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Top Gainers</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Top Losers</Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-foreground">Resources</h3>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">News</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Learn</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">API Documentation</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Community</Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-foreground">Company</h3>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
        
        <div className="mt-10 border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Finly. All rights reserved. Built by <Link href="https://twitter.com/PhamThanhTri1403" className="font-medium underline underline-offset-4 hover:text-primary">ThanhTriThanhTri</Link>.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
             <Link href="#" className="hover:text-primary">Privacy</Link>
             <Link href="#" className="hover:text-primary">Terms</Link>
             <Link href="#" className="hover:text-primary">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
