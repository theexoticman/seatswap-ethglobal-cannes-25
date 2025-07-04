import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Plane, Ticket, Plus } from 'lucide-react'
import './App.css'
import Header from './components/Header'

// Import page components (we'll create these)
import Marketplace from './components/Marketplace'
import MyTickets from './components/MyTickets'
import SellTicket from './components/SellTicket'

function App() {
  const [activeTab, setActiveTab] = useState('marketplace')

  const tabs = [
    { id: 'marketplace', label: 'Marketplace', icon: Plane },
    { id: 'my-tickets', label: 'My Tickets', icon: Ticket },
    { id: 'sell-ticket', label: 'Sell Ticket', icon: Plus }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'marketplace':
        return <Marketplace />
      case 'my-tickets':
        return <MyTickets />
      case 'sell-ticket':
        return <SellTicket />
      default:
        return <Marketplace />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Navigation Tabs */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  )
}

export default App

