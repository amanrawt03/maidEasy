import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ModalCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  margin: 0 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const Title = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.8rem;
  color: #1f2937;
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  color: #dc2626;
  font-size: 0.9rem;
  padding: 0.6rem;
  border-radius: 6px;
`;

const Input = styled.input`
  padding: 0.65rem 0.8rem;
  border: 1px solid black;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s ease;
  color: black;

  &:focus {
    border-color: #2563eb;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.6rem;
  margin-top: 1rem;
`;

const PrimaryButton = styled.button`
  flex: 1;
  background: #2563eb;
  color: white;
  padding: 0.65rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.25s ease;
  &:hover {
    background: #1e40af;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(PrimaryButton)`
  background: #e5e7eb;
  color: #374151;

  &:hover {
    background: #d1d5db;
  }
`;

export {
  Overlay,
  ModalCard,
  Form,
  Title,
  ErrorBox,
  Input,
  ButtonGroup,
  PrimaryButton,
  CancelButton,
};