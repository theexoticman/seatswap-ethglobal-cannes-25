export const marketplaceTickets = [
  {
    id: 1,
    airline: "Air France",
    departure: {
      code: "NCE",
      city: "Nice",
      time: "2024-07-07T10:30:00Z"
    },
    arrival: {
      code: "JFK",
      city: "New York",
      time: "2024-07-07T23:45:00Z"
    },
    date: "2024-08-15",
    price: 450,
    status: "Available"
  },
  {
    id: 2,
    airline: "Lufthansa",
    departure: {
      code: "FRA",
      city: "Frankfurt",
      time: "2024-08-20T09:15:00Z"
    },
    arrival: {
      code: "LAX",
      city: "Los Angeles",
      time: "2024-08-20T13:30:00Z"
    },
    date: "2024-08-20",
    price: 380,
    currentBid: 420,
    status: "Bidding"
  },
  {
    id: 3,
    airline: "British Airways",
    departure: {
      code: "LHR",
      city: "London",
      time: "2024-08-25T11:00:00Z"
    },
    arrival: {
      code: "SYD",
      city: "Sydney",
      time: "2024-08-26T06:45:00Z"
    },
    date: "2024-08-25",
    price: 890,
    status: "Available"
  },
  {
    id: 4,
    airline: "Emirates",
    departure: {
      code: "DXB",
      city: "Dubai",
      time: "2024-09-01T02:20:00Z"
    },
    arrival: {
      code: "BKK",
      city: "Bangkok",
      time: "2024-09-01T08:15:00Z"
    },
    date: "2024-09-01",
    price: 320,
    status: "Redeemed"
  }
]

export const userTickets = [
  {
    id: 6,
    airline: "Air France",
    departure: {
      code: "NCE",
      city: "Nice",
      time: "2025-07-08T12:00:00Z"
    },
    arrival: {
      code: "ORL",
      city: "Paris",
      time: "2025-07-08T15:30:00Z"
    },
    date: "2024-08-22",
    price: 680,
    status: "Registered",
    sellerWallet: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  }
]

export const userTicketsToAdd = {
  id: 5,
  airline: "Air France",
  departure: {
    code: "CDG",
    city: "Paris",
    time: "2025-11-19T16:45:00Z"
  },
  arrival: {
    code: "EZE",
    city: "Buenos Aires",
    time: "2025-12-01T08:30:00Z"
  },
  date: "2024-08-18",
  price: 520,
  status: "Redeemable",
  sellerWallet: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
}