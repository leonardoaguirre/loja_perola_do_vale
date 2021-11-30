import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import { BsFillCheckCircleFill } from 'react-icons/bs';

import { StepperContext } from '../../contexts/StepperContext';
import styles from './styles.module.css';

interface StepperProps {
  steps: Step[];
}

interface Step {
  title: string;
  path: string;
  icon: () => JSX.Element;
}

const Stepper: React.FC<StepperProps> = (props) => {

  const router = useRouter();

  const { currentStep } = useContext(StepperContext);

  const [step, setStep] = useState(0);

  const lineEl = useRef(null);

  const numberOfSteps: number = props.steps?.length;

  useEffect(() => {
    setStep(currentStep);
  }, [currentStep])

  useEffect(() => {
    if (lineEl) {
      let newWidth = ((100 / (numberOfSteps - 1)) * (step - 1));
      lineEl.current.style.width = `${newWidth}%`;
    }
  }, [step])

  const handleSelectedKey = (url: string) => {
    if (url) {
      router.push(`/${url}`);
    }
  }

  return (
    <div className={styles.container}>
      <Container className="px-0" fluid>
        <Row>
          <Col xs={0} sm={12} id={styles.all}>
            <div className={styles.progress}>
              <div className={styles.start}>
                <div ref={lineEl} className={styles.line}></div>
                <div className={styles.ghostLine}></div>
              </div>
            </div>
            <Nav
              className={styles.nav}
              onSelect={(selectedKey) => handleSelectedKey(selectedKey)}
            >
              {props.steps.map((step, i) => {
                return (
                  <Nav.Item key={i} style={{ 'width': `${(100 / numberOfSteps)}%` }}>
                    {((i + 1) >= currentStep ? (
                      <Nav.Link className={styles.navLink} eventKey="">
                        <div className={styles.navLinkContent}>
                          <div className={styles.imgContainer}>
                            <div className={(i + 1) == currentStep ? styles.currentStep : (i + 1) > currentStep ? styles.nextStep : styles.step}>
                              {(i + 1) >= currentStep ? step.icon() : <BsFillCheckCircleFill color="#ffffff" />}
                            </div>
                          </div>
                          <div className={(i + 1) == currentStep ? styles.currentTitle : styles.title}>{step.title}</div>
                        </div>
                      </Nav.Link>
                    ) : (
                      <Nav.Link className={styles.navLink} eventKey={step.path}>
                        <div className={styles.navLinkContent}>
                          <div className={styles.imgContainer}>
                            <div className={(i + 1) == currentStep ? styles.currentStep : (i + 1) > currentStep ? styles.nextStep : styles.step}>
                              {(i + 1) >= currentStep ? step.icon() : <BsFillCheckCircleFill color="#ffffff" />}
                            </div>
                          </div>
                          <div className={styles.title}>{step.title}</div>
                        </div>
                      </Nav.Link>
                    ))}
                  </Nav.Item>
                )
              })}
            </Nav>
          </Col>
          <Col xs={12} sm={0} md={0} lg={0} xl={0} id={styles.one}>
            <strong>{currentStep} de {props.steps.length}</strong>
            <Nav.Link className={styles.navLink} eventKey="">
              <div className={styles.navLinkContent}>
                <div className={styles.imgContainer}>
                  <div className={styles.currentStep}>
                    {currentStep ? props.steps[currentStep - 1].icon() : ''}
                  </div>
                </div>
                <div className={styles.currentTitle}>{props.steps[currentStep - 1].title}</div>
              </div>
            </Nav.Link>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Stepper;