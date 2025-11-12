"use client";

import { useEffect, useState } from "react";
import {
  FormContainer,
  Section,
  SectionTitle,
  AddressList,
  AddressButton,
  AddButton,
  RadioGroup,
  RadioLabel,
  Input,
  SubmitButton,
  StatusText,
  EmptyText,
} from "./seekerForm.styles";
import { AddAddressModal } from "@/app/ui/modals/addAddress/AddAddressModal";
import socket from "@/app/api/config/socketClient";

export const SeekerForm = ({ phone, userId }) => {
  const [addressList, setAddressList] = useState([]);
  const [addAddressMode, setAddAddressMode] = useState(false);
  const [jobStatus, setJobStatus] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [formData, setFormData] = useState({
    addressId: "",
    jobType: "",
    slot: "",
  });

  // Socket connection setup
  useEffect(() => {
    // Prevent multiple connections
    if (socket.connected) {
      socket.disconnect();
    }

    socket.auth = { username: `seeker-${userId}` };
    socket.connect();

    socket.on("connect", () => {
      console.log("Seeker connected to socket");
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Seeker disconnected from socket");
      setSocketConnected(false);
    });

    // Listen for job acceptance
    socket.on("jobAccepted", (data) => {
      console.log("Job accepted:", data);
      setJobStatus(`🎉 Job accepted by ${data.helperName}!`);
    });

    // Listen for job expiration
    socket.on("jobExpired", (data) => {
      console.log("Job expired:", data);
      setJobStatus("⏰ Job expired - no helper accepted within 30 seconds");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("jobAccepted");
      socket.off("jobExpired");
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch(
          `/api/endpoints/address/getUserAddressess?userId=${userId}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch addresses");
        setAddressList(data.addresses || []);
      } catch (err) {
        console.error("Error:", err.message);
      }
    };
    fetchAddresses();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/endpoints/job/createJob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, seekerId: userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create job");

      setJobStatus("Job created successfully!");

      console.log("Full API response:", data);
      console.log("Job object:", data.job);
      console.log("Job ID:", data.job?.id);

      // Send job notification to all helpers via socket
      if (socketConnected) {
        // Handle different possible response structures
        const jobId = data.jobId || data.job?.id || data.job?.job_id || data.id;

        if (!jobId) {
          console.error("No job ID found in response:", data);
          setJobStatus("Job created but notification failed - no job ID");
          return;
        }

        const jobNotification = {
          jobId: jobId, // The job ID from database
          seekerId: userId,
          jobType: formData.jobType,
          scheduledTime: formData.slot,
          seekerPhone: phone,
          message: `New ${formData.jobType} job available!`,
          createdAt: new Date().toISOString(),
        };

        console.log("Job data received:", data.job);
        console.log("Job notification to send:", jobNotification);

        socket.emit("newJobCreated", jobNotification);
        setJobStatus("Job created and sent to helpers!");
      } else {
        setJobStatus(
          "Job created but couldn't notify helpers (socket disconnected)"
        );
      }
    } catch (error) {
      console.error("Error creating job:", error.message);
      setJobStatus("Error creating job. Try again.");
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {/* Socket Status */}
      <StatusText style={{ color: socketConnected ? "green" : "red" }}>
        Socket: {socketConnected ? "🟢 Connected" : "🔴 Disconnected"}
      </StatusText>

      {jobStatus && <StatusText>{jobStatus}</StatusText>}

      <Section>
        <SectionTitle>Select Address</SectionTitle>
        <AddressList>
          {addressList.length > 0 ? (
            addressList.map((address) => (
              <AddressButton
                type="button"
                key={address.address_id}
                onClick={() =>
                  setFormData({ ...formData, addressId: address.address_id })
                }
                selected={formData.addressId === address.address_id}
              >
                {address.address_line}, {address.city}, {address.state},{" "}
                {address.landmark}, {address.pincode}
              </AddressButton>
            ))
          ) : (
            <EmptyText>No addresses found</EmptyText>
          )}
        </AddressList>

        {!addAddressMode && (
          <AddButton type="button" onClick={() => setAddAddressMode(true)}>
            + Add Address
          </AddButton>
        )}
        {addAddressMode && (
          <AddAddressModal
            userId={userId}
            onClose={() => setAddAddressMode(false)}
            onAddressAdded={(newAddress) => {
              setAddressList((prev) => [...prev, newAddress]);
              setFormData({ ...formData, addressId: newAddress.address_id });
            }}
          />
        )}
      </Section>

      <Section>
        <SectionTitle>Select Job Type</SectionTitle>
        <RadioGroup>
          {["cleaning", "cooking"].map((type) => (
            <RadioLabel key={type}>
              <input
                type="radio"
                name="jobType"
                value={type}
                checked={formData.jobType === type}
                onChange={(e) =>
                  setFormData({ ...formData, jobType: e.target.value })
                }
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </RadioLabel>
          ))}
        </RadioGroup>
      </Section>

      <Section>
        <SectionTitle>Select Schedule Slot</SectionTitle>
        <Input
          type="datetime-local"
          value={formData.slot}
          onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
          required
        />
      </Section>

      <SubmitButton type="submit">Submit</SubmitButton>
    </FormContainer>
  );
};
