import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Plane, Ticket, Plus } from 'lucide-react'
import './App.css'
import Header from './components/Header'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import page components (we'll create these)
import Marketplace from './components/Marketplace'
import MyTickets from './components/MyTickets'
import SellTicket from './components/SellTicket'

function App() {
  const [activeTab, setActiveTab] = useState('marketplace')
  const [walletAddress, setWalletAddress] = useState(null)

  const tabs = [
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'my-tickets', label: 'My Tickets - Sell Ticket' },
    { id: 'sell-ticket', label: 'Import Reservation' }
  ]

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }

  const handleWalletConnect = (address) => {
    setWalletAddress(address)
    setActiveTab('my-tickets')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'marketplace':
        return <Marketplace />
      case 'my-tickets':
        return <MyTickets walletAddress={walletAddress} />
      case 'sell-ticket':
        return <SellTicket />
      default:
        return <Marketplace />
    }
  }

  // Debugging: Log activeTab changes
  useEffect(() => {
  }, [activeTab])

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          onWalletConnect={handleWalletConnect} 
          walletAddress={walletAddress} 
        />
        
        {/* Navigation Tabs */}
        <div className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="-mb-px flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={renderContent()} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

