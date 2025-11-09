# Socket.IO Setup Guide

## Overview

This application uses Socket.IO for real-time communication between job seekers and helpers.

## Architecture

- **Server**: Socket server running on port 4000 (`src/app/server/socketServer.js`)
- **Client**: Socket client configuration (`src/app/config/socketClient.js`)
- **Hook**: Custom React hook for socket management (`src/app/hooks/useSocket.js`)

## How it works

### Job Flow

1. **Seeker creates job** → Job saved to database
2. **Socket emits "newJobRequest"** → All connected helpers receive the job
3. **30-second timer starts** → Job expires if no helper accepts
4. **Helper accepts job** → Database updated, timer cleared, seeker notified
5. **Job completion** → (To be implemented)

### Socket Events

#### Client to Server

- `newJobRequest(job)` - Emitted when a new job is created
- `acceptJob({jobId, helperId})` - Emitted when a helper accepts a job

#### Server to Client

- `jobAccepted({jobId, helperId})` - Broadcasted when a job is accepted
- `jobExpired({jobId})` - Broadcasted when a job expires (30s timeout)

## Usage

### For Seekers (SeekerForm component)

```jsx
import { useSocket } from "@/app/hooks/useSocket";

const { socket, isConnected } = useSocket();

// After creating job in database
socket.emit("newJobRequest", jobData);

// Listen for job acceptance
socket.on("jobAccepted", (data) => {
  console.log("Job accepted by helper:", data.helperId);
});
```

### For Helpers (HelperDashboard component)

```jsx
import { useSocket } from "@/app/hooks/useSocket";

const { socket, isConnected } = useSocket();

// Listen for new jobs
socket.on("newJobRequest", (job) => {
  // Display job to helper
});

// Accept a job
socket.emit("acceptJob", { jobId, helperId });
```

## Running the Application

1. **Install dependencies**: `npm install socket.io-client`
2. **Start Next.js dev server**: `npm run dev`
3. **Start socket server**: You need to run the socket server separately
4. **Test the flow**:
   - Open `/` for seeker interface
   - Open `/helper` for helper interface
   - Create a job as seeker
   - Accept job as helper

## File Structure

```
src/app/
├── config/
│   └── socketClient.js       # Socket client configuration
├── hooks/
│   └── useSocket.js          # Custom socket hook
├── components/
│   ├── seeker/
│   │   └── SeekerForm.jsx    # Job creation form with socket
│   └── helper/
│       └── HelperDashboard.jsx # Helper interface with socket
├── server/
│   └── socketServer.js       # Socket server (needs separate execution)
└── helper/
    └── page.jsx              # Helper test page
```

## Notes

- Socket server runs on port 4000
- Make sure both Next.js (port 3000) and socket server (port 4000) are running
- The socket server file is currently in the Next.js app but needs to be run separately
- Consider moving the socket server to a separate Node.js application for production
