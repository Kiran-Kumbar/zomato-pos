<div align="center">
  
  <img src="https://raw.githubusercontent.com/Kiran-Kumbar/zomato-pos/main/public/favicon.svg" alt="TrustBite Logo" width="100" />
  <h1>TrustBite POS & Logistics Ecosystem</h1>
  <p><strong>Order food you actually trust.</strong></p>

  <p>
    <a href="https://zomato-pos.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Website-FF5A36?style=for-the-badge&logo=vercel" alt="Live Demo" />
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js%2014-App%20Router-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Framer%20Motion-Animations-E1306C?style=flat-square&logo=framer" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/Zustand-State%20Management-764ABC?style=flat-square" alt="Zustand" />
  </p>
</div>

> **Live Application URL:** [https://zomato-pos.vercel.app/](https://zomato-pos.vercel.app/)

<br />

## ✨ Overview

**TrustBite** is a comprehensive food delivery platform architecture built with modern web technologies. It showcases an entire ecosystem by breaking down the complex domain into four distinct, interconnected user personas. From dynamic surge pricing and group orders to real-time delivery tracking and administrative oversight, TrustBite delivers a seamless, highly animated, and deeply interactive experience.

---

## 🎭 The Four Personas

### 🧑‍🍳 1. Customer Experience
The core ordering interface optimized for conversion, transparency, and social dining.
- **Dynamic Surge Pricing:** Real-time fee calculation with transparent disclosure of factors (e.g., weather, high demand, fewer riders).
- **Social Group Ordering:** Invite friends via link, view real-time individual carts, and securely split the bill (equal or itemized).
- **Live Order Tracking:** Highly animated status timeline with simulated map tracking and a dev-toggle for smooth presentation.
- **Eco-Delivery Option:** Gamified checkout toggle offering slightly slower, bundled deliveries for a discounted fee and reduced carbon footprint.
- **Verified Video Reviews:** Post-delivery review prompts allowing users to upload short video reviews for enhanced trust.

### 🏪 2. Restaurant Dashboard
A robust control center for restaurant owners to manage their operations.
- **Live Kanban Orders:** Drag-and-drop or tap-to-move order progression (New → Preparing → Ready).
- **Menu Management:** Full CRUD operations for menu items, variants, add-ons, and dynamic "Mood Tags" for better discoverability.
- **Business Analytics:** Real-time data visualization (Recharts) covering daily revenue, average prep times, and transparency scores.

### 🛵 3. Delivery Partner Portal
Built for efficiency and fairness on the road.
- **Assignment Ring:** An engaging 15-second visual countdown for accepting or rejecting incoming delivery pings.
- **Earnings Breakdown:** Transparent history detailing base pay, distance fees, and active surge bonuses per order.
- **Zone Demand Heatmap:** Color-coded grids allowing partners to position themselves in high-demand areas.

### 📈 4. Advanced Admin & Analytics Dashboard
Designed to oversee the entire logistics ecosystem:
- **Real-time Platform Metrics**: Visualize Gross Merchandise Value (GMV), Active Orders, and Live Users.
- **Revenue Trend Charts**: Interactive Recharts-based graphical visualizations for tracking monthly growth and commission margins.
- **Commission Management**: Set global or per-restaurant commission rates on the fly to maximize profitability.
- **Fleet Management Map**: Visualize live tracking of all online delivery partners across dynamic geographical zones (simulated via Map interface).
- **Dispute Resolution Hub**: Dedicated kanban/list system for resolving customer complaints and driver assignment errors.

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Core** | `Next.js 13+ (App Router)` | Framework, Routing, SSR/SSG |
| **UI/Styling** | `Tailwind CSS` | Utility-first styling & responsiveness |
| **Animation** | `Framer Motion` | Micro-interactions & complex layout transitions |
| **State** | `Zustand` | Lightweight, un-opinionated global state management |
| **Data Viz** | `Recharts` | Dashboard charts and trend analysis |
| **Mapping** | `React-Leaflet` | Live tracking interfaces and Zone management |
| **Assets** | `Foodish API` & `Dicebear` | High-quality mock imagery and dynamic avatars |
| **Toast/Alerts**| `Sonner` | Beautiful, stacked notification system |

---

## 🚀 Getting Started

To run the TrustBite POC locally on your machine:

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Kiran-Kumbar/zomato-pos.git
cd zomato-pos
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Start the development server
\`\`\`bash
npm run dev
\`\`\`

### 4. Explore the Ecosystem
Open [http://localhost:3000](http://localhost:3000) in your browser. 
You will be greeted by the Role Selection gateway. Switch seamlessly between the Customer, Restaurant, Delivery, and Admin views to experience the entire lifecycle of an order!

---

## 🎨 Design Philosophy

TrustBite rejects generic layouts. The UI focuses on **Rich Aesthetics**, **Glassmorphism**, and **Micro-animations**. 
- **Premium Feel:** Curated color palettes, modern typography (\`Inter\`), and smooth gradients.
- **Desktop-First Optimization:** Unlike many mobile-first designs stretched to desktop sizes, the customer-facing app utilizes properly constrained maximum widths and sticky, intuitive top navigations for a native desktop feel.
- **Feedback Loops:** Every action (adding to cart, splitting a bill, accepting an order) is reinforced with satisfying animations and toast notifications.

---

<div align="center">
  <i>Crafted with passion for building seamless, high-performance web applications.</i>
</div>