# Quiz Hub Backend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Gemini API Key (for AI question generation)

To enable AI-powered question generation, you need to set up a Gemini API key:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Set the environment variable:

```bash
export GEMINI_API_KEY=your_api_key_here
```

Or create a `.env` file in the backend directory:
```
GEMINI_API_KEY=your_api_key_here
```

### 3. Start the Server
```bash
npm start
```

The server will run on port 4000.

## Features

- **AI Question Generation**: Uses Google Gemini API to generate intelligent questions from document content
- **File Upload**: Supports PDF, DOCX, and TXT files
- **Quiz Management**: Save and manage quizzes in Firebase Firestore
- **Admin Authentication**: Role-based access control

## API Endpoints

- `POST /api/quiz-gen/upload` - Upload file and generate quiz
- `POST /api/quiz-gen/generate-questions` - Generate questions from text using AI
- `POST /api/quiz-gen/save` - Save quiz to database 