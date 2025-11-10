"use client";

import { useState } from "react";
import {
  Overlay,
  ModalCard,
  Title,
  Input,
  ButtonGroup,
  PrimaryButton,
  CancelButton,
  ErrorBox,
} from './AddressModal.styles'

export const AddAddressModal = ({ onClose, userId, onAddressAdded }) => {
  const [formData, setFormData] = useState({
    address_line: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    landmark: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddAddress = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/endpoints/address/addNewAddress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Call parent's callback to add this address instantly
        if (onAddressAdded) onAddressAdded(data.newAddress);

        // ✅ Reset & close modal
        setFormData({
          address_line: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
          landmark: "",
        });
        onClose();
      } else {
        setError(data.error || "Failed to add address");
      }
    } catch (error) {
      setError("Error adding address. Please try again.");
      console.error("Error adding address:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <ModalCard>
        <div>
          <Title>Add New Address</Title>

          {error && <ErrorBox>{error}</ErrorBox>}

          <Input
            type="text"
            value={formData.address_line}
            onChange={(e) =>
              setFormData({ ...formData, address_line: e.target.value })
            }
            placeholder="Address Line"
            required
          />

          <Input
            type="text"
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            placeholder="City"
            required
          />

          <Input
            type="text"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            placeholder="State"
            required
          />

          <Input
            type="text"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            placeholder="Country"
            required
          />

          <Input
            type="text"
            value={formData.pincode}
            onChange={(e) =>
              setFormData({ ...formData, pincode: e.target.value })
            }
            placeholder="Pincode"
            required
          />

          <Input
            type="text"
            value={formData.landmark}
            onChange={(e) =>
              setFormData({ ...formData, landmark: e.target.value })
            }
            placeholder="Landmark (Optional)"
          />

          <ButtonGroup>
            <PrimaryButton
              type="button"
              onClick={handleAddAddress}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Address"}
            </PrimaryButton>

            <CancelButton type="button" onClick={onClose} disabled={loading}>
              Cancel
            </CancelButton>
          </ButtonGroup>
        </div>
      </ModalCard>
    </Overlay>
  );
};
