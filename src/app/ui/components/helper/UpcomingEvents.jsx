"use client";
import {
  UpcomingJobCard,
  JobHeader,
  JobTitle,
  Timer,
  JobDetails,
  ExpiredTag,
  ProceedButton,
} from "./Helper.styles";
import { useEffect, useState } from "react";
import { StartJobModal } from "../../modals/startJob/StartJobModal";
import { formatTime } from "../../utils/utilityFunctions";

export const UpcomingEvents = ({ upcomingJobs }) => {
  const [isStartJobModalOpen, setIsStartJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleProceedClick = (job) => {
    setSelectedJob(job);
    setIsStartJobModalOpen(true);
  };

  const handleStartJob = async (jobId, helperId, otpCode) => {
    try {
      console.log(`Verifying OTP for job ${jobId} with OTP: ${otpCode}`);

      // Call verifyOTP API
      const response = await fetch("/api/endpoints/job/verifyOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seekerId: selectedJob.seeker_id,
          otp: otpCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // OTP verified successfully, update job status to "in_progress"
        const updateResponse = await fetch(
          "/api/endpoints/job/updateJobStatus",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jobId: jobId,
              helperId: helperId,
              status: "in_progress",
            }),
          }
        );

        const updateData = await updateResponse.json();

        if (updateResponse.ok) {
          alert("Job started successfully!");
          // Refresh the upcoming jobs list or update the specific job
          window.location.reload(); // Simple refresh for now
        } else {
          throw new Error(updateData.error || "Failed to update job status");
        }
      } else {
        alert(`OTP Verification Failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error starting job:", error);
      alert("Failed to start job. Please try again.");
    }
  };

  const handleFinishJob = async (jobId, helperId) => {
    try {
      const response = await fetch("/api/endpoints/job/updateJobStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: jobId,
          helperId: helperId,
          status: "completed",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Job completed successfully!");
        window.location.reload(); // Simple refresh for now
      } else {
        throw new Error(data.error || "Failed to complete job");
      }
    } catch (error) {
      console.error("Error completing job:", error);
      alert("Failed to complete job. Please try again.");
    }
  };

  const closeModal = () => {
    setIsStartJobModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <>
      <h3>Upcoming Jobs ({upcomingJobs.length})</h3>
      {upcomingJobs.map((job, index) => (
        <UpcomingJobCard
          key={`${job.job_id}-${index}`}
          disabled={job.timeLeft <= 0}
        >
          {job.timeLeft <= 0 && <ExpiredTag>Expired</ExpiredTag>}
          <JobHeader>
            <JobTitle>Upcoming: {job.job_type} Job</JobTitle>
            <Timer timeLeft={job.timeLeft}>
              ⏰ {formatTime(job.timeLeft)} left
            </Timer>
          </JobHeader>

          <JobDetails>
            <p>
              <strong>Job ID:</strong> {job.job_id}
            </p>
            <p>
              <strong>Scheduled:</strong>{" "}
              {new Date(job.scheduled_date).toLocaleString()}
            </p>
            <ProceedButton
              onClick={() => {
                if (job.job_status === "accepted") {
                  handleProceedClick(job);
                } else if (job.job_status === "in_progress") {
                  handleFinishJob(job.job_id, job.helper_id);
                }
              }}
              disabled={job.timeLeft <= 0 || job.job_status === "completed"}
            >
              {job.timeLeft <= 0
                ? "Expired"
                : job.job_status === "accepted"
                ? "Proceed"
                : job.job_status === "in_progress"
                ? "Finish Job"
                : "Completed"}
            </ProceedButton>
          </JobDetails>
        </UpcomingJobCard>
      ))}

      {isStartJobModalOpen && selectedJob && (
        <StartJobModal
          job={selectedJob}
          onClose={closeModal}
          onStartJob={handleStartJob}
        />
      )}
    </>
  );
};
