# NDULA - Modern E-Commerce Platform

**Tagline:** "Pigilia kiatu safiiii" - Get your shoes fresh!

NDULA is a modern, full-featured e-commerce platform built with React, TypeScript, and a focus on providing an exceptional shopping experience for footwear enthusiasts. The platform features a clean, responsive design with comprehensive admin and customer dashboards.

## 🌟 Features

### Customer Features
- **Product Browsing**: Explore curated collections including Air Jordan Legacy, Air Max Series, Basketball, Lifestyle, Running, and Women's Exclusives
- **Advanced Filtering**: Filter products by category, subcategory, price range, and more
- **Product Details**: Detailed product pages with size selection, quantity management, and related products
- **Shopping Cart**: Seamless cart management with M-Pesa payment integration
- **User Dashboard**: 
  - View order history with status tracking
  - Download professional PDF receipts
  - Manage profile information
  - Add and manage multiple shipping addresses
- **Wishlist**: Save favorite products for later
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop

### Admin Features
- **Comprehensive Dashboard**: Overview of key metrics (products, orders, revenue, customers)
- **Product Management**:
  - Add new products with image upload (local files or URLs)
  - Edit existing products
  - Delete products with confirmation modals
  - Track stock levels with low-stock alerts
  - Manage product categories and subcategories
- **Order Management**:
  - View all orders with detailed information
  - Update order statuses (Processing → Shipped → Delivered)
  - Track order payments and customer details
- **Customer Management**:
  - View complete customer list
  - Track customer order history and total spending
  - Access customer contact information
- **Analytics**:
  - Top-selling products with revenue tracking
  - Low stock alerts
  - Out-of-stock notifications
  - Sales trends and performance metrics

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router DOM v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality, accessible component library

### State Management
- **Zustand** - Lightweight state management for cart and products
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation

### UI Components & Icons
- **Radix UI** - Headless, accessible component primitives
- **Lucide React** - Beautiful, consistent icons
- **Sonner** - Toast notifications
- **Embla Carousel** - Smooth carousels

### Data Fetching & API
- **TanStack Query (React Query)** - Powerful data synchronization

## 📦 Database Schema

The project includes a comprehensive Prisma schema (`prisma/schema.prisma`) with fully normalized tables:

### Core Models
- **Users & Authentication**: User accounts with role-based access (Customer, Admin, Super Admin)
- **Profiles**: Extended user information (name, phone, avatar)
- **Addresses**: Multiple shipping addresses per user with default selection
- **Products**: Complete product information with categories, stock, and pricing
- **Product Images**: Support for multiple images per product
- **Shopping Cart**: Persistent cart with item management
- **Wishlist**: Save products for later
- **Orders**: Complete order lifecycle management
- **Order Items**: Line items with product snapshots
- **Payments**: M-Pesa and card payment tracking
- **Reviews**: Product reviews with verified purchase badges
- **Analytics**: Page views and product view tracking

### Key Features of the Schema
- UUID primary keys for all tables
- Proper foreign key relationships with cascade deletes
- Enums for order status, payment methods, categories, etc.
- Decimal precision for monetary values
- Timestamps for audit trails
- Unique constraints for data integrity

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ndula.git
cd ndula
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ndula"
```

4. Set up the database (when implementing backend):
```bash
npx prisma migrate dev
npx prisma generate
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

6. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
ndula/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   ├── robots.txt             # SEO robots file
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── chat/              # AI chat components
│   │   ├── dashboard/         # Dashboard components (Receipt)
│   │   ├── filters/           # Product filter components
│   │   ├── forms/             # Form components (Product, Profile, Address)
│   │   ├── hero/              # Hero carousel components
│   │   ├── layout/            # Layout components (Footer, Layout)
│   │   ├── navigation/        # Navigation components (Navbar)
│   │   └── ui/                # Shadcn UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── pages/                 # Page components
│   │   ├── AdminDashboard.tsx # Admin dashboard
│   │   ├── Dashboard.tsx      # Customer dashboard
│   │   ├── Cart.tsx           # Shopping cart
│   │   ├── Collections.tsx    # Product collections
│   │   ├── ProductDetails.tsx # Product detail page
│   │   ├── Index.tsx          # Home page
│   │   ├── Men.tsx / Women.tsx / Kids.tsx
│   │   ├── Login.tsx / Signup.tsx
│   │   └── Contact.tsx
│   ├── store/                 # Zustand stores
│   │   ├── cartStore.ts       # Shopping cart state
│   │   └── productStore.ts    # Product data state
│   ├── App.tsx                # Main app component
│   ├── main.tsx               # App entry point
│   └── index.css              # Global styles
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

## 🎨 Design System

NDULA uses a consistent design system with semantic tokens defined in `index.css` and `tailwind.config.ts`:

- **Color Palette**: Nike-inspired color scheme with custom brand colors
- **Typography**: Clear hierarchy with responsive font sizes
- **Spacing**: Consistent spacing scale
- **Components**: Reusable, accessible Shadcn components with custom variants
- **Dark Mode**: Full dark mode support (coming soon)

## 🔐 Security & Best Practices

- **Type Safety**: Full TypeScript coverage
- **Form Validation**: Zod schema validation on all forms
- **Authentication**: Secure user authentication (ready for backend integration)
- **Data Privacy**: User data protection best practices
- **SEO Optimized**: Proper meta tags, semantic HTML, and accessible components

## 📱 Responsive Design

NDULA is fully responsive with breakpoints for:
- Mobile: 320px - 639px
- Tablet: 640px - 1023px
- Desktop: 1024px+

## 🚢 Deployment

### Build for Production
```bash
npm run build
# or
yarn build
# or
bun build
```

The build output will be in the `dist/` directory, ready for deployment to platforms like:
- Vercel
- Netlify
- AWS Amplify
- GitHub Pages

### Backend Integration

The project is designed to work with a backend API. When ready to implement:

1. Set up Prisma with your database:
```bash
npx prisma migrate deploy
```

2. Implement API routes for:
   - User authentication (register, login, logout)
   - Product CRUD operations
   - Order processing
   - Payment integration (M-Pesa)
   - File uploads for product images

3. Update the Zustand stores to fetch from your API endpoints

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage report
npm test:coverage
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Design inspiration from Nike and modern e-commerce platforms
- Shadcn for the excellent UI component library
- The React and TypeScript communities

## 📞 Support

For support, email support@ndula.com or join our Discord community.

## 🗺️ Roadmap

- [ ] Backend API implementation
- [ ] M-Pesa payment integration
- [ ] Email notifications
- [ ] Advanced search with filters
- [ ] Product recommendations
- [ ] Customer reviews and ratings
- [ ] Inventory management automation
- [ ] Multi-language support
- [ ] Progressive Web App (PWA) features
- [ ] Social media integration
- [ ] Referral program
- [ ] Loyalty points system

---

**Built with ❤️ for sneaker enthusiasts in Kenya and beyond.**

**Pigilia kiatu safiiii!** 👟
