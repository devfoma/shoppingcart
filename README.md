# Shopping Cart Application

A fully functional shopping cart built with Next.js, TypeScript, and React. Features include product browsing, cart management, coupon discounts, persistence, and comprehensive input validation.

## 🚀 Features

### Core Functionality
- **Product Display**: Browse 12+ products with images, prices, and descriptions
- **Cart Management**: Add, remove, and update item quantities
- **Real-time Updates**: Cart totals update automatically
- **Coupon System**: Apply discount codes (use \`WEB3BRIDGECOHORTx\` for 10% off)
- **Persistence**: Cart data survives page refreshes using localStorage
- **Input Validation**: Regex validation for coupons, quantity restrictions
- **Error Handling**: User-friendly error messages and edge case handling

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Works on desktop and mobile devices
- **Component Architecture**: Modular, reusable React components
- **Custom Hooks**: \`useCart\` hook for cart state management
- **Unit Tests**: Comprehensive test coverage
- **Modern UI**: Built with shadcn/ui components

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Getting Started

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd shopping-cart-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Shopping Experience
1. **Browse Products**: View the product grid on the homepage
2. **Add to Cart**: Click "Add to Cart" on any product
3. **View Cart**: Click the cart button in the header to open the sidebar
4. **Manage Items**: 
   - Adjust quantities with +/- buttons
   - Remove items with the trash icon
5. **Apply Coupons**: 
   - Enter \`WEB3BRIDGECOHORTx\` for 10% discount
   - Case-sensitive validation
6. **Checkout**: Review totals and proceed to checkout

### Coupon Codes
- **WEB3BRIDGECOHORTx**: 10% discount on entire order
- Codes must be alphanumeric (no special characters)
- Case-sensitive validation

## 🏗️ Architecture

### Project Structure
\`\`\`
├── app/
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   ├── cart-sidebar.tsx    # Cart management UI
│   ├── product-grid.tsx    # Product display
│   └── ui/                 # shadcn/ui components
├── hooks/
│   └── use-cart.ts         # Cart state management
├── lib/
│   ├── products.ts         # Product data
│   └── coupons.ts          # Coupon validation
├── types/
│   └── index.ts            # TypeScript interfaces
└── __tests__/
    └── cart.test.ts        # Unit tests
\`\`\`

### Key Components

#### \`useCart\` Hook
Manages all cart state and operations:
- Add/remove items
- Update quantities
- Apply/remove coupons
- Calculate totals
- Handle persistence
- Error management

#### \`ProductGrid\`
Displays products in a responsive grid layout with:
- Product images and details
- Category badges
- Add to cart functionality

#### \`CartSidebar\`
Slide-out cart interface featuring:
- Item management
- Quantity controls
- Coupon application
- Order summary
- Checkout button