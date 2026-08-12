# AI Full Stack Chatbot

A full-stack AI-powered chatbot built with **React, Node.js, Express, MongoDB, and Mistral AI**. The application supports real-time streamed AI responses, persistent conversation history, authentication, and user-specific chats.

## Features

* AI-powered conversational chatbot
* Real-time streaming responses
* Persistent conversation history using MongoDB
* User authentication and protected routes
* User-specific conversations
* Loading and error handling
* Markdown-formatted AI responses
* Automatic conversation titles
* Secure server-side AI API integration
* Responsive ChatGPT-inspired interface
* AI memory and tool-calling support
* Web search integration

## Tech Stack

### Frontend

* React
* Vite
* Redux Toolkit
* React Router
* Axios
* Tailwind CSS
* React Markdown

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT Authentication

### AI

* Mistral AI
* LangChain
* Tavily Search API

## Architecture

```text
User
  ↓
React Frontend
  ↓
Express REST API
  ↓
Authentication Middleware
  ↓
Chat Controller
  ↓
MongoDB Conversation History
  ↓
LangChain / Mistral AI
  ↓
Streaming AI Response
  ↓
React UI
```

## Project Structure

```text
GPT/
│
├── client/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   └── chat/
│   │   ├── shared/
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dao/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## How It Works

1. A user registers or logs in.
2. The user creates or selects a conversation.
3. The frontend sends the message to the Express backend.
4. The backend validates the authenticated user.
5. The user message is stored in MongoDB.
6. Previous conversation context is retrieved.
7. The backend sends the conversation to the AI model.
8. The AI response is streamed back to the frontend.
9. The response is displayed in real time.
10. The AI response is stored in MongoDB for future conversations.

## Security

The AI API key is never exposed to the frontend.

All sensitive credentials are stored as environment variables on the backend.

```env
MISTRAL_API_KEY=
MONGODB_URI=
JWT_SECRET=
```

The `.env` file is excluded from Git using `.gitignore`.

An `.env.example` file can be used to document the required environment variables without exposing actual secrets.

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <project-folder>
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` directory using `.env.example` as reference.

```env
PORT=
MONGODB_URI=
MISTRAL_API_KEY=
JWT_SECRET=
```

Add any additional environment variables required by the application.

### 4. Start the backend

```bash
npm run dev
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Core Requirements Implemented

| Requirement                     | Status |
| ------------------------------- | ------ |
| React frontend                  | ✅      |
| Node.js / Express backend       | ✅      |
| LLM API integration             | ✅      |
| MongoDB database                | ✅      |
| User question input             | ✅      |
| Backend-to-AI communication     | ✅      |
| AI response display             | ✅      |
| Persistent conversation history | ✅      |
| Loading state                   | ✅      |
| Error handling                  | ✅      |
| API key secured on backend      | ✅      |

## Additional Features

Beyond the core chatbot requirements, the project also includes:

* JWT-based authentication
* Refresh sessions
* User-specific chat history
* Streaming AI responses
* LangChain agent integration
* Long-term AI memory
* Tool calling
* Tavily-powered web search
* Markdown rendering
* Automatic chat title generation

## Future Improvements

* Conversation deletion and renaming
* File and document uploads
* RAG-based document chat
* Model selection
* Improved mobile responsiveness
* Chat sharing
* Voice input
* Advanced agent workflows

## Author

**Rohit Singh Pokhariya**

Full Stack Developer focused on building scalable web applications and AI-powered products.

* LinkedIn: https://in.linkedin.com/in/rohit-singh-pokhariya

## License

This project is intended for educational, portfolio, and demonstration purposes.
