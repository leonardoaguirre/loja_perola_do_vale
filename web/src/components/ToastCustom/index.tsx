import { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

interface ToastProps {
  title: string;
  content: JSX.Element;
  show: boolean;
  toggleShow: () => void;
  time?: string;
  delay?: number;
  variant?: string;
  autohide?: boolean;
  img?: JSX.Element;
}

const ToastCustom: React.FC<ToastProps> = (props) => {
  const [config, setConfig] = useState({
    title: props.title,
    content: props.content,
    show: props.show,
    toggleShow: props.toggleShow,
    time: props.time ? props.time : '',
    delay: props.delay ? props.delay : 5000,
    variant: props.variant ? props.variant : '',
    autohide: props.autohide ? props.autohide : false,
    img: props.img ? props.img : '',
  })

  useEffect(() => {
    setConfig({
      title: props.title,
      content: props.content,
      show: props.show,
      toggleShow: props.toggleShow,
      time: props.time ? props.time : '',
      delay: props.delay ? props.delay : 5000,
      variant: props.variant ? props.variant : '',
      autohide: props.autohide ? props.autohide : false,
      img: props.img ? props.img : '',
    });
  }, [props])

  return (
    <ToastContainer>
      <Toast
        show={config.show}
        onClose={config.toggleShow}
        delay={config.delay}
        autohide={config.autohide}
        bg={config.variant}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
        }}
      >
        <Toast.Header>
          {config.img}
          <strong className="me-auto">{config.title}</strong>
          <small>{config.time}</small>
        </Toast.Header>
        <Toast.Body>{config.content}</Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default ToastCustom;