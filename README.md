# Examify - AI-Powered Quiz Platform

A modern, AI-powered quiz platform built with React, TypeScript, and Google Gemini AI for intelligent question generation.

## Features

- 🤖 **AI-Powered Question Generation** - Uses Google Gemini AI to create intelligent questions from uploaded documents
- 📚 **Document Processing** - Support for PDF, DOCX, and TXT files
- 🎯 **Smart Quiz Creation** - Generate 5-100 questions with context-aware multiple choice options
- 🏆 **Achievement System** - Gamified learning with badges and progress tracking
- 🔐 **User Authentication** - Secure login with role-based access control
- 📊 **Performance Analytics** - Track quiz performance and learning progress
- ☁️ **Cloud Storage** - File storage with Supabase and Firebase integration

## Quick Start

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Google Gemini API key - [get one here](https://makersuite.google.com/app/apikey)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd quiz-hub

# Step 3: Install dependencies
npm install

# Step 4: Set up environment variables
cp env.example .env
# Edit .env and add your Gemini API key

# Step 5: Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Required for AI question generation
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Supabase configuration (if using Supabase)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Firebase configuration (if using Firebase)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key and add it to your `.env` file

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **AI Integration**: Google Gemini API
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **File Storage**: Supabase Storage
- **State Management**: React Context API

## Project Structure

```
quiz-hub/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── contexts/      # React contexts
│   ├── lib/           # Utility functions and configurations
│   └── hooks/         # Custom React hooks
├── public/            # Static assets
└── backend/           # Legacy backend (no longer used)
```

## Development

```sh
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## AI Question Generation

The platform uses Google Gemini AI to generate intelligent questions from uploaded documents:

1. **Upload Document** - PDF, DOCX, or TXT files
2. **Text Extraction** - Automatic text extraction using PDF.js
3. **AI Processing** - Gemini AI analyzes content and generates questions
4. **Question Review** - Preview and edit generated questions
5. **Save Quiz** - Save to Firebase for later use

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
