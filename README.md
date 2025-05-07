# 📝 Product Review Platform

![Product Review Platform](./public/preview.png)

A comprehensive web application designed for creating, sharing, and discovering detailed product reviews with premium content subscription capabilities.

---

## ✨ Features

- **Secure Authentication** – User account creation and login powered by **NextAuth.js**
- **Premium Content Access** – Subscription-based model with seamless **Stripe** payment integration
- **Interactive Review System** – Create, explore, and engage with detailed product reviews
- **Responsive Design** – Optimized experience across all devices and screen sizes
- **Real-time Updates** – Instant notifications and content refreshes using modern web technologies

---

## 🛠️ Tech Stack

| Frontend       | Backend       | Tools & Services         |
|----------------|---------------|---------------------------|
| Next.js 15.3.2 | Node.js       | Stripe Payment Gateway    |
| TypeScript     | API Routes    | Redux DevTools            |
| Tailwind CSS   | NextAuth.js   | ESLint & Prettier         |
| Redux Toolkit  | Database ORM  | Git Version Control       |
| React Hooks    | RESTful APIs  | CI/CD Pipeline            |

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js (v16.0 or later)
- npm or yarn package manager
- Stripe account for payment integration

---

### 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/product-review-platform.git

# Navigate to project directory
cd product-review-platform

# Install dependencies
npm install
# or
yarn install

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Database
DATABASE_URL=your_database_connection_string

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

# Run development server
npm run dev
# or
yarn dev

product-review-platform/
├── app/                    # Next.js App Router
│   ├── (home)/             # Public pages
│   ├── (auth)/             # Authentication pages
│   ├── (dashboard)/        # User dashboard pages
│   └── (home)/payment/     # Payment processing
├── components/             # Reusable components
│   ├── auth/               # Authentication components
│   ├── layout/             # Layout components
│   ├── payment/            # Payment components
│   └── reviews/            # Review components
├── lib/                    # Utility functions and helpers
├── public/                 # Static assets
├── store/                  # Redux store configuration
└── types/                  # TypeScript type definitions

## Let me know if you want me to customize the GitHub repo URL or add badges (build passing, license, etc.) at the top.
