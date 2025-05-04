# Human-in-the-Loop AI Supervisor 🚀

This project is built for the **Frontdesk Engineering Test**. It simulates an AI receptionist that can intelligently escalate queries to a human supervisor, learn from the response, and improve over time — the foundation of a self-improving AI agent.

---

## 🔧 Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Call Simulation**: [LiveKit](https://livekit.io/)
- **Database**: Firebase Firestore
- **State Management**: React Context API

---

## 🧠 Features

### 📞 AI Call Handling (Simulated)

- AI agent receives a call via a simulated call component.
- Uses `LiveKit` integration to simulate a call.
- Responds with known answers context.
- Escalates unknown questions via a "Help Request".

### ✋ Help Request Lifecycle

- AI creates a help request in Firestore when it doesn't know the answer.
- Notifies the supervisor
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

## 🧪 How to Run Locally

### 1. Clone the Repository

- git clone https://github.com/githubAloksingh/Human-in-the-Loop-AI-Supervisor.git
- cd Human-in-the-Loop-AI-Supervisor

### 2. Install Dependencies
npm install

### 3. Set Up Firebase

Create a Firebase project at firebase.google.com.
Enable Firestore in the Firebase Console.
Replace the configuration in src/context/FirebaseContext.tsx with your Firebase project's config:

```ts
const firebaseConfig = {
  apiKey: "YOUR_DEMO_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "G-MEASUREMENT_ID"
};
```


## 4. Run the Development Server
npm run dev

---

## 📸 Demo Screens
-**✅ Simulated Call Interface**
![Screenshot 2025-05-04 184451](https://github.com/user-attachments/assets/5cea3a66-b4ba-476e-a733-f8ad9bed1351)

-**👨‍💻 Supervisor Dashboard (Pending/Resolved Requests)**

-**📚 Knowledge Base List**


## 📩 Contact
- Built by Alok Singh for the Frontdesk Engineering Test.
- Feel free to reach out if you'd like to chat about this project or collaborate!








