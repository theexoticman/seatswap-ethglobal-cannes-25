import React from 'react'

const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Registered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Bidding':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Redeemed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Redeemable':
        return 'bg-primary/10 text-primary border-primary/20'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}>
      {status}
    </span>
  )
}

export default StatusBadge

