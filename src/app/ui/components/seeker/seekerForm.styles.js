import styled from "styled-components";

export const FormContainer = styled.form`
  max-width: 600px;
  margin: 4rem auto;
  padding: 2.5rem 2rem;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  transition: all 0.3s ease;

  @media (max-width: 640px) {
    padding: 1.5rem;
    margin: 2rem;
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

export const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const AddressButton = styled.button`
  border: 1.5px solid ${({ selected }) => (selected ? "#2563eb" : "#e5e7eb")};
  border-radius: 10px;
  padding: 1rem;
  background: ${({ selected }) => (selected ? "#eff6ff" : "#f9fafb")};
  text-align: left;
  font-size: 0.95rem;
  color: ${({ selected }) => (selected ? "#1e3a8a" : "#374151")};
  font-weight: ${({ selected }) => (selected ? 600 : 400)};
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: ${({ selected }) => (selected ? "#dbeafe" : "#f3f4f6")};
    border-color: #3b82f6;
  }
`;

export const AddButton = styled.button`
  margin-top: 0.5rem;
  background: #2563eb;
  color: #fff;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  align-self: flex-start;
  transition: background 0.25s ease, transform 0.1s ease;

  &:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #1f2937;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.5rem 0.9rem;
  cursor: pointer;
  transition: all 0.25s ease;

  input {
    accent-color: #2563eb;
  }

  &:hover {
    background: #eff6ff;
    border-color: #2563eb;
  }
`;

export const Input = styled.input`
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
  width: 100%;
  color: #1f2937;
  background: #f9fafb;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    outline: none;
  }
`;

export const SubmitButton = styled.button`
  background: #16a34a;
  color: #fff;
  padding: 0.9rem 1.2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 0.5rem;
  transition: all 0.25s ease;
  letter-spacing: 0.2px;

  &:hover {
    background: #15803d;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const StatusText = styled.p`
  font-size: 0.95rem;
  color: ${({ color }) => color || "#2563eb"};
  text-align: center;
  background: #f0f9ff;
  border-radius: 8px;
  padding: 0.4rem 0.6rem;
  font-weight: 500;
`;

export const EmptyText = styled.p`
  color: #9ca3af;
  font-size: 0.9rem;
  font-style: italic;
  padding: 0.3rem 0;
`;
