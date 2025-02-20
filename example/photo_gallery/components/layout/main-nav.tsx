import Link from "next/link"
import { Button } from "@/components/ui/button"

export function MainNav() {
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Home
      </Link>
      <Link href="/albums" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Albums
      </Link>
      <Link href="/profile" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Profile
      </Link>
      <Button variant="outline">Sign In</Button>
    </nav>
  )
}

