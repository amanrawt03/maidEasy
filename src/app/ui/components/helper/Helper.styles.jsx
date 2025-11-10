import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  font-family: "Inter", sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  h2 {
    color: #222;
    font-weight: 600;
  }
`;

const Status = styled.p`
  color: ${(props) => (props.connected ? "#28a745" : "#dc3545")};
  font-weight: 600;
`;

const Section = styled.div`
  h3 {
    color: #333;
    font-weight: 600;
    margin-bottom: 1rem;
  }
`;

const NoJobs = styled.p`
  color: #666;
  font-style: italic;
`;

const JobCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const UpcomingJobCard =  styled.div`
  position: relative;
  background: ${(props) => (props.disabled ? "#f0f0f0" : "white")};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, opacity 0.2s ease;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  &:hover {
    transform: translateY(-2px);
  }
`;

const ExpiredTag = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #dc3545;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const JobTitle = styled.h4`
  color: #222;
  font-size: 1.1rem;
  margin: 0;
`;

const Timer = styled.span`
  color: ${(props) => (props.timeLeft <= 10 ? "#dc3545" : "#ff9800")};
  font-weight: 500;
  font-size: 0.9rem;
`;

const JobDetails = styled.div`
  margin: 0.8rem 0;
  color: #555;
  p {
    margin: 0.3rem 0;
  }
  small {
    color: #888;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const BaseButton = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;

  &:hover:not(:disabled) {
    transform: scale(1.03);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const AcceptButton = styled(BaseButton)`
  background-color: ${(props) => (props.disabled ? "#adb5bd" : "#28a745")};
  color: white;
`;

const DismissButton = styled(BaseButton)`
  background-color: #dc3545;
  color: white;
`;

const ProceedButton = styled(BaseButton)`
  background-color: red;  
  color: white;
`;
export {
  Container,
  Header, 
  Status,
  Section,
  NoJobs,
  JobCard,
  JobHeader,
  JobTitle,
  Timer,
  JobDetails,
  ButtonRow,
  AcceptButton,
  DismissButton,
  ExpiredTag,
  UpcomingJobCard,
  ProceedButton,
};