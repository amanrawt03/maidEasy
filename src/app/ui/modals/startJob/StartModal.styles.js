import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  font-family: "Inter", sans-serif;
`;

export const Header = styled.div`
  background: #2563eb;
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

export const HeaderTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.75rem;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    color: #dbeafe;
  }
`;

export const Section = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f1f1f1;
  &:last-child {
    border-bottom: none;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
`;

export const Card = styled.div`
  background: ${(props) => (props.$yellow ? "#fef9c3" : "#eff6ff")};
  padding: 1rem;
  border-radius: 8px;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

export const Label = styled.span`
  color: #4b5563;
`;

export const Value = styled.span`
  font-weight: 600;
  color: ${(props) => (props.$primary ? "#2563eb" : "#111827")};
  text-transform: capitalize;
`;

export const StatusBadge = styled.span`
  background: #dcfce7;
  color: #166534;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.8rem;
  text-transform: capitalize;
`;

export const AddressText = styled.p`
  color: #374151;
  font-size: 0.9rem;
  margin: 0.25rem 0;
`;

export const TimeText = styled.span`
  color: #ca8a04;
  font-weight: 600;
`;

export const OtpInputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
`;

export const OtpInput = styled.input`
  width: 3rem;
  height: 3rem;
  text-align: center;
  font-size: 1.25rem;
  font-weight: bold;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  transition: border 0.2s ease;

  &:focus {
    border-color: #2563eb;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
`;

export const BaseButton = styled.button`
  flex: 1;
  padding: 0.6rem 1rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled(BaseButton)`
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  &:hover {
    background: #f9fafb;
  }
`;

export const StartButton = styled(BaseButton)`
  background: #2563eb;
  color: white;
  &:hover:not(:disabled) {
    background: #1d4ed8;
  }
`;
