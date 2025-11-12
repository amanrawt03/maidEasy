"use client";

import { useState } from "react";
import {
  Overlay,
  ModalContainer,
  Header,
  HeaderTitle,
  CloseButton,
  Section,
  SectionTitle,
  Card,
  Row,
  Label,
  Value,
  StatusBadge,
  AddressText,
  TimeText,
  OtpInputContainer,
  OtpInput,
  ButtonRow,
  CancelButton,
  StartButton,
} from "./StartModal.styles";

export const StartJobModal = ({ job, onClose, onStartJob }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        setCurrentIndex(index + 1);
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setCurrentIndex(index - 1);
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleStartJob = () => {
    const otpCode = otp.join("");
    if (otpCode.length === 4) {
      onStartJob(job.job_id, job.helper_id, otpCode);
      onClose();
    } else {
      alert("Please enter complete 4-digit OTP");
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (!job) return null;

  return (
    <Overlay>
      <ModalContainer>
        <Header>
          <HeaderTitle>Start Job</HeaderTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <Section>
          <SectionTitle>Job Details</SectionTitle>
          <Card>
            <Row>
              <Label>Job Type:</Label>
              <Value $primary>{job.job_type}</Value>
            </Row>
            <Row>
              <Label>Status:</Label>
              <StatusBadge>{job.job_status}</StatusBadge>
            </Row>
            <Row>
              <Label>Scheduled Date:</Label>
              <Value>{formatDate(job.scheduled_date)}</Value>
            </Row>
          </Card>
        </Section>

        {job.address && (
          <Section>
            <SectionTitle>Location</SectionTitle>
            <Card>
              <AddressText>{job.address.address_line}</AddressText>
              <AddressText>📍 {job.address.landmark}</AddressText>
              <AddressText>
                {job.address.city}, {job.address.state} -{" "}
                {job.address.pincode}
              </AddressText>
              <AddressText>{job.address.country}</AddressText>
            </Card>
          </Section>
        )}

        {job.timeLeft && (
          <Section>
            <SectionTitle>Time Information</SectionTitle>
            <Card $yellow>
              <Row>
                <Label>Time Until Job:</Label>
                <TimeText>
                  {Math.floor(job.timeLeft / 3600)}h{" "}
                  {Math.floor((job.timeLeft % 3600) / 60)}m
                </TimeText>
              </Row>
            </Card>
          </Section>
        )}

        <Section>
          <SectionTitle>Enter OTP to Start</SectionTitle>
          <p>Please enter the 4-digit OTP provided by the customer</p>

          <OtpInputContainer>
            {otp.map((digit, index) => (
              <OtpInput
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength="1"
                inputMode="numeric"
              />
            ))}
          </OtpInputContainer>
        </Section>

        <ButtonRow>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <StartButton
            onClick={handleStartJob}
            disabled={otp.join("").length !== 4}
          >
            Start Job
          </StartButton>
        </ButtonRow>
      </ModalContainer>
    </Overlay>
  );
};
