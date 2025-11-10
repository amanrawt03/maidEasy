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

  const handleStartJob = async (jobId, otpCode) => {
    try {
      console.log(`Starting job ${jobId} with OTP: ${otpCode}`);
      // TODO: Add API call to start job with OTP verification
      // For now, just log the action
      alert(`Job started successfully!\nJob ID: ${jobId}\nOTP: ${otpCode}`);
    } catch (error) {
      console.error("Error starting job:", error);
      alert("Failed to start job. Please try again.");
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
              onClick={() => handleProceedClick(job)}
              disabled={job.timeLeft <= 0}
            >
              {job.timeLeft <= 0 ? "Expired" : "Proceed"}
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
