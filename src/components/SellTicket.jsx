import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Plane, Calendar, DollarSign, MapPin, Clock } from 'lucide-react'
import ConfirmationModal from './ConfirmationModal'

const SellTicket = () => {
  const [formData, setFormData] = useState({
    airline: '',
    flightNumber: '',
    departureAirport: '',
    departureCity: '',
    arrivalAirport: '',
    arrivalCity: '',
    departureDate: '',
    departureTime: '',
    arrivalDate: '',
    arrivalTime: '',
    price: '',
    originalPrice: '',
    seatClass: '',
    pnr: '',
    notes: ''
  })

  const [errors, setErrors] = useState({})
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    isLoading: false
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
    
    if (!formData.airline) newErrors.airline = 'Airline is required'
    if (!formData.flightNumber) newErrors.flightNumber = 'Flight number is required'
    if (!formData.departureAirport) newErrors.departureAirport = 'Departure airport is required'
    if (!formData.departureCity) newErrors.departureCity = 'Departure city is required'
    if (!formData.arrivalAirport) newErrors.arrivalAirport = 'Arrival airport is required'
    if (!formData.arrivalCity) newErrors.arrivalCity = 'Arrival city is required'
    if (!formData.departureDate) newErrors.departureDate = 'Departure date is required'
    if (!formData.departureTime) newErrors.departureTime = 'Departure time is required'
    if (!formData.arrivalDate) newErrors.arrivalDate = 'Arrival date is required'
    if (!formData.arrivalTime) newErrors.arrivalTime = 'Arrival time is required'
    if (!formData.price) newErrors.price = 'Selling price is required'
    if (!formData.seatClass) newErrors.seatClass = 'Seat class is required'
    if (!formData.pnr) newErrors.pnr = 'PNR is required'

    // Validate price is a number
    if (formData.price && isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Price must be a valid number'
    }
    if (formData.originalPrice && isNaN(parseFloat(formData.originalPrice))) {
      newErrors.originalPrice = 'Original price must be a valid number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Create a ticket object for the modal
      const ticketData = {
        airline: formData.airline,
        departure: {
          code: formData.departureAirport,
          city: formData.departureCity,
          time: `${formData.departureDate}T${formData.departureTime}:00Z`
        },
        arrival: {
          code: formData.arrivalAirport,
          city: formData.arrivalCity,
          time: `${formData.arrivalDate}T${formData.arrivalTime}:00Z`
        },
        date: formData.departureDate,
        price: parseFloat(formData.price),
        status: 'Available'
      }
      
      setModalState({
        isOpen: true,
        type: 'sell',
        ticket: ticketData,
        isLoading: false
      })
    }
  }

  const handleConfirmSell = async () => {
    setModalState(prev => ({ ...prev, isLoading: true }))
    
    // Simulate API call
    setTimeout(() => {
      setModalState({
        isOpen: true,
        type: 'success',
        ticket: modalState.ticket,
        isLoading: false
      })
    }, 2000)
  }

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      ticket: null,
      isLoading: false
    })
  }

  const handleSuccessConfirm = () => {
    handleCloseModal()
    // Reset form
    setFormData({
      airline: '',
      flightNumber: '',
      departureAirport: '',
      departureCity: '',
      arrivalAirport: '',
      arrivalCity: '',
      departureDate: '',
      departureTime: '',
      arrivalDate: '',
      arrivalTime: '',
      price: '',
      originalPrice: '',
      seatClass: '',
      pnr: '',
      notes: ''
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Sell Ticket</h2>
        <p className="text-muted-foreground">List your flight ticket for resale on the marketplace.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plane className="w-5 h-5 text-primary" />
            <span>Flight Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Flight Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="airline">Airline *</Label>
                <Input
                  id="airline"
                  value={formData.airline}
                  onChange={(e) => handleInputChange('airline', e.target.value)}
                  placeholder="e.g., Air France"
                  className={errors.airline ? 'border-destructive' : ''}
                />
                {errors.airline && <p className="text-sm text-destructive mt-1">{errors.airline}</p>}
              </div>
              <div>
                <Label htmlFor="flightNumber">Flight Number *</Label>
                <Input
                  id="flightNumber"
                  value={formData.flightNumber}
                  onChange={(e) => handleInputChange('flightNumber', e.target.value)}
                  placeholder="e.g., AF123"
                  className={errors.flightNumber ? 'border-destructive' : ''}
                />
                {errors.flightNumber && <p className="text-sm text-destructive mt-1">{errors.flightNumber}</p>}
              </div>
            </div>

            {/* Departure Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Departure</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departureAirport">Airport Code *</Label>
                  <Input
                    id="departureAirport"
                    value={formData.departureAirport}
                    onChange={(e) => handleInputChange('departureAirport', e.target.value.toUpperCase())}
                    placeholder="e.g., CDG"
                    maxLength={3}
                    className={errors.departureAirport ? 'border-destructive' : ''}
                  />
                  {errors.departureAirport && <p className="text-sm text-destructive mt-1">{errors.departureAirport}</p>}
                </div>
                <div>
                  <Label htmlFor="departureCity">City *</Label>
                  <Input
                    id="departureCity"
                    value={formData.departureCity}
                    onChange={(e) => handleInputChange('departureCity', e.target.value)}
                    placeholder="e.g., Paris"
                    className={errors.departureCity ? 'border-destructive' : ''}
                  />
                  {errors.departureCity && <p className="text-sm text-destructive mt-1">{errors.departureCity}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departureDate">Date *</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => handleInputChange('departureDate', e.target.value)}
                    className={errors.departureDate ? 'border-destructive' : ''}
                  />
                  {errors.departureDate && <p className="text-sm text-destructive mt-1">{errors.departureDate}</p>}
                </div>
                <div>
                  <Label htmlFor="departureTime">Time *</Label>
                  <Input
                    id="departureTime"
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) => handleInputChange('departureTime', e.target.value)}
                    className={errors.departureTime ? 'border-destructive' : ''}
                  />
                  {errors.departureTime && <p className="text-sm text-destructive mt-1">{errors.departureTime}</p>}
                </div>
              </div>
            </div>

            {/* Arrival Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Arrival</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="arrivalAirport">Airport Code *</Label>
                  <Input
                    id="arrivalAirport"
                    value={formData.arrivalAirport}
                    onChange={(e) => handleInputChange('arrivalAirport', e.target.value.toUpperCase())}
                    placeholder="e.g., JFK"
                    maxLength={3}
                    className={errors.arrivalAirport ? 'border-destructive' : ''}
                  />
                  {errors.arrivalAirport && <p className="text-sm text-destructive mt-1">{errors.arrivalAirport}</p>}
                </div>
                <div>
                  <Label htmlFor="arrivalCity">City *</Label>
                  <Input
                    id="arrivalCity"
                    value={formData.arrivalCity}
                    onChange={(e) => handleInputChange('arrivalCity', e.target.value)}
                    placeholder="e.g., New York"
                    className={errors.arrivalCity ? 'border-destructive' : ''}
                  />
                  {errors.arrivalCity && <p className="text-sm text-destructive mt-1">{errors.arrivalCity}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="arrivalDate">Date *</Label>
                  <Input
                    id="arrivalDate"
                    type="date"
                    value={formData.arrivalDate}
                    onChange={(e) => handleInputChange('arrivalDate', e.target.value)}
                    className={errors.arrivalDate ? 'border-destructive' : ''}
                  />
                  {errors.arrivalDate && <p className="text-sm text-destructive mt-1">{errors.arrivalDate}</p>}
                </div>
                <div>
                  <Label htmlFor="arrivalTime">Time *</Label>
                  <Input
                    id="arrivalTime"
                    type="time"
                    value={formData.arrivalTime}
                    onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                    className={errors.arrivalTime ? 'border-destructive' : ''}
                  />
                  {errors.arrivalTime && <p className="text-sm text-destructive mt-1">{errors.arrivalTime}</p>}
                </div>
              </div>
            </div>

            {/* Pricing and Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Pricing & Details</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Selling Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="450.00"
                    className={errors.price ? 'border-destructive' : ''}
                  />
                  {errors.price && <p className="text-sm text-destructive mt-1">{errors.price}</p>}
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (USD)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                    placeholder="500.00"
                    className={errors.originalPrice ? 'border-destructive' : ''}
                  />
                  {errors.originalPrice && <p className="text-sm text-destructive mt-1">{errors.originalPrice}</p>}
                </div>
                <div>
                  <Label htmlFor="seatClass">Seat Class *</Label>
                  <Select value={formData.seatClass} onValueChange={(value) => handleInputChange('seatClass', value)}>
                    <SelectTrigger className={errors.seatClass ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium-economy">Premium Economy</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.seatClass && <p className="text-sm text-destructive mt-1">{errors.seatClass}</p>}
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Booking Information</h3>
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
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any additional information about the ticket..."
                  rows={3}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                List Ticket for Sale
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onConfirm={modalState.type === 'success' ? handleSuccessConfirm : handleConfirmSell}
        type={modalState.type}
        ticket={modalState.ticket}
        isLoading={modalState.isLoading}
      />
    </div>
  )
}

export default SellTicket

