# Human-in-the-Loop AI Supervisor 🚀

This project is built for the **Frontdesk Engineering Test**. It simulates an AI receptionist that can intelligently escalate queries to a human supervisor, learn from the response, and improve over time — the foundation of a self-improving AI agent.

---

## 🔧 Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Voice & Call Simulation**: [LiveKit](https://livekit.io/)
- **AI Integration**: OpenAI API (ChatGPT)
- **Database**: Firebase Firestore
- **State Management**: React Context API
- **Utilities**: Web Speech API (Speech-to-Text and Text-to-Speech)

---

## 🧠 Features

### 📞 AI Call Handling (Simulated)

- AI agent receives a call via a simulated call component.
- Uses `LiveKit` integration to simulate a call.
- Responds with known answers using OpenAI prompt context.
- Escalates unknown questions via a "Help Request".

### ✋ Help Request Lifecycle

- AI creates a help request in Firestore when it doesn't know the answer.
- Notifies the supervisor with a console log (simulated texting).
- Tells the caller: “Let me check with my supervisor and get back to you.”

### 👨‍💻 Supervisor Dashboard

Accessible admin panel with:

- ✅ **Pending Requests**: View unresolved help queries.
- 💬 **Resolved Requests**: View past resolved/unresolved questions.
- ➕ **Submit Response**: Supervisor provides an answer to the AI.
- 📖 **Knowledge Base**: Tracks learned answers from supervisor input.

### 🔁 Knowledge Base Learning

- When a supervisor responds, AI:
  - Immediately replies back to the caller (simulated).
  - Updates its knowledge base with the new answer.
  - Stores learned Q&A pairs for future use.

### ⏱ Timeout Handling

- Unanswered help requests are marked as **Unresolved** after a timeout.
- Status lifecycle: `Pending → Resolved / Unresolved`.

---

## 🗂 Project Structure

project-root/
├── .bolt/ # Firebase Bolt rules
├── node_modules/
├── src/
│ ├── components/ # UI components (Button, Card, etc.)
│ │ ├── Badge.tsx
│ │ ├── Button.tsx
│ │ └── Card.tsx
│ ├── context/ # App-wide Contexts
│ │ ├── AppContext.tsx
│ │ └── FirebaseContext.tsx
│ ├── knowledge/ # Learned Answers UI
│ │ └── KnowledgeItem.tsx
│ ├── layout/ # Layout components
│ │ ├── Header.tsx
│ │ ├── Layout.tsx
│ │ └── Sidebar.tsx
│ ├── pages/ # Pages in admin panel
│ │ ├── Dashboard.tsx
│ │ ├── KnowledgeBase.tsx
│ │ ├── PendingRequests.tsx
│ │ ├── ResolvedRequests.tsx
│ │ └── SimulatedCall.tsx
│ ├── requests/ # Help request UI
│ │ └── RequestCard.tsx
│ ├── utils/ # Utility functions
│ │ ├── livekit.ts # LiveKit config
│ │ └── prompts.ts # Prompt logic for OpenAI
│ ├── App.tsx # Main app layout
│ ├── index.css
│ └── main.tsx
└── README.md

yaml
Copy
Edit

---

## 🧪 How to Run Locally

1. **Clone the repo**:
   ```bash
   git clone https://github.com/your-username/hitl-ai-supervisor.git
   cd hitl-ai-supervisor
Install dependencies:

bash
Copy
Edit
npm install
Setup Firebase:

Create a Firebase project and Firestore DB.

Add your Firebase config to FirebaseContext.tsx.

Configure LiveKit (optional):

Use LiveKit's free dev server or mocked events.

Update livekit.ts for token and connection setup.

Start the app:

bash
Copy
Edit
npm run dev
📸 Demo Screens
Simulated Call Interface

Supervisor Dashboard (Pending/Resolved)

Knowledge Base List

You can view the full video demo in the repository or submission link.

🧠 Design Decisions
Decoupled Contexts: AppContext handles global app state; FirebaseContext abstracts Firestore logic.

Clean Lifecycle: Help requests are structured with status, question, createdAt, respondedAt, resolvedBy, and responseText.

Knowledge Base: Simple JSON storage per learned question-answer pair, scalable to vector DBs later.

Error Handling: Includes try/catch blocks for async operations with fallback logs.

🛠 Improvements (Future Work)
Live transfer during calls when supervisor is available (Phase 2).

User auth (admin login).

Replace console-based alerts with real-time push via WebSockets or Firebase triggers.

Vector-based semantic search for knowledge matching.

📩 Contact
Built by Alok Singh for the Frontdesk Engineering Test.

Feel free to reach out if you’d like to chat about this project!

📄 License
This project is for evaluation purposes and is not intended for production use.

yaml
Copy
Edit

---

Let me know if you want me to help you generate a GIF demo or add images in the README.