import styled, { keyframes } from 'styled-components';

// Define the keyframe animations
const dotAnimation = keyframes`
  0%, 80%, 100% {
    transform: scale(0.6);
  }
  40% {
    transform: scale(1);
  }
`;

// Styled components
const VerificationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #212121;
  color: #ffffff;
`;

const DotLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  & > div {
    width: 10px;
    height: 10px;
    background-color: #9e9e9e;
    border-radius: 50%;
    margin: 0 5px;
    animation: ${dotAnimation} 1.2s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: -0.4s;
    }

    &:nth-child(3) {
      animation-delay: -0.8s;
    }
  }
`;

const VerificationText = styled.p`
  font-size: 18px;
  font-weight: bold;
`;

const VerificationLoaderComponent = () => {
    return (
        <VerificationWrapper>
            <DotLoader>
                <div />
                <div />
                <div />
            </DotLoader>
            <VerificationText>Verifying the user...</VerificationText>
        </VerificationWrapper>
    );
};

export default VerificationLoaderComponent;