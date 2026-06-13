# React + TypeScript + Firebase Authentication Boilerplate

A premium, highly interactive, and secure boilerplate for Firebase Authentication built with React, TypeScript, Vite, and Vanilla CSS. It features a modern split-layout, responsive design, frosted glass settings sidebar, staggered entrance animations, and complete support for Email (with verification/reset), Phone (SMS OTP), and Google OAuth login.

This project is fully prepared for open-source testing with all API credentials decoupled.

---

## 🚀 Getting Started

You can set up and run this project locally in two ways: using an AI Agent (recommended for modern IDE workflows) or doing a manual step-by-step setup.

### Option 1: AI Agent Auto-Setup (Cursor Composer, Windsurf, Claude Code, Aider, Codex)
If you are using an agentic coding assistant, simply copy and paste the following prompt to let your agent install and run the project automatically:

```text
Please install this project's dependencies and start the local Vite development server.
```

**Common Agent Command Protocols:**
- **Claude Code**: Run `claudecode` in your terminal and type `install dependencies and run dev server`.
- **Aider**: Run `aider` and prompt it to run the setup script.
- **Cursor/Windsurf**: Open composer and request dependency installation and server launch.

---

### Option 2: Manual Setup & Installation (Step-by-Step)

#### Prerequisites
Ensure you have **Node.js** installed on your system.
- Download the LTS version from [Node.js Official Website](https://nodejs.org/).

#### Setup Instructions
1. **Open your terminal in the project directory:**
   - Locate the extracted project folder (the folder containing `package.json`).
   - Click on the address/path bar at the top of your file explorer.
   - Type `cmd` (or `powershell` on Windows) and press **Enter**.
   
2. **Install project dependencies:**
   In the terminal window, run:
   ```bash
   npm install
   ```
   *Wait for the installation to complete (usually takes 30-60 seconds).*

3. **Start the local development server:**
   Once packages are installed, run:
   ```bash
   npm run dev
   ```
   *The server will boot up and display a local URL (e.g., `http://localhost:5173/`).*

4. **Launch and configure:**
   - Open your browser and navigate to the local URL.
   - Click the glassmorphic **"API Settings"** button in the top-left corner.
   - Paste your own Firebase Web SDK configuration object into the text area.
   - Click **"Save and Apply"** to dynamically reload and connect the app to your Firebase console.

---

## 🔒 Open Source & Security Compliance
- **No Hardcoded Keys:** To ensure security during open-source distribution, no API keys or configuration secrets are stored in the source files.
- **Local Settings Override:** The web interface securely saves your Firebase config in browser `localStorage` on a per-user basis.
- **Environment Fallback:** If you prefer code-based configuration, copy `.env.example` to `.env` and fill in your keys. `.env` is pre-configured in `.gitignore` and will never be tracked by git.

## 🛠️ Features Included
- **Advanced Micro-Interactions:** Physics-based spring transitions and 45-degree gear rotations on button hovers.
- **Staggered Entrance Animation:** Structured layout animation using CSS keyframe-based cascades.
- **Robust Verification Logic:** Email account creation with verification status enforcement, password reset triggers, and SMS OTP verification with automatic region formatting (E.164 support).
- **Google OAuth:** Native Firebase sign-in popup integration.
