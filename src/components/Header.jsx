import { useState } from 'react'
import { Button } from '@/components/ui/button'

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
    <header className="bg-background shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-primary p-2 rounded-full">
              <img src="/seat.png" alt="SeatSwap Logo" className="w-20 h-20" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">SeatSwap</h1>
          </div>
          
          <div className="flex-1 text-center">
            <p className="text-sm text-muted-foreground">Creating A More Liquid Market for Flight Tickets</p>
          </div>

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