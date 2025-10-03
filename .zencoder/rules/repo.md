---
description: Repository Information Overview
alwaysApply: true
---

# E-commerce Project Information

## Repository Summary

A full-stack e-commerce application with React frontend and Express backend. The project implements user authentication, product management, shopping cart functionality, and payment processing with Stripe.

## Repository Structure

The repository is organized into two main components:

- **frontend**: React application built with Vite
- **backend**: Express.js API server with MongoDB database

## Projects

### Frontend

**Configuration File**: package.json

#### Language & Runtime

**Language**: JavaScript (React)
**Version**: React 19.1.1
**Build System**: Vite 7.1.7
**Package Manager**: npm

#### Dependencies

**Main Dependencies**:

- react: ^19.1.1
- react-dom: ^19.1.1
- react-router-dom: ^7.9.2
- axios: ^1.12.2
- zustand: ^5.0.8
- tailwindcss: ^4.1.13
- @stripe/stripe-js: ^7.9.0

**Development Dependencies**:

- @vitejs/plugin-react: ^5.0.3
- eslint: ^9.36.0
- vite: ^7.1.7
- autoprefixer: ^10.4.21
- postcss: ^8.5.6

#### Build & Installation

```bash
cd frontend
npm install
npm run dev    # Development server
npm run build  # Production build
```

#### Main Files

**Entry Point**: src/main.jsx
**State Management**: Uses Zustand for state management (src/store)
**API Integration**: Axios for API requests (src/api)
**Routing**: React Router for navigation (src/App.jsx)

### Backend

**Configuration File**: package.json

#### Language & Runtime

**Language**: JavaScript (Node.js)
**Framework**: Express 5.1.0
**Database**: MongoDB with Mongoose 8.18.2
**Package Manager**: npm

#### Dependencies

**Main Dependencies**:

- express: ^5.1.0
- mongoose: ^8.18.2
- jsonwebtoken: ^9.0.2
- bcryptjs: ^3.0.2
- cors: ^2.8.5
- dotenv: ^17.2.2
- stripe: ^18.5.0
- multer: ^2.0.2
- @aws-sdk/client-s3: ^3.896.0

**Development Dependencies**:

- nodemon: ^3.1.10

#### Build & Installation

```bash
cd backend
npm install
npm run dev    # Development server with nodemon
npm start      # Production server
```

#### Main Files

**Entry Point**: server.js
**Database Connection**: config/db.js
**API Routes**:

- routes/authRoutes.js: Authentication endpoints
- routes/productRoutes.js: Product management
- routes/cartRoutes.js: Shopping cart functionality
- routes/orderRoutes.js: Order processing

#### Data Models

**Models**:

- User.js: User account information
- Product.js: Product details
- Cart.js: Shopping cart data
- Order.js: Order information
- Review.js: Product reviews

#### API Structure

**Authentication**: JWT-based authentication
**File Uploads**: AWS S3 integration with multer
**Payment Processing**: Stripe integration
**Error Handling**: Custom middleware for consistent error responses

## Testing

**Target Framework**: Playwright
