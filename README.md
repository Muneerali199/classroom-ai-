# EduTrack - Smart Attendance & Activity Management System

<div align="center">

![EduTrack Logo](https://your-logo-url-here.png)

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

## 📚 Overview

EduTrack is a cutting-edge, mobile-first platform designed for educational institutions to manage curriculum activities, monitor student progress, and track attendance seamlessly with real-time analytics. Built with modern web technologies and AI-powered insights, it offers a comprehensive solution for educational management.

### ✨ Key Features

- **Smart Attendance Tracking**
  - QR code-based attendance system
  - Real-time synchronization
  - Automated attendance summaries using AI

- **Role-Based Access Control**
  - Secure authentication with Supabase
  - Separate dashboards for students, teachers, and administrators
  - Granular permission management

- **AI-Powered Insights**
  - Automated attendance summary generation
  - Trend analysis and reporting
  - Performance tracking

- **Mobile-First Design**
  - Responsive interface
  - Cross-device compatibility
  - Intuitive user experience

## 🛠️ Tech Stack

- **Frontend**
  - Next.js 15.3
  - TypeScript
  - Tailwind CSS
  - ShadcnUI Components
  - React Hook Form

- **Backend & Authentication**
  - Supabase (Database & Auth)

- **AI & Analytics**
  - Genkit AI Framework
  - Recharts for data visualization

- **Development Tools**
  - ESLint
  - TypeScript
  - Turbopack

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Muneerali199/classroom-ai-.git
   cd classroom-ai-
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   # Create a .env.local file with the following variables
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:9002](http://localhost:9002) in your browser.

### Running Genkit AI Services

To run the AI services locally:

```bash
npm run genkit:dev
# or for watch mode
npm run genkit:watch
```

## 📁 Project Structure

```
classroom-ai-/
├── src/
│   ├── ai/            # AI-related functionality
│   ├── app/           # Next.js app router pages
│   ├── components/    # Reusable components
│   ├── hooks/         # Custom React hooks
│   ├── lib/          # Utility functions and configurations
│   └── messages/      # Internationalization files
├── docs/             # Documentation
├── public/           # Static assets
└── ...config files
```

## 🔒 Authentication and Authorization

EduTrack implements a robust authentication system using Supabase Authentication with role-based access control:

- **Students**: Access to personal attendance records, profile management
- **Teachers**: Attendance management, student progress tracking
- **Administrators**: System configuration, user management

## 🌐 Internationalization

The application supports multiple languages through next-intl:
- English (en)
- Spanish (es)
- Hindi (hi)

## 🧪 Testing

To run tests:

```bash
npm run test
# or
yarn test
```

## 🚀 Deployment

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests and linting: `npm run typecheck && npm run lint`
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a pull request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Muneer Ali** - Lead Developer
- **Jayant Bansal** - UX/UI Designer
- **Akshay Jain** - Frontend Developer
- **Aveek Patel** - Backend Developer
- **Amisha Jindal** - Marketing Research
- **Khushi** - QA Tester

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadcnUI](https://ui.shadcn.com/)
- [Genkit AI](https://genkit.ai/)

## 📧 Contact

For any queries or support, please contact:
- Email: alimuneerali245@gmail.com
- GitHub: [@Muneerali199](https://github.com/Muneerali199)

---

<div align="center">
Made with ❤️ by the CodeBlitz Team
</div>
