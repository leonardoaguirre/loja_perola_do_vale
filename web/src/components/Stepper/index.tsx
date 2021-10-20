import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Nav } from 'react-bootstrap';

import { BsCardChecklist, BsFillCheckCircleFill } from 'react-icons/bs';
import { MdPayment, MdDoneOutline } from 'react-icons/md';

import styles from './styles.module.css';

interface StepperProps {
  currentStep: number;
  steps: Step[];
}

interface Step {
  title: string;
  icon: () => JSX.Element;
}

const Stepper: React.FC<StepperProps> = (props) => {

  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(props.currentStep);
  const lineEl = useRef(null);

  const numberOfSteps: number = props.steps?.length;

  useEffect(() => {
    if (lineEl) {
      let newWidth = ((100 / (numberOfSteps - 1)) * (currentStep - 1));
      lineEl.current.style.width = `${newWidth}%`;
    }
  }, [currentStep])

  const handleSelectedKey = (url: string) => {
    router.push(`http://localhost:3000/${url}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        <div className={styles.start}>
          <div ref={lineEl} className={styles.line}></div>
          <div className={styles.ghostLine}></div>
        </div>
      </div>
      <Nav
        className={styles.nav}
        activeKey="/home"
        onSelect={(selectedKey) => handleSelectedKey(selectedKey)}
      >
        {props.steps.map((step, i) => {
          return (
            <Nav.Item key={i}>
              <Nav.Link eventKey="user/cart">
                <div className={styles.navLinkContent}>
                  <div className={styles.imgContainer}>
                    <div className={(i + 1) == currentStep ? styles.currentStep : (i + 1) > currentStep ? styles.nextStep : styles.step }>
                      {(i + 1) >= currentStep ? step.icon() : <BsFillCheckCircleFill color="#fca311"/> }
                    </div>
                  </div>
                  <div className={styles.title}>{step.title}</div>
                </div>
              </Nav.Link>
            </Nav.Item>
          )
        })}
      </Nav>

      {/* <button onClick={() => setCurrentStep(currentStep + 1)}>Mais</button>
      <button onClick={() => setCurrentStep(currentStep - 1)}>Menos</button> */}
    </div>
  )
}

export default Stepper;