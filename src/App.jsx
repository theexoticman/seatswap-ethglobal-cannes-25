import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Plane, Ticket, Plus } from 'lucide-react'
import './App.css'
import Header from './components/Header'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import { userTickets as initialUserTickets } from './data/sampleTickets'

// Import page components (we'll create these)
import Marketplace from './components/Marketplace'
import MyTickets from './components/MyTickets'
import SellTicket from './components/SellTicket'

function App() {
  const [activeTab, setActiveTab] = useState('marketplace')
  const [walletAddress, setWalletAddress] = useState(null)
  const [userTickets, setUserTickets] = useState(initialUserTickets)

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

  const addTicket = (newTicket) => {
    // Prevent adding duplicate tickets
    if (!userTickets.find(ticket => ticket.id === newTicket.id)) {
      setUserTickets(prevTickets => [...prevTickets, newTicket])
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'marketplace':
        return <Marketplace />
      case 'my-tickets':
        return <MyTickets userTickets={userTickets} />
      case 'sell-ticket':
        return <SellTicket addTicket={addTicket} />
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
        <div className="border-b border-border pt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="-mb-px flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`whitespace-nowrap py-4 px-3 border-b-2 font-semibold text-lg transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
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
            <Route path="/" element={<Navigate to="/my-tickets" />} />
            <Route path="/sell-ticket" element={renderContent()} />
            <Route path="/my-tickets" element={renderContent()} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

