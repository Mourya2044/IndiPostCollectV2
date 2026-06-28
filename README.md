# IndiPostCollect V2

A modern, premium web application designed for philatelists (stamp collectors) to catalog their collections, buy/sell stamps in a secure marketplace, explore virtual stamp museums, and learn about stamp histories using advanced AI tools.

---

## 🚀 Key Features

* **AI Stamp Recognition**: Upload images of stamps with optional custom text clues. The vision model analyzes, validates, and extracts official titles, country of origin, year of issue, condition, thematic tags, and generates rich, educational stories about each stamp.
* **AI Chat Assistant**: Ask stamp collecting questions and learn about historical stamp series (powered by LangChain OpenRouter).
* **Virtual Museum**: View stamp galleries, detailed exhibits, and browse high-value collector items.
* **Philatelic Marketplace**: Browse listings, manage shopping carts, buy/sell stamps with Stripe integration, and track orders.
* **User Dashboard**: Customize profile avatars, maintain address books, review previous orders, and manage listings.

---

## 🛠️ Technology Stack

### Frontend
* **Core**: React 19, Vite (Fast build tool), JavaScript
* **Styling**: Tailwind CSS, DaisyUI, Radix UI (accessible primitives)
* **State Management**: Zustand (lightweight store)
* **Data Fetching**: Axios, TanStack React Query (efficient server state)
* **Icons & Charts**: Lucide React, Recharts (responsive data visualization)

### Backend
* **Core**: Node.js, Express (Modular MVC API routing)
* **Database**: MongoDB & Mongoose ORM
* **Logging**: Pino HTTP (structured, high-performance logging)
* **Auth**: JSON Web Tokens (JWT) + Secure HTTP-only cookies
* **Mail Service**: Nodemailer (OTP / verification emails)
* **Media Storage**: Cloudinary (profile pics & stamp image uploads)
* **Payments**: Stripe SDK

### AI & Language Models
* **Orchestration**: LangChain Core & OpenRouter
* **Model**: OpenAI GPT-4o-mini (Vision & Structured Output)
* **Validation**: Zod (type-safe output schemas)

---

## 📂 Project Structure

```
IndiPostCollectV2/
├── backend/            # Express backend server
│   ├── src/
│   │   ├── controllers/# Route handlers (Auth, AI, Stamps, etc.)
│   │   ├── lib/        # Initializers (DB, AI Model, Cloudinary)
│   │   ├── middlewares/# JWT Auth & Route guards
│   │   ├── models/     # Mongoose Schemas (User, Stamp, Order)
│   │   ├── routes/     # Express Route declarations
│   │   └── services/   # Business logic (AI Recognition, Emailing)
│   └── tests/          # Integration & unit test suites
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components & cards
│   │   ├── hooks/      # Custom React hooks
│   │   ├── pages/      # Route pages (Profile, Marketplace, Museum)
│   │   ├── store/      # Global Zustand state stores
│   │   └── utils/      # Helper utilities
│   └── public/         # Static assets
└── compose.yaml        # Docker Compose configuration
```

---

## ⚙️ Getting Started

### Prerequisites
* **Node.js**: v18+ recommended
* **MongoDB**: A running local instance or a MongoDB Atlas connection string
* **Cloudinary Account**: For profile and stamp image uploads
* **OpenRouter API Key**: For AI stamp recognition and chat features

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd IndiPostCollectV2
   ```

2. **Configure Environment Variables**:
   * Create a `.env` file in the `backend/` directory:
     ```env
     PORT=3000
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     OPENROUTER_API_KEY=your_openrouter_api_key
     STRIPE_SECRET_KEY=your_stripe_secret_key
     EMAIL_USER=your_smtp_email
     EMAIL_PASS=your_smtp_password
     ```
   * Create a `.env` file in the `frontend/` directory if required for API baseUrl configurations.

3. **Install Dependencies**:
   * **Backend**:
     ```bash
     cd backend
     npm install
     ```
   * **Frontend**:
     ```bash
     cd ../frontend
     npm install
     ```

### Running the Application

* **Start the Backend Server** (runs on `http://localhost:3000` by default):
  ```bash
  cd backend
  npm run dev
  ```
* **Start the Frontend Dev Server** (runs on `http://localhost:5173` or similar):
  ```bash
  cd ../frontend
  npm run dev
  ```

---

## 📝 Developer Reference

* Comprehensive technical summaries of AI integrations, prompt setups, and image upload flows can be found in the `AI_INTEGRATION_NOTES.md` file.
