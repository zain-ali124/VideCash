# 🎥 VideCash - Ultimate Video Monetization Platform

VideCash is a cutting-edge video sharing and monetization platform designed for creators and viewers. It offers a seamless experience for uploading, watching, and earning from video content with a modern, high-performance tech stack.

---

## 🚀 Key Features

### 👤 User Features
- **Modern Dashboard**: Track your earnings, watch history, and video stats at a glance.
- **High-Quality Video Player**: Integrated playback with support for various formats.
- **Secure Wallet**: Integrated financial system for tracking earnings and managing withdrawals.
- **Tier System**: Benefit from exclusive features and higher earning rates based on your account tier.
- **Video Uploads**: Easy-to-use upload interface with progress tracking.
- **Watch History**: Keep track of everything you've watched.

### 🛠️ Admin Features
- **Global Management**: Oversee all users, videos, and transactions from a powerful admin panel.
- **Tier Management**: Create and modify subscription tiers.
- **Withdrawal Processing**: Review and approve user cash-out requests.
- **System Analytics**: Real-time insights into platform performance.

### ⚡ Technical Highlights
- **Real-time Updates**: Instant notifications and updates powered by **Socket.io**.
- **Background Processing**: Reliable video processing and automated tasks using **Redis** and **BullMQ**.
- **Responsive & Premium UI**: Stunning design with **Tailwind CSS** and smooth animations via **Framer Motion**.
- **Scalable Storage**: Cloud-based media management using **Cloudinary** and **ImageKit**.

---

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)**: For a fast and reactive user interface.
- **Tailwind CSS**: Modern utility-first styling.
- **Framer Motion**: Premium micro-animations and transitions.
- **Lucide React**: Clean and consistent iconography.
- **Recharts**: Dynamic data visualization for dashboards.
- **Axios**: Promised-based HTTP client for API communication.

### Backend
- **Node.js & Express**: Scalable and robust server-side architecture.
- **MongoDB (Mongoose)**: Flexible NoSQL database for data persistence.
- **Socket.io**: Real-time bidirectional communication.
- **Redis (BullMQ)**: High-performance message broker and task queue.
- **JWT & Bcrypt**: Secure authentication and password hashing.

### Infrastructure & Tools
- **Cloudinary / ImageKit**: Efficient media storage and transformation.
- **Winston / Morgan**: Comprehensive logging and monitoring.
- **Nodemailer**: Automated email notifications.

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- Redis Server

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/videcash.git
cd videcash
```

### 2. Backend Setup
```bash
cd backend
npm install
# Configure your .env file with MongoDB, Redis, and Cloudinary credentials
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
# Configure your API URL in the .env or config file
npm run dev
```

---

## 📜 License
This project is licensed under the ISC License.

---

Developed with ❤️ by [Your Name/Team]
