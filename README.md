# SeatSwap - Flight Ticket Marketplace

A modern, minimalist flight ticket marketplace inspired by the warm aesthetics of Cannes, France. Built with React, Next.js, and Tailwind CSS for ETHGlobal.

## 🎨 Design Philosophy

SeatSwap features a warm, minimalist design inspired by the city of Cannes:
- **Color Palette**: Warm terracotta, sand tones, and Mediterranean blue accents
- **Typography**: Clean, modern fonts with excellent readability
- **Layout**: Minimalist approach with thoughtful spacing and visual hierarchy
- **Interactions**: Smooth transitions and micro-interactions for enhanced UX

## ✨ Features

### Core Functionality
- **Marketplace**: Browse available flight tickets with filtering and search
- **My Tickets**: View and manage purchased tickets
- **Sell Ticket**: List flight tickets for resale with comprehensive form validation

### Ticket Management
- **Status Tracking**: Available, Bidding, Redeemed, Redeemable states
- **Detailed Information**: Airline, flight route, dates, pricing, and booking details
- **Smart Actions**: Context-aware buttons (Buy Now, Place Bid, Resell)

### User Experience
- **Confirmation Modals**: Secure transaction confirmations for buying and selling
- **Form Validation**: Real-time validation with helpful error messages
- **Responsive Design**: Optimized for desktop and mobile devices
- **Loading States**: Visual feedback during transactions

## 🛠 Technical Stack

- **Frontend**: React 18 with JSX
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React icons
- **Build Tool**: Vite
- **Package Manager**: pnpm

## 📁 Project Structure

```
seatswap/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── Marketplace.jsx     # Marketplace page component
│   │   ├── MyTickets.jsx       # User tickets page component
│   │   ├── SellTicket.jsx      # Sell ticket form component
│   │   ├── TicketCard.jsx      # Reusable ticket card component
│   │   ├── StatusBadge.jsx     # Status badge component
│   │   └── ConfirmationModal.jsx # Modal component for confirmations
│   ├── data/
│   │   └── sampleTickets.js    # Sample data for development
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Global styles and design tokens
│   └── main.jsx               # Application entry point
├── public/                     # Static assets
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd seatswap
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

## 🎯 User Flows

### Buying a Ticket
1. Browse marketplace tickets
2. Click "Buy Now" or "Place Bid" on desired ticket
3. Review ticket details in confirmation modal
4. Confirm purchase
5. Receive success confirmation

### Selling a Ticket
1. Navigate to "Import Tickets" tab
2. Fill out comprehensive ticket form
3. Submit form with validation
4. Review listing details in confirmation modal
5. Confirm listing
6. Receive success confirmation and form reset

### Managing Tickets
1. View purchased tickets in "My Tickets"
2. See ticket status (Redeemable, Available, etc.)
3. Use "Resell" button for eligible tickets
4. Track ticket states and actions

## 🎨 Design System

### Color Palette
- **Primary**: Warm terracotta (`oklch(0.55 0.15 35)`)
- **Secondary**: Light sand (`oklch(0.92 0.02 45)`)
- **Accent**: Mediterranean blue (`oklch(0.65 0.12 220)`)
- **Background**: Warm white (`oklch(0.98 0.01 45)`)
- **Foreground**: Deep warm brown (`oklch(0.2 0.02 30)`)

### Components
- **TicketCard**: Displays flight information with status and actions
- **StatusBadge**: Color-coded status indicators
- **ConfirmationModal**: Reusable modal for various confirmation types
- **Form Elements**: Consistent styling with validation states

## 🔧 Customization

### Adding New Ticket Statuses
1. Update `StatusBadge.jsx` with new status styles
2. Add corresponding logic in ticket components
3. Update sample data if needed

### Modifying Color Scheme
1. Edit CSS custom properties in `App.css`
2. Update the `:root` section with new color values
3. Maintain OKLCH color format for consistency

### Adding New Pages
1. Create component in `src/components/`
2. Add to navigation tabs in `App.jsx`
3. Update routing logic in main component

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first approach**: Optimized for small screens
- **Flexible grid layouts**: Adapts to different screen sizes
- **Touch-friendly interactions**: Appropriate button sizes and spacing
- **Readable typography**: Scales appropriately across devices

## 🔒 Security Considerations

- **Form validation**: Client-side validation with server-side verification recommended
- **Input sanitization**: All user inputs should be sanitized
- **Authentication**: Implement proper user authentication for production
- **Transaction security**: Add proper payment processing and verification

## 🚀 Deployment

### Production Build
```bash
pnpm run build
```

### Deployment Options
- **Vercel**: Optimized for React applications
- **Netlify**: Simple static site deployment
- **AWS S3 + CloudFront**: Scalable cloud deployment
- **Traditional hosting**: Upload `dist/` folder contents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for ETHGlobal and is available under the MIT License.

## 🙏 Acknowledgments

- **Design Inspiration**: City of Cannes, France
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React icon library
- **Color System**: OKLCH color space for better color management

---

Built with ❤️ for ETHGlobal using modern web technologies and inspired by the beautiful city of Cannes.

