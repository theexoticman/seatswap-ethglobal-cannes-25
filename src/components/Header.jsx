import { Plane } from 'lucide-react'

const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">SeatSwap</h1>
          </div>
          
          {/* Tagline */}
          <p className="hidden md:block text-muted-foreground text-sm">
            Your flight ticket marketplace
          </p>
        </div>
      </div>
    </header>
  )
}

export default Header 