import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import { Toaster } from "@/components/ui/sonner"
import { userTickets as initialUserTickets } from './data/sampleTickets'

// Import page components (we'll create these)
import Marketplace from './components/Marketplace'
import MyTickets from './components/MyTickets'
import SellTicket from './components/SellTicket'

// It's best practice to have the navigation component be aware of the route
// so it can highlight the active tab correctly.
const NavigationTabs = () => {
  const location = useLocation()
  const tabs = [
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/my-tickets', label: 'My Tickets' },
    { path: '/sell-ticket', label: 'Import Reservation' }
  ]

  return (
    <nav className="-mb-px flex space-x-8">
      {tabs.map(tab => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`whitespace-nowrap py-4 px-3 border-b-2 font-semibold text-lg transition-colors duration-200 ${
            location.pathname.startsWith(tab.path) // Use startsWith for better matching
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}

// We'll create a new component that contains the main application logic.
// This allows us to use the `useNavigate` hook, which must be inside the <Router>.
function AppContent() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null)
  const [userTickets, setUserTickets] = useState(initialUserTickets)

  const handleWalletConnect = (address) => {
    setWalletAddress(address)
    // If a wallet address is successfully connected, navigate to the "My Tickets" page.
    if (address) {
      navigate('/my-tickets');
    }
  }

  const addTicket = (newTicket) => {
    // Prevent adding duplicate tickets
    if (!userTickets.find(ticket => ticket.id === newTicket.id)) {
      setUserTickets(prevTickets => [...prevTickets, newTicket])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onWalletConnect={handleWalletConnect}
        walletAddress={walletAddress}
      />

      <div className="border-b border-border pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NavigationTabs />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/marketplace" element={<Marketplace />} />
          <Route
            path="/my-tickets"
            element={<MyTickets userTickets={walletAddress ? userTickets : []} />}
          />
          <Route path="/sell-ticket" element={<SellTicket addTicket={addTicket} />} />
          <Route path="*" element={<Navigate to="/marketplace" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <Toaster />
    </Router>
  )
}

export default App

