import styled from "styled-components";

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f9fafb;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #2563eb;
`;

const Subtitle = styled.p`
  color: #6b7280;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 20rem;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #6b7280;
`;

const Input = styled.input`
  padding: 0.6rem 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-bottom: 0.75rem;
  outline: none;
  font-size: 1rem;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
`;

const Button = styled.button`
  background: #2563eb;
  color: white;
  padding: 0.6rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: #1d4ed8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
`;

export {
  Container,
  Header,
  Title,
  Subtitle,
  Form,
  FormTitle,
  Input,
  Button,
  ErrorText,
};
