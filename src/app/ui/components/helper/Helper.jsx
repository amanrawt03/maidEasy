"use client";
import socket from "@/app/api/config/socketClient";
import { useEffect, useState } from "react";

export const Helper = ({ uName, helperId }) => {
  const [jobNotifications, setJobNotifications] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [jobTimers, setJobTimers] = useState({}); // Track individual job timers

  useEffect(() => {
    // Prevent multiple connections
    if (socket.connected) {
      socket.disconnect();
    }

    // Pass username as query when connecting
    socket.auth = { username: uName };

    // Connect the socket when the component mounts
    socket.connect();

    // Socket event listeners
    socket.on("connect", () => {
      console.log(`Helper ${uName} connected to socket`);
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log(`Helper ${uName} disconnected from socket`);
      setSocketConnected(false);
    });

    // Listen for new job notifications
    socket.on("newJobCreated", (jobData) => {
      console.log("New job notification received:", jobData);
      setJobNotifications((prev) => [{ ...jobData, timeLeft: 30 }, ...prev]);

      // Start 30-second countdown for this job
      const timer = setInterval(() => {
        setJobNotifications((prev) =>
          prev.map((job) =>
            job.jobId === jobData.jobId
              ? { ...job, timeLeft: Math.max(0, job.timeLeft - 1) }
              : job
          )
        );
      }, 1000);

      setJobTimers((prev) => ({ ...prev, [jobData.jobId]: timer }));

      // Auto-remove after 30 seconds
      setTimeout(() => {
        setJobNotifications((prev) =>
          prev.filter((job) => job.jobId !== jobData.jobId)
        );
        setJobTimers((prev) => {
          const newTimers = { ...prev };
          delete newTimers[jobData.jobId];
          return newTimers;
        });
      }, 30000);
    });

    // Listen for job accepted by someone else
    socket.on("jobAccepted", (data) => {
      console.log("Job accepted:", data);
      // Remove job from notifications
      setJobNotifications((prev) =>
        prev.filter((job) => job.jobId !== data.jobId)
      );

      // Clear timer
      if (jobTimers[data.jobId]) {
        clearInterval(jobTimers[data.jobId]);
        setJobTimers((prev) => {
          const newTimers = { ...prev };
          delete newTimers[data.jobId];
          return newTimers;
        });
      }
    });

    // Listen for job expiration
    socket.on("jobExpired", (data) => {
      console.log("Job expired:", data);
      // Remove job from notifications
      setJobNotifications((prev) =>
        prev.filter((job) => job.jobId !== data.jobId)
      );

      // Clear timer
      if (jobTimers[data.jobId]) {
        clearInterval(jobTimers[data.jobId]);
        setJobTimers((prev) => {
          const newTimers = { ...prev };
          delete newTimers[data.jobId];
          return newTimers;
        });
      }
    });

    // Listen for job acceptance failures
    socket.on("jobAcceptanceFailed", (data) => {
      console.log("Job acceptance failed:", data);
      alert(`Failed to accept job: ${data.message}`);
    });

    return () => {
      // Clear all timers
      Object.values(jobTimers).forEach(clearInterval);
      // Remove all event listeners
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newJobCreated");
      socket.off("jobAccepted");
      socket.off("jobExpired");
      socket.off("jobAcceptanceFailed");
      // Disconnect the socket when the component unmounts
      socket.disconnect();
    };
  }, [uName]);

  const handleAcceptJob = (job) => {
    console.log(`Attempting to accept job ${job.jobId}`);

    // Send job acceptance to server
    socket.emit("acceptJob", {
      jobId: job.jobId,
      helperId: helperId, // Using helperId prop instead of uName
      helperName: uName,
    });

    // Optimistically remove from notifications
    setJobNotifications((prev) => prev.filter((j) => j.jobId !== job.jobId));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Hi! Helper {uName}</h2>

      {/* Socket Status */}
      <p style={{ color: socketConnected ? "green" : "red" }}>
        Socket: {socketConnected ? "🟢 Connected" : "🔴 Disconnected"}
      </p>

      {/* Job Notifications */}
      <div style={{ marginTop: "20px" }}>
        <h3>Job Notifications ({jobNotifications.length})</h3>

        {jobNotifications.length === 0 ? (
          <p style={{ color: "#666" }}>No new jobs available</p>
        ) : (
          <div>
            {jobNotifications.map((job, index) => (
              <div
                key={`${job.jobId}-${index}`}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  margin: "10px 0",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>
                  {job.message}
                  <span
                    style={{
                      color: job.timeLeft <= 10 ? "red" : "orange",
                      fontSize: "14px",
                      marginLeft: "10px",
                    }}
                  >
                    ⏰ {job.timeLeft}s left
                  </span>
                </h4>
                <p>
                  <strong>Job Type:</strong> {job.jobType}
                </p>
                <p>
                  <strong>Scheduled:</strong>{" "}
                  {new Date(job.scheduledTime).toLocaleString()}
                </p>
                <p>
                  <strong>Job ID:</strong> {job.jobId}
                </p>
                <p>
                  <strong>Seeker:</strong> {job.seekerId}
                </p>
                <small style={{ color: "#666" }}>
                  Received: {new Date(job.createdAt).toLocaleString()}
                </small>

                <div style={{ marginTop: "10px" }}>
                  <button
                    style={{
                      padding: "8px 16px",
                      backgroundColor:
                        job.timeLeft === 0 ? "#6c757d" : "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      marginRight: "10px",
                      cursor: job.timeLeft === 0 ? "not-allowed" : "pointer",
                    }}
                    onClick={() => handleAcceptJob(job)}
                    disabled={job.timeLeft === 0}
                  >
                    {job.timeLeft === 0 ? "Expired" : "Accept Job"}
                  </button>
                  <button
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setJobNotifications((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
