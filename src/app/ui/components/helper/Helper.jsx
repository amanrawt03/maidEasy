
import socket from "@/app/api/config/socketClient";
import { useEffect, useState } from "react";
import {
  Container,
  Header, 
  Status,
  Section,
  NoJobs,
  JobCard,
  JobHeader,
  JobTitle,
  Timer,
  JobDetails,
  ButtonRow,
  AcceptButton,
  DismissButton,
}  from "./Helper.styles";
import { UpcomingEvents } from "./UpcomingEvents";
export const Helper = ({ uName, helperId }) => {
  const [jobNotifications, setJobNotifications] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [jobTimers, setJobTimers] = useState({});
  const [upcomingJobs, setUpcomingJobs] = useState([]);

  useEffect(() => {
    if (socket.connected) socket.disconnect();

    socket.auth = { username: uName };
    socket.connect();

    socket.on("connect", () => {
      console.log(`Helper ${uName} connected to socket`);
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log(`Helper ${uName} disconnected from socket`);
      setSocketConnected(false);
    });

    socket.on("newJobCreated", (jobData) => {
      console.log("New job notification received:", jobData);
      setJobNotifications((prev) => [{ ...jobData, timeLeft: 30 }, ...prev]);

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

    socket.on("jobAccepted", (data) => {
      console.log("Job accepted:", data);
      setJobNotifications((prev) =>
        prev.filter((job) => job.jobId !== data.jobId)
      );
      if (jobTimers[data.jobId]) {
        clearInterval(jobTimers[data.jobId]);
        setJobTimers((prev) => {
          const newTimers = { ...prev };
          delete newTimers[data.jobId];
          return newTimers;
        });
      }
    });

    socket.on("jobExpired", (data) => {
      console.log("Job expired:", data);
      setJobNotifications((prev) =>
        prev.filter((job) => job.jobId !== data.jobId)
      );
      if (jobTimers[data.jobId]) {
        clearInterval(jobTimers[data.jobId]);
        setJobTimers((prev) => {
          const newTimers = { ...prev };
          delete newTimers[data.jobId];
          return newTimers;
        });
      }
    });

    socket.on("jobAcceptanceFailed", (data) => {
      console.log("Job acceptance failed:", data);
      alert(`Failed to accept job: ${data.message}`);
    });

    return () => {
      Object.values(jobTimers).forEach(clearInterval);
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newJobCreated");
      socket.off("jobAccepted");
      socket.off("jobExpired");
      socket.off("jobAcceptanceFailed");
      socket.disconnect();
    };
  }, [uName]);

  const handleAcceptJob = (job) => {
    socket.emit("acceptJob", {
      jobId: job.jobId,
      helperId,
      helperName: uName,
    });
    setJobNotifications((prev) => prev.filter((j) => j.jobId !== job.jobId));
  };

  useEffect(() => {
    const fetchUpcomingJobs = async () => {
      try {
        const payload = {
          status: "accepted",
          helperId,
        };
        const res = await fetch("/api/endpoints/job/getUpcomingJobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
        const data = await res.json();
        console.log('data',data)
        if (!res.ok) throw new Error(data.error || "Failed to fetch upcoming jobs");
        const jobsWithTimeLeft = data.jobs.map((job) => ({
          ...job,
          timeLeft: Math.max(0, Math.floor((new Date(job.scheduled_date) - new Date()) / 1000)),
        }));
        console.log('jobsWithTimeLeft', jobsWithTimeLeft)
        setUpcomingJobs(jobsWithTimeLeft);
      } catch (err) {
        console.error("Error fetching upcoming jobs:", err.message);
      }
    };
    fetchUpcomingJobs();
  }, [helperId]);
  return (
    <Container>
      <Header>
        <h2>Welcome, {uName}</h2>
        <Status connected={socketConnected}>
          {socketConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </Status>
      </Header>

      <Section>
        <h3>Job Notifications ({jobNotifications.length})</h3>
        {jobNotifications.length === 0 ? (
          <NoJobs>No new jobs available</NoJobs>
        ) : (
          jobNotifications.map((job, index) => (
            <JobCard key={`${job.jobId}-${index}`}>
              <JobHeader>
                <JobTitle>{job.message}</JobTitle>
                <Timer timeLeft={job.timeLeft}>
                  ⏰ {job.timeLeft}s left
                </Timer>
              </JobHeader>

              <JobDetails>
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
                <small>
                  Received: {new Date(job.createdAt).toLocaleString()}
                </small>
              </JobDetails>

              <ButtonRow>
                <AcceptButton
                  disabled={job.timeLeft === 0}
                  onClick={() => handleAcceptJob(job)}
                >
                  {job.timeLeft === 0 ? "Expired" : "Accept Job"}
                </AcceptButton>
                <DismissButton
                  onClick={() =>
                    setJobNotifications((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                >
                  Dismiss
                </DismissButton>
              </ButtonRow>
            </JobCard>
          ))
        )}
        {upcomingJobs.length > 0 && (
          <UpcomingEvents upcomingJobs={upcomingJobs} />
        )}  
      </Section>
    </Container>
  );
};
