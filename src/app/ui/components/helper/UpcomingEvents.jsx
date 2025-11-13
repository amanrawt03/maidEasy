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
import { PaymentModal } from "../../modals/payment/PaymentModal";
import { formatTime } from "../../utils/utilityFunctions";

export const UpcomingEvents = ({ upcomingJobs }) => {
  const [isStartJobModalOpen, setIsStartJobModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
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

  const handleFinishJob = (job) => {
    setSelectedJob(job);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentReceived = async (jobId, amount) => {
    try {
      const response = await fetch("/api/endpoints/job/updateJobStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: jobId,
          helperId: selectedJob.helper_id,
          status: "payment_received"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Payment of ₹${amount} received successfully!`);
        window.location.reload(); // Simple refresh for now
      } else {
        throw new Error(data.error || "Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status. Please try again.");
    }
  };

  const closeModal = () => {
    setIsStartJobModalOpen(false);
    setIsPaymentModalOpen(false);
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
                  handleFinishJob(job);
                }
              }}
              disabled={
                job.timeLeft <= 0 ||
                job.job_status === "completed" ||
                job.job_status === "payment_received"
              }
            >
              {job.timeLeft <= 0
                ? "Expired"
                : job.job_status === "accepted"
                ? "Proceed"
                : job.job_status === "in_progress"
                ? "Finish Job"
                : job.job_status === "completed"
                ? "Collect Payment"
                : "Payment Received"}
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

      {isPaymentModalOpen && selectedJob && (
        <PaymentModal
          job={selectedJob}
          onClose={closeModal}
          onPaymentReceived={handlePaymentReceived}
        />
      )}
    </>
  );
};
