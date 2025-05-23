import { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useLoading } from '../context/LoadingContext'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.5s ease;
`;

const Track = styled.div`
  width: 300px;
  height: 20px;
  background: #333;
  border-radius: 10px;
  position: relative;
  margin-top: 120px;
`;

const Progress = styled.div<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background: #4CAF50;
  border-radius: 10px;
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  position: absolute;
  top: -30px;
  color: white;
  font-family: Arial, sans-serif;
  width: 100%;
  text-align: center;
`;

const born = keyframes`
  0% { opacity: 0; transform: scale(0); }
  100% { opacity: 1; transform: scale(1); }
`;

const crawl = keyframes`
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10px); }
`;

const walkWithBackpack = keyframes`
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(15px); }
`;

const walkWithGraduationCap = keyframes`
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(20px); }
`;

const exploreWorld = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(300px); }
`;

const worldGrow = keyframes`
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.5); opacity: 1; }
  100% { transform: scale(3); opacity: 0; }
`;

const StickFigure = styled.div<{ stage: string }>`
  position: absolute;
  bottom: 50px;
  animation: ${props => {
    switch (props.stage) {
      case 'born':
        return css`${born} 1s ease forwards`;
      case 'crawling':
        return css`${crawl} 2s ease infinite`;
      case 'primarySchool':
        return css`${walkWithBackpack} 2s ease infinite`;
      case 'sixthForm':
        return css`${walkWithBackpack} 2s ease infinite`;
      case 'university':
        return css`${walkWithGraduationCap} 2s ease infinite`;
      case 'exploreWorld':
        return css`${exploreWorld} 3s linear forwards`;
      default:
        return 'none';
    }
  }};

  div {
    position: absolute;
    background: white;
  }
`;

const Head = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  bottom: 40px;
  left: -10px;
`;

const Body = styled.div`
  width: 4px;
  height: 30px;
  bottom: 10px;
  left: 0;
`;

const Arm = styled.div<{ side: 'left' | 'right' }>`
  width: 20px;
  height: 4px;
  bottom: 30px;
  left: ${props => props.side === 'left' ? '-20px' : '4px'};
  transform-origin: ${props => props.side === 'left' ? 'right' : 'left'};
  animation: ${crawl} 0.5s ease infinite;
`;

const Leg = styled(Arm)`
  bottom: 5px;
`;

const World = styled.div`
  position: absolute;
  bottom: 50px;
  left: 50%;
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, #4CAF50, #1a1a1a);
  border-radius: 50%;
  transform: translateX(-50%);
  animation: ${worldGrow} 3s ease forwards;
`;

export default function Preloader() {
  const { isLoading } = useLoading();
  const [stage, setStage] = useState<'born' | 'crawling' | 'primarySchool' | 'sixthForm' | 'university' | 'exploreWorld'>('born');

  useEffect(() => {
    if (isLoading) {
      const stages: Array<'born' | 'crawling' | 'primarySchool' | 'sixthForm' | 'university' | 'exploreWorld'> = ['born', 'crawling', 'primarySchool', 'sixthForm', 'university', 'exploreWorld'];
      let index = 0;
      const stageDuration = 60000 / stages.length; // Divide 1 minute equally among stages

      const interval = setInterval(() => {
        setStage(stages[index]);
        index++;
        if (index === stages.length) clearInterval(interval);
      }, stageDuration);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <Container>
      <Track>
        <Progress progress={isLoading ? 100 : 0} />
        <ProgressText>{isLoading ? 'Loading...' : 'Complete!'}</ProgressText>
      </Track>
      {stage === 'exploreWorld' && <World />}
      <StickFigure stage={stage}>
        <Head />
        <Body />
        <Arm side="left" />
        <Arm side="right" />
        <Leg side="left" />
        <Leg side="right" />
      </StickFigure>
    </Container>
  );
}