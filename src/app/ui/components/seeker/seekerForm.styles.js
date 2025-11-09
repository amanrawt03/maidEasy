import styled from "styled-components";

const FormContainer = styled.form`
  max-width: 500px;
  margin: 3rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
`;

const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AddressButton = styled.button`
  border: 1px solid ${({ selected }) => (selected ? "#2563eb" : "#d1d5db")};
  border-radius: 8px;
  padding: 0.75rem;
  background: ${({ selected }) => (selected ? "#00319e" : "#2563eb")};
  text-align: left;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #1e40af;
  }
`;

const AddButton = styled.button`
  margin-top: 0.5rem;
  background: #2563eb;
  color: white;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #1e40af;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
  color : #1f2937;
`;

const Input = styled.input`
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
  width: 100%;
  color : #1f2937;
`;

const SubmitButton = styled.button`
  background: #16a34a;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 0.5rem;
  transition: background 0.25s;

  &:hover {
    background: #15803d;
  }
`;

const StatusText = styled.p`
  font-size: 0.9rem;
  color: #2563eb;
  text-align: center;
`;

const EmptyText = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
`;

export {
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
};