# CodePath AI - Interactive Learning Platform

CodePath AI is a full-stack interactive learning platform designed to help developers master various programming roles (like Frontend, Backend, or Data Science) through structured roadmaps, interactive lessons, and a real-time AI-powered code playground.

## Features

- **Role-Based Roadmaps**: Structured learning paths for different engineering roles.
- **Interactive Lessons**: Deep dives into programming concepts with real-world examples.
- **AI Code Playground**: Write, run, and debug code in a real-time environment.
- **AI Assistant**: Get hints, explanations, and error analysis powered by Google Gemini.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.
- **Resizable Workspace**: Customizable editor and output panels for a professional coding experience.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Lucide React, Motion.
- **Backend**: Node.js, Express.
- **Editor**: Monaco Editor (VS Code engine).
- **AI**: Google Gemini API (@google/genai).
- **Runtime**: tsx (TypeScript execution).

---

## Getting Started Locally

Follow these step-by-step instructions to run the project on your local machine.

### 1. Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### 2. Clone or Download the Project

Download the project source code to your local machine.

### 3. Install Dependencies

Open your terminal in the project root directory and run:

```bash
npm install
```

This will install all necessary frontend and backend dependencies listed in `package.json`.

### 4. Set Up Environment Variables

Create a `.env` file in the root directory and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

*Note: You can get an API key from the [Google AI Studio](https://aistudio.google.com/).*

### 5. Run the Development Server

Start the full-stack application (Express server + Vite middleware) by running:

```bash
npm run dev
```

### 6. Access the Application

Once the server is running, open your browser and navigate to:

**[http://localhost:3000](http://localhost:3000)**

---

## Project Structure

- `server.ts`: The entry point for the Express backend and Vite development middleware.
- `src/`: Contains the React frontend source code.
  - `pages/`: Application pages (Home, Roadmap, Lesson).
  - `components/`: Reusable UI components (Navbar, Sidebar, AI Panel).
  - `services/`: API and AI integration logic.
  - `index.css`: Global styles and Tailwind configuration.
- `data.json`: The static data source for roles, skills, and lessons.

## Scripts

- `npm run dev`: Starts the development server on port 3000.
- `npm run build`: Builds the frontend for production.
- `npm run lint`: Runs TypeScript type checking.
- `npm run clean`: Removes the `dist` build directory.
