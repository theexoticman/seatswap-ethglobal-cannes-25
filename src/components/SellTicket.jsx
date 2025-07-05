import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Plane, Calendar, DollarSign, MapPin, Clock } from 'lucide-react'
import ConfirmationModal from './ConfirmationModal'
import TicketDetailsModal from './TicketDetailsModal'

const SellTicket = () => {
  const [formData, setFormData] = useState({
    pnr: '',
    lastName: ''
  })

  const [errors, setErrors] = useState({})
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    isLoading: false
  })

  const [ticketDetails, setTicketDetails] = useState({
    isOpen: false,
    ticket: null
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.pnr) newErrors.pnr = 'PNR is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      handleConfirmFind()
    }
  }

  const handleConfirmFind = async () => {
    setModalState(prev => ({ ...prev, isLoading: true }))
    
    // Mock API call to fetch flight details
    const mockResponse = {
      airline: "Air France",
      departure: {
        code: "NCE",
        city: "Paris",
        time: "2025-07-07T14:30:00Z"
      },
      arrival: {
        code: "JFK",
        city: "New York",
        time: "2025-07-15T17:45:00Z"
      },
      date: "2025-07-15",
      price: 450,
      status: "Available"
    }

    setTimeout(() => {
      setTicketDetails({
        isOpen: true,
        ticket: mockResponse
      })
    }, 2000)
  }

  const handleConfirmDetails = async () => {
    setModalState(prev => ({ ...prev, isLoading: true }))
    
    // Here you would make the actual API call to confirm the details
    // For now, we'll just simulate a successful confirmation
    setTimeout(() => {
      setModalState({
        isOpen: true,
        type: 'success',
        isLoading: false
      })
    }, 2000)
  }

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      isLoading: false
    })
  }

  const handleSuccessConfirm = () => {
    handleCloseModal()
    // Reset form
    setFormData({
      pnr: '',
      lastName: ''
    })
  }

  const handleCloseTicketDetails = () => {
    setTicketDetails({
      isOpen: false,
      ticket: null
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Find Reservation</h2>
        <p className="text-muted-foreground">Enter your PNR and last name to find your reservation details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plane className="w-5 h-5 text-primary" />
            <span>Reservation Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Booking Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="pnr">PNR/Confirmation Code *</Label>
                <Input
                  id="pnr"
                  value={formData.pnr}
                  onChange={(e) => handleInputChange('pnr', e.target.value.toUpperCase())}
                  placeholder="e.g., ABC123"
                  className={errors.pnr ? 'border-destructive' : ''}
                />
                {errors.pnr && <p className="text-sm text-destructive mt-1">{errors.pnr}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="e.g., Smith"
                  className={errors.lastName ? 'border-destructive' : ''}
                />
                {errors.lastName && <p className="text-sm text-destructive mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Find Reservation Details
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleCloseModal}
        type={modalState.type}
        ticket={modalState.ticket}
        isLoading={modalState.isLoading}
      />

      <TicketDetailsModal
        isOpen={ticketDetails.isOpen}
        onClose={handleCloseTicketDetails}
        ticket={ticketDetails.ticket}
      />
    </div>
  )
}

export default SellTicket

