import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// Store active jobs with their timers
const activeJobs = new Map();

io.on("connection", (socket) => {
  const username = socket.handshake.auth.username;
  console.log("User connected:", socket.id, username);

  // Handle new job creation from seekers
  socket.on("newJobCreated", (jobData) => {
    console.log("New job created by seeker:", JSON.stringify(jobData, null, 2));

    // Check if jobId exists
    if (!jobData.jobId) {
      console.error("ERROR: jobId is missing from jobData:", jobData);
      return;
    }

    // Check if job already exists (prevent duplicates)
    if (activeJobs.has(jobData.jobId)) {
      console.log(`Job ${jobData.jobId} already exists, skipping duplicate`);
      return;
    }

    // Broadcast to all connected helpers (exclude the sender/seeker)
    socket.broadcast.emit("newJobCreated", jobData);

    // Set 30-second timer for job expiration
    const timer = setTimeout(() => {
      console.log(`Job ${jobData.jobId} expired after 30 seconds`);

      // Remove from active jobs
      activeJobs.delete(jobData.jobId);

      // Notify all clients that job expired
      io.emit("jobExpired", {
        jobId: jobData.jobId,
        message: "Job expired - no helper accepted within 30 seconds",
      });
    }, 30000); // 30 seconds

    // Store the job with its timer
    activeJobs.set(jobData.jobId, {
      ...jobData,
      timer: timer,
      createdAt: new Date(),
    });

    console.log(
      `Job notification sent to all helpers: ${jobData.jobType} job from ${jobData.seekerId}`
    );
    console.log(`Job ${jobData.jobId} will expire in 30 seconds`);
  });

  // Handle job acceptance from helpers
  socket.on("acceptJob", async (acceptanceData) => {
    const { jobId, helperId, helperName } = acceptanceData;
    console.log(
      `Helper ${helperName} (${helperId}) trying to accept job ${jobId}`
    );

    // Check if job is still active
    if (!activeJobs.has(jobId)) {
      console.log(`Job ${jobId} is no longer available`);
      socket.emit("jobAcceptanceFailed", {
        jobId,
        message: "Job is no longer available",
      });
      return;
    }

    // Get job data and clear timer
    const jobData = activeJobs.get(jobId);
    clearTimeout(jobData.timer);
    activeJobs.delete(jobId);

    console.log(`Job ${jobId} accepted by helper ${helperName}`);

    // Update job status in database
    try {
      console.log("Updating job status in database...");
      const response = await fetch(
        "http://localhost:3000/api/endpoints/job/updateJobStatus",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId: jobId,
            helperId: helperId,
            status: "accepted",
          }),
        }
      );

      const responseData = await response.json();
      console.log("Database response:", responseData);

      if (response.ok) {
        console.log("Database updated successfully");

        // Send OTP to seeker
        try {
          console.log(`Sending OTP to seeker ${jobData.seekerId}`);
          const otpResponse = await fetch(
            "http://localhost:3000/api/endpoints/job/sendOTP",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                seekerId: jobData.seekerId,
                phone: jobData.seekerPhone,
              }),
            }
          );

          const otpData = await otpResponse.json();
          if (otpResponse.ok) {
            console.log("OTP sent successfully to seeker");
          } else {
            console.error("Failed to send OTP:", otpData);
          }
        } catch (otpError) {
          console.error("Error sending OTP:", otpError);
        }

        // Notify all clients that job was accepted
        io.emit("jobAccepted", {
          jobId,
          helperId,
          helperName,
          seekerId: jobData.seekerId,
          message: `Job accepted by ${helperName}`,
        });
      } else {
        console.error("Database update failed:", responseData);
        throw new Error(responseData.error || "Failed to update job status");
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      socket.emit("jobAcceptanceFailed", {
        jobId,
        message: "Failed to update job status in database",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id, username);
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
