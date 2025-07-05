import { useState } from 'react'
import { Plane } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

const Header = ({ activeTab, onTabChange, onWalletConnect, walletAddress }) => {
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        onWalletConnect(accounts[0])
      } else {
        alert('Please install MetaMask!')
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error)
    }
  }

  const disconnectWallet = () => {
    onWalletConnect(null)
  }

  const formatAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

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
          
          {/* Subtitle */}
          <div className="flex-1 text-center">
            <p className="text-sm text-muted-foreground">Creating A More Liquid Market for Flight Tickets</p>
          </div>

          {/* Wallet and Tabs */}
          <div className="flex items-center space-x-4">
            {walletAddress ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{formatAddress(walletAddress)}</span>
                <Button variant="outline" onClick={disconnectWallet}>Disconnect</Button>
              </div>
            ) : (
              <Button onClick={connectWallet}>Connect Wallet</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 